@file:OptIn(ExperimentalMindfulnessSessionApi::class, ExperimentalPersonalHealthRecordApi::class)

package dev.healthspec.expo

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.RemoteException
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.HealthConnectFeatures
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.changes.DeletionChange
import androidx.health.connect.client.changes.UpsertionChange
import androidx.health.connect.client.contracts.ExerciseRouteRequestContract
import androidx.health.connect.client.feature.ExperimentalMindfulnessSessionApi
import androidx.health.connect.client.feature.ExperimentalPersonalHealthRecordApi
import androidx.health.connect.client.records.ExerciseRoute
import androidx.health.connect.client.records.ExerciseRouteResult
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.records.metadata.DataOrigin
import androidx.health.connect.client.records.metadata.Metadata
import androidx.health.connect.client.request.ChangesTokenRequest
import androidx.health.connect.client.request.ReadMedicalResourcesInitialRequest
import androidx.health.connect.client.request.ReadMedicalResourcesPageRequest
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import dev.healthspec.Aggregation
import dev.healthspec.NotSupportedException
import dev.healthspec.Serialization
import dev.healthspec.generated.HealthSpecMedicalTypes
import dev.healthspec.generated.HealthSpecTypes
import dev.healthspec.generated.TypeSpec
import expo.modules.kotlin.activityresult.AppContextActivityResultContract
import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.format.DateTimeParseException
import kotlin.reflect.KClass

private const val HEALTH_CONNECT_PACKAGE = "com.google.android.apps.healthdata"

/** The Health Connect app runs on Android 9 (API 28) and later; the client library itself only needs API 26. */
private const val MIN_HEALTH_CONNECT_SDK = Build.VERSION_CODES.P

/** Health Connect's permission contract, adapted to Expo's activity-result API (inputs must be Serializable). */
private class PermissionsContract : AppContextActivityResultContract<ArrayList<String>, Set<String>> {
  private val contract = PermissionController.createRequestPermissionResultContract()
  override fun createIntent(context: Context, input: ArrayList<String>): Intent = contract.createIntent(context, input.toSet())
  override fun parseResult(input: ArrayList<String>, resultCode: Int, intent: Intent?): Set<String> = contract.parseResult(resultCode, intent)
}

/** Per-session consent for an exercise route. A declined consent yields null, not an error. */
private class RouteContract : AppContextActivityResultContract<String, ExerciseRoute?> {
  private val contract = ExerciseRouteRequestContract()
  override fun createIntent(context: Context, input: String): Intent = contract.createIntent(context, input)
  override fun parseResult(input: String, resultCode: Int, intent: Intent?): ExerciseRoute? = runCatching { contract.parseResult(resultCode, intent) }.getOrNull()
}

/**
 * Health Connect bridge. Records cross the boundary in spec shape (see Serialization.kt), so the TypeScript
 * provider stays thin. Every function rejects with an `E_*` code the TypeScript layer maps onto HealthErrorCode.
 */
class HealthSpecModule : Module() {
  private lateinit var permissionLauncher: AppContextActivityResultLauncher<ArrayList<String>, Set<String>>
  private lateinit var routeLauncher: AppContextActivityResultLauncher<String, ExerciseRoute?>

  /** System dialogs are shown one at a time; a second request waits for the first instead of failing. */
  private val dialogs = Mutex()

  private val context: Context
    get() = appContext.reactContext ?: throw CodedException("E_NOT_AVAILABLE", "React context is not available", null)

  private var cachedClient: HealthConnectClient? = null
  private val client: HealthConnectClient
    get() = cachedClient ?: HealthConnectClient.getOrCreate(context).also { cachedClient = it }

  override fun definition() = ModuleDefinition {
    Name("HealthSpec")

    RegisterActivityContracts {
      permissionLauncher = registerForActivityResult(PermissionsContract())
      routeLauncher = registerForActivityResult(RouteContract())
    }

    Function("getSdkStatus") { sdkStatus() }

    Function("packageName") { context.packageName }

    /** Which optional Health Connect features this device offers; all false when Health Connect is unavailable. */
    Function("features") { features() }

    AsyncFunction("openInstaller") Coroutine { ->
      guarded {
        val uri = Uri.parse("market://details?id=$HEALTH_CONNECT_PACKAGE&url=healthconnect%3A%2F%2Fonboarding")
        val intent = Intent(Intent.ACTION_VIEW, uri).apply {
          setPackage("com.android.vending")
          putExtra("overlay", true)
          putExtra("callerId", context.packageName)
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
      }
    }

    AsyncFunction("requestPermissions") Coroutine { permissions: List<String> ->
      guarded {
        dialogs.withLock {
          withContext(Dispatchers.Main) { permissionLauncher.launch(ArrayList(permissions)) }
        }
        // The contract reports only what this dialog granted; the caller needs the complete picture.
        client.permissionController.getGrantedPermissions().toList()
      }
    }

    AsyncFunction("getGrantedPermissions") Coroutine { ->
      guarded { client.permissionController.getGrantedPermissions().toList() }
    }

    AsyncFunction("readRecords") Coroutine { type: String, options: Map<String, Any?> ->
      guarded {
        val limit = (options["limit"] as? Number)?.toInt()
        val records = readAll(
          HealthSpecTypes.require(type),
          Serialization.instant(options["start"]),
          Serialization.instant(options["end"]),
          origins(options),
          options["ascending"] as? Boolean ?: true,
          limit,
          options["excludeManual"] as? Boolean ?: false,
        )
        if (limit != null) records.take(limit) else records
      }
    }

    AsyncFunction("aggregate") Coroutine { type: String, options: Map<String, Any?> ->
      guarded {
        val spec = HealthSpecTypes.require(type)
        Aggregation.aggregate(client, type, spec, options) { start, end, origins, excludeManual ->
          readAll(spec, start, end, origins, true, null, excludeManual)
        }
      }
    }

    /**
     * One call for the whole batch, whatever the types: Health Connect inserts a list atomically, so a failure
     * leaves nothing written (SPEC §7). Ids come back in input order; a series sample gets its flattened id.
     */
    AsyncFunction("insertRecords") Coroutine { records: List<Map<String, Any?>> ->
      guarded {
        val specs = records.map { input ->
          val type = input["type"] as? String ?: throw IllegalArgumentException("record type is required")
          val spec = HealthSpecTypes.require(type)
          if (!spec.write) throw NotSupportedException("Health Connect cannot write \"$type\"")
          type to spec
        }
        val native = records.mapIndexed { i, input -> Serialization.fromJson(specs[i].first, input) }
        val ids = client.insertRecords(native).recordIdsList
        ids.mapIndexed { i, id -> if (specs[i].second.series) Serialization.seriesId(id, 0) else id }
      }
    }

    AsyncFunction("deleteRecordsByIds") Coroutine { type: String, ids: List<String> ->
      guarded {
        deleteByIds(HealthSpecTypes.require(type), ids)
        null
      }
    }

    AsyncFunction("deleteRecordsByRange") Coroutine { type: String, start: String, end: String ->
      guarded {
        val spec = HealthSpecTypes.require(type)
        client.deleteRecords(spec.recordClass, TimeRangeFilter.between(Instant.parse(start), Instant.parse(end)))
        null
      }
    }

    AsyncFunction("getChangesToken") Coroutine { type: String ->
      guarded {
        val spec = HealthSpecTypes.require(type)
        client.getChangesToken(ChangesTokenRequest(setOf(spec.recordClass)))
      }
    }

    AsyncFunction("getChanges") Coroutine { type: String, token: String ->
      guarded {
        HealthSpecTypes.require(type)
        val upserts = mutableListOf<Map<String, Any?>>()
        val deletes = mutableListOf<String>()
        var next = token
        var expired = false
        while (true) {
          val response = client.getChanges(next)
          if (response.changesTokenExpired) {
            expired = true
            break
          }
          for (change in response.changes) {
            when (change) {
              is UpsertionChange -> upserts += Serialization.toJson(change.record)
              // A deleted series record is reported by its native id, which stands for every "<id>#n" (SPEC §8.1).
              is DeletionChange -> deletes += change.recordId
            }
          }
          next = response.nextChangesToken
          if (!response.hasMore) break
        }
        if (expired) {
          mapOf("upserts" to emptyList<Any>(), "deletes" to emptyList<Any>(), "token" to token, "expired" to true)
        } else {
          mapOf("upserts" to upserts, "deletes" to deletes, "token" to next, "expired" to false)
        }
      }
    }

    // ---------------------------------------------------------------- dedicated operations

    AsyncFunction("readRecord") Coroutine { type: String, id: String ->
      guarded {
        val spec = HealthSpecTypes.require(type)
        val (recordId, index) = Serialization.parseSeriesId(id)
        val record = readOne(spec, recordId) ?: return@guarded null
        val entries = Serialization.toJson(record)
        if (spec.series) entries.find { it["id"] == Serialization.seriesId(recordId, index ?: 0) } else entries.firstOrNull()
      }
    }

    AsyncFunction("readExerciseRoute") Coroutine { sessionId: String ->
      guarded {
        val session = client.readRecord(ExerciseSessionRecord::class, sessionId).record
        when (val result = session.exerciseRouteResult) {
          is ExerciseRouteResult.Data -> Serialization.routePoints(result.exerciseRoute)
          is ExerciseRouteResult.NoData -> null
          else -> {
            // ConsentRequired: the user approves this one session's route in a system dialog.
            val route = dialogs.withLock { withContext(Dispatchers.Main) { routeLauncher.launch(sessionId) } }
            route?.let { Serialization.routePoints(it) }
          }
        }
      }
    }

    AsyncFunction("readMedicalResources") Coroutine { type: String, options: Map<String, Any?> ->
      guarded { readMedicalResources(type, (options["limit"] as? Number)?.toInt()) }
    }

    AsyncFunction("openSettings") Coroutine { ->
      guarded {
        context.startActivity(Intent(HealthConnectClient.ACTION_HEALTH_CONNECT_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        null
      }
    }

    AsyncFunction("revokeAllPermissions") Coroutine { ->
      guarded {
        client.permissionController.revokeAllPermissions()
        null
      }
    }
  }

  // ---------------------------------------------------------------- helpers

  private suspend fun readMedicalResources(type: String, limit: Int?): List<Map<String, Any?>> {
    if (client.features.getFeatureStatus(HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD) != HealthConnectFeatures.FEATURE_STATUS_AVAILABLE) {
      throw NotSupportedException("Personal Health Record is not available on this device")
    }
    val resourceType = HealthSpecMedicalTypes.require(type)
    val out = mutableListOf<Map<String, Any?>>()
    var response = client.readMedicalResources(ReadMedicalResourcesInitialRequest(resourceType, emptySet()))
    while (true) {
      for (resource in response.medicalResources) {
        out += Serialization.medicalResourceToJson(resource)
        if (limit != null && out.size >= limit) return out
      }
      val next = response.nextPageToken ?: break
      response = client.readMedicalResources(ReadMedicalResourcesPageRequest(next))
    }
    return out
  }

  private fun sdkStatus(): String {
    if (Build.VERSION.SDK_INT < MIN_HEALTH_CONNECT_SDK) return "not_supported"
    return when (HealthConnectClient.getSdkStatus(context, HEALTH_CONNECT_PACKAGE)) {
      HealthConnectClient.SDK_AVAILABLE -> "available"
      HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> "update_required"
      // From Android 14 Health Connect is part of the system: if it is unavailable there, installing cannot help.
      else -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) "not_supported" else "not_installed"
    }
  }

  private fun features(): Map<String, Boolean> {
    val names = mapOf(
      "MINDFULNESS_SESSION" to HealthConnectFeatures.FEATURE_MINDFULNESS_SESSION,
      "SKIN_TEMPERATURE" to HealthConnectFeatures.FEATURE_SKIN_TEMPERATURE,
      "PERSONAL_HEALTH_RECORD" to HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD,
      "READ_HEALTH_DATA_IN_BACKGROUND" to HealthConnectFeatures.FEATURE_READ_HEALTH_DATA_IN_BACKGROUND,
      "READ_HEALTH_DATA_HISTORY" to HealthConnectFeatures.FEATURE_READ_HEALTH_DATA_HISTORY,
    )
    if (sdkStatus() != "available") return names.mapValues { false }
    return names.mapValues { (_, feature) ->
      runCatching { client.features.getFeatureStatus(feature) == HealthConnectFeatures.FEATURE_STATUS_AVAILABLE }.getOrDefault(false)
    }
  }

  private fun origins(options: Map<String, Any?>): Set<DataOrigin> =
    (options["apps"] as? List<*>)?.map { DataOrigin(it.toString()) }?.toSet() ?: emptySet()

  @Suppress("UNCHECKED_CAST")
  private suspend fun readOne(spec: TypeSpec, id: String): Record? = try {
    client.readRecord(spec.recordClass as KClass<Record>, id).record
  } catch (e: SecurityException) {
    throw e
  } catch (e: Exception) {
    // Health Connect reports an unknown id as an exception rather than an empty response. Which one is not
    // documented; see docs/NATIVE-VERIFICATION.md.
    if (e is IllegalArgumentException || e is NoSuchElementException) null else throw e
  }

  /**
   * Plain ids delete whole records. Flattened series ids remove single samples: the record is rewritten without
   * them, or deleted when none would remain.
   */
  private suspend fun deleteByIds(spec: TypeSpec, ids: List<String>) {
    val whole = mutableSetOf<String>()
    val samples = mutableMapOf<String, MutableSet<Int>>()
    for (id in ids) {
      val (recordId, index) = Serialization.parseSeriesId(id)
      if (spec.series && index != null) samples.getOrPut(recordId) { mutableSetOf() } += index else whole += recordId
    }
    for ((recordId, indices) in samples) {
      if (recordId in whole) continue
      val record = readOne(spec, recordId) ?: continue
      val remaining = Serialization.withoutSamples(record, indices)
      if (remaining == null) whole += recordId else client.updateRecords(listOf(remaining))
    }
    if (whole.isNotEmpty()) client.deleteRecords(spec.recordClass, whole.toList(), emptyList())
  }

  @Suppress("UNCHECKED_CAST")
  private suspend fun readAll(
    spec: TypeSpec,
    start: Instant,
    end: Instant,
    origins: Set<DataOrigin>,
    ascending: Boolean,
    limit: Int?,
    excludeManual: Boolean,
  ): List<Map<String, Any?>> {
    val recordType = spec.recordClass as KClass<Record>
    val window = Serialization.Window(start, end)
    val out = mutableListOf<Map<String, Any?>>()
    var pageToken: String? = null
    do {
      val response = client.readRecords(
        ReadRecordsRequest(
          recordType = recordType,
          timeRangeFilter = TimeRangeFilter.between(start, end),
          dataOriginFilter = origins,
          ascendingOrder = ascending,
          pageSize = (limit ?: 1000).coerceIn(1, 1000),
          pageToken = pageToken,
        ),
      )
      for (record in response.records) {
        if (excludeManual && record.metadata.recordingMethod == Metadata.RECORDING_METHOD_MANUAL_ENTRY) continue
        out += Serialization.toJson(record, if (spec.series) window else null, ascending)
      }
      pageToken = response.pageToken
    } while (pageToken != null && (limit == null || out.size < limit))
    return out
  }

  /** Runs a bridge call, rethrowing every failure as a CodedException the TypeScript layer understands. */
  private suspend fun <T> guarded(block: suspend () -> T): T = try {
    block()
  } catch (e: Throwable) {
    throw coded(e)
  }

  private fun coded(e: Throwable): CodedException = when (e) {
    is CodedException -> e
    is NotSupportedException -> CodedException("E_NOT_SUPPORTED", e.message ?: "not supported", e)
    is SecurityException -> CodedException("E_PERMISSION_DENIED", e.message ?: "permission denied", e)
    is DateTimeParseException -> CodedException("E_INVALID_ARGUMENT", e.message ?: "invalid argument", e)
    is IllegalArgumentException -> CodedException("E_INVALID_ARGUMENT", e.message ?: "invalid argument", e)
    // Health Connect throws these when the client is not initialised or the service is unavailable.
    is IllegalStateException -> CodedException("E_NOT_AVAILABLE", e.message ?: "Health Connect is unavailable", e)
    is UnsupportedOperationException -> CodedException("E_NOT_SUPPORTED", e.message ?: "not supported on this SDK level", e)
    is RemoteException -> CodedException("E_PLATFORM", e.message ?: "Health Connect service error", e)
    else -> CodedException("E_PLATFORM", e.message ?: e.toString(), e)
  }
}

package dev.healthspec.expo

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.RemoteException
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.HealthConnectFeatures
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.changes.DeletionChange
import androidx.health.connect.client.changes.UpsertionChange
import androidx.health.connect.client.records.ExerciseRouteResult
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.records.metadata.DataOrigin
import androidx.health.connect.client.records.metadata.Metadata
import androidx.health.connect.client.contracts.ExerciseRouteRequestContract
import androidx.health.connect.client.feature.ExperimentalPersonalHealthRecordApi
import androidx.health.connect.client.records.ExerciseRoute
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
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.format.DateTimeParseException
import kotlin.reflect.KClass

private const val HEALTH_CONNECT_PACKAGE = "com.google.android.apps.healthdata"
private const val PERMISSION_REQUEST_CODE = 0x4845
private const val ROUTE_REQUEST_CODE = 0x4846

/**
 * Health Connect bridge. Records cross the boundary in spec shape (see Serialization.kt), so the TypeScript
 * provider stays thin. Written before a toolchain was available — compile and device-test in Phase 1.5.
 */
class HealthSpecModule : Module() {
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
  private var pendingPermissions: Promise? = null
  private var pendingRoute: Promise? = null

  private val context
    get() = appContext.reactContext ?: throw CodedException("E_NOT_AVAILABLE", "React context is not available", null)

  private val client: HealthConnectClient
    get() = HealthConnectClient.getOrCreate(context)

  override fun definition() = ModuleDefinition {
    Name("HealthSpec")

    Function("getSdkStatus") { sdkStatus() }

    Function("packageName") { context.packageName }

    AsyncFunction("openInstaller") { promise: Promise ->
      val uri = Uri.parse("market://details?id=$HEALTH_CONNECT_PACKAGE&url=healthconnect%3A%2F%2Fonboarding")
      val intent = Intent(Intent.ACTION_VIEW, uri).apply {
        setPackage("com.android.vending")
        putExtra("overlay", true)
        putExtra("callerId", context.packageName)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(intent)
      promise.resolve(null)
    }

    AsyncFunction("requestPermissions") { permissions: List<String>, promise: Promise ->
      val activity = appContext.currentActivity ?: throw CodedException("E_NOT_AVAILABLE", "no foreground activity", null)
      if (pendingPermissions != null) throw CodedException("E_INVALID_ARGUMENT", "a permission request is already in progress", null)
      val intent = PermissionController.createRequestPermissionResultContract().createIntent(activity, permissions.toSet())
      pendingPermissions = promise
      activity.startActivityForResult(intent, PERMISSION_REQUEST_CODE)
    }

    OnActivityResult { _, payload ->
      when (payload.requestCode) {
        PERMISSION_REQUEST_CODE -> {
          val promise = pendingPermissions ?: return@OnActivityResult
          pendingPermissions = null
          launch(promise) { client.permissionController.getGrantedPermissions().toList() }
        }
        ROUTE_REQUEST_CODE -> {
          val promise = pendingRoute ?: return@OnActivityResult
          pendingRoute = null
          // The contract returns null when the user declines; that is "no route", not an error.
          val route = runCatching { ExerciseRouteRequestContract().parseResult(payload.resultCode, payload.data) }.getOrNull()
          promise.resolve(route?.let { Serialization.routePoints(it) })
        }
        else -> {}
      }
    }

    AsyncFunction("getGrantedPermissions") { promise: Promise ->
      launch(promise) { client.permissionController.getGrantedPermissions().toList() }
    }

    AsyncFunction("readRecords") { type: String, options: Map<String, Any?>, promise: Promise ->
      launch(promise) {
        val spec = HealthSpecTypes.require(type)
        val limit = (options["limit"] as? Number)?.toInt()
        val records = readAll(
          spec,
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

    AsyncFunction("aggregate") { type: String, options: Map<String, Any?>, promise: Promise ->
      launch(promise) {
        val spec = HealthSpecTypes.require(type)
        Aggregation.aggregate(client, type, spec, options) { start, end, origins, excludeManual ->
          readAll(spec, start, end, origins, true, null, excludeManual)
        }
      }
    }

    AsyncFunction("insertRecords") { type: String, records: List<Map<String, Any?>>, promise: Promise ->
      launch(promise) {
        val spec = HealthSpecTypes.require(type)
        if (!spec.write) throw NotSupportedException("Health Connect cannot write \"$type\"")
        client.insertRecords(records.map { Serialization.fromJson(type, it) }).recordIdsList
      }
    }

    AsyncFunction("deleteRecordsByIds") { type: String, ids: List<String>, promise: Promise ->
      launch(promise) {
        val spec = HealthSpecTypes.require(type)
        // Flattened series ids ("<id>#<index>") resolve back to their parent record.
        client.deleteRecords(spec.recordClass, ids.map { it.substringBefore('#') }.distinct(), emptyList())
        null
      }
    }

    AsyncFunction("deleteRecordsByRange") { type: String, start: String, end: String, promise: Promise ->
      launch(promise) {
        val spec = HealthSpecTypes.require(type)
        client.deleteRecords(spec.recordClass, TimeRangeFilter.between(Instant.parse(start), Instant.parse(end)))
        null
      }
    }

    AsyncFunction("getChangesToken") { type: String, promise: Promise ->
      launch(promise) {
        val spec = HealthSpecTypes.require(type)
        client.getChangesToken(ChangesTokenRequest(setOf(spec.recordClass)))
      }
    }

    AsyncFunction("getChanges") { type: String, token: String, promise: Promise ->
      launch(promise) {
        HealthSpecTypes.require(type)
        val upserts = mutableListOf<Map<String, Any?>>()
        val deletes = mutableListOf<String>()
        var next = token
        while (true) {
          val response = client.getChanges(next)
          if (response.changesTokenExpired) {
            return@launch mapOf("upserts" to emptyList<Any>(), "deletes" to emptyList<Any>(), "token" to token, "expired" to true)
          }
          for (change in response.changes) {
            when (change) {
              is UpsertionChange -> upserts += Serialization.toJson(change.record)
              is DeletionChange -> deletes += change.recordId
            }
          }
          next = response.nextChangesToken
          if (!response.hasMore) break
        }
        mapOf("upserts" to upserts, "deletes" to deletes, "token" to next, "expired" to false)
      }
    }

    // ---------------------------------------------------------------- dedicated operations

    AsyncFunction("readRecord") { type: String, id: String, promise: Promise ->
      launch(promise) {
        val spec = HealthSpecTypes.require(type)
        @Suppress("UNCHECKED_CAST")
        val response = client.readRecord(spec.recordClass as KClass<Record>, id)
        // A flattened series id ("<id>#<index>") resolves to its parent record, whose first entry we return.
        Serialization.toJson(response.record).firstOrNull()
      }
    }

    AsyncFunction("readExerciseRoute") { sessionId: String, promise: Promise ->
      if (pendingRoute != null) {
        promise.reject(CodedException("E_INVALID_ARGUMENT", "a route request is already in progress", null))
        return@AsyncFunction
      }
      scope.launch {
        try {
          val response = client.readRecord(ExerciseSessionRecord::class, sessionId)
          when (val result = response.record.exerciseRouteResult) {
            is ExerciseRouteResult.Data -> promise.resolve(Serialization.routePoints(result.exerciseRoute))
            is ExerciseRouteResult.NoData -> promise.resolve(null)
            else -> {
              // ConsentRequired: the user must approve this session's route in a system dialog.
              val activity = appContext.currentActivity
              if (activity == null) {
                promise.reject(CodedException("E_NOT_AVAILABLE", "no foreground activity to request route consent", null))
                return@launch
              }
              pendingRoute = promise
              activity.startActivityForResult(ExerciseRouteRequestContract().createIntent(activity, sessionId), ROUTE_REQUEST_CODE)
            }
          }
        } catch (e: Throwable) {
          pendingRoute = null
          promise.reject(coded(e))
        }
      }
    }

    AsyncFunction("readMedicalResources") { type: String, options: Map<String, Any?>, promise: Promise ->
      launch(promise) { readMedicalResources(type, (options["limit"] as? Number)?.toInt()) }
    }

    AsyncFunction("openSettings") { promise: Promise ->
      val intent = Intent(HealthConnectClient.ACTION_HEALTH_CONNECT_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      try {
        context.startActivity(intent)
        promise.resolve(null)
      } catch (e: Throwable) {
        promise.reject(coded(e))
      }
    }

    AsyncFunction("revokeAllPermissions") { promise: Promise ->
      launch(promise) {
        client.permissionController.revokeAllPermissions()
        null
      }
    }

    OnDestroy {
      scope.cancel()
    }
  }

  // ---------------------------------------------------------------- helpers

  /**
   * Personal Health Record resources, paged. Kotlin cannot annotate a DSL expression, so the experimental
   * API opt-in lives here rather than at the AsyncFunction call site.
   */
  @OptIn(ExperimentalPersonalHealthRecordApi::class)
  private suspend fun readMedicalResources(type: String, limit: Int?): List<Map<String, Any?>> {
    if (client.features.getFeatureStatus(HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD) != HealthConnectFeatures.FEATURE_STATUS_AVAILABLE) {
      throw NotSupportedException("Personal Health Record is not available on this device")
    }
    val resourceType = HealthSpecMedicalTypes.require(type)
    val out = mutableListOf<Map<String, Any?>>()
    var response = client.readMedicalResources(ReadMedicalResourcesInitialRequest(medicalResourceType = resourceType))
    while (true) {
      for (resource in response.medicalResources) {
        out += Serialization.medicalResourceToJson(resource, type)
        if (limit != null && out.size >= limit) return out
      }
      val next = response.nextPageToken ?: break
      response = client.readMedicalResources(ReadMedicalResourcesPageRequest(next))
    }
    return out
  }

  private fun sdkStatus(): String = when (HealthConnectClient.getSdkStatus(context, HEALTH_CONNECT_PACKAGE)) {
    HealthConnectClient.SDK_AVAILABLE -> "available"
    HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> "update_required"
    else -> if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) "not_supported" else "not_installed"
  }

  private fun origins(options: Map<String, Any?>): Set<DataOrigin> =
    (options["apps"] as? List<*>)?.map { DataOrigin(it.toString()) }?.toSet() ?: emptySet()

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
        out += Serialization.toJson(record)
      }
      pageToken = response.pageToken
    } while (pageToken != null && (limit == null || out.size < limit))
    return out
  }

  private fun <T> launch(promise: Promise, block: suspend () -> T) {
    scope.launch {
      try {
        promise.resolve(block())
      } catch (e: Throwable) {
        promise.reject(coded(e))
      }
    }
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

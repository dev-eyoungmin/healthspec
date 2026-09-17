@file:OptIn(ExperimentalMindfulnessSessionApi::class, ExperimentalPersonalHealthRecordApi::class)

package dev.healthspec

import androidx.health.connect.client.feature.ExperimentalMindfulnessSessionApi
import androidx.health.connect.client.feature.ExperimentalPersonalHealthRecordApi
import androidx.health.connect.client.records.ActiveCaloriesBurnedRecord
import androidx.health.connect.client.records.BasalBodyTemperatureRecord
import androidx.health.connect.client.records.BasalMetabolicRateRecord
import androidx.health.connect.client.records.BloodGlucoseRecord
import androidx.health.connect.client.records.BloodPressureRecord
import androidx.health.connect.client.records.BodyFatRecord
import androidx.health.connect.client.records.BodyTemperatureMeasurementLocation
import androidx.health.connect.client.records.BodyTemperatureRecord
import androidx.health.connect.client.records.BodyWaterMassRecord
import androidx.health.connect.client.records.BoneMassRecord
import androidx.health.connect.client.records.CervicalMucusRecord
import androidx.health.connect.client.records.CyclingPedalingCadenceRecord
import androidx.health.connect.client.records.DistanceRecord
import androidx.health.connect.client.records.ElevationGainedRecord
import androidx.health.connect.client.records.ExerciseRoute
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.FhirResource
import androidx.health.connect.client.records.FloorsClimbedRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord
import androidx.health.connect.client.records.HeightRecord
import androidx.health.connect.client.records.HydrationRecord
import androidx.health.connect.client.records.IntermenstrualBleedingRecord
import androidx.health.connect.client.records.LeanBodyMassRecord
import androidx.health.connect.client.records.MealType
import androidx.health.connect.client.records.MedicalResource
import androidx.health.connect.client.records.MenstruationFlowRecord
import androidx.health.connect.client.records.MenstruationPeriodRecord
import androidx.health.connect.client.records.MindfulnessSessionRecord
import androidx.health.connect.client.records.NutritionRecord
import androidx.health.connect.client.records.OvulationTestRecord
import androidx.health.connect.client.records.OxygenSaturationRecord
import androidx.health.connect.client.records.PowerRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.records.RespiratoryRateRecord
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.SexualActivityRecord
import androidx.health.connect.client.records.SkinTemperatureRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.SpeedRecord
import androidx.health.connect.client.records.StepsCadenceRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.TotalCaloriesBurnedRecord
import androidx.health.connect.client.records.Vo2MaxRecord
import androidx.health.connect.client.records.WeightRecord
import androidx.health.connect.client.records.WheelchairPushesRecord
import androidx.health.connect.client.records.metadata.Device
import androidx.health.connect.client.records.metadata.Metadata
import androidx.health.connect.client.units.BloodGlucose
import androidx.health.connect.client.units.Energy
import androidx.health.connect.client.units.Length
import androidx.health.connect.client.units.Mass
import androidx.health.connect.client.units.Percentage
import androidx.health.connect.client.units.Power
import androidx.health.connect.client.units.Pressure
import androidx.health.connect.client.units.Temperature
import androidx.health.connect.client.units.TemperatureDelta
import androidx.health.connect.client.units.Velocity
import androidx.health.connect.client.units.Volume
import dev.healthspec.generated.HealthSpecEnums
import dev.healthspec.generated.HealthSpecNutrition
import java.time.Instant
import java.time.ZoneOffset

/** Raised when the spec asks for something Health Connect cannot do. */
class NotSupportedException(message: String) : Exception(message)

/**
 * Health Connect records ↔ the spec-shaped maps in libraries/expo-health/src/native.ts (HCRecord / HCInsertRecord).
 *
 * Series records (heart rate, cadence, power, speed, skin temperature) hold many samples; the spec exposes one
 * record per sample with id `<recordId>#<index>` (SPEC §5.3). [seriesId] and [parseSeriesId] are the only
 * places that format is spelled out.
 */
object Serialization {

  /** Half-open instant window [start, end), used to clip flattened series samples to a query range. */
  data class Window(val start: Instant, val end: Instant) {
    fun contains(t: Instant): Boolean = !t.isBefore(start) && t.isBefore(end)
  }

  /**
   * Written series samples become one native record each. Health Connect requires a series record to span a
   * non-empty interval that contains its samples, while a spec sample has start == end; the native record
   * therefore ends this long after its only sample.
   */
  private val SERIES_SPAN: java.time.Duration = java.time.Duration.ofMillis(1)

  const val CLIENT_RECORD_ID = "hc.clientRecordId"
  const val CLIENT_RECORD_VERSION = "hc.clientRecordVersion"

  fun seriesId(recordId: String, index: Int): String = "$recordId#$index"

  /** `<recordId>#<index>` → (recordId, index); a plain id → (id, null). */
  fun parseSeriesId(id: String): Pair<String, Int?> {
    val hash = id.lastIndexOf('#')
    if (hash < 0) return id to null
    val index = id.substring(hash + 1).toIntOrNull() ?: return id to null
    return id.substring(0, hash) to index
  }

  // ---------------------------------------------------------------- enums defined inline in the type schemas

  private val bodyPosition = mapOf(
    "standing_up" to BloodPressureRecord.BODY_POSITION_STANDING_UP,
    "sitting_down" to BloodPressureRecord.BODY_POSITION_SITTING_DOWN,
    "lying_down" to BloodPressureRecord.BODY_POSITION_LYING_DOWN,
    "reclining" to BloodPressureRecord.BODY_POSITION_RECLINING,
    "unknown" to BloodPressureRecord.BODY_POSITION_UNKNOWN,
  )
  private val bpLocation = mapOf(
    "left_wrist" to BloodPressureRecord.MEASUREMENT_LOCATION_LEFT_WRIST,
    "right_wrist" to BloodPressureRecord.MEASUREMENT_LOCATION_RIGHT_WRIST,
    "left_upper_arm" to BloodPressureRecord.MEASUREMENT_LOCATION_LEFT_UPPER_ARM,
    "right_upper_arm" to BloodPressureRecord.MEASUREMENT_LOCATION_RIGHT_UPPER_ARM,
    "unknown" to BloodPressureRecord.MEASUREMENT_LOCATION_UNKNOWN,
  )
  private val specimenSource = mapOf(
    "interstitial_fluid" to BloodGlucoseRecord.SPECIMEN_SOURCE_INTERSTITIAL_FLUID,
    "capillary_blood" to BloodGlucoseRecord.SPECIMEN_SOURCE_CAPILLARY_BLOOD,
    "plasma" to BloodGlucoseRecord.SPECIMEN_SOURCE_PLASMA,
    "serum" to BloodGlucoseRecord.SPECIMEN_SOURCE_SERUM,
    "tears" to BloodGlucoseRecord.SPECIMEN_SOURCE_TEARS,
    "whole_blood" to BloodGlucoseRecord.SPECIMEN_SOURCE_WHOLE_BLOOD,
    "unknown" to BloodGlucoseRecord.SPECIMEN_SOURCE_UNKNOWN,
  )
  private val relationToMeal = mapOf(
    "general" to BloodGlucoseRecord.RELATION_TO_MEAL_GENERAL,
    "fasting" to BloodGlucoseRecord.RELATION_TO_MEAL_FASTING,
    "before_meal" to BloodGlucoseRecord.RELATION_TO_MEAL_BEFORE_MEAL,
    "after_meal" to BloodGlucoseRecord.RELATION_TO_MEAL_AFTER_MEAL,
    "unknown" to BloodGlucoseRecord.RELATION_TO_MEAL_UNKNOWN,
  )
  private val bodyTemperatureLocation = mapOf(
    "armpit" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_ARMPIT,
    "finger" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_FINGER,
    "forehead" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_FOREHEAD,
    "mouth" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_MOUTH,
    "rectum" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_RECTUM,
    "temporal_artery" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_TEMPORAL_ARTERY,
    "toe" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_TOE,
    "ear" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_EAR,
    "wrist" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_WRIST,
    "vagina" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_VAGINA,
    "unknown" to BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_UNKNOWN,
  )
  private val skinLocation = mapOf(
    "finger" to SkinTemperatureRecord.MEASUREMENT_LOCATION_FINGER,
    "toe" to SkinTemperatureRecord.MEASUREMENT_LOCATION_TOE,
    "wrist" to SkinTemperatureRecord.MEASUREMENT_LOCATION_WRIST,
    "unknown" to SkinTemperatureRecord.MEASUREMENT_LOCATION_UNKNOWN,
  )
  private val vo2Method = mapOf(
    "metabolic_cart" to Vo2MaxRecord.MEASUREMENT_METHOD_METABOLIC_CART,
    "heart_rate_ratio" to Vo2MaxRecord.MEASUREMENT_METHOD_HEART_RATE_RATIO,
    "cooper_test" to Vo2MaxRecord.MEASUREMENT_METHOD_COOPER_TEST,
    "multistage_fitness_test" to Vo2MaxRecord.MEASUREMENT_METHOD_MULTISTAGE_FITNESS_TEST,
    "rockport_fitness_test" to Vo2MaxRecord.MEASUREMENT_METHOD_ROCKPORT_FITNESS_TEST,
    "other" to Vo2MaxRecord.MEASUREMENT_METHOD_OTHER,
  )
  /** Health Connect has no "other" session type; the spec's "other" is written as UNKNOWN and UNKNOWN is read back as absent. */
  private val mindfulnessType = mapOf(
    "meditation" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_MEDITATION,
    "breathing" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_BREATHING,
    "movement" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_MOVEMENT,
    "music" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_MUSIC,
    "unguided" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_UNGUIDED,
  )
  private val menstruationFlow = mapOf(
    "unknown" to MenstruationFlowRecord.FLOW_UNKNOWN,
    "light" to MenstruationFlowRecord.FLOW_LIGHT,
    "medium" to MenstruationFlowRecord.FLOW_MEDIUM,
    "heavy" to MenstruationFlowRecord.FLOW_HEAVY,
  )
  private val ovulationResult = mapOf(
    "negative" to OvulationTestRecord.RESULT_NEGATIVE,
    "positive" to OvulationTestRecord.RESULT_POSITIVE,
    "high" to OvulationTestRecord.RESULT_HIGH,
    "inconclusive" to OvulationTestRecord.RESULT_INCONCLUSIVE,
  )
  private val mucusAppearance = mapOf(
    "dry" to CervicalMucusRecord.APPEARANCE_DRY,
    "sticky" to CervicalMucusRecord.APPEARANCE_STICKY,
    "creamy" to CervicalMucusRecord.APPEARANCE_CREAMY,
    "watery" to CervicalMucusRecord.APPEARANCE_WATERY,
    "egg_white" to CervicalMucusRecord.APPEARANCE_EGG_WHITE,
    "unusual" to CervicalMucusRecord.APPEARANCE_UNUSUAL,
    "unknown" to CervicalMucusRecord.APPEARANCE_UNKNOWN,
  )
  private val mucusSensation = mapOf(
    "light" to CervicalMucusRecord.SENSATION_LIGHT,
    "medium" to CervicalMucusRecord.SENSATION_MEDIUM,
    "heavy" to CervicalMucusRecord.SENSATION_HEAVY,
    "unknown" to CervicalMucusRecord.SENSATION_UNKNOWN,
  )
  private val protectionUsed = mapOf(
    "protected" to SexualActivityRecord.PROTECTION_USED_PROTECTED,
    "unprotected" to SexualActivityRecord.PROTECTION_USED_UNPROTECTED,
    "unknown" to SexualActivityRecord.PROTECTION_USED_UNKNOWN,
  )

  private fun <V> Map<String, V>.inverse(): Map<V, String> = entries.associate { (k, v) -> v to k }
  private val menstruationFlowById = menstruationFlow.inverse()
  private val ovulationResultById = ovulationResult.inverse()
  private val mucusAppearanceById = mucusAppearance.inverse()
  private val mucusSensationById = mucusSensation.inverse()
  private val protectionUsedById = protectionUsed.inverse()
  private val bodyPositionById = bodyPosition.inverse()
  private val bpLocationById = bpLocation.inverse()
  private val specimenSourceById = specimenSource.inverse()
  private val relationToMealById = relationToMeal.inverse()
  private val bodyTemperatureLocationById = bodyTemperatureLocation.inverse()
  private val skinLocationById = skinLocation.inverse()
  private val vo2MethodById = vo2Method.inverse()
  private val mindfulnessTypeById = mindfulnessType.inverse()

  private val recordingMethods = mapOf(
    Metadata.RECORDING_METHOD_MANUAL_ENTRY to "manual",
    Metadata.RECORDING_METHOD_AUTOMATICALLY_RECORDED to "automatic",
    Metadata.RECORDING_METHOD_ACTIVELY_RECORDED to "active",
  )

  // ---------------------------------------------------------------- helpers

  private fun offsetString(offset: ZoneOffset?): String? = offset?.let { if (it.totalSeconds == 0) "+00:00" else it.id }

  private fun parseOffset(value: Any?): ZoneOffset? = (value as? String)?.let { runCatching { ZoneOffset.of(it) }.getOrNull() }

  fun instant(value: Any?): Instant = Instant.parse(value as? String ?: throw IllegalArgumentException("missing instant"))

  private fun num(map: Map<String, Any?>, key: String): Double? = (map[key] as? Number)?.toDouble()

  private fun str(map: Map<String, Any?>, key: String): String? = map[key] as? String

  private fun sourceOf(metadata: Metadata): Map<String, Any?> {
    val device = metadata.device
    return mapOf(
      "app" to mapOf("id" to metadata.dataOrigin.packageName),
      "device" to device?.let {
        mapOf(
          "manufacturer" to it.manufacturer,
          "model" to it.model,
          "type" to (HealthSpecEnums.deviceTypeById[it.type] ?: "unknown"),
        ).filterValues { v -> v != null }
      },
      "recordingMethod" to (recordingMethods[metadata.recordingMethod] ?: "unknown"),
    ).filterValues { it != null }
  }

  private fun envelope(record: Record, id: String, start: Instant, end: Instant, offset: ZoneOffset?, value: Map<String, Any?>): Map<String, Any?> {
    val extra = mutableMapOf("hc.record" to record::class.simpleName.orEmpty())
    record.metadata.clientRecordId?.let {
      extra[CLIENT_RECORD_ID] = it
      extra[CLIENT_RECORD_VERSION] = record.metadata.clientRecordVersion.toString()
    }
    extra["hc.lastModified"] = record.metadata.lastModifiedTime.toString()
    return mapOf(
      "id" to id,
      "start" to start.toString(),
      "end" to end.toString(),
      "zoneOffset" to offsetString(offset),
      "value" to value,
      "source" to sourceOf(record.metadata),
      "metadata" to extra,
    ).filterValues { it != null }
  }

  private fun interval(record: Record, start: Instant, end: Instant, offset: ZoneOffset?, value: Map<String, Any?>) =
    listOf(envelope(record, record.metadata.id, start, end, offset, value))

  private fun instantaneous(record: Record, time: Instant, offset: ZoneOffset?, value: Map<String, Any?>) =
    listOf(envelope(record, record.metadata.id, time, time, offset, value))

  /** One sample record per series element inside [window]; ids keep the element's index in the native record. */
  private fun <S> series(
    record: Record,
    samples: List<S>,
    offset: ZoneOffset?,
    window: Window?,
    ascending: Boolean,
    time: (S) -> Instant,
    value: (S) -> Map<String, Any?>,
  ): List<Map<String, Any?>> {
    val out = samples.mapIndexedNotNull { index, sample ->
      val t = time(sample)
      if (window != null && !window.contains(t)) null else envelope(record, seriesId(record.metadata.id, index), t, t, offset, value(sample))
    }
    return if (ascending) out else out.asReversed()
  }

  // ---------------------------------------------------------------- Record → JSON

  /**
   * Spec-shaped maps for one native record. Series records flatten to one entry per sample; [window] drops
   * samples outside a query range, and [ascending] orders them like the enclosing query.
   */
  fun toJson(record: Record, window: Window? = null, ascending: Boolean = true): List<Map<String, Any?>> = when (record) {
    is StepsRecord -> interval(record, record.startTime, record.endTime, record.startZoneOffset, mapOf("count" to record.count))
    is DistanceRecord -> interval(record, record.startTime, record.endTime, record.startZoneOffset, mapOf("meters" to record.distance.inMeters))
    is ActiveCaloriesBurnedRecord -> interval(record, record.startTime, record.endTime, record.startZoneOffset, mapOf("kilocalories" to record.energy.inKilocalories))
    is TotalCaloriesBurnedRecord -> interval(record, record.startTime, record.endTime, record.startZoneOffset, mapOf("kilocalories" to record.energy.inKilocalories))
    is FloorsClimbedRecord -> interval(record, record.startTime, record.endTime, record.startZoneOffset, mapOf("count" to record.floors))
    is WheelchairPushesRecord -> interval(record, record.startTime, record.endTime, record.startZoneOffset, mapOf("count" to record.count))
    is ExerciseSessionRecord -> interval(
      record, record.startTime, record.endTime, record.startZoneOffset,
      mapOf(
        "activity" to (HealthSpecEnums.exerciseTypeById[record.exerciseType] ?: "other"),
        "title" to record.title,
        "notes" to record.notes,
      ).filterValues { it != null },
    )
    is Vo2MaxRecord -> instantaneous(
      record, record.time, record.zoneOffset,
      mapOf("mlPerKgPerMin" to record.vo2MillilitersPerMinuteKilogram, "measurementMethod" to vo2MethodById[record.measurementMethod]).filterValues { it != null },
    )
    is HeartRateRecord -> series(record, record.samples, record.startZoneOffset, window, ascending, { it.time }) { mapOf("bpm" to it.beatsPerMinute) }
    is RestingHeartRateRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("bpm" to record.beatsPerMinute))
    is HeartRateVariabilityRmssdRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("milliseconds" to record.heartRateVariabilityMillis))
    is OxygenSaturationRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("percent" to record.percentage.value))
    is RespiratoryRateRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("breathsPerMinute" to record.rate))
    is BodyTemperatureRecord -> instantaneous(
      record, record.time, record.zoneOffset,
      mapOf("celsius" to record.temperature.inCelsius, "measurementLocation" to bodyTemperatureLocationById[record.measurementLocation]).filterValues { it != null },
    )
    is SkinTemperatureRecord -> series(record, record.deltas, record.startZoneOffset, window, ascending, { it.time }) { delta ->
      mapOf(
        "deltaCelsius" to delta.delta.inCelsius,
        "baselineCelsius" to record.baseline?.inCelsius,
        "measurementLocation" to skinLocationById[record.measurementLocation],
      ).filterValues { it != null }
    }
    is BloodPressureRecord -> instantaneous(
      record, record.time, record.zoneOffset,
      mapOf(
        "systolicMmHg" to record.systolic.inMillimetersOfMercury,
        "diastolicMmHg" to record.diastolic.inMillimetersOfMercury,
        "bodyPosition" to bodyPositionById[record.bodyPosition],
        "measurementLocation" to bpLocationById[record.measurementLocation],
      ).filterValues { it != null },
    )
    is BloodGlucoseRecord -> instantaneous(
      record, record.time, record.zoneOffset,
      mapOf(
        "millimolesPerLiter" to record.level.inMillimolesPerLiter,
        "specimenSource" to specimenSourceById[record.specimenSource],
        "mealType" to HealthSpecEnums.mealTypeById[record.mealType],
        "relationToMeal" to relationToMealById[record.relationToMeal],
      ).filterValues { it != null },
    )
    is WeightRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("kilograms" to record.weight.inKilograms))
    is HeightRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("meters" to record.height.inMeters))
    is BodyFatRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("percent" to record.percentage.value))
    is LeanBodyMassRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("kilograms" to record.mass.inKilograms))
    is SleepSessionRecord -> interval(
      record, record.startTime, record.endTime, record.startZoneOffset,
      mapOf(
        "stages" to record.stages.map { stage ->
          mapOf(
            "stage" to (HealthSpecEnums.sleepStageById[stage.stage] ?: "unknown"),
            "start" to stage.startTime.toString(),
            "end" to stage.endTime.toString(),
          )
        },
        "title" to record.title,
        "notes" to record.notes,
      ).filterValues { it != null },
    )
    is HydrationRecord -> interval(record, record.startTime, record.endTime, record.startZoneOffset, mapOf("liters" to record.volume.inLiters))
    is NutritionRecord -> interval(
      record, record.startTime, record.endTime, record.startZoneOffset,
      HealthSpecNutrition.nutrients(record) + mapOf("mealType" to HealthSpecEnums.mealTypeById[record.mealType], "name" to record.name).filterValues { it != null },
    )
    is MindfulnessSessionRecord -> interval(
      record, record.startTime, record.endTime, record.startZoneOffset,
      mapOf(
        "sessionType" to mindfulnessTypeById[record.mindfulnessSessionType],
        "title" to record.title,
        "notes" to record.notes,
      ).filterValues { it != null },
    )
    is MenstruationFlowRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("flow" to (menstruationFlowById[record.flow] ?: "unknown")))
    is MenstruationPeriodRecord -> interval(record, record.startTime, record.endTime, record.startZoneOffset, emptyMap())
    is OvulationTestRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("result" to (ovulationResultById[record.result] ?: "inconclusive")))
    is CervicalMucusRecord -> instantaneous(
      record, record.time, record.zoneOffset,
      mapOf("appearance" to mucusAppearanceById[record.appearance], "sensation" to mucusSensationById[record.sensation]).filterValues { it != null },
    )
    is IntermenstrualBleedingRecord -> instantaneous(record, record.time, record.zoneOffset, emptyMap())
    is SexualActivityRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("protectionUsed" to protectionUsedById[record.protectionUsed]).filterValues { it != null })
    is BasalBodyTemperatureRecord -> instantaneous(
      record, record.time, record.zoneOffset,
      mapOf("celsius" to record.temperature.inCelsius, "measurementLocation" to bodyTemperatureLocationById[record.measurementLocation]).filterValues { it != null },
    )
    is BasalMetabolicRateRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("kilocaloriesPerDay" to record.basalMetabolicRate.inKilocaloriesPerDay))
    is BodyWaterMassRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("kilograms" to record.mass.inKilograms))
    is BoneMassRecord -> instantaneous(record, record.time, record.zoneOffset, mapOf("kilograms" to record.mass.inKilograms))
    is CyclingPedalingCadenceRecord -> series(record, record.samples, record.startZoneOffset, window, ascending, { it.time }) { mapOf("rpm" to it.revolutionsPerMinute) }
    is StepsCadenceRecord -> series(record, record.samples, record.startZoneOffset, window, ascending, { it.time }) { mapOf("stepsPerMinute" to it.rate) }
    is ElevationGainedRecord -> interval(record, record.startTime, record.endTime, record.startZoneOffset, mapOf("meters" to record.elevation.inMeters))
    is PowerRecord -> series(record, record.samples, record.startZoneOffset, window, ascending, { it.time }) { mapOf("watts" to it.power.inWatts) }
    is SpeedRecord -> series(record, record.samples, record.startZoneOffset, window, ascending, { it.time }) { mapOf("metersPerSecond" to it.speed.inMetersPerSecond) }
    else -> throw IllegalArgumentException("unsupported record ${record::class.simpleName}")
  }

  /**
   * The same series record without the samples at [indices], for deleting individual flattened samples.
   * Returns null when nothing would remain (delete the record instead). The record's metadata, and so its id,
   * is kept so the result can be passed to `updateRecords`.
   */
  fun withoutSamples(record: Record, indices: Set<Int>): Record? {
    fun <S> keep(samples: List<S>): List<S> = samples.filterIndexed { i, _ -> i !in indices }
    return when (record) {
      is HeartRateRecord -> keep(record.samples).takeIf { it.isNotEmpty() }?.let {
        HeartRateRecord(record.startTime, record.startZoneOffset, record.endTime, record.endZoneOffset, it, record.metadata)
      }
      is CyclingPedalingCadenceRecord -> keep(record.samples).takeIf { it.isNotEmpty() }?.let {
        CyclingPedalingCadenceRecord(record.startTime, record.startZoneOffset, record.endTime, record.endZoneOffset, it, record.metadata)
      }
      is StepsCadenceRecord -> keep(record.samples).takeIf { it.isNotEmpty() }?.let {
        StepsCadenceRecord(record.startTime, record.startZoneOffset, record.endTime, record.endZoneOffset, it, record.metadata)
      }
      is PowerRecord -> keep(record.samples).takeIf { it.isNotEmpty() }?.let {
        PowerRecord(record.startTime, record.startZoneOffset, record.endTime, record.endZoneOffset, it, record.metadata)
      }
      is SpeedRecord -> keep(record.samples).takeIf { it.isNotEmpty() }?.let {
        SpeedRecord(record.startTime, record.startZoneOffset, record.endTime, record.endZoneOffset, it, record.metadata)
      }
      is SkinTemperatureRecord -> keep(record.deltas).takeIf { it.isNotEmpty() }?.let {
        SkinTemperatureRecord(
          startTime = record.startTime,
          startZoneOffset = record.startZoneOffset,
          endTime = record.endTime,
          endZoneOffset = record.endZoneOffset,
          metadata = record.metadata,
          deltas = it,
          baseline = record.baseline,
          measurementLocation = record.measurementLocation,
        )
      }
      else -> throw IllegalArgumentException("${record::class.simpleName} is not a series record")
    }
  }

  // ---------------------------------------------------------------- JSON → Record (writes)

  private fun deviceOf(input: Map<String, Any?>): Device? {
    val device = input["device"] as? Map<*, *> ?: return null
    return Device(
      type = HealthSpecEnums.deviceType[device["type"] as? String ?: ""] ?: Device.TYPE_UNKNOWN,
      manufacturer = device["manufacturer"] as? String,
      model = device["model"] as? String,
    )
  }

  /**
   * Health Connect requires a device for automatically and actively recorded data; the phone running the app is
   * the honest default when the caller did not name one.
   */
  private fun metadataOf(input: Map<String, Any?>): Metadata {
    val extra = input["metadata"] as? Map<*, *>
    val clientRecordId = extra?.get(CLIENT_RECORD_ID) as? String
    val clientRecordVersion = (extra?.get(CLIENT_RECORD_VERSION) as? String)?.toLongOrNull() ?: 0L
    val device = deviceOf(input)
    return when (input["recordingMethod"] as? String) {
      "automatic" -> {
        val d = device ?: Device(type = Device.TYPE_PHONE)
        if (clientRecordId != null) Metadata.autoRecorded(d, clientRecordId, clientRecordVersion) else Metadata.autoRecorded(d)
      }
      "active" -> {
        val d = device ?: Device(type = Device.TYPE_PHONE)
        if (clientRecordId != null) Metadata.activelyRecorded(d, clientRecordId, clientRecordVersion) else Metadata.activelyRecorded(d)
      }
      "unknown" ->
        if (clientRecordId != null) Metadata.unknownRecordingMethod(clientRecordId, clientRecordVersion, device) else Metadata.unknownRecordingMethod(device)
      else ->
        if (clientRecordId != null) Metadata.manualEntry(clientRecordId, clientRecordVersion, device) else Metadata.manualEntry(device)
    }
  }

  @Suppress("UNCHECKED_CAST")
  fun fromJson(type: String, input: Map<String, Any?>): Record {
    val value = input["value"] as? Map<String, Any?> ?: throw IllegalArgumentException("record value must be an object")
    val start = instant(input["start"])
    val end = instant(input["end"])
    val offset = parseOffset(input["zoneOffset"])
    val metadata = metadataOf(input)
    val seriesEnd = start.plus(SERIES_SPAN)
    fun req(key: String): Double = num(value, key) ?: throw IllegalArgumentException("$type.$key is required")
    fun enum(map: Map<String, Int>, key: String, default: Int): Int = str(value, key)?.let { map[it] } ?: default

    return when (type) {
      "steps" -> StepsRecord(startTime = start, startZoneOffset = offset, endTime = end, endZoneOffset = offset, count = req("count").toLong(), metadata = metadata)
      "distance" -> DistanceRecord(startTime = start, startZoneOffset = offset, endTime = end, endZoneOffset = offset, distance = Length.meters(req("meters")), metadata = metadata)
      "active_energy" -> ActiveCaloriesBurnedRecord(startTime = start, startZoneOffset = offset, endTime = end, endZoneOffset = offset, energy = Energy.kilocalories(req("kilocalories")), metadata = metadata)
      "total_energy" -> TotalCaloriesBurnedRecord(startTime = start, startZoneOffset = offset, endTime = end, endZoneOffset = offset, energy = Energy.kilocalories(req("kilocalories")), metadata = metadata)
      "floors_climbed" -> FloorsClimbedRecord(startTime = start, startZoneOffset = offset, endTime = end, endZoneOffset = offset, floors = req("count"), metadata = metadata)
      "wheelchair_pushes" -> WheelchairPushesRecord(startTime = start, startZoneOffset = offset, endTime = end, endZoneOffset = offset, count = req("count").toLong(), metadata = metadata)
      "exercise_session" -> ExerciseSessionRecord(
        startTime = start,
        startZoneOffset = offset,
        endTime = end,
        endZoneOffset = offset,
        metadata = metadata,
        exerciseType = enum(HealthSpecEnums.exerciseType, "activity", ExerciseSessionRecord.EXERCISE_TYPE_OTHER_WORKOUT),
        title = str(value, "title"),
        notes = str(value, "notes"),
      )
      "vo2_max" -> Vo2MaxRecord(
        time = start,
        zoneOffset = offset,
        metadata = metadata,
        vo2MillilitersPerMinuteKilogram = req("mlPerKgPerMin"),
        measurementMethod = enum(vo2Method, "measurementMethod", Vo2MaxRecord.MEASUREMENT_METHOD_OTHER),
      )
      "heart_rate" -> HeartRateRecord(
        startTime = start, startZoneOffset = offset, endTime = seriesEnd, endZoneOffset = offset,
        samples = listOf(HeartRateRecord.Sample(time = start, beatsPerMinute = req("bpm").toLong())),
        metadata = metadata,
      )
      "resting_heart_rate" -> RestingHeartRateRecord(time = start, zoneOffset = offset, beatsPerMinute = req("bpm").toLong(), metadata = metadata)
      "hrv_rmssd" -> HeartRateVariabilityRmssdRecord(time = start, zoneOffset = offset, heartRateVariabilityMillis = req("milliseconds"), metadata = metadata)
      "oxygen_saturation" -> OxygenSaturationRecord(time = start, zoneOffset = offset, percentage = Percentage(req("percent")), metadata = metadata)
      "respiratory_rate" -> RespiratoryRateRecord(time = start, zoneOffset = offset, rate = req("breathsPerMinute"), metadata = metadata)
      "body_temperature" -> BodyTemperatureRecord(
        time = start,
        zoneOffset = offset,
        metadata = metadata,
        temperature = Temperature.celsius(req("celsius")),
        measurementLocation = enum(bodyTemperatureLocation, "measurementLocation", BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_UNKNOWN),
      )
      "skin_temperature" -> SkinTemperatureRecord(
        startTime = start,
        startZoneOffset = offset,
        endTime = seriesEnd,
        endZoneOffset = offset,
        metadata = metadata,
        deltas = listOf(SkinTemperatureRecord.Delta(time = start, delta = TemperatureDelta.celsius(req("deltaCelsius")))),
        baseline = num(value, "baselineCelsius")?.let { Temperature.celsius(it) },
        measurementLocation = enum(skinLocation, "measurementLocation", SkinTemperatureRecord.MEASUREMENT_LOCATION_UNKNOWN),
      )
      "blood_pressure" -> BloodPressureRecord(
        time = start,
        zoneOffset = offset,
        metadata = metadata,
        systolic = Pressure.millimetersOfMercury(req("systolicMmHg")),
        diastolic = Pressure.millimetersOfMercury(req("diastolicMmHg")),
        bodyPosition = enum(bodyPosition, "bodyPosition", BloodPressureRecord.BODY_POSITION_UNKNOWN),
        measurementLocation = enum(bpLocation, "measurementLocation", BloodPressureRecord.MEASUREMENT_LOCATION_UNKNOWN),
      )
      "blood_glucose" -> BloodGlucoseRecord(
        time = start,
        zoneOffset = offset,
        metadata = metadata,
        level = BloodGlucose.millimolesPerLiter(req("millimolesPerLiter")),
        specimenSource = enum(specimenSource, "specimenSource", BloodGlucoseRecord.SPECIMEN_SOURCE_UNKNOWN),
        mealType = enum(HealthSpecEnums.mealType, "mealType", MealType.MEAL_TYPE_UNKNOWN),
        relationToMeal = enum(relationToMeal, "relationToMeal", BloodGlucoseRecord.RELATION_TO_MEAL_UNKNOWN),
      )
      "weight" -> WeightRecord(time = start, zoneOffset = offset, weight = Mass.kilograms(req("kilograms")), metadata = metadata)
      "height" -> HeightRecord(time = start, zoneOffset = offset, height = Length.meters(req("meters")), metadata = metadata)
      "body_fat" -> BodyFatRecord(time = start, zoneOffset = offset, percentage = Percentage(req("percent")), metadata = metadata)
      "lean_body_mass" -> LeanBodyMassRecord(time = start, zoneOffset = offset, mass = Mass.kilograms(req("kilograms")), metadata = metadata)
      "sleep_session" -> SleepSessionRecord(
        startTime = start,
        startZoneOffset = offset,
        endTime = end,
        endZoneOffset = offset,
        metadata = metadata,
        title = str(value, "title"),
        notes = str(value, "notes"),
        stages = (value["stages"] as? List<Map<String, Any?>> ?: emptyList()).map { stage ->
          SleepSessionRecord.Stage(
            startTime = instant(stage["start"]),
            endTime = instant(stage["end"]),
            stage = HealthSpecEnums.sleepStage[stage["stage"] as? String ?: ""] ?: SleepSessionRecord.STAGE_TYPE_UNKNOWN,
          )
        },
      )
      "hydration" -> HydrationRecord(startTime = start, startZoneOffset = offset, endTime = end, endZoneOffset = offset, volume = Volume.liters(req("liters")), metadata = metadata)
      "nutrition" -> HealthSpecNutrition.record(start, offset, end, offset, value, str(value, "name"), enum(HealthSpecEnums.mealType, "mealType", MealType.MEAL_TYPE_UNKNOWN), metadata)
      "mindfulness_session" -> MindfulnessSessionRecord(
        startTime = start,
        startZoneOffset = offset,
        endTime = end,
        endZoneOffset = offset,
        metadata = metadata,
        mindfulnessSessionType = enum(mindfulnessType, "sessionType", MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_UNKNOWN),
        title = str(value, "title"),
        notes = str(value, "notes"),
      )
      "menstruation_flow" -> MenstruationFlowRecord(time = start, zoneOffset = offset, metadata = metadata, flow = enum(menstruationFlow, "flow", MenstruationFlowRecord.FLOW_UNKNOWN))
      "menstruation_period" -> MenstruationPeriodRecord(startTime = start, startZoneOffset = offset, endTime = end, endZoneOffset = offset, metadata = metadata)
      "ovulation_test" -> OvulationTestRecord(time = start, zoneOffset = offset, result = enum(ovulationResult, "result", OvulationTestRecord.RESULT_INCONCLUSIVE), metadata = metadata)
      "cervical_mucus" -> CervicalMucusRecord(
        time = start,
        zoneOffset = offset,
        metadata = metadata,
        appearance = enum(mucusAppearance, "appearance", CervicalMucusRecord.APPEARANCE_UNKNOWN),
        sensation = enum(mucusSensation, "sensation", CervicalMucusRecord.SENSATION_UNKNOWN),
      )
      "intermenstrual_bleeding" -> IntermenstrualBleedingRecord(time = start, zoneOffset = offset, metadata = metadata)
      "sexual_activity" -> SexualActivityRecord(
        time = start,
        zoneOffset = offset,
        metadata = metadata,
        protectionUsed = enum(protectionUsed, "protectionUsed", SexualActivityRecord.PROTECTION_USED_UNKNOWN),
      )
      "basal_body_temperature" -> BasalBodyTemperatureRecord(
        time = start,
        zoneOffset = offset,
        metadata = metadata,
        temperature = Temperature.celsius(req("celsius")),
        measurementLocation = enum(bodyTemperatureLocation, "measurementLocation", BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_UNKNOWN),
      )
      "basal_metabolic_rate" -> BasalMetabolicRateRecord(time = start, zoneOffset = offset, basalMetabolicRate = Power.kilocaloriesPerDay(req("kilocaloriesPerDay")), metadata = metadata)
      "body_water_mass" -> BodyWaterMassRecord(time = start, zoneOffset = offset, mass = Mass.kilograms(req("kilograms")), metadata = metadata)
      "bone_mass" -> BoneMassRecord(time = start, zoneOffset = offset, mass = Mass.kilograms(req("kilograms")), metadata = metadata)
      "cycling_cadence" -> CyclingPedalingCadenceRecord(
        startTime = start, startZoneOffset = offset, endTime = seriesEnd, endZoneOffset = offset,
        samples = listOf(CyclingPedalingCadenceRecord.Sample(time = start, revolutionsPerMinute = req("rpm"))),
        metadata = metadata,
      )
      "steps_cadence" -> StepsCadenceRecord(
        startTime = start, startZoneOffset = offset, endTime = seriesEnd, endZoneOffset = offset,
        samples = listOf(StepsCadenceRecord.Sample(time = start, rate = req("stepsPerMinute"))),
        metadata = metadata,
      )
      "elevation_gained" -> ElevationGainedRecord(startTime = start, startZoneOffset = offset, endTime = end, endZoneOffset = offset, elevation = Length.meters(req("meters")), metadata = metadata)
      "power" -> PowerRecord(
        startTime = start, startZoneOffset = offset, endTime = seriesEnd, endZoneOffset = offset,
        samples = listOf(PowerRecord.Sample(time = start, power = Power.watts(req("watts")))),
        metadata = metadata,
      )
      "speed" -> SpeedRecord(
        startTime = start, startZoneOffset = offset, endTime = seriesEnd, endZoneOffset = offset,
        samples = listOf(SpeedRecord.Sample(time = start, speed = Velocity.metersPerSecond(req("metersPerSecond")))),
        metadata = metadata,
      )
      else -> throw NotSupportedException("Health Connect cannot write type '$type'")
    }
  }

  // ---------------------------------------------------------------- dedicated operations

  /** ExerciseRoute.Location list → the point shape in libraries/expo-health/src/native.ts (HCRoutePoint). */
  fun routePoints(route: ExerciseRoute): List<Map<String, Any?>> = route.route.map { location ->
    mapOf(
      "time" to location.time.toString(),
      "latitude" to location.latitude,
      "longitude" to location.longitude,
      "altitudeMeters" to location.altitude?.inMeters,
      "horizontalAccuracyMeters" to location.horizontalAccuracy?.inMeters,
      "verticalAccuracyMeters" to location.verticalAccuracy?.inMeters,
    ).filterValues { it != null }
  }

  /**
   * MedicalResource → the raw pieces of a clinical_* record. Health Connect stores no timestamps or display
   * names outside the FHIR payload, so the TypeScript layer parses `fhir` (a JSON string) and derives them —
   * the same way on every platform that hands over FHIR.
   */
  fun medicalResourceToJson(resource: MedicalResource): Map<String, Any?> {
    val fhir = resource.fhirResource
    val id = resource.id
    return mapOf(
      // Stable across reads: the data source and the FHIR resource's own type and id identify it.
      "id" to "${id.dataSourceId}/${id.fhirResourceType}/${id.fhirResourceId}",
      "resourceType" to fhirResourceTypeName(fhir.type),
      "fhirVersion" to fhirRelease(resource.fhirVersion.major, resource.fhirVersion.minor, resource.fhirVersion.patch),
      "fhir" to fhir.data,
      "dataSourceId" to resource.dataSourceId,
    )
  }

  /** FHIR version → the release name HealthKit also reports ("R4", "R4B"). */
  fun fhirRelease(major: Int, minor: Int, patch: Int): String = when {
    major == 4 && minor == 3 -> "R4B"
    major == 4 -> "R4"
    major == 5 -> "R5"
    else -> "$major.$minor.$patch"
  }

  /** FHIR resource type constant → the FHIR name the spec stores in `resourceType`. */
  private fun fhirResourceTypeName(type: Int): String = fhirTypeNames[type] ?: "Unknown"

  private val fhirTypeNames: Map<Int, String> = mapOf(
    FhirResource.FHIR_RESOURCE_TYPE_IMMUNIZATION to "Immunization",
    FhirResource.FHIR_RESOURCE_TYPE_ALLERGY_INTOLERANCE to "AllergyIntolerance",
    FhirResource.FHIR_RESOURCE_TYPE_OBSERVATION to "Observation",
    FhirResource.FHIR_RESOURCE_TYPE_CONDITION to "Condition",
    FhirResource.FHIR_RESOURCE_TYPE_PROCEDURE to "Procedure",
    FhirResource.FHIR_RESOURCE_TYPE_MEDICATION to "Medication",
    FhirResource.FHIR_RESOURCE_TYPE_MEDICATION_REQUEST to "MedicationRequest",
    FhirResource.FHIR_RESOURCE_TYPE_MEDICATION_STATEMENT to "MedicationStatement",
    FhirResource.FHIR_RESOURCE_TYPE_PATIENT to "Patient",
    FhirResource.FHIR_RESOURCE_TYPE_PRACTITIONER to "Practitioner",
    FhirResource.FHIR_RESOURCE_TYPE_PRACTITIONER_ROLE to "PractitionerRole",
    FhirResource.FHIR_RESOURCE_TYPE_ENCOUNTER to "Encounter",
    FhirResource.FHIR_RESOURCE_TYPE_LOCATION to "Location",
    FhirResource.FHIR_RESOURCE_TYPE_ORGANIZATION to "Organization",
  )

  /** Numeric value of a field in a serialised record, for the aggregation fallback. */
  fun numericField(json: Map<String, Any?>, field: String): Double? = ((json["value"] as? Map<*, *>)?.get(field) as? Number)?.toDouble()
}

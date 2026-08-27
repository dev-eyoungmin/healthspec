package dev.healthspec

import androidx.health.connect.client.records.ActiveCaloriesBurnedRecord
import androidx.health.connect.client.records.BasalBodyTemperatureRecord
import androidx.health.connect.client.records.BasalMetabolicRateRecord
import androidx.health.connect.client.records.BodyWaterMassRecord
import androidx.health.connect.client.records.BoneMassRecord
import androidx.health.connect.client.records.CervicalMucusRecord
import androidx.health.connect.client.records.CyclingPedalingCadenceRecord
import androidx.health.connect.client.records.ElevationGainedRecord
import androidx.health.connect.client.records.IntermenstrualBleedingRecord
import androidx.health.connect.client.records.MenstruationFlowRecord
import androidx.health.connect.client.records.MenstruationPeriodRecord
import androidx.health.connect.client.records.OvulationTestRecord
import androidx.health.connect.client.records.PowerRecord
import androidx.health.connect.client.records.SexualActivityRecord
import androidx.health.connect.client.records.SpeedRecord
import androidx.health.connect.client.records.StepsCadenceRecord
import androidx.health.connect.client.records.BloodGlucoseRecord
import androidx.health.connect.client.records.BloodPressureRecord
import androidx.health.connect.client.records.BodyFatRecord
import androidx.health.connect.client.records.BodyTemperatureMeasurementLocation
import androidx.health.connect.client.records.BodyTemperatureRecord
import androidx.health.connect.client.records.DistanceRecord
import androidx.health.connect.client.records.ExerciseRoute
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.FloorsClimbedRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord
import androidx.health.connect.client.records.HeightRecord
import androidx.health.connect.client.records.HydrationRecord
import androidx.health.connect.client.records.InstantaneousRecord
import androidx.health.connect.client.records.IntervalRecord
import androidx.health.connect.client.records.LeanBodyMassRecord
import androidx.health.connect.client.records.MealType
import androidx.health.connect.client.records.FhirResource
import androidx.health.connect.client.records.MedicalResource
import androidx.health.connect.client.records.MindfulnessSessionRecord
import androidx.health.connect.client.records.NutritionRecord
import androidx.health.connect.client.records.OxygenSaturationRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.records.RespiratoryRateRecord
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.SkinTemperatureRecord
import androidx.health.connect.client.records.SleepSessionRecord
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

/**
 * Health Connect records ↔ the spec-shaped maps in packages/expo/src/native.ts (HCRecord / HCInsertRecord).
 * Written before a toolchain was available — compile against connect-client 1.1.0 in Phase 1.5.
 */
/** Raised when the spec asks for something Health Connect cannot do. */
class NotSupportedException(message: String) : Exception(message)

object Serialization {

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
  private val mindfulnessType = mapOf(
    "meditation" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_MEDITATION,
    "breathing" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_BREATHING,
    "movement" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_MOVEMENT,
    "music" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_MUSIC,
    "unguided" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_UNGUIDED,
    "other" to MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_OTHER,
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
    val extra = mutableMapOf<String, String>("hc.record" to record::class.simpleName.orEmpty())
    record.metadata.clientRecordId?.let { extra["hc.clientRecordId"] = it }
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

  private fun interval(record: IntervalRecord, value: Map<String, Any?>) =
    envelope(record, record.metadata.id, record.startTime, record.endTime, record.startZoneOffset, value)

  private fun instantaneous(record: InstantaneousRecord, value: Map<String, Any?>) =
    envelope(record, record.metadata.id, record.time, record.time, record.zoneOffset, value)

  // ---------------------------------------------------------------- Record → JSON (series flatten to one entry per sample)

  fun toJson(record: Record): List<Map<String, Any?>> = when (record) {
    is StepsRecord -> listOf(interval(record, mapOf("count" to record.count)))
    is DistanceRecord -> listOf(interval(record, mapOf("meters" to record.distance.inMeters)))
    is ActiveCaloriesBurnedRecord -> listOf(interval(record, mapOf("kilocalories" to record.energy.inKilocalories)))
    is TotalCaloriesBurnedRecord -> listOf(interval(record, mapOf("kilocalories" to record.energy.inKilocalories)))
    is FloorsClimbedRecord -> listOf(interval(record, mapOf("count" to record.floors)))
    is WheelchairPushesRecord -> listOf(interval(record, mapOf("count" to record.count)))
    is ExerciseSessionRecord -> listOf(
      interval(
        record,
        mapOf(
          "activity" to (HealthSpecEnums.exerciseTypeById[record.exerciseType] ?: "other"),
          "title" to record.title,
          "notes" to record.notes,
        ).filterValues { it != null },
      ),
    )
    is Vo2MaxRecord -> listOf(
      instantaneous(
        record,
        mapOf("mlPerKgPerMin" to record.vo2MillilitersPerMinuteKilogram, "measurementMethod" to vo2MethodById[record.measurementMethod]).filterValues { it != null },
      ),
    )
    is HeartRateRecord -> record.samples.mapIndexed { index, sample ->
      envelope(record, "${record.metadata.id}#$index", sample.time, sample.time, record.startZoneOffset, mapOf("bpm" to sample.beatsPerMinute))
    }
    is RestingHeartRateRecord -> listOf(instantaneous(record, mapOf("bpm" to record.beatsPerMinute)))
    is HeartRateVariabilityRmssdRecord -> listOf(instantaneous(record, mapOf("milliseconds" to record.heartRateVariabilityMillis)))
    is OxygenSaturationRecord -> listOf(instantaneous(record, mapOf("percent" to record.percentage.value)))
    is RespiratoryRateRecord -> listOf(instantaneous(record, mapOf("breathsPerMinute" to record.rate)))
    is BodyTemperatureRecord -> listOf(
      instantaneous(
        record,
        mapOf("celsius" to record.temperature.inCelsius, "measurementLocation" to bodyTemperatureLocationById[record.measurementLocation]).filterValues { it != null },
      ),
    )
    is SkinTemperatureRecord -> record.deltas.mapIndexed { index, delta ->
      envelope(
        record,
        "${record.metadata.id}#$index",
        delta.time,
        delta.time,
        record.startZoneOffset,
        mapOf(
          "deltaCelsius" to delta.delta.inCelsius,
          "baselineCelsius" to record.baseline?.inCelsius,
          "measurementLocation" to skinLocationById[record.measurementLocation],
        ).filterValues { it != null },
      )
    }
    is BloodPressureRecord -> listOf(
      instantaneous(
        record,
        mapOf(
          "systolicMmHg" to record.systolic.inMillimetersOfMercury,
          "diastolicMmHg" to record.diastolic.inMillimetersOfMercury,
          "bodyPosition" to bodyPositionById[record.bodyPosition],
          "measurementLocation" to bpLocationById[record.measurementLocation],
        ).filterValues { it != null },
      ),
    )
    is BloodGlucoseRecord -> listOf(
      instantaneous(
        record,
        mapOf(
          "millimolesPerLiter" to record.level.inMillimolesPerLiter,
          "specimenSource" to specimenSourceById[record.specimenSource],
          "mealType" to HealthSpecEnums.mealTypeById[record.mealType],
          "relationToMeal" to relationToMealById[record.relationToMeal],
        ).filterValues { it != null },
      ),
    )
    is WeightRecord -> listOf(instantaneous(record, mapOf("kilograms" to record.weight.inKilograms)))
    is HeightRecord -> listOf(instantaneous(record, mapOf("meters" to record.height.inMeters)))
    is BodyFatRecord -> listOf(instantaneous(record, mapOf("percent" to record.percentage.value)))
    is LeanBodyMassRecord -> listOf(instantaneous(record, mapOf("kilograms" to record.mass.inKilograms)))
    is SleepSessionRecord -> listOf(
      interval(
        record,
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
      ),
    )
    is HydrationRecord -> listOf(interval(record, mapOf("liters" to record.volume.inLiters)))
    is NutritionRecord -> listOf(
      interval(
        record,
        HealthSpecNutrition.nutrients(record) + mapOf("mealType" to HealthSpecEnums.mealTypeById[record.mealType], "name" to record.name).filterValues { it != null },
      ),
    )
    is MindfulnessSessionRecord -> listOf(
      interval(
        record,
        mapOf(
          "sessionType" to mindfulnessTypeById[record.mindfulnessSessionType],
          "title" to record.title,
          "notes" to record.notes,
        ).filterValues { it != null },
      ),
    )
    is MenstruationFlowRecord -> listOf(instantaneous(record, mapOf("flow" to (menstruationFlowById[record.flow] ?: "unknown"))))
    is MenstruationPeriodRecord -> listOf(interval(record, emptyMap()))
    is OvulationTestRecord -> listOf(instantaneous(record, mapOf("result" to (ovulationResultById[record.result] ?: "inconclusive"))))
    is CervicalMucusRecord -> listOf(
      instantaneous(record, mapOf("appearance" to mucusAppearanceById[record.appearance], "sensation" to mucusSensationById[record.sensation]).filterValues { it != null }),
    )
    is IntermenstrualBleedingRecord -> listOf(instantaneous(record, emptyMap()))
    is SexualActivityRecord -> listOf(instantaneous(record, mapOf("protectionUsed" to protectionUsedById[record.protectionUsed]).filterValues { it != null }))
    is BasalBodyTemperatureRecord -> listOf(
      instantaneous(
        record,
        mapOf("celsius" to record.temperature.inCelsius, "measurementLocation" to bodyTemperatureLocationById[record.measurementLocation]).filterValues { it != null },
      ),
    )
    is BasalMetabolicRateRecord -> listOf(instantaneous(record, mapOf("kilocaloriesPerDay" to record.basalMetabolicRate.inKilocaloriesPerDay)))
    is BodyWaterMassRecord -> listOf(instantaneous(record, mapOf("kilograms" to record.mass.inKilograms)))
    is BoneMassRecord -> listOf(instantaneous(record, mapOf("kilograms" to record.mass.inKilograms)))
    is CyclingPedalingCadenceRecord -> record.samples.mapIndexed { index, sample ->
      envelope(record, "${record.metadata.id}#$index", sample.time, sample.time, record.startZoneOffset, mapOf("rpm" to sample.revolutionsPerMinute))
    }
    is StepsCadenceRecord -> record.samples.mapIndexed { index, sample ->
      envelope(record, "${record.metadata.id}#$index", sample.time, sample.time, record.startZoneOffset, mapOf("stepsPerMinute" to sample.rate))
    }
    is ElevationGainedRecord -> listOf(interval(record, mapOf("meters" to record.elevation.inMeters)))
    is PowerRecord -> record.samples.mapIndexed { index, sample ->
      envelope(record, "${record.metadata.id}#$index", sample.time, sample.time, record.startZoneOffset, mapOf("watts" to sample.power.inWatts))
    }
    is SpeedRecord -> record.samples.mapIndexed { index, sample ->
      envelope(record, "${record.metadata.id}#$index", sample.time, sample.time, record.startZoneOffset, mapOf("metersPerSecond" to sample.speed.inMetersPerSecond))
    }
    else -> throw IllegalArgumentException("unsupported record ${record::class.simpleName}")
  }

  // ---------------------------------------------------------------- JSON → Record (writes)

  private fun metadataOf(input: Map<String, Any?>): Metadata {
    val clientRecordId = (input["metadata"] as? Map<*, *>)?.get("clientRecordId") as? String
    val device = Device(type = Device.TYPE_PHONE)
    return when (input["recordingMethod"] as? String) {
      "automatic" -> Metadata.autoRecorded(device = device, clientRecordId = clientRecordId)
      "active" -> Metadata.activelyRecorded(device = device, clientRecordId = clientRecordId)
      "unknown" -> Metadata.unknownRecordingMethod(clientRecordId = clientRecordId)
      else -> Metadata.manualEntry(clientRecordId = clientRecordId)
    }
  }

  @Suppress("UNCHECKED_CAST")
  fun fromJson(type: String, input: Map<String, Any?>): Record {
    val value = input["value"] as? Map<String, Any?> ?: throw IllegalArgumentException("record value must be an object")
    val start = instant(input["start"])
    val end = instant(input["end"])
    val offset = parseOffset(input["zoneOffset"])
    val metadata = metadataOf(input)
    fun req(key: String): Double = num(value, key) ?: throw IllegalArgumentException("$type.$key is required")
    fun enum(map: Map<String, Int>, key: String, default: Int): Int = str(value, key)?.let { map[it] } ?: default

    return when (type) {
      "steps" -> StepsRecord(start, offset, end, offset, req("count").toLong(), metadata)
      "distance" -> DistanceRecord(start, offset, end, offset, Length.meters(req("meters")), metadata)
      "active_energy" -> ActiveCaloriesBurnedRecord(start, offset, end, offset, Energy.kilocalories(req("kilocalories")), metadata)
      "total_energy" -> TotalCaloriesBurnedRecord(start, offset, end, offset, Energy.kilocalories(req("kilocalories")), metadata)
      "floors_climbed" -> FloorsClimbedRecord(start, offset, end, offset, req("count"), metadata)
      "wheelchair_pushes" -> WheelchairPushesRecord(start, offset, end, offset, req("count").toLong(), metadata)
      "exercise_session" -> ExerciseSessionRecord(
        startTime = start,
        startZoneOffset = offset,
        endTime = end,
        endZoneOffset = offset,
        exerciseType = enum(HealthSpecEnums.exerciseType, "activity", ExerciseSessionRecord.EXERCISE_TYPE_OTHER_WORKOUT),
        title = str(value, "title"),
        notes = str(value, "notes"),
        metadata = metadata,
      )
      "vo2_max" -> Vo2MaxRecord(start, offset, req("mlPerKgPerMin"), enum(vo2Method, "measurementMethod", Vo2MaxRecord.MEASUREMENT_METHOD_OTHER), metadata)
      "heart_rate" -> HeartRateRecord(start, offset, end, offset, listOf(HeartRateRecord.Sample(start, req("bpm").toLong())), metadata)
      "resting_heart_rate" -> RestingHeartRateRecord(start, offset, req("bpm").toLong(), metadata)
      "hrv_rmssd" -> HeartRateVariabilityRmssdRecord(start, offset, req("milliseconds"), metadata)
      "oxygen_saturation" -> OxygenSaturationRecord(start, offset, Percentage(req("percent")), metadata)
      "respiratory_rate" -> RespiratoryRateRecord(start, offset, req("breathsPerMinute"), metadata)
      "body_temperature" -> BodyTemperatureRecord(
        start,
        offset,
        Temperature.celsius(req("celsius")),
        enum(bodyTemperatureLocation, "measurementLocation", BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_UNKNOWN),
        metadata,
      )
      "skin_temperature" -> SkinTemperatureRecord(
        startTime = start,
        startZoneOffset = offset,
        endTime = end,
        endZoneOffset = offset,
        deltas = listOf(SkinTemperatureRecord.Delta(start, TemperatureDelta.celsius(req("deltaCelsius")))),
        baseline = num(value, "baselineCelsius")?.let { Temperature.celsius(it) },
        measurementLocation = enum(skinLocation, "measurementLocation", SkinTemperatureRecord.MEASUREMENT_LOCATION_UNKNOWN),
        metadata = metadata,
      )
      "blood_pressure" -> BloodPressureRecord(
        start,
        offset,
        Pressure.millimetersOfMercury(req("systolicMmHg")),
        Pressure.millimetersOfMercury(req("diastolicMmHg")),
        enum(bodyPosition, "bodyPosition", BloodPressureRecord.BODY_POSITION_UNKNOWN),
        enum(bpLocation, "measurementLocation", BloodPressureRecord.MEASUREMENT_LOCATION_UNKNOWN),
        metadata,
      )
      "blood_glucose" -> BloodGlucoseRecord(
        start,
        offset,
        BloodGlucose.millimolesPerLiter(req("millimolesPerLiter")),
        enum(specimenSource, "specimenSource", BloodGlucoseRecord.SPECIMEN_SOURCE_UNKNOWN),
        enum(HealthSpecEnums.mealType, "mealType", MealType.MEAL_TYPE_UNKNOWN),
        enum(relationToMeal, "relationToMeal", BloodGlucoseRecord.RELATION_TO_MEAL_UNKNOWN),
        metadata,
      )
      "weight" -> WeightRecord(start, offset, Mass.kilograms(req("kilograms")), metadata)
      "height" -> HeightRecord(start, offset, Length.meters(req("meters")), metadata)
      "body_fat" -> BodyFatRecord(start, offset, Percentage(req("percent")), metadata)
      "lean_body_mass" -> LeanBodyMassRecord(start, offset, Mass.kilograms(req("kilograms")), metadata)
      "sleep_session" -> SleepSessionRecord(
        startTime = start,
        startZoneOffset = offset,
        endTime = end,
        endZoneOffset = offset,
        title = str(value, "title"),
        notes = str(value, "notes"),
        stages = (value["stages"] as? List<Map<String, Any?>> ?: emptyList()).map { stage ->
          SleepSessionRecord.Stage(
            startTime = instant(stage["start"]),
            endTime = instant(stage["end"]),
            stage = HealthSpecEnums.sleepStage[stage["stage"] as? String ?: ""] ?: SleepSessionRecord.STAGE_TYPE_UNKNOWN,
          )
        },
        metadata = metadata,
      )
      "hydration" -> HydrationRecord(start, offset, end, offset, Volume.liters(req("liters")), metadata)
      "nutrition" -> HealthSpecNutrition.record(start, offset, end, offset, value, str(value, "name"), enum(HealthSpecEnums.mealType, "mealType", MealType.MEAL_TYPE_UNKNOWN), metadata)
      "mindfulness_session" -> MindfulnessSessionRecord(
        startTime = start,
        startZoneOffset = offset,
        endTime = end,
        endZoneOffset = offset,
        mindfulnessSessionType = enum(mindfulnessType, "sessionType", MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_OTHER),
        title = str(value, "title"),
        notes = str(value, "notes"),
        metadata = metadata,
      )
      "menstruation_flow" -> MenstruationFlowRecord(start, offset, enum(menstruationFlow, "flow", MenstruationFlowRecord.FLOW_UNKNOWN), metadata)
      "menstruation_period" -> MenstruationPeriodRecord(start, offset, end, offset, metadata)
      "ovulation_test" -> OvulationTestRecord(start, offset, enum(ovulationResult, "result", OvulationTestRecord.RESULT_INCONCLUSIVE), metadata)
      "cervical_mucus" -> CervicalMucusRecord(
        start,
        offset,
        enum(mucusAppearance, "appearance", CervicalMucusRecord.APPEARANCE_UNKNOWN),
        enum(mucusSensation, "sensation", CervicalMucusRecord.SENSATION_UNKNOWN),
        metadata,
      )
      "intermenstrual_bleeding" -> IntermenstrualBleedingRecord(start, offset, metadata)
      "sexual_activity" -> SexualActivityRecord(start, offset, enum(protectionUsed, "protectionUsed", SexualActivityRecord.PROTECTION_USED_UNKNOWN), metadata)
      "basal_body_temperature" -> BasalBodyTemperatureRecord(
        start,
        offset,
        Temperature.celsius(req("celsius")),
        enum(bodyTemperatureLocation, "measurementLocation", BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_UNKNOWN),
        metadata,
      )
      "basal_metabolic_rate" -> BasalMetabolicRateRecord(start, offset, Power.kilocaloriesPerDay(req("kilocaloriesPerDay")), metadata)
      "body_water_mass" -> BodyWaterMassRecord(start, offset, Mass.kilograms(req("kilograms")), metadata)
      "bone_mass" -> BoneMassRecord(start, offset, Mass.kilograms(req("kilograms")), metadata)
      "cycling_cadence" -> CyclingPedalingCadenceRecord(start, offset, end, offset, listOf(CyclingPedalingCadenceRecord.Sample(start, req("rpm"))), metadata)
      "steps_cadence" -> StepsCadenceRecord(start, offset, end, offset, listOf(StepsCadenceRecord.Sample(start, req("stepsPerMinute"))), metadata)
      "elevation_gained" -> ElevationGainedRecord(start, offset, end, offset, Length.meters(req("meters")), metadata)
      "power" -> PowerRecord(start, offset, end, offset, listOf(PowerRecord.Sample(start, Power.watts(req("watts")))), metadata)
      "speed" -> SpeedRecord(start, offset, end, offset, listOf(SpeedRecord.Sample(start, Velocity.metersPerSecond(req("metersPerSecond")))), metadata)
      else -> throw IllegalArgumentException("Health Connect cannot write type '$type'")
    }
  }

  // ---------------------------------------------------------------- dedicated operations

  /** ExerciseRoute.Location list → the point shape in packages/expo/src/native.ts (HCRoutePoint). */
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
   * MedicalResource → the spec's clinical_* value shape. The FHIR payload arrives as a JSON string and is
   * passed through verbatim; the TypeScript layer parses it (Serialization has no JSON parser dependency).
   */
  fun medicalResourceToJson(resource: MedicalResource, type: String): Map<String, Any?> {
    val fhir = resource.fhirResource
    val value = mapOf(
      "resourceType" to fhirResourceTypeName(fhir.type),
      "displayName" to (fhir.id ?: ""),
      "fhir" to fhir.data,
    ).filterValues { it != null }
    return mapOf(
      "id" to resource.id.toString(),
      "start" to fhir.lastUpdated?.toString(),
      "end" to fhir.lastUpdated?.toString(),
      "value" to value,
      "source" to mapOf(
        "app" to mapOf("id" to resource.dataSourceId.toString()),
        "recordingMethod" to "unknown",
      ),
      "metadata" to mapOf(
        "hc.medicalResourceType" to type,
        "hc.dataSourceId" to resource.dataSourceId.toString(),
      ),
    )
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

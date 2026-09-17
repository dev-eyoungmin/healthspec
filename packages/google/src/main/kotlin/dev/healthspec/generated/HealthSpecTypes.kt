// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.
@file:OptIn(ExperimentalMindfulnessSessionApi::class)

package dev.healthspec.generated

import androidx.health.connect.client.HealthConnectFeatures
import androidx.health.connect.client.feature.ExperimentalMindfulnessSessionApi
import androidx.health.connect.client.records.*
import kotlin.reflect.KClass

data class TypeSpec(
  val recordClass: KClass<out Record>,
  val permissionSuffix: String,
  val read: Boolean,
  val write: Boolean,
  /** Record holds a series of samples that the provider flattens into one record per sample. */
  val series: Boolean,
  /** First numeric value field — what aggregate() operates on unless a field is named. */
  val primaryField: String?,
  /** HealthConnectFeatures.FEATURE_* the device must report available, or null when every device has the type. */
  val feature: Int?,
) {
  val readPermission get() = "android.permission.health.READ_$permissionSuffix"
  val writePermission get() = "android.permission.health.WRITE_$permissionSuffix"
}

object HealthSpecTypes {
  val byId: Map<String, TypeSpec> = mapOf(
    "active_energy" to TypeSpec(ActiveCaloriesBurnedRecord::class, "ACTIVE_CALORIES_BURNED", true, true, false, "kilocalories", null),
    "basal_body_temperature" to TypeSpec(BasalBodyTemperatureRecord::class, "BASAL_BODY_TEMPERATURE", true, true, false, "celsius", null),
    "basal_metabolic_rate" to TypeSpec(BasalMetabolicRateRecord::class, "BASAL_METABOLIC_RATE", true, true, false, "kilocaloriesPerDay", null),
    "blood_glucose" to TypeSpec(BloodGlucoseRecord::class, "BLOOD_GLUCOSE", true, true, false, "millimolesPerLiter", null),
    "blood_pressure" to TypeSpec(BloodPressureRecord::class, "BLOOD_PRESSURE", true, true, false, "systolicMmHg", null),
    "body_fat" to TypeSpec(BodyFatRecord::class, "BODY_FAT", true, true, false, "percent", null),
    "body_temperature" to TypeSpec(BodyTemperatureRecord::class, "BODY_TEMPERATURE", true, true, false, "celsius", null),
    "body_water_mass" to TypeSpec(BodyWaterMassRecord::class, "BODY_WATER_MASS", true, true, false, "kilograms", null),
    "bone_mass" to TypeSpec(BoneMassRecord::class, "BONE_MASS", true, true, false, "kilograms", null),
    "cervical_mucus" to TypeSpec(CervicalMucusRecord::class, "CERVICAL_MUCUS", true, true, false, null, null),
    "cycling_cadence" to TypeSpec(CyclingPedalingCadenceRecord::class, "CYCLING_PEDALING_CADENCE", true, true, true, "rpm", null),
    "distance" to TypeSpec(DistanceRecord::class, "DISTANCE", true, true, false, "meters", null),
    "elevation_gained" to TypeSpec(ElevationGainedRecord::class, "ELEVATION_GAINED", true, true, false, "meters", null),
    "exercise_session" to TypeSpec(ExerciseSessionRecord::class, "EXERCISE", true, true, false, null, null),
    "floors_climbed" to TypeSpec(FloorsClimbedRecord::class, "FLOORS_CLIMBED", true, true, false, "count", null),
    "heart_rate" to TypeSpec(HeartRateRecord::class, "HEART_RATE", true, true, true, "bpm", null),
    "height" to TypeSpec(HeightRecord::class, "HEIGHT", true, true, false, "meters", null),
    "hrv_rmssd" to TypeSpec(HeartRateVariabilityRmssdRecord::class, "HEART_RATE_VARIABILITY", true, true, false, "milliseconds", null),
    "hydration" to TypeSpec(HydrationRecord::class, "HYDRATION", true, true, false, "liters", null),
    "intermenstrual_bleeding" to TypeSpec(IntermenstrualBleedingRecord::class, "INTERMENSTRUAL_BLEEDING", true, true, false, null, null),
    "lean_body_mass" to TypeSpec(LeanBodyMassRecord::class, "LEAN_BODY_MASS", true, true, false, "kilograms", null),
    "menstruation_flow" to TypeSpec(MenstruationFlowRecord::class, "MENSTRUATION", true, true, false, null, null),
    "menstruation_period" to TypeSpec(MenstruationPeriodRecord::class, "MENSTRUATION", true, true, false, null, null),
    "mindfulness_session" to TypeSpec(MindfulnessSessionRecord::class, "MINDFULNESS", true, true, false, null, HealthConnectFeatures.FEATURE_MINDFULNESS_SESSION),
    "nutrition" to TypeSpec(NutritionRecord::class, "NUTRITION", true, true, false, "kilocalories", null),
    "ovulation_test" to TypeSpec(OvulationTestRecord::class, "OVULATION_TEST", true, true, false, null, null),
    "oxygen_saturation" to TypeSpec(OxygenSaturationRecord::class, "OXYGEN_SATURATION", true, true, false, "percent", null),
    "power" to TypeSpec(PowerRecord::class, "POWER", true, true, true, "watts", null),
    "respiratory_rate" to TypeSpec(RespiratoryRateRecord::class, "RESPIRATORY_RATE", true, true, false, "breathsPerMinute", null),
    "resting_heart_rate" to TypeSpec(RestingHeartRateRecord::class, "RESTING_HEART_RATE", true, true, false, "bpm", null),
    "sexual_activity" to TypeSpec(SexualActivityRecord::class, "SEXUAL_ACTIVITY", true, true, false, null, null),
    "skin_temperature" to TypeSpec(SkinTemperatureRecord::class, "SKIN_TEMPERATURE", true, true, true, "deltaCelsius", HealthConnectFeatures.FEATURE_SKIN_TEMPERATURE),
    "sleep_session" to TypeSpec(SleepSessionRecord::class, "SLEEP", true, true, false, null, null),
    "speed" to TypeSpec(SpeedRecord::class, "SPEED", true, true, true, "metersPerSecond", null),
    "steps" to TypeSpec(StepsRecord::class, "STEPS", true, true, false, "count", null),
    "steps_cadence" to TypeSpec(StepsCadenceRecord::class, "STEPS_CADENCE", true, true, true, "stepsPerMinute", null),
    "total_energy" to TypeSpec(TotalCaloriesBurnedRecord::class, "TOTAL_CALORIES_BURNED", true, true, false, "kilocalories", null),
    "vo2_max" to TypeSpec(Vo2MaxRecord::class, "VO2_MAX", true, true, false, "mlPerKgPerMin", null),
    "weight" to TypeSpec(WeightRecord::class, "WEIGHT", true, true, false, "kilograms", null),
    "wheelchair_pushes" to TypeSpec(WheelchairPushesRecord::class, "WHEELCHAIR_PUSHES", true, true, false, "count", null),
  )

  fun require(id: String): TypeSpec = byId[id] ?: throw IllegalArgumentException("Health Connect does not support type '$id'")
}

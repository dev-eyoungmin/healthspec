// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.
package dev.healthspec.generated

import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.MealType
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.metadata.Device
import androidx.health.connect.client.records.metadata.Metadata

object HealthSpecEnums {
  /** DeviceType → Device constants */
  val deviceType: Map<String, Int> = mapOf(
    "unknown" to Device.TYPE_UNKNOWN,
    "watch" to Device.TYPE_WATCH,
    "phone" to Device.TYPE_PHONE,
    "scale" to Device.TYPE_SCALE,
    "ring" to Device.TYPE_RING,
    "head_mounted" to Device.TYPE_HEAD_MOUNTED,
    "fitness_band" to Device.TYPE_FITNESS_BAND,
    "chest_strap" to Device.TYPE_CHEST_STRAP,
    "smart_display" to Device.TYPE_SMART_DISPLAY,
  )
  val deviceTypeById: Map<Int, String> = deviceType.entries.associate { (k, v) -> v to k }

  /** ExerciseType → ExerciseSessionRecord constants */
  val exerciseType: Map<String, Int> = mapOf(
    "american_football" to ExerciseSessionRecord.EXERCISE_TYPE_FOOTBALL_AMERICAN,
    "australian_football" to ExerciseSessionRecord.EXERCISE_TYPE_FOOTBALL_AUSTRALIAN,
    "badminton" to ExerciseSessionRecord.EXERCISE_TYPE_BADMINTON,
    "baseball" to ExerciseSessionRecord.EXERCISE_TYPE_BASEBALL,
    "basketball" to ExerciseSessionRecord.EXERCISE_TYPE_BASKETBALL,
    "boot_camp" to ExerciseSessionRecord.EXERCISE_TYPE_BOOT_CAMP,
    "boxing" to ExerciseSessionRecord.EXERCISE_TYPE_BOXING,
    "calisthenics" to ExerciseSessionRecord.EXERCISE_TYPE_CALISTHENICS,
    "climbing" to ExerciseSessionRecord.EXERCISE_TYPE_ROCK_CLIMBING,
    "cricket" to ExerciseSessionRecord.EXERCISE_TYPE_CRICKET,
    "cycling" to ExerciseSessionRecord.EXERCISE_TYPE_BIKING,
    "cycling_stationary" to ExerciseSessionRecord.EXERCISE_TYPE_BIKING_STATIONARY,
    "dance" to ExerciseSessionRecord.EXERCISE_TYPE_DANCING,
    "disc_sports" to ExerciseSessionRecord.EXERCISE_TYPE_FRISBEE_DISC,
    "elliptical" to ExerciseSessionRecord.EXERCISE_TYPE_ELLIPTICAL,
    "exercise_class" to ExerciseSessionRecord.EXERCISE_TYPE_EXERCISE_CLASS,
    "fencing" to ExerciseSessionRecord.EXERCISE_TYPE_FENCING,
    "golf" to ExerciseSessionRecord.EXERCISE_TYPE_GOLF,
    "guided_breathing" to ExerciseSessionRecord.EXERCISE_TYPE_GUIDED_BREATHING,
    "gymnastics" to ExerciseSessionRecord.EXERCISE_TYPE_GYMNASTICS,
    "handball" to ExerciseSessionRecord.EXERCISE_TYPE_HANDBALL,
    "hiit" to ExerciseSessionRecord.EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING,
    "hiking" to ExerciseSessionRecord.EXERCISE_TYPE_HIKING,
    "ice_hockey" to ExerciseSessionRecord.EXERCISE_TYPE_ICE_HOCKEY,
    "ice_skating" to ExerciseSessionRecord.EXERCISE_TYPE_ICE_SKATING,
    "martial_arts" to ExerciseSessionRecord.EXERCISE_TYPE_MARTIAL_ARTS,
    "paddling" to ExerciseSessionRecord.EXERCISE_TYPE_PADDLING,
    "paragliding" to ExerciseSessionRecord.EXERCISE_TYPE_PARAGLIDING,
    "pilates" to ExerciseSessionRecord.EXERCISE_TYPE_PILATES,
    "racquetball" to ExerciseSessionRecord.EXERCISE_TYPE_RACQUETBALL,
    "roller_hockey" to ExerciseSessionRecord.EXERCISE_TYPE_ROLLER_HOCKEY,
    "rowing" to ExerciseSessionRecord.EXERCISE_TYPE_ROWING,
    "rowing_machine" to ExerciseSessionRecord.EXERCISE_TYPE_ROWING_MACHINE,
    "rugby" to ExerciseSessionRecord.EXERCISE_TYPE_RUGBY,
    "running" to ExerciseSessionRecord.EXERCISE_TYPE_RUNNING,
    "running_treadmill" to ExerciseSessionRecord.EXERCISE_TYPE_RUNNING_TREADMILL,
    "sailing" to ExerciseSessionRecord.EXERCISE_TYPE_SAILING,
    "scuba_diving" to ExerciseSessionRecord.EXERCISE_TYPE_SCUBA_DIVING,
    "skating" to ExerciseSessionRecord.EXERCISE_TYPE_SKATING,
    "skiing" to ExerciseSessionRecord.EXERCISE_TYPE_SKIING,
    "snowboarding" to ExerciseSessionRecord.EXERCISE_TYPE_SNOWBOARDING,
    "snowshoeing" to ExerciseSessionRecord.EXERCISE_TYPE_SNOWSHOEING,
    "soccer" to ExerciseSessionRecord.EXERCISE_TYPE_SOCCER,
    "softball" to ExerciseSessionRecord.EXERCISE_TYPE_SOFTBALL,
    "squash" to ExerciseSessionRecord.EXERCISE_TYPE_SQUASH,
    "stair_climbing" to ExerciseSessionRecord.EXERCISE_TYPE_STAIR_CLIMBING,
    "stair_climbing_machine" to ExerciseSessionRecord.EXERCISE_TYPE_STAIR_CLIMBING_MACHINE,
    "strength_training" to ExerciseSessionRecord.EXERCISE_TYPE_STRENGTH_TRAINING,
    "stretching" to ExerciseSessionRecord.EXERCISE_TYPE_STRETCHING,
    "surfing" to ExerciseSessionRecord.EXERCISE_TYPE_SURFING,
    "swimming_open_water" to ExerciseSessionRecord.EXERCISE_TYPE_SWIMMING_OPEN_WATER,
    "swimming_pool" to ExerciseSessionRecord.EXERCISE_TYPE_SWIMMING_POOL,
    "table_tennis" to ExerciseSessionRecord.EXERCISE_TYPE_TABLE_TENNIS,
    "tennis" to ExerciseSessionRecord.EXERCISE_TYPE_TENNIS,
    "volleyball" to ExerciseSessionRecord.EXERCISE_TYPE_VOLLEYBALL,
    "walking" to ExerciseSessionRecord.EXERCISE_TYPE_WALKING,
    "water_polo" to ExerciseSessionRecord.EXERCISE_TYPE_WATER_POLO,
    "weightlifting" to ExerciseSessionRecord.EXERCISE_TYPE_WEIGHTLIFTING,
    "wheelchair" to ExerciseSessionRecord.EXERCISE_TYPE_WHEELCHAIR,
    "yoga" to ExerciseSessionRecord.EXERCISE_TYPE_YOGA,
    "other" to ExerciseSessionRecord.EXERCISE_TYPE_OTHER_WORKOUT,
  )
  val exerciseTypeById: Map<Int, String> = exerciseType.entries.associate { (k, v) -> v to k }

  /** MealType → MealType constants */
  val mealType: Map<String, Int> = mapOf(
    "unknown" to MealType.MEAL_TYPE_UNKNOWN,
    "breakfast" to MealType.MEAL_TYPE_BREAKFAST,
    "lunch" to MealType.MEAL_TYPE_LUNCH,
    "dinner" to MealType.MEAL_TYPE_DINNER,
    "snack" to MealType.MEAL_TYPE_SNACK,
  )
  val mealTypeById: Map<Int, String> = mealType.entries.associate { (k, v) -> v to k }

  /** RecordingMethod → Metadata constants */
  val recordingMethod: Map<String, Int> = mapOf(
    "manual" to Metadata.RECORDING_METHOD_MANUAL_ENTRY,
    "automatic" to Metadata.RECORDING_METHOD_AUTOMATICALLY_RECORDED,
    "active" to Metadata.RECORDING_METHOD_ACTIVELY_RECORDED,
    "unknown" to Metadata.RECORDING_METHOD_UNKNOWN,
  )
  val recordingMethodById: Map<Int, String> = recordingMethod.entries.associate { (k, v) -> v to k }

  /** SleepStage → SleepSessionRecord constants */
  val sleepStage: Map<String, Int> = mapOf(
    "awake" to SleepSessionRecord.STAGE_TYPE_AWAKE,
    "awake_in_bed" to SleepSessionRecord.STAGE_TYPE_AWAKE_IN_BED,
    "out_of_bed" to SleepSessionRecord.STAGE_TYPE_OUT_OF_BED,
    "sleeping" to SleepSessionRecord.STAGE_TYPE_SLEEPING,
    "light" to SleepSessionRecord.STAGE_TYPE_LIGHT,
    "deep" to SleepSessionRecord.STAGE_TYPE_DEEP,
    "rem" to SleepSessionRecord.STAGE_TYPE_REM,
    "unknown" to SleepSessionRecord.STAGE_TYPE_UNKNOWN,
  )
  val sleepStageById: Map<Int, String> = sleepStage.entries.associate { (k, v) -> v to k }
}

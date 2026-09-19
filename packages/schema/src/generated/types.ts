// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.

// ---------------------------------------------------------------- enums

/** Kind of device that produced a measurement. Canonical list follows Health Connect's Device types; HealthKit providers infer it from HKDevice model/name. */
export type DeviceType = "unknown" | "watch" | "phone" | "scale" | "ring" | "head_mounted" | "fitness_band" | "chest_strap" | "smart_display";
export const DEVICE_TYPE_VALUES = ["unknown","watch","phone","scale","ring","head_mounted","fitness_band","chest_strap","smart_display"] as const;

/** Canonical exercise / workout activity type. DRAFT: platform mappings are to be verified against HKWorkoutActivityType and ExerciseSessionRecord.EXERCISE_TYPE_* headers in Phase 1. Where one platform has no equivalent the provider MUST fall back to `other` and preserve the native value in metadata. */
export type ExerciseType = "american_football" | "australian_football" | "badminton" | "baseball" | "basketball" | "boot_camp" | "boxing" | "calisthenics" | "climbing" | "cricket" | "cycling" | "cycling_stationary" | "dance" | "disc_sports" | "elliptical" | "exercise_class" | "fencing" | "golf" | "guided_breathing" | "gymnastics" | "handball" | "hiit" | "hiking" | "ice_hockey" | "ice_skating" | "martial_arts" | "paddling" | "paragliding" | "pilates" | "racquetball" | "roller_hockey" | "rowing" | "rowing_machine" | "rugby" | "running" | "running_treadmill" | "sailing" | "scuba_diving" | "skating" | "skiing" | "snowboarding" | "snowshoeing" | "soccer" | "softball" | "squash" | "stair_climbing" | "stair_climbing_machine" | "strength_training" | "stretching" | "surfing" | "swimming_open_water" | "swimming_pool" | "table_tennis" | "tennis" | "volleyball" | "walking" | "water_polo" | "weightlifting" | "wheelchair" | "yoga" | "archery" | "bowling" | "core_training" | "cross_country_skiing" | "curling" | "equestrian" | "fishing" | "hunting" | "jump_rope" | "kickboxing" | "lacrosse" | "pickleball" | "tai_chi" | "track_and_field" | "wrestling" | "other";
export const EXERCISE_TYPE_VALUES = ["american_football","australian_football","badminton","baseball","basketball","boot_camp","boxing","calisthenics","climbing","cricket","cycling","cycling_stationary","dance","disc_sports","elliptical","exercise_class","fencing","golf","guided_breathing","gymnastics","handball","hiit","hiking","ice_hockey","ice_skating","martial_arts","paddling","paragliding","pilates","racquetball","roller_hockey","rowing","rowing_machine","rugby","running","running_treadmill","sailing","scuba_diving","skating","skiing","snowboarding","snowshoeing","soccer","softball","squash","stair_climbing","stair_climbing_machine","strength_training","stretching","surfing","swimming_open_water","swimming_pool","table_tennis","tennis","volleyball","walking","water_polo","weightlifting","wheelchair","yoga","archery","bowling","core_training","cross_country_skiing","curling","equestrian","fishing","hunting","jump_rope","kickboxing","lacrosse","pickleball","tai_chi","track_and_field","wrestling","other"] as const;

/** Meal a nutrition or glucose record relates to. */
export type MealType = "unknown" | "breakfast" | "lunch" | "dinner" | "snack";
export const MEAL_TYPE_VALUES = ["unknown","breakfast","lunch","dinner","snack"] as const;

/** How a record was captured. Mirrors Health Connect's recording methods; HealthKit only distinguishes user-entered data. */
export type RecordingMethod = "manual" | "automatic" | "active" | "unknown";
export const RECORDING_METHOD_VALUES = ["manual","automatic","active","unknown"] as const;

/** Sleep stage within a sleep session. `in_bed` is HealthKit's legacy "in bed, sleep state unknown" and is kept distinct from `awake_in_bed`. */
export type SleepStage = "awake" | "awake_in_bed" | "in_bed" | "out_of_bed" | "sleeping" | "light" | "deep" | "rem" | "unknown";
export const SLEEP_STAGE_VALUES = ["awake","awake_in_bed","in_bed","out_of_bed","sleeping","light","deep","rem","unknown"] as const;

// ---------------------------------------------------------------- health types

export type HealthType = "active_energy" | "activity_summary" | "apple_exercise_time" | "apple_move_time" | "apple_sleeping_breathing_disturbances" | "apple_sleeping_wrist_temperature" | "apple_stand_hour" | "apple_stand_time" | "apple_walking_steadiness" | "apple_walking_steadiness_event" | "atrial_fibrillation_burden" | "basal_body_temperature" | "basal_energy" | "basal_metabolic_rate" | "bleeding_after_pregnancy" | "bleeding_during_pregnancy" | "blood_alcohol_content" | "blood_glucose" | "blood_pressure" | "body_fat" | "body_mass_index" | "body_temperature" | "body_water_mass" | "bone_mass" | "cervical_mucus" | "clinical_allergy" | "clinical_condition" | "clinical_coverage" | "clinical_immunization" | "clinical_lab_result" | "clinical_medication" | "clinical_note" | "clinical_personal_details" | "clinical_practitioner_details" | "clinical_pregnancy" | "clinical_procedure" | "clinical_social_history" | "clinical_visit" | "clinical_vital_sign" | "contraceptive" | "cross_country_skiing_speed" | "cycling_cadence" | "cycling_functional_threshold_power" | "cycling_power" | "cycling_speed" | "distance" | "distance_cross_country_skiing" | "distance_cycling" | "distance_downhill_snow_sports" | "distance_paddle_sports" | "distance_rowing" | "distance_skating_sports" | "distance_swimming" | "distance_wheelchair" | "electrocardiogram" | "electrodermal_activity" | "elevation_gained" | "environmental_audio_exposure" | "environmental_audio_exposure_event" | "environmental_sound_reduction" | "estimated_workout_effort_score" | "exercise_route" | "exercise_session" | "floors_climbed" | "forced_expiratory_volume_1" | "forced_vital_capacity" | "handwashing_event" | "headphone_audio_exposure" | "headphone_audio_exposure_event" | "heart_rate" | "heart_rate_recovery_one_minute" | "heartbeat_series" | "height" | "high_heart_rate_event" | "hrv_rmssd" | "hrv_sdnn" | "hydration" | "infrequent_menstrual_cycles" | "inhaler_usage" | "insulin_delivery" | "intermenstrual_bleeding" | "irregular_heart_rhythm_event" | "irregular_menstrual_cycles" | "lactation" | "lean_body_mass" | "low_cardio_fitness_event" | "low_heart_rate_event" | "medication_dose" | "menstruation_flow" | "menstruation_period" | "mindfulness_session" | "nike_fuel" | "number_of_alcoholic_beverages" | "number_of_times_fallen" | "nutrition" | "ovulation_test" | "oxygen_saturation" | "paddle_sports_speed" | "peak_expiratory_flow_rate" | "peripheral_perfusion_index" | "persistent_intermenstrual_bleeding" | "physical_effort" | "power" | "pregnancy" | "pregnancy_test" | "progesterone_test" | "prolonged_menstrual_periods" | "respiratory_rate" | "resting_heart_rate" | "rowing_speed" | "running_ground_contact_time" | "running_power" | "running_speed" | "running_stride_length" | "running_vertical_oscillation" | "sexual_activity" | "six_minute_walk_distance" | "skin_temperature" | "sleep_apnea_event" | "sleep_session" | "speed" | "stair_ascent_speed" | "stair_descent_speed" | "state_of_mind" | "steps" | "steps_cadence" | "swimming_stroke_count" | "symptom_abdominal_cramps" | "symptom_acne" | "symptom_appetite_changes" | "symptom_bladder_incontinence" | "symptom_bloating" | "symptom_breast_pain" | "symptom_chest_tightness_or_pain" | "symptom_chills" | "symptom_constipation" | "symptom_coughing" | "symptom_diarrhea" | "symptom_dizziness" | "symptom_dry_skin" | "symptom_fainting" | "symptom_fatigue" | "symptom_fever" | "symptom_generalized_body_ache" | "symptom_hair_loss" | "symptom_headache" | "symptom_heartburn" | "symptom_hot_flashes" | "symptom_loss_of_smell" | "symptom_loss_of_taste" | "symptom_lower_back_pain" | "symptom_memory_lapse" | "symptom_mood_changes" | "symptom_nausea" | "symptom_night_sweats" | "symptom_pelvic_pain" | "symptom_rapid_pounding_or_fluttering_heartbeat" | "symptom_runny_nose" | "symptom_shortness_of_breath" | "symptom_sinus_congestion" | "symptom_skipped_heartbeat" | "symptom_sleep_changes" | "symptom_sore_throat" | "symptom_vaginal_dryness" | "symptom_vomiting" | "symptom_wheezing" | "time_in_daylight" | "toothbrushing_event" | "total_energy" | "underwater_depth" | "uv_exposure" | "vo2_max" | "waist_circumference" | "walking_asymmetry" | "walking_double_support" | "walking_heart_rate_average" | "walking_speed" | "walking_step_length" | "water_temperature" | "weight" | "wheelchair_pushes" | "workout_effort_score";
export const HEALTH_TYPES = ["active_energy","activity_summary","apple_exercise_time","apple_move_time","apple_sleeping_breathing_disturbances","apple_sleeping_wrist_temperature","apple_stand_hour","apple_stand_time","apple_walking_steadiness","apple_walking_steadiness_event","atrial_fibrillation_burden","basal_body_temperature","basal_energy","basal_metabolic_rate","bleeding_after_pregnancy","bleeding_during_pregnancy","blood_alcohol_content","blood_glucose","blood_pressure","body_fat","body_mass_index","body_temperature","body_water_mass","bone_mass","cervical_mucus","clinical_allergy","clinical_condition","clinical_coverage","clinical_immunization","clinical_lab_result","clinical_medication","clinical_note","clinical_personal_details","clinical_practitioner_details","clinical_pregnancy","clinical_procedure","clinical_social_history","clinical_visit","clinical_vital_sign","contraceptive","cross_country_skiing_speed","cycling_cadence","cycling_functional_threshold_power","cycling_power","cycling_speed","distance","distance_cross_country_skiing","distance_cycling","distance_downhill_snow_sports","distance_paddle_sports","distance_rowing","distance_skating_sports","distance_swimming","distance_wheelchair","electrocardiogram","electrodermal_activity","elevation_gained","environmental_audio_exposure","environmental_audio_exposure_event","environmental_sound_reduction","estimated_workout_effort_score","exercise_route","exercise_session","floors_climbed","forced_expiratory_volume_1","forced_vital_capacity","handwashing_event","headphone_audio_exposure","headphone_audio_exposure_event","heart_rate","heart_rate_recovery_one_minute","heartbeat_series","height","high_heart_rate_event","hrv_rmssd","hrv_sdnn","hydration","infrequent_menstrual_cycles","inhaler_usage","insulin_delivery","intermenstrual_bleeding","irregular_heart_rhythm_event","irregular_menstrual_cycles","lactation","lean_body_mass","low_cardio_fitness_event","low_heart_rate_event","medication_dose","menstruation_flow","menstruation_period","mindfulness_session","nike_fuel","number_of_alcoholic_beverages","number_of_times_fallen","nutrition","ovulation_test","oxygen_saturation","paddle_sports_speed","peak_expiratory_flow_rate","peripheral_perfusion_index","persistent_intermenstrual_bleeding","physical_effort","power","pregnancy","pregnancy_test","progesterone_test","prolonged_menstrual_periods","respiratory_rate","resting_heart_rate","rowing_speed","running_ground_contact_time","running_power","running_speed","running_stride_length","running_vertical_oscillation","sexual_activity","six_minute_walk_distance","skin_temperature","sleep_apnea_event","sleep_session","speed","stair_ascent_speed","stair_descent_speed","state_of_mind","steps","steps_cadence","swimming_stroke_count","symptom_abdominal_cramps","symptom_acne","symptom_appetite_changes","symptom_bladder_incontinence","symptom_bloating","symptom_breast_pain","symptom_chest_tightness_or_pain","symptom_chills","symptom_constipation","symptom_coughing","symptom_diarrhea","symptom_dizziness","symptom_dry_skin","symptom_fainting","symptom_fatigue","symptom_fever","symptom_generalized_body_ache","symptom_hair_loss","symptom_headache","symptom_heartburn","symptom_hot_flashes","symptom_loss_of_smell","symptom_loss_of_taste","symptom_lower_back_pain","symptom_memory_lapse","symptom_mood_changes","symptom_nausea","symptom_night_sweats","symptom_pelvic_pain","symptom_rapid_pounding_or_fluttering_heartbeat","symptom_runny_nose","symptom_shortness_of_breath","symptom_sinus_congestion","symptom_skipped_heartbeat","symptom_sleep_changes","symptom_sore_throat","symptom_vaginal_dryness","symptom_vomiting","symptom_wheezing","time_in_daylight","toothbrushing_event","total_energy","underwater_depth","uv_exposure","vo2_max","waist_circumference","walking_asymmetry","walking_double_support","walking_heart_rate_average","walking_speed","walking_step_length","water_temperature","weight","wheelchair_pushes","workout_effort_score"] as const;

export type HealthCategory = "activity" | "body" | "clinical" | "cycle" | "environment" | "mind" | "mobility" | "nutrition" | "respiratory" | "sleep" | "symptom" | "vitals" | "wellness";
export const HEALTH_CATEGORIES = ["activity","body","clinical","cycle","environment","mind","mobility","nutrition","respiratory","sleep","symptom","vitals","wellness"] as const;
/** sample: point in time (start == end) · interval: cumulative over [start, end] · session: an episode with optional structure */
export type RecordKind = 'sample' | 'interval' | 'session';
export type AggregateFn = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'duration';

// ---------------------------------------------------------------- common

/** User characteristics that are not time-stamped records. HealthKit exposes them as characteristic types; Health Connect has no equivalent, so Android providers return an empty profile and declare capabilities.profile = false. */
export interface HealthProfile {
  biologicalSex?: "female" | "male" | "other";
  /** Calendar date, YYYY-MM-DD. */
  dateOfBirth?: string;
  bloodType?: "a_positive" | "a_negative" | "b_positive" | "b_negative" | "ab_positive" | "ab_negative" | "o_positive" | "o_negative";
  fitzpatrickSkinType?: "type_1" | "type_2" | "type_3" | "type_4" | "type_5" | "type_6";
  wheelchairUse?: boolean;
  activityMoveMode?: "active_energy" | "move_time";
}

/** Where a record came from: the writing app, the device that measured it, and how it was recorded. */
export interface HealthSource {
  /** The application that wrote the record. */
  app?: {
    /** Bundle identifier (iOS) or package name (Android). */
    id: string;
    /** Human-readable app name when the platform exposes it. */
    name?: string;
  };
  /** The device that produced the measurement, when known. */
  device?: {
    manufacturer?: string;
    model?: string;
    type?: DeviceType;
  };
  recordingMethod: RecordingMethod;
}

/** Common envelope shared by every health record. The `value` object is defined per type under schema/types. */
export interface HealthRecordBase {
  /** Provider-scoped stable identifier (HealthKit UUID, Health Connect record id, …). */
  id: string;
  /** Start instant, RFC 3339 / ISO 8601 with offset or Z. */
  start: string;
  /** End instant. Equal to `start` for point samples. */
  end: string;
  /** UTC offset in effect when the record was made (e.g. "+09:00"). Preserved from Health Connect; derived from HKMetadataKeyTimeZone on HealthKit when present. */
  zoneOffset?: string;
  source: HealthSource;
  /** Provider-specific string metadata passed through untouched. */
  metadata?: Record<string, string>;
}

// ---------------------------------------------------------------- values

/** Energy burned through activity during the interval (excludes basal metabolism). */
export interface ActiveEnergyValue {
  /** Unit: kcal. Range: 0–… */
  kilocalories: number;
}

/** One day of Apple activity-ring progress and goals. */
export interface ActivitySummaryValue {
  date: string;
  /** Unit: kcal. Range: 0–… */
  activeEnergyKilocalories?: number;
  /** Unit: kcal. Range: 0–… */
  activeEnergyGoalKilocalories?: number;
  /** Unit: min. Range: 0–… */
  exerciseMinutes?: number;
  /** Unit: min. Range: 0–… */
  exerciseGoalMinutes?: number;
  /** Unit: count. Range: 0–… */
  standHours?: number;
  /** Unit: count. Range: 0–… */
  standGoalHours?: number;
  /** Unit: min. Range: 0–… */
  moveMinutes?: number;
  /** Unit: min. Range: 0–… */
  moveGoalMinutes?: number;
  activityMoveMode?: "active_energy" | "move_time";
}

/** Minutes of brisk activity credited to the Exercise ring. */
export interface AppleExerciseTimeValue {
  /** Unit: min. Range: 0–… */
  minutes: number;
}

/** Minutes of movement (Move ring in time mode). */
export interface AppleMoveTimeValue {
  /** Unit: min. Range: 0–… */
  minutes: number;
}

/** Breathing disturbances during sleep. */
export interface AppleSleepingBreathingDisturbancesValue {
  /** Unit: count. Range: 0–… */
  count: number;
}

/** Wrist temperature measured during sleep (absolute; see skin_temperature for Health Connect deltas). */
export interface AppleSleepingWristTemperatureValue {
  /** Unit: °C. Range: 0–… */
  celsius: number;
}

/** Whether the user stood during an hour (Stand ring). */
export interface AppleStandHourValue {
  status: "stood" | "idle";
}

/** Minutes standing credited to the Stand ring. */
export interface AppleStandTimeValue {
  /** Unit: min. Range: 0–… */
  minutes: number;
}

/** Walking steadiness score. */
export interface AppleWalkingSteadinessValue {
  /** Unit: %. Range: 0–100 */
  percent: number;
}

/** Walking steadiness notification event. */
export interface AppleWalkingSteadinessEventValue {
  level: "initial_low" | "initial_very_low" | "repeat_low" | "repeat_very_low";
}

/** Share of time in atrial fibrillation. */
export interface AtrialFibrillationBurdenValue {
  /** Unit: %. Range: 0–100 */
  percent: number;
}

/** Basal body temperature (measured at rest, typically on waking). */
export interface BasalBodyTemperatureValue {
  /** Unit: °C. Range: 20–50 */
  celsius: number;
  measurementLocation?: "armpit" | "finger" | "forehead" | "mouth" | "rectum" | "temporal_artery" | "toe" | "ear" | "wrist" | "vagina" | "unknown";
}

/** Resting (basal) energy burned during the interval (HealthKit). Health Connect exposes the rate instead — see basal_metabolic_rate. */
export interface BasalEnergyValue {
  /** Unit: kcal. Range: 0–… */
  kilocalories: number;
}

/** Basal metabolic rate as an energy *rate* (Health Connect). For HealthKit’s basal energy over an interval see basal_energy. */
export interface BasalMetabolicRateValue {
  /** Unit: kcal/day. Range: 0–… */
  kilocaloriesPerDay: number;
}

/** Bleeding after pregnancy. */
export interface BleedingAfterPregnancyValue {
  flow: "unspecified" | "light" | "medium" | "heavy" | "none";
}

/** Bleeding during pregnancy. */
export interface BleedingDuringPregnancyValue {
  flow: "unspecified" | "light" | "medium" | "heavy" | "none";
}

/** Blood alcohol content. */
export interface BloodAlcoholContentValue {
  /** Unit: %. Range: 0–100 */
  percent: number;
}

/** Blood glucose concentration. Canonical unit is mmol/L; use units.glucose to convert to mg/dL (× 18.0182). */
export interface BloodGlucoseValue {
  /** Unit: mmol/L. Range: 0–60 */
  millimolesPerLiter: number;
  specimenSource?: "interstitial_fluid" | "capillary_blood" | "plasma" | "serum" | "tears" | "whole_blood" | "unknown";
  mealType?: MealType;
  relationToMeal?: "general" | "fasting" | "before_meal" | "after_meal" | "unknown";
}

/** Systolic and diastolic blood pressure measured together. */
export interface BloodPressureValue {
  /** Unit: mmHg. Range: 20–300 */
  systolicMmHg: number;
  /** Unit: mmHg. Range: 10–200 */
  diastolicMmHg: number;
  bodyPosition?: "standing_up" | "sitting_down" | "lying_down" | "reclining" | "unknown";
  measurementLocation?: "left_wrist" | "right_wrist" | "left_upper_arm" | "right_upper_arm" | "unknown";
}

/** Body fat as a percentage of body mass. */
export interface BodyFatValue {
  /** Unit: %. Range: 0–100 */
  percent: number;
}

/** Body mass index. */
export interface BodyMassIndexValue {
  /** Unit: kg/m². Range: 0–100 */
  value: number;
}

/** Core or surface body temperature measurement. */
export interface BodyTemperatureValue {
  /** Unit: °C. Range: 20–50 */
  celsius: number;
  measurementLocation?: "armpit" | "finger" | "forehead" | "mouth" | "rectum" | "temporal_artery" | "toe" | "ear" | "wrist" | "vagina" | "unknown";
}

/** Total body water mass. */
export interface BodyWaterMassValue {
  /** Unit: kg. Range: 0–500 */
  kilograms: number;
}

/** Bone mass. */
export interface BoneMassValue {
  /** Unit: kg. Range: 0–100 */
  kilograms: number;
}

/** Cervical mucus observation. */
export interface CervicalMucusValue {
  appearance?: "dry" | "sticky" | "creamy" | "watery" | "egg_white" | "unusual" | "unknown";
  sensation?: "light" | "medium" | "heavy" | "unknown";
}

/** Allergies and intolerances. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalAllergyValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Conditions / diagnoses. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalConditionValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Insurance coverage (HealthKit only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalCoverageValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Immunizations. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalImmunizationValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Laboratory results. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalLabResultValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Prescribed medications. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalMedicationValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Clinical notes (HealthKit only, iOS 16). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalNoteValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Personal details (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalPersonalDetailsValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Practitioner details (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalPractitionerDetailsValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Pregnancy records (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalPregnancyValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Procedures. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalProcedureValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Social history (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalSocialHistoryValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Visits / encounters (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalVisitValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Clinically recorded vital signs. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions. */
export interface ClinicalVitalSignValue {
  /** FHIR resource type, e.g. "Observation". */
  resourceType: string;
  /** FHIR release, e.g. "R4". */
  fhirVersion?: string;
  displayName?: string;
  sourceUrl?: string;
  /** The FHIR resource, verbatim. */
  fhir: Record<string, unknown>;
}

/** Contraceptive in use. */
export interface ContraceptiveValue {
  method: "unspecified" | "implant" | "injection" | "intrauterine_device" | "intravaginal_ring" | "oral" | "patch";
}

/** Cross-country skiing speed sample. */
export interface CrossCountrySkiingSpeedValue {
  /** Unit: m/s. Range: 0–… */
  metersPerSecond: number;
}

/** Pedalling cadence sample. */
export interface CyclingCadenceValue {
  /** Unit: rpm. Range: 0–400 */
  rpm: number;
}

/** Functional threshold power estimate. */
export interface CyclingFunctionalThresholdPowerValue {
  /** Unit: W. Range: 0–… */
  watts: number;
}

/** Cycling power sample. */
export interface CyclingPowerValue {
  /** Unit: W. Range: 0–… */
  watts: number;
}

/** Cycling speed sample. */
export interface CyclingSpeedValue {
  /** Unit: m/s. Range: 0–… */
  metersPerSecond: number;
}

/** Distance travelled on foot during the interval. */
export interface DistanceValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Cross-country skiing distance during the interval. */
export interface DistanceCrossCountrySkiingValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Distance cycled during the interval. */
export interface DistanceCyclingValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Downhill skiing / snowboarding distance during the interval. */
export interface DistanceDownhillSnowSportsValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Paddle-sports distance during the interval. */
export interface DistancePaddleSportsValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Rowing distance during the interval. */
export interface DistanceRowingValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Skating distance during the interval. */
export interface DistanceSkatingSportsValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Distance swum during the interval. */
export interface DistanceSwimmingValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Distance travelled by wheelchair during the interval. */
export interface DistanceWheelchairValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Single-lead ECG recording: classification and summary values. Voltage samples are fetched separately (readEcgVoltages) because a recording holds thousands. */
export interface ElectrocardiogramValue {
  classification: "not_set" | "sinus_rhythm" | "atrial_fibrillation" | "inconclusive_low_heart_rate" | "inconclusive_high_heart_rate" | "inconclusive_poor_reading" | "inconclusive_other" | "unrecognized";
  symptomsStatus?: "not_set" | "none" | "present";
  /** Unit: beats/min. Range: 0–300 */
  averageBpm?: number;
  /** Unit: Hz. Range: 0–… */
  samplingFrequencyHz?: number;
  /** Unit: count. Range: 0–… */
  voltageCount?: number;
}

/** Electrodermal activity (skin conductance). */
export interface ElectrodermalActivityValue {
  /** Unit: µS. Range: 0–… */
  microsiemens: number;
}

/** Elevation gained during the interval (Health Connect only; HealthKit keeps it as workout metadata). */
export interface ElevationGainedValue {
  /** Unit: m */
  meters: number;
}

/** Environmental sound level exposure. */
export interface EnvironmentalAudioExposureValue {
  /** Unit: dB(A). Range: 0–200 */
  decibels: number;
}

/** Environmental sound exposure limit event. */
export interface EnvironmentalAudioExposureEventValue {

}

/** Sound reduction from active noise control. */
export interface EnvironmentalSoundReductionValue {
  /** Unit: dB(A). Range: 0–200 */
  decibels: number;
}

/** System-estimated workout effort (1–10). */
export interface EstimatedWorkoutEffortScoreValue {
  /** Unit: score. Range: 1–10 */
  score: number;
}

/** GPS route of an exercise session. Read with readRoute(sessionId): Health Connect asks the user per session; HealthKit reads the route series linked to the workout. */
export interface ExerciseRouteValue {
  /** Id of the exercise_session this route belongs to. */
  sessionId?: string;
  points: Array<{
    time: string;
    /** Unit: °. Range: -90–90 */
    latitude: number;
    /** Unit: °. Range: -180–180 */
    longitude: number;
    /** Unit: m */
    altitudeMeters?: number;
    /** Unit: m. Range: 0–… */
    horizontalAccuracyMeters?: number;
    /** Unit: m. Range: 0–… */
    verticalAccuracyMeters?: number;
  }>;
}

/** A workout / exercise session. Duration is end − start. Associated totals (distance, energy, heart rate) are separate records overlapping the session's time range. */
export interface ExerciseSessionValue {
  activity: ExerciseType;
  title?: string;
  notes?: string;
}

/** Floors (flights of stairs) climbed during the interval. */
export interface FloorsClimbedValue {
  /** Unit: count. Range: 0–… */
  count: number;
}

/** FEV1 — air exhaled in the first second of a forced breath. */
export interface ForcedExpiratoryVolume1Value {
  /** Unit: L. Range: 0–… */
  liters: number;
}

/** Forced vital capacity. */
export interface ForcedVitalCapacityValue {
  /** Unit: L. Range: 0–… */
  liters: number;
}

/** Handwashing session. */
export interface HandwashingEventValue {

}

/** Headphone sound level exposure. */
export interface HeadphoneAudioExposureValue {
  /** Unit: dB(A). Range: 0–200 */
  decibels: number;
}

/** Headphone sound exposure limit event. */
export interface HeadphoneAudioExposureEventValue {

}

/** Heart rate sample. */
export interface HeartRateValue {
  /** Unit: beats/min. Range: 0–300 */
  bpm: number;
}

/** Heart-rate drop one minute after exercise. */
export interface HeartRateRecoveryOneMinuteValue {
  /** Unit: beats/min. Range: 0–300 */
  bpm: number;
}

/** Beat-to-beat timing series behind an HRV measurement. */
export interface HeartbeatSeriesValue {
  /** Unit: count. Range: 0–… */
  count?: number;
  beats: Array<{
    /** Unit: s. Range: 0–… */
    offsetSeconds: number;
    precededByGap: boolean;
  }>;
}

/** Body height. */
export interface HeightValue {
  /** Unit: m. Range: 0–3 */
  meters: number;
}

/** High heart-rate notification event (threshold in metadata HKHeartRateEventThreshold). */
export interface HighHeartRateEventValue {

}

/** Heart rate variability, RMSSD (root mean square of successive differences). Health Connect only. */
export interface HrvRmssdValue {
  /** Unit: ms. Range: 0–… */
  milliseconds: number;
}

/** Heart rate variability, SDNN (standard deviation of NN intervals). Apple platforms only. */
export interface HrvSdnnValue {
  /** Unit: ms. Range: 0–… */
  milliseconds: number;
}

/** Water consumed during the interval. */
export interface HydrationValue {
  /** Unit: L. Range: 0–… */
  liters: number;
}

/** Infrequent menstrual cycles (cycle deviation notification). */
export interface InfrequentMenstrualCyclesValue {

}

/** Inhaler puffs. */
export interface InhalerUsageValue {
  /** Unit: count. Range: 0–… */
  count: number;
}

/** Insulin delivered during the interval. */
export interface InsulinDeliveryValue {
  /** Unit: IU. Range: 0–… */
  internationalUnits: number;
  reason: "basal" | "bolus";
}

/** Spotting / bleeding between periods. */
export interface IntermenstrualBleedingValue {

}

/** Irregular heart rhythm notification event. */
export interface IrregularHeartRhythmEventValue {

}

/** Irregular menstrual cycles (cycle deviation notification). */
export interface IrregularMenstrualCyclesValue {

}

/** Lactation period. */
export interface LactationValue {

}

/** Lean body mass (body mass excluding fat). */
export interface LeanBodyMassValue {
  /** Unit: kg. Range: 0–1000 */
  kilograms: number;
}

/** Low cardio fitness notification event. */
export interface LowCardioFitnessEventValue {

}

/** Low heart-rate notification event. */
export interface LowHeartRateEventValue {

}

/** A logged medication dose event (iOS 26 Medications). The medication list itself comes from listMedications(). */
export interface MedicationDoseValue {
  /** HKMedicationConceptIdentifier */
  medicationId: string;
  medicationName?: string;
  status: "not_interacted" | "notification_not_sent" | "snoozed" | "taken" | "skipped" | "not_logged";
  scheduleType: "as_needed" | "scheduled";
  scheduledAt?: string;
  /** Unit: dose. Range: 0–… */
  scheduledDose?: number;
  /** Unit: dose. Range: 0–… */
  dose?: number;
  unit?: string;
}

/** Menstrual flow observation for a day (or shorter interval). */
export interface MenstruationFlowValue {
  flow: "unknown" | "light" | "medium" | "heavy" | "none";
  /** First day of a cycle (HealthKit metadata only). */
  cycleStart?: boolean;
}

/** A menstrual period as a whole (Health Connect only; HealthKit users derive periods from menstruation_flow with cycleStart). */
export interface MenstruationPeriodValue {

}

/** A mindfulness / meditation session. Duration is end − start. */
export interface MindfulnessSessionValue {
  sessionType?: "meditation" | "breathing" | "movement" | "music" | "unguided" | "other";
  title?: string;
  notes?: string;
}

/** NikeFuel points during the interval (legacy). */
export interface NikeFuelValue {
  /** Unit: count. Range: 0–… */
  count: number;
}

/** Alcoholic drinks consumed during the interval. */
export interface NumberOfAlcoholicBeveragesValue {
  /** Unit: count. Range: 0–… */
  count: number;
}

/** Falls during the interval. */
export interface NumberOfTimesFallenValue {
  /** Unit: count. Range: 0–… */
  count: number;
}

/** Nutrients consumed during the interval (a meal or a day). Every nutrient either platform records; fields a platform lacks are simply absent there. */
export interface NutritionValue {
  /** Unit: kcal. Range: 0–… */
  kilocalories?: number;
  /** Unit: kcal. Range: 0–… */
  energyFromFatKilocalories?: number;
  /** Unit: g. Range: 0–… */
  proteinGrams?: number;
  /** Unit: g. Range: 0–… */
  carbohydrateGrams?: number;
  /** Unit: g. Range: 0–… */
  fatGrams?: number;
  /** Unit: g. Range: 0–… */
  fatSaturatedGrams?: number;
  /** Unit: g. Range: 0–… */
  fatMonounsaturatedGrams?: number;
  /** Unit: g. Range: 0–… */
  fatPolyunsaturatedGrams?: number;
  /** Unit: g. Range: 0–… */
  transFatGrams?: number;
  /** Unit: g. Range: 0–… */
  unsaturatedFatGrams?: number;
  /** Unit: g. Range: 0–… */
  fiberGrams?: number;
  /** Unit: g. Range: 0–… */
  sugarGrams?: number;
  /** Unit: mg. Range: 0–… */
  cholesterolMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  sodiumMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  potassiumMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  calciumMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  ironMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  magnesiumMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  phosphorusMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  zincMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  copperMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  manganeseMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  chlorideMilligrams?: number;
  /** Unit: mcg. Range: 0–… */
  seleniumMicrograms?: number;
  /** Unit: mcg. Range: 0–… */
  iodineMicrograms?: number;
  /** Unit: mcg. Range: 0–… */
  chromiumMicrograms?: number;
  /** Unit: mcg. Range: 0–… */
  molybdenumMicrograms?: number;
  /** Unit: mcg. Range: 0–… */
  vitaminAMicrograms?: number;
  /** Unit: mg. Range: 0–… */
  vitaminB6Milligrams?: number;
  /** Unit: mcg. Range: 0–… */
  vitaminB12Micrograms?: number;
  /** Unit: mg. Range: 0–… */
  vitaminCMilligrams?: number;
  /** Unit: mcg. Range: 0–… */
  vitaminDMicrograms?: number;
  /** Unit: mg. Range: 0–… */
  vitaminEMilligrams?: number;
  /** Unit: mcg. Range: 0–… */
  vitaminKMicrograms?: number;
  /** Unit: mg. Range: 0–… */
  thiaminMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  riboflavinMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  niacinMilligrams?: number;
  /** Unit: mcg. Range: 0–… */
  folateMicrograms?: number;
  /** Unit: mcg. Range: 0–… */
  folicAcidMicrograms?: number;
  /** Unit: mcg. Range: 0–… */
  biotinMicrograms?: number;
  /** Unit: mg. Range: 0–… */
  pantothenicAcidMilligrams?: number;
  /** Unit: mg. Range: 0–… */
  caffeineMilligrams?: number;
  mealType?: MealType;
  name?: string;
}

/** Result of an ovulation (LH / estrogen) test. */
export interface OvulationTestValue {
  result: "negative" | "positive" | "high" | "inconclusive";
}

/** Blood oxygen saturation (SpO2). */
export interface OxygenSaturationValue {
  /** Unit: %. Range: 0–100 */
  percent: number;
}

/** Paddle-sports speed sample. */
export interface PaddleSportsSpeedValue {
  /** Unit: m/s. Range: 0–… */
  metersPerSecond: number;
}

/** Peak expiratory flow rate. */
export interface PeakExpiratoryFlowRateValue {
  /** Unit: L/min. Range: 0–… */
  litersPerMinute: number;
}

/** Peripheral perfusion index. */
export interface PeripheralPerfusionIndexValue {
  /** Unit: %. Range: 0–100 */
  percent: number;
}

/** Persistent intermenstrual bleeding (cycle deviation notification). */
export interface PersistentIntermenstrualBleedingValue {

}

/** Physical effort (MET-like) sample. */
export interface PhysicalEffortValue {
  /** Unit: kcal/(kg·h). Range: 0–… */
  metsEquivalent: number;
}

/** Power output sample, activity-agnostic (Health Connect). HealthKit splits power by activity — see cycling_power and running_power. */
export interface PowerValue {
  /** Unit: W. Range: 0–… */
  watts: number;
}

/** Pregnancy period. */
export interface PregnancyValue {

}

/** Pregnancy test result. */
export interface PregnancyTestValue {
  result: "negative" | "positive" | "indeterminate";
}

/** Progesterone test result. */
export interface ProgesteroneTestValue {
  result: "negative" | "positive" | "indeterminate";
}

/** Prolonged menstrual periods (cycle deviation notification). */
export interface ProlongedMenstrualPeriodsValue {

}

/** Breaths per minute. */
export interface RespiratoryRateValue {
  /** Unit: breaths/min. Range: 0–100 */
  breathsPerMinute: number;
}

/** Resting heart rate estimate. */
export interface RestingHeartRateValue {
  /** Unit: beats/min. Range: 0–300 */
  bpm: number;
}

/** Rowing speed sample. */
export interface RowingSpeedValue {
  /** Unit: m/s. Range: 0–… */
  metersPerSecond: number;
}

/** Ground contact time sample. */
export interface RunningGroundContactTimeValue {
  /** Unit: ms. Range: 0–… */
  milliseconds: number;
}

/** Running power sample. */
export interface RunningPowerValue {
  /** Unit: W. Range: 0–… */
  watts: number;
}

/** Running speed sample. */
export interface RunningSpeedValue {
  /** Unit: m/s. Range: 0–… */
  metersPerSecond: number;
}

/** Running stride length sample. */
export interface RunningStrideLengthValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Vertical oscillation sample. */
export interface RunningVerticalOscillationValue {
  /** Unit: cm. Range: 0–… */
  centimeters: number;
}

/** Sexual activity event. */
export interface SexualActivityValue {
  protectionUsed?: "protected" | "unprotected" | "unknown";
}

/** Estimated six-minute walk test distance. */
export interface SixMinuteWalkDistanceValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Skin temperature expressed as a delta from the user's baseline. Health Connect only. */
export interface SkinTemperatureValue {
  /** Unit: °C. Range: -30–30 */
  deltaCelsius: number;
  /** Unit: °C. Range: 20–50 */
  baselineCelsius?: number;
  measurementLocation?: "finger" | "toe" | "wrist" | "unknown";
}

/** Sleep apnea notification event. */
export interface SleepApneaEventValue {

}

/** A sleep session with optional stage breakdown. Session bounds are the record's start/end; stages partition (part of) that range. */
export interface SleepSessionValue {
  stages: Array<{
    stage: SleepStage;
    start: string;
    end: string;
  }>;
  title?: string;
  notes?: string;
}

/** Speed sample, activity-agnostic (Health Connect). HealthKit splits speed by activity — see walking_speed, running_speed, cycling_speed. */
export interface SpeedValue {
  /** Unit: m/s. Range: 0–… */
  metersPerSecond: number;
}

/** Stair ascent speed sample. */
export interface StairAscentSpeedValue {
  /** Unit: m/s. Range: 0–… */
  metersPerSecond: number;
}

/** Stair descent speed sample. */
export interface StairDescentSpeedValue {
  /** Unit: m/s. Range: 0–… */
  metersPerSecond: number;
}

/** Logged emotion (momentary) or mood (daily) with valence, labels and life-area associations. */
export interface StateOfMindValue {
  kind: "momentary_emotion" | "daily_mood";
  /** Unit: valence. Range: -1–1 */
  valence: number;
  valenceClassification?: "very_unpleasant" | "unpleasant" | "slightly_unpleasant" | "neutral" | "slightly_pleasant" | "pleasant" | "very_pleasant";
  labels?: Array<"amazed" | "amused" | "angry" | "anxious" | "ashamed" | "brave" | "calm" | "content" | "disappointed" | "discouraged" | "disgusted" | "embarrassed" | "excited" | "frustrated" | "grateful" | "guilty" | "happy" | "hopeless" | "irritated" | "jealous" | "joyful" | "lonely" | "passionate" | "peaceful" | "proud" | "relieved" | "sad" | "scared" | "stressed" | "surprised" | "worried" | "annoyed" | "confident" | "drained" | "hopeful" | "indifferent" | "overwhelmed" | "satisfied">;
  associations?: Array<"community" | "current_events" | "dating" | "education" | "family" | "fitness" | "friends" | "health" | "hobbies" | "identity" | "money" | "partner" | "self_care" | "spirituality" | "tasks" | "travel" | "work" | "weather">;
}

/** Number of steps taken during the interval. */
export interface StepsValue {
  /** Unit: count. Range: 0–… */
  count: number;
}

/** Step cadence sample (Health Connect only). */
export interface StepsCadenceValue {
  /** Unit: steps/min. Range: 0–400 */
  stepsPerMinute: number;
}

/** Swimming strokes during the interval. */
export interface SwimmingStrokeCountValue {
  /** Unit: count. Range: 0–… */
  count: number;
}

/** Abdominal cramps (symptom with severity). */
export interface SymptomAbdominalCrampsValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Acne (symptom with severity). */
export interface SymptomAcneValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Appetite changes. */
export interface SymptomAppetiteChangesValue {
  change: "unspecified" | "no_change" | "decreased" | "increased";
}

/** Bladder incontinence (symptom with severity). */
export interface SymptomBladderIncontinenceValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Bloating (symptom with severity). */
export interface SymptomBloatingValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Breast pain (symptom with severity). */
export interface SymptomBreastPainValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Chest tightness or pain (symptom with severity). */
export interface SymptomChestTightnessOrPainValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Chills (symptom with severity). */
export interface SymptomChillsValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Constipation (symptom with severity). */
export interface SymptomConstipationValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Coughing (symptom with severity). */
export interface SymptomCoughingValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Diarrhea (symptom with severity). */
export interface SymptomDiarrheaValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Dizziness (symptom with severity). */
export interface SymptomDizzinessValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Dry skin (symptom with severity). */
export interface SymptomDrySkinValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Fainting (symptom with severity). */
export interface SymptomFaintingValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Fatigue (symptom with severity). */
export interface SymptomFatigueValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Fever (symptom with severity). */
export interface SymptomFeverValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Generalized body ache (symptom with severity). */
export interface SymptomGeneralizedBodyAcheValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Hair loss (symptom with severity). */
export interface SymptomHairLossValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Headache (symptom with severity). */
export interface SymptomHeadacheValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Heartburn (symptom with severity). */
export interface SymptomHeartburnValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Hot flashes (symptom with severity). */
export interface SymptomHotFlashesValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Loss of smell (symptom with severity). */
export interface SymptomLossOfSmellValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Loss of taste (symptom with severity). */
export interface SymptomLossOfTasteValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Lower back pain (symptom with severity). */
export interface SymptomLowerBackPainValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Memory lapse (symptom with severity). */
export interface SymptomMemoryLapseValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Mood changes. */
export interface SymptomMoodChangesValue {
  presence: "present" | "not_present";
}

/** Nausea (symptom with severity). */
export interface SymptomNauseaValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Night sweats (symptom with severity). */
export interface SymptomNightSweatsValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Pelvic pain (symptom with severity). */
export interface SymptomPelvicPainValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Rapid, pounding or fluttering heartbeat (symptom with severity). */
export interface SymptomRapidPoundingOrFlutteringHeartbeatValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Runny nose (symptom with severity). */
export interface SymptomRunnyNoseValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Shortness of breath (symptom with severity). */
export interface SymptomShortnessOfBreathValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Sinus congestion (symptom with severity). */
export interface SymptomSinusCongestionValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Skipped heartbeat (symptom with severity). */
export interface SymptomSkippedHeartbeatValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Sleep changes. */
export interface SymptomSleepChangesValue {
  presence: "present" | "not_present";
}

/** Sore throat (symptom with severity). */
export interface SymptomSoreThroatValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Vaginal dryness (symptom with severity). */
export interface SymptomVaginalDrynessValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Vomiting (symptom with severity). */
export interface SymptomVomitingValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Wheezing (symptom with severity). */
export interface SymptomWheezingValue {
  severity: "unspecified" | "not_present" | "mild" | "moderate" | "severe";
}

/** Minutes spent in daylight. */
export interface TimeInDaylightValue {
  /** Unit: min. Range: 0–… */
  minutes: number;
}

/** Toothbrushing session. */
export interface ToothbrushingEventValue {

}

/** Total energy burned during the interval (active + basal). */
export interface TotalEnergyValue {
  /** Unit: kcal. Range: 0–… */
  kilocalories: number;
}

/** Depth below the water surface. */
export interface UnderwaterDepthValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** UV index exposure. */
export interface UvExposureValue {
  /** Unit: UV index. Range: 0–20 */
  uvIndex: number;
}

/** Maximal oxygen consumption estimate. */
export interface Vo2MaxValue {
  /** Unit: mL/kg/min. Range: 0–100 */
  mlPerKgPerMin: number;
  measurementMethod?: "metabolic_cart" | "heart_rate_ratio" | "cooper_test" | "multistage_fitness_test" | "rockport_fitness_test" | "other";
}

/** Waist circumference. */
export interface WaistCircumferenceValue {
  /** Unit: m. Range: 0–5 */
  meters: number;
}

/** Walking asymmetry (percentage of steps where one foot moves faster than the other). */
export interface WalkingAsymmetryValue {
  /** Unit: %. Range: 0–100 */
  percent: number;
}

/** Time with both feet on the ground while walking, percentage. */
export interface WalkingDoubleSupportValue {
  /** Unit: %. Range: 0–100 */
  percent: number;
}

/** Average heart rate while walking. */
export interface WalkingHeartRateAverageValue {
  /** Unit: beats/min. Range: 0–300 */
  bpm: number;
}

/** Walking speed sample. */
export interface WalkingSpeedValue {
  /** Unit: m/s. Range: 0–… */
  metersPerSecond: number;
}

/** Walking step length sample. */
export interface WalkingStepLengthValue {
  /** Unit: m. Range: 0–… */
  meters: number;
}

/** Water temperature sample. */
export interface WaterTemperatureValue {
  /** Unit: °C. Range: 0–… */
  celsius: number;
}

/** Body mass. */
export interface WeightValue {
  /** Unit: kg. Range: 0–1000 */
  kilograms: number;
}

/** Wheelchair pushes during the interval. */
export interface WheelchairPushesValue {
  /** Unit: count. Range: 0–… */
  count: number;
}

/** User-rated workout effort (1–10). */
export interface WorkoutEffortScoreValue {
  /** Unit: score. Range: 1–10 */
  score: number;
}

// ---------------------------------------------------------------- records

export interface ActiveEnergyRecord extends HealthRecordBase {
  type: "active_energy";
  value: ActiveEnergyValue;
}
export interface ActivitySummaryRecord extends HealthRecordBase {
  type: "activity_summary";
  value: ActivitySummaryValue;
}
export interface AppleExerciseTimeRecord extends HealthRecordBase {
  type: "apple_exercise_time";
  value: AppleExerciseTimeValue;
}
export interface AppleMoveTimeRecord extends HealthRecordBase {
  type: "apple_move_time";
  value: AppleMoveTimeValue;
}
export interface AppleSleepingBreathingDisturbancesRecord extends HealthRecordBase {
  type: "apple_sleeping_breathing_disturbances";
  value: AppleSleepingBreathingDisturbancesValue;
}
export interface AppleSleepingWristTemperatureRecord extends HealthRecordBase {
  type: "apple_sleeping_wrist_temperature";
  value: AppleSleepingWristTemperatureValue;
}
export interface AppleStandHourRecord extends HealthRecordBase {
  type: "apple_stand_hour";
  value: AppleStandHourValue;
}
export interface AppleStandTimeRecord extends HealthRecordBase {
  type: "apple_stand_time";
  value: AppleStandTimeValue;
}
export interface AppleWalkingSteadinessRecord extends HealthRecordBase {
  type: "apple_walking_steadiness";
  value: AppleWalkingSteadinessValue;
}
export interface AppleWalkingSteadinessEventRecord extends HealthRecordBase {
  type: "apple_walking_steadiness_event";
  value: AppleWalkingSteadinessEventValue;
}
export interface AtrialFibrillationBurdenRecord extends HealthRecordBase {
  type: "atrial_fibrillation_burden";
  value: AtrialFibrillationBurdenValue;
}
export interface BasalBodyTemperatureRecord extends HealthRecordBase {
  type: "basal_body_temperature";
  value: BasalBodyTemperatureValue;
}
export interface BasalEnergyRecord extends HealthRecordBase {
  type: "basal_energy";
  value: BasalEnergyValue;
}
export interface BasalMetabolicRateRecord extends HealthRecordBase {
  type: "basal_metabolic_rate";
  value: BasalMetabolicRateValue;
}
export interface BleedingAfterPregnancyRecord extends HealthRecordBase {
  type: "bleeding_after_pregnancy";
  value: BleedingAfterPregnancyValue;
}
export interface BleedingDuringPregnancyRecord extends HealthRecordBase {
  type: "bleeding_during_pregnancy";
  value: BleedingDuringPregnancyValue;
}
export interface BloodAlcoholContentRecord extends HealthRecordBase {
  type: "blood_alcohol_content";
  value: BloodAlcoholContentValue;
}
export interface BloodGlucoseRecord extends HealthRecordBase {
  type: "blood_glucose";
  value: BloodGlucoseValue;
}
export interface BloodPressureRecord extends HealthRecordBase {
  type: "blood_pressure";
  value: BloodPressureValue;
}
export interface BodyFatRecord extends HealthRecordBase {
  type: "body_fat";
  value: BodyFatValue;
}
export interface BodyMassIndexRecord extends HealthRecordBase {
  type: "body_mass_index";
  value: BodyMassIndexValue;
}
export interface BodyTemperatureRecord extends HealthRecordBase {
  type: "body_temperature";
  value: BodyTemperatureValue;
}
export interface BodyWaterMassRecord extends HealthRecordBase {
  type: "body_water_mass";
  value: BodyWaterMassValue;
}
export interface BoneMassRecord extends HealthRecordBase {
  type: "bone_mass";
  value: BoneMassValue;
}
export interface CervicalMucusRecord extends HealthRecordBase {
  type: "cervical_mucus";
  value: CervicalMucusValue;
}
export interface ClinicalAllergyRecord extends HealthRecordBase {
  type: "clinical_allergy";
  value: ClinicalAllergyValue;
}
export interface ClinicalConditionRecord extends HealthRecordBase {
  type: "clinical_condition";
  value: ClinicalConditionValue;
}
export interface ClinicalCoverageRecord extends HealthRecordBase {
  type: "clinical_coverage";
  value: ClinicalCoverageValue;
}
export interface ClinicalImmunizationRecord extends HealthRecordBase {
  type: "clinical_immunization";
  value: ClinicalImmunizationValue;
}
export interface ClinicalLabResultRecord extends HealthRecordBase {
  type: "clinical_lab_result";
  value: ClinicalLabResultValue;
}
export interface ClinicalMedicationRecord extends HealthRecordBase {
  type: "clinical_medication";
  value: ClinicalMedicationValue;
}
export interface ClinicalNoteRecord extends HealthRecordBase {
  type: "clinical_note";
  value: ClinicalNoteValue;
}
export interface ClinicalPersonalDetailsRecord extends HealthRecordBase {
  type: "clinical_personal_details";
  value: ClinicalPersonalDetailsValue;
}
export interface ClinicalPractitionerDetailsRecord extends HealthRecordBase {
  type: "clinical_practitioner_details";
  value: ClinicalPractitionerDetailsValue;
}
export interface ClinicalPregnancyRecord extends HealthRecordBase {
  type: "clinical_pregnancy";
  value: ClinicalPregnancyValue;
}
export interface ClinicalProcedureRecord extends HealthRecordBase {
  type: "clinical_procedure";
  value: ClinicalProcedureValue;
}
export interface ClinicalSocialHistoryRecord extends HealthRecordBase {
  type: "clinical_social_history";
  value: ClinicalSocialHistoryValue;
}
export interface ClinicalVisitRecord extends HealthRecordBase {
  type: "clinical_visit";
  value: ClinicalVisitValue;
}
export interface ClinicalVitalSignRecord extends HealthRecordBase {
  type: "clinical_vital_sign";
  value: ClinicalVitalSignValue;
}
export interface ContraceptiveRecord extends HealthRecordBase {
  type: "contraceptive";
  value: ContraceptiveValue;
}
export interface CrossCountrySkiingSpeedRecord extends HealthRecordBase {
  type: "cross_country_skiing_speed";
  value: CrossCountrySkiingSpeedValue;
}
export interface CyclingCadenceRecord extends HealthRecordBase {
  type: "cycling_cadence";
  value: CyclingCadenceValue;
}
export interface CyclingFunctionalThresholdPowerRecord extends HealthRecordBase {
  type: "cycling_functional_threshold_power";
  value: CyclingFunctionalThresholdPowerValue;
}
export interface CyclingPowerRecord extends HealthRecordBase {
  type: "cycling_power";
  value: CyclingPowerValue;
}
export interface CyclingSpeedRecord extends HealthRecordBase {
  type: "cycling_speed";
  value: CyclingSpeedValue;
}
export interface DistanceRecord extends HealthRecordBase {
  type: "distance";
  value: DistanceValue;
}
export interface DistanceCrossCountrySkiingRecord extends HealthRecordBase {
  type: "distance_cross_country_skiing";
  value: DistanceCrossCountrySkiingValue;
}
export interface DistanceCyclingRecord extends HealthRecordBase {
  type: "distance_cycling";
  value: DistanceCyclingValue;
}
export interface DistanceDownhillSnowSportsRecord extends HealthRecordBase {
  type: "distance_downhill_snow_sports";
  value: DistanceDownhillSnowSportsValue;
}
export interface DistancePaddleSportsRecord extends HealthRecordBase {
  type: "distance_paddle_sports";
  value: DistancePaddleSportsValue;
}
export interface DistanceRowingRecord extends HealthRecordBase {
  type: "distance_rowing";
  value: DistanceRowingValue;
}
export interface DistanceSkatingSportsRecord extends HealthRecordBase {
  type: "distance_skating_sports";
  value: DistanceSkatingSportsValue;
}
export interface DistanceSwimmingRecord extends HealthRecordBase {
  type: "distance_swimming";
  value: DistanceSwimmingValue;
}
export interface DistanceWheelchairRecord extends HealthRecordBase {
  type: "distance_wheelchair";
  value: DistanceWheelchairValue;
}
export interface ElectrocardiogramRecord extends HealthRecordBase {
  type: "electrocardiogram";
  value: ElectrocardiogramValue;
}
export interface ElectrodermalActivityRecord extends HealthRecordBase {
  type: "electrodermal_activity";
  value: ElectrodermalActivityValue;
}
export interface ElevationGainedRecord extends HealthRecordBase {
  type: "elevation_gained";
  value: ElevationGainedValue;
}
export interface EnvironmentalAudioExposureRecord extends HealthRecordBase {
  type: "environmental_audio_exposure";
  value: EnvironmentalAudioExposureValue;
}
export interface EnvironmentalAudioExposureEventRecord extends HealthRecordBase {
  type: "environmental_audio_exposure_event";
  value: EnvironmentalAudioExposureEventValue;
}
export interface EnvironmentalSoundReductionRecord extends HealthRecordBase {
  type: "environmental_sound_reduction";
  value: EnvironmentalSoundReductionValue;
}
export interface EstimatedWorkoutEffortScoreRecord extends HealthRecordBase {
  type: "estimated_workout_effort_score";
  value: EstimatedWorkoutEffortScoreValue;
}
export interface ExerciseRouteRecord extends HealthRecordBase {
  type: "exercise_route";
  value: ExerciseRouteValue;
}
export interface ExerciseSessionRecord extends HealthRecordBase {
  type: "exercise_session";
  value: ExerciseSessionValue;
}
export interface FloorsClimbedRecord extends HealthRecordBase {
  type: "floors_climbed";
  value: FloorsClimbedValue;
}
export interface ForcedExpiratoryVolume1Record extends HealthRecordBase {
  type: "forced_expiratory_volume_1";
  value: ForcedExpiratoryVolume1Value;
}
export interface ForcedVitalCapacityRecord extends HealthRecordBase {
  type: "forced_vital_capacity";
  value: ForcedVitalCapacityValue;
}
export interface HandwashingEventRecord extends HealthRecordBase {
  type: "handwashing_event";
  value: HandwashingEventValue;
}
export interface HeadphoneAudioExposureRecord extends HealthRecordBase {
  type: "headphone_audio_exposure";
  value: HeadphoneAudioExposureValue;
}
export interface HeadphoneAudioExposureEventRecord extends HealthRecordBase {
  type: "headphone_audio_exposure_event";
  value: HeadphoneAudioExposureEventValue;
}
export interface HeartRateRecord extends HealthRecordBase {
  type: "heart_rate";
  value: HeartRateValue;
}
export interface HeartRateRecoveryOneMinuteRecord extends HealthRecordBase {
  type: "heart_rate_recovery_one_minute";
  value: HeartRateRecoveryOneMinuteValue;
}
export interface HeartbeatSeriesRecord extends HealthRecordBase {
  type: "heartbeat_series";
  value: HeartbeatSeriesValue;
}
export interface HeightRecord extends HealthRecordBase {
  type: "height";
  value: HeightValue;
}
export interface HighHeartRateEventRecord extends HealthRecordBase {
  type: "high_heart_rate_event";
  value: HighHeartRateEventValue;
}
export interface HrvRmssdRecord extends HealthRecordBase {
  type: "hrv_rmssd";
  value: HrvRmssdValue;
}
export interface HrvSdnnRecord extends HealthRecordBase {
  type: "hrv_sdnn";
  value: HrvSdnnValue;
}
export interface HydrationRecord extends HealthRecordBase {
  type: "hydration";
  value: HydrationValue;
}
export interface InfrequentMenstrualCyclesRecord extends HealthRecordBase {
  type: "infrequent_menstrual_cycles";
  value: InfrequentMenstrualCyclesValue;
}
export interface InhalerUsageRecord extends HealthRecordBase {
  type: "inhaler_usage";
  value: InhalerUsageValue;
}
export interface InsulinDeliveryRecord extends HealthRecordBase {
  type: "insulin_delivery";
  value: InsulinDeliveryValue;
}
export interface IntermenstrualBleedingRecord extends HealthRecordBase {
  type: "intermenstrual_bleeding";
  value: IntermenstrualBleedingValue;
}
export interface IrregularHeartRhythmEventRecord extends HealthRecordBase {
  type: "irregular_heart_rhythm_event";
  value: IrregularHeartRhythmEventValue;
}
export interface IrregularMenstrualCyclesRecord extends HealthRecordBase {
  type: "irregular_menstrual_cycles";
  value: IrregularMenstrualCyclesValue;
}
export interface LactationRecord extends HealthRecordBase {
  type: "lactation";
  value: LactationValue;
}
export interface LeanBodyMassRecord extends HealthRecordBase {
  type: "lean_body_mass";
  value: LeanBodyMassValue;
}
export interface LowCardioFitnessEventRecord extends HealthRecordBase {
  type: "low_cardio_fitness_event";
  value: LowCardioFitnessEventValue;
}
export interface LowHeartRateEventRecord extends HealthRecordBase {
  type: "low_heart_rate_event";
  value: LowHeartRateEventValue;
}
export interface MedicationDoseRecord extends HealthRecordBase {
  type: "medication_dose";
  value: MedicationDoseValue;
}
export interface MenstruationFlowRecord extends HealthRecordBase {
  type: "menstruation_flow";
  value: MenstruationFlowValue;
}
export interface MenstruationPeriodRecord extends HealthRecordBase {
  type: "menstruation_period";
  value: MenstruationPeriodValue;
}
export interface MindfulnessSessionRecord extends HealthRecordBase {
  type: "mindfulness_session";
  value: MindfulnessSessionValue;
}
export interface NikeFuelRecord extends HealthRecordBase {
  type: "nike_fuel";
  value: NikeFuelValue;
}
export interface NumberOfAlcoholicBeveragesRecord extends HealthRecordBase {
  type: "number_of_alcoholic_beverages";
  value: NumberOfAlcoholicBeveragesValue;
}
export interface NumberOfTimesFallenRecord extends HealthRecordBase {
  type: "number_of_times_fallen";
  value: NumberOfTimesFallenValue;
}
export interface NutritionRecord extends HealthRecordBase {
  type: "nutrition";
  value: NutritionValue;
}
export interface OvulationTestRecord extends HealthRecordBase {
  type: "ovulation_test";
  value: OvulationTestValue;
}
export interface OxygenSaturationRecord extends HealthRecordBase {
  type: "oxygen_saturation";
  value: OxygenSaturationValue;
}
export interface PaddleSportsSpeedRecord extends HealthRecordBase {
  type: "paddle_sports_speed";
  value: PaddleSportsSpeedValue;
}
export interface PeakExpiratoryFlowRateRecord extends HealthRecordBase {
  type: "peak_expiratory_flow_rate";
  value: PeakExpiratoryFlowRateValue;
}
export interface PeripheralPerfusionIndexRecord extends HealthRecordBase {
  type: "peripheral_perfusion_index";
  value: PeripheralPerfusionIndexValue;
}
export interface PersistentIntermenstrualBleedingRecord extends HealthRecordBase {
  type: "persistent_intermenstrual_bleeding";
  value: PersistentIntermenstrualBleedingValue;
}
export interface PhysicalEffortRecord extends HealthRecordBase {
  type: "physical_effort";
  value: PhysicalEffortValue;
}
export interface PowerRecord extends HealthRecordBase {
  type: "power";
  value: PowerValue;
}
export interface PregnancyRecord extends HealthRecordBase {
  type: "pregnancy";
  value: PregnancyValue;
}
export interface PregnancyTestRecord extends HealthRecordBase {
  type: "pregnancy_test";
  value: PregnancyTestValue;
}
export interface ProgesteroneTestRecord extends HealthRecordBase {
  type: "progesterone_test";
  value: ProgesteroneTestValue;
}
export interface ProlongedMenstrualPeriodsRecord extends HealthRecordBase {
  type: "prolonged_menstrual_periods";
  value: ProlongedMenstrualPeriodsValue;
}
export interface RespiratoryRateRecord extends HealthRecordBase {
  type: "respiratory_rate";
  value: RespiratoryRateValue;
}
export interface RestingHeartRateRecord extends HealthRecordBase {
  type: "resting_heart_rate";
  value: RestingHeartRateValue;
}
export interface RowingSpeedRecord extends HealthRecordBase {
  type: "rowing_speed";
  value: RowingSpeedValue;
}
export interface RunningGroundContactTimeRecord extends HealthRecordBase {
  type: "running_ground_contact_time";
  value: RunningGroundContactTimeValue;
}
export interface RunningPowerRecord extends HealthRecordBase {
  type: "running_power";
  value: RunningPowerValue;
}
export interface RunningSpeedRecord extends HealthRecordBase {
  type: "running_speed";
  value: RunningSpeedValue;
}
export interface RunningStrideLengthRecord extends HealthRecordBase {
  type: "running_stride_length";
  value: RunningStrideLengthValue;
}
export interface RunningVerticalOscillationRecord extends HealthRecordBase {
  type: "running_vertical_oscillation";
  value: RunningVerticalOscillationValue;
}
export interface SexualActivityRecord extends HealthRecordBase {
  type: "sexual_activity";
  value: SexualActivityValue;
}
export interface SixMinuteWalkDistanceRecord extends HealthRecordBase {
  type: "six_minute_walk_distance";
  value: SixMinuteWalkDistanceValue;
}
export interface SkinTemperatureRecord extends HealthRecordBase {
  type: "skin_temperature";
  value: SkinTemperatureValue;
}
export interface SleepApneaEventRecord extends HealthRecordBase {
  type: "sleep_apnea_event";
  value: SleepApneaEventValue;
}
export interface SleepSessionRecord extends HealthRecordBase {
  type: "sleep_session";
  value: SleepSessionValue;
}
export interface SpeedRecord extends HealthRecordBase {
  type: "speed";
  value: SpeedValue;
}
export interface StairAscentSpeedRecord extends HealthRecordBase {
  type: "stair_ascent_speed";
  value: StairAscentSpeedValue;
}
export interface StairDescentSpeedRecord extends HealthRecordBase {
  type: "stair_descent_speed";
  value: StairDescentSpeedValue;
}
export interface StateOfMindRecord extends HealthRecordBase {
  type: "state_of_mind";
  value: StateOfMindValue;
}
export interface StepsRecord extends HealthRecordBase {
  type: "steps";
  value: StepsValue;
}
export interface StepsCadenceRecord extends HealthRecordBase {
  type: "steps_cadence";
  value: StepsCadenceValue;
}
export interface SwimmingStrokeCountRecord extends HealthRecordBase {
  type: "swimming_stroke_count";
  value: SwimmingStrokeCountValue;
}
export interface SymptomAbdominalCrampsRecord extends HealthRecordBase {
  type: "symptom_abdominal_cramps";
  value: SymptomAbdominalCrampsValue;
}
export interface SymptomAcneRecord extends HealthRecordBase {
  type: "symptom_acne";
  value: SymptomAcneValue;
}
export interface SymptomAppetiteChangesRecord extends HealthRecordBase {
  type: "symptom_appetite_changes";
  value: SymptomAppetiteChangesValue;
}
export interface SymptomBladderIncontinenceRecord extends HealthRecordBase {
  type: "symptom_bladder_incontinence";
  value: SymptomBladderIncontinenceValue;
}
export interface SymptomBloatingRecord extends HealthRecordBase {
  type: "symptom_bloating";
  value: SymptomBloatingValue;
}
export interface SymptomBreastPainRecord extends HealthRecordBase {
  type: "symptom_breast_pain";
  value: SymptomBreastPainValue;
}
export interface SymptomChestTightnessOrPainRecord extends HealthRecordBase {
  type: "symptom_chest_tightness_or_pain";
  value: SymptomChestTightnessOrPainValue;
}
export interface SymptomChillsRecord extends HealthRecordBase {
  type: "symptom_chills";
  value: SymptomChillsValue;
}
export interface SymptomConstipationRecord extends HealthRecordBase {
  type: "symptom_constipation";
  value: SymptomConstipationValue;
}
export interface SymptomCoughingRecord extends HealthRecordBase {
  type: "symptom_coughing";
  value: SymptomCoughingValue;
}
export interface SymptomDiarrheaRecord extends HealthRecordBase {
  type: "symptom_diarrhea";
  value: SymptomDiarrheaValue;
}
export interface SymptomDizzinessRecord extends HealthRecordBase {
  type: "symptom_dizziness";
  value: SymptomDizzinessValue;
}
export interface SymptomDrySkinRecord extends HealthRecordBase {
  type: "symptom_dry_skin";
  value: SymptomDrySkinValue;
}
export interface SymptomFaintingRecord extends HealthRecordBase {
  type: "symptom_fainting";
  value: SymptomFaintingValue;
}
export interface SymptomFatigueRecord extends HealthRecordBase {
  type: "symptom_fatigue";
  value: SymptomFatigueValue;
}
export interface SymptomFeverRecord extends HealthRecordBase {
  type: "symptom_fever";
  value: SymptomFeverValue;
}
export interface SymptomGeneralizedBodyAcheRecord extends HealthRecordBase {
  type: "symptom_generalized_body_ache";
  value: SymptomGeneralizedBodyAcheValue;
}
export interface SymptomHairLossRecord extends HealthRecordBase {
  type: "symptom_hair_loss";
  value: SymptomHairLossValue;
}
export interface SymptomHeadacheRecord extends HealthRecordBase {
  type: "symptom_headache";
  value: SymptomHeadacheValue;
}
export interface SymptomHeartburnRecord extends HealthRecordBase {
  type: "symptom_heartburn";
  value: SymptomHeartburnValue;
}
export interface SymptomHotFlashesRecord extends HealthRecordBase {
  type: "symptom_hot_flashes";
  value: SymptomHotFlashesValue;
}
export interface SymptomLossOfSmellRecord extends HealthRecordBase {
  type: "symptom_loss_of_smell";
  value: SymptomLossOfSmellValue;
}
export interface SymptomLossOfTasteRecord extends HealthRecordBase {
  type: "symptom_loss_of_taste";
  value: SymptomLossOfTasteValue;
}
export interface SymptomLowerBackPainRecord extends HealthRecordBase {
  type: "symptom_lower_back_pain";
  value: SymptomLowerBackPainValue;
}
export interface SymptomMemoryLapseRecord extends HealthRecordBase {
  type: "symptom_memory_lapse";
  value: SymptomMemoryLapseValue;
}
export interface SymptomMoodChangesRecord extends HealthRecordBase {
  type: "symptom_mood_changes";
  value: SymptomMoodChangesValue;
}
export interface SymptomNauseaRecord extends HealthRecordBase {
  type: "symptom_nausea";
  value: SymptomNauseaValue;
}
export interface SymptomNightSweatsRecord extends HealthRecordBase {
  type: "symptom_night_sweats";
  value: SymptomNightSweatsValue;
}
export interface SymptomPelvicPainRecord extends HealthRecordBase {
  type: "symptom_pelvic_pain";
  value: SymptomPelvicPainValue;
}
export interface SymptomRapidPoundingOrFlutteringHeartbeatRecord extends HealthRecordBase {
  type: "symptom_rapid_pounding_or_fluttering_heartbeat";
  value: SymptomRapidPoundingOrFlutteringHeartbeatValue;
}
export interface SymptomRunnyNoseRecord extends HealthRecordBase {
  type: "symptom_runny_nose";
  value: SymptomRunnyNoseValue;
}
export interface SymptomShortnessOfBreathRecord extends HealthRecordBase {
  type: "symptom_shortness_of_breath";
  value: SymptomShortnessOfBreathValue;
}
export interface SymptomSinusCongestionRecord extends HealthRecordBase {
  type: "symptom_sinus_congestion";
  value: SymptomSinusCongestionValue;
}
export interface SymptomSkippedHeartbeatRecord extends HealthRecordBase {
  type: "symptom_skipped_heartbeat";
  value: SymptomSkippedHeartbeatValue;
}
export interface SymptomSleepChangesRecord extends HealthRecordBase {
  type: "symptom_sleep_changes";
  value: SymptomSleepChangesValue;
}
export interface SymptomSoreThroatRecord extends HealthRecordBase {
  type: "symptom_sore_throat";
  value: SymptomSoreThroatValue;
}
export interface SymptomVaginalDrynessRecord extends HealthRecordBase {
  type: "symptom_vaginal_dryness";
  value: SymptomVaginalDrynessValue;
}
export interface SymptomVomitingRecord extends HealthRecordBase {
  type: "symptom_vomiting";
  value: SymptomVomitingValue;
}
export interface SymptomWheezingRecord extends HealthRecordBase {
  type: "symptom_wheezing";
  value: SymptomWheezingValue;
}
export interface TimeInDaylightRecord extends HealthRecordBase {
  type: "time_in_daylight";
  value: TimeInDaylightValue;
}
export interface ToothbrushingEventRecord extends HealthRecordBase {
  type: "toothbrushing_event";
  value: ToothbrushingEventValue;
}
export interface TotalEnergyRecord extends HealthRecordBase {
  type: "total_energy";
  value: TotalEnergyValue;
}
export interface UnderwaterDepthRecord extends HealthRecordBase {
  type: "underwater_depth";
  value: UnderwaterDepthValue;
}
export interface UvExposureRecord extends HealthRecordBase {
  type: "uv_exposure";
  value: UvExposureValue;
}
export interface Vo2MaxRecord extends HealthRecordBase {
  type: "vo2_max";
  value: Vo2MaxValue;
}
export interface WaistCircumferenceRecord extends HealthRecordBase {
  type: "waist_circumference";
  value: WaistCircumferenceValue;
}
export interface WalkingAsymmetryRecord extends HealthRecordBase {
  type: "walking_asymmetry";
  value: WalkingAsymmetryValue;
}
export interface WalkingDoubleSupportRecord extends HealthRecordBase {
  type: "walking_double_support";
  value: WalkingDoubleSupportValue;
}
export interface WalkingHeartRateAverageRecord extends HealthRecordBase {
  type: "walking_heart_rate_average";
  value: WalkingHeartRateAverageValue;
}
export interface WalkingSpeedRecord extends HealthRecordBase {
  type: "walking_speed";
  value: WalkingSpeedValue;
}
export interface WalkingStepLengthRecord extends HealthRecordBase {
  type: "walking_step_length";
  value: WalkingStepLengthValue;
}
export interface WaterTemperatureRecord extends HealthRecordBase {
  type: "water_temperature";
  value: WaterTemperatureValue;
}
export interface WeightRecord extends HealthRecordBase {
  type: "weight";
  value: WeightValue;
}
export interface WheelchairPushesRecord extends HealthRecordBase {
  type: "wheelchair_pushes";
  value: WheelchairPushesValue;
}
export interface WorkoutEffortScoreRecord extends HealthRecordBase {
  type: "workout_effort_score";
  value: WorkoutEffortScoreValue;
}

export interface HealthValueMap {
  "active_energy": ActiveEnergyValue;
  "activity_summary": ActivitySummaryValue;
  "apple_exercise_time": AppleExerciseTimeValue;
  "apple_move_time": AppleMoveTimeValue;
  "apple_sleeping_breathing_disturbances": AppleSleepingBreathingDisturbancesValue;
  "apple_sleeping_wrist_temperature": AppleSleepingWristTemperatureValue;
  "apple_stand_hour": AppleStandHourValue;
  "apple_stand_time": AppleStandTimeValue;
  "apple_walking_steadiness": AppleWalkingSteadinessValue;
  "apple_walking_steadiness_event": AppleWalkingSteadinessEventValue;
  "atrial_fibrillation_burden": AtrialFibrillationBurdenValue;
  "basal_body_temperature": BasalBodyTemperatureValue;
  "basal_energy": BasalEnergyValue;
  "basal_metabolic_rate": BasalMetabolicRateValue;
  "bleeding_after_pregnancy": BleedingAfterPregnancyValue;
  "bleeding_during_pregnancy": BleedingDuringPregnancyValue;
  "blood_alcohol_content": BloodAlcoholContentValue;
  "blood_glucose": BloodGlucoseValue;
  "blood_pressure": BloodPressureValue;
  "body_fat": BodyFatValue;
  "body_mass_index": BodyMassIndexValue;
  "body_temperature": BodyTemperatureValue;
  "body_water_mass": BodyWaterMassValue;
  "bone_mass": BoneMassValue;
  "cervical_mucus": CervicalMucusValue;
  "clinical_allergy": ClinicalAllergyValue;
  "clinical_condition": ClinicalConditionValue;
  "clinical_coverage": ClinicalCoverageValue;
  "clinical_immunization": ClinicalImmunizationValue;
  "clinical_lab_result": ClinicalLabResultValue;
  "clinical_medication": ClinicalMedicationValue;
  "clinical_note": ClinicalNoteValue;
  "clinical_personal_details": ClinicalPersonalDetailsValue;
  "clinical_practitioner_details": ClinicalPractitionerDetailsValue;
  "clinical_pregnancy": ClinicalPregnancyValue;
  "clinical_procedure": ClinicalProcedureValue;
  "clinical_social_history": ClinicalSocialHistoryValue;
  "clinical_visit": ClinicalVisitValue;
  "clinical_vital_sign": ClinicalVitalSignValue;
  "contraceptive": ContraceptiveValue;
  "cross_country_skiing_speed": CrossCountrySkiingSpeedValue;
  "cycling_cadence": CyclingCadenceValue;
  "cycling_functional_threshold_power": CyclingFunctionalThresholdPowerValue;
  "cycling_power": CyclingPowerValue;
  "cycling_speed": CyclingSpeedValue;
  "distance": DistanceValue;
  "distance_cross_country_skiing": DistanceCrossCountrySkiingValue;
  "distance_cycling": DistanceCyclingValue;
  "distance_downhill_snow_sports": DistanceDownhillSnowSportsValue;
  "distance_paddle_sports": DistancePaddleSportsValue;
  "distance_rowing": DistanceRowingValue;
  "distance_skating_sports": DistanceSkatingSportsValue;
  "distance_swimming": DistanceSwimmingValue;
  "distance_wheelchair": DistanceWheelchairValue;
  "electrocardiogram": ElectrocardiogramValue;
  "electrodermal_activity": ElectrodermalActivityValue;
  "elevation_gained": ElevationGainedValue;
  "environmental_audio_exposure": EnvironmentalAudioExposureValue;
  "environmental_audio_exposure_event": EnvironmentalAudioExposureEventValue;
  "environmental_sound_reduction": EnvironmentalSoundReductionValue;
  "estimated_workout_effort_score": EstimatedWorkoutEffortScoreValue;
  "exercise_route": ExerciseRouteValue;
  "exercise_session": ExerciseSessionValue;
  "floors_climbed": FloorsClimbedValue;
  "forced_expiratory_volume_1": ForcedExpiratoryVolume1Value;
  "forced_vital_capacity": ForcedVitalCapacityValue;
  "handwashing_event": HandwashingEventValue;
  "headphone_audio_exposure": HeadphoneAudioExposureValue;
  "headphone_audio_exposure_event": HeadphoneAudioExposureEventValue;
  "heart_rate": HeartRateValue;
  "heart_rate_recovery_one_minute": HeartRateRecoveryOneMinuteValue;
  "heartbeat_series": HeartbeatSeriesValue;
  "height": HeightValue;
  "high_heart_rate_event": HighHeartRateEventValue;
  "hrv_rmssd": HrvRmssdValue;
  "hrv_sdnn": HrvSdnnValue;
  "hydration": HydrationValue;
  "infrequent_menstrual_cycles": InfrequentMenstrualCyclesValue;
  "inhaler_usage": InhalerUsageValue;
  "insulin_delivery": InsulinDeliveryValue;
  "intermenstrual_bleeding": IntermenstrualBleedingValue;
  "irregular_heart_rhythm_event": IrregularHeartRhythmEventValue;
  "irregular_menstrual_cycles": IrregularMenstrualCyclesValue;
  "lactation": LactationValue;
  "lean_body_mass": LeanBodyMassValue;
  "low_cardio_fitness_event": LowCardioFitnessEventValue;
  "low_heart_rate_event": LowHeartRateEventValue;
  "medication_dose": MedicationDoseValue;
  "menstruation_flow": MenstruationFlowValue;
  "menstruation_period": MenstruationPeriodValue;
  "mindfulness_session": MindfulnessSessionValue;
  "nike_fuel": NikeFuelValue;
  "number_of_alcoholic_beverages": NumberOfAlcoholicBeveragesValue;
  "number_of_times_fallen": NumberOfTimesFallenValue;
  "nutrition": NutritionValue;
  "ovulation_test": OvulationTestValue;
  "oxygen_saturation": OxygenSaturationValue;
  "paddle_sports_speed": PaddleSportsSpeedValue;
  "peak_expiratory_flow_rate": PeakExpiratoryFlowRateValue;
  "peripheral_perfusion_index": PeripheralPerfusionIndexValue;
  "persistent_intermenstrual_bleeding": PersistentIntermenstrualBleedingValue;
  "physical_effort": PhysicalEffortValue;
  "power": PowerValue;
  "pregnancy": PregnancyValue;
  "pregnancy_test": PregnancyTestValue;
  "progesterone_test": ProgesteroneTestValue;
  "prolonged_menstrual_periods": ProlongedMenstrualPeriodsValue;
  "respiratory_rate": RespiratoryRateValue;
  "resting_heart_rate": RestingHeartRateValue;
  "rowing_speed": RowingSpeedValue;
  "running_ground_contact_time": RunningGroundContactTimeValue;
  "running_power": RunningPowerValue;
  "running_speed": RunningSpeedValue;
  "running_stride_length": RunningStrideLengthValue;
  "running_vertical_oscillation": RunningVerticalOscillationValue;
  "sexual_activity": SexualActivityValue;
  "six_minute_walk_distance": SixMinuteWalkDistanceValue;
  "skin_temperature": SkinTemperatureValue;
  "sleep_apnea_event": SleepApneaEventValue;
  "sleep_session": SleepSessionValue;
  "speed": SpeedValue;
  "stair_ascent_speed": StairAscentSpeedValue;
  "stair_descent_speed": StairDescentSpeedValue;
  "state_of_mind": StateOfMindValue;
  "steps": StepsValue;
  "steps_cadence": StepsCadenceValue;
  "swimming_stroke_count": SwimmingStrokeCountValue;
  "symptom_abdominal_cramps": SymptomAbdominalCrampsValue;
  "symptom_acne": SymptomAcneValue;
  "symptom_appetite_changes": SymptomAppetiteChangesValue;
  "symptom_bladder_incontinence": SymptomBladderIncontinenceValue;
  "symptom_bloating": SymptomBloatingValue;
  "symptom_breast_pain": SymptomBreastPainValue;
  "symptom_chest_tightness_or_pain": SymptomChestTightnessOrPainValue;
  "symptom_chills": SymptomChillsValue;
  "symptom_constipation": SymptomConstipationValue;
  "symptom_coughing": SymptomCoughingValue;
  "symptom_diarrhea": SymptomDiarrheaValue;
  "symptom_dizziness": SymptomDizzinessValue;
  "symptom_dry_skin": SymptomDrySkinValue;
  "symptom_fainting": SymptomFaintingValue;
  "symptom_fatigue": SymptomFatigueValue;
  "symptom_fever": SymptomFeverValue;
  "symptom_generalized_body_ache": SymptomGeneralizedBodyAcheValue;
  "symptom_hair_loss": SymptomHairLossValue;
  "symptom_headache": SymptomHeadacheValue;
  "symptom_heartburn": SymptomHeartburnValue;
  "symptom_hot_flashes": SymptomHotFlashesValue;
  "symptom_loss_of_smell": SymptomLossOfSmellValue;
  "symptom_loss_of_taste": SymptomLossOfTasteValue;
  "symptom_lower_back_pain": SymptomLowerBackPainValue;
  "symptom_memory_lapse": SymptomMemoryLapseValue;
  "symptom_mood_changes": SymptomMoodChangesValue;
  "symptom_nausea": SymptomNauseaValue;
  "symptom_night_sweats": SymptomNightSweatsValue;
  "symptom_pelvic_pain": SymptomPelvicPainValue;
  "symptom_rapid_pounding_or_fluttering_heartbeat": SymptomRapidPoundingOrFlutteringHeartbeatValue;
  "symptom_runny_nose": SymptomRunnyNoseValue;
  "symptom_shortness_of_breath": SymptomShortnessOfBreathValue;
  "symptom_sinus_congestion": SymptomSinusCongestionValue;
  "symptom_skipped_heartbeat": SymptomSkippedHeartbeatValue;
  "symptom_sleep_changes": SymptomSleepChangesValue;
  "symptom_sore_throat": SymptomSoreThroatValue;
  "symptom_vaginal_dryness": SymptomVaginalDrynessValue;
  "symptom_vomiting": SymptomVomitingValue;
  "symptom_wheezing": SymptomWheezingValue;
  "time_in_daylight": TimeInDaylightValue;
  "toothbrushing_event": ToothbrushingEventValue;
  "total_energy": TotalEnergyValue;
  "underwater_depth": UnderwaterDepthValue;
  "uv_exposure": UvExposureValue;
  "vo2_max": Vo2MaxValue;
  "waist_circumference": WaistCircumferenceValue;
  "walking_asymmetry": WalkingAsymmetryValue;
  "walking_double_support": WalkingDoubleSupportValue;
  "walking_heart_rate_average": WalkingHeartRateAverageValue;
  "walking_speed": WalkingSpeedValue;
  "walking_step_length": WalkingStepLengthValue;
  "water_temperature": WaterTemperatureValue;
  "weight": WeightValue;
  "wheelchair_pushes": WheelchairPushesValue;
  "workout_effort_score": WorkoutEffortScoreValue;
}
export interface HealthRecordMap {
  "active_energy": ActiveEnergyRecord;
  "activity_summary": ActivitySummaryRecord;
  "apple_exercise_time": AppleExerciseTimeRecord;
  "apple_move_time": AppleMoveTimeRecord;
  "apple_sleeping_breathing_disturbances": AppleSleepingBreathingDisturbancesRecord;
  "apple_sleeping_wrist_temperature": AppleSleepingWristTemperatureRecord;
  "apple_stand_hour": AppleStandHourRecord;
  "apple_stand_time": AppleStandTimeRecord;
  "apple_walking_steadiness": AppleWalkingSteadinessRecord;
  "apple_walking_steadiness_event": AppleWalkingSteadinessEventRecord;
  "atrial_fibrillation_burden": AtrialFibrillationBurdenRecord;
  "basal_body_temperature": BasalBodyTemperatureRecord;
  "basal_energy": BasalEnergyRecord;
  "basal_metabolic_rate": BasalMetabolicRateRecord;
  "bleeding_after_pregnancy": BleedingAfterPregnancyRecord;
  "bleeding_during_pregnancy": BleedingDuringPregnancyRecord;
  "blood_alcohol_content": BloodAlcoholContentRecord;
  "blood_glucose": BloodGlucoseRecord;
  "blood_pressure": BloodPressureRecord;
  "body_fat": BodyFatRecord;
  "body_mass_index": BodyMassIndexRecord;
  "body_temperature": BodyTemperatureRecord;
  "body_water_mass": BodyWaterMassRecord;
  "bone_mass": BoneMassRecord;
  "cervical_mucus": CervicalMucusRecord;
  "clinical_allergy": ClinicalAllergyRecord;
  "clinical_condition": ClinicalConditionRecord;
  "clinical_coverage": ClinicalCoverageRecord;
  "clinical_immunization": ClinicalImmunizationRecord;
  "clinical_lab_result": ClinicalLabResultRecord;
  "clinical_medication": ClinicalMedicationRecord;
  "clinical_note": ClinicalNoteRecord;
  "clinical_personal_details": ClinicalPersonalDetailsRecord;
  "clinical_practitioner_details": ClinicalPractitionerDetailsRecord;
  "clinical_pregnancy": ClinicalPregnancyRecord;
  "clinical_procedure": ClinicalProcedureRecord;
  "clinical_social_history": ClinicalSocialHistoryRecord;
  "clinical_visit": ClinicalVisitRecord;
  "clinical_vital_sign": ClinicalVitalSignRecord;
  "contraceptive": ContraceptiveRecord;
  "cross_country_skiing_speed": CrossCountrySkiingSpeedRecord;
  "cycling_cadence": CyclingCadenceRecord;
  "cycling_functional_threshold_power": CyclingFunctionalThresholdPowerRecord;
  "cycling_power": CyclingPowerRecord;
  "cycling_speed": CyclingSpeedRecord;
  "distance": DistanceRecord;
  "distance_cross_country_skiing": DistanceCrossCountrySkiingRecord;
  "distance_cycling": DistanceCyclingRecord;
  "distance_downhill_snow_sports": DistanceDownhillSnowSportsRecord;
  "distance_paddle_sports": DistancePaddleSportsRecord;
  "distance_rowing": DistanceRowingRecord;
  "distance_skating_sports": DistanceSkatingSportsRecord;
  "distance_swimming": DistanceSwimmingRecord;
  "distance_wheelchair": DistanceWheelchairRecord;
  "electrocardiogram": ElectrocardiogramRecord;
  "electrodermal_activity": ElectrodermalActivityRecord;
  "elevation_gained": ElevationGainedRecord;
  "environmental_audio_exposure": EnvironmentalAudioExposureRecord;
  "environmental_audio_exposure_event": EnvironmentalAudioExposureEventRecord;
  "environmental_sound_reduction": EnvironmentalSoundReductionRecord;
  "estimated_workout_effort_score": EstimatedWorkoutEffortScoreRecord;
  "exercise_route": ExerciseRouteRecord;
  "exercise_session": ExerciseSessionRecord;
  "floors_climbed": FloorsClimbedRecord;
  "forced_expiratory_volume_1": ForcedExpiratoryVolume1Record;
  "forced_vital_capacity": ForcedVitalCapacityRecord;
  "handwashing_event": HandwashingEventRecord;
  "headphone_audio_exposure": HeadphoneAudioExposureRecord;
  "headphone_audio_exposure_event": HeadphoneAudioExposureEventRecord;
  "heart_rate": HeartRateRecord;
  "heart_rate_recovery_one_minute": HeartRateRecoveryOneMinuteRecord;
  "heartbeat_series": HeartbeatSeriesRecord;
  "height": HeightRecord;
  "high_heart_rate_event": HighHeartRateEventRecord;
  "hrv_rmssd": HrvRmssdRecord;
  "hrv_sdnn": HrvSdnnRecord;
  "hydration": HydrationRecord;
  "infrequent_menstrual_cycles": InfrequentMenstrualCyclesRecord;
  "inhaler_usage": InhalerUsageRecord;
  "insulin_delivery": InsulinDeliveryRecord;
  "intermenstrual_bleeding": IntermenstrualBleedingRecord;
  "irregular_heart_rhythm_event": IrregularHeartRhythmEventRecord;
  "irregular_menstrual_cycles": IrregularMenstrualCyclesRecord;
  "lactation": LactationRecord;
  "lean_body_mass": LeanBodyMassRecord;
  "low_cardio_fitness_event": LowCardioFitnessEventRecord;
  "low_heart_rate_event": LowHeartRateEventRecord;
  "medication_dose": MedicationDoseRecord;
  "menstruation_flow": MenstruationFlowRecord;
  "menstruation_period": MenstruationPeriodRecord;
  "mindfulness_session": MindfulnessSessionRecord;
  "nike_fuel": NikeFuelRecord;
  "number_of_alcoholic_beverages": NumberOfAlcoholicBeveragesRecord;
  "number_of_times_fallen": NumberOfTimesFallenRecord;
  "nutrition": NutritionRecord;
  "ovulation_test": OvulationTestRecord;
  "oxygen_saturation": OxygenSaturationRecord;
  "paddle_sports_speed": PaddleSportsSpeedRecord;
  "peak_expiratory_flow_rate": PeakExpiratoryFlowRateRecord;
  "peripheral_perfusion_index": PeripheralPerfusionIndexRecord;
  "persistent_intermenstrual_bleeding": PersistentIntermenstrualBleedingRecord;
  "physical_effort": PhysicalEffortRecord;
  "power": PowerRecord;
  "pregnancy": PregnancyRecord;
  "pregnancy_test": PregnancyTestRecord;
  "progesterone_test": ProgesteroneTestRecord;
  "prolonged_menstrual_periods": ProlongedMenstrualPeriodsRecord;
  "respiratory_rate": RespiratoryRateRecord;
  "resting_heart_rate": RestingHeartRateRecord;
  "rowing_speed": RowingSpeedRecord;
  "running_ground_contact_time": RunningGroundContactTimeRecord;
  "running_power": RunningPowerRecord;
  "running_speed": RunningSpeedRecord;
  "running_stride_length": RunningStrideLengthRecord;
  "running_vertical_oscillation": RunningVerticalOscillationRecord;
  "sexual_activity": SexualActivityRecord;
  "six_minute_walk_distance": SixMinuteWalkDistanceRecord;
  "skin_temperature": SkinTemperatureRecord;
  "sleep_apnea_event": SleepApneaEventRecord;
  "sleep_session": SleepSessionRecord;
  "speed": SpeedRecord;
  "stair_ascent_speed": StairAscentSpeedRecord;
  "stair_descent_speed": StairDescentSpeedRecord;
  "state_of_mind": StateOfMindRecord;
  "steps": StepsRecord;
  "steps_cadence": StepsCadenceRecord;
  "swimming_stroke_count": SwimmingStrokeCountRecord;
  "symptom_abdominal_cramps": SymptomAbdominalCrampsRecord;
  "symptom_acne": SymptomAcneRecord;
  "symptom_appetite_changes": SymptomAppetiteChangesRecord;
  "symptom_bladder_incontinence": SymptomBladderIncontinenceRecord;
  "symptom_bloating": SymptomBloatingRecord;
  "symptom_breast_pain": SymptomBreastPainRecord;
  "symptom_chest_tightness_or_pain": SymptomChestTightnessOrPainRecord;
  "symptom_chills": SymptomChillsRecord;
  "symptom_constipation": SymptomConstipationRecord;
  "symptom_coughing": SymptomCoughingRecord;
  "symptom_diarrhea": SymptomDiarrheaRecord;
  "symptom_dizziness": SymptomDizzinessRecord;
  "symptom_dry_skin": SymptomDrySkinRecord;
  "symptom_fainting": SymptomFaintingRecord;
  "symptom_fatigue": SymptomFatigueRecord;
  "symptom_fever": SymptomFeverRecord;
  "symptom_generalized_body_ache": SymptomGeneralizedBodyAcheRecord;
  "symptom_hair_loss": SymptomHairLossRecord;
  "symptom_headache": SymptomHeadacheRecord;
  "symptom_heartburn": SymptomHeartburnRecord;
  "symptom_hot_flashes": SymptomHotFlashesRecord;
  "symptom_loss_of_smell": SymptomLossOfSmellRecord;
  "symptom_loss_of_taste": SymptomLossOfTasteRecord;
  "symptom_lower_back_pain": SymptomLowerBackPainRecord;
  "symptom_memory_lapse": SymptomMemoryLapseRecord;
  "symptom_mood_changes": SymptomMoodChangesRecord;
  "symptom_nausea": SymptomNauseaRecord;
  "symptom_night_sweats": SymptomNightSweatsRecord;
  "symptom_pelvic_pain": SymptomPelvicPainRecord;
  "symptom_rapid_pounding_or_fluttering_heartbeat": SymptomRapidPoundingOrFlutteringHeartbeatRecord;
  "symptom_runny_nose": SymptomRunnyNoseRecord;
  "symptom_shortness_of_breath": SymptomShortnessOfBreathRecord;
  "symptom_sinus_congestion": SymptomSinusCongestionRecord;
  "symptom_skipped_heartbeat": SymptomSkippedHeartbeatRecord;
  "symptom_sleep_changes": SymptomSleepChangesRecord;
  "symptom_sore_throat": SymptomSoreThroatRecord;
  "symptom_vaginal_dryness": SymptomVaginalDrynessRecord;
  "symptom_vomiting": SymptomVomitingRecord;
  "symptom_wheezing": SymptomWheezingRecord;
  "time_in_daylight": TimeInDaylightRecord;
  "toothbrushing_event": ToothbrushingEventRecord;
  "total_energy": TotalEnergyRecord;
  "underwater_depth": UnderwaterDepthRecord;
  "uv_exposure": UvExposureRecord;
  "vo2_max": Vo2MaxRecord;
  "waist_circumference": WaistCircumferenceRecord;
  "walking_asymmetry": WalkingAsymmetryRecord;
  "walking_double_support": WalkingDoubleSupportRecord;
  "walking_heart_rate_average": WalkingHeartRateAverageRecord;
  "walking_speed": WalkingSpeedRecord;
  "walking_step_length": WalkingStepLengthRecord;
  "water_temperature": WaterTemperatureRecord;
  "weight": WeightRecord;
  "wheelchair_pushes": WheelchairPushesRecord;
  "workout_effort_score": WorkoutEffortScoreRecord;
}
export type HealthRecord = HealthRecordMap[HealthType];
export type HealthRecordOf<T extends HealthType> = HealthRecordMap[T];
export type HealthValueOf<T extends HealthType> = HealthValueMap[T];

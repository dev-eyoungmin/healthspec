// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.

import type { HealthType } from './types.js';

/**
 * A related type on the other platform. `interchangeable: false` means the values measure different things
 * and MUST NOT be converted or summed together — only used to point the developer at the right type.
 */
export interface Counterpart {
  type: HealthType;
  platform: 'healthkit' | 'healthconnect';
  interchangeable: boolean;
  reason: string;
}

/** Types both platforms persist (38). */
export type CrossPlatformType = "active_energy" | "basal_body_temperature" | "blood_glucose" | "blood_pressure" | "body_fat" | "body_temperature" | "cervical_mucus" | "clinical_allergy" | "clinical_condition" | "clinical_immunization" | "clinical_lab_result" | "clinical_medication" | "clinical_procedure" | "clinical_vital_sign" | "cycling_cadence" | "distance" | "exercise_route" | "exercise_session" | "floors_climbed" | "heart_rate" | "height" | "hydration" | "intermenstrual_bleeding" | "lean_body_mass" | "menstruation_flow" | "mindfulness_session" | "nutrition" | "ovulation_test" | "oxygen_saturation" | "respiratory_rate" | "resting_heart_rate" | "sexual_activity" | "sleep_session" | "steps" | "total_energy" | "vo2_max" | "weight" | "wheelchair_pushes";
/** Types only Apple HealthKit persists (129). */
export type IosOnlyType = "activity_summary" | "apple_exercise_time" | "apple_move_time" | "apple_sleeping_breathing_disturbances" | "apple_sleeping_wrist_temperature" | "apple_stand_hour" | "apple_stand_time" | "apple_walking_steadiness" | "apple_walking_steadiness_event" | "atrial_fibrillation_burden" | "basal_energy" | "bleeding_after_pregnancy" | "bleeding_during_pregnancy" | "blood_alcohol_content" | "body_mass_index" | "clinical_coverage" | "clinical_note" | "contraceptive" | "cross_country_skiing_speed" | "cycling_functional_threshold_power" | "cycling_power" | "cycling_speed" | "distance_cross_country_skiing" | "distance_cycling" | "distance_downhill_snow_sports" | "distance_paddle_sports" | "distance_rowing" | "distance_skating_sports" | "distance_swimming" | "distance_wheelchair" | "electrocardiogram" | "electrodermal_activity" | "environmental_audio_exposure" | "environmental_audio_exposure_event" | "environmental_sound_reduction" | "estimated_workout_effort_score" | "forced_expiratory_volume_1" | "forced_vital_capacity" | "handwashing_event" | "headphone_audio_exposure" | "headphone_audio_exposure_event" | "heart_rate_recovery_one_minute" | "heartbeat_series" | "high_heart_rate_event" | "hrv_sdnn" | "infrequent_menstrual_cycles" | "inhaler_usage" | "insulin_delivery" | "irregular_heart_rhythm_event" | "irregular_menstrual_cycles" | "lactation" | "low_cardio_fitness_event" | "low_heart_rate_event" | "medication_dose" | "nike_fuel" | "number_of_alcoholic_beverages" | "number_of_times_fallen" | "paddle_sports_speed" | "peak_expiratory_flow_rate" | "peripheral_perfusion_index" | "persistent_intermenstrual_bleeding" | "physical_effort" | "pregnancy" | "pregnancy_test" | "progesterone_test" | "prolonged_menstrual_periods" | "rowing_speed" | "running_ground_contact_time" | "running_power" | "running_speed" | "running_stride_length" | "running_vertical_oscillation" | "six_minute_walk_distance" | "sleep_apnea_event" | "stair_ascent_speed" | "stair_descent_speed" | "state_of_mind" | "swimming_stroke_count" | "symptom_abdominal_cramps" | "symptom_acne" | "symptom_appetite_changes" | "symptom_bladder_incontinence" | "symptom_bloating" | "symptom_breast_pain" | "symptom_chest_tightness_or_pain" | "symptom_chills" | "symptom_constipation" | "symptom_coughing" | "symptom_diarrhea" | "symptom_dizziness" | "symptom_dry_skin" | "symptom_fainting" | "symptom_fatigue" | "symptom_fever" | "symptom_generalized_body_ache" | "symptom_hair_loss" | "symptom_headache" | "symptom_heartburn" | "symptom_hot_flashes" | "symptom_loss_of_smell" | "symptom_loss_of_taste" | "symptom_lower_back_pain" | "symptom_memory_lapse" | "symptom_mood_changes" | "symptom_nausea" | "symptom_night_sweats" | "symptom_pelvic_pain" | "symptom_rapid_pounding_or_fluttering_heartbeat" | "symptom_runny_nose" | "symptom_shortness_of_breath" | "symptom_sinus_congestion" | "symptom_skipped_heartbeat" | "symptom_sleep_changes" | "symptom_sore_throat" | "symptom_vaginal_dryness" | "symptom_vomiting" | "symptom_wheezing" | "time_in_daylight" | "toothbrushing_event" | "underwater_depth" | "uv_exposure" | "waist_circumference" | "walking_asymmetry" | "walking_double_support" | "walking_heart_rate_average" | "walking_speed" | "walking_step_length" | "water_temperature" | "workout_effort_score";
/** Types only Android Health Connect persists (15). */
export type AndroidOnlyType = "basal_metabolic_rate" | "body_water_mass" | "bone_mass" | "clinical_personal_details" | "clinical_practitioner_details" | "clinical_pregnancy" | "clinical_social_history" | "clinical_visit" | "elevation_gained" | "hrv_rmssd" | "menstruation_period" | "power" | "skin_temperature" | "speed" | "steps_cadence";

/** Value fields only one platform persists. Everything absent here follows the type's platform support. */
export const FIELD_PLATFORMS: Partial<Record<HealthType, Record<string, { ios: boolean; android: boolean }>>> = {
  "activity_summary": {
    "date": {
      "ios": true,
      "android": false
    },
    "activeEnergyKilocalories": {
      "ios": true,
      "android": false
    },
    "activeEnergyGoalKilocalories": {
      "ios": true,
      "android": false
    },
    "exerciseMinutes": {
      "ios": true,
      "android": false
    },
    "exerciseGoalMinutes": {
      "ios": true,
      "android": false
    },
    "standHours": {
      "ios": true,
      "android": false
    },
    "standGoalHours": {
      "ios": true,
      "android": false
    },
    "moveMinutes": {
      "ios": true,
      "android": false
    },
    "moveGoalMinutes": {
      "ios": true,
      "android": false
    },
    "activityMoveMode": {
      "ios": true,
      "android": false
    }
  },
  "apple_exercise_time": {
    "minutes": {
      "ios": true,
      "android": false
    }
  },
  "apple_move_time": {
    "minutes": {
      "ios": true,
      "android": false
    }
  },
  "apple_sleeping_breathing_disturbances": {
    "count": {
      "ios": true,
      "android": false
    }
  },
  "apple_sleeping_wrist_temperature": {
    "celsius": {
      "ios": true,
      "android": false
    }
  },
  "apple_stand_hour": {
    "status": {
      "ios": true,
      "android": false
    }
  },
  "apple_stand_time": {
    "minutes": {
      "ios": true,
      "android": false
    }
  },
  "apple_walking_steadiness": {
    "percent": {
      "ios": true,
      "android": false
    }
  },
  "apple_walking_steadiness_event": {
    "level": {
      "ios": true,
      "android": false
    }
  },
  "atrial_fibrillation_burden": {
    "percent": {
      "ios": true,
      "android": false
    }
  },
  "basal_energy": {
    "kilocalories": {
      "ios": true,
      "android": false
    }
  },
  "basal_metabolic_rate": {
    "kilocaloriesPerDay": {
      "ios": false,
      "android": true
    }
  },
  "bleeding_after_pregnancy": {
    "flow": {
      "ios": true,
      "android": false
    }
  },
  "bleeding_during_pregnancy": {
    "flow": {
      "ios": true,
      "android": false
    }
  },
  "blood_alcohol_content": {
    "percent": {
      "ios": true,
      "android": false
    }
  },
  "blood_glucose": {
    "specimenSource": {
      "ios": false,
      "android": true
    },
    "relationToMeal": {
      "ios": false,
      "android": true
    }
  },
  "blood_pressure": {
    "bodyPosition": {
      "ios": false,
      "android": true
    },
    "measurementLocation": {
      "ios": false,
      "android": true
    }
  },
  "body_mass_index": {
    "value": {
      "ios": true,
      "android": false
    }
  },
  "body_temperature": {
    "measurementLocation": {
      "ios": false,
      "android": true
    }
  },
  "body_water_mass": {
    "kilograms": {
      "ios": false,
      "android": true
    }
  },
  "bone_mass": {
    "kilograms": {
      "ios": false,
      "android": true
    }
  },
  "cervical_mucus": {
    "sensation": {
      "ios": false,
      "android": true
    }
  },
  "clinical_coverage": {
    "resourceType": {
      "ios": true,
      "android": false
    },
    "fhirVersion": {
      "ios": true,
      "android": false
    },
    "displayName": {
      "ios": true,
      "android": false
    },
    "sourceUrl": {
      "ios": true,
      "android": false
    },
    "fhir": {
      "ios": true,
      "android": false
    }
  },
  "clinical_note": {
    "resourceType": {
      "ios": true,
      "android": false
    },
    "fhirVersion": {
      "ios": true,
      "android": false
    },
    "displayName": {
      "ios": true,
      "android": false
    },
    "sourceUrl": {
      "ios": true,
      "android": false
    },
    "fhir": {
      "ios": true,
      "android": false
    }
  },
  "clinical_personal_details": {
    "resourceType": {
      "ios": false,
      "android": true
    },
    "fhirVersion": {
      "ios": false,
      "android": true
    },
    "displayName": {
      "ios": false,
      "android": true
    },
    "sourceUrl": {
      "ios": false,
      "android": true
    },
    "fhir": {
      "ios": false,
      "android": true
    }
  },
  "clinical_practitioner_details": {
    "resourceType": {
      "ios": false,
      "android": true
    },
    "fhirVersion": {
      "ios": false,
      "android": true
    },
    "displayName": {
      "ios": false,
      "android": true
    },
    "sourceUrl": {
      "ios": false,
      "android": true
    },
    "fhir": {
      "ios": false,
      "android": true
    }
  },
  "clinical_pregnancy": {
    "resourceType": {
      "ios": false,
      "android": true
    },
    "fhirVersion": {
      "ios": false,
      "android": true
    },
    "displayName": {
      "ios": false,
      "android": true
    },
    "sourceUrl": {
      "ios": false,
      "android": true
    },
    "fhir": {
      "ios": false,
      "android": true
    }
  },
  "clinical_social_history": {
    "resourceType": {
      "ios": false,
      "android": true
    },
    "fhirVersion": {
      "ios": false,
      "android": true
    },
    "displayName": {
      "ios": false,
      "android": true
    },
    "sourceUrl": {
      "ios": false,
      "android": true
    },
    "fhir": {
      "ios": false,
      "android": true
    }
  },
  "clinical_visit": {
    "resourceType": {
      "ios": false,
      "android": true
    },
    "fhirVersion": {
      "ios": false,
      "android": true
    },
    "displayName": {
      "ios": false,
      "android": true
    },
    "sourceUrl": {
      "ios": false,
      "android": true
    },
    "fhir": {
      "ios": false,
      "android": true
    }
  },
  "contraceptive": {
    "method": {
      "ios": true,
      "android": false
    }
  },
  "cross_country_skiing_speed": {
    "metersPerSecond": {
      "ios": true,
      "android": false
    }
  },
  "cycling_functional_threshold_power": {
    "watts": {
      "ios": true,
      "android": false
    }
  },
  "cycling_power": {
    "watts": {
      "ios": true,
      "android": false
    }
  },
  "cycling_speed": {
    "metersPerSecond": {
      "ios": true,
      "android": false
    }
  },
  "distance_cross_country_skiing": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "distance_cycling": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "distance_downhill_snow_sports": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "distance_paddle_sports": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "distance_rowing": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "distance_skating_sports": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "distance_swimming": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "distance_wheelchair": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "electrocardiogram": {
    "classification": {
      "ios": true,
      "android": false
    },
    "symptomsStatus": {
      "ios": true,
      "android": false
    },
    "averageBpm": {
      "ios": true,
      "android": false
    },
    "samplingFrequencyHz": {
      "ios": true,
      "android": false
    },
    "voltageCount": {
      "ios": true,
      "android": false
    }
  },
  "electrodermal_activity": {
    "microsiemens": {
      "ios": true,
      "android": false
    }
  },
  "elevation_gained": {
    "meters": {
      "ios": false,
      "android": true
    }
  },
  "environmental_audio_exposure": {
    "decibels": {
      "ios": true,
      "android": false
    }
  },
  "environmental_sound_reduction": {
    "decibels": {
      "ios": true,
      "android": false
    }
  },
  "estimated_workout_effort_score": {
    "score": {
      "ios": true,
      "android": false
    }
  },
  "exercise_session": {
    "title": {
      "ios": false,
      "android": true
    },
    "notes": {
      "ios": false,
      "android": true
    }
  },
  "forced_expiratory_volume_1": {
    "liters": {
      "ios": true,
      "android": false
    }
  },
  "forced_vital_capacity": {
    "liters": {
      "ios": true,
      "android": false
    }
  },
  "headphone_audio_exposure": {
    "decibels": {
      "ios": true,
      "android": false
    }
  },
  "heart_rate_recovery_one_minute": {
    "bpm": {
      "ios": true,
      "android": false
    }
  },
  "heartbeat_series": {
    "count": {
      "ios": true,
      "android": false
    },
    "beats": {
      "ios": true,
      "android": false
    }
  },
  "hrv_rmssd": {
    "milliseconds": {
      "ios": false,
      "android": true
    }
  },
  "hrv_sdnn": {
    "milliseconds": {
      "ios": true,
      "android": false
    }
  },
  "inhaler_usage": {
    "count": {
      "ios": true,
      "android": false
    }
  },
  "insulin_delivery": {
    "internationalUnits": {
      "ios": true,
      "android": false
    },
    "reason": {
      "ios": true,
      "android": false
    }
  },
  "medication_dose": {
    "medicationId": {
      "ios": true,
      "android": false
    },
    "medicationName": {
      "ios": true,
      "android": false
    },
    "status": {
      "ios": true,
      "android": false
    },
    "scheduleType": {
      "ios": true,
      "android": false
    },
    "scheduledAt": {
      "ios": true,
      "android": false
    },
    "scheduledDose": {
      "ios": true,
      "android": false
    },
    "dose": {
      "ios": true,
      "android": false
    },
    "unit": {
      "ios": true,
      "android": false
    }
  },
  "menstruation_flow": {
    "cycleStart": {
      "ios": true,
      "android": false
    }
  },
  "mindfulness_session": {
    "title": {
      "ios": false,
      "android": true
    },
    "notes": {
      "ios": false,
      "android": true
    }
  },
  "nike_fuel": {
    "count": {
      "ios": true,
      "android": false
    }
  },
  "number_of_alcoholic_beverages": {
    "count": {
      "ios": true,
      "android": false
    }
  },
  "number_of_times_fallen": {
    "count": {
      "ios": true,
      "android": false
    }
  },
  "nutrition": {
    "energyFromFatKilocalories": {
      "ios": false,
      "android": true
    },
    "transFatGrams": {
      "ios": false,
      "android": true
    },
    "unsaturatedFatGrams": {
      "ios": false,
      "android": true
    },
    "folicAcidMicrograms": {
      "ios": false,
      "android": true
    }
  },
  "paddle_sports_speed": {
    "metersPerSecond": {
      "ios": true,
      "android": false
    }
  },
  "peak_expiratory_flow_rate": {
    "litersPerMinute": {
      "ios": true,
      "android": false
    }
  },
  "peripheral_perfusion_index": {
    "percent": {
      "ios": true,
      "android": false
    }
  },
  "physical_effort": {
    "metsEquivalent": {
      "ios": true,
      "android": false
    }
  },
  "power": {
    "watts": {
      "ios": false,
      "android": true
    }
  },
  "pregnancy_test": {
    "result": {
      "ios": true,
      "android": false
    }
  },
  "progesterone_test": {
    "result": {
      "ios": true,
      "android": false
    }
  },
  "rowing_speed": {
    "metersPerSecond": {
      "ios": true,
      "android": false
    }
  },
  "running_ground_contact_time": {
    "milliseconds": {
      "ios": true,
      "android": false
    }
  },
  "running_power": {
    "watts": {
      "ios": true,
      "android": false
    }
  },
  "running_speed": {
    "metersPerSecond": {
      "ios": true,
      "android": false
    }
  },
  "running_stride_length": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "running_vertical_oscillation": {
    "centimeters": {
      "ios": true,
      "android": false
    }
  },
  "six_minute_walk_distance": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "skin_temperature": {
    "deltaCelsius": {
      "ios": false,
      "android": true
    },
    "baselineCelsius": {
      "ios": false,
      "android": true
    },
    "measurementLocation": {
      "ios": false,
      "android": true
    }
  },
  "sleep_session": {
    "title": {
      "ios": false,
      "android": true
    },
    "notes": {
      "ios": false,
      "android": true
    }
  },
  "speed": {
    "metersPerSecond": {
      "ios": false,
      "android": true
    }
  },
  "stair_ascent_speed": {
    "metersPerSecond": {
      "ios": true,
      "android": false
    }
  },
  "stair_descent_speed": {
    "metersPerSecond": {
      "ios": true,
      "android": false
    }
  },
  "state_of_mind": {
    "kind": {
      "ios": true,
      "android": false
    },
    "valence": {
      "ios": true,
      "android": false
    },
    "valenceClassification": {
      "ios": true,
      "android": false
    },
    "labels": {
      "ios": true,
      "android": false
    },
    "associations": {
      "ios": true,
      "android": false
    }
  },
  "steps_cadence": {
    "stepsPerMinute": {
      "ios": false,
      "android": true
    }
  },
  "swimming_stroke_count": {
    "count": {
      "ios": true,
      "android": false
    }
  },
  "symptom_abdominal_cramps": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_acne": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_appetite_changes": {
    "change": {
      "ios": true,
      "android": false
    }
  },
  "symptom_bladder_incontinence": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_bloating": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_breast_pain": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_chest_tightness_or_pain": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_chills": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_constipation": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_coughing": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_diarrhea": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_dizziness": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_dry_skin": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_fainting": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_fatigue": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_fever": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_generalized_body_ache": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_hair_loss": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_headache": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_heartburn": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_hot_flashes": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_loss_of_smell": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_loss_of_taste": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_lower_back_pain": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_memory_lapse": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_mood_changes": {
    "presence": {
      "ios": true,
      "android": false
    }
  },
  "symptom_nausea": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_night_sweats": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_pelvic_pain": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_rapid_pounding_or_fluttering_heartbeat": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_runny_nose": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_shortness_of_breath": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_sinus_congestion": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_skipped_heartbeat": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_sleep_changes": {
    "presence": {
      "ios": true,
      "android": false
    }
  },
  "symptom_sore_throat": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_vaginal_dryness": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_vomiting": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "symptom_wheezing": {
    "severity": {
      "ios": true,
      "android": false
    }
  },
  "time_in_daylight": {
    "minutes": {
      "ios": true,
      "android": false
    }
  },
  "underwater_depth": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "uv_exposure": {
    "uvIndex": {
      "ios": true,
      "android": false
    }
  },
  "vo2_max": {
    "measurementMethod": {
      "ios": false,
      "android": true
    }
  },
  "waist_circumference": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "walking_asymmetry": {
    "percent": {
      "ios": true,
      "android": false
    }
  },
  "walking_double_support": {
    "percent": {
      "ios": true,
      "android": false
    }
  },
  "walking_heart_rate_average": {
    "bpm": {
      "ios": true,
      "android": false
    }
  },
  "walking_speed": {
    "metersPerSecond": {
      "ios": true,
      "android": false
    }
  },
  "walking_step_length": {
    "meters": {
      "ios": true,
      "android": false
    }
  },
  "water_temperature": {
    "celsius": {
      "ios": true,
      "android": false
    }
  },
  "workout_effort_score": {
    "score": {
      "ios": true,
      "android": false
    }
  }
};

export const TYPE_COUNTERPARTS: Partial<Record<HealthType, Counterpart[]>> = {
  "apple_sleeping_wrist_temperature": [
    {
      "type": "skin_temperature",
      "platform": "healthconnect",
      "interchangeable": false,
      "reason": "HealthKit stores an absolute temperature; Health Connect stores a delta from the user baseline."
    }
  ],
  "basal_energy": [
    {
      "type": "basal_metabolic_rate",
      "platform": "healthconnect",
      "interchangeable": false,
      "reason": "basal_energy is energy accumulated over an interval (kcal); basal_metabolic_rate is a rate (kcal/day). Converting needs the interval length and assumes a constant rate."
    }
  ],
  "basal_metabolic_rate": [
    {
      "type": "basal_energy",
      "platform": "healthkit",
      "interchangeable": false,
      "reason": "A rate (kcal/day) cannot be compared with interval energy (kcal) without assuming the rate held for the whole interval."
    }
  ],
  "cycling_cadence": [
    {
      "type": "steps_cadence",
      "platform": "healthconnect",
      "interchangeable": false,
      "reason": "Pedalling cadence (rpm) and step cadence (steps/min) measure different motions."
    }
  ],
  "cycling_power": [
    {
      "type": "power",
      "platform": "healthconnect",
      "interchangeable": true,
      "reason": "Health Connect keeps a single activity-agnostic PowerRecord."
    }
  ],
  "cycling_speed": [
    {
      "type": "speed",
      "platform": "healthconnect",
      "interchangeable": true,
      "reason": "Health Connect keeps a single activity-agnostic SpeedRecord."
    }
  ],
  "distance": [
    {
      "type": "distance_cycling",
      "platform": "healthkit",
      "interchangeable": false,
      "reason": "HealthKit splits distance by activity and `distance` maps to walking/running only; summing both double-counts."
    },
    {
      "type": "distance_swimming",
      "platform": "healthkit",
      "interchangeable": false,
      "reason": "HealthKit splits distance by activity and `distance` maps to walking/running only; summing both double-counts."
    },
    {
      "type": "distance_wheelchair",
      "platform": "healthkit",
      "interchangeable": false,
      "reason": "HealthKit splits distance by activity and `distance` maps to walking/running only; summing both double-counts."
    }
  ],
  "distance_cycling": [
    {
      "type": "distance",
      "platform": "healthconnect",
      "interchangeable": false,
      "reason": "Health Connect has one DistanceRecord for every activity; it already includes cycling distance."
    }
  ],
  "distance_swimming": [
    {
      "type": "distance",
      "platform": "healthconnect",
      "interchangeable": false,
      "reason": "Health Connect has one DistanceRecord for every activity; it already includes swimming distance."
    }
  ],
  "distance_wheelchair": [
    {
      "type": "distance",
      "platform": "healthconnect",
      "interchangeable": false,
      "reason": "Health Connect has one DistanceRecord for every activity; it already includes wheelchair distance."
    }
  ],
  "elevation_gained": [
    {
      "type": "floors_climbed",
      "platform": "healthkit",
      "interchangeable": false,
      "reason": "HealthKit records flights climbed, not metres gained; a flight is a fixed approximation."
    }
  ],
  "hrv_rmssd": [
    {
      "type": "hrv_sdnn",
      "platform": "healthkit",
      "interchangeable": false,
      "reason": "RMSSD and SDNN are different statistics computed from the same intervals; neither can be derived from the other."
    }
  ],
  "hrv_sdnn": [
    {
      "type": "hrv_rmssd",
      "platform": "healthconnect",
      "interchangeable": false,
      "reason": "SDNN and RMSSD are different statistics computed from the same intervals; neither can be derived from the other."
    }
  ],
  "menstruation_period": [
    {
      "type": "menstruation_flow",
      "platform": "healthkit",
      "interchangeable": false,
      "reason": "HealthKit has no period record; derive periods by grouping menstruation_flow entries whose cycleStart is true."
    }
  ],
  "power": [
    {
      "type": "cycling_power",
      "platform": "healthkit",
      "interchangeable": true,
      "reason": "HealthKit splits power by activity; use cycling_power for cycling sessions."
    },
    {
      "type": "running_power",
      "platform": "healthkit",
      "interchangeable": true,
      "reason": "HealthKit splits power by activity; use running_power for running sessions."
    }
  ],
  "running_power": [
    {
      "type": "power",
      "platform": "healthconnect",
      "interchangeable": true,
      "reason": "Health Connect keeps a single activity-agnostic PowerRecord."
    }
  ],
  "running_speed": [
    {
      "type": "speed",
      "platform": "healthconnect",
      "interchangeable": true,
      "reason": "Health Connect keeps a single activity-agnostic SpeedRecord."
    }
  ],
  "skin_temperature": [
    {
      "type": "apple_sleeping_wrist_temperature",
      "platform": "healthkit",
      "interchangeable": false,
      "reason": "Health Connect stores a delta from the user baseline; HealthKit stores an absolute nightly wrist temperature."
    }
  ],
  "speed": [
    {
      "type": "walking_speed",
      "platform": "healthkit",
      "interchangeable": true,
      "reason": "HealthKit splits speed by activity."
    },
    {
      "type": "running_speed",
      "platform": "healthkit",
      "interchangeable": true,
      "reason": "HealthKit splits speed by activity."
    },
    {
      "type": "cycling_speed",
      "platform": "healthkit",
      "interchangeable": true,
      "reason": "HealthKit splits speed by activity."
    }
  ],
  "steps_cadence": [
    {
      "type": "cycling_cadence",
      "platform": "healthkit",
      "interchangeable": false,
      "reason": "Step cadence (steps/min) and pedalling cadence (rpm) measure different motions."
    }
  ],
  "walking_speed": [
    {
      "type": "speed",
      "platform": "healthconnect",
      "interchangeable": true,
      "reason": "Health Connect keeps a single activity-agnostic SpeedRecord."
    }
  ]
};

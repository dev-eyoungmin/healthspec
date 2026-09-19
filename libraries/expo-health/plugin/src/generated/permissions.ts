// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.

export type HealthType = "active_energy" | "activity_summary" | "apple_exercise_time" | "apple_move_time" | "apple_sleeping_breathing_disturbances" | "apple_sleeping_wrist_temperature" | "apple_stand_hour" | "apple_stand_time" | "apple_walking_steadiness" | "apple_walking_steadiness_event" | "atrial_fibrillation_burden" | "basal_body_temperature" | "basal_energy" | "basal_metabolic_rate" | "bleeding_after_pregnancy" | "bleeding_during_pregnancy" | "blood_alcohol_content" | "blood_glucose" | "blood_pressure" | "body_fat" | "body_mass_index" | "body_temperature" | "body_water_mass" | "bone_mass" | "cervical_mucus" | "clinical_allergy" | "clinical_condition" | "clinical_coverage" | "clinical_immunization" | "clinical_lab_result" | "clinical_medication" | "clinical_note" | "clinical_personal_details" | "clinical_practitioner_details" | "clinical_pregnancy" | "clinical_procedure" | "clinical_social_history" | "clinical_visit" | "clinical_vital_sign" | "contraceptive" | "cross_country_skiing_speed" | "cycling_cadence" | "cycling_functional_threshold_power" | "cycling_power" | "cycling_speed" | "distance" | "distance_cross_country_skiing" | "distance_cycling" | "distance_downhill_snow_sports" | "distance_paddle_sports" | "distance_rowing" | "distance_skating_sports" | "distance_swimming" | "distance_wheelchair" | "electrocardiogram" | "electrodermal_activity" | "elevation_gained" | "environmental_audio_exposure" | "environmental_audio_exposure_event" | "environmental_sound_reduction" | "estimated_workout_effort_score" | "exercise_route" | "exercise_session" | "floors_climbed" | "forced_expiratory_volume_1" | "forced_vital_capacity" | "handwashing_event" | "headphone_audio_exposure" | "headphone_audio_exposure_event" | "heart_rate" | "heart_rate_recovery_one_minute" | "heartbeat_series" | "height" | "high_heart_rate_event" | "hrv_rmssd" | "hrv_sdnn" | "hydration" | "infrequent_menstrual_cycles" | "inhaler_usage" | "insulin_delivery" | "intermenstrual_bleeding" | "irregular_heart_rhythm_event" | "irregular_menstrual_cycles" | "lactation" | "lean_body_mass" | "low_cardio_fitness_event" | "low_heart_rate_event" | "medication_dose" | "menstruation_flow" | "menstruation_period" | "mindfulness_session" | "nike_fuel" | "number_of_alcoholic_beverages" | "number_of_times_fallen" | "nutrition" | "ovulation_test" | "oxygen_saturation" | "paddle_sports_speed" | "peak_expiratory_flow_rate" | "peripheral_perfusion_index" | "persistent_intermenstrual_bleeding" | "physical_effort" | "power" | "pregnancy" | "pregnancy_test" | "progesterone_test" | "prolonged_menstrual_periods" | "respiratory_rate" | "resting_heart_rate" | "rowing_speed" | "running_ground_contact_time" | "running_power" | "running_speed" | "running_stride_length" | "running_vertical_oscillation" | "sexual_activity" | "six_minute_walk_distance" | "skin_temperature" | "sleep_apnea_event" | "sleep_session" | "speed" | "stair_ascent_speed" | "stair_descent_speed" | "state_of_mind" | "steps" | "steps_cadence" | "swimming_stroke_count" | "symptom_abdominal_cramps" | "symptom_acne" | "symptom_appetite_changes" | "symptom_bladder_incontinence" | "symptom_bloating" | "symptom_breast_pain" | "symptom_chest_tightness_or_pain" | "symptom_chills" | "symptom_constipation" | "symptom_coughing" | "symptom_diarrhea" | "symptom_dizziness" | "symptom_dry_skin" | "symptom_fainting" | "symptom_fatigue" | "symptom_fever" | "symptom_generalized_body_ache" | "symptom_hair_loss" | "symptom_headache" | "symptom_heartburn" | "symptom_hot_flashes" | "symptom_loss_of_smell" | "symptom_loss_of_taste" | "symptom_lower_back_pain" | "symptom_memory_lapse" | "symptom_mood_changes" | "symptom_nausea" | "symptom_night_sweats" | "symptom_pelvic_pain" | "symptom_rapid_pounding_or_fluttering_heartbeat" | "symptom_runny_nose" | "symptom_shortness_of_breath" | "symptom_sinus_congestion" | "symptom_skipped_heartbeat" | "symptom_sleep_changes" | "symptom_sore_throat" | "symptom_vaginal_dryness" | "symptom_vomiting" | "symptom_wheezing" | "time_in_daylight" | "toothbrushing_event" | "total_energy" | "underwater_depth" | "uv_exposure" | "vo2_max" | "waist_circumference" | "walking_asymmetry" | "walking_double_support" | "walking_heart_rate_average" | "walking_speed" | "walking_step_length" | "water_temperature" | "weight" | "wheelchair_pushes" | "workout_effort_score";

export interface TypePermissions {
  healthkit: { identifiers: string[]; write: boolean } | null;
  healthconnect: { read: string | null; write: string | null } | null;
}

export const HEALTH_TYPES: readonly HealthType[] = ["active_energy","activity_summary","apple_exercise_time","apple_move_time","apple_sleeping_breathing_disturbances","apple_sleeping_wrist_temperature","apple_stand_hour","apple_stand_time","apple_walking_steadiness","apple_walking_steadiness_event","atrial_fibrillation_burden","basal_body_temperature","basal_energy","basal_metabolic_rate","bleeding_after_pregnancy","bleeding_during_pregnancy","blood_alcohol_content","blood_glucose","blood_pressure","body_fat","body_mass_index","body_temperature","body_water_mass","bone_mass","cervical_mucus","clinical_allergy","clinical_condition","clinical_coverage","clinical_immunization","clinical_lab_result","clinical_medication","clinical_note","clinical_personal_details","clinical_practitioner_details","clinical_pregnancy","clinical_procedure","clinical_social_history","clinical_visit","clinical_vital_sign","contraceptive","cross_country_skiing_speed","cycling_cadence","cycling_functional_threshold_power","cycling_power","cycling_speed","distance","distance_cross_country_skiing","distance_cycling","distance_downhill_snow_sports","distance_paddle_sports","distance_rowing","distance_skating_sports","distance_swimming","distance_wheelchair","electrocardiogram","electrodermal_activity","elevation_gained","environmental_audio_exposure","environmental_audio_exposure_event","environmental_sound_reduction","estimated_workout_effort_score","exercise_route","exercise_session","floors_climbed","forced_expiratory_volume_1","forced_vital_capacity","handwashing_event","headphone_audio_exposure","headphone_audio_exposure_event","heart_rate","heart_rate_recovery_one_minute","heartbeat_series","height","high_heart_rate_event","hrv_rmssd","hrv_sdnn","hydration","infrequent_menstrual_cycles","inhaler_usage","insulin_delivery","intermenstrual_bleeding","irregular_heart_rhythm_event","irregular_menstrual_cycles","lactation","lean_body_mass","low_cardio_fitness_event","low_heart_rate_event","medication_dose","menstruation_flow","menstruation_period","mindfulness_session","nike_fuel","number_of_alcoholic_beverages","number_of_times_fallen","nutrition","ovulation_test","oxygen_saturation","paddle_sports_speed","peak_expiratory_flow_rate","peripheral_perfusion_index","persistent_intermenstrual_bleeding","physical_effort","power","pregnancy","pregnancy_test","progesterone_test","prolonged_menstrual_periods","respiratory_rate","resting_heart_rate","rowing_speed","running_ground_contact_time","running_power","running_speed","running_stride_length","running_vertical_oscillation","sexual_activity","six_minute_walk_distance","skin_temperature","sleep_apnea_event","sleep_session","speed","stair_ascent_speed","stair_descent_speed","state_of_mind","steps","steps_cadence","swimming_stroke_count","symptom_abdominal_cramps","symptom_acne","symptom_appetite_changes","symptom_bladder_incontinence","symptom_bloating","symptom_breast_pain","symptom_chest_tightness_or_pain","symptom_chills","symptom_constipation","symptom_coughing","symptom_diarrhea","symptom_dizziness","symptom_dry_skin","symptom_fainting","symptom_fatigue","symptom_fever","symptom_generalized_body_ache","symptom_hair_loss","symptom_headache","symptom_heartburn","symptom_hot_flashes","symptom_loss_of_smell","symptom_loss_of_taste","symptom_lower_back_pain","symptom_memory_lapse","symptom_mood_changes","symptom_nausea","symptom_night_sweats","symptom_pelvic_pain","symptom_rapid_pounding_or_fluttering_heartbeat","symptom_runny_nose","symptom_shortness_of_breath","symptom_sinus_congestion","symptom_skipped_heartbeat","symptom_sleep_changes","symptom_sore_throat","symptom_vaginal_dryness","symptom_vomiting","symptom_wheezing","time_in_daylight","toothbrushing_event","total_energy","underwater_depth","uv_exposure","vo2_max","waist_circumference","walking_asymmetry","walking_double_support","walking_heart_rate_average","walking_speed","walking_step_length","water_temperature","weight","wheelchair_pushes","workout_effort_score"];

export const PERMISSIONS: Record<HealthType, TypePermissions> = {
  "active_energy": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierActiveEnergyBurned"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_ACTIVE_CALORIES_BURNED",
      "write": "android.permission.health.WRITE_ACTIVE_CALORIES_BURNED"
    }
  },
  "activity_summary": {
    "healthkit": {
      "identifiers": [
        "HKActivitySummaryTypeIdentifier"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "apple_exercise_time": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierAppleExerciseTime"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "apple_move_time": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierAppleMoveTime"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "apple_sleeping_breathing_disturbances": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "apple_sleeping_wrist_temperature": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierAppleSleepingWristTemperature"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "apple_stand_hour": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierAppleStandHour"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "apple_stand_time": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierAppleStandTime"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "apple_walking_steadiness": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierAppleWalkingSteadiness"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "apple_walking_steadiness_event": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierAppleWalkingSteadinessEvent"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "atrial_fibrillation_burden": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierAtrialFibrillationBurden"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "basal_body_temperature": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierBasalBodyTemperature"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_BASAL_BODY_TEMPERATURE",
      "write": "android.permission.health.WRITE_BASAL_BODY_TEMPERATURE"
    }
  },
  "basal_energy": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierBasalEnergyBurned"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "basal_metabolic_rate": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_BASAL_METABOLIC_RATE",
      "write": "android.permission.health.WRITE_BASAL_METABOLIC_RATE"
    }
  },
  "bleeding_after_pregnancy": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierBleedingAfterPregnancy"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "bleeding_during_pregnancy": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierBleedingDuringPregnancy"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "blood_alcohol_content": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierBloodAlcoholContent"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "blood_glucose": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierBloodGlucose"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_BLOOD_GLUCOSE",
      "write": "android.permission.health.WRITE_BLOOD_GLUCOSE"
    }
  },
  "blood_pressure": {
    "healthkit": {
      "identifiers": [
        "HKCorrelationTypeIdentifierBloodPressure",
        "HKQuantityTypeIdentifierBloodPressureSystolic",
        "HKQuantityTypeIdentifierBloodPressureDiastolic"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_BLOOD_PRESSURE",
      "write": "android.permission.health.WRITE_BLOOD_PRESSURE"
    }
  },
  "body_fat": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierBodyFatPercentage"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_BODY_FAT",
      "write": "android.permission.health.WRITE_BODY_FAT"
    }
  },
  "body_mass_index": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierBodyMassIndex"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "body_temperature": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierBodyTemperature"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_BODY_TEMPERATURE",
      "write": "android.permission.health.WRITE_BODY_TEMPERATURE"
    }
  },
  "body_water_mass": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_BODY_WATER_MASS",
      "write": "android.permission.health.WRITE_BODY_WATER_MASS"
    }
  },
  "bone_mass": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_BONE_MASS",
      "write": "android.permission.health.WRITE_BONE_MASS"
    }
  },
  "cervical_mucus": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierCervicalMucusQuality"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_CERVICAL_MUCUS",
      "write": "android.permission.health.WRITE_CERVICAL_MUCUS"
    }
  },
  "clinical_allergy": {
    "healthkit": {
      "identifiers": [
        "HKClinicalTypeIdentifierAllergyRecord"
      ],
      "write": false
    },
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_ALLERGIES_INTOLERANCES",
      "write": null
    }
  },
  "clinical_condition": {
    "healthkit": {
      "identifiers": [
        "HKClinicalTypeIdentifierConditionRecord"
      ],
      "write": false
    },
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_CONDITIONS",
      "write": null
    }
  },
  "clinical_coverage": {
    "healthkit": {
      "identifiers": [
        "HKClinicalTypeIdentifierCoverageRecord"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "clinical_immunization": {
    "healthkit": {
      "identifiers": [
        "HKClinicalTypeIdentifierImmunizationRecord"
      ],
      "write": false
    },
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_VACCINES",
      "write": null
    }
  },
  "clinical_lab_result": {
    "healthkit": {
      "identifiers": [
        "HKClinicalTypeIdentifierLabResultRecord"
      ],
      "write": false
    },
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_LABORATORY_RESULTS",
      "write": null
    }
  },
  "clinical_medication": {
    "healthkit": {
      "identifiers": [
        "HKClinicalTypeIdentifierMedicationRecord"
      ],
      "write": false
    },
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_MEDICATIONS",
      "write": null
    }
  },
  "clinical_note": {
    "healthkit": {
      "identifiers": [
        "HKClinicalTypeIdentifierClinicalNoteRecord"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "clinical_personal_details": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_PERSONAL_DETAILS",
      "write": null
    }
  },
  "clinical_practitioner_details": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_PRACTITIONER_DETAILS",
      "write": null
    }
  },
  "clinical_pregnancy": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_PREGNANCY",
      "write": null
    }
  },
  "clinical_procedure": {
    "healthkit": {
      "identifiers": [
        "HKClinicalTypeIdentifierProcedureRecord"
      ],
      "write": false
    },
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_PROCEDURES",
      "write": null
    }
  },
  "clinical_social_history": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_SOCIAL_HISTORY",
      "write": null
    }
  },
  "clinical_visit": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_VISITS",
      "write": null
    }
  },
  "clinical_vital_sign": {
    "healthkit": {
      "identifiers": [
        "HKClinicalTypeIdentifierVitalSignRecord"
      ],
      "write": false
    },
    "healthconnect": {
      "read": "android.permission.health.READ_MEDICAL_DATA_VITAL_SIGNS",
      "write": null
    }
  },
  "contraceptive": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierContraceptive"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "cross_country_skiing_speed": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierCrossCountrySkiingSpeed"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "cycling_cadence": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierCyclingCadence"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_CYCLING_PEDALING_CADENCE",
      "write": "android.permission.health.WRITE_CYCLING_PEDALING_CADENCE"
    }
  },
  "cycling_functional_threshold_power": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierCyclingFunctionalThresholdPower"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "cycling_power": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierCyclingPower"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "cycling_speed": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierCyclingSpeed"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "distance": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDistanceWalkingRunning"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_DISTANCE",
      "write": "android.permission.health.WRITE_DISTANCE"
    }
  },
  "distance_cross_country_skiing": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDistanceCrossCountrySkiing"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "distance_cycling": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDistanceCycling"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "distance_downhill_snow_sports": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDistanceDownhillSnowSports"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "distance_paddle_sports": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDistancePaddleSports"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "distance_rowing": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDistanceRowing"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "distance_skating_sports": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDistanceSkatingSports"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "distance_swimming": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDistanceSwimming"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "distance_wheelchair": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDistanceWheelchair"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "electrocardiogram": {
    "healthkit": {
      "identifiers": [
        "HKDataTypeIdentifierElectrocardiogram"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "electrodermal_activity": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierElectrodermalActivity"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "elevation_gained": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_ELEVATION_GAINED",
      "write": "android.permission.health.WRITE_ELEVATION_GAINED"
    }
  },
  "environmental_audio_exposure": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierEnvironmentalAudioExposure"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "environmental_audio_exposure_event": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierAudioExposureEvent"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "environmental_sound_reduction": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierEnvironmentalSoundReduction"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "estimated_workout_effort_score": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierEstimatedWorkoutEffortScore"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "exercise_route": {
    "healthkit": {
      "identifiers": [
        "HKWorkoutRouteTypeIdentifier"
      ],
      "write": true
    },
    "healthconnect": {
      "read": null,
      "write": "android.permission.health.WRITE_EXERCISE_ROUTE"
    }
  },
  "exercise_session": {
    "healthkit": {
      "identifiers": [
        "HKWorkoutTypeIdentifier"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_EXERCISE",
      "write": "android.permission.health.WRITE_EXERCISE"
    }
  },
  "floors_climbed": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierFlightsClimbed"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_FLOORS_CLIMBED",
      "write": "android.permission.health.WRITE_FLOORS_CLIMBED"
    }
  },
  "forced_expiratory_volume_1": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierForcedExpiratoryVolume1"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "forced_vital_capacity": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierForcedVitalCapacity"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "handwashing_event": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierHandwashingEvent"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "headphone_audio_exposure": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierHeadphoneAudioExposure"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "headphone_audio_exposure_event": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierHeadphoneAudioExposureEvent"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "heart_rate": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierHeartRate"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_HEART_RATE",
      "write": "android.permission.health.WRITE_HEART_RATE"
    }
  },
  "heart_rate_recovery_one_minute": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierHeartRateRecoveryOneMinute"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "heartbeat_series": {
    "healthkit": {
      "identifiers": [
        "HKDataTypeIdentifierHeartbeatSeries"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "height": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierHeight"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_HEIGHT",
      "write": "android.permission.health.WRITE_HEIGHT"
    }
  },
  "high_heart_rate_event": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierHighHeartRateEvent"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "hrv_rmssd": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_HEART_RATE_VARIABILITY",
      "write": "android.permission.health.WRITE_HEART_RATE_VARIABILITY"
    }
  },
  "hrv_sdnn": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierHeartRateVariabilitySDNN"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "hydration": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDietaryWater"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_HYDRATION",
      "write": "android.permission.health.WRITE_HYDRATION"
    }
  },
  "infrequent_menstrual_cycles": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierInfrequentMenstrualCycles"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "inhaler_usage": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierInhalerUsage"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "insulin_delivery": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierInsulinDelivery"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "intermenstrual_bleeding": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierIntermenstrualBleeding"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_INTERMENSTRUAL_BLEEDING",
      "write": "android.permission.health.WRITE_INTERMENSTRUAL_BLEEDING"
    }
  },
  "irregular_heart_rhythm_event": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierIrregularHeartRhythmEvent"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "irregular_menstrual_cycles": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierIrregularMenstrualCycles"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "lactation": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierLactation"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "lean_body_mass": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierLeanBodyMass"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_LEAN_BODY_MASS",
      "write": "android.permission.health.WRITE_LEAN_BODY_MASS"
    }
  },
  "low_cardio_fitness_event": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierLowCardioFitnessEvent"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "low_heart_rate_event": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierLowHeartRateEvent"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "medication_dose": {
    "healthkit": {
      "identifiers": [
        "HKDataTypeIdentifierMedicationDoseEvent"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "menstruation_flow": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierMenstrualFlow"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_MENSTRUATION",
      "write": "android.permission.health.WRITE_MENSTRUATION"
    }
  },
  "menstruation_period": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_MENSTRUATION",
      "write": "android.permission.health.WRITE_MENSTRUATION"
    }
  },
  "mindfulness_session": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierMindfulSession"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_MINDFULNESS",
      "write": "android.permission.health.WRITE_MINDFULNESS"
    }
  },
  "nike_fuel": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierNikeFuel"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "number_of_alcoholic_beverages": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierNumberOfAlcoholicBeverages"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "number_of_times_fallen": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierNumberOfTimesFallen"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "nutrition": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierDietaryEnergyConsumed",
        "HKQuantityTypeIdentifierDietaryProtein",
        "HKQuantityTypeIdentifierDietaryCarbohydrates",
        "HKQuantityTypeIdentifierDietaryFatTotal",
        "HKQuantityTypeIdentifierDietaryFatSaturated",
        "HKQuantityTypeIdentifierDietaryFatMonounsaturated",
        "HKQuantityTypeIdentifierDietaryFatPolyunsaturated",
        "HKQuantityTypeIdentifierDietaryFiber",
        "HKQuantityTypeIdentifierDietarySugar",
        "HKQuantityTypeIdentifierDietaryCholesterol",
        "HKQuantityTypeIdentifierDietarySodium",
        "HKQuantityTypeIdentifierDietaryPotassium",
        "HKQuantityTypeIdentifierDietaryCalcium",
        "HKQuantityTypeIdentifierDietaryIron",
        "HKQuantityTypeIdentifierDietaryMagnesium",
        "HKQuantityTypeIdentifierDietaryPhosphorus",
        "HKQuantityTypeIdentifierDietaryZinc",
        "HKQuantityTypeIdentifierDietaryCopper",
        "HKQuantityTypeIdentifierDietaryManganese",
        "HKQuantityTypeIdentifierDietaryChloride",
        "HKQuantityTypeIdentifierDietarySelenium",
        "HKQuantityTypeIdentifierDietaryIodine",
        "HKQuantityTypeIdentifierDietaryChromium",
        "HKQuantityTypeIdentifierDietaryMolybdenum",
        "HKQuantityTypeIdentifierDietaryVitaminA",
        "HKQuantityTypeIdentifierDietaryVitaminB6",
        "HKQuantityTypeIdentifierDietaryVitaminB12",
        "HKQuantityTypeIdentifierDietaryVitaminC",
        "HKQuantityTypeIdentifierDietaryVitaminD",
        "HKQuantityTypeIdentifierDietaryVitaminE",
        "HKQuantityTypeIdentifierDietaryVitaminK",
        "HKQuantityTypeIdentifierDietaryThiamin",
        "HKQuantityTypeIdentifierDietaryRiboflavin",
        "HKQuantityTypeIdentifierDietaryNiacin",
        "HKQuantityTypeIdentifierDietaryFolate",
        "HKQuantityTypeIdentifierDietaryBiotin",
        "HKQuantityTypeIdentifierDietaryPantothenicAcid",
        "HKQuantityTypeIdentifierDietaryCaffeine"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_NUTRITION",
      "write": "android.permission.health.WRITE_NUTRITION"
    }
  },
  "ovulation_test": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierOvulationTestResult"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_OVULATION_TEST",
      "write": "android.permission.health.WRITE_OVULATION_TEST"
    }
  },
  "oxygen_saturation": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierOxygenSaturation"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_OXYGEN_SATURATION",
      "write": "android.permission.health.WRITE_OXYGEN_SATURATION"
    }
  },
  "paddle_sports_speed": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierPaddleSportsSpeed"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "peak_expiratory_flow_rate": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierPeakExpiratoryFlowRate"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "peripheral_perfusion_index": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierPeripheralPerfusionIndex"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "persistent_intermenstrual_bleeding": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierPersistentIntermenstrualBleeding"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "physical_effort": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierPhysicalEffort"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "power": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_POWER",
      "write": "android.permission.health.WRITE_POWER"
    }
  },
  "pregnancy": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierPregnancy"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "pregnancy_test": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierPregnancyTestResult"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "progesterone_test": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierProgesteroneTestResult"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "prolonged_menstrual_periods": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierProlongedMenstrualPeriods"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "respiratory_rate": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierRespiratoryRate"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_RESPIRATORY_RATE",
      "write": "android.permission.health.WRITE_RESPIRATORY_RATE"
    }
  },
  "resting_heart_rate": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierRestingHeartRate"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_RESTING_HEART_RATE",
      "write": "android.permission.health.WRITE_RESTING_HEART_RATE"
    }
  },
  "rowing_speed": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierRowingSpeed"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "running_ground_contact_time": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierRunningGroundContactTime"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "running_power": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierRunningPower"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "running_speed": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierRunningSpeed"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "running_stride_length": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierRunningStrideLength"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "running_vertical_oscillation": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierRunningVerticalOscillation"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "sexual_activity": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierSexualActivity"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_SEXUAL_ACTIVITY",
      "write": "android.permission.health.WRITE_SEXUAL_ACTIVITY"
    }
  },
  "six_minute_walk_distance": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierSixMinuteWalkTestDistance"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "skin_temperature": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_SKIN_TEMPERATURE",
      "write": "android.permission.health.WRITE_SKIN_TEMPERATURE"
    }
  },
  "sleep_apnea_event": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierSleepApneaEvent"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "sleep_session": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierSleepAnalysis"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_SLEEP",
      "write": "android.permission.health.WRITE_SLEEP"
    }
  },
  "speed": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_SPEED",
      "write": "android.permission.health.WRITE_SPEED"
    }
  },
  "stair_ascent_speed": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierStairAscentSpeed"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "stair_descent_speed": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierStairDescentSpeed"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "state_of_mind": {
    "healthkit": {
      "identifiers": [
        "HKDataTypeIdentifierStateOfMind"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "steps": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierStepCount"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_STEPS",
      "write": "android.permission.health.WRITE_STEPS"
    }
  },
  "steps_cadence": {
    "healthkit": null,
    "healthconnect": {
      "read": "android.permission.health.READ_STEPS_CADENCE",
      "write": "android.permission.health.WRITE_STEPS_CADENCE"
    }
  },
  "swimming_stroke_count": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierSwimmingStrokeCount"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_abdominal_cramps": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierAbdominalCramps"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_acne": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierAcne"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_appetite_changes": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierAppetiteChanges"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_bladder_incontinence": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierBladderIncontinence"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_bloating": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierBloating"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_breast_pain": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierBreastPain"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_chest_tightness_or_pain": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierChestTightnessOrPain"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_chills": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierChills"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_constipation": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierConstipation"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_coughing": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierCoughing"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_diarrhea": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierDiarrhea"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_dizziness": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierDizziness"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_dry_skin": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierDrySkin"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_fainting": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierFainting"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_fatigue": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierFatigue"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_fever": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierFever"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_generalized_body_ache": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierGeneralizedBodyAche"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_hair_loss": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierHairLoss"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_headache": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierHeadache"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_heartburn": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierHeartburn"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_hot_flashes": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierHotFlashes"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_loss_of_smell": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierLossOfSmell"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_loss_of_taste": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierLossOfTaste"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_lower_back_pain": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierLowerBackPain"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_memory_lapse": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierMemoryLapse"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_mood_changes": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierMoodChanges"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_nausea": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierNausea"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_night_sweats": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierNightSweats"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_pelvic_pain": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierPelvicPain"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_rapid_pounding_or_fluttering_heartbeat": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_runny_nose": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierRunnyNose"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_shortness_of_breath": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierShortnessOfBreath"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_sinus_congestion": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierSinusCongestion"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_skipped_heartbeat": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierSkippedHeartbeat"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_sleep_changes": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierSleepChanges"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_sore_throat": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierSoreThroat"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_vaginal_dryness": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierVaginalDryness"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_vomiting": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierVomiting"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "symptom_wheezing": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierWheezing"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "time_in_daylight": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierTimeInDaylight"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "toothbrushing_event": {
    "healthkit": {
      "identifiers": [
        "HKCategoryTypeIdentifierToothbrushingEvent"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "total_energy": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierActiveEnergyBurned",
        "HKQuantityTypeIdentifierBasalEnergyBurned"
      ],
      "write": false
    },
    "healthconnect": {
      "read": "android.permission.health.READ_TOTAL_CALORIES_BURNED",
      "write": "android.permission.health.WRITE_TOTAL_CALORIES_BURNED"
    }
  },
  "underwater_depth": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierUnderwaterDepth"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "uv_exposure": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierUVExposure"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "vo2_max": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierVO2Max"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_VO2_MAX",
      "write": "android.permission.health.WRITE_VO2_MAX"
    }
  },
  "waist_circumference": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierWaistCircumference"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "walking_asymmetry": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierWalkingAsymmetryPercentage"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "walking_double_support": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierWalkingDoubleSupportPercentage"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "walking_heart_rate_average": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierWalkingHeartRateAverage"
      ],
      "write": false
    },
    "healthconnect": null
  },
  "walking_speed": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierWalkingSpeed"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "walking_step_length": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierWalkingStepLength"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "water_temperature": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierWaterTemperature"
      ],
      "write": true
    },
    "healthconnect": null
  },
  "weight": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierBodyMass"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_WEIGHT",
      "write": "android.permission.health.WRITE_WEIGHT"
    }
  },
  "wheelchair_pushes": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierPushCount"
      ],
      "write": true
    },
    "healthconnect": {
      "read": "android.permission.health.READ_WHEELCHAIR_PUSHES",
      "write": "android.permission.health.WRITE_WHEELCHAIR_PUSHES"
    }
  },
  "workout_effort_score": {
    "healthkit": {
      "identifiers": [
        "HKQuantityTypeIdentifierWorkoutEffortScore"
      ],
      "write": true
    },
    "healthconnect": null
  }
};

export const HEALTH_CONNECT_BACKGROUND_PERMISSION = 'android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND';
export const HEALTH_CONNECT_HISTORY_PERMISSION = 'android.permission.health.READ_HEALTH_DATA_HISTORY';

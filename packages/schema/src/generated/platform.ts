// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.

import type { HealthType } from './types.js';

export type PlatformId = 'ios' | 'android';

export interface PlatformTypeSupport {
  supported: boolean;
  read: boolean;
  write: boolean;
  /** reachable through read()/write(); false when a dedicated operation is required (e.g. readRoute) */
  generic: boolean;
  /** minimum OS version, when newer than the library baseline */
  since?: string;
  notes?: string[];
}

export interface TypePlatforms {
  ios: PlatformTypeSupport;
  android: PlatformTypeSupport;
  /** value field → the platforms that persist it */
  fields: Record<string, { ios: boolean; android: boolean }>;
}

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
export const CROSS_PLATFORM_TYPES = ["active_energy","basal_body_temperature","blood_glucose","blood_pressure","body_fat","body_temperature","cervical_mucus","clinical_allergy","clinical_condition","clinical_immunization","clinical_lab_result","clinical_medication","clinical_procedure","clinical_vital_sign","cycling_cadence","distance","exercise_route","exercise_session","floors_climbed","heart_rate","height","hydration","intermenstrual_bleeding","lean_body_mass","menstruation_flow","mindfulness_session","nutrition","ovulation_test","oxygen_saturation","respiratory_rate","resting_heart_rate","sexual_activity","sleep_session","steps","total_energy","vo2_max","weight","wheelchair_pushes"] as const;
export type CrossPlatformType = (typeof CROSS_PLATFORM_TYPES)[number];

/** Types only Apple HealthKit persists (129). */
export const IOS_ONLY_TYPES = ["activity_summary","apple_exercise_time","apple_move_time","apple_sleeping_breathing_disturbances","apple_sleeping_wrist_temperature","apple_stand_hour","apple_stand_time","apple_walking_steadiness","apple_walking_steadiness_event","atrial_fibrillation_burden","basal_energy","bleeding_after_pregnancy","bleeding_during_pregnancy","blood_alcohol_content","body_mass_index","clinical_coverage","clinical_note","contraceptive","cross_country_skiing_speed","cycling_functional_threshold_power","cycling_power","cycling_speed","distance_cross_country_skiing","distance_cycling","distance_downhill_snow_sports","distance_paddle_sports","distance_rowing","distance_skating_sports","distance_swimming","distance_wheelchair","electrocardiogram","electrodermal_activity","environmental_audio_exposure","environmental_audio_exposure_event","environmental_sound_reduction","estimated_workout_effort_score","forced_expiratory_volume_1","forced_vital_capacity","handwashing_event","headphone_audio_exposure","headphone_audio_exposure_event","heart_rate_recovery_one_minute","heartbeat_series","high_heart_rate_event","hrv_sdnn","infrequent_menstrual_cycles","inhaler_usage","insulin_delivery","irregular_heart_rhythm_event","irregular_menstrual_cycles","lactation","low_cardio_fitness_event","low_heart_rate_event","medication_dose","nike_fuel","number_of_alcoholic_beverages","number_of_times_fallen","paddle_sports_speed","peak_expiratory_flow_rate","peripheral_perfusion_index","persistent_intermenstrual_bleeding","physical_effort","pregnancy","pregnancy_test","progesterone_test","prolonged_menstrual_periods","rowing_speed","running_ground_contact_time","running_power","running_speed","running_stride_length","running_vertical_oscillation","six_minute_walk_distance","sleep_apnea_event","stair_ascent_speed","stair_descent_speed","state_of_mind","swimming_stroke_count","symptom_abdominal_cramps","symptom_acne","symptom_appetite_changes","symptom_bladder_incontinence","symptom_bloating","symptom_breast_pain","symptom_chest_tightness_or_pain","symptom_chills","symptom_constipation","symptom_coughing","symptom_diarrhea","symptom_dizziness","symptom_dry_skin","symptom_fainting","symptom_fatigue","symptom_fever","symptom_generalized_body_ache","symptom_hair_loss","symptom_headache","symptom_heartburn","symptom_hot_flashes","symptom_loss_of_smell","symptom_loss_of_taste","symptom_lower_back_pain","symptom_memory_lapse","symptom_mood_changes","symptom_nausea","symptom_night_sweats","symptom_pelvic_pain","symptom_rapid_pounding_or_fluttering_heartbeat","symptom_runny_nose","symptom_shortness_of_breath","symptom_sinus_congestion","symptom_skipped_heartbeat","symptom_sleep_changes","symptom_sore_throat","symptom_vaginal_dryness","symptom_vomiting","symptom_wheezing","time_in_daylight","toothbrushing_event","underwater_depth","uv_exposure","waist_circumference","walking_asymmetry","walking_double_support","walking_heart_rate_average","walking_speed","walking_step_length","water_temperature","workout_effort_score"] as const;
export type IosOnlyType = (typeof IOS_ONLY_TYPES)[number];

/** Types only Android Health Connect persists (15). */
export const ANDROID_ONLY_TYPES = ["basal_metabolic_rate","body_water_mass","bone_mass","clinical_personal_details","clinical_practitioner_details","clinical_pregnancy","clinical_social_history","clinical_visit","elevation_gained","hrv_rmssd","menstruation_period","power","skin_temperature","speed","steps_cadence"] as const;
export type AndroidOnlyType = (typeof ANDROID_ONLY_TYPES)[number];

export const TYPE_PLATFORMS: Record<HealthType, TypePlatforms> = {
  "active_energy": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "kilocalories": {
        "ios": true,
        "android": true
      }
    }
  },
  "activity_summary": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
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
    }
  },
  "apple_exercise_time": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true,
      "notes": [
        "HealthKit computes this type; apps can read it but never write it."
      ]
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "minutes": {
        "ios": true,
        "android": false
      }
    }
  },
  "apple_move_time": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "minutes": {
        "ios": true,
        "android": false
      }
    }
  },
  "apple_sleeping_breathing_disturbances": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "count": {
        "ios": true,
        "android": false
      }
    }
  },
  "apple_sleeping_wrist_temperature": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 16"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "celsius": {
        "ios": true,
        "android": false
      }
    }
  },
  "apple_stand_hour": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "status": {
        "ios": true,
        "android": false
      }
    }
  },
  "apple_stand_time": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true,
      "notes": [
        "HealthKit computes this type; apps can read it but never write it."
      ]
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "minutes": {
        "ios": true,
        "android": false
      }
    }
  },
  "apple_walking_steadiness": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true,
      "notes": [
        "HealthKit computes this type; apps can read it but never write it."
      ]
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "percent": {
        "ios": true,
        "android": false
      }
    }
  },
  "apple_walking_steadiness_event": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "level": {
        "ios": true,
        "android": false
      }
    }
  },
  "atrial_fibrillation_burden": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true,
      "since": "iOS 16",
      "notes": [
        "HealthKit computes this type; apps can read it but never write it."
      ]
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "percent": {
        "ios": true,
        "android": false
      }
    }
  },
  "basal_body_temperature": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "celsius": {
        "ios": true,
        "android": true
      },
      "measurementLocation": {
        "ios": true,
        "android": true
      }
    }
  },
  "basal_energy": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "kilocalories": {
        "ios": true,
        "android": false
      }
    }
  },
  "basal_metabolic_rate": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "kilocaloriesPerDay": {
        "ios": false,
        "android": true
      }
    }
  },
  "bleeding_after_pregnancy": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "flow": {
        "ios": true,
        "android": false
      }
    }
  },
  "bleeding_during_pregnancy": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "flow": {
        "ios": true,
        "android": false
      }
    }
  },
  "blood_alcohol_content": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "percent": {
        "ios": true,
        "android": false
      }
    }
  },
  "blood_glucose": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "Read with HKUnit.moleUnit(with: .milli, molarMass: HKUnitMolarMassBloodGlucose).unitDivided(by: .liter()). Meal relation from HKMetadataKeyBloodGlucoseMealTime."
      ]
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "millimolesPerLiter": {
        "ios": true,
        "android": true
      },
      "specimenSource": {
        "ios": false,
        "android": true
      },
      "mealType": {
        "ios": true,
        "android": true
      },
      "relationToMeal": {
        "ios": false,
        "android": true
      }
    }
  },
  "blood_pressure": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "Authorization is requested for both quantity types; reads use the correlation so the pair stays together."
      ]
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "systolicMmHg": {
        "ios": true,
        "android": true
      },
      "diastolicMmHg": {
        "ios": true,
        "android": true
      },
      "bodyPosition": {
        "ios": false,
        "android": true
      },
      "measurementLocation": {
        "ios": false,
        "android": true
      }
    }
  },
  "body_fat": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "HKUnit.percent() is a fraction (0.21 = 21%); multiply by 100."
      ]
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "percent": {
        "ios": true,
        "android": true
      }
    }
  },
  "body_mass_index": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "value": {
        "ios": true,
        "android": false
      }
    }
  },
  "body_temperature": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "Measurement location from HKMetadataKeyBodyTemperatureSensorLocation."
      ]
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "celsius": {
        "ios": true,
        "android": true
      },
      "measurementLocation": {
        "ios": false,
        "android": true
      }
    }
  },
  "body_water_mass": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "kilograms": {
        "ios": false,
        "android": true
      }
    }
  },
  "bone_mass": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "kilograms": {
        "ios": false,
        "android": true
      }
    }
  },
  "cervical_mucus": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "HealthKit records appearance only; sensation is Health Connect only."
      ]
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "appearance": {
        "ios": true,
        "android": true
      },
      "sensation": {
        "ios": false,
        "android": true
      }
    }
  },
  "clinical_allergy": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
      "resourceType": {
        "ios": true,
        "android": true
      },
      "fhirVersion": {
        "ios": true,
        "android": true
      },
      "displayName": {
        "ios": true,
        "android": true
      },
      "sourceUrl": {
        "ios": true,
        "android": true
      },
      "fhir": {
        "ios": true,
        "android": true
      }
    }
  },
  "clinical_condition": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
      "resourceType": {
        "ios": true,
        "android": true
      },
      "fhirVersion": {
        "ios": true,
        "android": true
      },
      "displayName": {
        "ios": true,
        "android": true
      },
      "sourceUrl": {
        "ios": true,
        "android": true
      },
      "fhir": {
        "ios": true,
        "android": true
      }
    }
  },
  "clinical_coverage": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
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
    }
  },
  "clinical_immunization": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
      "resourceType": {
        "ios": true,
        "android": true
      },
      "fhirVersion": {
        "ios": true,
        "android": true
      },
      "displayName": {
        "ios": true,
        "android": true
      },
      "sourceUrl": {
        "ios": true,
        "android": true
      },
      "fhir": {
        "ios": true,
        "android": true
      }
    }
  },
  "clinical_lab_result": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
      "resourceType": {
        "ios": true,
        "android": true
      },
      "fhirVersion": {
        "ios": true,
        "android": true
      },
      "displayName": {
        "ios": true,
        "android": true
      },
      "sourceUrl": {
        "ios": true,
        "android": true
      },
      "fhir": {
        "ios": true,
        "android": true
      }
    }
  },
  "clinical_medication": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
      "resourceType": {
        "ios": true,
        "android": true
      },
      "fhirVersion": {
        "ios": true,
        "android": true
      },
      "displayName": {
        "ios": true,
        "android": true
      },
      "sourceUrl": {
        "ios": true,
        "android": true
      },
      "fhir": {
        "ios": true,
        "android": true
      }
    }
  },
  "clinical_note": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true,
      "since": "iOS 16",
      "notes": [
        "Identifier taken from Apple documentation only — no cross-checkable source declares it (iOS 16+). Confirm against the SDK before relying on it."
      ]
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
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
    }
  },
  "clinical_personal_details": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
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
    }
  },
  "clinical_practitioner_details": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
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
    }
  },
  "clinical_pregnancy": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
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
    }
  },
  "clinical_procedure": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
      "resourceType": {
        "ios": true,
        "android": true
      },
      "fhirVersion": {
        "ios": true,
        "android": true
      },
      "displayName": {
        "ios": true,
        "android": true
      },
      "sourceUrl": {
        "ios": true,
        "android": true
      },
      "fhir": {
        "ios": true,
        "android": true
      }
    }
  },
  "clinical_social_history": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
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
    }
  },
  "clinical_visit": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
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
    }
  },
  "clinical_vital_sign": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true
    },
    "fields": {
      "resourceType": {
        "ios": true,
        "android": true
      },
      "fhirVersion": {
        "ios": true,
        "android": true
      },
      "displayName": {
        "ios": true,
        "android": true
      },
      "sourceUrl": {
        "ios": true,
        "android": true
      },
      "fhir": {
        "ios": true,
        "android": true
      }
    }
  },
  "contraceptive": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "method": {
        "ios": true,
        "android": false
      }
    }
  },
  "cross_country_skiing_speed": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "metersPerSecond": {
        "ios": true,
        "android": false
      }
    }
  },
  "cycling_cadence": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 17"
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "rpm": {
        "ios": true,
        "android": true
      }
    }
  },
  "cycling_functional_threshold_power": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 17"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "watts": {
        "ios": true,
        "android": false
      }
    }
  },
  "cycling_power": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 17"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "watts": {
        "ios": true,
        "android": false
      }
    }
  },
  "cycling_speed": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 17"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "metersPerSecond": {
        "ios": true,
        "android": false
      }
    }
  },
  "distance": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": true
      }
    }
  },
  "distance_cross_country_skiing": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "distance_cycling": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "distance_downhill_snow_sports": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "distance_paddle_sports": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "distance_rowing": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "distance_skating_sports": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "distance_swimming": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "distance_wheelchair": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "electrocardiogram": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true,
      "since": "iOS 14"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
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
    }
  },
  "electrodermal_activity": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "microsiemens": {
        "ios": true,
        "android": false
      }
    }
  },
  "elevation_gained": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "meters": {
        "ios": false,
        "android": true
      }
    }
  },
  "environmental_audio_exposure": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "decibels": {
        "ios": true,
        "android": false
      }
    }
  },
  "environmental_audio_exposure_event": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "Apple renamed the Swift case to `environmentalAudioExposureEvent` in iOS 14 but kept the raw value `HKCategoryTypeIdentifierAudioExposureEvent`. Verified at runtime — the renamed string does not resolve."
      ]
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "environmental_sound_reduction": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 16"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "decibels": {
        "ios": true,
        "android": false
      }
    }
  },
  "estimated_workout_effort_score": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "score": {
        "ios": true,
        "android": false
      }
    }
  },
  "exercise_route": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": false,
      "notes": [
        "HKSeriesType.workoutRoute(); points arrive as CLLocation batches."
      ]
    },
    "android": {
      "supported": true,
      "read": false,
      "write": true,
      "generic": false,
      "notes": [
        "Read consent is per session via requestExerciseRoute (no READ permission exists); WRITE_EXERCISE_ROUTE covers writes."
      ]
    },
    "fields": {
      "sessionId": {
        "ios": true,
        "android": true
      },
      "points": {
        "ios": true,
        "android": true
      }
    }
  },
  "exercise_session": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "activity": {
        "ios": true,
        "android": true
      },
      "title": {
        "ios": false,
        "android": true
      },
      "notes": {
        "ios": false,
        "android": true
      }
    }
  },
  "floors_climbed": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "count": {
        "ios": true,
        "android": true
      }
    }
  },
  "forced_expiratory_volume_1": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "liters": {
        "ios": true,
        "android": false
      }
    }
  },
  "forced_vital_capacity": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "liters": {
        "ios": true,
        "android": false
      }
    }
  },
  "handwashing_event": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "headphone_audio_exposure": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "decibels": {
        "ios": true,
        "android": false
      }
    }
  },
  "headphone_audio_exposure_event": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "heart_rate": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "bpm": {
        "ios": true,
        "android": true
      }
    }
  },
  "heart_rate_recovery_one_minute": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 16"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "bpm": {
        "ios": true,
        "android": false
      }
    }
  },
  "heartbeat_series": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true,
      "since": "iOS 13"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "count": {
        "ios": true,
        "android": false
      },
      "beats": {
        "ios": true,
        "android": false
      }
    }
  },
  "height": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": true
      }
    }
  },
  "high_heart_rate_event": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "hrv_rmssd": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "milliseconds": {
        "ios": false,
        "android": true
      }
    }
  },
  "hrv_sdnn": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "milliseconds": {
        "ios": true,
        "android": false
      }
    }
  },
  "hydration": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "liters": {
        "ios": true,
        "android": true
      }
    }
  },
  "infrequent_menstrual_cycles": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "inhaler_usage": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "count": {
        "ios": true,
        "android": false
      }
    }
  },
  "insulin_delivery": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "internationalUnits": {
        "ios": true,
        "android": false
      },
      "reason": {
        "ios": true,
        "android": false
      }
    }
  },
  "intermenstrual_bleeding": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {}
  },
  "irregular_heart_rhythm_event": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "irregular_menstrual_cycles": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "lactation": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "lean_body_mass": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "kilograms": {
        "ios": true,
        "android": true
      }
    }
  },
  "low_cardio_fitness_event": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "low_heart_rate_event": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "medication_dose": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true,
      "since": "iOS 26"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
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
    }
  },
  "menstruation_flow": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "Health Connect has no \"none\" flow; it is written as FLOW_UNKNOWN."
      ]
    },
    "fields": {
      "flow": {
        "ios": true,
        "android": true
      },
      "cycleStart": {
        "ios": true,
        "android": false
      }
    }
  },
  "menstruation_period": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {}
  },
  "mindfulness_session": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "sessionType": {
        "ios": true,
        "android": true
      },
      "title": {
        "ios": false,
        "android": true
      },
      "notes": {
        "ios": false,
        "android": true
      }
    }
  },
  "nike_fuel": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "count": {
        "ios": true,
        "android": false
      }
    }
  },
  "number_of_alcoholic_beverages": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 15"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "count": {
        "ios": true,
        "android": false
      }
    }
  },
  "number_of_times_fallen": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "count": {
        "ios": true,
        "android": false
      }
    }
  },
  "nutrition": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "No single nutrition object: one quantity sample per nutrient, grouped in an HKCorrelationTypeIdentifierFood correlation on write and when reading.",
        "HKUnit strings: kcal, g, mg, mcg."
      ]
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "kilocalories": {
        "ios": true,
        "android": true
      },
      "energyFromFatKilocalories": {
        "ios": false,
        "android": true
      },
      "proteinGrams": {
        "ios": true,
        "android": true
      },
      "carbohydrateGrams": {
        "ios": true,
        "android": true
      },
      "fatGrams": {
        "ios": true,
        "android": true
      },
      "fatSaturatedGrams": {
        "ios": true,
        "android": true
      },
      "fatMonounsaturatedGrams": {
        "ios": true,
        "android": true
      },
      "fatPolyunsaturatedGrams": {
        "ios": true,
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
      "fiberGrams": {
        "ios": true,
        "android": true
      },
      "sugarGrams": {
        "ios": true,
        "android": true
      },
      "cholesterolMilligrams": {
        "ios": true,
        "android": true
      },
      "sodiumMilligrams": {
        "ios": true,
        "android": true
      },
      "potassiumMilligrams": {
        "ios": true,
        "android": true
      },
      "calciumMilligrams": {
        "ios": true,
        "android": true
      },
      "ironMilligrams": {
        "ios": true,
        "android": true
      },
      "magnesiumMilligrams": {
        "ios": true,
        "android": true
      },
      "phosphorusMilligrams": {
        "ios": true,
        "android": true
      },
      "zincMilligrams": {
        "ios": true,
        "android": true
      },
      "copperMilligrams": {
        "ios": true,
        "android": true
      },
      "manganeseMilligrams": {
        "ios": true,
        "android": true
      },
      "chlorideMilligrams": {
        "ios": true,
        "android": true
      },
      "seleniumMicrograms": {
        "ios": true,
        "android": true
      },
      "iodineMicrograms": {
        "ios": true,
        "android": true
      },
      "chromiumMicrograms": {
        "ios": true,
        "android": true
      },
      "molybdenumMicrograms": {
        "ios": true,
        "android": true
      },
      "vitaminAMicrograms": {
        "ios": true,
        "android": true
      },
      "vitaminB6Milligrams": {
        "ios": true,
        "android": true
      },
      "vitaminB12Micrograms": {
        "ios": true,
        "android": true
      },
      "vitaminCMilligrams": {
        "ios": true,
        "android": true
      },
      "vitaminDMicrograms": {
        "ios": true,
        "android": true
      },
      "vitaminEMilligrams": {
        "ios": true,
        "android": true
      },
      "vitaminKMicrograms": {
        "ios": true,
        "android": true
      },
      "thiaminMilligrams": {
        "ios": true,
        "android": true
      },
      "riboflavinMilligrams": {
        "ios": true,
        "android": true
      },
      "niacinMilligrams": {
        "ios": true,
        "android": true
      },
      "folateMicrograms": {
        "ios": true,
        "android": true
      },
      "folicAcidMicrograms": {
        "ios": false,
        "android": true
      },
      "biotinMicrograms": {
        "ios": true,
        "android": true
      },
      "pantothenicAcidMilligrams": {
        "ios": true,
        "android": true
      },
      "caffeineMilligrams": {
        "ios": true,
        "android": true
      },
      "mealType": {
        "ios": true,
        "android": true
      },
      "name": {
        "ios": true,
        "android": true
      }
    }
  },
  "ovulation_test": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "HealthKit: positive = luteinizingHormoneSurge, high = estrogenSurge, inconclusive = indeterminate."
      ]
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "result": {
        "ios": true,
        "android": true
      }
    }
  },
  "oxygen_saturation": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "HKUnit.percent() is a fraction (0.97 = 97%); multiply by 100."
      ]
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "percent": {
        "ios": true,
        "android": true
      }
    }
  },
  "paddle_sports_speed": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "metersPerSecond": {
        "ios": true,
        "android": false
      }
    }
  },
  "peak_expiratory_flow_rate": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "litersPerMinute": {
        "ios": true,
        "android": false
      }
    }
  },
  "peripheral_perfusion_index": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "percent": {
        "ios": true,
        "android": false
      }
    }
  },
  "persistent_intermenstrual_bleeding": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "physical_effort": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 17"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "metsEquivalent": {
        "ios": true,
        "android": false
      }
    }
  },
  "power": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "watts": {
        "ios": false,
        "android": true
      }
    }
  },
  "pregnancy": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "pregnancy_test": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "result": {
        "ios": true,
        "android": false
      }
    }
  },
  "progesterone_test": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "result": {
        "ios": true,
        "android": false
      }
    }
  },
  "prolonged_menstrual_periods": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "respiratory_rate": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "breathsPerMinute": {
        "ios": true,
        "android": true
      }
    }
  },
  "resting_heart_rate": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "bpm": {
        "ios": true,
        "android": true
      }
    }
  },
  "rowing_speed": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "metersPerSecond": {
        "ios": true,
        "android": false
      }
    }
  },
  "running_ground_contact_time": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 16"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "milliseconds": {
        "ios": true,
        "android": false
      }
    }
  },
  "running_power": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 16"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "watts": {
        "ios": true,
        "android": false
      }
    }
  },
  "running_speed": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 16"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "metersPerSecond": {
        "ios": true,
        "android": false
      }
    }
  },
  "running_stride_length": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 16"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "running_vertical_oscillation": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 16"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "centimeters": {
        "ios": true,
        "android": false
      }
    }
  },
  "sexual_activity": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "protectionUsed": {
        "ios": true,
        "android": true
      }
    }
  },
  "six_minute_walk_distance": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "skin_temperature": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
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
    }
  },
  "sleep_apnea_event": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "sleep_session": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "notes": [
        "HealthKit has no session object: each stage is a separate category sample. Providers derive sessions by grouping consecutive samples from the same source with gaps ≤ 60 minutes; the session id is the first sample's UUID."
      ]
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "stages": {
        "ios": true,
        "android": true
      },
      "title": {
        "ios": false,
        "android": true
      },
      "notes": {
        "ios": false,
        "android": true
      }
    }
  },
  "speed": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "metersPerSecond": {
        "ios": false,
        "android": true
      }
    }
  },
  "stair_ascent_speed": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "metersPerSecond": {
        "ios": true,
        "android": false
      }
    }
  },
  "stair_descent_speed": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "metersPerSecond": {
        "ios": true,
        "android": false
      }
    }
  },
  "state_of_mind": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
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
    }
  },
  "steps": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "count": {
        "ios": true,
        "android": true
      }
    }
  },
  "steps_cadence": {
    "ios": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "stepsPerMinute": {
        "ios": false,
        "android": true
      }
    }
  },
  "swimming_stroke_count": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "count": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_abdominal_cramps": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_acne": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_appetite_changes": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "change": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_bladder_incontinence": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_bloating": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_breast_pain": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_chest_tightness_or_pain": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_chills": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_constipation": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_coughing": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_diarrhea": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_dizziness": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_dry_skin": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_fainting": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_fatigue": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_fever": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_generalized_body_ache": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_hair_loss": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_headache": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_heartburn": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_hot_flashes": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_loss_of_smell": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_loss_of_taste": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_lower_back_pain": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_memory_lapse": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_mood_changes": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "presence": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_nausea": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_night_sweats": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_pelvic_pain": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_rapid_pounding_or_fluttering_heartbeat": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_runny_nose": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_shortness_of_breath": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_sinus_congestion": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_skipped_heartbeat": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_sleep_changes": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "presence": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_sore_throat": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_vaginal_dryness": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_vomiting": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "symptom_wheezing": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "severity": {
        "ios": true,
        "android": false
      }
    }
  },
  "time_in_daylight": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 17"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "minutes": {
        "ios": true,
        "android": false
      }
    }
  },
  "toothbrushing_event": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {}
  },
  "total_energy": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true,
      "notes": [
        "Derived as active + basal over the same interval. Records report recordingMethod=unknown and metadata.derived=true."
      ]
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "kilocalories": {
        "ios": true,
        "android": true
      }
    }
  },
  "underwater_depth": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 16"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "uv_exposure": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "uvIndex": {
        "ios": true,
        "android": false
      }
    }
  },
  "vo2_max": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "mlPerKgPerMin": {
        "ios": true,
        "android": true
      },
      "measurementMethod": {
        "ios": false,
        "android": true
      }
    }
  },
  "waist_circumference": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "walking_asymmetry": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "percent": {
        "ios": true,
        "android": false
      }
    }
  },
  "walking_double_support": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "percent": {
        "ios": true,
        "android": false
      }
    }
  },
  "walking_heart_rate_average": {
    "ios": {
      "supported": true,
      "read": true,
      "write": false,
      "generic": true,
      "notes": [
        "HealthKit computes this type; apps can read it but never write it."
      ]
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "bpm": {
        "ios": true,
        "android": false
      }
    }
  },
  "walking_speed": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "metersPerSecond": {
        "ios": true,
        "android": false
      }
    }
  },
  "walking_step_length": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "meters": {
        "ios": true,
        "android": false
      }
    }
  },
  "water_temperature": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 16"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "celsius": {
        "ios": true,
        "android": false
      }
    }
  },
  "weight": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "kilograms": {
        "ios": true,
        "android": true
      }
    }
  },
  "wheelchair_pushes": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "android": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true
    },
    "fields": {
      "count": {
        "ios": true,
        "android": true
      }
    }
  },
  "workout_effort_score": {
    "ios": {
      "supported": true,
      "read": true,
      "write": true,
      "generic": true,
      "since": "iOS 18"
    },
    "android": {
      "supported": false,
      "read": false,
      "write": false,
      "generic": false
    },
    "fields": {
      "score": {
        "ios": true,
        "android": false
      }
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

/** Platform support for one type, without needing a provider instance. */
export const platformSupport = (type: HealthType, platform: PlatformId): PlatformTypeSupport => TYPE_PLATFORMS[type][platform];

/** Value fields the given platform does not persist for this type. */
export const unsupportedFields = (type: HealthType, platform: PlatformId): string[] =>
  Object.entries(TYPE_PLATFORMS[type].fields)
    .filter(([, f]) => !f[platform])
    .map(([name]) => name);

/** Related types on the other platform. Check `interchangeable` before substituting one for the other. */
export const counterpartsOf = (type: HealthType): Counterpart[] => TYPE_COUNTERPARTS[type] ?? [];

export const isCrossPlatform = (type: HealthType): type is CrossPlatformType => TYPE_PLATFORMS[type].ios.supported && TYPE_PLATFORMS[type].android.supported;

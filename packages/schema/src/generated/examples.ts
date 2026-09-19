// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.

import type { HealthType, HealthValueOf } from './types.js';

/** Example values from each type's JSON Schema; every one validates. Used by the conformance suite to write real data. */
export const TYPE_EXAMPLES: { [T in HealthType]: HealthValueOf<T>[] } = {
  "active_energy": [
    {
      "kilocalories": 312.4
    }
  ],
  "activity_summary": [
    {
      "date": "2026-08-21",
      "activeEnergyKilocalories": 480,
      "activeEnergyGoalKilocalories": 500,
      "exerciseMinutes": 32,
      "exerciseGoalMinutes": 30,
      "standHours": 11,
      "standGoalHours": 12
    }
  ],
  "apple_exercise_time": [
    {
      "minutes": 5
    }
  ],
  "apple_move_time": [
    {
      "minutes": 4
    }
  ],
  "apple_sleeping_breathing_disturbances": [
    {
      "count": 12
    }
  ],
  "apple_sleeping_wrist_temperature": [
    {
      "celsius": 34.1
    }
  ],
  "apple_stand_hour": [
    {
      "status": "stood"
    }
  ],
  "apple_stand_time": [
    {
      "minutes": 3
    }
  ],
  "apple_walking_steadiness": [
    {
      "percent": 85
    }
  ],
  "apple_walking_steadiness_event": [
    {
      "level": "initial_low"
    }
  ],
  "atrial_fibrillation_burden": [
    {
      "percent": 2
    }
  ],
  "basal_body_temperature": [
    {
      "celsius": 36.4
    }
  ],
  "basal_energy": [
    {
      "kilocalories": 68.2
    }
  ],
  "basal_metabolic_rate": [
    {
      "kilocaloriesPerDay": 1650
    }
  ],
  "bleeding_after_pregnancy": [
    {
      "flow": "light"
    }
  ],
  "bleeding_during_pregnancy": [
    {
      "flow": "light"
    }
  ],
  "blood_alcohol_content": [
    {
      "percent": 0.04
    }
  ],
  "blood_glucose": [
    {
      "millimolesPerLiter": 5.4,
      "specimenSource": "capillary_blood",
      "relationToMeal": "fasting"
    }
  ],
  "blood_pressure": [
    {
      "systolicMmHg": 118,
      "diastolicMmHg": 76,
      "bodyPosition": "sitting_down",
      "measurementLocation": "left_upper_arm"
    }
  ],
  "body_fat": [
    {
      "percent": 21.3
    }
  ],
  "body_mass_index": [
    {
      "value": 23.4
    }
  ],
  "body_temperature": [
    {
      "celsius": 36.7,
      "measurementLocation": "mouth"
    }
  ],
  "body_water_mass": [
    {
      "kilograms": 41.2
    }
  ],
  "bone_mass": [
    {
      "kilograms": 3.1
    }
  ],
  "cervical_mucus": [
    {
      "appearance": "egg_white",
      "sensation": "medium"
    }
  ],
  "clinical_allergy": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_condition": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_coverage": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_immunization": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_lab_result": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_medication": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_note": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_personal_details": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_practitioner_details": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_pregnancy": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_procedure": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_social_history": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_visit": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "clinical_vital_sign": [
    {
      "resourceType": "Observation",
      "fhirVersion": "R4",
      "displayName": "Hemoglobin A1c",
      "fhir": {
        "resourceType": "Observation",
        "status": "final"
      }
    }
  ],
  "contraceptive": [
    {
      "method": "oral"
    }
  ],
  "cross_country_skiing_speed": [
    {
      "metersPerSecond": 4
    }
  ],
  "cycling_cadence": [
    {
      "rpm": 88
    }
  ],
  "cycling_functional_threshold_power": [
    {
      "watts": 240
    }
  ],
  "cycling_power": [
    {
      "watts": 210
    }
  ],
  "cycling_speed": [
    {
      "metersPerSecond": 7.5
    }
  ],
  "distance": [
    {
      "meters": 2480.5
    }
  ],
  "distance_cross_country_skiing": [
    {
      "meters": 7000
    }
  ],
  "distance_cycling": [
    {
      "meters": 12800
    }
  ],
  "distance_downhill_snow_sports": [
    {
      "meters": 9800
    }
  ],
  "distance_paddle_sports": [
    {
      "meters": 3000
    }
  ],
  "distance_rowing": [
    {
      "meters": 5000
    }
  ],
  "distance_skating_sports": [
    {
      "meters": 4000
    }
  ],
  "distance_swimming": [
    {
      "meters": 1500
    }
  ],
  "distance_wheelchair": [
    {
      "meters": 2400
    }
  ],
  "electrocardiogram": [
    {
      "classification": "sinus_rhythm",
      "symptomsStatus": "none",
      "averageBpm": 64,
      "samplingFrequencyHz": 512,
      "voltageCount": 15360
    }
  ],
  "electrodermal_activity": [
    {
      "microsiemens": 1.8
    }
  ],
  "elevation_gained": [
    {
      "meters": 140.5
    }
  ],
  "environmental_audio_exposure": [
    {
      "decibels": 68
    }
  ],
  "environmental_audio_exposure_event": [
    {}
  ],
  "environmental_sound_reduction": [
    {
      "decibels": 12
    }
  ],
  "estimated_workout_effort_score": [
    {
      "score": 6
    }
  ],
  "exercise_route": [
    {
      "sessionId": "abc",
      "points": [
        {
          "time": "2026-08-21T07:00:00Z",
          "latitude": 37.5665,
          "longitude": 126.978,
          "altitudeMeters": 38
        }
      ]
    }
  ],
  "exercise_session": [
    {
      "activity": "running",
      "title": "Morning run"
    }
  ],
  "floors_climbed": [
    {
      "count": 12
    }
  ],
  "forced_expiratory_volume_1": [
    {
      "liters": 3.4
    }
  ],
  "forced_vital_capacity": [
    {
      "liters": 4.2
    }
  ],
  "handwashing_event": [
    {}
  ],
  "headphone_audio_exposure": [
    {
      "decibels": 74
    }
  ],
  "headphone_audio_exposure_event": [
    {}
  ],
  "heart_rate": [
    {
      "bpm": 64
    }
  ],
  "heart_rate_recovery_one_minute": [
    {
      "bpm": 28
    }
  ],
  "heartbeat_series": [
    {
      "count": 2,
      "beats": [
        {
          "offsetSeconds": 0.81,
          "precededByGap": false
        },
        {
          "offsetSeconds": 1.63,
          "precededByGap": false
        }
      ]
    }
  ],
  "height": [
    {
      "meters": 1.76
    }
  ],
  "high_heart_rate_event": [
    {}
  ],
  "hrv_rmssd": [
    {
      "milliseconds": 36.9
    }
  ],
  "hrv_sdnn": [
    {
      "milliseconds": 48.2
    }
  ],
  "hydration": [
    {
      "liters": 0.35
    }
  ],
  "infrequent_menstrual_cycles": [
    {}
  ],
  "inhaler_usage": [
    {
      "count": 2
    }
  ],
  "insulin_delivery": [
    {
      "internationalUnits": 4.5,
      "reason": "bolus"
    }
  ],
  "intermenstrual_bleeding": [
    {}
  ],
  "irregular_heart_rhythm_event": [
    {}
  ],
  "irregular_menstrual_cycles": [
    {}
  ],
  "lactation": [
    {}
  ],
  "lean_body_mass": [
    {
      "kilograms": 57
    }
  ],
  "low_cardio_fitness_event": [
    {}
  ],
  "low_heart_rate_event": [
    {}
  ],
  "medication_dose": [
    {
      "medicationId": "rxnorm:197361",
      "medicationName": "Amoxicillin 500 mg",
      "status": "taken",
      "scheduleType": "scheduled",
      "scheduledAt": "2026-08-21T08:00:00Z",
      "dose": 1,
      "unit": "capsule"
    }
  ],
  "menstruation_flow": [
    {
      "flow": "medium",
      "cycleStart": true
    }
  ],
  "menstruation_period": [
    {}
  ],
  "mindfulness_session": [
    {
      "sessionType": "meditation",
      "title": "Evening calm"
    }
  ],
  "nike_fuel": [
    {
      "count": 120
    }
  ],
  "number_of_alcoholic_beverages": [
    {
      "count": 1
    }
  ],
  "number_of_times_fallen": [
    {
      "count": 1
    }
  ],
  "nutrition": [
    {
      "kilocalories": 620,
      "proteinGrams": 32,
      "carbohydrateGrams": 71,
      "fatGrams": 22,
      "vitaminCMilligrams": 40,
      "mealType": "lunch",
      "name": "Bibimbap"
    }
  ],
  "ovulation_test": [
    {
      "result": "positive"
    }
  ],
  "oxygen_saturation": [
    {
      "percent": 97
    }
  ],
  "paddle_sports_speed": [
    {
      "metersPerSecond": 2.2
    }
  ],
  "peak_expiratory_flow_rate": [
    {
      "litersPerMinute": 480
    }
  ],
  "peripheral_perfusion_index": [
    {
      "percent": 3.5
    }
  ],
  "persistent_intermenstrual_bleeding": [
    {}
  ],
  "physical_effort": [
    {
      "metsEquivalent": 6.2
    }
  ],
  "power": [
    {
      "watts": 212
    }
  ],
  "pregnancy": [
    {}
  ],
  "pregnancy_test": [
    {
      "result": "negative"
    }
  ],
  "progesterone_test": [
    {
      "result": "positive"
    }
  ],
  "prolonged_menstrual_periods": [
    {}
  ],
  "respiratory_rate": [
    {
      "breathsPerMinute": 14.5
    }
  ],
  "resting_heart_rate": [
    {
      "bpm": 52
    }
  ],
  "rowing_speed": [
    {
      "metersPerSecond": 3
    }
  ],
  "running_ground_contact_time": [
    {
      "milliseconds": 245
    }
  ],
  "running_power": [
    {
      "watts": 260
    }
  ],
  "running_speed": [
    {
      "metersPerSecond": 3.1
    }
  ],
  "running_stride_length": [
    {
      "meters": 1.25
    }
  ],
  "running_vertical_oscillation": [
    {
      "centimeters": 8.4
    }
  ],
  "sexual_activity": [
    {
      "protectionUsed": "protected"
    }
  ],
  "six_minute_walk_distance": [
    {
      "meters": 520
    }
  ],
  "skin_temperature": [
    {
      "deltaCelsius": -0.3,
      "baselineCelsius": 33.8,
      "measurementLocation": "wrist"
    }
  ],
  "sleep_apnea_event": [
    {}
  ],
  "sleep_session": [
    {
      "stages": [
        {
          "stage": "light",
          "start": "2026-08-21T14:10:00Z",
          "end": "2026-08-21T15:00:00Z"
        },
        {
          "stage": "deep",
          "start": "2026-08-21T15:00:00Z",
          "end": "2026-08-21T16:20:00Z"
        }
      ]
    }
  ],
  "speed": [
    {
      "metersPerSecond": 3.2
    }
  ],
  "stair_ascent_speed": [
    {
      "metersPerSecond": 0.6
    }
  ],
  "stair_descent_speed": [
    {
      "metersPerSecond": 0.8
    }
  ],
  "state_of_mind": [
    {
      "kind": "momentary_emotion",
      "valence": 0.6,
      "valenceClassification": "pleasant",
      "labels": [
        "calm",
        "grateful"
      ],
      "associations": [
        "family"
      ]
    }
  ],
  "steps": [
    {
      "count": 1234
    }
  ],
  "steps_cadence": [
    {
      "stepsPerMinute": 112
    }
  ],
  "swimming_stroke_count": [
    {
      "count": 240
    }
  ],
  "symptom_abdominal_cramps": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_acne": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_appetite_changes": [
    {
      "change": "decreased"
    }
  ],
  "symptom_bladder_incontinence": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_bloating": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_breast_pain": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_chest_tightness_or_pain": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_chills": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_constipation": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_coughing": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_diarrhea": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_dizziness": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_dry_skin": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_fainting": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_fatigue": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_fever": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_generalized_body_ache": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_hair_loss": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_headache": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_heartburn": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_hot_flashes": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_loss_of_smell": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_loss_of_taste": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_lower_back_pain": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_memory_lapse": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_mood_changes": [
    {
      "presence": "present"
    }
  ],
  "symptom_nausea": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_night_sweats": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_pelvic_pain": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_rapid_pounding_or_fluttering_heartbeat": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_runny_nose": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_shortness_of_breath": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_sinus_congestion": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_skipped_heartbeat": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_sleep_changes": [
    {
      "presence": "present"
    }
  ],
  "symptom_sore_throat": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_vaginal_dryness": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_vomiting": [
    {
      "severity": "moderate"
    }
  ],
  "symptom_wheezing": [
    {
      "severity": "moderate"
    }
  ],
  "time_in_daylight": [
    {
      "minutes": 45
    }
  ],
  "toothbrushing_event": [
    {}
  ],
  "total_energy": [
    {
      "kilocalories": 2104
    }
  ],
  "underwater_depth": [
    {
      "meters": 12.4
    }
  ],
  "uv_exposure": [
    {
      "uvIndex": 6
    }
  ],
  "vo2_max": [
    {
      "mlPerKgPerMin": 42.1,
      "measurementMethod": "heart_rate_ratio"
    }
  ],
  "waist_circumference": [
    {
      "meters": 0.82
    }
  ],
  "walking_asymmetry": [
    {
      "percent": 4
    }
  ],
  "walking_double_support": [
    {
      "percent": 28
    }
  ],
  "walking_heart_rate_average": [
    {
      "bpm": 98
    }
  ],
  "walking_speed": [
    {
      "metersPerSecond": 1.3
    }
  ],
  "walking_step_length": [
    {
      "meters": 0.72
    }
  ],
  "water_temperature": [
    {
      "celsius": 21.5
    }
  ],
  "weight": [
    {
      "kilograms": 72.4
    }
  ],
  "wheelchair_pushes": [
    {
      "count": 540
    }
  ],
  "workout_effort_score": [
    {
      "score": 7
    }
  ]
} as never;

// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.

import type { AggregateFn, HealthCategory, HealthType, RecordKind, DeviceType, ExerciseType, MealType, RecordingMethod, SleepStage } from './types.js';

export interface HealthKitMapping {
  /** quantity | category | correlation | workout · derived: computed from several identifiers · multi: one identifier per value field · series: HKSeriesType read through a dedicated operation · special: non-sample HealthKit API */
  kind: 'quantity' | 'category' | 'correlation' | 'workout' | 'derived' | 'multi' | 'series' | 'special' | 'electrocardiogram' | 'heartbeatSeries' | 'stateOfMind' | 'activitySummary' | 'clinical' | 'medicationDose';
  identifier?: string;
  identifiers?: string[];
  /** value field → HK identifier (kind: multi) */
  fields?: Record<string, string>;
  /** HKUnit string used when reading/writing */
  unit?: string;
  /** category: spec enum value → HKCategoryValue raw value */
  values?: Record<string, number>;
  /** category: the value field that carries the enum */
  valueField?: string;
  /** value field → HealthKit metadata key, with the coercion applied on read/write */
  metadataFields?: Record<
    string,
    {
      key: string;
      type: 'boolean' | 'number' | 'string';
      booleanEnum?: { true: string; false: string };
      /** number keys holding an enum: spec value → HealthKit raw value */
      values?: Record<string, number>;
      /** HealthKit refuses the sample without this key; a boolean defaults to false, anything else must be given */
      required?: boolean;
    }
  >;
  /** minimum OS version when newer than the baseline */
  since?: string;
  read: boolean;
  write: boolean;
  notes?: string[];
}
export interface HealthConnectMapping {
  /** androidx.health.connect.client.records class name */
  record: string;
  /** Suffix of android.permission.health.READ_* / WRITE_* */
  permission: string;
  field?: string;
  /** value field → record property */
  fields?: Record<string, string>;
  unit?: string;
  /** Record holds a series of samples; providers flatten to one record per sample */
  series?: boolean;
  /** Not a Record class — reached through a dedicated operation (e.g. readRoute), never readRecords */
  special?: boolean;
  /** Personal Health Record (FHIR) resource type — read through readMedicalResources */
  medicalResourceType?: string;
  /** HealthConnectFeatures.FEATURE_* the device must report available; the type is unsupported otherwise */
  feature?: 'MINDFULNESS_SESSION' | 'SKIN_TEMPERATURE' | 'PERSONAL_HEALTH_RECORD';
  read: boolean;
  write: boolean;
  notes?: string[];
}
export interface TypeMapping {
  type: HealthType;
  category: HealthCategory;
  kind: RecordKind;
  since: string;
  aggregate: AggregateFn[];
  healthkit?: HealthKitMapping;
  healthconnect?: HealthConnectMapping;
  openmhealth?: { schema: string };
  notes: string[];
  /** value field → canonical unit symbol */
  fieldUnits: Record<string, string>;
}

export const TYPE_MAPPINGS: Record<HealthType, TypeMapping> = {
  "active_energy": {
    "type": "active_energy",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierActiveEnergyBurned",
      "unit": "kcal",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "ActiveCaloriesBurnedRecord",
      "permission": "ACTIVE_CALORIES_BURNED",
      "field": "energy",
      "unit": "kilocalories",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "calories-burned"
    },
    "notes": [],
    "fieldUnits": {
      "kilocalories": "kcal"
    }
  },
  "activity_summary": {
    "type": "activity_summary",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "activitySummary",
      "identifier": "HKActivitySummaryTypeIdentifier"
    },
    "notes": [],
    "fieldUnits": {
      "activeEnergyKilocalories": "kcal",
      "activeEnergyGoalKilocalories": "kcal",
      "exerciseMinutes": "min",
      "exerciseGoalMinutes": "min",
      "standHours": "count",
      "standGoalHours": "count",
      "moveMinutes": "min",
      "moveGoalMinutes": "min"
    }
  },
  "apple_exercise_time": {
    "type": "apple_exercise_time",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierAppleExerciseTime",
      "unit": "min",
      "notes": [
        "HealthKit computes this type; apps can read it but never write it."
      ]
    },
    "notes": [],
    "fieldUnits": {
      "minutes": "min"
    }
  },
  "apple_move_time": {
    "type": "apple_move_time",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierAppleMoveTime",
      "unit": "min",
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {
      "minutes": "min"
    }
  },
  "apple_sleeping_breathing_disturbances": {
    "type": "apple_sleeping_breathing_disturbances",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances",
      "unit": "count",
      "since": "iOS 18",
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {
      "count": "count"
    }
  },
  "apple_sleeping_wrist_temperature": {
    "type": "apple_sleeping_wrist_temperature",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierAppleSleepingWristTemperature",
      "unit": "degC",
      "since": "iOS 16",
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {
      "celsius": "°C"
    }
  },
  "apple_stand_hour": {
    "type": "apple_stand_hour",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierAppleStandHour",
      "values": {
        "stood": 0,
        "idle": 1
      },
      "valueField": "status",
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "apple_stand_time": {
    "type": "apple_stand_time",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierAppleStandTime",
      "unit": "min",
      "notes": [
        "HealthKit computes this type; apps can read it but never write it."
      ]
    },
    "notes": [],
    "fieldUnits": {
      "minutes": "min"
    }
  },
  "apple_walking_steadiness": {
    "type": "apple_walking_steadiness",
    "category": "mobility",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierAppleWalkingSteadiness",
      "unit": "%",
      "notes": [
        "HealthKit computes this type; apps can read it but never write it."
      ]
    },
    "notes": [],
    "fieldUnits": {
      "percent": "%"
    }
  },
  "apple_walking_steadiness_event": {
    "type": "apple_walking_steadiness_event",
    "category": "mobility",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierAppleWalkingSteadinessEvent",
      "values": {
        "initial_low": 1,
        "initial_very_low": 2,
        "repeat_low": 3,
        "repeat_very_low": 4
      },
      "valueField": "level",
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "atrial_fibrillation_burden": {
    "type": "atrial_fibrillation_burden",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierAtrialFibrillationBurden",
      "unit": "%",
      "since": "iOS 16",
      "notes": [
        "HealthKit computes this type; apps can read it but never write it."
      ]
    },
    "notes": [],
    "fieldUnits": {
      "percent": "%"
    }
  },
  "basal_body_temperature": {
    "type": "basal_body_temperature",
    "category": "cycle",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierBasalBodyTemperature",
      "unit": "degC"
    },
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "BasalBodyTemperatureRecord",
      "permission": "BASAL_BODY_TEMPERATURE",
      "field": "temperature",
      "unit": "celsius"
    },
    "openmhealth": {
      "schema": "body-temperature"
    },
    "notes": [],
    "fieldUnits": {
      "celsius": "°C"
    }
  },
  "basal_energy": {
    "type": "basal_energy",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierBasalEnergyBurned",
      "unit": "kcal"
    },
    "notes": [],
    "fieldUnits": {
      "kilocalories": "kcal"
    }
  },
  "basal_metabolic_rate": {
    "type": "basal_metabolic_rate",
    "category": "body",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "BasalMetabolicRateRecord",
      "permission": "BASAL_METABOLIC_RATE",
      "field": "basalMetabolicRate",
      "unit": "kilocaloriesPerDay"
    },
    "notes": [],
    "fieldUnits": {
      "kilocaloriesPerDay": "kcal/day"
    }
  },
  "bleeding_after_pregnancy": {
    "type": "bleeding_after_pregnancy",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierBleedingAfterPregnancy",
      "values": {
        "unspecified": 1,
        "light": 2,
        "medium": 3,
        "heavy": 4,
        "none": 5
      },
      "since": "iOS 18",
      "valueField": "flow"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "bleeding_during_pregnancy": {
    "type": "bleeding_during_pregnancy",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierBleedingDuringPregnancy",
      "values": {
        "unspecified": 1,
        "light": 2,
        "medium": 3,
        "heavy": 4,
        "none": 5
      },
      "since": "iOS 18",
      "valueField": "flow"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "blood_alcohol_content": {
    "type": "blood_alcohol_content",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierBloodAlcoholContent",
      "unit": "%"
    },
    "notes": [],
    "fieldUnits": {
      "percent": "%"
    }
  },
  "blood_glucose": {
    "type": "blood_glucose",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierBloodGlucose",
      "unit": "mmol<180.1558800000541>/L",
      "read": true,
      "write": true,
      "notes": [
        "Read with HKUnit.moleUnit(with: .milli, molarMass: HKUnitMolarMassBloodGlucose).unitDivided(by: .liter()). Meal relation from HKMetadataKeyBloodGlucoseMealTime."
      ]
    },
    "healthconnect": {
      "record": "BloodGlucoseRecord",
      "permission": "BLOOD_GLUCOSE",
      "field": "level",
      "unit": "millimolesPerLiter",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "blood-glucose"
    },
    "notes": [],
    "fieldUnits": {
      "millimolesPerLiter": "mmol/L"
    }
  },
  "blood_pressure": {
    "type": "blood_pressure",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "correlation",
      "identifier": "HKCorrelationTypeIdentifierBloodPressure",
      "identifiers": [
        "HKQuantityTypeIdentifierBloodPressureSystolic",
        "HKQuantityTypeIdentifierBloodPressureDiastolic"
      ],
      "unit": "mmHg",
      "read": true,
      "write": true,
      "notes": [
        "Authorization is requested for both quantity types; reads use the correlation so the pair stays together."
      ]
    },
    "healthconnect": {
      "record": "BloodPressureRecord",
      "permission": "BLOOD_PRESSURE",
      "fields": {
        "systolicMmHg": "systolic",
        "diastolicMmHg": "diastolic"
      },
      "unit": "millimetersOfMercury",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "blood-pressure"
    },
    "notes": [],
    "fieldUnits": {
      "systolicMmHg": "mmHg",
      "diastolicMmHg": "mmHg"
    }
  },
  "body_fat": {
    "type": "body_fat",
    "category": "body",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierBodyFatPercentage",
      "unit": "%",
      "read": true,
      "write": true,
      "notes": [
        "HKUnit.percent() is a fraction (0.21 = 21%); multiply by 100."
      ]
    },
    "healthconnect": {
      "record": "BodyFatRecord",
      "permission": "BODY_FAT",
      "field": "percentage",
      "unit": "percent",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "body-fat-percentage"
    },
    "notes": [],
    "fieldUnits": {
      "percent": "%"
    }
  },
  "body_mass_index": {
    "type": "body_mass_index",
    "category": "body",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierBodyMassIndex",
      "unit": "count"
    },
    "notes": [],
    "fieldUnits": {
      "value": "kg/m²"
    }
  },
  "body_temperature": {
    "type": "body_temperature",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierBodyTemperature",
      "unit": "degC",
      "read": true,
      "write": true,
      "notes": [
        "Measurement location from HKMetadataKeyBodyTemperatureSensorLocation."
      ]
    },
    "healthconnect": {
      "record": "BodyTemperatureRecord",
      "permission": "BODY_TEMPERATURE",
      "field": "temperature",
      "unit": "celsius",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "body-temperature"
    },
    "notes": [],
    "fieldUnits": {
      "celsius": "°C"
    }
  },
  "body_water_mass": {
    "type": "body_water_mass",
    "category": "body",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "BodyWaterMassRecord",
      "permission": "BODY_WATER_MASS",
      "field": "mass",
      "unit": "kilograms"
    },
    "notes": [],
    "fieldUnits": {
      "kilograms": "kg"
    }
  },
  "bone_mass": {
    "type": "bone_mass",
    "category": "body",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "BoneMassRecord",
      "permission": "BONE_MASS",
      "field": "mass",
      "unit": "kilograms"
    },
    "notes": [],
    "fieldUnits": {
      "kilograms": "kg"
    }
  },
  "cervical_mucus": {
    "type": "cervical_mucus",
    "category": "cycle",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierCervicalMucusQuality",
      "valueField": "appearance",
      "values": {
        "dry": 1,
        "sticky": 2,
        "creamy": 3,
        "watery": 4,
        "egg_white": 5
      },
      "notes": [
        "HealthKit records appearance only; sensation is Health Connect only."
      ]
    },
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "CervicalMucusRecord",
      "permission": "CERVICAL_MUCUS",
      "fields": {
        "appearance": "appearance",
        "sensation": "sensation"
      }
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_allergy": {
    "type": "clinical_allergy",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "clinical",
      "identifier": "HKClinicalTypeIdentifierAllergyRecord"
    },
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_ALLERGIES_INTOLERANCES",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "ALLERGIES_INTOLERANCES"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_condition": {
    "type": "clinical_condition",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "clinical",
      "identifier": "HKClinicalTypeIdentifierConditionRecord"
    },
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_CONDITIONS",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "CONDITIONS"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_coverage": {
    "type": "clinical_coverage",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "clinical",
      "identifier": "HKClinicalTypeIdentifierCoverageRecord"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_immunization": {
    "type": "clinical_immunization",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "clinical",
      "identifier": "HKClinicalTypeIdentifierImmunizationRecord"
    },
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_VACCINES",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "VACCINES"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_lab_result": {
    "type": "clinical_lab_result",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "clinical",
      "identifier": "HKClinicalTypeIdentifierLabResultRecord"
    },
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_LABORATORY_RESULTS",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "LABORATORY_RESULTS"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_medication": {
    "type": "clinical_medication",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "clinical",
      "identifier": "HKClinicalTypeIdentifierMedicationRecord"
    },
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_MEDICATIONS",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "MEDICATIONS"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_note": {
    "type": "clinical_note",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "clinical",
      "identifier": "HKClinicalTypeIdentifierClinicalNoteRecord",
      "since": "iOS 16",
      "notes": [
        "Identifier taken from Apple documentation only — no cross-checkable source declares it (iOS 16+). Confirm against the SDK before relying on it."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_personal_details": {
    "type": "clinical_personal_details",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_PERSONAL_DETAILS",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "PERSONAL_DETAILS"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_practitioner_details": {
    "type": "clinical_practitioner_details",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_PRACTITIONER_DETAILS",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "PRACTITIONER_DETAILS"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_pregnancy": {
    "type": "clinical_pregnancy",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_PREGNANCY",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "PREGNANCY"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_procedure": {
    "type": "clinical_procedure",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "clinical",
      "identifier": "HKClinicalTypeIdentifierProcedureRecord"
    },
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_PROCEDURES",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "PROCEDURES"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_social_history": {
    "type": "clinical_social_history",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_SOCIAL_HISTORY",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "SOCIAL_HISTORY"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_visit": {
    "type": "clinical_visit",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_VISITS",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "VISITS"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "clinical_vital_sign": {
    "type": "clinical_vital_sign",
    "category": "clinical",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "clinical",
      "identifier": "HKClinicalTypeIdentifierVitalSignRecord"
    },
    "healthconnect": {
      "read": true,
      "write": false,
      "record": "MedicalResource",
      "permission": "MEDICAL_DATA_VITAL_SIGNS",
      "feature": "PERSONAL_HEALTH_RECORD",
      "medicalResourceType": "VITAL_SIGNS"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "contraceptive": {
    "type": "contraceptive",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierContraceptive",
      "values": {
        "unspecified": 1,
        "implant": 2,
        "injection": 3,
        "intrauterine_device": 4,
        "intravaginal_ring": 5,
        "oral": 6,
        "patch": 7
      },
      "valueField": "method"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "cross_country_skiing_speed": {
    "type": "cross_country_skiing_speed",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierCrossCountrySkiingSpeed",
      "unit": "m/s",
      "since": "iOS 18"
    },
    "notes": [],
    "fieldUnits": {
      "metersPerSecond": "m/s"
    }
  },
  "cycling_cadence": {
    "type": "cycling_cadence",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierCyclingCadence",
      "unit": "count/min",
      "since": "iOS 17"
    },
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "CyclingPedalingCadenceRecord",
      "permission": "CYCLING_PEDALING_CADENCE",
      "field": "samples[].revolutionsPerMinute",
      "unit": "rpm",
      "series": true
    },
    "notes": [],
    "fieldUnits": {
      "rpm": "rpm"
    }
  },
  "cycling_functional_threshold_power": {
    "type": "cycling_functional_threshold_power",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierCyclingFunctionalThresholdPower",
      "unit": "W",
      "since": "iOS 17"
    },
    "notes": [],
    "fieldUnits": {
      "watts": "W"
    }
  },
  "cycling_power": {
    "type": "cycling_power",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierCyclingPower",
      "unit": "W",
      "since": "iOS 17"
    },
    "notes": [],
    "fieldUnits": {
      "watts": "W"
    }
  },
  "cycling_speed": {
    "type": "cycling_speed",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierCyclingSpeed",
      "unit": "m/s",
      "since": "iOS 17"
    },
    "notes": [],
    "fieldUnits": {
      "metersPerSecond": "m/s"
    }
  },
  "distance": {
    "type": "distance",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierDistanceWalkingRunning",
      "unit": "m",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "DistanceRecord",
      "permission": "DISTANCE",
      "field": "distance",
      "unit": "meters",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "physical-activity"
    },
    "notes": [
      "HealthKit splits distance by activity (distanceCycling, distanceSwimming, distanceWheelchair, distanceDownhillSnowSports); v1 maps walking/running only. Health Connect has a single DistanceRecord regardless of activity."
    ],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "distance_cross_country_skiing": {
    "type": "distance_cross_country_skiing",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierDistanceCrossCountrySkiing",
      "unit": "m",
      "since": "iOS 18"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "distance_cycling": {
    "type": "distance_cycling",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierDistanceCycling",
      "unit": "m"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "distance_downhill_snow_sports": {
    "type": "distance_downhill_snow_sports",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierDistanceDownhillSnowSports",
      "unit": "m"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "distance_paddle_sports": {
    "type": "distance_paddle_sports",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierDistancePaddleSports",
      "unit": "m",
      "since": "iOS 18"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "distance_rowing": {
    "type": "distance_rowing",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierDistanceRowing",
      "unit": "m",
      "since": "iOS 18"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "distance_skating_sports": {
    "type": "distance_skating_sports",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierDistanceSkatingSports",
      "unit": "m",
      "since": "iOS 18"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "distance_swimming": {
    "type": "distance_swimming",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierDistanceSwimming",
      "unit": "m"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "distance_wheelchair": {
    "type": "distance_wheelchair",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierDistanceWheelchair",
      "unit": "m"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "electrocardiogram": {
    "type": "electrocardiogram",
    "category": "vitals",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "electrocardiogram",
      "identifier": "HKDataTypeIdentifierElectrocardiogram",
      "since": "iOS 14"
    },
    "notes": [],
    "fieldUnits": {
      "averageBpm": "beats/min",
      "samplingFrequencyHz": "Hz",
      "voltageCount": "count"
    }
  },
  "electrodermal_activity": {
    "type": "electrodermal_activity",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierElectrodermalActivity",
      "unit": "mcS"
    },
    "notes": [],
    "fieldUnits": {
      "microsiemens": "µS"
    }
  },
  "elevation_gained": {
    "type": "elevation_gained",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "ElevationGainedRecord",
      "permission": "ELEVATION_GAINED",
      "field": "elevation",
      "unit": "meters"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "environmental_audio_exposure": {
    "type": "environmental_audio_exposure",
    "category": "environment",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierEnvironmentalAudioExposure",
      "unit": "dBASPL"
    },
    "notes": [],
    "fieldUnits": {
      "decibels": "dB(A)"
    }
  },
  "environmental_audio_exposure_event": {
    "type": "environmental_audio_exposure_event",
    "category": "environment",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierAudioExposureEvent",
      "values": {},
      "notes": [
        "Apple renamed the Swift case to `environmentalAudioExposureEvent` in iOS 14 but kept the raw value `HKCategoryTypeIdentifierAudioExposureEvent`. Verified at runtime — the renamed string does not resolve.",
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "environmental_sound_reduction": {
    "type": "environmental_sound_reduction",
    "category": "environment",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierEnvironmentalSoundReduction",
      "unit": "dBASPL",
      "since": "iOS 16"
    },
    "notes": [],
    "fieldUnits": {
      "decibels": "dB(A)"
    }
  },
  "estimated_workout_effort_score": {
    "type": "estimated_workout_effort_score",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierEstimatedWorkoutEffortScore",
      "unit": "appleEffortScore",
      "since": "iOS 18"
    },
    "notes": [],
    "fieldUnits": {
      "score": "score"
    }
  },
  "exercise_route": {
    "type": "exercise_route",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "series",
      "identifier": "HKWorkoutRouteTypeIdentifier",
      "notes": [
        "HKSeriesType.workoutRoute(); points arrive as CLLocation batches."
      ]
    },
    "healthconnect": {
      "read": false,
      "write": true,
      "record": "ExerciseRoute",
      "permission": "EXERCISE_ROUTE",
      "special": true,
      "notes": [
        "Read consent is per session via requestExerciseRoute (no READ permission exists); WRITE_EXERCISE_ROUTE covers writes."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "exercise_session": {
    "type": "exercise_session",
    "category": "activity",
    "kind": "session",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "kind": "workout",
      "identifier": "HKWorkoutTypeIdentifier",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "ExerciseSessionRecord",
      "permission": "EXERCISE",
      "field": "exerciseType",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "physical-activity"
    },
    "notes": [
      "Activity type mapping lives in enums/exercise_type.json (draft, to be verified in Phase 1).",
      "Segments, laps and routes are out of scope for v1."
    ],
    "fieldUnits": {}
  },
  "floors_climbed": {
    "type": "floors_climbed",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierFlightsClimbed",
      "unit": "count",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "FloorsClimbedRecord",
      "permission": "FLOORS_CLIMBED",
      "field": "floors",
      "unit": "count",
      "read": true,
      "write": true
    },
    "notes": [],
    "fieldUnits": {
      "count": "count"
    }
  },
  "forced_expiratory_volume_1": {
    "type": "forced_expiratory_volume_1",
    "category": "respiratory",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierForcedExpiratoryVolume1",
      "unit": "L"
    },
    "notes": [],
    "fieldUnits": {
      "liters": "L"
    }
  },
  "forced_vital_capacity": {
    "type": "forced_vital_capacity",
    "category": "respiratory",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierForcedVitalCapacity",
      "unit": "L"
    },
    "notes": [],
    "fieldUnits": {
      "liters": "L"
    }
  },
  "handwashing_event": {
    "type": "handwashing_event",
    "category": "wellness",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierHandwashingEvent",
      "values": {}
    },
    "notes": [],
    "fieldUnits": {}
  },
  "headphone_audio_exposure": {
    "type": "headphone_audio_exposure",
    "category": "environment",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierHeadphoneAudioExposure",
      "unit": "dBASPL"
    },
    "notes": [],
    "fieldUnits": {
      "decibels": "dB(A)"
    }
  },
  "headphone_audio_exposure_event": {
    "type": "headphone_audio_exposure_event",
    "category": "environment",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierHeadphoneAudioExposureEvent",
      "values": {},
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "heart_rate": {
    "type": "heart_rate",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max",
      "count"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierHeartRate",
      "unit": "count/min",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "HeartRateRecord",
      "permission": "HEART_RATE",
      "field": "samples[].beatsPerMinute",
      "unit": "bpm",
      "series": true,
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "heart-rate"
    },
    "notes": [
      "Health Connect stores a series of samples per record; providers flatten each sample into its own point record whose id is `<recordId>#<index>`."
    ],
    "fieldUnits": {
      "bpm": "beats/min"
    }
  },
  "heart_rate_recovery_one_minute": {
    "type": "heart_rate_recovery_one_minute",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierHeartRateRecoveryOneMinute",
      "unit": "count/min",
      "since": "iOS 16"
    },
    "notes": [],
    "fieldUnits": {
      "bpm": "beats/min"
    }
  },
  "heartbeat_series": {
    "type": "heartbeat_series",
    "category": "vitals",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "heartbeatSeries",
      "identifier": "HKDataTypeIdentifierHeartbeatSeries",
      "since": "iOS 13"
    },
    "notes": [],
    "fieldUnits": {
      "count": "count"
    }
  },
  "height": {
    "type": "height",
    "category": "body",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierHeight",
      "unit": "m",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "HeightRecord",
      "permission": "HEIGHT",
      "field": "height",
      "unit": "meters",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "body-height"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "high_heart_rate_event": {
    "type": "high_heart_rate_event",
    "category": "vitals",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierHighHeartRateEvent",
      "values": {},
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "hrv_rmssd": {
    "type": "hrv_rmssd",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthconnect": {
      "record": "HeartRateVariabilityRmssdRecord",
      "permission": "HEART_RATE_VARIABILITY",
      "field": "heartRateVariabilityMillis",
      "unit": "ms",
      "read": true,
      "write": true
    },
    "notes": [
      "SDNN and RMSSD are different statistics and MUST NOT be converted into each other. See hrv_sdnn for HealthKit."
    ],
    "fieldUnits": {
      "milliseconds": "ms"
    }
  },
  "hrv_sdnn": {
    "type": "hrv_sdnn",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierHeartRateVariabilitySDNN",
      "unit": "ms",
      "read": true,
      "write": true
    },
    "notes": [
      "SDNN and RMSSD are different statistics and MUST NOT be converted into each other. See hrv_rmssd for Health Connect."
    ],
    "fieldUnits": {
      "milliseconds": "ms"
    }
  },
  "hydration": {
    "type": "hydration",
    "category": "nutrition",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierDietaryWater",
      "unit": "L",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "HydrationRecord",
      "permission": "HYDRATION",
      "field": "volume",
      "unit": "liters",
      "read": true,
      "write": true
    },
    "notes": [],
    "fieldUnits": {
      "liters": "L"
    }
  },
  "infrequent_menstrual_cycles": {
    "type": "infrequent_menstrual_cycles",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierInfrequentMenstrualCycles",
      "values": {},
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "inhaler_usage": {
    "type": "inhaler_usage",
    "category": "respiratory",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierInhalerUsage",
      "unit": "count"
    },
    "notes": [],
    "fieldUnits": {
      "count": "count"
    }
  },
  "insulin_delivery": {
    "type": "insulin_delivery",
    "category": "vitals",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierInsulinDelivery",
      "unit": "IU",
      "metadataFields": {
        "reason": {
          "key": "HKInsulinDeliveryReason",
          "type": "number",
          "values": {
            "basal": 1,
            "bolus": 2
          },
          "required": true
        }
      }
    },
    "notes": [],
    "fieldUnits": {
      "internationalUnits": "IU"
    }
  },
  "intermenstrual_bleeding": {
    "type": "intermenstrual_bleeding",
    "category": "cycle",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierIntermenstrualBleeding",
      "values": {}
    },
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "IntermenstrualBleedingRecord",
      "permission": "INTERMENSTRUAL_BLEEDING"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "irregular_heart_rhythm_event": {
    "type": "irregular_heart_rhythm_event",
    "category": "vitals",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierIrregularHeartRhythmEvent",
      "values": {},
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "irregular_menstrual_cycles": {
    "type": "irregular_menstrual_cycles",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierIrregularMenstrualCycles",
      "values": {},
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "lactation": {
    "type": "lactation",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierLactation",
      "values": {}
    },
    "notes": [],
    "fieldUnits": {}
  },
  "lean_body_mass": {
    "type": "lean_body_mass",
    "category": "body",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierLeanBodyMass",
      "unit": "kg",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "LeanBodyMassRecord",
      "permission": "LEAN_BODY_MASS",
      "field": "mass",
      "unit": "kilograms",
      "read": true,
      "write": true
    },
    "notes": [],
    "fieldUnits": {
      "kilograms": "kg"
    }
  },
  "low_cardio_fitness_event": {
    "type": "low_cardio_fitness_event",
    "category": "vitals",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierLowCardioFitnessEvent",
      "values": {},
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "low_heart_rate_event": {
    "type": "low_heart_rate_event",
    "category": "vitals",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierLowHeartRateEvent",
      "values": {},
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "medication_dose": {
    "type": "medication_dose",
    "category": "clinical",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "medicationDose",
      "identifier": "HKDataTypeIdentifierMedicationDoseEvent",
      "since": "iOS 26"
    },
    "notes": [],
    "fieldUnits": {
      "scheduledDose": "dose",
      "dose": "dose"
    }
  },
  "menstruation_flow": {
    "type": "menstruation_flow",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierMenstrualFlow",
      "valueField": "flow",
      "values": {
        "unknown": 1,
        "light": 2,
        "medium": 3,
        "heavy": 4,
        "none": 5
      },
      "metadataFields": {
        "cycleStart": {
          "key": "HKMenstrualCycleStart",
          "type": "boolean",
          "required": true
        }
      }
    },
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "MenstruationFlowRecord",
      "permission": "MENSTRUATION",
      "field": "flow",
      "notes": [
        "Health Connect has no \"none\" flow; it is written as FLOW_UNKNOWN.",
        "MenstruationFlowRecord is instantaneous: Health Connect keeps only start, so end reads back equal to start."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "menstruation_period": {
    "type": "menstruation_period",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "MenstruationPeriodRecord",
      "permission": "MENSTRUATION"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "mindfulness_session": {
    "type": "mindfulness_session",
    "category": "wellness",
    "kind": "session",
    "since": "1.0",
    "aggregate": [
      "duration",
      "count"
    ],
    "healthkit": {
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierMindfulSession",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "MindfulnessSessionRecord",
      "permission": "MINDFULNESS",
      "feature": "MINDFULNESS_SESSION",
      "field": "mindfulnessSessionType",
      "read": true,
      "write": true
    },
    "notes": [],
    "fieldUnits": {}
  },
  "nike_fuel": {
    "type": "nike_fuel",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierNikeFuel",
      "unit": "count"
    },
    "notes": [],
    "fieldUnits": {
      "count": "count"
    }
  },
  "number_of_alcoholic_beverages": {
    "type": "number_of_alcoholic_beverages",
    "category": "nutrition",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierNumberOfAlcoholicBeverages",
      "unit": "count",
      "since": "iOS 15"
    },
    "notes": [],
    "fieldUnits": {
      "count": "count"
    }
  },
  "number_of_times_fallen": {
    "type": "number_of_times_fallen",
    "category": "mobility",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierNumberOfTimesFallen",
      "unit": "count"
    },
    "notes": [],
    "fieldUnits": {
      "count": "count"
    }
  },
  "nutrition": {
    "type": "nutrition",
    "category": "nutrition",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "multi",
      "fields": {
        "kilocalories": "HKQuantityTypeIdentifierDietaryEnergyConsumed",
        "proteinGrams": "HKQuantityTypeIdentifierDietaryProtein",
        "carbohydrateGrams": "HKQuantityTypeIdentifierDietaryCarbohydrates",
        "fatGrams": "HKQuantityTypeIdentifierDietaryFatTotal",
        "fatSaturatedGrams": "HKQuantityTypeIdentifierDietaryFatSaturated",
        "fatMonounsaturatedGrams": "HKQuantityTypeIdentifierDietaryFatMonounsaturated",
        "fatPolyunsaturatedGrams": "HKQuantityTypeIdentifierDietaryFatPolyunsaturated",
        "fiberGrams": "HKQuantityTypeIdentifierDietaryFiber",
        "sugarGrams": "HKQuantityTypeIdentifierDietarySugar",
        "cholesterolMilligrams": "HKQuantityTypeIdentifierDietaryCholesterol",
        "sodiumMilligrams": "HKQuantityTypeIdentifierDietarySodium",
        "potassiumMilligrams": "HKQuantityTypeIdentifierDietaryPotassium",
        "calciumMilligrams": "HKQuantityTypeIdentifierDietaryCalcium",
        "ironMilligrams": "HKQuantityTypeIdentifierDietaryIron",
        "magnesiumMilligrams": "HKQuantityTypeIdentifierDietaryMagnesium",
        "phosphorusMilligrams": "HKQuantityTypeIdentifierDietaryPhosphorus",
        "zincMilligrams": "HKQuantityTypeIdentifierDietaryZinc",
        "copperMilligrams": "HKQuantityTypeIdentifierDietaryCopper",
        "manganeseMilligrams": "HKQuantityTypeIdentifierDietaryManganese",
        "chlorideMilligrams": "HKQuantityTypeIdentifierDietaryChloride",
        "seleniumMicrograms": "HKQuantityTypeIdentifierDietarySelenium",
        "iodineMicrograms": "HKQuantityTypeIdentifierDietaryIodine",
        "chromiumMicrograms": "HKQuantityTypeIdentifierDietaryChromium",
        "molybdenumMicrograms": "HKQuantityTypeIdentifierDietaryMolybdenum",
        "vitaminAMicrograms": "HKQuantityTypeIdentifierDietaryVitaminA",
        "vitaminB6Milligrams": "HKQuantityTypeIdentifierDietaryVitaminB6",
        "vitaminB12Micrograms": "HKQuantityTypeIdentifierDietaryVitaminB12",
        "vitaminCMilligrams": "HKQuantityTypeIdentifierDietaryVitaminC",
        "vitaminDMicrograms": "HKQuantityTypeIdentifierDietaryVitaminD",
        "vitaminEMilligrams": "HKQuantityTypeIdentifierDietaryVitaminE",
        "vitaminKMicrograms": "HKQuantityTypeIdentifierDietaryVitaminK",
        "thiaminMilligrams": "HKQuantityTypeIdentifierDietaryThiamin",
        "riboflavinMilligrams": "HKQuantityTypeIdentifierDietaryRiboflavin",
        "niacinMilligrams": "HKQuantityTypeIdentifierDietaryNiacin",
        "folateMicrograms": "HKQuantityTypeIdentifierDietaryFolate",
        "biotinMicrograms": "HKQuantityTypeIdentifierDietaryBiotin",
        "pantothenicAcidMilligrams": "HKQuantityTypeIdentifierDietaryPantothenicAcid",
        "caffeineMilligrams": "HKQuantityTypeIdentifierDietaryCaffeine"
      },
      "notes": [
        "No single nutrition object: one quantity sample per nutrient, grouped in an HKCorrelationTypeIdentifierFood correlation on write and when reading.",
        "HKUnit strings: kcal, g, mg, mcg."
      ]
    },
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "NutritionRecord",
      "permission": "NUTRITION",
      "fields": {
        "kilocalories": "energy",
        "energyFromFatKilocalories": "energyFromFat",
        "proteinGrams": "protein",
        "carbohydrateGrams": "totalCarbohydrate",
        "fatGrams": "totalFat",
        "fatSaturatedGrams": "saturatedFat",
        "fatMonounsaturatedGrams": "monounsaturatedFat",
        "fatPolyunsaturatedGrams": "polyunsaturatedFat",
        "transFatGrams": "transFat",
        "unsaturatedFatGrams": "unsaturatedFat",
        "fiberGrams": "dietaryFiber",
        "sugarGrams": "sugar",
        "cholesterolMilligrams": "cholesterol",
        "sodiumMilligrams": "sodium",
        "potassiumMilligrams": "potassium",
        "calciumMilligrams": "calcium",
        "ironMilligrams": "iron",
        "magnesiumMilligrams": "magnesium",
        "phosphorusMilligrams": "phosphorus",
        "zincMilligrams": "zinc",
        "copperMilligrams": "copper",
        "manganeseMilligrams": "manganese",
        "chlorideMilligrams": "chloride",
        "seleniumMicrograms": "selenium",
        "iodineMicrograms": "iodine",
        "chromiumMicrograms": "chromium",
        "molybdenumMicrograms": "molybdenum",
        "vitaminAMicrograms": "vitaminA",
        "vitaminB6Milligrams": "vitaminB6",
        "vitaminB12Micrograms": "vitaminB12",
        "vitaminCMilligrams": "vitaminC",
        "vitaminDMicrograms": "vitaminD",
        "vitaminEMilligrams": "vitaminE",
        "vitaminKMicrograms": "vitaminK",
        "thiaminMilligrams": "thiamin",
        "riboflavinMilligrams": "riboflavin",
        "niacinMilligrams": "niacin",
        "folateMicrograms": "folate",
        "folicAcidMicrograms": "folicAcid",
        "biotinMicrograms": "biotin",
        "pantothenicAcidMilligrams": "pantothenicAcid",
        "caffeineMilligrams": "caffeine"
      }
    },
    "notes": [
      "The two platforms are structural opposites (many samples vs one record); the spec models the Health Connect shape and HealthKit providers group/ungroup."
    ],
    "fieldUnits": {
      "kilocalories": "kcal",
      "energyFromFatKilocalories": "kcal",
      "proteinGrams": "g",
      "carbohydrateGrams": "g",
      "fatGrams": "g",
      "fatSaturatedGrams": "g",
      "fatMonounsaturatedGrams": "g",
      "fatPolyunsaturatedGrams": "g",
      "transFatGrams": "g",
      "unsaturatedFatGrams": "g",
      "fiberGrams": "g",
      "sugarGrams": "g",
      "cholesterolMilligrams": "mg",
      "sodiumMilligrams": "mg",
      "potassiumMilligrams": "mg",
      "calciumMilligrams": "mg",
      "ironMilligrams": "mg",
      "magnesiumMilligrams": "mg",
      "phosphorusMilligrams": "mg",
      "zincMilligrams": "mg",
      "copperMilligrams": "mg",
      "manganeseMilligrams": "mg",
      "chlorideMilligrams": "mg",
      "seleniumMicrograms": "mcg",
      "iodineMicrograms": "mcg",
      "chromiumMicrograms": "mcg",
      "molybdenumMicrograms": "mcg",
      "vitaminAMicrograms": "mcg",
      "vitaminB6Milligrams": "mg",
      "vitaminB12Micrograms": "mcg",
      "vitaminCMilligrams": "mg",
      "vitaminDMicrograms": "mcg",
      "vitaminEMilligrams": "mg",
      "vitaminKMicrograms": "mcg",
      "thiaminMilligrams": "mg",
      "riboflavinMilligrams": "mg",
      "niacinMilligrams": "mg",
      "folateMicrograms": "mcg",
      "folicAcidMicrograms": "mcg",
      "biotinMicrograms": "mcg",
      "pantothenicAcidMilligrams": "mg",
      "caffeineMilligrams": "mg"
    }
  },
  "ovulation_test": {
    "type": "ovulation_test",
    "category": "cycle",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierOvulationTestResult",
      "valueField": "result",
      "values": {
        "negative": 1,
        "positive": 2,
        "inconclusive": 3,
        "high": 4
      },
      "notes": [
        "HealthKit: positive = luteinizingHormoneSurge, high = estrogenSurge, inconclusive = indeterminate."
      ]
    },
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "OvulationTestRecord",
      "permission": "OVULATION_TEST",
      "field": "result"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "oxygen_saturation": {
    "type": "oxygen_saturation",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierOxygenSaturation",
      "unit": "%",
      "read": true,
      "write": true,
      "notes": [
        "HKUnit.percent() is a fraction (0.97 = 97%); multiply by 100."
      ]
    },
    "healthconnect": {
      "record": "OxygenSaturationRecord",
      "permission": "OXYGEN_SATURATION",
      "field": "percentage",
      "unit": "percent",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "oxygen-saturation"
    },
    "notes": [],
    "fieldUnits": {
      "percent": "%"
    }
  },
  "paddle_sports_speed": {
    "type": "paddle_sports_speed",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierPaddleSportsSpeed",
      "unit": "m/s",
      "since": "iOS 18"
    },
    "notes": [],
    "fieldUnits": {
      "metersPerSecond": "m/s"
    }
  },
  "peak_expiratory_flow_rate": {
    "type": "peak_expiratory_flow_rate",
    "category": "respiratory",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierPeakExpiratoryFlowRate",
      "unit": "L/min"
    },
    "notes": [],
    "fieldUnits": {
      "litersPerMinute": "L/min"
    }
  },
  "peripheral_perfusion_index": {
    "type": "peripheral_perfusion_index",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierPeripheralPerfusionIndex",
      "unit": "%"
    },
    "notes": [],
    "fieldUnits": {
      "percent": "%"
    }
  },
  "persistent_intermenstrual_bleeding": {
    "type": "persistent_intermenstrual_bleeding",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierPersistentIntermenstrualBleeding",
      "values": {},
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "physical_effort": {
    "type": "physical_effort",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierPhysicalEffort",
      "unit": "kcal/(kg*hr)",
      "since": "iOS 17"
    },
    "notes": [],
    "fieldUnits": {
      "metsEquivalent": "kcal/(kg·h)"
    }
  },
  "power": {
    "type": "power",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "PowerRecord",
      "permission": "POWER",
      "field": "samples[].power",
      "unit": "watts",
      "series": true
    },
    "notes": [],
    "fieldUnits": {
      "watts": "W"
    }
  },
  "pregnancy": {
    "type": "pregnancy",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierPregnancy",
      "values": {}
    },
    "notes": [],
    "fieldUnits": {}
  },
  "pregnancy_test": {
    "type": "pregnancy_test",
    "category": "cycle",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierPregnancyTestResult",
      "values": {
        "negative": 1,
        "positive": 2,
        "indeterminate": 3
      },
      "valueField": "result"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "progesterone_test": {
    "type": "progesterone_test",
    "category": "cycle",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierProgesteroneTestResult",
      "values": {
        "negative": 1,
        "positive": 2,
        "indeterminate": 3
      },
      "valueField": "result"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "prolonged_menstrual_periods": {
    "type": "prolonged_menstrual_periods",
    "category": "cycle",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierProlongedMenstrualPeriods",
      "values": {},
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "respiratory_rate": {
    "type": "respiratory_rate",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierRespiratoryRate",
      "unit": "count/min",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "RespiratoryRateRecord",
      "permission": "RESPIRATORY_RATE",
      "field": "rate",
      "unit": "breaths/min",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "respiratory-rate"
    },
    "notes": [],
    "fieldUnits": {
      "breathsPerMinute": "breaths/min"
    }
  },
  "resting_heart_rate": {
    "type": "resting_heart_rate",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierRestingHeartRate",
      "unit": "count/min",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "RestingHeartRateRecord",
      "permission": "RESTING_HEART_RATE",
      "field": "beatsPerMinute",
      "unit": "bpm",
      "read": true,
      "write": true
    },
    "notes": [],
    "fieldUnits": {
      "bpm": "beats/min"
    }
  },
  "rowing_speed": {
    "type": "rowing_speed",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierRowingSpeed",
      "unit": "m/s",
      "since": "iOS 18"
    },
    "notes": [],
    "fieldUnits": {
      "metersPerSecond": "m/s"
    }
  },
  "running_ground_contact_time": {
    "type": "running_ground_contact_time",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierRunningGroundContactTime",
      "unit": "ms",
      "since": "iOS 16"
    },
    "notes": [],
    "fieldUnits": {
      "milliseconds": "ms"
    }
  },
  "running_power": {
    "type": "running_power",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierRunningPower",
      "unit": "W",
      "since": "iOS 16"
    },
    "notes": [],
    "fieldUnits": {
      "watts": "W"
    }
  },
  "running_speed": {
    "type": "running_speed",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierRunningSpeed",
      "unit": "m/s",
      "since": "iOS 16"
    },
    "notes": [],
    "fieldUnits": {
      "metersPerSecond": "m/s"
    }
  },
  "running_stride_length": {
    "type": "running_stride_length",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierRunningStrideLength",
      "unit": "m",
      "since": "iOS 16"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "running_vertical_oscillation": {
    "type": "running_vertical_oscillation",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierRunningVerticalOscillation",
      "unit": "cm",
      "since": "iOS 16"
    },
    "notes": [],
    "fieldUnits": {
      "centimeters": "cm"
    }
  },
  "sexual_activity": {
    "type": "sexual_activity",
    "category": "cycle",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "count"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierSexualActivity",
      "values": {},
      "metadataFields": {
        "protectionUsed": {
          "key": "HKSexualActivityProtectionUsed",
          "type": "boolean",
          "booleanEnum": {
            "true": "protected",
            "false": "unprotected"
          }
        }
      }
    },
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "SexualActivityRecord",
      "permission": "SEXUAL_ACTIVITY",
      "field": "protectionUsed"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "six_minute_walk_distance": {
    "type": "six_minute_walk_distance",
    "category": "mobility",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierSixMinuteWalkTestDistance",
      "unit": "m"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "skin_temperature": {
    "type": "skin_temperature",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthconnect": {
      "record": "SkinTemperatureRecord",
      "permission": "SKIN_TEMPERATURE",
      "feature": "SKIN_TEMPERATURE",
      "field": "deltas[].delta",
      "unit": "celsius (delta)",
      "series": true,
      "read": true,
      "write": true
    },
    "notes": [
      "HealthKit's HKQuantityTypeIdentifierAppleSleepingWristTemperature is an absolute nightly value, not a delta — a candidate for a separate v1.1 type, not a mapping of this one.",
      "Each delta in the Health Connect series becomes its own point record."
    ],
    "fieldUnits": {
      "deltaCelsius": "°C",
      "baselineCelsius": "°C"
    }
  },
  "sleep_apnea_event": {
    "type": "sleep_apnea_event",
    "category": "sleep",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierSleepApneaEvent",
      "values": {},
      "since": "iOS 18",
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {}
  },
  "sleep_session": {
    "type": "sleep_session",
    "category": "sleep",
    "kind": "session",
    "since": "1.0",
    "aggregate": [
      "duration",
      "count"
    ],
    "healthkit": {
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierSleepAnalysis",
      "read": true,
      "write": true,
      "notes": [
        "HealthKit has no session object: each stage is a separate category sample. Providers derive sessions by grouping consecutive samples from the same source with gaps ≤ 60 minutes; the session id is the first sample's UUID."
      ]
    },
    "healthconnect": {
      "record": "SleepSessionRecord",
      "permission": "SLEEP",
      "field": "stages[]",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "sleep-episode"
    },
    "notes": [
      "Stage mapping lives in enums/sleep_stage.json."
    ],
    "fieldUnits": {}
  },
  "speed": {
    "type": "speed",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "SpeedRecord",
      "permission": "SPEED",
      "field": "samples[].speed",
      "unit": "metersPerSecond",
      "series": true
    },
    "notes": [],
    "fieldUnits": {
      "metersPerSecond": "m/s"
    }
  },
  "stair_ascent_speed": {
    "type": "stair_ascent_speed",
    "category": "mobility",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierStairAscentSpeed",
      "unit": "m/s"
    },
    "notes": [],
    "fieldUnits": {
      "metersPerSecond": "m/s"
    }
  },
  "stair_descent_speed": {
    "type": "stair_descent_speed",
    "category": "mobility",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierStairDescentSpeed",
      "unit": "m/s"
    },
    "notes": [],
    "fieldUnits": {
      "metersPerSecond": "m/s"
    }
  },
  "state_of_mind": {
    "type": "state_of_mind",
    "category": "mind",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "count",
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "stateOfMind",
      "identifier": "HKDataTypeIdentifierStateOfMind",
      "since": "iOS 18"
    },
    "notes": [],
    "fieldUnits": {
      "valence": "valence"
    }
  },
  "steps": {
    "type": "steps",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierStepCount",
      "unit": "count",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "StepsRecord",
      "permission": "STEPS",
      "field": "count",
      "unit": "count",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "step-count"
    },
    "notes": [],
    "fieldUnits": {
      "count": "count"
    }
  },
  "steps_cadence": {
    "type": "steps_cadence",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthconnect": {
      "read": true,
      "write": true,
      "record": "StepsCadenceRecord",
      "permission": "STEPS_CADENCE",
      "field": "samples[].rate",
      "unit": "steps/min",
      "series": true
    },
    "notes": [],
    "fieldUnits": {
      "stepsPerMinute": "steps/min"
    }
  },
  "swimming_stroke_count": {
    "type": "swimming_stroke_count",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierSwimmingStrokeCount",
      "unit": "count"
    },
    "notes": [],
    "fieldUnits": {
      "count": "count"
    }
  },
  "symptom_abdominal_cramps": {
    "type": "symptom_abdominal_cramps",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierAbdominalCramps",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_acne": {
    "type": "symptom_acne",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierAcne",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_appetite_changes": {
    "type": "symptom_appetite_changes",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierAppetiteChanges",
      "values": {
        "unspecified": 0,
        "no_change": 1,
        "decreased": 2,
        "increased": 3
      },
      "valueField": "change"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_bladder_incontinence": {
    "type": "symptom_bladder_incontinence",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierBladderIncontinence",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_bloating": {
    "type": "symptom_bloating",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierBloating",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_breast_pain": {
    "type": "symptom_breast_pain",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierBreastPain",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_chest_tightness_or_pain": {
    "type": "symptom_chest_tightness_or_pain",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierChestTightnessOrPain",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_chills": {
    "type": "symptom_chills",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierChills",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_constipation": {
    "type": "symptom_constipation",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierConstipation",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_coughing": {
    "type": "symptom_coughing",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierCoughing",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_diarrhea": {
    "type": "symptom_diarrhea",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierDiarrhea",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_dizziness": {
    "type": "symptom_dizziness",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierDizziness",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_dry_skin": {
    "type": "symptom_dry_skin",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierDrySkin",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_fainting": {
    "type": "symptom_fainting",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierFainting",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_fatigue": {
    "type": "symptom_fatigue",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierFatigue",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_fever": {
    "type": "symptom_fever",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierFever",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_generalized_body_ache": {
    "type": "symptom_generalized_body_ache",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierGeneralizedBodyAche",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_hair_loss": {
    "type": "symptom_hair_loss",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierHairLoss",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_headache": {
    "type": "symptom_headache",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierHeadache",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_heartburn": {
    "type": "symptom_heartburn",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierHeartburn",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_hot_flashes": {
    "type": "symptom_hot_flashes",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierHotFlashes",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_loss_of_smell": {
    "type": "symptom_loss_of_smell",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierLossOfSmell",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_loss_of_taste": {
    "type": "symptom_loss_of_taste",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierLossOfTaste",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_lower_back_pain": {
    "type": "symptom_lower_back_pain",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierLowerBackPain",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_memory_lapse": {
    "type": "symptom_memory_lapse",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierMemoryLapse",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_mood_changes": {
    "type": "symptom_mood_changes",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierMoodChanges",
      "values": {
        "present": 0,
        "not_present": 1
      },
      "valueField": "presence"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_nausea": {
    "type": "symptom_nausea",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierNausea",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_night_sweats": {
    "type": "symptom_night_sweats",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierNightSweats",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_pelvic_pain": {
    "type": "symptom_pelvic_pain",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierPelvicPain",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_rapid_pounding_or_fluttering_heartbeat": {
    "type": "symptom_rapid_pounding_or_fluttering_heartbeat",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_runny_nose": {
    "type": "symptom_runny_nose",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierRunnyNose",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_shortness_of_breath": {
    "type": "symptom_shortness_of_breath",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierShortnessOfBreath",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_sinus_congestion": {
    "type": "symptom_sinus_congestion",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierSinusCongestion",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_skipped_heartbeat": {
    "type": "symptom_skipped_heartbeat",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierSkippedHeartbeat",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_sleep_changes": {
    "type": "symptom_sleep_changes",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierSleepChanges",
      "values": {
        "present": 0,
        "not_present": 1
      },
      "valueField": "presence"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_sore_throat": {
    "type": "symptom_sore_throat",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierSoreThroat",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_vaginal_dryness": {
    "type": "symptom_vaginal_dryness",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierVaginalDryness",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_vomiting": {
    "type": "symptom_vomiting",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierVomiting",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "symptom_wheezing": {
    "type": "symptom_wheezing",
    "category": "symptom",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierWheezing",
      "values": {
        "unspecified": 0,
        "not_present": 1,
        "mild": 2,
        "moderate": 3,
        "severe": 4
      },
      "valueField": "severity"
    },
    "notes": [],
    "fieldUnits": {}
  },
  "time_in_daylight": {
    "type": "time_in_daylight",
    "category": "environment",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierTimeInDaylight",
      "unit": "min",
      "since": "iOS 17"
    },
    "notes": [],
    "fieldUnits": {
      "minutes": "min"
    }
  },
  "toothbrushing_event": {
    "type": "toothbrushing_event",
    "category": "wellness",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "count",
      "duration"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "category",
      "identifier": "HKCategoryTypeIdentifierToothbrushingEvent",
      "values": {}
    },
    "notes": [],
    "fieldUnits": {}
  },
  "total_energy": {
    "type": "total_energy",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "kind": "derived",
      "identifiers": [
        "HKQuantityTypeIdentifierActiveEnergyBurned",
        "HKQuantityTypeIdentifierBasalEnergyBurned"
      ],
      "unit": "kcal",
      "read": true,
      "write": false,
      "notes": [
        "Derived as active + basal over the same interval. Records report recordingMethod=unknown and metadata.derived=true."
      ]
    },
    "healthconnect": {
      "record": "TotalCaloriesBurnedRecord",
      "permission": "TOTAL_CALORIES_BURNED",
      "field": "energy",
      "unit": "kilocalories",
      "read": true,
      "write": true
    },
    "notes": [
      "HealthKit has no native total-energy type; writes are rejected on iOS with NOT_SUPPORTED."
    ],
    "fieldUnits": {
      "kilocalories": "kcal"
    }
  },
  "underwater_depth": {
    "type": "underwater_depth",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierUnderwaterDepth",
      "unit": "m",
      "since": "iOS 16"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "uv_exposure": {
    "type": "uv_exposure",
    "category": "environment",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierUVExposure",
      "unit": "count"
    },
    "notes": [],
    "fieldUnits": {
      "uvIndex": "UV index"
    }
  },
  "vo2_max": {
    "type": "vo2_max",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierVO2Max",
      "unit": "ml/(kg*min)",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "Vo2MaxRecord",
      "permission": "VO2_MAX",
      "field": "vo2MillilitersPerMinuteKilogram",
      "unit": "mL/kg/min",
      "read": true,
      "write": true
    },
    "notes": [
      "HealthKit stores the test method in HKMetadataKeyVO2MaxTestType; Health Connect in measurementMethod."
    ],
    "fieldUnits": {
      "mlPerKgPerMin": "mL/kg/min"
    }
  },
  "waist_circumference": {
    "type": "waist_circumference",
    "category": "body",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierWaistCircumference",
      "unit": "m"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "walking_asymmetry": {
    "type": "walking_asymmetry",
    "category": "mobility",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierWalkingAsymmetryPercentage",
      "unit": "%",
      "notes": [
        "HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check)."
      ]
    },
    "notes": [],
    "fieldUnits": {
      "percent": "%"
    }
  },
  "walking_double_support": {
    "type": "walking_double_support",
    "category": "mobility",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierWalkingDoubleSupportPercentage",
      "unit": "%"
    },
    "notes": [],
    "fieldUnits": {
      "percent": "%"
    }
  },
  "walking_heart_rate_average": {
    "type": "walking_heart_rate_average",
    "category": "vitals",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": false,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierWalkingHeartRateAverage",
      "unit": "count/min",
      "notes": [
        "HealthKit computes this type; apps can read it but never write it."
      ]
    },
    "notes": [],
    "fieldUnits": {
      "bpm": "beats/min"
    }
  },
  "walking_speed": {
    "type": "walking_speed",
    "category": "mobility",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierWalkingSpeed",
      "unit": "m/s"
    },
    "notes": [],
    "fieldUnits": {
      "metersPerSecond": "m/s"
    }
  },
  "walking_step_length": {
    "type": "walking_step_length",
    "category": "mobility",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierWalkingStepLength",
      "unit": "m"
    },
    "notes": [],
    "fieldUnits": {
      "meters": "m"
    }
  },
  "water_temperature": {
    "type": "water_temperature",
    "category": "environment",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierWaterTemperature",
      "unit": "degC",
      "since": "iOS 16"
    },
    "notes": [],
    "fieldUnits": {
      "celsius": "°C"
    }
  },
  "weight": {
    "type": "weight",
    "category": "body",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierBodyMass",
      "unit": "kg",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "WeightRecord",
      "permission": "WEIGHT",
      "field": "weight",
      "unit": "kilograms",
      "read": true,
      "write": true
    },
    "openmhealth": {
      "schema": "body-weight"
    },
    "notes": [],
    "fieldUnits": {
      "kilograms": "kg"
    }
  },
  "wheelchair_pushes": {
    "type": "wheelchair_pushes",
    "category": "activity",
    "kind": "interval",
    "since": "1.0",
    "aggregate": [
      "sum"
    ],
    "healthkit": {
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierPushCount",
      "unit": "count",
      "read": true,
      "write": true
    },
    "healthconnect": {
      "record": "WheelchairPushesRecord",
      "permission": "WHEELCHAIR_PUSHES",
      "field": "count",
      "unit": "count",
      "read": true,
      "write": true
    },
    "notes": [],
    "fieldUnits": {
      "count": "count"
    }
  },
  "workout_effort_score": {
    "type": "workout_effort_score",
    "category": "activity",
    "kind": "sample",
    "since": "1.0",
    "aggregate": [
      "avg",
      "min",
      "max"
    ],
    "healthkit": {
      "read": true,
      "write": true,
      "kind": "quantity",
      "identifier": "HKQuantityTypeIdentifierWorkoutEffortScore",
      "unit": "appleEffortScore",
      "since": "iOS 18"
    },
    "notes": [],
    "fieldUnits": {
      "score": "score"
    }
  }
};

export const DEVICE_TYPE_MAPPING: Record<DeviceType, { healthkit?: string; healthconnect?: string }> = {
  "unknown": {
    "healthconnect": "TYPE_UNKNOWN"
  },
  "watch": {
    "healthkit": "HKDevice.model contains \"Watch\"",
    "healthconnect": "TYPE_WATCH"
  },
  "phone": {
    "healthkit": "HKDevice.model contains \"iPhone\"",
    "healthconnect": "TYPE_PHONE"
  },
  "scale": {
    "healthconnect": "TYPE_SCALE"
  },
  "ring": {
    "healthconnect": "TYPE_RING"
  },
  "head_mounted": {
    "healthconnect": "TYPE_HEAD_MOUNTED"
  },
  "fitness_band": {
    "healthconnect": "TYPE_FITNESS_BAND"
  },
  "chest_strap": {
    "healthconnect": "TYPE_CHEST_STRAP"
  },
  "smart_display": {
    "healthconnect": "TYPE_SMART_DISPLAY"
  }
};

/** DRAFT — platform values not yet verified against SDK headers. */
export const EXERCISE_TYPE_MAPPING: Record<ExerciseType, { healthkit?: string; healthconnect?: string }> = {
  "american_football": {
    "healthkit": "americanFootball",
    "healthconnect": "EXERCISE_TYPE_FOOTBALL_AMERICAN"
  },
  "australian_football": {
    "healthkit": "australianFootball",
    "healthconnect": "EXERCISE_TYPE_FOOTBALL_AUSTRALIAN"
  },
  "badminton": {
    "healthkit": "badminton",
    "healthconnect": "EXERCISE_TYPE_BADMINTON"
  },
  "baseball": {
    "healthkit": "baseball",
    "healthconnect": "EXERCISE_TYPE_BASEBALL"
  },
  "basketball": {
    "healthkit": "basketball",
    "healthconnect": "EXERCISE_TYPE_BASKETBALL"
  },
  "boot_camp": {
    "healthkit": "crossTraining",
    "healthconnect": "EXERCISE_TYPE_BOOT_CAMP"
  },
  "boxing": {
    "healthkit": "boxing",
    "healthconnect": "EXERCISE_TYPE_BOXING"
  },
  "calisthenics": {
    "healthkit": "functionalStrengthTraining",
    "healthconnect": "EXERCISE_TYPE_CALISTHENICS"
  },
  "climbing": {
    "healthkit": "climbing",
    "healthconnect": "EXERCISE_TYPE_ROCK_CLIMBING"
  },
  "cricket": {
    "healthkit": "cricket",
    "healthconnect": "EXERCISE_TYPE_CRICKET"
  },
  "cycling": {
    "healthkit": "cycling",
    "healthconnect": "EXERCISE_TYPE_BIKING"
  },
  "cycling_stationary": {
    "healthkit": "cycling (HKMetadataKeyIndoorWorkout=true)",
    "healthconnect": "EXERCISE_TYPE_BIKING_STATIONARY"
  },
  "dance": {
    "healthkit": "dance",
    "healthconnect": "EXERCISE_TYPE_DANCING"
  },
  "disc_sports": {
    "healthkit": "discSports",
    "healthconnect": "EXERCISE_TYPE_FRISBEE_DISC"
  },
  "elliptical": {
    "healthkit": "elliptical",
    "healthconnect": "EXERCISE_TYPE_ELLIPTICAL"
  },
  "exercise_class": {
    "healthkit": "mixedCardio",
    "healthconnect": "EXERCISE_TYPE_EXERCISE_CLASS"
  },
  "fencing": {
    "healthkit": "fencing",
    "healthconnect": "EXERCISE_TYPE_FENCING"
  },
  "golf": {
    "healthkit": "golf",
    "healthconnect": "EXERCISE_TYPE_GOLF"
  },
  "guided_breathing": {
    "healthkit": "mindAndBody",
    "healthconnect": "EXERCISE_TYPE_GUIDED_BREATHING"
  },
  "gymnastics": {
    "healthkit": "gymnastics",
    "healthconnect": "EXERCISE_TYPE_GYMNASTICS"
  },
  "handball": {
    "healthkit": "handball",
    "healthconnect": "EXERCISE_TYPE_HANDBALL"
  },
  "hiit": {
    "healthkit": "highIntensityIntervalTraining",
    "healthconnect": "EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING"
  },
  "hiking": {
    "healthkit": "hiking",
    "healthconnect": "EXERCISE_TYPE_HIKING"
  },
  "ice_hockey": {
    "healthkit": "hockey",
    "healthconnect": "EXERCISE_TYPE_ICE_HOCKEY"
  },
  "ice_skating": {
    "healthkit": "skatingSports",
    "healthconnect": "EXERCISE_TYPE_ICE_SKATING"
  },
  "martial_arts": {
    "healthkit": "martialArts",
    "healthconnect": "EXERCISE_TYPE_MARTIAL_ARTS"
  },
  "paddling": {
    "healthkit": "paddleSports",
    "healthconnect": "EXERCISE_TYPE_PADDLING"
  },
  "paragliding": {
    "healthconnect": "EXERCISE_TYPE_PARAGLIDING"
  },
  "pilates": {
    "healthkit": "pilates",
    "healthconnect": "EXERCISE_TYPE_PILATES"
  },
  "racquetball": {
    "healthkit": "racquetball",
    "healthconnect": "EXERCISE_TYPE_RACQUETBALL"
  },
  "roller_hockey": {
    "healthkit": "hockey",
    "healthconnect": "EXERCISE_TYPE_ROLLER_HOCKEY"
  },
  "rowing": {
    "healthkit": "rowing",
    "healthconnect": "EXERCISE_TYPE_ROWING"
  },
  "rowing_machine": {
    "healthkit": "rowing (HKMetadataKeyIndoorWorkout=true)",
    "healthconnect": "EXERCISE_TYPE_ROWING_MACHINE"
  },
  "rugby": {
    "healthkit": "rugby",
    "healthconnect": "EXERCISE_TYPE_RUGBY"
  },
  "running": {
    "healthkit": "running",
    "healthconnect": "EXERCISE_TYPE_RUNNING"
  },
  "running_treadmill": {
    "healthkit": "running (HKMetadataKeyIndoorWorkout=true)",
    "healthconnect": "EXERCISE_TYPE_RUNNING_TREADMILL"
  },
  "sailing": {
    "healthkit": "sailing",
    "healthconnect": "EXERCISE_TYPE_SAILING"
  },
  "scuba_diving": {
    "healthkit": "underwaterDiving",
    "healthconnect": "EXERCISE_TYPE_SCUBA_DIVING"
  },
  "skating": {
    "healthkit": "skatingSports",
    "healthconnect": "EXERCISE_TYPE_SKATING"
  },
  "skiing": {
    "healthkit": "downhillSkiing",
    "healthconnect": "EXERCISE_TYPE_SKIING"
  },
  "snowboarding": {
    "healthkit": "snowboarding",
    "healthconnect": "EXERCISE_TYPE_SNOWBOARDING"
  },
  "snowshoeing": {
    "healthkit": "snowSports",
    "healthconnect": "EXERCISE_TYPE_SNOWSHOEING"
  },
  "soccer": {
    "healthkit": "soccer",
    "healthconnect": "EXERCISE_TYPE_SOCCER"
  },
  "softball": {
    "healthkit": "softball",
    "healthconnect": "EXERCISE_TYPE_SOFTBALL"
  },
  "squash": {
    "healthkit": "squash",
    "healthconnect": "EXERCISE_TYPE_SQUASH"
  },
  "stair_climbing": {
    "healthkit": "stairs",
    "healthconnect": "EXERCISE_TYPE_STAIR_CLIMBING"
  },
  "stair_climbing_machine": {
    "healthkit": "stairClimbing",
    "healthconnect": "EXERCISE_TYPE_STAIR_CLIMBING_MACHINE"
  },
  "strength_training": {
    "healthkit": "traditionalStrengthTraining",
    "healthconnect": "EXERCISE_TYPE_STRENGTH_TRAINING"
  },
  "stretching": {
    "healthkit": "flexibility",
    "healthconnect": "EXERCISE_TYPE_STRETCHING"
  },
  "surfing": {
    "healthkit": "surfingSports",
    "healthconnect": "EXERCISE_TYPE_SURFING"
  },
  "swimming_open_water": {
    "healthkit": "swimming (HKMetadataKeySwimmingLocationType=openWater)",
    "healthconnect": "EXERCISE_TYPE_SWIMMING_OPEN_WATER"
  },
  "swimming_pool": {
    "healthkit": "swimming (HKMetadataKeySwimmingLocationType=pool)",
    "healthconnect": "EXERCISE_TYPE_SWIMMING_POOL"
  },
  "table_tennis": {
    "healthkit": "tableTennis",
    "healthconnect": "EXERCISE_TYPE_TABLE_TENNIS"
  },
  "tennis": {
    "healthkit": "tennis",
    "healthconnect": "EXERCISE_TYPE_TENNIS"
  },
  "volleyball": {
    "healthkit": "volleyball",
    "healthconnect": "EXERCISE_TYPE_VOLLEYBALL"
  },
  "walking": {
    "healthkit": "walking",
    "healthconnect": "EXERCISE_TYPE_WALKING"
  },
  "water_polo": {
    "healthkit": "waterPolo",
    "healthconnect": "EXERCISE_TYPE_WATER_POLO"
  },
  "weightlifting": {
    "healthkit": "traditionalStrengthTraining",
    "healthconnect": "EXERCISE_TYPE_WEIGHTLIFTING"
  },
  "wheelchair": {
    "healthkit": "wheelchairWalkPace",
    "healthconnect": "EXERCISE_TYPE_WHEELCHAIR"
  },
  "yoga": {
    "healthkit": "yoga",
    "healthconnect": "EXERCISE_TYPE_YOGA"
  },
  "archery": {
    "healthkit": "archery"
  },
  "bowling": {
    "healthkit": "bowling"
  },
  "core_training": {
    "healthkit": "coreTraining"
  },
  "cross_country_skiing": {
    "healthkit": "crossCountrySkiing"
  },
  "curling": {
    "healthkit": "curling"
  },
  "equestrian": {
    "healthkit": "equestrianSports"
  },
  "fishing": {
    "healthkit": "fishing"
  },
  "hunting": {
    "healthkit": "hunting"
  },
  "jump_rope": {
    "healthkit": "jumpRope"
  },
  "kickboxing": {
    "healthkit": "kickboxing"
  },
  "lacrosse": {
    "healthkit": "lacrosse"
  },
  "pickleball": {
    "healthkit": "pickleball"
  },
  "tai_chi": {
    "healthkit": "taiChi"
  },
  "track_and_field": {
    "healthkit": "trackAndField"
  },
  "wrestling": {
    "healthkit": "wrestling"
  },
  "other": {
    "healthkit": "other",
    "healthconnect": "EXERCISE_TYPE_OTHER_WORKOUT"
  }
};

export const MEAL_TYPE_MAPPING: Record<MealType, { healthkit?: string; healthconnect?: string }> = {
  "unknown": {
    "healthconnect": "MEAL_TYPE_UNKNOWN"
  },
  "breakfast": {
    "healthconnect": "MEAL_TYPE_BREAKFAST"
  },
  "lunch": {
    "healthconnect": "MEAL_TYPE_LUNCH"
  },
  "dinner": {
    "healthconnect": "MEAL_TYPE_DINNER"
  },
  "snack": {
    "healthconnect": "MEAL_TYPE_SNACK"
  }
};

export const RECORDING_METHOD_MAPPING: Record<RecordingMethod, { healthkit?: string; healthconnect?: string }> = {
  "manual": {
    "healthkit": "HKMetadataKeyWasUserEntered=true",
    "healthconnect": "RECORDING_METHOD_MANUAL_ENTRY"
  },
  "automatic": {
    "healthkit": "HKMetadataKeyWasUserEntered≠true",
    "healthconnect": "RECORDING_METHOD_AUTOMATICALLY_RECORDED"
  },
  "active": {
    "healthconnect": "RECORDING_METHOD_ACTIVELY_RECORDED"
  },
  "unknown": {
    "healthconnect": "RECORDING_METHOD_UNKNOWN"
  }
};

export const SLEEP_STAGE_MAPPING: Record<SleepStage, { healthkit?: string; healthconnect?: string }> = {
  "awake": {
    "healthkit": "HKCategoryValueSleepAnalysis.awake",
    "healthconnect": "STAGE_TYPE_AWAKE"
  },
  "awake_in_bed": {
    "healthconnect": "STAGE_TYPE_AWAKE_IN_BED"
  },
  "in_bed": {
    "healthkit": "HKCategoryValueSleepAnalysis.inBed"
  },
  "out_of_bed": {
    "healthconnect": "STAGE_TYPE_OUT_OF_BED"
  },
  "sleeping": {
    "healthkit": "HKCategoryValueSleepAnalysis.asleepUnspecified",
    "healthconnect": "STAGE_TYPE_SLEEPING"
  },
  "light": {
    "healthkit": "HKCategoryValueSleepAnalysis.asleepCore",
    "healthconnect": "STAGE_TYPE_LIGHT"
  },
  "deep": {
    "healthkit": "HKCategoryValueSleepAnalysis.asleepDeep",
    "healthconnect": "STAGE_TYPE_DEEP"
  },
  "rem": {
    "healthkit": "HKCategoryValueSleepAnalysis.asleepREM",
    "healthconnect": "STAGE_TYPE_REM"
  },
  "unknown": {
    "healthconnect": "STAGE_TYPE_UNKNOWN"
  }
};

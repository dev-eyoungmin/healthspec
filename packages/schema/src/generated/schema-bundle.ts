// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.

export type JsonSchema = Record<string, unknown>;
export interface SchemaEntry { file: string; schema: JsonSchema }

/** Every spec schema, verbatim, for runtime validation (e.g. with Ajv 2020-12) and conformance tooling. */
export const SCHEMA_BUNDLE: { common: SchemaEntry[]; enums: SchemaEntry[]; types: SchemaEntry[] } = {
  "common": [
    {
      "file": "spec/schema/common/profile.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/common/profile.json",
        "title": "HealthProfile",
        "description": "User characteristics that are not time-stamped records. HealthKit exposes them as characteristic types; Health Connect has no equivalent, so Android providers return an empty profile and declare capabilities.profile = false.",
        "type": "object",
        "properties": {
          "biologicalSex": {
            "type": "string",
            "enum": [
              "female",
              "male",
              "other"
            ]
          },
          "dateOfBirth": {
            "type": "string",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
            "description": "Calendar date, YYYY-MM-DD."
          },
          "bloodType": {
            "type": "string",
            "enum": [
              "a_positive",
              "a_negative",
              "b_positive",
              "b_negative",
              "ab_positive",
              "ab_negative",
              "o_positive",
              "o_negative"
            ]
          },
          "fitzpatrickSkinType": {
            "type": "string",
            "enum": [
              "type_1",
              "type_2",
              "type_3",
              "type_4",
              "type_5",
              "type_6"
            ]
          },
          "wheelchairUse": {
            "type": "boolean"
          },
          "activityMoveMode": {
            "type": "string",
            "enum": [
              "active_energy",
              "move_time"
            ]
          }
        },
        "additionalProperties": false
      }
    },
    {
      "file": "spec/schema/common/record.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/common/record.json",
        "title": "HealthRecordEnvelope",
        "description": "Common envelope shared by every health record. The `value` object is defined per type under schema/types.",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Provider-scoped stable identifier (HealthKit UUID, Health Connect record id, …)."
          },
          "type": {
            "type": "string",
            "description": "Health type id, e.g. \"steps\". Refined to a constant per type."
          },
          "start": {
            "type": "string",
            "format": "date-time",
            "description": "Start instant, RFC 3339 / ISO 8601 with offset or Z."
          },
          "end": {
            "type": "string",
            "format": "date-time",
            "description": "End instant. Equal to `start` for point samples."
          },
          "zoneOffset": {
            "type": "string",
            "pattern": "^[+-]\\d{2}:\\d{2}$",
            "description": "UTC offset in effect when the record was made (e.g. \"+09:00\"). Preserved from Health Connect; derived from HKMetadataKeyTimeZone on HealthKit when present."
          },
          "value": {
            "type": "object",
            "description": "Type-specific payload in canonical units."
          },
          "source": {
            "$ref": "source.json"
          },
          "metadata": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            },
            "description": "Provider-specific string metadata passed through untouched."
          }
        },
        "required": [
          "id",
          "type",
          "start",
          "end",
          "value",
          "source"
        ],
        "additionalProperties": false
      }
    },
    {
      "file": "spec/schema/common/source.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/common/source.json",
        "title": "HealthSource",
        "description": "Where a record came from: the writing app, the device that measured it, and how it was recorded.",
        "type": "object",
        "properties": {
          "app": {
            "type": "object",
            "description": "The application that wrote the record.",
            "properties": {
              "id": {
                "type": "string",
                "description": "Bundle identifier (iOS) or package name (Android)."
              },
              "name": {
                "type": "string",
                "description": "Human-readable app name when the platform exposes it."
              }
            },
            "required": [
              "id"
            ],
            "additionalProperties": false
          },
          "device": {
            "type": "object",
            "description": "The device that produced the measurement, when known.",
            "properties": {
              "manufacturer": {
                "type": "string"
              },
              "model": {
                "type": "string"
              },
              "type": {
                "$ref": "../enums/device_type.json"
              }
            },
            "additionalProperties": false
          },
          "recordingMethod": {
            "$ref": "../enums/recording_method.json"
          }
        },
        "required": [
          "recordingMethod"
        ],
        "additionalProperties": false
      }
    }
  ],
  "enums": [
    {
      "file": "spec/schema/enums/device_type.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/enums/device_type.json",
        "title": "DeviceType",
        "description": "Kind of device that produced a measurement. Canonical list follows Health Connect's Device types; HealthKit providers infer it from HKDevice model/name.",
        "type": "string",
        "enum": [
          "unknown",
          "watch",
          "phone",
          "scale",
          "ring",
          "head_mounted",
          "fitness_band",
          "chest_strap",
          "smart_display"
        ],
        "x-healthspec": {
          "mapping": {
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
          }
        }
      }
    },
    {
      "file": "spec/schema/enums/exercise_type.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/enums/exercise_type.json",
        "title": "ExerciseType",
        "description": "Canonical exercise / workout activity type. DRAFT: platform mappings are to be verified against HKWorkoutActivityType and ExerciseSessionRecord.EXERCISE_TYPE_* headers in Phase 1. Where one platform has no equivalent the provider MUST fall back to `other` and preserve the native value in metadata.",
        "type": "string",
        "enum": [
          "american_football",
          "australian_football",
          "badminton",
          "baseball",
          "basketball",
          "boot_camp",
          "boxing",
          "calisthenics",
          "climbing",
          "cricket",
          "cycling",
          "cycling_stationary",
          "dance",
          "disc_sports",
          "elliptical",
          "exercise_class",
          "fencing",
          "golf",
          "guided_breathing",
          "gymnastics",
          "handball",
          "hiit",
          "hiking",
          "ice_hockey",
          "ice_skating",
          "martial_arts",
          "paddling",
          "paragliding",
          "pilates",
          "racquetball",
          "roller_hockey",
          "rowing",
          "rowing_machine",
          "rugby",
          "running",
          "running_treadmill",
          "sailing",
          "scuba_diving",
          "skating",
          "skiing",
          "snowboarding",
          "snowshoeing",
          "soccer",
          "softball",
          "squash",
          "stair_climbing",
          "stair_climbing_machine",
          "strength_training",
          "stretching",
          "surfing",
          "swimming_open_water",
          "swimming_pool",
          "table_tennis",
          "tennis",
          "volleyball",
          "walking",
          "water_polo",
          "weightlifting",
          "wheelchair",
          "yoga",
          "archery",
          "bowling",
          "core_training",
          "cross_country_skiing",
          "curling",
          "equestrian",
          "fishing",
          "hunting",
          "jump_rope",
          "kickboxing",
          "lacrosse",
          "pickleball",
          "tai_chi",
          "track_and_field",
          "wrestling",
          "other"
        ],
        "x-healthspec": {
          "verified": false,
          "mapping": {
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
          }
        }
      }
    },
    {
      "file": "spec/schema/enums/meal_type.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/enums/meal_type.json",
        "title": "MealType",
        "description": "Meal a nutrition or glucose record relates to.",
        "type": "string",
        "enum": [
          "unknown",
          "breakfast",
          "lunch",
          "dinner",
          "snack"
        ],
        "x-healthspec": {
          "mapping": {
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
          }
        }
      }
    },
    {
      "file": "spec/schema/enums/recording_method.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/enums/recording_method.json",
        "title": "RecordingMethod",
        "description": "How a record was captured. Mirrors Health Connect's recording methods; HealthKit only distinguishes user-entered data.",
        "type": "string",
        "enum": [
          "manual",
          "automatic",
          "active",
          "unknown"
        ],
        "x-healthspec": {
          "mapping": {
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
          }
        }
      }
    },
    {
      "file": "spec/schema/enums/sleep_stage.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/enums/sleep_stage.json",
        "title": "SleepStage",
        "description": "Sleep stage within a sleep session. `in_bed` is HealthKit's legacy \"in bed, sleep state unknown\" and is kept distinct from `awake_in_bed`.",
        "type": "string",
        "enum": [
          "awake",
          "awake_in_bed",
          "in_bed",
          "out_of_bed",
          "sleeping",
          "light",
          "deep",
          "rem",
          "unknown"
        ],
        "x-healthspec": {
          "mapping": {
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
          }
        }
      }
    }
  ],
  "types": [
    {
      "file": "spec/schema/types/active_energy.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/active_energy.json",
        "title": "active_energy",
        "description": "Energy burned through activity during the interval (excludes basal metabolism).",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierActiveEnergyBurned",
              "unit": "kcal",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "ActiveCaloriesBurnedRecord",
              "permission": "ACTIVE_CALORIES_BURNED",
              "field": "energy",
              "unit": "kilocalories",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "calories-burned"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "kilocalories": {
            "type": "number",
            "minimum": 0,
            "x-unit": "kcal"
          }
        },
        "required": [
          "kilocalories"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "kilocalories": 312.4
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/activity_summary.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/activity_summary.json",
        "title": "activity_summary",
        "description": "One day of Apple activity-ring progress and goals.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "activitySummary",
              "identifier": "HKActivitySummaryTypeIdentifier"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "date": {
            "type": "string",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
          },
          "activeEnergyKilocalories": {
            "type": "number",
            "x-unit": "kcal",
            "minimum": 0
          },
          "activeEnergyGoalKilocalories": {
            "type": "number",
            "x-unit": "kcal",
            "minimum": 0
          },
          "exerciseMinutes": {
            "type": "number",
            "x-unit": "min",
            "minimum": 0
          },
          "exerciseGoalMinutes": {
            "type": "number",
            "x-unit": "min",
            "minimum": 0
          },
          "standHours": {
            "type": "number",
            "x-unit": "count",
            "minimum": 0
          },
          "standGoalHours": {
            "type": "number",
            "x-unit": "count",
            "minimum": 0
          },
          "moveMinutes": {
            "type": "number",
            "x-unit": "min",
            "minimum": 0
          },
          "moveGoalMinutes": {
            "type": "number",
            "x-unit": "min",
            "minimum": 0
          },
          "activityMoveMode": {
            "type": "string",
            "enum": [
              "active_energy",
              "move_time"
            ]
          }
        },
        "required": [
          "date"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "date": "2026-08-21",
            "activeEnergyKilocalories": 480,
            "activeEnergyGoalKilocalories": 500,
            "exerciseMinutes": 32,
            "exerciseGoalMinutes": 30,
            "standHours": 11,
            "standGoalHours": 12
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/apple_exercise_time.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/apple_exercise_time.json",
        "title": "apple_exercise_time",
        "description": "Minutes of brisk activity credited to the Exercise ring.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierAppleExerciseTime",
              "unit": "min",
              "notes": [
                "HealthKit computes this type; apps can read it but never write it."
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "minutes": {
            "type": "number",
            "x-unit": "min",
            "minimum": 0
          }
        },
        "required": [
          "minutes"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "minutes": 5
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/apple_move_time.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/apple_move_time.json",
        "title": "apple_move_time",
        "description": "Minutes of movement (Move ring in time mode).",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierAppleMoveTime",
              "unit": "min",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "minutes": {
            "type": "number",
            "x-unit": "min",
            "minimum": 0
          }
        },
        "required": [
          "minutes"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "minutes": 4
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/apple_sleeping_breathing_disturbances.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/apple_sleeping_breathing_disturbances.json",
        "title": "apple_sleeping_breathing_disturbances",
        "description": "Breathing disturbances during sleep.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances",
              "unit": "count",
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "count": {
            "type": "number",
            "x-unit": "count",
            "minimum": 0
          }
        },
        "required": [
          "count"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "count": 12
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/apple_sleeping_wrist_temperature.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/apple_sleeping_wrist_temperature.json",
        "title": "apple_sleeping_wrist_temperature",
        "description": "Wrist temperature measured during sleep (absolute; see skin_temperature for Health Connect deltas).",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierAppleSleepingWristTemperature",
              "unit": "degC",
              "since": "iOS 16",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false,
          "counterparts": [
            {
              "type": "skin_temperature",
              "platform": "healthconnect",
              "interchangeable": false,
              "reason": "HealthKit stores an absolute temperature; Health Connect stores a delta from the user baseline."
            }
          ]
        },
        "type": "object",
        "properties": {
          "celsius": {
            "type": "number",
            "x-unit": "°C",
            "minimum": 0
          }
        },
        "required": [
          "celsius"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "celsius": 34.1
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/apple_stand_hour.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/apple_stand_hour.json",
        "title": "apple_stand_hour",
        "description": "Whether the user stood during an hour (Stand ring).",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierAppleStandHour",
              "values": {
                "stood": 0,
                "idle": 1
              },
              "valueField": "status",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "enum": [
              "stood",
              "idle"
            ]
          }
        },
        "required": [
          "status"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "status": "stood"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/apple_stand_time.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/apple_stand_time.json",
        "title": "apple_stand_time",
        "description": "Minutes standing credited to the Stand ring.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierAppleStandTime",
              "unit": "min",
              "notes": [
                "HealthKit computes this type; apps can read it but never write it."
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "minutes": {
            "type": "number",
            "x-unit": "min",
            "minimum": 0
          }
        },
        "required": [
          "minutes"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "minutes": 3
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/apple_walking_steadiness.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/apple_walking_steadiness.json",
        "title": "apple_walking_steadiness",
        "description": "Walking steadiness score.",
        "x-healthspec": {
          "category": "mobility",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierAppleWalkingSteadiness",
              "unit": "%",
              "notes": [
                "HealthKit computes this type; apps can read it but never write it."
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "percent": {
            "type": "number",
            "x-unit": "%",
            "minimum": 0,
            "maximum": 100
          }
        },
        "required": [
          "percent"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "percent": 85
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/apple_walking_steadiness_event.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/apple_walking_steadiness_event.json",
        "title": "apple_walking_steadiness_event",
        "description": "Walking steadiness notification event.",
        "x-healthspec": {
          "category": "mobility",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierAppleWalkingSteadinessEvent",
              "values": {
                "initial_low": 1,
                "initial_very_low": 2,
                "repeat_low": 3,
                "repeat_very_low": 4
              },
              "valueField": "level",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "level": {
            "type": "string",
            "enum": [
              "initial_low",
              "initial_very_low",
              "repeat_low",
              "repeat_very_low"
            ]
          }
        },
        "required": [
          "level"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "level": "initial_low"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/atrial_fibrillation_burden.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/atrial_fibrillation_burden.json",
        "title": "atrial_fibrillation_burden",
        "description": "Share of time in atrial fibrillation.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierAtrialFibrillationBurden",
              "unit": "%",
              "since": "iOS 16",
              "notes": [
                "HealthKit computes this type; apps can read it but never write it."
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "percent": {
            "type": "number",
            "x-unit": "%",
            "minimum": 0,
            "maximum": 100
          }
        },
        "required": [
          "percent"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "percent": 2
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/basal_body_temperature.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/basal_body_temperature.json",
        "title": "basal_body_temperature",
        "description": "Basal body temperature (measured at rest, typically on waking).",
        "x-healthspec": {
          "category": "cycle",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierBasalBodyTemperature",
              "unit": "degC",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "BasalBodyTemperatureRecord",
              "permission": "BASAL_BODY_TEMPERATURE",
              "field": "temperature",
              "unit": "celsius",
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "body-temperature"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "celsius": {
            "type": "number",
            "x-unit": "°C",
            "minimum": 20,
            "maximum": 50
          },
          "measurementLocation": {
            "type": "string",
            "enum": [
              "armpit",
              "finger",
              "forehead",
              "mouth",
              "rectum",
              "temporal_artery",
              "toe",
              "ear",
              "wrist",
              "vagina",
              "unknown"
            ]
          }
        },
        "required": [
          "celsius"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "celsius": 36.4
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/basal_energy.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/basal_energy.json",
        "title": "basal_energy",
        "description": "Resting (basal) energy burned during the interval (HealthKit). Health Connect exposes the rate instead — see basal_metabolic_rate.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierBasalEnergyBurned",
              "unit": "kcal",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "counterparts": [
            {
              "type": "basal_metabolic_rate",
              "platform": "healthconnect",
              "interchangeable": false,
              "reason": "basal_energy is energy accumulated over an interval (kcal); basal_metabolic_rate is a rate (kcal/day). Converting needs the interval length and assumes a constant rate."
            }
          ]
        },
        "type": "object",
        "properties": {
          "kilocalories": {
            "type": "number",
            "x-unit": "kcal",
            "minimum": 0
          }
        },
        "required": [
          "kilocalories"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "kilocalories": 68.2
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/basal_metabolic_rate.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/basal_metabolic_rate.json",
        "title": "basal_metabolic_rate",
        "description": "Basal metabolic rate as an energy *rate* (Health Connect). For HealthKit’s basal energy over an interval see basal_energy.",
        "x-healthspec": {
          "category": "body",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "BasalMetabolicRateRecord",
              "permission": "BASAL_METABOLIC_RATE",
              "field": "basalMetabolicRate",
              "unit": "kilocaloriesPerDay",
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [],
          "counterparts": [
            {
              "type": "basal_energy",
              "platform": "healthkit",
              "interchangeable": false,
              "reason": "A rate (kcal/day) cannot be compared with interval energy (kcal) without assuming the rate held for the whole interval."
            }
          ]
        },
        "type": "object",
        "properties": {
          "kilocaloriesPerDay": {
            "type": "number",
            "x-unit": "kcal/day",
            "minimum": 0
          }
        },
        "required": [
          "kilocaloriesPerDay"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "kilocaloriesPerDay": 1650
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/bleeding_after_pregnancy.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/bleeding_after_pregnancy.json",
        "title": "bleeding_after_pregnancy",
        "description": "Bleeding after pregnancy.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "flow",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "flow": {
            "type": "string",
            "enum": [
              "unspecified",
              "light",
              "medium",
              "heavy",
              "none"
            ]
          }
        },
        "additionalProperties": false,
        "examples": [
          {
            "flow": "light"
          }
        ],
        "required": [
          "flow"
        ]
      }
    },
    {
      "file": "spec/schema/types/bleeding_during_pregnancy.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/bleeding_during_pregnancy.json",
        "title": "bleeding_during_pregnancy",
        "description": "Bleeding during pregnancy.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "flow",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "flow": {
            "type": "string",
            "enum": [
              "unspecified",
              "light",
              "medium",
              "heavy",
              "none"
            ]
          }
        },
        "additionalProperties": false,
        "examples": [
          {
            "flow": "light"
          }
        ],
        "required": [
          "flow"
        ]
      }
    },
    {
      "file": "spec/schema/types/blood_alcohol_content.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/blood_alcohol_content.json",
        "title": "blood_alcohol_content",
        "description": "Blood alcohol content.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierBloodAlcoholContent",
              "unit": "%",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "percent": {
            "type": "number",
            "x-unit": "%",
            "minimum": 0,
            "maximum": 100
          }
        },
        "required": [
          "percent"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "percent": 0.04
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/blood_glucose.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/blood_glucose.json",
        "title": "blood_glucose",
        "description": "Blood glucose concentration. Canonical unit is mmol/L; use units.glucose to convert to mg/dL (× 18.0182).",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierBloodGlucose",
              "unit": "mmol<180.1558800000541>/L",
              "read": true,
              "write": true,
              "notes": [
                "Read with HKUnit.moleUnit(with: .milli, molarMass: HKUnitMolarMassBloodGlucose).unitDivided(by: .liter()). Meal relation from HKMetadataKeyBloodGlucoseMealTime."
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "BloodGlucoseRecord",
              "permission": "BLOOD_GLUCOSE",
              "field": "level",
              "unit": "millimolesPerLiter",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "blood-glucose"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "millimolesPerLiter": {
            "type": "number",
            "minimum": 0,
            "maximum": 60,
            "x-unit": "mmol/L"
          },
          "specimenSource": {
            "type": "string",
            "enum": [
              "interstitial_fluid",
              "capillary_blood",
              "plasma",
              "serum",
              "tears",
              "whole_blood",
              "unknown"
            ],
            "x-platform": "healthconnect"
          },
          "mealType": {
            "$ref": "../enums/meal_type.json"
          },
          "relationToMeal": {
            "type": "string",
            "enum": [
              "general",
              "fasting",
              "before_meal",
              "after_meal",
              "unknown"
            ],
            "x-platform": "healthconnect"
          }
        },
        "required": [
          "millimolesPerLiter"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "millimolesPerLiter": 5.4,
            "specimenSource": "capillary_blood",
            "relationToMeal": "fasting"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/blood_pressure.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/blood_pressure.json",
        "title": "blood_pressure",
        "description": "Systolic and diastolic blood pressure measured together.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
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
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated",
                  "react-native-health"
                ]
              }
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
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "blood-pressure"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "systolicMmHg": {
            "type": "number",
            "minimum": 20,
            "maximum": 300,
            "x-unit": "mmHg"
          },
          "diastolicMmHg": {
            "type": "number",
            "minimum": 10,
            "maximum": 200,
            "x-unit": "mmHg"
          },
          "bodyPosition": {
            "type": "string",
            "enum": [
              "standing_up",
              "sitting_down",
              "lying_down",
              "reclining",
              "unknown"
            ],
            "x-platform": "healthconnect"
          },
          "measurementLocation": {
            "type": "string",
            "enum": [
              "left_wrist",
              "right_wrist",
              "left_upper_arm",
              "right_upper_arm",
              "unknown"
            ],
            "x-platform": "healthconnect"
          }
        },
        "required": [
          "systolicMmHg",
          "diastolicMmHg"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "systolicMmHg": 118,
            "diastolicMmHg": 76,
            "bodyPosition": "sitting_down",
            "measurementLocation": "left_upper_arm"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/body_fat.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/body_fat.json",
        "title": "body_fat",
        "description": "Body fat as a percentage of body mass.",
        "x-healthspec": {
          "category": "body",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierBodyFatPercentage",
              "unit": "%",
              "read": true,
              "write": true,
              "notes": [
                "HKUnit.percent() is a fraction (0.21 = 21%); multiply by 100."
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "BodyFatRecord",
              "permission": "BODY_FAT",
              "field": "percentage",
              "unit": "percent",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "body-fat-percentage"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "percent": {
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "x-unit": "%"
          }
        },
        "required": [
          "percent"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "percent": 21.3
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/body_mass_index.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/body_mass_index.json",
        "title": "body_mass_index",
        "description": "Body mass index.",
        "x-healthspec": {
          "category": "body",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierBodyMassIndex",
              "unit": "count",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "value": {
            "type": "number",
            "x-unit": "kg/m²",
            "minimum": 0,
            "maximum": 100
          }
        },
        "required": [
          "value"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "value": 23.4
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/body_temperature.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/body_temperature.json",
        "title": "body_temperature",
        "description": "Core or surface body temperature measurement.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierBodyTemperature",
              "unit": "degC",
              "read": true,
              "write": true,
              "notes": [
                "Measurement location from HKMetadataKeyBodyTemperatureSensorLocation."
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "BodyTemperatureRecord",
              "permission": "BODY_TEMPERATURE",
              "field": "temperature",
              "unit": "celsius",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "body-temperature"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "celsius": {
            "type": "number",
            "minimum": 20,
            "maximum": 50,
            "x-unit": "°C"
          },
          "measurementLocation": {
            "type": "string",
            "enum": [
              "armpit",
              "finger",
              "forehead",
              "mouth",
              "rectum",
              "temporal_artery",
              "toe",
              "ear",
              "wrist",
              "vagina",
              "unknown"
            ],
            "x-platform": "healthconnect"
          }
        },
        "required": [
          "celsius"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "celsius": 36.7,
            "measurementLocation": "mouth"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/body_water_mass.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/body_water_mass.json",
        "title": "body_water_mass",
        "description": "Total body water mass.",
        "x-healthspec": {
          "category": "body",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "BodyWaterMassRecord",
              "permission": "BODY_WATER_MASS",
              "field": "mass",
              "unit": "kilograms",
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "kilograms": {
            "type": "number",
            "x-unit": "kg",
            "exclusiveMinimum": 0,
            "maximum": 500
          }
        },
        "required": [
          "kilograms"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "kilograms": 41.2
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/bone_mass.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/bone_mass.json",
        "title": "bone_mass",
        "description": "Bone mass.",
        "x-healthspec": {
          "category": "body",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "BoneMassRecord",
              "permission": "BONE_MASS",
              "field": "mass",
              "unit": "kilograms",
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "kilograms": {
            "type": "number",
            "x-unit": "kg",
            "exclusiveMinimum": 0,
            "maximum": 100
          }
        },
        "required": [
          "kilograms"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "kilograms": 3.1
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/cervical_mucus.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/cervical_mucus.json",
        "title": "cervical_mucus",
        "description": "Cervical mucus observation.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
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
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "CervicalMucusRecord",
              "permission": "CERVICAL_MUCUS",
              "fields": {
                "appearance": "appearance",
                "sensation": "sensation"
              },
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "appearance": {
            "type": "string",
            "enum": [
              "dry",
              "sticky",
              "creamy",
              "watery",
              "egg_white",
              "unusual",
              "unknown"
            ]
          },
          "sensation": {
            "type": "string",
            "enum": [
              "light",
              "medium",
              "heavy",
              "unknown"
            ],
            "x-platform": "healthconnect"
          }
        },
        "additionalProperties": false,
        "examples": [
          {
            "appearance": "egg_white",
            "sensation": "medium"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_allergy.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_allergy.json",
        "title": "clinical_allergy",
        "description": "Allergies and intolerances. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "clinical",
              "identifier": "HKClinicalTypeIdentifierAllergyRecord",
              "verifiedBy": {
                "identifiers": [
                  "react-native-health"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_ALLERGIES_INTOLERANCES",
              "medicalResourceType": "ALLERGIES_INTOLERANCES"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_condition.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_condition.json",
        "title": "clinical_condition",
        "description": "Conditions / diagnoses. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "clinical",
              "identifier": "HKClinicalTypeIdentifierConditionRecord",
              "verifiedBy": {
                "identifiers": [
                  "react-native-health"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_CONDITIONS",
              "medicalResourceType": "CONDITIONS"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_coverage.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_coverage.json",
        "title": "clinical_coverage",
        "description": "Insurance coverage (HealthKit only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "clinical",
              "identifier": "HKClinicalTypeIdentifierCoverageRecord",
              "verifiedBy": {
                "identifiers": [
                  "react-native-health"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_immunization.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_immunization.json",
        "title": "clinical_immunization",
        "description": "Immunizations. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "clinical",
              "identifier": "HKClinicalTypeIdentifierImmunizationRecord",
              "verifiedBy": {
                "identifiers": [
                  "react-native-health"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_VACCINES",
              "medicalResourceType": "VACCINES"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_lab_result.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_lab_result.json",
        "title": "clinical_lab_result",
        "description": "Laboratory results. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "clinical",
              "identifier": "HKClinicalTypeIdentifierLabResultRecord",
              "verifiedBy": {
                "identifiers": [
                  "react-native-health"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_LABORATORY_RESULTS",
              "medicalResourceType": "LABORATORY_RESULTS"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_medication.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_medication.json",
        "title": "clinical_medication",
        "description": "Prescribed medications. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "clinical",
              "identifier": "HKClinicalTypeIdentifierMedicationRecord",
              "verifiedBy": {
                "identifiers": [
                  "react-native-health"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_MEDICATIONS",
              "medicalResourceType": "MEDICATIONS"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_note.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_note.json",
        "title": "clinical_note",
        "description": "Clinical notes (HealthKit only, iOS 16). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "clinical",
              "identifier": "HKClinicalTypeIdentifierClinicalNoteRecord",
              "since": "iOS 16",
              "notes": [
                "Identifier taken from Apple documentation only — no cross-checkable source declares it (iOS 16+). Confirm against the SDK before relying on it."
              ]
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_personal_details.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_personal_details.json",
        "title": "clinical_personal_details",
        "description": "Personal details (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_PERSONAL_DETAILS",
              "medicalResourceType": "PERSONAL_DETAILS"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_practitioner_details.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_practitioner_details.json",
        "title": "clinical_practitioner_details",
        "description": "Practitioner details (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_PRACTITIONER_DETAILS",
              "medicalResourceType": "PRACTITIONER_DETAILS"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_pregnancy.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_pregnancy.json",
        "title": "clinical_pregnancy",
        "description": "Pregnancy records (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_PREGNANCY",
              "medicalResourceType": "PREGNANCY"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_procedure.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_procedure.json",
        "title": "clinical_procedure",
        "description": "Procedures. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "clinical",
              "identifier": "HKClinicalTypeIdentifierProcedureRecord",
              "verifiedBy": {
                "identifiers": [
                  "react-native-health"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_PROCEDURES",
              "medicalResourceType": "PROCEDURES"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_social_history.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_social_history.json",
        "title": "clinical_social_history",
        "description": "Social history (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_SOCIAL_HISTORY",
              "medicalResourceType": "SOCIAL_HISTORY"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_visit.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_visit.json",
        "title": "clinical_visit",
        "description": "Visits / encounters (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_VISITS",
              "medicalResourceType": "VISITS"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/clinical_vital_sign.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/clinical_vital_sign.json",
        "title": "clinical_vital_sign",
        "description": "Clinically recorded vital signs. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.",
        "x-healthspec": {
          "category": "clinical",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "clinical",
              "identifier": "HKClinicalTypeIdentifierVitalSignRecord",
              "verifiedBy": {
                "identifiers": [
                  "react-native-health"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": false,
              "record": "MedicalResource",
              "permission": "MEDICAL_DATA_VITAL_SIGNS",
              "medicalResourceType": "VITAL_SIGNS"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "resourceType": {
            "type": "string",
            "description": "FHIR resource type, e.g. \"Observation\"."
          },
          "fhirVersion": {
            "type": "string",
            "description": "FHIR release, e.g. \"R4\"."
          },
          "displayName": {
            "type": "string"
          },
          "sourceUrl": {
            "type": "string"
          },
          "fhir": {
            "type": "object",
            "additionalProperties": true,
            "description": "The FHIR resource, verbatim."
          }
        },
        "required": [
          "resourceType",
          "fhir"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "resourceType": "Observation",
            "fhirVersion": "R4",
            "displayName": "Hemoglobin A1c",
            "fhir": {
              "resourceType": "Observation",
              "status": "final"
            }
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/contraceptive.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/contraceptive.json",
        "title": "contraceptive",
        "description": "Contraceptive in use.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "method",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "method": {
            "type": "string",
            "enum": [
              "unspecified",
              "implant",
              "injection",
              "intrauterine_device",
              "intravaginal_ring",
              "oral",
              "patch"
            ]
          }
        },
        "required": [
          "method"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "method": "oral"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/cross_country_skiing_speed.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/cross_country_skiing_speed.json",
        "title": "cross_country_skiing_speed",
        "description": "Cross-country skiing speed sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierCrossCountrySkiingSpeed",
              "unit": "m/s",
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "metersPerSecond": {
            "type": "number",
            "x-unit": "m/s",
            "minimum": 0
          }
        },
        "required": [
          "metersPerSecond"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "metersPerSecond": 4
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/cycling_cadence.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/cycling_cadence.json",
        "title": "cycling_cadence",
        "description": "Pedalling cadence sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierCyclingCadence",
              "unit": "count/min",
              "since": "iOS 17",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "CyclingPedalingCadenceRecord",
              "permission": "CYCLING_PEDALING_CADENCE",
              "field": "samples[].revolutionsPerMinute",
              "unit": "rpm",
              "series": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [],
          "counterparts": [
            {
              "type": "steps_cadence",
              "platform": "healthconnect",
              "interchangeable": false,
              "reason": "Pedalling cadence (rpm) and step cadence (steps/min) measure different motions."
            }
          ]
        },
        "type": "object",
        "properties": {
          "rpm": {
            "type": "number",
            "x-unit": "rpm",
            "minimum": 0,
            "maximum": 400
          }
        },
        "required": [
          "rpm"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "rpm": 88
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/cycling_functional_threshold_power.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/cycling_functional_threshold_power.json",
        "title": "cycling_functional_threshold_power",
        "description": "Functional threshold power estimate.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierCyclingFunctionalThresholdPower",
              "unit": "W",
              "since": "iOS 17",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "watts": {
            "type": "number",
            "x-unit": "W",
            "minimum": 0
          }
        },
        "required": [
          "watts"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "watts": 240
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/cycling_power.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/cycling_power.json",
        "title": "cycling_power",
        "description": "Cycling power sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierCyclingPower",
              "unit": "W",
              "since": "iOS 17",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false,
          "counterparts": [
            {
              "type": "power",
              "platform": "healthconnect",
              "interchangeable": true,
              "reason": "Health Connect keeps a single activity-agnostic PowerRecord."
            }
          ]
        },
        "type": "object",
        "properties": {
          "watts": {
            "type": "number",
            "x-unit": "W",
            "minimum": 0
          }
        },
        "required": [
          "watts"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "watts": 210
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/cycling_speed.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/cycling_speed.json",
        "title": "cycling_speed",
        "description": "Cycling speed sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierCyclingSpeed",
              "unit": "m/s",
              "since": "iOS 17",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false,
          "counterparts": [
            {
              "type": "speed",
              "platform": "healthconnect",
              "interchangeable": true,
              "reason": "Health Connect keeps a single activity-agnostic SpeedRecord."
            }
          ]
        },
        "type": "object",
        "properties": {
          "metersPerSecond": {
            "type": "number",
            "x-unit": "m/s",
            "minimum": 0
          }
        },
        "required": [
          "metersPerSecond"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "metersPerSecond": 7.5
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/distance.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/distance.json",
        "title": "distance",
        "description": "Distance travelled on foot during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierDistanceWalkingRunning",
              "unit": "m",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "DistanceRecord",
              "permission": "DISTANCE",
              "field": "distance",
              "unit": "meters",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "physical-activity"
          },
          "notes": [
            "HealthKit splits distance by activity (distanceCycling, distanceSwimming, distanceWheelchair, distanceDownhillSnowSports); v1 maps walking/running only. Health Connect has a single DistanceRecord regardless of activity."
          ],
          "counterparts": [
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
          ]
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "minimum": 0,
            "x-unit": "m"
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 2480.5
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/distance_cross_country_skiing.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/distance_cross_country_skiing.json",
        "title": "distance_cross_country_skiing",
        "description": "Cross-country skiing distance during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierDistanceCrossCountrySkiing",
              "unit": "m",
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 7000
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/distance_cycling.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/distance_cycling.json",
        "title": "distance_cycling",
        "description": "Distance cycled during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierDistanceCycling",
              "unit": "m",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false,
          "counterparts": [
            {
              "type": "distance",
              "platform": "healthconnect",
              "interchangeable": false,
              "reason": "Health Connect has one DistanceRecord for every activity; it already includes cycling distance."
            }
          ]
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 12800
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/distance_downhill_snow_sports.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/distance_downhill_snow_sports.json",
        "title": "distance_downhill_snow_sports",
        "description": "Downhill skiing / snowboarding distance during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierDistanceDownhillSnowSports",
              "unit": "m",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 9800
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/distance_paddle_sports.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/distance_paddle_sports.json",
        "title": "distance_paddle_sports",
        "description": "Paddle-sports distance during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierDistancePaddleSports",
              "unit": "m",
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 3000
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/distance_rowing.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/distance_rowing.json",
        "title": "distance_rowing",
        "description": "Rowing distance during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierDistanceRowing",
              "unit": "m",
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 5000
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/distance_skating_sports.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/distance_skating_sports.json",
        "title": "distance_skating_sports",
        "description": "Skating distance during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierDistanceSkatingSports",
              "unit": "m",
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 4000
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/distance_swimming.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/distance_swimming.json",
        "title": "distance_swimming",
        "description": "Distance swum during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierDistanceSwimming",
              "unit": "m",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false,
          "counterparts": [
            {
              "type": "distance",
              "platform": "healthconnect",
              "interchangeable": false,
              "reason": "Health Connect has one DistanceRecord for every activity; it already includes swimming distance."
            }
          ]
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 1500
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/distance_wheelchair.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/distance_wheelchair.json",
        "title": "distance_wheelchair",
        "description": "Distance travelled by wheelchair during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierDistanceWheelchair",
              "unit": "m",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false,
          "counterparts": [
            {
              "type": "distance",
              "platform": "healthconnect",
              "interchangeable": false,
              "reason": "Health Connect has one DistanceRecord for every activity; it already includes wheelchair distance."
            }
          ]
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 2400
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/electrocardiogram.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/electrocardiogram.json",
        "title": "electrocardiogram",
        "description": "Single-lead ECG recording: classification and summary values. Voltage samples are fetched separately (readEcgVoltages) because a recording holds thousands.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "electrocardiogram",
              "identifier": "HKDataTypeIdentifierElectrocardiogram",
              "since": "iOS 14"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "classification": {
            "type": "string",
            "enum": [
              "not_set",
              "sinus_rhythm",
              "atrial_fibrillation",
              "inconclusive_low_heart_rate",
              "inconclusive_high_heart_rate",
              "inconclusive_poor_reading",
              "inconclusive_other",
              "unrecognized"
            ]
          },
          "symptomsStatus": {
            "type": "string",
            "enum": [
              "not_set",
              "none",
              "present"
            ]
          },
          "averageBpm": {
            "type": "number",
            "x-unit": "beats/min",
            "minimum": 0,
            "maximum": 300
          },
          "samplingFrequencyHz": {
            "type": "number",
            "x-unit": "Hz",
            "minimum": 0
          },
          "voltageCount": {
            "type": "integer",
            "x-unit": "count",
            "minimum": 0
          }
        },
        "required": [
          "classification"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "classification": "sinus_rhythm",
            "symptomsStatus": "none",
            "averageBpm": 64,
            "samplingFrequencyHz": 512,
            "voltageCount": 15360
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/electrodermal_activity.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/electrodermal_activity.json",
        "title": "electrodermal_activity",
        "description": "Electrodermal activity (skin conductance).",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierElectrodermalActivity",
              "unit": "mcS",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "microsiemens": {
            "type": "number",
            "x-unit": "µS",
            "minimum": 0
          }
        },
        "required": [
          "microsiemens"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "microsiemens": 1.8
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/elevation_gained.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/elevation_gained.json",
        "title": "elevation_gained",
        "description": "Elevation gained during the interval (Health Connect only; HealthKit keeps it as workout metadata).",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "ElevationGainedRecord",
              "permission": "ELEVATION_GAINED",
              "field": "elevation",
              "unit": "meters",
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [],
          "counterparts": [
            {
              "type": "floors_climbed",
              "platform": "healthkit",
              "interchangeable": false,
              "reason": "HealthKit records flights climbed, not metres gained; a flight is a fixed approximation."
            }
          ]
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m"
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 140.5
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/environmental_audio_exposure.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/environmental_audio_exposure.json",
        "title": "environmental_audio_exposure",
        "description": "Environmental sound level exposure.",
        "x-healthspec": {
          "category": "environment",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierEnvironmentalAudioExposure",
              "unit": "dBASPL",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "decibels": {
            "type": "number",
            "x-unit": "dB(A)",
            "minimum": 0,
            "maximum": 200
          }
        },
        "required": [
          "decibels"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "decibels": 68
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/environmental_audio_exposure_event.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/environmental_audio_exposure_event.json",
        "title": "environmental_audio_exposure_event",
        "description": "Environmental sound exposure limit event.",
        "x-healthspec": {
          "category": "environment",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierAudioExposureEvent",
              "values": {},
              "notes": [
                "Apple renamed the Swift case to `environmentalAudioExposureEvent` in iOS 14 but kept the raw value `HKCategoryTypeIdentifierAudioExposureEvent`. Verified at runtime — the renamed string does not resolve."
              ]
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/environmental_sound_reduction.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/environmental_sound_reduction.json",
        "title": "environmental_sound_reduction",
        "description": "Sound reduction from active noise control.",
        "x-healthspec": {
          "category": "environment",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierEnvironmentalSoundReduction",
              "unit": "dBASPL",
              "since": "iOS 16",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "decibels": {
            "type": "number",
            "x-unit": "dB(A)",
            "minimum": 0,
            "maximum": 200
          }
        },
        "required": [
          "decibels"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "decibels": 12
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/estimated_workout_effort_score.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/estimated_workout_effort_score.json",
        "title": "estimated_workout_effort_score",
        "description": "System-estimated workout effort (1–10).",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierEstimatedWorkoutEffortScore",
              "unit": "appleEffortScore",
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "score": {
            "type": "number",
            "x-unit": "score",
            "minimum": 1,
            "maximum": 10
          }
        },
        "required": [
          "score"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "score": 6
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/exercise_route.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/exercise_route.json",
        "title": "exercise_route",
        "description": "GPS route of an exercise session. Read with readRoute(sessionId): Health Connect asks the user per session; HealthKit reads the route series linked to the workout.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
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
              ],
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "sessionId": {
            "type": "string",
            "description": "Id of the exercise_session this route belongs to."
          },
          "points": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "time": {
                  "type": "string",
                  "format": "date-time"
                },
                "latitude": {
                  "type": "number",
                  "x-unit": "°",
                  "minimum": -90,
                  "maximum": 90
                },
                "longitude": {
                  "type": "number",
                  "x-unit": "°",
                  "minimum": -180,
                  "maximum": 180
                },
                "altitudeMeters": {
                  "type": "number",
                  "x-unit": "m"
                },
                "horizontalAccuracyMeters": {
                  "type": "number",
                  "x-unit": "m",
                  "minimum": 0
                },
                "verticalAccuracyMeters": {
                  "type": "number",
                  "x-unit": "m",
                  "minimum": 0
                }
              },
              "required": [
                "time",
                "latitude",
                "longitude"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "points"
        ],
        "additionalProperties": false,
        "examples": [
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
        ]
      }
    },
    {
      "file": "spec/schema/types/exercise_session.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/exercise_session.json",
        "title": "exercise_session",
        "description": "A workout / exercise session. Duration is end − start. Associated totals (distance, energy, heart rate) are separate records overlapping the session's time range.",
        "x-healthspec": {
          "category": "activity",
          "kind": "session",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "physical-activity"
          },
          "notes": [
            "Activity type mapping lives in enums/exercise_type.json (draft, to be verified in Phase 1).",
            "Segments, laps and routes are out of scope for v1."
          ]
        },
        "type": "object",
        "properties": {
          "activity": {
            "$ref": "../enums/exercise_type.json"
          },
          "title": {
            "type": "string",
            "x-platform": "healthconnect"
          },
          "notes": {
            "type": "string",
            "x-platform": "healthconnect"
          }
        },
        "required": [
          "activity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "activity": "running",
            "title": "Morning run"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/floors_climbed.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/floors_climbed.json",
        "title": "floors_climbed",
        "description": "Floors (flights of stairs) climbed during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierFlightsClimbed",
              "unit": "count",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "FloorsClimbedRecord",
              "permission": "FLOORS_CLIMBED",
              "field": "floors",
              "unit": "count",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "count": {
            "type": "number",
            "minimum": 0,
            "x-unit": "count"
          }
        },
        "required": [
          "count"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "count": 12
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/forced_expiratory_volume_1.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/forced_expiratory_volume_1.json",
        "title": "forced_expiratory_volume_1",
        "description": "FEV1 — air exhaled in the first second of a forced breath.",
        "x-healthspec": {
          "category": "respiratory",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierForcedExpiratoryVolume1",
              "unit": "L",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "liters": {
            "type": "number",
            "x-unit": "L",
            "minimum": 0
          }
        },
        "required": [
          "liters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "liters": 3.4
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/forced_vital_capacity.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/forced_vital_capacity.json",
        "title": "forced_vital_capacity",
        "description": "Forced vital capacity.",
        "x-healthspec": {
          "category": "respiratory",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierForcedVitalCapacity",
              "unit": "L",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "liters": {
            "type": "number",
            "x-unit": "L",
            "minimum": 0
          }
        },
        "required": [
          "liters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "liters": 4.2
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/handwashing_event.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/handwashing_event.json",
        "title": "handwashing_event",
        "description": "Handwashing session.",
        "x-healthspec": {
          "category": "wellness",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierHandwashingEvent",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/headphone_audio_exposure.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/headphone_audio_exposure.json",
        "title": "headphone_audio_exposure",
        "description": "Headphone sound level exposure.",
        "x-healthspec": {
          "category": "environment",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierHeadphoneAudioExposure",
              "unit": "dBASPL",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "decibels": {
            "type": "number",
            "x-unit": "dB(A)",
            "minimum": 0,
            "maximum": 200
          }
        },
        "required": [
          "decibels"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "decibels": 74
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/headphone_audio_exposure_event.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/headphone_audio_exposure_event.json",
        "title": "headphone_audio_exposure_event",
        "description": "Headphone sound exposure limit event.",
        "x-healthspec": {
          "category": "environment",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierHeadphoneAudioExposureEvent",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/heart_rate.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/heart_rate.json",
        "title": "heart_rate",
        "description": "Heart rate sample.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max",
            "count"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierHeartRate",
              "unit": "count/min",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "HeartRateRecord",
              "permission": "HEART_RATE",
              "field": "samples[].beatsPerMinute",
              "unit": "bpm",
              "series": true,
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "heart-rate"
          },
          "notes": [
            "Health Connect stores a series of samples per record; providers flatten each sample into its own point record whose id is `<recordId>#<index>`."
          ]
        },
        "type": "object",
        "properties": {
          "bpm": {
            "type": "number",
            "minimum": 0,
            "maximum": 300,
            "x-unit": "beats/min"
          }
        },
        "required": [
          "bpm"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "bpm": 64
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/heart_rate_recovery_one_minute.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/heart_rate_recovery_one_minute.json",
        "title": "heart_rate_recovery_one_minute",
        "description": "Heart-rate drop one minute after exercise.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierHeartRateRecoveryOneMinute",
              "unit": "count/min",
              "since": "iOS 16",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "bpm": {
            "type": "number",
            "x-unit": "beats/min",
            "minimum": 0,
            "maximum": 300
          }
        },
        "required": [
          "bpm"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "bpm": 28
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/heartbeat_series.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/heartbeat_series.json",
        "title": "heartbeat_series",
        "description": "Beat-to-beat timing series behind an HRV measurement.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "heartbeatSeries",
              "identifier": "HKDataTypeIdentifierHeartbeatSeries",
              "since": "iOS 13"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "count": {
            "type": "integer",
            "x-unit": "count",
            "minimum": 0
          },
          "beats": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "offsetSeconds": {
                  "type": "number",
                  "x-unit": "s",
                  "minimum": 0
                },
                "precededByGap": {
                  "type": "boolean"
                }
              },
              "required": [
                "offsetSeconds",
                "precededByGap"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "beats"
        ],
        "additionalProperties": false,
        "examples": [
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
        ]
      }
    },
    {
      "file": "spec/schema/types/height.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/height.json",
        "title": "height",
        "description": "Body height.",
        "x-healthspec": {
          "category": "body",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierHeight",
              "unit": "m",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "HeightRecord",
              "permission": "HEIGHT",
              "field": "height",
              "unit": "meters",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "body-height"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "exclusiveMinimum": 0,
            "maximum": 3,
            "x-unit": "m"
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 1.76
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/high_heart_rate_event.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/high_heart_rate_event.json",
        "title": "high_heart_rate_event",
        "description": "High heart-rate notification event (threshold in metadata HKHeartRateEventThreshold).",
        "x-healthspec": {
          "category": "vitals",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierHighHeartRateEvent",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/hrv_rmssd.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/hrv_rmssd.json",
        "title": "hrv_rmssd",
        "description": "Heart rate variability, RMSSD (root mean square of successive differences). Health Connect only.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthconnect": {
              "record": "HeartRateVariabilityRmssdRecord",
              "permission": "HEART_RATE_VARIABILITY",
              "field": "heartRateVariabilityMillis",
              "unit": "ms",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [
            "SDNN and RMSSD are different statistics and MUST NOT be converted into each other. See hrv_sdnn for HealthKit."
          ],
          "counterparts": [
            {
              "type": "hrv_sdnn",
              "platform": "healthkit",
              "interchangeable": false,
              "reason": "RMSSD and SDNN are different statistics computed from the same intervals; neither can be derived from the other."
            }
          ]
        },
        "type": "object",
        "properties": {
          "milliseconds": {
            "type": "number",
            "minimum": 0,
            "x-unit": "ms"
          }
        },
        "required": [
          "milliseconds"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "milliseconds": 36.9
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/hrv_sdnn.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/hrv_sdnn.json",
        "title": "hrv_sdnn",
        "description": "Heart rate variability, SDNN (standard deviation of NN intervals). Apple platforms only.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierHeartRateVariabilitySDNN",
              "unit": "ms",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [
            "SDNN and RMSSD are different statistics and MUST NOT be converted into each other. See hrv_rmssd for Health Connect."
          ],
          "counterparts": [
            {
              "type": "hrv_rmssd",
              "platform": "healthconnect",
              "interchangeable": false,
              "reason": "SDNN and RMSSD are different statistics computed from the same intervals; neither can be derived from the other."
            }
          ]
        },
        "type": "object",
        "properties": {
          "milliseconds": {
            "type": "number",
            "minimum": 0,
            "x-unit": "ms"
          }
        },
        "required": [
          "milliseconds"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "milliseconds": 48.2
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/hydration.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/hydration.json",
        "title": "hydration",
        "description": "Water consumed during the interval.",
        "x-healthspec": {
          "category": "nutrition",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierDietaryWater",
              "unit": "L",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "HydrationRecord",
              "permission": "HYDRATION",
              "field": "volume",
              "unit": "liters",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "liters": {
            "type": "number",
            "minimum": 0,
            "x-unit": "L"
          }
        },
        "required": [
          "liters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "liters": 0.35
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/infrequent_menstrual_cycles.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/infrequent_menstrual_cycles.json",
        "title": "infrequent_menstrual_cycles",
        "description": "Infrequent menstrual cycles (cycle deviation notification).",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierInfrequentMenstrualCycles",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/inhaler_usage.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/inhaler_usage.json",
        "title": "inhaler_usage",
        "description": "Inhaler puffs.",
        "x-healthspec": {
          "category": "respiratory",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierInhalerUsage",
              "unit": "count",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "count": {
            "type": "number",
            "x-unit": "count",
            "minimum": 0
          }
        },
        "required": [
          "count"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "count": 2
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/insulin_delivery.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/insulin_delivery.json",
        "title": "insulin_delivery",
        "description": "Insulin delivered during the interval.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierInsulinDelivery",
              "unit": "IU",
              "metadataFields": {
                "reason": {
                  "key": "HKInsulinDeliveryReason",
                  "type": "number"
                }
              },
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "internationalUnits": {
            "type": "number",
            "x-unit": "IU",
            "minimum": 0
          },
          "reason": {
            "type": "string",
            "enum": [
              "basal",
              "bolus"
            ]
          }
        },
        "required": [
          "internationalUnits"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "internationalUnits": 4.5
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/intermenstrual_bleeding.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/intermenstrual_bleeding.json",
        "title": "intermenstrual_bleeding",
        "description": "Spotting / bleeding between periods.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierIntermenstrualBleeding",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "IntermenstrualBleedingRecord",
              "permission": "INTERMENSTRUAL_BLEEDING",
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/irregular_heart_rhythm_event.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/irregular_heart_rhythm_event.json",
        "title": "irregular_heart_rhythm_event",
        "description": "Irregular heart rhythm notification event.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierIrregularHeartRhythmEvent",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/irregular_menstrual_cycles.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/irregular_menstrual_cycles.json",
        "title": "irregular_menstrual_cycles",
        "description": "Irregular menstrual cycles (cycle deviation notification).",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierIrregularMenstrualCycles",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/lactation.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/lactation.json",
        "title": "lactation",
        "description": "Lactation period.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierLactation",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/lean_body_mass.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/lean_body_mass.json",
        "title": "lean_body_mass",
        "description": "Lean body mass (body mass excluding fat).",
        "x-healthspec": {
          "category": "body",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierLeanBodyMass",
              "unit": "kg",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "LeanBodyMassRecord",
              "permission": "LEAN_BODY_MASS",
              "field": "mass",
              "unit": "kilograms",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "kilograms": {
            "type": "number",
            "exclusiveMinimum": 0,
            "maximum": 1000,
            "x-unit": "kg"
          }
        },
        "required": [
          "kilograms"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "kilograms": 57
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/low_cardio_fitness_event.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/low_cardio_fitness_event.json",
        "title": "low_cardio_fitness_event",
        "description": "Low cardio fitness notification event.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierLowCardioFitnessEvent",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/low_heart_rate_event.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/low_heart_rate_event.json",
        "title": "low_heart_rate_event",
        "description": "Low heart-rate notification event.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierLowHeartRateEvent",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/medication_dose.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/medication_dose.json",
        "title": "medication_dose",
        "description": "A logged medication dose event (iOS 26 Medications). The medication list itself comes from listMedications().",
        "x-healthspec": {
          "category": "clinical",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "medicationDose",
              "identifier": "HKDataTypeIdentifierMedicationDoseEvent",
              "since": "iOS 26"
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "medicationId": {
            "type": "string",
            "description": "HKMedicationConceptIdentifier"
          },
          "medicationName": {
            "type": "string"
          },
          "status": {
            "type": "string",
            "enum": [
              "not_interacted",
              "notification_not_sent",
              "snoozed",
              "taken",
              "skipped",
              "not_logged"
            ]
          },
          "scheduleType": {
            "type": "string",
            "enum": [
              "as_needed",
              "scheduled"
            ]
          },
          "scheduledAt": {
            "type": "string",
            "format": "date-time"
          },
          "scheduledDose": {
            "type": "number",
            "x-unit": "dose",
            "minimum": 0
          },
          "dose": {
            "type": "number",
            "x-unit": "dose",
            "minimum": 0
          },
          "unit": {
            "type": "string"
          }
        },
        "required": [
          "medicationId",
          "status",
          "scheduleType"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "medicationId": "rxnorm:197361",
            "medicationName": "Amoxicillin 500 mg",
            "status": "taken",
            "scheduleType": "scheduled",
            "scheduledAt": "2026-08-21T08:00:00Z",
            "dose": 1,
            "unit": "capsule"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/menstruation_flow.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/menstruation_flow.json",
        "title": "menstruation_flow",
        "description": "Menstrual flow observation for a day (or shorter interval).",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
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
                  "type": "boolean"
                }
              },
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "MenstruationFlowRecord",
              "permission": "MENSTRUATION",
              "field": "flow",
              "notes": [
                "Health Connect has no \"none\" flow; it is written as FLOW_UNKNOWN."
              ],
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "flow": {
            "type": "string",
            "enum": [
              "unknown",
              "light",
              "medium",
              "heavy",
              "none"
            ]
          },
          "cycleStart": {
            "type": "boolean",
            "description": "First day of a cycle (HealthKit metadata only).",
            "x-platform": "healthkit"
          }
        },
        "required": [
          "flow"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "flow": "medium",
            "cycleStart": true
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/menstruation_period.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/menstruation_period.json",
        "title": "menstruation_period",
        "description": "A menstrual period as a whole (Health Connect only; HealthKit users derive periods from menstruation_flow with cycleStart).",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "MenstruationPeriodRecord",
              "permission": "MENSTRUATION",
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [],
          "counterparts": [
            {
              "type": "menstruation_flow",
              "platform": "healthkit",
              "interchangeable": false,
              "reason": "HealthKit has no period record; derive periods by grouping menstruation_flow entries whose cycleStart is true."
            }
          ]
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/mindfulness_session.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/mindfulness_session.json",
        "title": "mindfulness_session",
        "description": "A mindfulness / meditation session. Duration is end − start.",
        "x-healthspec": {
          "category": "wellness",
          "kind": "session",
          "since": "1.0",
          "aggregate": [
            "duration",
            "count"
          ],
          "platforms": {
            "healthkit": {
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierMindfulSession",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "MindfulnessSessionRecord",
              "permission": "MINDFULNESS",
              "field": "mindfulnessSessionType",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "sessionType": {
            "type": "string",
            "enum": [
              "meditation",
              "breathing",
              "movement",
              "music",
              "unguided",
              "other"
            ]
          },
          "title": {
            "type": "string",
            "x-platform": "healthconnect"
          },
          "notes": {
            "type": "string",
            "x-platform": "healthconnect"
          }
        },
        "additionalProperties": false,
        "examples": [
          {
            "sessionType": "meditation",
            "title": "Evening calm"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/nike_fuel.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/nike_fuel.json",
        "title": "nike_fuel",
        "description": "NikeFuel points during the interval (legacy).",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierNikeFuel",
              "unit": "count",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "count": {
            "type": "number",
            "x-unit": "count",
            "minimum": 0
          }
        },
        "required": [
          "count"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "count": 120
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/number_of_alcoholic_beverages.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/number_of_alcoholic_beverages.json",
        "title": "number_of_alcoholic_beverages",
        "description": "Alcoholic drinks consumed during the interval.",
        "x-healthspec": {
          "category": "nutrition",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierNumberOfAlcoholicBeverages",
              "unit": "count",
              "since": "iOS 15",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "count": {
            "type": "number",
            "x-unit": "count",
            "minimum": 0
          }
        },
        "required": [
          "count"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "count": 1
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/number_of_times_fallen.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/number_of_times_fallen.json",
        "title": "number_of_times_fallen",
        "description": "Falls during the interval.",
        "x-healthspec": {
          "category": "mobility",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierNumberOfTimesFallen",
              "unit": "count",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "count": {
            "type": "number",
            "x-unit": "count",
            "minimum": 0
          }
        },
        "required": [
          "count"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "count": 1
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/nutrition.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/nutrition.json",
        "title": "nutrition",
        "description": "Nutrients consumed during the interval (a meal or a day). Every nutrient either platform records; fields a platform lacks are simply absent there.",
        "x-healthspec": {
          "category": "nutrition",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
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
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
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
              },
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [
            "The two platforms are structural opposites (many samples vs one record); the spec models the Health Connect shape and HealthKit providers group/ungroup."
          ]
        },
        "type": "object",
        "properties": {
          "kilocalories": {
            "type": "number",
            "x-unit": "kcal",
            "minimum": 0
          },
          "energyFromFatKilocalories": {
            "type": "number",
            "x-unit": "kcal",
            "minimum": 0
          },
          "proteinGrams": {
            "type": "number",
            "x-unit": "g",
            "minimum": 0
          },
          "carbohydrateGrams": {
            "type": "number",
            "x-unit": "g",
            "minimum": 0
          },
          "fatGrams": {
            "type": "number",
            "x-unit": "g",
            "minimum": 0
          },
          "fatSaturatedGrams": {
            "type": "number",
            "x-unit": "g",
            "minimum": 0
          },
          "fatMonounsaturatedGrams": {
            "type": "number",
            "x-unit": "g",
            "minimum": 0
          },
          "fatPolyunsaturatedGrams": {
            "type": "number",
            "x-unit": "g",
            "minimum": 0
          },
          "transFatGrams": {
            "type": "number",
            "x-unit": "g",
            "minimum": 0
          },
          "unsaturatedFatGrams": {
            "type": "number",
            "x-unit": "g",
            "minimum": 0
          },
          "fiberGrams": {
            "type": "number",
            "x-unit": "g",
            "minimum": 0
          },
          "sugarGrams": {
            "type": "number",
            "x-unit": "g",
            "minimum": 0
          },
          "cholesterolMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "sodiumMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "potassiumMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "calciumMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "ironMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "magnesiumMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "phosphorusMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "zincMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "copperMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "manganeseMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "chlorideMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "seleniumMicrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "iodineMicrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "chromiumMicrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "molybdenumMicrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "vitaminAMicrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "vitaminB6Milligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "vitaminB12Micrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "vitaminCMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "vitaminDMicrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "vitaminEMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "vitaminKMicrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "thiaminMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "riboflavinMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "niacinMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "folateMicrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "folicAcidMicrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "biotinMicrograms": {
            "type": "number",
            "x-unit": "mcg",
            "minimum": 0
          },
          "pantothenicAcidMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "caffeineMilligrams": {
            "type": "number",
            "x-unit": "mg",
            "minimum": 0
          },
          "mealType": {
            "$ref": "../enums/meal_type.json"
          },
          "name": {
            "type": "string"
          }
        },
        "additionalProperties": false,
        "examples": [
          {
            "kilocalories": 620,
            "proteinGrams": 32,
            "carbohydrateGrams": 71,
            "fatGrams": 22,
            "vitaminCMilligrams": 40,
            "mealType": "lunch",
            "name": "Bibimbap"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/ovulation_test.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/ovulation_test.json",
        "title": "ovulation_test",
        "description": "Result of an ovulation (LH / estrogen) test.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
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
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "OvulationTestRecord",
              "permission": "OVULATION_TEST",
              "field": "result",
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "result": {
            "type": "string",
            "enum": [
              "negative",
              "positive",
              "high",
              "inconclusive"
            ]
          }
        },
        "required": [
          "result"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "result": "positive"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/oxygen_saturation.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/oxygen_saturation.json",
        "title": "oxygen_saturation",
        "description": "Blood oxygen saturation (SpO2).",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierOxygenSaturation",
              "unit": "%",
              "read": true,
              "write": true,
              "notes": [
                "HKUnit.percent() is a fraction (0.97 = 97%); multiply by 100."
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "OxygenSaturationRecord",
              "permission": "OXYGEN_SATURATION",
              "field": "percentage",
              "unit": "percent",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "oxygen-saturation"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "percent": {
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "x-unit": "%"
          }
        },
        "required": [
          "percent"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "percent": 97
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/paddle_sports_speed.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/paddle_sports_speed.json",
        "title": "paddle_sports_speed",
        "description": "Paddle-sports speed sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierPaddleSportsSpeed",
              "unit": "m/s",
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "metersPerSecond": {
            "type": "number",
            "x-unit": "m/s",
            "minimum": 0
          }
        },
        "required": [
          "metersPerSecond"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "metersPerSecond": 2.2
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/peak_expiratory_flow_rate.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/peak_expiratory_flow_rate.json",
        "title": "peak_expiratory_flow_rate",
        "description": "Peak expiratory flow rate.",
        "x-healthspec": {
          "category": "respiratory",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierPeakExpiratoryFlowRate",
              "unit": "L/min",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "litersPerMinute": {
            "type": "number",
            "x-unit": "L/min",
            "minimum": 0
          }
        },
        "required": [
          "litersPerMinute"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "litersPerMinute": 480
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/peripheral_perfusion_index.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/peripheral_perfusion_index.json",
        "title": "peripheral_perfusion_index",
        "description": "Peripheral perfusion index.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierPeripheralPerfusionIndex",
              "unit": "%",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "percent": {
            "type": "number",
            "x-unit": "%",
            "minimum": 0,
            "maximum": 100
          }
        },
        "required": [
          "percent"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "percent": 3.5
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/persistent_intermenstrual_bleeding.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/persistent_intermenstrual_bleeding.json",
        "title": "persistent_intermenstrual_bleeding",
        "description": "Persistent intermenstrual bleeding (cycle deviation notification).",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierPersistentIntermenstrualBleeding",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/physical_effort.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/physical_effort.json",
        "title": "physical_effort",
        "description": "Physical effort (MET-like) sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierPhysicalEffort",
              "unit": "kcal/(kg*hr)",
              "since": "iOS 17",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "metsEquivalent": {
            "type": "number",
            "x-unit": "kcal/(kg·h)",
            "minimum": 0
          }
        },
        "required": [
          "metsEquivalent"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "metsEquivalent": 6.2
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/power.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/power.json",
        "title": "power",
        "description": "Power output sample, activity-agnostic (Health Connect). HealthKit splits power by activity — see cycling_power and running_power.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "PowerRecord",
              "permission": "POWER",
              "field": "samples[].power",
              "unit": "watts",
              "series": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [],
          "counterparts": [
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
          ]
        },
        "type": "object",
        "properties": {
          "watts": {
            "type": "number",
            "x-unit": "W",
            "minimum": 0
          }
        },
        "required": [
          "watts"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "watts": 212
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/pregnancy.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/pregnancy.json",
        "title": "pregnancy",
        "description": "Pregnancy period.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierPregnancy",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/pregnancy_test.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/pregnancy_test.json",
        "title": "pregnancy_test",
        "description": "Pregnancy test result.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
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
              "valueField": "result",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "result": {
            "type": "string",
            "enum": [
              "negative",
              "positive",
              "indeterminate"
            ]
          }
        },
        "required": [
          "result"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "result": "negative"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/progesterone_test.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/progesterone_test.json",
        "title": "progesterone_test",
        "description": "Progesterone test result.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
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
              "valueField": "result",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "result": {
            "type": "string",
            "enum": [
              "negative",
              "positive",
              "indeterminate"
            ]
          }
        },
        "required": [
          "result"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "result": "positive"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/prolonged_menstrual_periods.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/prolonged_menstrual_periods.json",
        "title": "prolonged_menstrual_periods",
        "description": "Prolonged menstrual periods (cycle deviation notification).",
        "x-healthspec": {
          "category": "cycle",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierProlongedMenstrualPeriods",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/respiratory_rate.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/respiratory_rate.json",
        "title": "respiratory_rate",
        "description": "Breaths per minute.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierRespiratoryRate",
              "unit": "count/min",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "RespiratoryRateRecord",
              "permission": "RESPIRATORY_RATE",
              "field": "rate",
              "unit": "breaths/min",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "respiratory-rate"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "breathsPerMinute": {
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "x-unit": "breaths/min"
          }
        },
        "required": [
          "breathsPerMinute"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "breathsPerMinute": 14.5
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/resting_heart_rate.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/resting_heart_rate.json",
        "title": "resting_heart_rate",
        "description": "Resting heart rate estimate.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierRestingHeartRate",
              "unit": "count/min",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "RestingHeartRateRecord",
              "permission": "RESTING_HEART_RATE",
              "field": "beatsPerMinute",
              "unit": "bpm",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "bpm": {
            "type": "number",
            "minimum": 0,
            "maximum": 300,
            "x-unit": "beats/min"
          }
        },
        "required": [
          "bpm"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "bpm": 52
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/rowing_speed.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/rowing_speed.json",
        "title": "rowing_speed",
        "description": "Rowing speed sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierRowingSpeed",
              "unit": "m/s",
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "metersPerSecond": {
            "type": "number",
            "x-unit": "m/s",
            "minimum": 0
          }
        },
        "required": [
          "metersPerSecond"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "metersPerSecond": 3
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/running_ground_contact_time.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/running_ground_contact_time.json",
        "title": "running_ground_contact_time",
        "description": "Ground contact time sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierRunningGroundContactTime",
              "unit": "ms",
              "since": "iOS 16",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "milliseconds": {
            "type": "number",
            "x-unit": "ms",
            "minimum": 0
          }
        },
        "required": [
          "milliseconds"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "milliseconds": 245
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/running_power.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/running_power.json",
        "title": "running_power",
        "description": "Running power sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierRunningPower",
              "unit": "W",
              "since": "iOS 16",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false,
          "counterparts": [
            {
              "type": "power",
              "platform": "healthconnect",
              "interchangeable": true,
              "reason": "Health Connect keeps a single activity-agnostic PowerRecord."
            }
          ]
        },
        "type": "object",
        "properties": {
          "watts": {
            "type": "number",
            "x-unit": "W",
            "minimum": 0
          }
        },
        "required": [
          "watts"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "watts": 260
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/running_speed.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/running_speed.json",
        "title": "running_speed",
        "description": "Running speed sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierRunningSpeed",
              "unit": "m/s",
              "since": "iOS 16",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false,
          "counterparts": [
            {
              "type": "speed",
              "platform": "healthconnect",
              "interchangeable": true,
              "reason": "Health Connect keeps a single activity-agnostic SpeedRecord."
            }
          ]
        },
        "type": "object",
        "properties": {
          "metersPerSecond": {
            "type": "number",
            "x-unit": "m/s",
            "minimum": 0
          }
        },
        "required": [
          "metersPerSecond"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "metersPerSecond": 3.1
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/running_stride_length.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/running_stride_length.json",
        "title": "running_stride_length",
        "description": "Running stride length sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierRunningStrideLength",
              "unit": "m",
              "since": "iOS 16",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 1.25
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/running_vertical_oscillation.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/running_vertical_oscillation.json",
        "title": "running_vertical_oscillation",
        "description": "Vertical oscillation sample.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierRunningVerticalOscillation",
              "unit": "cm",
              "since": "iOS 16",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "centimeters": {
            "type": "number",
            "x-unit": "cm",
            "minimum": 0
          }
        },
        "required": [
          "centimeters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "centimeters": 8.4
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/sexual_activity.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/sexual_activity.json",
        "title": "sexual_activity",
        "description": "Sexual activity event.",
        "x-healthspec": {
          "category": "cycle",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "count"
          ],
          "platforms": {
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
              },
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "SexualActivityRecord",
              "permission": "SEXUAL_ACTIVITY",
              "field": "protectionUsed",
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "protectionUsed": {
            "type": "string",
            "enum": [
              "protected",
              "unprotected",
              "unknown"
            ]
          }
        },
        "additionalProperties": false,
        "examples": [
          {
            "protectionUsed": "protected"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/six_minute_walk_distance.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/six_minute_walk_distance.json",
        "title": "six_minute_walk_distance",
        "description": "Estimated six-minute walk test distance.",
        "x-healthspec": {
          "category": "mobility",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierSixMinuteWalkTestDistance",
              "unit": "m",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 520
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/skin_temperature.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/skin_temperature.json",
        "title": "skin_temperature",
        "description": "Skin temperature expressed as a delta from the user's baseline. Health Connect only.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthconnect": {
              "record": "SkinTemperatureRecord",
              "permission": "SKIN_TEMPERATURE",
              "field": "deltas[].delta",
              "unit": "celsius (delta)",
              "series": true,
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [
            "HealthKit's HKQuantityTypeIdentifierAppleSleepingWristTemperature is an absolute nightly value, not a delta — a candidate for a separate v1.1 type, not a mapping of this one.",
            "Each delta in the Health Connect series becomes its own point record."
          ],
          "counterparts": [
            {
              "type": "apple_sleeping_wrist_temperature",
              "platform": "healthkit",
              "interchangeable": false,
              "reason": "Health Connect stores a delta from the user baseline; HealthKit stores an absolute nightly wrist temperature."
            }
          ]
        },
        "type": "object",
        "properties": {
          "deltaCelsius": {
            "type": "number",
            "minimum": -30,
            "maximum": 30,
            "x-unit": "°C"
          },
          "baselineCelsius": {
            "type": "number",
            "minimum": 20,
            "maximum": 50,
            "x-unit": "°C",
            "x-platform": "healthconnect"
          },
          "measurementLocation": {
            "type": "string",
            "enum": [
              "finger",
              "toe",
              "wrist",
              "unknown"
            ]
          }
        },
        "required": [
          "deltaCelsius"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "deltaCelsius": -0.3,
            "baselineCelsius": 33.8,
            "measurementLocation": "wrist"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/sleep_apnea_event.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/sleep_apnea_event.json",
        "title": "sleep_apnea_event",
        "description": "Sleep apnea notification event.",
        "x-healthspec": {
          "category": "sleep",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierSleepApneaEvent",
              "values": {},
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/sleep_session.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/sleep_session.json",
        "title": "sleep_session",
        "description": "A sleep session with optional stage breakdown. Session bounds are the record's start/end; stages partition (part of) that range.",
        "x-healthspec": {
          "category": "sleep",
          "kind": "session",
          "since": "1.0",
          "aggregate": [
            "duration",
            "count"
          ],
          "platforms": {
            "healthkit": {
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierSleepAnalysis",
              "read": true,
              "write": true,
              "notes": [
                "HealthKit has no session object: each stage is a separate category sample. Providers derive sessions by grouping consecutive samples from the same source with gaps ≤ 60 minutes; the session id is the first sample's UUID."
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "SleepSessionRecord",
              "permission": "SLEEP",
              "field": "stages[]",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "sleep-episode"
          },
          "notes": [
            "Stage mapping lives in enums/sleep_stage.json."
          ]
        },
        "type": "object",
        "properties": {
          "stages": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "stage": {
                  "$ref": "../enums/sleep_stage.json"
                },
                "start": {
                  "type": "string",
                  "format": "date-time"
                },
                "end": {
                  "type": "string",
                  "format": "date-time"
                }
              },
              "required": [
                "stage",
                "start",
                "end"
              ],
              "additionalProperties": false
            }
          },
          "title": {
            "type": "string",
            "x-platform": "healthconnect"
          },
          "notes": {
            "type": "string",
            "x-platform": "healthconnect"
          }
        },
        "required": [
          "stages"
        ],
        "additionalProperties": false,
        "examples": [
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
        ]
      }
    },
    {
      "file": "spec/schema/types/speed.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/speed.json",
        "title": "speed",
        "description": "Speed sample, activity-agnostic (Health Connect). HealthKit splits speed by activity — see walking_speed, running_speed, cycling_speed.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "SpeedRecord",
              "permission": "SPEED",
              "field": "samples[].speed",
              "unit": "metersPerSecond",
              "series": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [],
          "counterparts": [
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
          ]
        },
        "type": "object",
        "properties": {
          "metersPerSecond": {
            "type": "number",
            "x-unit": "m/s",
            "minimum": 0
          }
        },
        "required": [
          "metersPerSecond"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "metersPerSecond": 3.2
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/stair_ascent_speed.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/stair_ascent_speed.json",
        "title": "stair_ascent_speed",
        "description": "Stair ascent speed sample.",
        "x-healthspec": {
          "category": "mobility",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierStairAscentSpeed",
              "unit": "m/s",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "metersPerSecond": {
            "type": "number",
            "x-unit": "m/s",
            "minimum": 0
          }
        },
        "required": [
          "metersPerSecond"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "metersPerSecond": 0.6
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/stair_descent_speed.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/stair_descent_speed.json",
        "title": "stair_descent_speed",
        "description": "Stair descent speed sample.",
        "x-healthspec": {
          "category": "mobility",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierStairDescentSpeed",
              "unit": "m/s",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "metersPerSecond": {
            "type": "number",
            "x-unit": "m/s",
            "minimum": 0
          }
        },
        "required": [
          "metersPerSecond"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "metersPerSecond": 0.8
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/state_of_mind.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/state_of_mind.json",
        "title": "state_of_mind",
        "description": "Logged emotion (momentary) or mood (daily) with valence, labels and life-area associations.",
        "x-healthspec": {
          "category": "mind",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "count",
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "stateOfMind",
              "identifier": "HKDataTypeIdentifierStateOfMind",
              "since": "iOS 18"
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "kind": {
            "type": "string",
            "enum": [
              "momentary_emotion",
              "daily_mood"
            ]
          },
          "valence": {
            "type": "number",
            "x-unit": "valence",
            "minimum": -1,
            "maximum": 1
          },
          "valenceClassification": {
            "type": "string",
            "enum": [
              "very_unpleasant",
              "unpleasant",
              "slightly_unpleasant",
              "neutral",
              "slightly_pleasant",
              "pleasant",
              "very_pleasant"
            ]
          },
          "labels": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "amazed",
                "amused",
                "angry",
                "anxious",
                "ashamed",
                "brave",
                "calm",
                "content",
                "disappointed",
                "discouraged",
                "disgusted",
                "embarrassed",
                "excited",
                "frustrated",
                "grateful",
                "guilty",
                "happy",
                "hopeless",
                "irritated",
                "jealous",
                "joyful",
                "lonely",
                "passionate",
                "peaceful",
                "proud",
                "relieved",
                "sad",
                "scared",
                "stressed",
                "surprised",
                "worried",
                "annoyed",
                "confident",
                "drained",
                "hopeful",
                "indifferent",
                "overwhelmed",
                "satisfied"
              ]
            }
          },
          "associations": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "community",
                "current_events",
                "dating",
                "education",
                "family",
                "fitness",
                "friends",
                "health",
                "hobbies",
                "identity",
                "money",
                "partner",
                "self_care",
                "spirituality",
                "tasks",
                "travel",
                "work",
                "weather"
              ]
            }
          }
        },
        "required": [
          "kind",
          "valence"
        ],
        "additionalProperties": false,
        "examples": [
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
        ]
      }
    },
    {
      "file": "spec/schema/types/steps.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/steps.json",
        "title": "steps",
        "description": "Number of steps taken during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierStepCount",
              "unit": "count",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "StepsRecord",
              "permission": "STEPS",
              "field": "count",
              "unit": "count",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "step-count"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "count": {
            "type": "integer",
            "minimum": 0,
            "x-unit": "count"
          }
        },
        "required": [
          "count"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "count": 1234
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/steps_cadence.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/steps_cadence.json",
        "title": "steps_cadence",
        "description": "Step cadence sample (Health Connect only).",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthconnect": {
              "read": true,
              "write": true,
              "record": "StepsCadenceRecord",
              "permission": "STEPS_CADENCE",
              "field": "samples[].rate",
              "unit": "steps/min",
              "series": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [],
          "counterparts": [
            {
              "type": "cycling_cadence",
              "platform": "healthkit",
              "interchangeable": false,
              "reason": "Step cadence (steps/min) and pedalling cadence (rpm) measure different motions."
            }
          ]
        },
        "type": "object",
        "properties": {
          "stepsPerMinute": {
            "type": "number",
            "x-unit": "steps/min",
            "minimum": 0,
            "maximum": 400
          }
        },
        "required": [
          "stepsPerMinute"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "stepsPerMinute": 112
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/swimming_stroke_count.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/swimming_stroke_count.json",
        "title": "swimming_stroke_count",
        "description": "Swimming strokes during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierSwimmingStrokeCount",
              "unit": "count",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "count": {
            "type": "number",
            "x-unit": "count",
            "minimum": 0
          }
        },
        "required": [
          "count"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "count": 240
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_abdominal_cramps.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_abdominal_cramps.json",
        "title": "symptom_abdominal_cramps",
        "description": "Abdominal cramps (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_acne.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_acne.json",
        "title": "symptom_acne",
        "description": "Acne (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_appetite_changes.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_appetite_changes.json",
        "title": "symptom_appetite_changes",
        "description": "Appetite changes.",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "change",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "change": {
            "type": "string",
            "enum": [
              "unspecified",
              "no_change",
              "decreased",
              "increased"
            ]
          }
        },
        "required": [
          "change"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "change": "decreased"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_bladder_incontinence.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_bladder_incontinence.json",
        "title": "symptom_bladder_incontinence",
        "description": "Bladder incontinence (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_bloating.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_bloating.json",
        "title": "symptom_bloating",
        "description": "Bloating (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_breast_pain.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_breast_pain.json",
        "title": "symptom_breast_pain",
        "description": "Breast pain (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_chest_tightness_or_pain.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_chest_tightness_or_pain.json",
        "title": "symptom_chest_tightness_or_pain",
        "description": "Chest tightness or pain (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_chills.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_chills.json",
        "title": "symptom_chills",
        "description": "Chills (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_constipation.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_constipation.json",
        "title": "symptom_constipation",
        "description": "Constipation (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_coughing.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_coughing.json",
        "title": "symptom_coughing",
        "description": "Coughing (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_diarrhea.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_diarrhea.json",
        "title": "symptom_diarrhea",
        "description": "Diarrhea (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_dizziness.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_dizziness.json",
        "title": "symptom_dizziness",
        "description": "Dizziness (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_dry_skin.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_dry_skin.json",
        "title": "symptom_dry_skin",
        "description": "Dry skin (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_fainting.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_fainting.json",
        "title": "symptom_fainting",
        "description": "Fainting (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_fatigue.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_fatigue.json",
        "title": "symptom_fatigue",
        "description": "Fatigue (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_fever.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_fever.json",
        "title": "symptom_fever",
        "description": "Fever (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_generalized_body_ache.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_generalized_body_ache.json",
        "title": "symptom_generalized_body_ache",
        "description": "Generalized body ache (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_hair_loss.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_hair_loss.json",
        "title": "symptom_hair_loss",
        "description": "Hair loss (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_headache.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_headache.json",
        "title": "symptom_headache",
        "description": "Headache (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_heartburn.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_heartburn.json",
        "title": "symptom_heartburn",
        "description": "Heartburn (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_hot_flashes.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_hot_flashes.json",
        "title": "symptom_hot_flashes",
        "description": "Hot flashes (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_loss_of_smell.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_loss_of_smell.json",
        "title": "symptom_loss_of_smell",
        "description": "Loss of smell (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_loss_of_taste.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_loss_of_taste.json",
        "title": "symptom_loss_of_taste",
        "description": "Loss of taste (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_lower_back_pain.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_lower_back_pain.json",
        "title": "symptom_lower_back_pain",
        "description": "Lower back pain (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_memory_lapse.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_memory_lapse.json",
        "title": "symptom_memory_lapse",
        "description": "Memory lapse (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_mood_changes.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_mood_changes.json",
        "title": "symptom_mood_changes",
        "description": "Mood changes.",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierMoodChanges",
              "values": {
                "present": 0,
                "not_present": 1
              },
              "valueField": "presence",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "presence": {
            "type": "string",
            "enum": [
              "present",
              "not_present"
            ]
          }
        },
        "required": [
          "presence"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "presence": "present"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_nausea.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_nausea.json",
        "title": "symptom_nausea",
        "description": "Nausea (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_night_sweats.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_night_sweats.json",
        "title": "symptom_night_sweats",
        "description": "Night sweats (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_pelvic_pain.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_pelvic_pain.json",
        "title": "symptom_pelvic_pain",
        "description": "Pelvic pain (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_rapid_pounding_or_fluttering_heartbeat.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_rapid_pounding_or_fluttering_heartbeat.json",
        "title": "symptom_rapid_pounding_or_fluttering_heartbeat",
        "description": "Rapid, pounding or fluttering heartbeat (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_runny_nose.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_runny_nose.json",
        "title": "symptom_runny_nose",
        "description": "Runny nose (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_shortness_of_breath.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_shortness_of_breath.json",
        "title": "symptom_shortness_of_breath",
        "description": "Shortness of breath (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_sinus_congestion.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_sinus_congestion.json",
        "title": "symptom_sinus_congestion",
        "description": "Sinus congestion (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_skipped_heartbeat.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_skipped_heartbeat.json",
        "title": "symptom_skipped_heartbeat",
        "description": "Skipped heartbeat (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_sleep_changes.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_sleep_changes.json",
        "title": "symptom_sleep_changes",
        "description": "Sleep changes.",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierSleepChanges",
              "values": {
                "present": 0,
                "not_present": 1
              },
              "valueField": "presence",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "presence": {
            "type": "string",
            "enum": [
              "present",
              "not_present"
            ]
          }
        },
        "required": [
          "presence"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "presence": "present"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_sore_throat.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_sore_throat.json",
        "title": "symptom_sore_throat",
        "description": "Sore throat (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_vaginal_dryness.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_vaginal_dryness.json",
        "title": "symptom_vaginal_dryness",
        "description": "Vaginal dryness (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_vomiting.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_vomiting.json",
        "title": "symptom_vomiting",
        "description": "Vomiting (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/symptom_wheezing.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/symptom_wheezing.json",
        "title": "symptom_wheezing",
        "description": "Wheezing (symptom with severity).",
        "x-healthspec": {
          "category": "symptom",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
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
              "valueField": "severity",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "severity": {
            "type": "string",
            "enum": [
              "unspecified",
              "not_present",
              "mild",
              "moderate",
              "severe"
            ]
          }
        },
        "required": [
          "severity"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/time_in_daylight.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/time_in_daylight.json",
        "title": "time_in_daylight",
        "description": "Minutes spent in daylight.",
        "x-healthspec": {
          "category": "environment",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierTimeInDaylight",
              "unit": "min",
              "since": "iOS 17",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "minutes": {
            "type": "number",
            "x-unit": "min",
            "minimum": 0
          }
        },
        "required": [
          "minutes"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "minutes": 45
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/toothbrushing_event.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/toothbrushing_event.json",
        "title": "toothbrushing_event",
        "description": "Toothbrushing session.",
        "x-healthspec": {
          "category": "wellness",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "count",
            "duration"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "category",
              "identifier": "HKCategoryTypeIdentifierToothbrushingEvent",
              "values": {},
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {},
        "additionalProperties": false,
        "examples": [
          {}
        ]
      }
    },
    {
      "file": "spec/schema/types/total_energy.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/total_energy.json",
        "title": "total_energy",
        "description": "Total energy burned during the interval (active + basal).",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
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
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "TotalCaloriesBurnedRecord",
              "permission": "TOTAL_CALORIES_BURNED",
              "field": "energy",
              "unit": "kilocalories",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [
            "HealthKit has no native total-energy type; writes are rejected on iOS with NOT_SUPPORTED."
          ]
        },
        "type": "object",
        "properties": {
          "kilocalories": {
            "type": "number",
            "minimum": 0,
            "x-unit": "kcal"
          }
        },
        "required": [
          "kilocalories"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "kilocalories": 2104
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/underwater_depth.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/underwater_depth.json",
        "title": "underwater_depth",
        "description": "Depth below the water surface.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierUnderwaterDepth",
              "unit": "m",
              "since": "iOS 16",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 12.4
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/uv_exposure.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/uv_exposure.json",
        "title": "uv_exposure",
        "description": "UV index exposure.",
        "x-healthspec": {
          "category": "environment",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierUVExposure",
              "unit": "count",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "uvIndex": {
            "type": "number",
            "x-unit": "UV index",
            "minimum": 0,
            "maximum": 20
          }
        },
        "required": [
          "uvIndex"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "uvIndex": 6
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/vo2_max.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/vo2_max.json",
        "title": "vo2_max",
        "description": "Maximal oxygen consumption estimate.",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierVO2Max",
              "unit": "ml/(kg*min)",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "Vo2MaxRecord",
              "permission": "VO2_MAX",
              "field": "vo2MillilitersPerMinuteKilogram",
              "unit": "mL/kg/min",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": [
            "HealthKit stores the test method in HKMetadataKeyVO2MaxTestType; Health Connect in measurementMethod."
          ]
        },
        "type": "object",
        "properties": {
          "mlPerKgPerMin": {
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "x-unit": "mL/kg/min"
          },
          "measurementMethod": {
            "type": "string",
            "enum": [
              "metabolic_cart",
              "heart_rate_ratio",
              "cooper_test",
              "multistage_fitness_test",
              "rockport_fitness_test",
              "other"
            ],
            "x-platform": "healthconnect"
          }
        },
        "required": [
          "mlPerKgPerMin"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "mlPerKgPerMin": 42.1,
            "measurementMethod": "heart_rate_ratio"
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/waist_circumference.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/waist_circumference.json",
        "title": "waist_circumference",
        "description": "Waist circumference.",
        "x-healthspec": {
          "category": "body",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierWaistCircumference",
              "unit": "m",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0,
            "maximum": 5
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 0.82
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/walking_asymmetry.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/walking_asymmetry.json",
        "title": "walking_asymmetry",
        "description": "Walking asymmetry (percentage of steps where one foot moves faster than the other).",
        "x-healthspec": {
          "category": "mobility",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierWalkingAsymmetryPercentage",
              "unit": "%",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "percent": {
            "type": "number",
            "x-unit": "%",
            "minimum": 0,
            "maximum": 100
          }
        },
        "required": [
          "percent"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "percent": 4
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/walking_double_support.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/walking_double_support.json",
        "title": "walking_double_support",
        "description": "Time with both feet on the ground while walking, percentage.",
        "x-healthspec": {
          "category": "mobility",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierWalkingDoubleSupportPercentage",
              "unit": "%",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "percent": {
            "type": "number",
            "x-unit": "%",
            "minimum": 0,
            "maximum": 100
          }
        },
        "required": [
          "percent"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "percent": 28
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/walking_heart_rate_average.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/walking_heart_rate_average.json",
        "title": "walking_heart_rate_average",
        "description": "Average heart rate while walking.",
        "x-healthspec": {
          "category": "vitals",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": false,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierWalkingHeartRateAverage",
              "unit": "count/min",
              "notes": [
                "HealthKit computes this type; apps can read it but never write it."
              ],
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "bpm": {
            "type": "number",
            "x-unit": "beats/min",
            "minimum": 0,
            "maximum": 300
          }
        },
        "required": [
          "bpm"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "bpm": 98
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/walking_speed.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/walking_speed.json",
        "title": "walking_speed",
        "description": "Walking speed sample.",
        "x-healthspec": {
          "category": "mobility",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierWalkingSpeed",
              "unit": "m/s",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false,
          "counterparts": [
            {
              "type": "speed",
              "platform": "healthconnect",
              "interchangeable": true,
              "reason": "Health Connect keeps a single activity-agnostic SpeedRecord."
            }
          ]
        },
        "type": "object",
        "properties": {
          "metersPerSecond": {
            "type": "number",
            "x-unit": "m/s",
            "minimum": 0
          }
        },
        "required": [
          "metersPerSecond"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "metersPerSecond": 1.3
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/walking_step_length.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/walking_step_length.json",
        "title": "walking_step_length",
        "description": "Walking step length sample.",
        "x-healthspec": {
          "category": "mobility",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierWalkingStepLength",
              "unit": "m",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "meters": {
            "type": "number",
            "x-unit": "m",
            "minimum": 0
          }
        },
        "required": [
          "meters"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "meters": 0.72
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/water_temperature.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/water_temperature.json",
        "title": "water_temperature",
        "description": "Water temperature sample.",
        "x-healthspec": {
          "category": "environment",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierWaterTemperature",
              "unit": "degC",
              "since": "iOS 16",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "celsius": {
            "type": "number",
            "x-unit": "°C",
            "minimum": 0
          }
        },
        "required": [
          "celsius"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "celsius": 21.5
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/weight.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/weight.json",
        "title": "weight",
        "description": "Body mass.",
        "x-healthspec": {
          "category": "body",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierBodyMass",
              "unit": "kg",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "WeightRecord",
              "permission": "WEIGHT",
              "field": "weight",
              "unit": "kilograms",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "openmhealth": {
            "schema": "body-weight"
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "kilograms": {
            "type": "number",
            "exclusiveMinimum": 0,
            "maximum": 1000,
            "x-unit": "kg"
          }
        },
        "required": [
          "kilograms"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "kilograms": 72.4
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/wheelchair_pushes.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/wheelchair_pushes.json",
        "title": "wheelchair_pushes",
        "description": "Wheelchair pushes during the interval.",
        "x-healthspec": {
          "category": "activity",
          "kind": "interval",
          "since": "1.0",
          "aggregate": [
            "sum"
          ],
          "platforms": {
            "healthkit": {
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierPushCount",
              "unit": "count",
              "read": true,
              "write": true,
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            },
            "healthconnect": {
              "record": "WheelchairPushesRecord",
              "permission": "WHEELCHAIR_PUSHES",
              "field": "count",
              "unit": "count",
              "read": true,
              "write": true,
              "verifiedBy": {
                "record": [
                  "react-native-health-connect"
                ]
              }
            }
          },
          "notes": []
        },
        "type": "object",
        "properties": {
          "count": {
            "type": "integer",
            "minimum": 0,
            "x-unit": "count"
          }
        },
        "required": [
          "count"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "count": 540
          }
        ]
      }
    },
    {
      "file": "spec/schema/types/workout_effort_score.json",
      "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://healthspec.dev/schema/types/workout_effort_score.json",
        "title": "workout_effort_score",
        "description": "User-rated workout effort (1–10).",
        "x-healthspec": {
          "category": "activity",
          "kind": "sample",
          "since": "1.0",
          "aggregate": [
            "avg",
            "min",
            "max"
          ],
          "platforms": {
            "healthkit": {
              "read": true,
              "write": true,
              "kind": "quantity",
              "identifier": "HKQuantityTypeIdentifierWorkoutEffortScore",
              "unit": "appleEffortScore",
              "since": "iOS 18",
              "verifiedBy": {
                "identifiers": [
                  "kingstinct-generated"
                ]
              }
            }
          },
          "notes": [],
          "verified": false
        },
        "type": "object",
        "properties": {
          "score": {
            "type": "number",
            "x-unit": "score",
            "minimum": 1,
            "maximum": 10
          }
        },
        "required": [
          "score"
        ],
        "additionalProperties": false,
        "examples": [
          {
            "score": 7
          }
        ]
      }
    }
  ]
};

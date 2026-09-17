# Platform mapping

<!-- GENERATED from spec/schema by `pnpm codegen` — edit the JSON, not this file. -->

182 health types. ◐ marks a type available on only one platform; the other platform reports it as unsupported via `capabilities()`.

## Platform differences

Every type below is part of the spec; what differs is which platform persists it. Check at runtime with
`store.support(type)` — which also reports missing fields and counterparts — or at build time with
`CROSS_PLATFORM_TYPES` / `IOS_ONLY_TYPES` / `ANDROID_ONLY_TYPES` from `@healthspec/schema`.

| Availability | Types |
|---|---:|
| Both platforms | 38 |
| Apple HealthKit only | 129 |
| Android Health Connect only | 15 |
| **Total** | **182** |

### Apple HealthKit only (129)

`activity_summary`, `apple_exercise_time`, `apple_move_time`, `apple_sleeping_breathing_disturbances`, `apple_sleeping_wrist_temperature`, `apple_stand_hour`, `apple_stand_time`, `apple_walking_steadiness`, `apple_walking_steadiness_event`, `atrial_fibrillation_burden`, `basal_energy`, `bleeding_after_pregnancy`, `bleeding_during_pregnancy`, `blood_alcohol_content`, `body_mass_index`, `clinical_coverage`, `clinical_note`, `contraceptive`, `cross_country_skiing_speed`, `cycling_functional_threshold_power`, `cycling_power`, `cycling_speed`, `distance_cross_country_skiing`, `distance_cycling`, `distance_downhill_snow_sports`, `distance_paddle_sports`, `distance_rowing`, `distance_skating_sports`, `distance_swimming`, `distance_wheelchair`, `electrocardiogram`, `electrodermal_activity`, `environmental_audio_exposure`, `environmental_audio_exposure_event`, `environmental_sound_reduction`, `estimated_workout_effort_score`, `forced_expiratory_volume_1`, `forced_vital_capacity`, `handwashing_event`, `headphone_audio_exposure`, `headphone_audio_exposure_event`, `heart_rate_recovery_one_minute`, `heartbeat_series`, `high_heart_rate_event`, `hrv_sdnn`, `infrequent_menstrual_cycles`, `inhaler_usage`, `insulin_delivery`, `irregular_heart_rhythm_event`, `irregular_menstrual_cycles`, `lactation`, `low_cardio_fitness_event`, `low_heart_rate_event`, `medication_dose`, `nike_fuel`, `number_of_alcoholic_beverages`, `number_of_times_fallen`, `paddle_sports_speed`, `peak_expiratory_flow_rate`, `peripheral_perfusion_index`, `persistent_intermenstrual_bleeding`, `physical_effort`, `pregnancy`, `pregnancy_test`, `progesterone_test`, `prolonged_menstrual_periods`, `rowing_speed`, `running_ground_contact_time`, `running_power`, `running_speed`, `running_stride_length`, `running_vertical_oscillation`, `six_minute_walk_distance`, `sleep_apnea_event`, `stair_ascent_speed`, `stair_descent_speed`, `state_of_mind`, `swimming_stroke_count`, `symptom_abdominal_cramps`, `symptom_acne`, `symptom_appetite_changes`, `symptom_bladder_incontinence`, `symptom_bloating`, `symptom_breast_pain`, `symptom_chest_tightness_or_pain`, `symptom_chills`, `symptom_constipation`, `symptom_coughing`, `symptom_diarrhea`, `symptom_dizziness`, `symptom_dry_skin`, `symptom_fainting`, `symptom_fatigue`, `symptom_fever`, `symptom_generalized_body_ache`, `symptom_hair_loss`, `symptom_headache`, `symptom_heartburn`, `symptom_hot_flashes`, `symptom_loss_of_smell`, `symptom_loss_of_taste`, `symptom_lower_back_pain`, `symptom_memory_lapse`, `symptom_mood_changes`, `symptom_nausea`, `symptom_night_sweats`, `symptom_pelvic_pain`, `symptom_rapid_pounding_or_fluttering_heartbeat`, `symptom_runny_nose`, `symptom_shortness_of_breath`, `symptom_sinus_congestion`, `symptom_skipped_heartbeat`, `symptom_sleep_changes`, `symptom_sore_throat`, `symptom_vaginal_dryness`, `symptom_vomiting`, `symptom_wheezing`, `time_in_daylight`, `toothbrushing_event`, `underwater_depth`, `uv_exposure`, `waist_circumference`, `walking_asymmetry`, `walking_double_support`, `walking_heart_rate_average`, `walking_speed`, `walking_step_length`, `water_temperature`, `workout_effort_score`

### Android Health Connect only (15)

`basal_metabolic_rate`, `body_water_mass`, `bone_mass`, `clinical_personal_details`, `clinical_practitioner_details`, `clinical_pregnancy`, `clinical_social_history`, `clinical_visit`, `elevation_gained`, `hrv_rmssd`, `menstruation_period`, `power`, `skin_temperature`, `speed`, `steps_cadence`

### Fields absent on one platform

These types exist on both platforms, but the listed value fields are never populated there.
`store.support(type).missingFields` returns the same list at runtime.

| Type | Absent on iOS | Absent on Android |
|---|---|---|
| `blood_glucose` | `specimenSource`, `relationToMeal` | — |
| `blood_pressure` | `bodyPosition`, `measurementLocation` | — |
| `body_temperature` | `measurementLocation` | — |
| `cervical_mucus` | `sensation` | — |
| `exercise_session` | `title`, `notes` | — |
| `menstruation_flow` | — | `cycleStart` |
| `mindfulness_session` | `title`, `notes` | — |
| `nutrition` | `energyFromFatKilocalories`, `transFatGrams`, `unsaturatedFatGrams`, `folicAcidMicrograms` | — |
| `sleep_session` | `title`, `notes` | — |
| `vo2_max` | `measurementMethod` | — |

### Counterparts

The nearest type on the other platform. **Interchangeable = no** means the two measure different things —
their values must never be converted into each other or summed together. A `NOT_SUPPORTED` error names the
counterpart, and `store.support(type).counterparts` returns this table at runtime.

| Type | Counterpart | Interchangeable | Why |
|---|---|---|---|
| `apple_sleeping_wrist_temperature` | `skin_temperature` | **no** | HealthKit stores an absolute temperature; Health Connect stores a delta from the user baseline. |
| `basal_energy` | `basal_metabolic_rate` | **no** | basal_energy is energy accumulated over an interval (kcal); basal_metabolic_rate is a rate (kcal/day). Converting needs the interval length and assumes a constant rate. |
| `basal_metabolic_rate` | `basal_energy` | **no** | A rate (kcal/day) cannot be compared with interval energy (kcal) without assuming the rate held for the whole interval. |
| `cycling_cadence` | `steps_cadence` | **no** | Pedalling cadence (rpm) and step cadence (steps/min) measure different motions. |
| `cycling_power` | `power` | yes | Health Connect keeps a single activity-agnostic PowerRecord. |
| `cycling_speed` | `speed` | yes | Health Connect keeps a single activity-agnostic SpeedRecord. |
| `distance` | `distance_cycling` | **no** | HealthKit splits distance by activity and `distance` maps to walking/running only; summing both double-counts. |
| `distance` | `distance_swimming` | **no** | HealthKit splits distance by activity and `distance` maps to walking/running only; summing both double-counts. |
| `distance` | `distance_wheelchair` | **no** | HealthKit splits distance by activity and `distance` maps to walking/running only; summing both double-counts. |
| `distance_cycling` | `distance` | **no** | Health Connect has one DistanceRecord for every activity; it already includes cycling distance. |
| `distance_swimming` | `distance` | **no** | Health Connect has one DistanceRecord for every activity; it already includes swimming distance. |
| `distance_wheelchair` | `distance` | **no** | Health Connect has one DistanceRecord for every activity; it already includes wheelchair distance. |
| `elevation_gained` | `floors_climbed` | **no** | HealthKit records flights climbed, not metres gained; a flight is a fixed approximation. |
| `hrv_rmssd` | `hrv_sdnn` | **no** | RMSSD and SDNN are different statistics computed from the same intervals; neither can be derived from the other. |
| `hrv_sdnn` | `hrv_rmssd` | **no** | SDNN and RMSSD are different statistics computed from the same intervals; neither can be derived from the other. |
| `menstruation_period` | `menstruation_flow` | **no** | HealthKit has no period record; derive periods by grouping menstruation_flow entries whose cycleStart is true. |
| `power` | `cycling_power` | yes | HealthKit splits power by activity; use cycling_power for cycling sessions. |
| `power` | `running_power` | yes | HealthKit splits power by activity; use running_power for running sessions. |
| `running_power` | `power` | yes | Health Connect keeps a single activity-agnostic PowerRecord. |
| `running_speed` | `speed` | yes | Health Connect keeps a single activity-agnostic SpeedRecord. |
| `skin_temperature` | `apple_sleeping_wrist_temperature` | **no** | Health Connect stores a delta from the user baseline; HealthKit stores an absolute nightly wrist temperature. |
| `speed` | `walking_speed` | yes | HealthKit splits speed by activity. |
| `speed` | `running_speed` | yes | HealthKit splits speed by activity. |
| `speed` | `cycling_speed` | yes | HealthKit splits speed by activity. |
| `steps_cadence` | `cycling_cadence` | **no** | Step cadence (steps/min) and pedalling cadence (rpm) measure different motions. |
| `walking_speed` | `speed` | yes | Health Connect keeps a single activity-agnostic SpeedRecord. |

## Type mapping

| Type | Category | Kind | HealthKit | Health Connect | Canonical units | Notes |
|---|---|---|---|---|---|---|
| `active_energy` | activity | interval | `ActiveEnergyBurned` · `kcal` | `ActiveCaloriesBurnedRecord` · energy · `kilocalories` | kilocalories: kcal |  |
| `activity_summary` ◐ | activity | interval | `HKActivitySummaryTypeIdentifier` · read-only | — | activeEnergyKilocalories: kcal<br>activeEnergyGoalKilocalories: kcal<br>exerciseMinutes: min<br>exerciseGoalMinutes: min<br>standHours: count<br>standGoalHours: count<br>moveMinutes: min<br>moveGoalMinutes: min |  |
| `apple_exercise_time` ◐ | activity | interval | `AppleExerciseTime` · `min` · read-only | — | minutes: min | HK: HealthKit computes this type; apps can read it but never write it. |
| `apple_move_time` ◐ | activity | interval | `AppleMoveTime` · `min` · read-only | — | minutes: min | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `apple_sleeping_breathing_disturbances` ◐ | vitals | sample | `AppleSleepingBreathingDisturbances` · `count` · read-only | — | count: count | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `apple_sleeping_wrist_temperature` ◐ | vitals | sample | `AppleSleepingWristTemperature` · `degC` · read-only | — | celsius: °C | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `apple_stand_hour` ◐ | activity | interval | `AppleStandHour` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `apple_stand_time` ◐ | activity | interval | `AppleStandTime` · `min` · read-only | — | minutes: min | HK: HealthKit computes this type; apps can read it but never write it. |
| `apple_walking_steadiness` ◐ | mobility | sample | `AppleWalkingSteadiness` · `%` · read-only | — | percent: % | HK: HealthKit computes this type; apps can read it but never write it. |
| `apple_walking_steadiness_event` ◐ | mobility | interval | `AppleWalkingSteadinessEvent` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `atrial_fibrillation_burden` ◐ | vitals | sample | `AtrialFibrillationBurden` · `%` · read-only | — | percent: % | HK: HealthKit computes this type; apps can read it but never write it. |
| `basal_body_temperature` | cycle | sample | `BasalBodyTemperature` · `degC` | `BasalBodyTemperatureRecord` · temperature · `celsius` | celsius: °C |  |
| `basal_energy` ◐ | activity | interval | `BasalEnergyBurned` · `kcal` | — | kilocalories: kcal |  |
| `basal_metabolic_rate` ◐ | body | sample | — | `BasalMetabolicRateRecord` · basalMetabolicRate · `kilocaloriesPerDay` | kilocaloriesPerDay: kcal/day |  |
| `bleeding_after_pregnancy` ◐ | cycle | interval | `BleedingAfterPregnancy` | — | — |  |
| `bleeding_during_pregnancy` ◐ | cycle | interval | `BleedingDuringPregnancy` | — | — |  |
| `blood_alcohol_content` ◐ | vitals | sample | `BloodAlcoholContent` · `%` | — | percent: % |  |
| `blood_glucose` | vitals | sample | `BloodGlucose` · `mmol<180.1558800000541>/L` | `BloodGlucoseRecord` · level · `millimolesPerLiter` | millimolesPerLiter: mmol/L | HK: Read with HKUnit.moleUnit(with: .milli, molarMass: HKUnitMolarMassBloodGlucose).unitDivided(by: .liter()). Meal relation from HKMetadataKeyBloodGlucoseMealTime. |
| `blood_pressure` | vitals | sample | `BloodPressure`<br>`BloodPressureSystolic`<br>`BloodPressureDiastolic` · `mmHg` | `BloodPressureRecord` · systolicMmHg → systolic, diastolicMmHg → diastolic · `millimetersOfMercury` | systolicMmHg: mmHg<br>diastolicMmHg: mmHg | HK: Authorization is requested for both quantity types; reads use the correlation so the pair stays together. |
| `body_fat` | body | sample | `BodyFatPercentage` · `%` | `BodyFatRecord` · percentage · `percent` | percent: % | HK: HKUnit.percent() is a fraction (0.21 = 21%); multiply by 100. |
| `body_mass_index` ◐ | body | sample | `BodyMassIndex` · `count` | — | value: kg/m² |  |
| `body_temperature` | vitals | sample | `BodyTemperature` · `degC` | `BodyTemperatureRecord` · temperature · `celsius` | celsius: °C | HK: Measurement location from HKMetadataKeyBodyTemperatureSensorLocation. |
| `body_water_mass` ◐ | body | sample | — | `BodyWaterMassRecord` · mass · `kilograms` | kilograms: kg |  |
| `bone_mass` ◐ | body | sample | — | `BoneMassRecord` · mass · `kilograms` | kilograms: kg |  |
| `cervical_mucus` | cycle | sample | `CervicalMucusQuality` | `CervicalMucusRecord` · appearance → appearance, sensation → sensation | — | HK: HealthKit records appearance only; sensation is Health Connect only. |
| `clinical_allergy` | clinical | interval | `HKClinicalTypeIdentifierAllergyRecord` · read-only | `MedicalResource` | — |  |
| `clinical_condition` | clinical | interval | `HKClinicalTypeIdentifierConditionRecord` · read-only | `MedicalResource` | — |  |
| `clinical_coverage` ◐ | clinical | interval | `HKClinicalTypeIdentifierCoverageRecord` · read-only | — | — |  |
| `clinical_immunization` | clinical | interval | `HKClinicalTypeIdentifierImmunizationRecord` · read-only | `MedicalResource` | — |  |
| `clinical_lab_result` | clinical | interval | `HKClinicalTypeIdentifierLabResultRecord` · read-only | `MedicalResource` | — |  |
| `clinical_medication` | clinical | interval | `HKClinicalTypeIdentifierMedicationRecord` · read-only | `MedicalResource` | — |  |
| `clinical_note` ◐ | clinical | interval | `HKClinicalTypeIdentifierClinicalNoteRecord` · read-only | — | — | HK: Identifier taken from Apple documentation only — no cross-checkable source declares it (iOS 16+). Confirm against the SDK before relying on it. |
| `clinical_personal_details` ◐ | clinical | interval | — | `MedicalResource` | — |  |
| `clinical_practitioner_details` ◐ | clinical | interval | — | `MedicalResource` | — |  |
| `clinical_pregnancy` ◐ | clinical | interval | — | `MedicalResource` | — |  |
| `clinical_procedure` | clinical | interval | `HKClinicalTypeIdentifierProcedureRecord` · read-only | `MedicalResource` | — |  |
| `clinical_social_history` ◐ | clinical | interval | — | `MedicalResource` | — |  |
| `clinical_visit` ◐ | clinical | interval | — | `MedicalResource` | — |  |
| `clinical_vital_sign` | clinical | interval | `HKClinicalTypeIdentifierVitalSignRecord` · read-only | `MedicalResource` | — |  |
| `contraceptive` ◐ | cycle | interval | `Contraceptive` | — | — |  |
| `cross_country_skiing_speed` ◐ | activity | sample | `CrossCountrySkiingSpeed` · `m/s` | — | metersPerSecond: m/s |  |
| `cycling_cadence` | activity | sample | `CyclingCadence` · `count/min` | `CyclingPedalingCadenceRecord` · samples[].revolutionsPerMinute · `rpm` · series | rpm: rpm |  |
| `cycling_functional_threshold_power` ◐ | activity | sample | `CyclingFunctionalThresholdPower` · `W` | — | watts: W |  |
| `cycling_power` ◐ | activity | sample | `CyclingPower` · `W` | — | watts: W |  |
| `cycling_speed` ◐ | activity | sample | `CyclingSpeed` · `m/s` | — | metersPerSecond: m/s |  |
| `distance` | activity | interval | `DistanceWalkingRunning` · `m` | `DistanceRecord` · distance · `meters` | meters: m | HealthKit splits distance by activity (distanceCycling, distanceSwimming, distanceWheelchair, distanceDownhillSnowSports); v1 maps walking/running only. Health Connect has a single DistanceRecord regardless of activity. |
| `distance_cross_country_skiing` ◐ | activity | interval | `DistanceCrossCountrySkiing` · `m` | — | meters: m |  |
| `distance_cycling` ◐ | activity | interval | `DistanceCycling` · `m` | — | meters: m |  |
| `distance_downhill_snow_sports` ◐ | activity | interval | `DistanceDownhillSnowSports` · `m` | — | meters: m |  |
| `distance_paddle_sports` ◐ | activity | interval | `DistancePaddleSports` · `m` | — | meters: m |  |
| `distance_rowing` ◐ | activity | interval | `DistanceRowing` · `m` | — | meters: m |  |
| `distance_skating_sports` ◐ | activity | interval | `DistanceSkatingSports` · `m` | — | meters: m |  |
| `distance_swimming` ◐ | activity | interval | `DistanceSwimming` · `m` | — | meters: m |  |
| `distance_wheelchair` ◐ | activity | interval | `DistanceWheelchair` · `m` | — | meters: m |  |
| `electrocardiogram` ◐ | vitals | interval | `HKDataTypeIdentifierElectrocardiogram` · read-only | — | averageBpm: beats/min<br>samplingFrequencyHz: Hz<br>voltageCount: count |  |
| `electrodermal_activity` ◐ | vitals | sample | `ElectrodermalActivity` · `mcS` | — | microsiemens: µS |  |
| `elevation_gained` ◐ | activity | interval | — | `ElevationGainedRecord` · elevation · `meters` | meters: m |  |
| `environmental_audio_exposure` ◐ | environment | sample | `EnvironmentalAudioExposure` · `dBASPL` | — | decibels: dB(A) |  |
| `environmental_audio_exposure_event` ◐ | environment | interval | `AudioExposureEvent` · read-only | — | — | HK: Apple renamed the Swift case to `environmentalAudioExposureEvent` in iOS 14 but kept the raw value `HKCategoryTypeIdentifierAudioExposureEvent`. Verified at runtime — the renamed string does not resolve. HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `environmental_sound_reduction` ◐ | environment | sample | `EnvironmentalSoundReduction` · `dBASPL` | — | decibels: dB(A) |  |
| `estimated_workout_effort_score` ◐ | activity | sample | `EstimatedWorkoutEffortScore` · `appleEffortScore` | — | score: score |  |
| `exercise_route` | activity | interval | `HKWorkoutRouteTypeIdentifier` | `ExerciseRoute` | — | HK: HKSeriesType.workoutRoute(); points arrive as CLLocation batches. HC: Read consent is per session via requestExerciseRoute (no READ permission exists); WRITE_EXERCISE_ROUTE covers writes. |
| `exercise_session` | activity | session | `` | `ExerciseSessionRecord` · exerciseType | — | Activity type mapping lives in enums/exercise_type.json (draft, to be verified in Phase 1). Segments, laps and routes are out of scope for v1. |
| `floors_climbed` | activity | interval | `FlightsClimbed` · `count` | `FloorsClimbedRecord` · floors · `count` | count: count |  |
| `forced_expiratory_volume_1` ◐ | respiratory | sample | `ForcedExpiratoryVolume1` · `L` | — | liters: L |  |
| `forced_vital_capacity` ◐ | respiratory | sample | `ForcedVitalCapacity` · `L` | — | liters: L |  |
| `handwashing_event` ◐ | wellness | interval | `HandwashingEvent` | — | — |  |
| `headphone_audio_exposure` ◐ | environment | sample | `HeadphoneAudioExposure` · `dBASPL` | — | decibels: dB(A) |  |
| `headphone_audio_exposure_event` ◐ | environment | interval | `HeadphoneAudioExposureEvent` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `heart_rate` | vitals | sample | `HeartRate` · `count/min` | `HeartRateRecord` · samples[].beatsPerMinute · `bpm` · series | bpm: beats/min | Health Connect stores a series of samples per record; providers flatten each sample into its own point record whose id is `<recordId>#<index>`. |
| `heart_rate_recovery_one_minute` ◐ | vitals | sample | `HeartRateRecoveryOneMinute` · `count/min` | — | bpm: beats/min |  |
| `heartbeat_series` ◐ | vitals | interval | `HKDataTypeIdentifierHeartbeatSeries` · read-only | — | count: count |  |
| `height` | body | sample | `Height` · `m` | `HeightRecord` · height · `meters` | meters: m |  |
| `high_heart_rate_event` ◐ | vitals | interval | `HighHeartRateEvent` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `hrv_rmssd` ◐ | vitals | sample | — | `HeartRateVariabilityRmssdRecord` · heartRateVariabilityMillis · `ms` | milliseconds: ms | SDNN and RMSSD are different statistics and MUST NOT be converted into each other. See hrv_sdnn for HealthKit. |
| `hrv_sdnn` ◐ | vitals | sample | `HeartRateVariabilitySDNN` · `ms` | — | milliseconds: ms | SDNN and RMSSD are different statistics and MUST NOT be converted into each other. See hrv_rmssd for Health Connect. |
| `hydration` | nutrition | interval | `DietaryWater` · `L` | `HydrationRecord` · volume · `liters` | liters: L |  |
| `infrequent_menstrual_cycles` ◐ | cycle | interval | `InfrequentMenstrualCycles` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `inhaler_usage` ◐ | respiratory | interval | `InhalerUsage` · `count` | — | count: count |  |
| `insulin_delivery` ◐ | vitals | interval | `InsulinDelivery` · `IU` | — | internationalUnits: IU |  |
| `intermenstrual_bleeding` | cycle | sample | `IntermenstrualBleeding` | `IntermenstrualBleedingRecord` | — |  |
| `irregular_heart_rhythm_event` ◐ | vitals | interval | `IrregularHeartRhythmEvent` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `irregular_menstrual_cycles` ◐ | cycle | interval | `IrregularMenstrualCycles` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `lactation` ◐ | cycle | interval | `Lactation` | — | — |  |
| `lean_body_mass` | body | sample | `LeanBodyMass` · `kg` | `LeanBodyMassRecord` · mass · `kilograms` | kilograms: kg |  |
| `low_cardio_fitness_event` ◐ | vitals | interval | `LowCardioFitnessEvent` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `low_heart_rate_event` ◐ | vitals | interval | `LowHeartRateEvent` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `medication_dose` ◐ | clinical | sample | `HKDataTypeIdentifierMedicationDoseEvent` · read-only | — | scheduledDose: dose<br>dose: dose |  |
| `menstruation_flow` | cycle | interval | `MenstrualFlow` | `MenstruationFlowRecord` · flow | — | HC: Health Connect has no "none" flow; it is written as FLOW_UNKNOWN. HC: MenstruationFlowRecord is instantaneous: Health Connect keeps only start, so end reads back equal to start. |
| `menstruation_period` ◐ | cycle | interval | — | `MenstruationPeriodRecord` | — |  |
| `mindfulness_session` | wellness | session | `MindfulSession` | `MindfulnessSessionRecord` · mindfulnessSessionType | — |  |
| `nike_fuel` ◐ | activity | interval | `NikeFuel` · `count` | — | count: count |  |
| `number_of_alcoholic_beverages` ◐ | nutrition | interval | `NumberOfAlcoholicBeverages` · `count` | — | count: count |  |
| `number_of_times_fallen` ◐ | mobility | interval | `NumberOfTimesFallen` · `count` | — | count: count |  |
| `nutrition` | nutrition | interval | `kilocalories → HKQuantityTypeIdentifierDietaryEnergyConsumed`<br>`proteinGrams → HKQuantityTypeIdentifierDietaryProtein`<br>`carbohydrateGrams → HKQuantityTypeIdentifierDietaryCarbohydrates`<br>`fatGrams → HKQuantityTypeIdentifierDietaryFatTotal`<br>`fatSaturatedGrams → HKQuantityTypeIdentifierDietaryFatSaturated`<br>`fatMonounsaturatedGrams → HKQuantityTypeIdentifierDietaryFatMonounsaturated`<br>`fatPolyunsaturatedGrams → HKQuantityTypeIdentifierDietaryFatPolyunsaturated`<br>`fiberGrams → HKQuantityTypeIdentifierDietaryFiber`<br>`sugarGrams → HKQuantityTypeIdentifierDietarySugar`<br>`cholesterolMilligrams → HKQuantityTypeIdentifierDietaryCholesterol`<br>`sodiumMilligrams → HKQuantityTypeIdentifierDietarySodium`<br>`potassiumMilligrams → HKQuantityTypeIdentifierDietaryPotassium`<br>`calciumMilligrams → HKQuantityTypeIdentifierDietaryCalcium`<br>`ironMilligrams → HKQuantityTypeIdentifierDietaryIron`<br>`magnesiumMilligrams → HKQuantityTypeIdentifierDietaryMagnesium`<br>`phosphorusMilligrams → HKQuantityTypeIdentifierDietaryPhosphorus`<br>`zincMilligrams → HKQuantityTypeIdentifierDietaryZinc`<br>`copperMilligrams → HKQuantityTypeIdentifierDietaryCopper`<br>`manganeseMilligrams → HKQuantityTypeIdentifierDietaryManganese`<br>`chlorideMilligrams → HKQuantityTypeIdentifierDietaryChloride`<br>`seleniumMicrograms → HKQuantityTypeIdentifierDietarySelenium`<br>`iodineMicrograms → HKQuantityTypeIdentifierDietaryIodine`<br>`chromiumMicrograms → HKQuantityTypeIdentifierDietaryChromium`<br>`molybdenumMicrograms → HKQuantityTypeIdentifierDietaryMolybdenum`<br>`vitaminAMicrograms → HKQuantityTypeIdentifierDietaryVitaminA`<br>`vitaminB6Milligrams → HKQuantityTypeIdentifierDietaryVitaminB6`<br>`vitaminB12Micrograms → HKQuantityTypeIdentifierDietaryVitaminB12`<br>`vitaminCMilligrams → HKQuantityTypeIdentifierDietaryVitaminC`<br>`vitaminDMicrograms → HKQuantityTypeIdentifierDietaryVitaminD`<br>`vitaminEMilligrams → HKQuantityTypeIdentifierDietaryVitaminE`<br>`vitaminKMicrograms → HKQuantityTypeIdentifierDietaryVitaminK`<br>`thiaminMilligrams → HKQuantityTypeIdentifierDietaryThiamin`<br>`riboflavinMilligrams → HKQuantityTypeIdentifierDietaryRiboflavin`<br>`niacinMilligrams → HKQuantityTypeIdentifierDietaryNiacin`<br>`folateMicrograms → HKQuantityTypeIdentifierDietaryFolate`<br>`biotinMicrograms → HKQuantityTypeIdentifierDietaryBiotin`<br>`pantothenicAcidMilligrams → HKQuantityTypeIdentifierDietaryPantothenicAcid`<br>`caffeineMilligrams → HKQuantityTypeIdentifierDietaryCaffeine` | `NutritionRecord` · kilocalories → energy, energyFromFatKilocalories → energyFromFat, proteinGrams → protein, carbohydrateGrams → totalCarbohydrate, fatGrams → totalFat, fatSaturatedGrams → saturatedFat, fatMonounsaturatedGrams → monounsaturatedFat, fatPolyunsaturatedGrams → polyunsaturatedFat, transFatGrams → transFat, unsaturatedFatGrams → unsaturatedFat, fiberGrams → dietaryFiber, sugarGrams → sugar, cholesterolMilligrams → cholesterol, sodiumMilligrams → sodium, potassiumMilligrams → potassium, calciumMilligrams → calcium, ironMilligrams → iron, magnesiumMilligrams → magnesium, phosphorusMilligrams → phosphorus, zincMilligrams → zinc, copperMilligrams → copper, manganeseMilligrams → manganese, chlorideMilligrams → chloride, seleniumMicrograms → selenium, iodineMicrograms → iodine, chromiumMicrograms → chromium, molybdenumMicrograms → molybdenum, vitaminAMicrograms → vitaminA, vitaminB6Milligrams → vitaminB6, vitaminB12Micrograms → vitaminB12, vitaminCMilligrams → vitaminC, vitaminDMicrograms → vitaminD, vitaminEMilligrams → vitaminE, vitaminKMicrograms → vitaminK, thiaminMilligrams → thiamin, riboflavinMilligrams → riboflavin, niacinMilligrams → niacin, folateMicrograms → folate, folicAcidMicrograms → folicAcid, biotinMicrograms → biotin, pantothenicAcidMilligrams → pantothenicAcid, caffeineMilligrams → caffeine | kilocalories: kcal<br>energyFromFatKilocalories: kcal<br>proteinGrams: g<br>carbohydrateGrams: g<br>fatGrams: g<br>fatSaturatedGrams: g<br>fatMonounsaturatedGrams: g<br>fatPolyunsaturatedGrams: g<br>transFatGrams: g<br>unsaturatedFatGrams: g<br>fiberGrams: g<br>sugarGrams: g<br>cholesterolMilligrams: mg<br>sodiumMilligrams: mg<br>potassiumMilligrams: mg<br>calciumMilligrams: mg<br>ironMilligrams: mg<br>magnesiumMilligrams: mg<br>phosphorusMilligrams: mg<br>zincMilligrams: mg<br>copperMilligrams: mg<br>manganeseMilligrams: mg<br>chlorideMilligrams: mg<br>seleniumMicrograms: mcg<br>iodineMicrograms: mcg<br>chromiumMicrograms: mcg<br>molybdenumMicrograms: mcg<br>vitaminAMicrograms: mcg<br>vitaminB6Milligrams: mg<br>vitaminB12Micrograms: mcg<br>vitaminCMilligrams: mg<br>vitaminDMicrograms: mcg<br>vitaminEMilligrams: mg<br>vitaminKMicrograms: mcg<br>thiaminMilligrams: mg<br>riboflavinMilligrams: mg<br>niacinMilligrams: mg<br>folateMicrograms: mcg<br>folicAcidMicrograms: mcg<br>biotinMicrograms: mcg<br>pantothenicAcidMilligrams: mg<br>caffeineMilligrams: mg | The two platforms are structural opposites (many samples vs one record); the spec models the Health Connect shape and HealthKit providers group/ungroup. HK: No single nutrition object: one quantity sample per nutrient, grouped in an HKCorrelationTypeIdentifierFood correlation on write and when reading. HK: HKUnit strings: kcal, g, mg, mcg. |
| `ovulation_test` | cycle | sample | `OvulationTestResult` | `OvulationTestRecord` · result | — | HK: HealthKit: positive = luteinizingHormoneSurge, high = estrogenSurge, inconclusive = indeterminate. |
| `oxygen_saturation` | vitals | sample | `OxygenSaturation` · `%` | `OxygenSaturationRecord` · percentage · `percent` | percent: % | HK: HKUnit.percent() is a fraction (0.97 = 97%); multiply by 100. |
| `paddle_sports_speed` ◐ | activity | sample | `PaddleSportsSpeed` · `m/s` | — | metersPerSecond: m/s |  |
| `peak_expiratory_flow_rate` ◐ | respiratory | sample | `PeakExpiratoryFlowRate` · `L/min` | — | litersPerMinute: L/min |  |
| `peripheral_perfusion_index` ◐ | vitals | sample | `PeripheralPerfusionIndex` · `%` | — | percent: % |  |
| `persistent_intermenstrual_bleeding` ◐ | cycle | interval | `PersistentIntermenstrualBleeding` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `physical_effort` ◐ | activity | sample | `PhysicalEffort` · `kcal/(kg*hr)` | — | metsEquivalent: kcal/(kg·h) |  |
| `power` ◐ | activity | sample | — | `PowerRecord` · samples[].power · `watts` · series | watts: W |  |
| `pregnancy` ◐ | cycle | interval | `Pregnancy` | — | — |  |
| `pregnancy_test` ◐ | cycle | sample | `PregnancyTestResult` | — | — |  |
| `progesterone_test` ◐ | cycle | sample | `ProgesteroneTestResult` | — | — |  |
| `prolonged_menstrual_periods` ◐ | cycle | interval | `ProlongedMenstrualPeriods` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `respiratory_rate` | vitals | sample | `RespiratoryRate` · `count/min` | `RespiratoryRateRecord` · rate · `breaths/min` | breathsPerMinute: breaths/min |  |
| `resting_heart_rate` | vitals | sample | `RestingHeartRate` · `count/min` | `RestingHeartRateRecord` · beatsPerMinute · `bpm` | bpm: beats/min |  |
| `rowing_speed` ◐ | activity | sample | `RowingSpeed` · `m/s` | — | metersPerSecond: m/s |  |
| `running_ground_contact_time` ◐ | activity | sample | `RunningGroundContactTime` · `ms` | — | milliseconds: ms |  |
| `running_power` ◐ | activity | sample | `RunningPower` · `W` | — | watts: W |  |
| `running_speed` ◐ | activity | sample | `RunningSpeed` · `m/s` | — | metersPerSecond: m/s |  |
| `running_stride_length` ◐ | activity | sample | `RunningStrideLength` · `m` | — | meters: m |  |
| `running_vertical_oscillation` ◐ | activity | sample | `RunningVerticalOscillation` · `cm` | — | centimeters: cm |  |
| `sexual_activity` | cycle | sample | `SexualActivity` | `SexualActivityRecord` · protectionUsed | — |  |
| `six_minute_walk_distance` ◐ | mobility | sample | `SixMinuteWalkTestDistance` · `m` | — | meters: m |  |
| `skin_temperature` ◐ | vitals | sample | — | `SkinTemperatureRecord` · deltas[].delta · `celsius (delta)` · series | deltaCelsius: °C<br>baselineCelsius: °C | HealthKit's HKQuantityTypeIdentifierAppleSleepingWristTemperature is an absolute nightly value, not a delta — a candidate for a separate v1.1 type, not a mapping of this one. Each delta in the Health Connect series becomes its own point record. |
| `sleep_apnea_event` ◐ | sleep | interval | `SleepApneaEvent` · read-only | — | — | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `sleep_session` | sleep | session | `SleepAnalysis` | `SleepSessionRecord` · stages[] | — | Stage mapping lives in enums/sleep_stage.json. HK: HealthKit has no session object: each stage is a separate category sample. Providers derive sessions by grouping consecutive samples from the same source with gaps ≤ 60 minutes; the session id is the first sample's UUID. |
| `speed` ◐ | activity | sample | — | `SpeedRecord` · samples[].speed · `metersPerSecond` · series | metersPerSecond: m/s |  |
| `stair_ascent_speed` ◐ | mobility | sample | `StairAscentSpeed` · `m/s` | — | metersPerSecond: m/s |  |
| `stair_descent_speed` ◐ | mobility | sample | `StairDescentSpeed` · `m/s` | — | metersPerSecond: m/s |  |
| `state_of_mind` ◐ | mind | sample | `HKDataTypeIdentifierStateOfMind` | — | valence: valence |  |
| `steps` | activity | interval | `StepCount` · `count` | `StepsRecord` · count · `count` | count: count |  |
| `steps_cadence` ◐ | activity | sample | — | `StepsCadenceRecord` · samples[].rate · `steps/min` · series | stepsPerMinute: steps/min |  |
| `swimming_stroke_count` ◐ | activity | interval | `SwimmingStrokeCount` · `count` | — | count: count |  |
| `symptom_abdominal_cramps` ◐ | symptom | interval | `AbdominalCramps` | — | — |  |
| `symptom_acne` ◐ | symptom | interval | `Acne` | — | — |  |
| `symptom_appetite_changes` ◐ | symptom | interval | `AppetiteChanges` | — | — |  |
| `symptom_bladder_incontinence` ◐ | symptom | interval | `BladderIncontinence` | — | — |  |
| `symptom_bloating` ◐ | symptom | interval | `Bloating` | — | — |  |
| `symptom_breast_pain` ◐ | symptom | interval | `BreastPain` | — | — |  |
| `symptom_chest_tightness_or_pain` ◐ | symptom | interval | `ChestTightnessOrPain` | — | — |  |
| `symptom_chills` ◐ | symptom | interval | `Chills` | — | — |  |
| `symptom_constipation` ◐ | symptom | interval | `Constipation` | — | — |  |
| `symptom_coughing` ◐ | symptom | interval | `Coughing` | — | — |  |
| `symptom_diarrhea` ◐ | symptom | interval | `Diarrhea` | — | — |  |
| `symptom_dizziness` ◐ | symptom | interval | `Dizziness` | — | — |  |
| `symptom_dry_skin` ◐ | symptom | interval | `DrySkin` | — | — |  |
| `symptom_fainting` ◐ | symptom | interval | `Fainting` | — | — |  |
| `symptom_fatigue` ◐ | symptom | interval | `Fatigue` | — | — |  |
| `symptom_fever` ◐ | symptom | interval | `Fever` | — | — |  |
| `symptom_generalized_body_ache` ◐ | symptom | interval | `GeneralizedBodyAche` | — | — |  |
| `symptom_hair_loss` ◐ | symptom | interval | `HairLoss` | — | — |  |
| `symptom_headache` ◐ | symptom | interval | `Headache` | — | — |  |
| `symptom_heartburn` ◐ | symptom | interval | `Heartburn` | — | — |  |
| `symptom_hot_flashes` ◐ | symptom | interval | `HotFlashes` | — | — |  |
| `symptom_loss_of_smell` ◐ | symptom | interval | `LossOfSmell` | — | — |  |
| `symptom_loss_of_taste` ◐ | symptom | interval | `LossOfTaste` | — | — |  |
| `symptom_lower_back_pain` ◐ | symptom | interval | `LowerBackPain` | — | — |  |
| `symptom_memory_lapse` ◐ | symptom | interval | `MemoryLapse` | — | — |  |
| `symptom_mood_changes` ◐ | symptom | interval | `MoodChanges` | — | — |  |
| `symptom_nausea` ◐ | symptom | interval | `Nausea` | — | — |  |
| `symptom_night_sweats` ◐ | symptom | interval | `NightSweats` | — | — |  |
| `symptom_pelvic_pain` ◐ | symptom | interval | `PelvicPain` | — | — |  |
| `symptom_rapid_pounding_or_fluttering_heartbeat` ◐ | symptom | interval | `RapidPoundingOrFlutteringHeartbeat` | — | — |  |
| `symptom_runny_nose` ◐ | symptom | interval | `RunnyNose` | — | — |  |
| `symptom_shortness_of_breath` ◐ | symptom | interval | `ShortnessOfBreath` | — | — |  |
| `symptom_sinus_congestion` ◐ | symptom | interval | `SinusCongestion` | — | — |  |
| `symptom_skipped_heartbeat` ◐ | symptom | interval | `SkippedHeartbeat` | — | — |  |
| `symptom_sleep_changes` ◐ | symptom | interval | `SleepChanges` | — | — |  |
| `symptom_sore_throat` ◐ | symptom | interval | `SoreThroat` | — | — |  |
| `symptom_vaginal_dryness` ◐ | symptom | interval | `VaginalDryness` | — | — |  |
| `symptom_vomiting` ◐ | symptom | interval | `Vomiting` | — | — |  |
| `symptom_wheezing` ◐ | symptom | interval | `Wheezing` | — | — |  |
| `time_in_daylight` ◐ | environment | interval | `TimeInDaylight` · `min` | — | minutes: min |  |
| `toothbrushing_event` ◐ | wellness | interval | `ToothbrushingEvent` | — | — |  |
| `total_energy` | activity | interval | `ActiveEnergyBurned`<br>`BasalEnergyBurned` · `kcal` · read-only | `TotalCaloriesBurnedRecord` · energy · `kilocalories` | kilocalories: kcal | HealthKit has no native total-energy type; writes are rejected on iOS with NOT_SUPPORTED. HK: Derived as active + basal over the same interval. Records report recordingMethod=unknown and metadata.derived=true. |
| `underwater_depth` ◐ | activity | sample | `UnderwaterDepth` · `m` | — | meters: m |  |
| `uv_exposure` ◐ | environment | sample | `UVExposure` · `count` | — | uvIndex: UV index |  |
| `vo2_max` | activity | sample | `VO2Max` · `ml/(kg*min)` | `Vo2MaxRecord` · vo2MillilitersPerMinuteKilogram · `mL/kg/min` | mlPerKgPerMin: mL/kg/min | HealthKit stores the test method in HKMetadataKeyVO2MaxTestType; Health Connect in measurementMethod. |
| `waist_circumference` ◐ | body | sample | `WaistCircumference` · `m` | — | meters: m |  |
| `walking_asymmetry` ◐ | mobility | sample | `WalkingAsymmetryPercentage` · `%` · read-only | — | percent: % | HK: HealthKit reserves this type for Apple: apps may read it but not write it (checked by healthspec-check). |
| `walking_double_support` ◐ | mobility | sample | `WalkingDoubleSupportPercentage` · `%` | — | percent: % |  |
| `walking_heart_rate_average` ◐ | vitals | sample | `WalkingHeartRateAverage` · `count/min` · read-only | — | bpm: beats/min | HK: HealthKit computes this type; apps can read it but never write it. |
| `walking_speed` ◐ | mobility | sample | `WalkingSpeed` · `m/s` | — | metersPerSecond: m/s |  |
| `walking_step_length` ◐ | mobility | sample | `WalkingStepLength` · `m` | — | meters: m |  |
| `water_temperature` ◐ | environment | sample | `WaterTemperature` · `degC` | — | celsius: °C |  |
| `weight` | body | sample | `BodyMass` · `kg` | `WeightRecord` · weight · `kilograms` | kilograms: kg |  |
| `wheelchair_pushes` | activity | interval | `PushCount` · `count` | `WheelchairPushesRecord` · count · `count` | count: count |  |
| `workout_effort_score` ◐ | activity | sample | `WorkoutEffortScore` · `appleEffortScore` | — | score: score |  |

## Enumerations

### DeviceType

Kind of device that produced a measurement. Canonical list follows Health Connect's Device types; HealthKit providers infer it from HKDevice model/name.

| Value | HealthKit | Health Connect |
|---|---|---|
| `unknown` | — | `TYPE_UNKNOWN` |
| `watch` | `HKDevice.model contains "Watch"` | `TYPE_WATCH` |
| `phone` | `HKDevice.model contains "iPhone"` | `TYPE_PHONE` |
| `scale` | — | `TYPE_SCALE` |
| `ring` | — | `TYPE_RING` |
| `head_mounted` | — | `TYPE_HEAD_MOUNTED` |
| `fitness_band` | — | `TYPE_FITNESS_BAND` |
| `chest_strap` | — | `TYPE_CHEST_STRAP` |
| `smart_display` | — | `TYPE_SMART_DISPLAY` |

### ExerciseType (draft — unverified)

Canonical exercise / workout activity type. DRAFT: platform mappings are to be verified against HKWorkoutActivityType and ExerciseSessionRecord.EXERCISE_TYPE_* headers in Phase 1. Where one platform has no equivalent the provider MUST fall back to `other` and preserve the native value in metadata.

| Value | HealthKit | Health Connect |
|---|---|---|
| `american_football` | `americanFootball` | `EXERCISE_TYPE_FOOTBALL_AMERICAN` |
| `australian_football` | `australianFootball` | `EXERCISE_TYPE_FOOTBALL_AUSTRALIAN` |
| `badminton` | `badminton` | `EXERCISE_TYPE_BADMINTON` |
| `baseball` | `baseball` | `EXERCISE_TYPE_BASEBALL` |
| `basketball` | `basketball` | `EXERCISE_TYPE_BASKETBALL` |
| `boot_camp` | `crossTraining` | `EXERCISE_TYPE_BOOT_CAMP` |
| `boxing` | `boxing` | `EXERCISE_TYPE_BOXING` |
| `calisthenics` | `functionalStrengthTraining` | `EXERCISE_TYPE_CALISTHENICS` |
| `climbing` | `climbing` | `EXERCISE_TYPE_ROCK_CLIMBING` |
| `cricket` | `cricket` | `EXERCISE_TYPE_CRICKET` |
| `cycling` | `cycling` | `EXERCISE_TYPE_BIKING` |
| `cycling_stationary` | `cycling (HKMetadataKeyIndoorWorkout=true)` | `EXERCISE_TYPE_BIKING_STATIONARY` |
| `dance` | `dance` | `EXERCISE_TYPE_DANCING` |
| `disc_sports` | `discSports` | `EXERCISE_TYPE_FRISBEE_DISC` |
| `elliptical` | `elliptical` | `EXERCISE_TYPE_ELLIPTICAL` |
| `exercise_class` | `mixedCardio` | `EXERCISE_TYPE_EXERCISE_CLASS` |
| `fencing` | `fencing` | `EXERCISE_TYPE_FENCING` |
| `golf` | `golf` | `EXERCISE_TYPE_GOLF` |
| `guided_breathing` | `mindAndBody` | `EXERCISE_TYPE_GUIDED_BREATHING` |
| `gymnastics` | `gymnastics` | `EXERCISE_TYPE_GYMNASTICS` |
| `handball` | `handball` | `EXERCISE_TYPE_HANDBALL` |
| `hiit` | `highIntensityIntervalTraining` | `EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING` |
| `hiking` | `hiking` | `EXERCISE_TYPE_HIKING` |
| `ice_hockey` | `hockey` | `EXERCISE_TYPE_ICE_HOCKEY` |
| `ice_skating` | `skatingSports` | `EXERCISE_TYPE_ICE_SKATING` |
| `martial_arts` | `martialArts` | `EXERCISE_TYPE_MARTIAL_ARTS` |
| `paddling` | `paddleSports` | `EXERCISE_TYPE_PADDLING` |
| `paragliding` | — | `EXERCISE_TYPE_PARAGLIDING` |
| `pilates` | `pilates` | `EXERCISE_TYPE_PILATES` |
| `racquetball` | `racquetball` | `EXERCISE_TYPE_RACQUETBALL` |
| `roller_hockey` | `hockey` | `EXERCISE_TYPE_ROLLER_HOCKEY` |
| `rowing` | `rowing` | `EXERCISE_TYPE_ROWING` |
| `rowing_machine` | `rowing (HKMetadataKeyIndoorWorkout=true)` | `EXERCISE_TYPE_ROWING_MACHINE` |
| `rugby` | `rugby` | `EXERCISE_TYPE_RUGBY` |
| `running` | `running` | `EXERCISE_TYPE_RUNNING` |
| `running_treadmill` | `running (HKMetadataKeyIndoorWorkout=true)` | `EXERCISE_TYPE_RUNNING_TREADMILL` |
| `sailing` | `sailing` | `EXERCISE_TYPE_SAILING` |
| `scuba_diving` | `underwaterDiving` | `EXERCISE_TYPE_SCUBA_DIVING` |
| `skating` | `skatingSports` | `EXERCISE_TYPE_SKATING` |
| `skiing` | `downhillSkiing` | `EXERCISE_TYPE_SKIING` |
| `snowboarding` | `snowboarding` | `EXERCISE_TYPE_SNOWBOARDING` |
| `snowshoeing` | `snowSports` | `EXERCISE_TYPE_SNOWSHOEING` |
| `soccer` | `soccer` | `EXERCISE_TYPE_SOCCER` |
| `softball` | `softball` | `EXERCISE_TYPE_SOFTBALL` |
| `squash` | `squash` | `EXERCISE_TYPE_SQUASH` |
| `stair_climbing` | `stairs` | `EXERCISE_TYPE_STAIR_CLIMBING` |
| `stair_climbing_machine` | `stairClimbing` | `EXERCISE_TYPE_STAIR_CLIMBING_MACHINE` |
| `strength_training` | `traditionalStrengthTraining` | `EXERCISE_TYPE_STRENGTH_TRAINING` |
| `stretching` | `flexibility` | `EXERCISE_TYPE_STRETCHING` |
| `surfing` | `surfingSports` | `EXERCISE_TYPE_SURFING` |
| `swimming_open_water` | `swimming (HKMetadataKeySwimmingLocationType=openWater)` | `EXERCISE_TYPE_SWIMMING_OPEN_WATER` |
| `swimming_pool` | `swimming (HKMetadataKeySwimmingLocationType=pool)` | `EXERCISE_TYPE_SWIMMING_POOL` |
| `table_tennis` | `tableTennis` | `EXERCISE_TYPE_TABLE_TENNIS` |
| `tennis` | `tennis` | `EXERCISE_TYPE_TENNIS` |
| `volleyball` | `volleyball` | `EXERCISE_TYPE_VOLLEYBALL` |
| `walking` | `walking` | `EXERCISE_TYPE_WALKING` |
| `water_polo` | `waterPolo` | `EXERCISE_TYPE_WATER_POLO` |
| `weightlifting` | `traditionalStrengthTraining` | `EXERCISE_TYPE_WEIGHTLIFTING` |
| `wheelchair` | `wheelchairWalkPace` | `EXERCISE_TYPE_WHEELCHAIR` |
| `yoga` | `yoga` | `EXERCISE_TYPE_YOGA` |
| `archery` | `archery` | — |
| `bowling` | `bowling` | — |
| `core_training` | `coreTraining` | — |
| `cross_country_skiing` | `crossCountrySkiing` | — |
| `curling` | `curling` | — |
| `equestrian` | `equestrianSports` | — |
| `fishing` | `fishing` | — |
| `hunting` | `hunting` | — |
| `jump_rope` | `jumpRope` | — |
| `kickboxing` | `kickboxing` | — |
| `lacrosse` | `lacrosse` | — |
| `pickleball` | `pickleball` | — |
| `tai_chi` | `taiChi` | — |
| `track_and_field` | `trackAndField` | — |
| `wrestling` | `wrestling` | — |
| `other` | `other` | `EXERCISE_TYPE_OTHER_WORKOUT` |

### MealType

Meal a nutrition or glucose record relates to.

| Value | HealthKit | Health Connect |
|---|---|---|
| `unknown` | — | `MEAL_TYPE_UNKNOWN` |
| `breakfast` | — | `MEAL_TYPE_BREAKFAST` |
| `lunch` | — | `MEAL_TYPE_LUNCH` |
| `dinner` | — | `MEAL_TYPE_DINNER` |
| `snack` | — | `MEAL_TYPE_SNACK` |

### RecordingMethod

How a record was captured. Mirrors Health Connect's recording methods; HealthKit only distinguishes user-entered data.

| Value | HealthKit | Health Connect |
|---|---|---|
| `manual` | `HKMetadataKeyWasUserEntered=true` | `RECORDING_METHOD_MANUAL_ENTRY` |
| `automatic` | `HKMetadataKeyWasUserEntered≠true` | `RECORDING_METHOD_AUTOMATICALLY_RECORDED` |
| `active` | — | `RECORDING_METHOD_ACTIVELY_RECORDED` |
| `unknown` | — | `RECORDING_METHOD_UNKNOWN` |

### SleepStage

Sleep stage within a sleep session. `in_bed` is HealthKit's legacy "in bed, sleep state unknown" and is kept distinct from `awake_in_bed`.

| Value | HealthKit | Health Connect |
|---|---|---|
| `awake` | `HKCategoryValueSleepAnalysis.awake` | `STAGE_TYPE_AWAKE` |
| `awake_in_bed` | — | `STAGE_TYPE_AWAKE_IN_BED` |
| `in_bed` | `HKCategoryValueSleepAnalysis.inBed` | — |
| `out_of_bed` | — | `STAGE_TYPE_OUT_OF_BED` |
| `sleeping` | `HKCategoryValueSleepAnalysis.asleepUnspecified` | `STAGE_TYPE_SLEEPING` |
| `light` | `HKCategoryValueSleepAnalysis.asleepCore` | `STAGE_TYPE_LIGHT` |
| `deep` | `HKCategoryValueSleepAnalysis.asleepDeep` | `STAGE_TYPE_DEEP` |
| `rem` | `HKCategoryValueSleepAnalysis.asleepREM` | `STAGE_TYPE_REM` |
| `unknown` | — | `STAGE_TYPE_UNKNOWN` |

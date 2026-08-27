// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.

import Foundation

// MARK: - Health types

/// Every type the specification defines. The raw value is the spec id used across all platforms.
public enum HealthType: String, CaseIterable, Sendable, Codable {
  /// Energy burned through activity during the interval (excludes basal metabolism).
  case activeEnergy = "active_energy"
  /// One day of Apple activity-ring progress and goals.
  case activitySummary = "activity_summary"
  /// Minutes of brisk activity credited to the Exercise ring.
  case appleExerciseTime = "apple_exercise_time"
  /// Minutes of movement (Move ring in time mode).
  case appleMoveTime = "apple_move_time"
  /// Breathing disturbances during sleep.
  case appleSleepingBreathingDisturbances = "apple_sleeping_breathing_disturbances"
  /// Wrist temperature measured during sleep (absolute; see skin_temperature for Health Connect deltas).
  case appleSleepingWristTemperature = "apple_sleeping_wrist_temperature"
  /// Whether the user stood during an hour (Stand ring).
  case appleStandHour = "apple_stand_hour"
  /// Minutes standing credited to the Stand ring.
  case appleStandTime = "apple_stand_time"
  /// Walking steadiness score.
  case appleWalkingSteadiness = "apple_walking_steadiness"
  /// Walking steadiness notification event.
  case appleWalkingSteadinessEvent = "apple_walking_steadiness_event"
  /// Share of time in atrial fibrillation.
  case atrialFibrillationBurden = "atrial_fibrillation_burden"
  /// Basal body temperature (measured at rest, typically on waking).
  case basalBodyTemperature = "basal_body_temperature"
  /// Resting (basal) energy burned during the interval (HealthKit). Health Connect exposes the rate instead — see basal_metabolic_rate.
  case basalEnergy = "basal_energy"
  /// Basal metabolic rate as an energy *rate* (Health Connect). For HealthKit’s basal energy over an interval see basal_energy.
  case basalMetabolicRate = "basal_metabolic_rate"
  /// Bleeding after pregnancy.
  case bleedingAfterPregnancy = "bleeding_after_pregnancy"
  /// Bleeding during pregnancy.
  case bleedingDuringPregnancy = "bleeding_during_pregnancy"
  /// Blood alcohol content.
  case bloodAlcoholContent = "blood_alcohol_content"
  /// Blood glucose concentration. Canonical unit is mmol/L; use units.glucose to convert to mg/dL (× 18.0182).
  case bloodGlucose = "blood_glucose"
  /// Systolic and diastolic blood pressure measured together.
  case bloodPressure = "blood_pressure"
  /// Body fat as a percentage of body mass.
  case bodyFat = "body_fat"
  /// Body mass index.
  case bodyMassIndex = "body_mass_index"
  /// Core or surface body temperature measurement.
  case bodyTemperature = "body_temperature"
  /// Total body water mass.
  case bodyWaterMass = "body_water_mass"
  /// Bone mass.
  case boneMass = "bone_mass"
  /// Cervical mucus observation.
  case cervicalMucus = "cervical_mucus"
  /// Allergies and intolerances. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalAllergy = "clinical_allergy"
  /// Conditions / diagnoses. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalCondition = "clinical_condition"
  /// Insurance coverage (HealthKit only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalCoverage = "clinical_coverage"
  /// Immunizations. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalImmunization = "clinical_immunization"
  /// Laboratory results. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalLabResult = "clinical_lab_result"
  /// Prescribed medications. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalMedication = "clinical_medication"
  /// Clinical notes (HealthKit only, iOS 16). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalNote = "clinical_note"
  /// Personal details (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalPersonalDetails = "clinical_personal_details"
  /// Practitioner details (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalPractitionerDetails = "clinical_practitioner_details"
  /// Pregnancy records (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalPregnancy = "clinical_pregnancy"
  /// Procedures. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalProcedure = "clinical_procedure"
  /// Social history (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalSocialHistory = "clinical_social_history"
  /// Visits / encounters (Health Connect only). FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalVisit = "clinical_visit"
  /// Clinically recorded vital signs. FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.
  case clinicalVitalSign = "clinical_vital_sign"
  /// Contraceptive in use.
  case contraceptive = "contraceptive"
  /// Cross-country skiing speed sample.
  case crossCountrySkiingSpeed = "cross_country_skiing_speed"
  /// Pedalling cadence sample.
  case cyclingCadence = "cycling_cadence"
  /// Functional threshold power estimate.
  case cyclingFunctionalThresholdPower = "cycling_functional_threshold_power"
  /// Cycling power sample.
  case cyclingPower = "cycling_power"
  /// Cycling speed sample.
  case cyclingSpeed = "cycling_speed"
  /// Distance travelled on foot during the interval.
  case distance = "distance"
  /// Cross-country skiing distance during the interval.
  case distanceCrossCountrySkiing = "distance_cross_country_skiing"
  /// Distance cycled during the interval.
  case distanceCycling = "distance_cycling"
  /// Downhill skiing / snowboarding distance during the interval.
  case distanceDownhillSnowSports = "distance_downhill_snow_sports"
  /// Paddle-sports distance during the interval.
  case distancePaddleSports = "distance_paddle_sports"
  /// Rowing distance during the interval.
  case distanceRowing = "distance_rowing"
  /// Skating distance during the interval.
  case distanceSkatingSports = "distance_skating_sports"
  /// Distance swum during the interval.
  case distanceSwimming = "distance_swimming"
  /// Distance travelled by wheelchair during the interval.
  case distanceWheelchair = "distance_wheelchair"
  /// Single-lead ECG recording: classification and summary values. Voltage samples are fetched separately (readEcgVoltages) because a recording holds thousands.
  case electrocardiogram = "electrocardiogram"
  /// Electrodermal activity (skin conductance).
  case electrodermalActivity = "electrodermal_activity"
  /// Elevation gained during the interval (Health Connect only; HealthKit keeps it as workout metadata).
  case elevationGained = "elevation_gained"
  /// Environmental sound level exposure.
  case environmentalAudioExposure = "environmental_audio_exposure"
  /// Environmental sound exposure limit event.
  case environmentalAudioExposureEvent = "environmental_audio_exposure_event"
  /// Sound reduction from active noise control.
  case environmentalSoundReduction = "environmental_sound_reduction"
  /// System-estimated workout effort (1–10).
  case estimatedWorkoutEffortScore = "estimated_workout_effort_score"
  /// GPS route of an exercise session. Read with readRoute(sessionId): Health Connect asks the user per session; HealthKit reads the route series linked to the workout.
  case exerciseRoute = "exercise_route"
  /// A workout / exercise session. Duration is end − start. Associated totals (distance, energy, heart rate) are separate records overlapping the session's time range.
  case exerciseSession = "exercise_session"
  /// Floors (flights of stairs) climbed during the interval.
  case floorsClimbed = "floors_climbed"
  /// FEV1 — air exhaled in the first second of a forced breath.
  case forcedExpiratoryVolume1 = "forced_expiratory_volume_1"
  /// Forced vital capacity.
  case forcedVitalCapacity = "forced_vital_capacity"
  /// Handwashing session.
  case handwashingEvent = "handwashing_event"
  /// Headphone sound level exposure.
  case headphoneAudioExposure = "headphone_audio_exposure"
  /// Headphone sound exposure limit event.
  case headphoneAudioExposureEvent = "headphone_audio_exposure_event"
  /// Heart rate sample.
  case heartRate = "heart_rate"
  /// Heart-rate drop one minute after exercise.
  case heartRateRecoveryOneMinute = "heart_rate_recovery_one_minute"
  /// Beat-to-beat timing series behind an HRV measurement.
  case heartbeatSeries = "heartbeat_series"
  /// Body height.
  case height = "height"
  /// High heart-rate notification event (threshold in metadata HKHeartRateEventThreshold).
  case highHeartRateEvent = "high_heart_rate_event"
  /// Heart rate variability, RMSSD (root mean square of successive differences). Health Connect only.
  case hrvRmssd = "hrv_rmssd"
  /// Heart rate variability, SDNN (standard deviation of NN intervals). Apple platforms only.
  case hrvSdnn = "hrv_sdnn"
  /// Water consumed during the interval.
  case hydration = "hydration"
  /// Infrequent menstrual cycles (cycle deviation notification).
  case infrequentMenstrualCycles = "infrequent_menstrual_cycles"
  /// Inhaler puffs.
  case inhalerUsage = "inhaler_usage"
  /// Insulin delivered during the interval.
  case insulinDelivery = "insulin_delivery"
  /// Spotting / bleeding between periods.
  case intermenstrualBleeding = "intermenstrual_bleeding"
  /// Irregular heart rhythm notification event.
  case irregularHeartRhythmEvent = "irregular_heart_rhythm_event"
  /// Irregular menstrual cycles (cycle deviation notification).
  case irregularMenstrualCycles = "irregular_menstrual_cycles"
  /// Lactation period.
  case lactation = "lactation"
  /// Lean body mass (body mass excluding fat).
  case leanBodyMass = "lean_body_mass"
  /// Low cardio fitness notification event.
  case lowCardioFitnessEvent = "low_cardio_fitness_event"
  /// Low heart-rate notification event.
  case lowHeartRateEvent = "low_heart_rate_event"
  /// A logged medication dose event (iOS 26 Medications). The medication list itself comes from listMedications().
  case medicationDose = "medication_dose"
  /// Menstrual flow observation for a day (or shorter interval).
  case menstruationFlow = "menstruation_flow"
  /// A menstrual period as a whole (Health Connect only; HealthKit users derive periods from menstruation_flow with cycleStart).
  case menstruationPeriod = "menstruation_period"
  /// A mindfulness / meditation session. Duration is end − start.
  case mindfulnessSession = "mindfulness_session"
  /// NikeFuel points during the interval (legacy).
  case nikeFuel = "nike_fuel"
  /// Alcoholic drinks consumed during the interval.
  case numberOfAlcoholicBeverages = "number_of_alcoholic_beverages"
  /// Falls during the interval.
  case numberOfTimesFallen = "number_of_times_fallen"
  /// Nutrients consumed during the interval (a meal or a day). Every nutrient either platform records; fields a platform lacks are simply absent there.
  case nutrition = "nutrition"
  /// Result of an ovulation (LH / estrogen) test.
  case ovulationTest = "ovulation_test"
  /// Blood oxygen saturation (SpO2).
  case oxygenSaturation = "oxygen_saturation"
  /// Paddle-sports speed sample.
  case paddleSportsSpeed = "paddle_sports_speed"
  /// Peak expiratory flow rate.
  case peakExpiratoryFlowRate = "peak_expiratory_flow_rate"
  /// Peripheral perfusion index.
  case peripheralPerfusionIndex = "peripheral_perfusion_index"
  /// Persistent intermenstrual bleeding (cycle deviation notification).
  case persistentIntermenstrualBleeding = "persistent_intermenstrual_bleeding"
  /// Physical effort (MET-like) sample.
  case physicalEffort = "physical_effort"
  /// Power output sample, activity-agnostic (Health Connect). HealthKit splits power by activity — see cycling_power and running_power.
  case power = "power"
  /// Pregnancy period.
  case pregnancy = "pregnancy"
  /// Pregnancy test result.
  case pregnancyTest = "pregnancy_test"
  /// Progesterone test result.
  case progesteroneTest = "progesterone_test"
  /// Prolonged menstrual periods (cycle deviation notification).
  case prolongedMenstrualPeriods = "prolonged_menstrual_periods"
  /// Breaths per minute.
  case respiratoryRate = "respiratory_rate"
  /// Resting heart rate estimate.
  case restingHeartRate = "resting_heart_rate"
  /// Rowing speed sample.
  case rowingSpeed = "rowing_speed"
  /// Ground contact time sample.
  case runningGroundContactTime = "running_ground_contact_time"
  /// Running power sample.
  case runningPower = "running_power"
  /// Running speed sample.
  case runningSpeed = "running_speed"
  /// Running stride length sample.
  case runningStrideLength = "running_stride_length"
  /// Vertical oscillation sample.
  case runningVerticalOscillation = "running_vertical_oscillation"
  /// Sexual activity event.
  case sexualActivity = "sexual_activity"
  /// Estimated six-minute walk test distance.
  case sixMinuteWalkDistance = "six_minute_walk_distance"
  /// Skin temperature expressed as a delta from the user's baseline. Health Connect only.
  case skinTemperature = "skin_temperature"
  /// Sleep apnea notification event.
  case sleepApneaEvent = "sleep_apnea_event"
  /// A sleep session with optional stage breakdown. Session bounds are the record's start/end; stages partition (part of) that range.
  case sleepSession = "sleep_session"
  /// Speed sample, activity-agnostic (Health Connect). HealthKit splits speed by activity — see walking_speed, running_speed, cycling_speed.
  case speed = "speed"
  /// Stair ascent speed sample.
  case stairAscentSpeed = "stair_ascent_speed"
  /// Stair descent speed sample.
  case stairDescentSpeed = "stair_descent_speed"
  /// Logged emotion (momentary) or mood (daily) with valence, labels and life-area associations.
  case stateOfMind = "state_of_mind"
  /// Number of steps taken during the interval.
  case steps = "steps"
  /// Step cadence sample (Health Connect only).
  case stepsCadence = "steps_cadence"
  /// Swimming strokes during the interval.
  case swimmingStrokeCount = "swimming_stroke_count"
  /// Abdominal cramps (symptom with severity).
  case symptomAbdominalCramps = "symptom_abdominal_cramps"
  /// Acne (symptom with severity).
  case symptomAcne = "symptom_acne"
  /// Appetite changes.
  case symptomAppetiteChanges = "symptom_appetite_changes"
  /// Bladder incontinence (symptom with severity).
  case symptomBladderIncontinence = "symptom_bladder_incontinence"
  /// Bloating (symptom with severity).
  case symptomBloating = "symptom_bloating"
  /// Breast pain (symptom with severity).
  case symptomBreastPain = "symptom_breast_pain"
  /// Chest tightness or pain (symptom with severity).
  case symptomChestTightnessOrPain = "symptom_chest_tightness_or_pain"
  /// Chills (symptom with severity).
  case symptomChills = "symptom_chills"
  /// Constipation (symptom with severity).
  case symptomConstipation = "symptom_constipation"
  /// Coughing (symptom with severity).
  case symptomCoughing = "symptom_coughing"
  /// Diarrhea (symptom with severity).
  case symptomDiarrhea = "symptom_diarrhea"
  /// Dizziness (symptom with severity).
  case symptomDizziness = "symptom_dizziness"
  /// Dry skin (symptom with severity).
  case symptomDrySkin = "symptom_dry_skin"
  /// Fainting (symptom with severity).
  case symptomFainting = "symptom_fainting"
  /// Fatigue (symptom with severity).
  case symptomFatigue = "symptom_fatigue"
  /// Fever (symptom with severity).
  case symptomFever = "symptom_fever"
  /// Generalized body ache (symptom with severity).
  case symptomGeneralizedBodyAche = "symptom_generalized_body_ache"
  /// Hair loss (symptom with severity).
  case symptomHairLoss = "symptom_hair_loss"
  /// Headache (symptom with severity).
  case symptomHeadache = "symptom_headache"
  /// Heartburn (symptom with severity).
  case symptomHeartburn = "symptom_heartburn"
  /// Hot flashes (symptom with severity).
  case symptomHotFlashes = "symptom_hot_flashes"
  /// Loss of smell (symptom with severity).
  case symptomLossOfSmell = "symptom_loss_of_smell"
  /// Loss of taste (symptom with severity).
  case symptomLossOfTaste = "symptom_loss_of_taste"
  /// Lower back pain (symptom with severity).
  case symptomLowerBackPain = "symptom_lower_back_pain"
  /// Memory lapse (symptom with severity).
  case symptomMemoryLapse = "symptom_memory_lapse"
  /// Mood changes.
  case symptomMoodChanges = "symptom_mood_changes"
  /// Nausea (symptom with severity).
  case symptomNausea = "symptom_nausea"
  /// Night sweats (symptom with severity).
  case symptomNightSweats = "symptom_night_sweats"
  /// Pelvic pain (symptom with severity).
  case symptomPelvicPain = "symptom_pelvic_pain"
  /// Rapid, pounding or fluttering heartbeat (symptom with severity).
  case symptomRapidPoundingOrFlutteringHeartbeat = "symptom_rapid_pounding_or_fluttering_heartbeat"
  /// Runny nose (symptom with severity).
  case symptomRunnyNose = "symptom_runny_nose"
  /// Shortness of breath (symptom with severity).
  case symptomShortnessOfBreath = "symptom_shortness_of_breath"
  /// Sinus congestion (symptom with severity).
  case symptomSinusCongestion = "symptom_sinus_congestion"
  /// Skipped heartbeat (symptom with severity).
  case symptomSkippedHeartbeat = "symptom_skipped_heartbeat"
  /// Sleep changes.
  case symptomSleepChanges = "symptom_sleep_changes"
  /// Sore throat (symptom with severity).
  case symptomSoreThroat = "symptom_sore_throat"
  /// Vaginal dryness (symptom with severity).
  case symptomVaginalDryness = "symptom_vaginal_dryness"
  /// Vomiting (symptom with severity).
  case symptomVomiting = "symptom_vomiting"
  /// Wheezing (symptom with severity).
  case symptomWheezing = "symptom_wheezing"
  /// Minutes spent in daylight.
  case timeInDaylight = "time_in_daylight"
  /// Toothbrushing session.
  case toothbrushingEvent = "toothbrushing_event"
  /// Total energy burned during the interval (active + basal).
  case totalEnergy = "total_energy"
  /// Depth below the water surface.
  case underwaterDepth = "underwater_depth"
  /// UV index exposure.
  case uvExposure = "uv_exposure"
  /// Maximal oxygen consumption estimate.
  case vo2Max = "vo2_max"
  /// Waist circumference.
  case waistCircumference = "waist_circumference"
  /// Walking asymmetry (percentage of steps where one foot moves faster than the other).
  case walkingAsymmetry = "walking_asymmetry"
  /// Time with both feet on the ground while walking, percentage.
  case walkingDoubleSupport = "walking_double_support"
  /// Average heart rate while walking.
  case walkingHeartRateAverage = "walking_heart_rate_average"
  /// Walking speed sample.
  case walkingSpeed = "walking_speed"
  /// Walking step length sample.
  case walkingStepLength = "walking_step_length"
  /// Water temperature sample.
  case waterTemperature = "water_temperature"
  /// Body mass.
  case weight = "weight"
  /// Wheelchair pushes during the interval.
  case wheelchairPushes = "wheelchair_pushes"
  /// User-rated workout effort (1–10).
  case workoutEffortScore = "workout_effort_score"
}

public enum HealthCategory: String, CaseIterable, Sendable, Codable {
  case activity = "activity"
  case body = "body"
  case clinical = "clinical"
  case cycle = "cycle"
  case environment = "environment"
  case mind = "mind"
  case mobility = "mobility"
  case nutrition = "nutrition"
  case respiratory = "respiratory"
  case sleep = "sleep"
  case symptom = "symptom"
  case vitals = "vitals"
  case wellness = "wellness"
}

/// sample: a point in time (start == end) · interval: accumulated over [start, end] · session: an episode
public enum RecordKind: String, Sendable, Codable {
  case sample, interval, session
}

public enum AggregateFunction: String, Sendable, Codable {
  case sum, avg, min, max, count, duration
}

// MARK: - Shared enumerations

/// Kind of device that produced a measurement. Canonical list follows Health Connect's Device types; HealthKit providers infer it from HKDevice model/name.

public enum DeviceType: String, CaseIterable, Sendable, Codable {
  case unknown = "unknown"
  case watch = "watch"
  case phone = "phone"
  case scale = "scale"
  case ring = "ring"
  case headMounted = "head_mounted"
  case fitnessBand = "fitness_band"
  case chestStrap = "chest_strap"
  case smartDisplay = "smart_display"
}

/// Canonical exercise / workout activity type. DRAFT: platform mappings are to be verified against HKWorkoutActivityType and ExerciseSessionRecord.EXERCISE_TYPE_* headers in Phase 1. Where one platform has no equivalent the provider MUST fall back to `other` and preserve the native value in metadata.

public enum ExerciseType: String, CaseIterable, Sendable, Codable {
  case americanFootball = "american_football"
  case australianFootball = "australian_football"
  case badminton = "badminton"
  case baseball = "baseball"
  case basketball = "basketball"
  case bootCamp = "boot_camp"
  case boxing = "boxing"
  case calisthenics = "calisthenics"
  case climbing = "climbing"
  case cricket = "cricket"
  case cycling = "cycling"
  case cyclingStationary = "cycling_stationary"
  case dance = "dance"
  case discSports = "disc_sports"
  case elliptical = "elliptical"
  case exerciseClass = "exercise_class"
  case fencing = "fencing"
  case golf = "golf"
  case guidedBreathing = "guided_breathing"
  case gymnastics = "gymnastics"
  case handball = "handball"
  case hiit = "hiit"
  case hiking = "hiking"
  case iceHockey = "ice_hockey"
  case iceSkating = "ice_skating"
  case martialArts = "martial_arts"
  case paddling = "paddling"
  case paragliding = "paragliding"
  case pilates = "pilates"
  case racquetball = "racquetball"
  case rollerHockey = "roller_hockey"
  case rowing = "rowing"
  case rowingMachine = "rowing_machine"
  case rugby = "rugby"
  case running = "running"
  case runningTreadmill = "running_treadmill"
  case sailing = "sailing"
  case scubaDiving = "scuba_diving"
  case skating = "skating"
  case skiing = "skiing"
  case snowboarding = "snowboarding"
  case snowshoeing = "snowshoeing"
  case soccer = "soccer"
  case softball = "softball"
  case squash = "squash"
  case stairClimbing = "stair_climbing"
  case stairClimbingMachine = "stair_climbing_machine"
  case strengthTraining = "strength_training"
  case stretching = "stretching"
  case surfing = "surfing"
  case swimmingOpenWater = "swimming_open_water"
  case swimmingPool = "swimming_pool"
  case tableTennis = "table_tennis"
  case tennis = "tennis"
  case volleyball = "volleyball"
  case walking = "walking"
  case waterPolo = "water_polo"
  case weightlifting = "weightlifting"
  case wheelchair = "wheelchair"
  case yoga = "yoga"
  case archery = "archery"
  case bowling = "bowling"
  case coreTraining = "core_training"
  case crossCountrySkiing = "cross_country_skiing"
  case curling = "curling"
  case equestrian = "equestrian"
  case fishing = "fishing"
  case hunting = "hunting"
  case jumpRope = "jump_rope"
  case kickboxing = "kickboxing"
  case lacrosse = "lacrosse"
  case pickleball = "pickleball"
  case taiChi = "tai_chi"
  case trackAndField = "track_and_field"
  case wrestling = "wrestling"
  case other = "other"
}

/// Meal a nutrition or glucose record relates to.

public enum MealType: String, CaseIterable, Sendable, Codable {
  case unknown = "unknown"
  case breakfast = "breakfast"
  case lunch = "lunch"
  case dinner = "dinner"
  case snack = "snack"
}

/// How a record was captured. Mirrors Health Connect's recording methods; HealthKit only distinguishes user-entered data.

public enum RecordingMethod: String, CaseIterable, Sendable, Codable {
  case manual = "manual"
  case automatic = "automatic"
  case active = "active"
  case unknown = "unknown"
}

/// Sleep stage within a sleep session. `in_bed` is HealthKit's legacy "in bed, sleep state unknown" and is kept distinct from `awake_in_bed`.

public enum SleepStage: String, CaseIterable, Sendable, Codable {
  case awake = "awake"
  case awakeInBed = "awake_in_bed"
  case inBed = "in_bed"
  case outOfBed = "out_of_bed"
  case sleeping = "sleeping"
  case light = "light"
  case deep = "deep"
  case rem = "rem"
  case unknown = "unknown"
}

// MARK: - Platform mapping

/// How a HealthKit object backs a spec type.
public enum HealthKitKind: String, Sendable {
  case quantity, category, correlation, workout, derived, multi, series, special
  case electrocardiogram, heartbeatSeries, stateOfMind, activitySummary, clinical, medicationDose
}

public struct HealthKitMapping: Sendable {
  public let kind: HealthKitKind
  /// Primary object type identifier, when the type maps to exactly one.
  public let identifier: String?
  /// Every identifier that must be authorized for this type.
  public let identifiers: [String]
  /// Value field → object type identifier, for types spread across several quantities.
  public let fields: [String: String]
  /// HKUnit string used when reading and writing.
  public let unit: String?
  /// Spec enum value → HKCategoryValue raw value.
  public let values: [String: Int]
  /// The value field carrying the category enum.
  public let valueField: String?
  public let readable: Bool
  public let writable: Bool
  /// Minimum OS version when newer than the library baseline.
  public let since: String?
}

public struct HealthConnectMapping: Sendable {
  public let record: String
  public let permission: String
  public let readable: Bool
  public let writable: Bool
}

public struct TypeInfo: Sendable {
  public let type: HealthType
  public let category: HealthCategory
  public let kind: RecordKind
  public let aggregate: [AggregateFunction]
  public let healthKit: HealthKitMapping?
  public let healthConnect: HealthConnectMapping?
  /// Value field → canonical unit symbol.
  public let fieldUnits: [String: String]
}

public enum HealthSpec {
  /// Every type the specification defines, keyed by id.
  public static let types: [HealthType: TypeInfo] = [
    .activeEnergy: TypeInfo(type: .activeEnergy, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierActiveEnergyBurned", identifiers: ["HKQuantityTypeIdentifierActiveEnergyBurned"], fields: [:], unit: "kcal", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "ActiveCaloriesBurnedRecord", permission: "ACTIVE_CALORIES_BURNED", readable: true, writable: true), fieldUnits: ["kilocalories": "kcal"]),
    .activitySummary: TypeInfo(type: .activitySummary, category: .activity, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .activitySummary, identifier: "HKActivitySummaryTypeIdentifier", identifiers: ["HKActivitySummaryTypeIdentifier"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: nil, fieldUnits: ["activeEnergyKilocalories": "kcal", "activeEnergyGoalKilocalories": "kcal", "exerciseMinutes": "min", "exerciseGoalMinutes": "min", "standHours": "count", "standGoalHours": "count", "moveMinutes": "min", "moveGoalMinutes": "min"]),
    .appleExerciseTime: TypeInfo(type: .appleExerciseTime, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierAppleExerciseTime", identifiers: ["HKQuantityTypeIdentifierAppleExerciseTime"], fields: [:], unit: "min", values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: nil, fieldUnits: ["minutes": "min"]),
    .appleMoveTime: TypeInfo(type: .appleMoveTime, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierAppleMoveTime", identifiers: ["HKQuantityTypeIdentifierAppleMoveTime"], fields: [:], unit: "min", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["minutes": "min"]),
    .appleSleepingBreathingDisturbances: TypeInfo(type: .appleSleepingBreathingDisturbances, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances", identifiers: ["HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["count": "count"]),
    .appleSleepingWristTemperature: TypeInfo(type: .appleSleepingWristTemperature, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierAppleSleepingWristTemperature", identifiers: ["HKQuantityTypeIdentifierAppleSleepingWristTemperature"], fields: [:], unit: "degC", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 16"), healthConnect: nil, fieldUnits: ["celsius": "°C"]),
    .appleStandHour: TypeInfo(type: .appleStandHour, category: .activity, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierAppleStandHour", identifiers: ["HKCategoryTypeIdentifierAppleStandHour"], fields: [:], unit: nil, values: ["stood": 0, "idle": 1], valueField: "status", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .appleStandTime: TypeInfo(type: .appleStandTime, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierAppleStandTime", identifiers: ["HKQuantityTypeIdentifierAppleStandTime"], fields: [:], unit: "min", values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: nil, fieldUnits: ["minutes": "min"]),
    .appleWalkingSteadiness: TypeInfo(type: .appleWalkingSteadiness, category: .mobility, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierAppleWalkingSteadiness", identifiers: ["HKQuantityTypeIdentifierAppleWalkingSteadiness"], fields: [:], unit: "%", values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: nil, fieldUnits: ["percent": "%"]),
    .appleWalkingSteadinessEvent: TypeInfo(type: .appleWalkingSteadinessEvent, category: .mobility, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierAppleWalkingSteadinessEvent", identifiers: ["HKCategoryTypeIdentifierAppleWalkingSteadinessEvent"], fields: [:], unit: nil, values: ["initial_low": 1, "initial_very_low": 2, "repeat_low": 3, "repeat_very_low": 4], valueField: "level", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .atrialFibrillationBurden: TypeInfo(type: .atrialFibrillationBurden, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierAtrialFibrillationBurden", identifiers: ["HKQuantityTypeIdentifierAtrialFibrillationBurden"], fields: [:], unit: "%", values: [:], valueField: nil, readable: true, writable: false, since: "iOS 16"), healthConnect: nil, fieldUnits: ["percent": "%"]),
    .basalBodyTemperature: TypeInfo(type: .basalBodyTemperature, category: .cycle, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierBasalBodyTemperature", identifiers: ["HKQuantityTypeIdentifierBasalBodyTemperature"], fields: [:], unit: "degC", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "BasalBodyTemperatureRecord", permission: "BASAL_BODY_TEMPERATURE", readable: true, writable: true), fieldUnits: ["celsius": "°C"]),
    .basalEnergy: TypeInfo(type: .basalEnergy, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierBasalEnergyBurned", identifiers: ["HKQuantityTypeIdentifierBasalEnergyBurned"], fields: [:], unit: "kcal", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["kilocalories": "kcal"]),
    .basalMetabolicRate: TypeInfo(type: .basalMetabolicRate, category: .body, kind: .sample, aggregate: [.avg, .min, .max], healthKit: nil, healthConnect: HealthConnectMapping(record: "BasalMetabolicRateRecord", permission: "BASAL_METABOLIC_RATE", readable: true, writable: true), fieldUnits: ["kilocaloriesPerDay": "kcal/day"]),
    .bleedingAfterPregnancy: TypeInfo(type: .bleedingAfterPregnancy, category: .cycle, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierBleedingAfterPregnancy", identifiers: ["HKCategoryTypeIdentifierBleedingAfterPregnancy"], fields: [:], unit: nil, values: ["unspecified": 1, "light": 2, "medium": 3, "heavy": 4, "none": 5], valueField: "flow", readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: [:]),
    .bleedingDuringPregnancy: TypeInfo(type: .bleedingDuringPregnancy, category: .cycle, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierBleedingDuringPregnancy", identifiers: ["HKCategoryTypeIdentifierBleedingDuringPregnancy"], fields: [:], unit: nil, values: ["unspecified": 1, "light": 2, "medium": 3, "heavy": 4, "none": 5], valueField: "flow", readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: [:]),
    .bloodAlcoholContent: TypeInfo(type: .bloodAlcoholContent, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierBloodAlcoholContent", identifiers: ["HKQuantityTypeIdentifierBloodAlcoholContent"], fields: [:], unit: "%", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["percent": "%"]),
    .bloodGlucose: TypeInfo(type: .bloodGlucose, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierBloodGlucose", identifiers: ["HKQuantityTypeIdentifierBloodGlucose"], fields: [:], unit: "mmol<180.1558800000541>/L", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "BloodGlucoseRecord", permission: "BLOOD_GLUCOSE", readable: true, writable: true), fieldUnits: ["millimolesPerLiter": "mmol/L"]),
    .bloodPressure: TypeInfo(type: .bloodPressure, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .correlation, identifier: "HKCorrelationTypeIdentifierBloodPressure", identifiers: ["HKCorrelationTypeIdentifierBloodPressure", "HKQuantityTypeIdentifierBloodPressureSystolic", "HKQuantityTypeIdentifierBloodPressureDiastolic"], fields: [:], unit: "mmHg", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "BloodPressureRecord", permission: "BLOOD_PRESSURE", readable: true, writable: true), fieldUnits: ["systolicMmHg": "mmHg", "diastolicMmHg": "mmHg"]),
    .bodyFat: TypeInfo(type: .bodyFat, category: .body, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierBodyFatPercentage", identifiers: ["HKQuantityTypeIdentifierBodyFatPercentage"], fields: [:], unit: "%", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "BodyFatRecord", permission: "BODY_FAT", readable: true, writable: true), fieldUnits: ["percent": "%"]),
    .bodyMassIndex: TypeInfo(type: .bodyMassIndex, category: .body, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierBodyMassIndex", identifiers: ["HKQuantityTypeIdentifierBodyMassIndex"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["value": "kg/m²"]),
    .bodyTemperature: TypeInfo(type: .bodyTemperature, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierBodyTemperature", identifiers: ["HKQuantityTypeIdentifierBodyTemperature"], fields: [:], unit: "degC", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "BodyTemperatureRecord", permission: "BODY_TEMPERATURE", readable: true, writable: true), fieldUnits: ["celsius": "°C"]),
    .bodyWaterMass: TypeInfo(type: .bodyWaterMass, category: .body, kind: .sample, aggregate: [.avg, .min, .max], healthKit: nil, healthConnect: HealthConnectMapping(record: "BodyWaterMassRecord", permission: "BODY_WATER_MASS", readable: true, writable: true), fieldUnits: ["kilograms": "kg"]),
    .boneMass: TypeInfo(type: .boneMass, category: .body, kind: .sample, aggregate: [.avg, .min, .max], healthKit: nil, healthConnect: HealthConnectMapping(record: "BoneMassRecord", permission: "BONE_MASS", readable: true, writable: true), fieldUnits: ["kilograms": "kg"]),
    .cervicalMucus: TypeInfo(type: .cervicalMucus, category: .cycle, kind: .sample, aggregate: [.count], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierCervicalMucusQuality", identifiers: ["HKCategoryTypeIdentifierCervicalMucusQuality"], fields: [:], unit: nil, values: ["dry": 1, "sticky": 2, "creamy": 3, "watery": 4, "egg_white": 5], valueField: "appearance", readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "CervicalMucusRecord", permission: "CERVICAL_MUCUS", readable: true, writable: true), fieldUnits: [:]),
    .clinicalAllergy: TypeInfo(type: .clinicalAllergy, category: .clinical, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .clinical, identifier: "HKClinicalTypeIdentifierAllergyRecord", identifiers: ["HKClinicalTypeIdentifierAllergyRecord"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_ALLERGIES_INTOLERANCES", readable: true, writable: false), fieldUnits: [:]),
    .clinicalCondition: TypeInfo(type: .clinicalCondition, category: .clinical, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .clinical, identifier: "HKClinicalTypeIdentifierConditionRecord", identifiers: ["HKClinicalTypeIdentifierConditionRecord"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_CONDITIONS", readable: true, writable: false), fieldUnits: [:]),
    .clinicalCoverage: TypeInfo(type: .clinicalCoverage, category: .clinical, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .clinical, identifier: "HKClinicalTypeIdentifierCoverageRecord", identifiers: ["HKClinicalTypeIdentifierCoverageRecord"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: nil, fieldUnits: [:]),
    .clinicalImmunization: TypeInfo(type: .clinicalImmunization, category: .clinical, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .clinical, identifier: "HKClinicalTypeIdentifierImmunizationRecord", identifiers: ["HKClinicalTypeIdentifierImmunizationRecord"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_VACCINES", readable: true, writable: false), fieldUnits: [:]),
    .clinicalLabResult: TypeInfo(type: .clinicalLabResult, category: .clinical, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .clinical, identifier: "HKClinicalTypeIdentifierLabResultRecord", identifiers: ["HKClinicalTypeIdentifierLabResultRecord"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_LABORATORY_RESULTS", readable: true, writable: false), fieldUnits: [:]),
    .clinicalMedication: TypeInfo(type: .clinicalMedication, category: .clinical, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .clinical, identifier: "HKClinicalTypeIdentifierMedicationRecord", identifiers: ["HKClinicalTypeIdentifierMedicationRecord"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_MEDICATIONS", readable: true, writable: false), fieldUnits: [:]),
    .clinicalNote: TypeInfo(type: .clinicalNote, category: .clinical, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .clinical, identifier: "HKClinicalTypeIdentifierClinicalNoteRecord", identifiers: ["HKClinicalTypeIdentifierClinicalNoteRecord"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: "iOS 16"), healthConnect: nil, fieldUnits: [:]),
    .clinicalPersonalDetails: TypeInfo(type: .clinicalPersonalDetails, category: .clinical, kind: .interval, aggregate: [.count], healthKit: nil, healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_PERSONAL_DETAILS", readable: true, writable: false), fieldUnits: [:]),
    .clinicalPractitionerDetails: TypeInfo(type: .clinicalPractitionerDetails, category: .clinical, kind: .interval, aggregate: [.count], healthKit: nil, healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_PRACTITIONER_DETAILS", readable: true, writable: false), fieldUnits: [:]),
    .clinicalPregnancy: TypeInfo(type: .clinicalPregnancy, category: .clinical, kind: .interval, aggregate: [.count], healthKit: nil, healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_PREGNANCY", readable: true, writable: false), fieldUnits: [:]),
    .clinicalProcedure: TypeInfo(type: .clinicalProcedure, category: .clinical, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .clinical, identifier: "HKClinicalTypeIdentifierProcedureRecord", identifiers: ["HKClinicalTypeIdentifierProcedureRecord"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_PROCEDURES", readable: true, writable: false), fieldUnits: [:]),
    .clinicalSocialHistory: TypeInfo(type: .clinicalSocialHistory, category: .clinical, kind: .interval, aggregate: [.count], healthKit: nil, healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_SOCIAL_HISTORY", readable: true, writable: false), fieldUnits: [:]),
    .clinicalVisit: TypeInfo(type: .clinicalVisit, category: .clinical, kind: .interval, aggregate: [.count], healthKit: nil, healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_VISITS", readable: true, writable: false), fieldUnits: [:]),
    .clinicalVitalSign: TypeInfo(type: .clinicalVitalSign, category: .clinical, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .clinical, identifier: "HKClinicalTypeIdentifierVitalSignRecord", identifiers: ["HKClinicalTypeIdentifierVitalSignRecord"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: HealthConnectMapping(record: "MedicalResource", permission: "MEDICAL_DATA_VITAL_SIGNS", readable: true, writable: false), fieldUnits: [:]),
    .contraceptive: TypeInfo(type: .contraceptive, category: .cycle, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierContraceptive", identifiers: ["HKCategoryTypeIdentifierContraceptive"], fields: [:], unit: nil, values: ["unspecified": 1, "implant": 2, "injection": 3, "intrauterine_device": 4, "intravaginal_ring": 5, "oral": 6, "patch": 7], valueField: "method", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .crossCountrySkiingSpeed: TypeInfo(type: .crossCountrySkiingSpeed, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierCrossCountrySkiingSpeed", identifiers: ["HKQuantityTypeIdentifierCrossCountrySkiingSpeed"], fields: [:], unit: "m/s", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["metersPerSecond": "m/s"]),
    .cyclingCadence: TypeInfo(type: .cyclingCadence, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierCyclingCadence", identifiers: ["HKQuantityTypeIdentifierCyclingCadence"], fields: [:], unit: "count/min", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 17"), healthConnect: HealthConnectMapping(record: "CyclingPedalingCadenceRecord", permission: "CYCLING_PEDALING_CADENCE", readable: true, writable: true), fieldUnits: ["rpm": "rpm"]),
    .cyclingFunctionalThresholdPower: TypeInfo(type: .cyclingFunctionalThresholdPower, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierCyclingFunctionalThresholdPower", identifiers: ["HKQuantityTypeIdentifierCyclingFunctionalThresholdPower"], fields: [:], unit: "W", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 17"), healthConnect: nil, fieldUnits: ["watts": "W"]),
    .cyclingPower: TypeInfo(type: .cyclingPower, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierCyclingPower", identifiers: ["HKQuantityTypeIdentifierCyclingPower"], fields: [:], unit: "W", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 17"), healthConnect: nil, fieldUnits: ["watts": "W"]),
    .cyclingSpeed: TypeInfo(type: .cyclingSpeed, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierCyclingSpeed", identifiers: ["HKQuantityTypeIdentifierCyclingSpeed"], fields: [:], unit: "m/s", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 17"), healthConnect: nil, fieldUnits: ["metersPerSecond": "m/s"]),
    .distance: TypeInfo(type: .distance, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierDistanceWalkingRunning", identifiers: ["HKQuantityTypeIdentifierDistanceWalkingRunning"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "DistanceRecord", permission: "DISTANCE", readable: true, writable: true), fieldUnits: ["meters": "m"]),
    .distanceCrossCountrySkiing: TypeInfo(type: .distanceCrossCountrySkiing, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierDistanceCrossCountrySkiing", identifiers: ["HKQuantityTypeIdentifierDistanceCrossCountrySkiing"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .distanceCycling: TypeInfo(type: .distanceCycling, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierDistanceCycling", identifiers: ["HKQuantityTypeIdentifierDistanceCycling"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .distanceDownhillSnowSports: TypeInfo(type: .distanceDownhillSnowSports, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierDistanceDownhillSnowSports", identifiers: ["HKQuantityTypeIdentifierDistanceDownhillSnowSports"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .distancePaddleSports: TypeInfo(type: .distancePaddleSports, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierDistancePaddleSports", identifiers: ["HKQuantityTypeIdentifierDistancePaddleSports"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .distanceRowing: TypeInfo(type: .distanceRowing, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierDistanceRowing", identifiers: ["HKQuantityTypeIdentifierDistanceRowing"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .distanceSkatingSports: TypeInfo(type: .distanceSkatingSports, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierDistanceSkatingSports", identifiers: ["HKQuantityTypeIdentifierDistanceSkatingSports"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .distanceSwimming: TypeInfo(type: .distanceSwimming, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierDistanceSwimming", identifiers: ["HKQuantityTypeIdentifierDistanceSwimming"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .distanceWheelchair: TypeInfo(type: .distanceWheelchair, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierDistanceWheelchair", identifiers: ["HKQuantityTypeIdentifierDistanceWheelchair"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .electrocardiogram: TypeInfo(type: .electrocardiogram, category: .vitals, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .electrocardiogram, identifier: "HKDataTypeIdentifierElectrocardiogram", identifiers: ["HKDataTypeIdentifierElectrocardiogram"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: "iOS 14"), healthConnect: nil, fieldUnits: ["averageBpm": "beats/min", "samplingFrequencyHz": "Hz", "voltageCount": "count"]),
    .electrodermalActivity: TypeInfo(type: .electrodermalActivity, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierElectrodermalActivity", identifiers: ["HKQuantityTypeIdentifierElectrodermalActivity"], fields: [:], unit: "mcS", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["microsiemens": "µS"]),
    .elevationGained: TypeInfo(type: .elevationGained, category: .activity, kind: .interval, aggregate: [.sum], healthKit: nil, healthConnect: HealthConnectMapping(record: "ElevationGainedRecord", permission: "ELEVATION_GAINED", readable: true, writable: true), fieldUnits: ["meters": "m"]),
    .environmentalAudioExposure: TypeInfo(type: .environmentalAudioExposure, category: .environment, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierEnvironmentalAudioExposure", identifiers: ["HKQuantityTypeIdentifierEnvironmentalAudioExposure"], fields: [:], unit: "dBASPL", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["decibels": "dB(A)"]),
    .environmentalAudioExposureEvent: TypeInfo(type: .environmentalAudioExposureEvent, category: .environment, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierAudioExposureEvent", identifiers: ["HKCategoryTypeIdentifierAudioExposureEvent"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .environmentalSoundReduction: TypeInfo(type: .environmentalSoundReduction, category: .environment, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierEnvironmentalSoundReduction", identifiers: ["HKQuantityTypeIdentifierEnvironmentalSoundReduction"], fields: [:], unit: "dBASPL", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 16"), healthConnect: nil, fieldUnits: ["decibels": "dB(A)"]),
    .estimatedWorkoutEffortScore: TypeInfo(type: .estimatedWorkoutEffortScore, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierEstimatedWorkoutEffortScore", identifiers: ["HKQuantityTypeIdentifierEstimatedWorkoutEffortScore"], fields: [:], unit: "appleEffortScore", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["score": "score"]),
    .exerciseRoute: TypeInfo(type: .exerciseRoute, category: .activity, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .series, identifier: "HKWorkoutRouteTypeIdentifier", identifiers: ["HKWorkoutRouteTypeIdentifier"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "ExerciseRoute", permission: "EXERCISE_ROUTE", readable: false, writable: true), fieldUnits: [:]),
    .exerciseSession: TypeInfo(type: .exerciseSession, category: .activity, kind: .session, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .workout, identifier: "HKWorkoutTypeIdentifier", identifiers: ["HKWorkoutTypeIdentifier"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "ExerciseSessionRecord", permission: "EXERCISE", readable: true, writable: true), fieldUnits: [:]),
    .floorsClimbed: TypeInfo(type: .floorsClimbed, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierFlightsClimbed", identifiers: ["HKQuantityTypeIdentifierFlightsClimbed"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "FloorsClimbedRecord", permission: "FLOORS_CLIMBED", readable: true, writable: true), fieldUnits: ["count": "count"]),
    .forcedExpiratoryVolume1: TypeInfo(type: .forcedExpiratoryVolume1, category: .respiratory, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierForcedExpiratoryVolume1", identifiers: ["HKQuantityTypeIdentifierForcedExpiratoryVolume1"], fields: [:], unit: "L", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["liters": "L"]),
    .forcedVitalCapacity: TypeInfo(type: .forcedVitalCapacity, category: .respiratory, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierForcedVitalCapacity", identifiers: ["HKQuantityTypeIdentifierForcedVitalCapacity"], fields: [:], unit: "L", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["liters": "L"]),
    .handwashingEvent: TypeInfo(type: .handwashingEvent, category: .wellness, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierHandwashingEvent", identifiers: ["HKCategoryTypeIdentifierHandwashingEvent"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .headphoneAudioExposure: TypeInfo(type: .headphoneAudioExposure, category: .environment, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierHeadphoneAudioExposure", identifiers: ["HKQuantityTypeIdentifierHeadphoneAudioExposure"], fields: [:], unit: "dBASPL", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["decibels": "dB(A)"]),
    .headphoneAudioExposureEvent: TypeInfo(type: .headphoneAudioExposureEvent, category: .environment, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierHeadphoneAudioExposureEvent", identifiers: ["HKCategoryTypeIdentifierHeadphoneAudioExposureEvent"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .heartRate: TypeInfo(type: .heartRate, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max, .count], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierHeartRate", identifiers: ["HKQuantityTypeIdentifierHeartRate"], fields: [:], unit: "count/min", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "HeartRateRecord", permission: "HEART_RATE", readable: true, writable: true), fieldUnits: ["bpm": "beats/min"]),
    .heartRateRecoveryOneMinute: TypeInfo(type: .heartRateRecoveryOneMinute, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierHeartRateRecoveryOneMinute", identifiers: ["HKQuantityTypeIdentifierHeartRateRecoveryOneMinute"], fields: [:], unit: "count/min", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 16"), healthConnect: nil, fieldUnits: ["bpm": "beats/min"]),
    .heartbeatSeries: TypeInfo(type: .heartbeatSeries, category: .vitals, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .heartbeatSeries, identifier: "HKDataTypeIdentifierHeartbeatSeries", identifiers: ["HKDataTypeIdentifierHeartbeatSeries"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: "iOS 13"), healthConnect: nil, fieldUnits: ["count": "count"]),
    .height: TypeInfo(type: .height, category: .body, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierHeight", identifiers: ["HKQuantityTypeIdentifierHeight"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "HeightRecord", permission: "HEIGHT", readable: true, writable: true), fieldUnits: ["meters": "m"]),
    .highHeartRateEvent: TypeInfo(type: .highHeartRateEvent, category: .vitals, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierHighHeartRateEvent", identifiers: ["HKCategoryTypeIdentifierHighHeartRateEvent"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .hrvRmssd: TypeInfo(type: .hrvRmssd, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: nil, healthConnect: HealthConnectMapping(record: "HeartRateVariabilityRmssdRecord", permission: "HEART_RATE_VARIABILITY", readable: true, writable: true), fieldUnits: ["milliseconds": "ms"]),
    .hrvSdnn: TypeInfo(type: .hrvSdnn, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierHeartRateVariabilitySDNN", identifiers: ["HKQuantityTypeIdentifierHeartRateVariabilitySDNN"], fields: [:], unit: "ms", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["milliseconds": "ms"]),
    .hydration: TypeInfo(type: .hydration, category: .nutrition, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierDietaryWater", identifiers: ["HKQuantityTypeIdentifierDietaryWater"], fields: [:], unit: "L", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "HydrationRecord", permission: "HYDRATION", readable: true, writable: true), fieldUnits: ["liters": "L"]),
    .infrequentMenstrualCycles: TypeInfo(type: .infrequentMenstrualCycles, category: .cycle, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierInfrequentMenstrualCycles", identifiers: ["HKCategoryTypeIdentifierInfrequentMenstrualCycles"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .inhalerUsage: TypeInfo(type: .inhalerUsage, category: .respiratory, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierInhalerUsage", identifiers: ["HKQuantityTypeIdentifierInhalerUsage"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["count": "count"]),
    .insulinDelivery: TypeInfo(type: .insulinDelivery, category: .vitals, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierInsulinDelivery", identifiers: ["HKQuantityTypeIdentifierInsulinDelivery"], fields: [:], unit: "IU", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["internationalUnits": "IU"]),
    .intermenstrualBleeding: TypeInfo(type: .intermenstrualBleeding, category: .cycle, kind: .sample, aggregate: [.count], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierIntermenstrualBleeding", identifiers: ["HKCategoryTypeIdentifierIntermenstrualBleeding"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "IntermenstrualBleedingRecord", permission: "INTERMENSTRUAL_BLEEDING", readable: true, writable: true), fieldUnits: [:]),
    .irregularHeartRhythmEvent: TypeInfo(type: .irregularHeartRhythmEvent, category: .vitals, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierIrregularHeartRhythmEvent", identifiers: ["HKCategoryTypeIdentifierIrregularHeartRhythmEvent"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .irregularMenstrualCycles: TypeInfo(type: .irregularMenstrualCycles, category: .cycle, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierIrregularMenstrualCycles", identifiers: ["HKCategoryTypeIdentifierIrregularMenstrualCycles"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .lactation: TypeInfo(type: .lactation, category: .cycle, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierLactation", identifiers: ["HKCategoryTypeIdentifierLactation"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .leanBodyMass: TypeInfo(type: .leanBodyMass, category: .body, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierLeanBodyMass", identifiers: ["HKQuantityTypeIdentifierLeanBodyMass"], fields: [:], unit: "kg", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "LeanBodyMassRecord", permission: "LEAN_BODY_MASS", readable: true, writable: true), fieldUnits: ["kilograms": "kg"]),
    .lowCardioFitnessEvent: TypeInfo(type: .lowCardioFitnessEvent, category: .vitals, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierLowCardioFitnessEvent", identifiers: ["HKCategoryTypeIdentifierLowCardioFitnessEvent"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .lowHeartRateEvent: TypeInfo(type: .lowHeartRateEvent, category: .vitals, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierLowHeartRateEvent", identifiers: ["HKCategoryTypeIdentifierLowHeartRateEvent"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .medicationDose: TypeInfo(type: .medicationDose, category: .clinical, kind: .sample, aggregate: [.count], healthKit: HealthKitMapping(kind: .medicationDose, identifier: "HKDataTypeIdentifierMedicationDoseEvent", identifiers: ["HKDataTypeIdentifierMedicationDoseEvent"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: false, since: "iOS 26"), healthConnect: nil, fieldUnits: ["scheduledDose": "dose", "dose": "dose"]),
    .menstruationFlow: TypeInfo(type: .menstruationFlow, category: .cycle, kind: .interval, aggregate: [.count], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierMenstrualFlow", identifiers: ["HKCategoryTypeIdentifierMenstrualFlow"], fields: [:], unit: nil, values: ["unknown": 1, "light": 2, "medium": 3, "heavy": 4, "none": 5], valueField: "flow", readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "MenstruationFlowRecord", permission: "MENSTRUATION", readable: true, writable: true), fieldUnits: [:]),
    .menstruationPeriod: TypeInfo(type: .menstruationPeriod, category: .cycle, kind: .interval, aggregate: [.count, .duration], healthKit: nil, healthConnect: HealthConnectMapping(record: "MenstruationPeriodRecord", permission: "MENSTRUATION", readable: true, writable: true), fieldUnits: [:]),
    .mindfulnessSession: TypeInfo(type: .mindfulnessSession, category: .wellness, kind: .session, aggregate: [.duration, .count], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierMindfulSession", identifiers: ["HKCategoryTypeIdentifierMindfulSession"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "MindfulnessSessionRecord", permission: "MINDFULNESS", readable: true, writable: true), fieldUnits: [:]),
    .nikeFuel: TypeInfo(type: .nikeFuel, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierNikeFuel", identifiers: ["HKQuantityTypeIdentifierNikeFuel"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["count": "count"]),
    .numberOfAlcoholicBeverages: TypeInfo(type: .numberOfAlcoholicBeverages, category: .nutrition, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierNumberOfAlcoholicBeverages", identifiers: ["HKQuantityTypeIdentifierNumberOfAlcoholicBeverages"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 15"), healthConnect: nil, fieldUnits: ["count": "count"]),
    .numberOfTimesFallen: TypeInfo(type: .numberOfTimesFallen, category: .mobility, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierNumberOfTimesFallen", identifiers: ["HKQuantityTypeIdentifierNumberOfTimesFallen"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["count": "count"]),
    .nutrition: TypeInfo(type: .nutrition, category: .nutrition, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .multi, identifier: nil, identifiers: ["HKQuantityTypeIdentifierDietaryEnergyConsumed", "HKQuantityTypeIdentifierDietaryProtein", "HKQuantityTypeIdentifierDietaryCarbohydrates", "HKQuantityTypeIdentifierDietaryFatTotal", "HKQuantityTypeIdentifierDietaryFatSaturated", "HKQuantityTypeIdentifierDietaryFatMonounsaturated", "HKQuantityTypeIdentifierDietaryFatPolyunsaturated", "HKQuantityTypeIdentifierDietaryFiber", "HKQuantityTypeIdentifierDietarySugar", "HKQuantityTypeIdentifierDietaryCholesterol", "HKQuantityTypeIdentifierDietarySodium", "HKQuantityTypeIdentifierDietaryPotassium", "HKQuantityTypeIdentifierDietaryCalcium", "HKQuantityTypeIdentifierDietaryIron", "HKQuantityTypeIdentifierDietaryMagnesium", "HKQuantityTypeIdentifierDietaryPhosphorus", "HKQuantityTypeIdentifierDietaryZinc", "HKQuantityTypeIdentifierDietaryCopper", "HKQuantityTypeIdentifierDietaryManganese", "HKQuantityTypeIdentifierDietaryChloride", "HKQuantityTypeIdentifierDietarySelenium", "HKQuantityTypeIdentifierDietaryIodine", "HKQuantityTypeIdentifierDietaryChromium", "HKQuantityTypeIdentifierDietaryMolybdenum", "HKQuantityTypeIdentifierDietaryVitaminA", "HKQuantityTypeIdentifierDietaryVitaminB6", "HKQuantityTypeIdentifierDietaryVitaminB12", "HKQuantityTypeIdentifierDietaryVitaminC", "HKQuantityTypeIdentifierDietaryVitaminD", "HKQuantityTypeIdentifierDietaryVitaminE", "HKQuantityTypeIdentifierDietaryVitaminK", "HKQuantityTypeIdentifierDietaryThiamin", "HKQuantityTypeIdentifierDietaryRiboflavin", "HKQuantityTypeIdentifierDietaryNiacin", "HKQuantityTypeIdentifierDietaryFolate", "HKQuantityTypeIdentifierDietaryBiotin", "HKQuantityTypeIdentifierDietaryPantothenicAcid", "HKQuantityTypeIdentifierDietaryCaffeine"], fields: ["kilocalories": "HKQuantityTypeIdentifierDietaryEnergyConsumed", "proteinGrams": "HKQuantityTypeIdentifierDietaryProtein", "carbohydrateGrams": "HKQuantityTypeIdentifierDietaryCarbohydrates", "fatGrams": "HKQuantityTypeIdentifierDietaryFatTotal", "fatSaturatedGrams": "HKQuantityTypeIdentifierDietaryFatSaturated", "fatMonounsaturatedGrams": "HKQuantityTypeIdentifierDietaryFatMonounsaturated", "fatPolyunsaturatedGrams": "HKQuantityTypeIdentifierDietaryFatPolyunsaturated", "fiberGrams": "HKQuantityTypeIdentifierDietaryFiber", "sugarGrams": "HKQuantityTypeIdentifierDietarySugar", "cholesterolMilligrams": "HKQuantityTypeIdentifierDietaryCholesterol", "sodiumMilligrams": "HKQuantityTypeIdentifierDietarySodium", "potassiumMilligrams": "HKQuantityTypeIdentifierDietaryPotassium", "calciumMilligrams": "HKQuantityTypeIdentifierDietaryCalcium", "ironMilligrams": "HKQuantityTypeIdentifierDietaryIron", "magnesiumMilligrams": "HKQuantityTypeIdentifierDietaryMagnesium", "phosphorusMilligrams": "HKQuantityTypeIdentifierDietaryPhosphorus", "zincMilligrams": "HKQuantityTypeIdentifierDietaryZinc", "copperMilligrams": "HKQuantityTypeIdentifierDietaryCopper", "manganeseMilligrams": "HKQuantityTypeIdentifierDietaryManganese", "chlorideMilligrams": "HKQuantityTypeIdentifierDietaryChloride", "seleniumMicrograms": "HKQuantityTypeIdentifierDietarySelenium", "iodineMicrograms": "HKQuantityTypeIdentifierDietaryIodine", "chromiumMicrograms": "HKQuantityTypeIdentifierDietaryChromium", "molybdenumMicrograms": "HKQuantityTypeIdentifierDietaryMolybdenum", "vitaminAMicrograms": "HKQuantityTypeIdentifierDietaryVitaminA", "vitaminB6Milligrams": "HKQuantityTypeIdentifierDietaryVitaminB6", "vitaminB12Micrograms": "HKQuantityTypeIdentifierDietaryVitaminB12", "vitaminCMilligrams": "HKQuantityTypeIdentifierDietaryVitaminC", "vitaminDMicrograms": "HKQuantityTypeIdentifierDietaryVitaminD", "vitaminEMilligrams": "HKQuantityTypeIdentifierDietaryVitaminE", "vitaminKMicrograms": "HKQuantityTypeIdentifierDietaryVitaminK", "thiaminMilligrams": "HKQuantityTypeIdentifierDietaryThiamin", "riboflavinMilligrams": "HKQuantityTypeIdentifierDietaryRiboflavin", "niacinMilligrams": "HKQuantityTypeIdentifierDietaryNiacin", "folateMicrograms": "HKQuantityTypeIdentifierDietaryFolate", "biotinMicrograms": "HKQuantityTypeIdentifierDietaryBiotin", "pantothenicAcidMilligrams": "HKQuantityTypeIdentifierDietaryPantothenicAcid", "caffeineMilligrams": "HKQuantityTypeIdentifierDietaryCaffeine"], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "NutritionRecord", permission: "NUTRITION", readable: true, writable: true), fieldUnits: ["kilocalories": "kcal", "energyFromFatKilocalories": "kcal", "proteinGrams": "g", "carbohydrateGrams": "g", "fatGrams": "g", "fatSaturatedGrams": "g", "fatMonounsaturatedGrams": "g", "fatPolyunsaturatedGrams": "g", "transFatGrams": "g", "unsaturatedFatGrams": "g", "fiberGrams": "g", "sugarGrams": "g", "cholesterolMilligrams": "mg", "sodiumMilligrams": "mg", "potassiumMilligrams": "mg", "calciumMilligrams": "mg", "ironMilligrams": "mg", "magnesiumMilligrams": "mg", "phosphorusMilligrams": "mg", "zincMilligrams": "mg", "copperMilligrams": "mg", "manganeseMilligrams": "mg", "chlorideMilligrams": "mg", "seleniumMicrograms": "mcg", "iodineMicrograms": "mcg", "chromiumMicrograms": "mcg", "molybdenumMicrograms": "mcg", "vitaminAMicrograms": "mcg", "vitaminB6Milligrams": "mg", "vitaminB12Micrograms": "mcg", "vitaminCMilligrams": "mg", "vitaminDMicrograms": "mcg", "vitaminEMilligrams": "mg", "vitaminKMicrograms": "mcg", "thiaminMilligrams": "mg", "riboflavinMilligrams": "mg", "niacinMilligrams": "mg", "folateMicrograms": "mcg", "folicAcidMicrograms": "mcg", "biotinMicrograms": "mcg", "pantothenicAcidMilligrams": "mg", "caffeineMilligrams": "mg"]),
    .ovulationTest: TypeInfo(type: .ovulationTest, category: .cycle, kind: .sample, aggregate: [.count], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierOvulationTestResult", identifiers: ["HKCategoryTypeIdentifierOvulationTestResult"], fields: [:], unit: nil, values: ["negative": 1, "positive": 2, "inconclusive": 3, "high": 4], valueField: "result", readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "OvulationTestRecord", permission: "OVULATION_TEST", readable: true, writable: true), fieldUnits: [:]),
    .oxygenSaturation: TypeInfo(type: .oxygenSaturation, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierOxygenSaturation", identifiers: ["HKQuantityTypeIdentifierOxygenSaturation"], fields: [:], unit: "%", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "OxygenSaturationRecord", permission: "OXYGEN_SATURATION", readable: true, writable: true), fieldUnits: ["percent": "%"]),
    .paddleSportsSpeed: TypeInfo(type: .paddleSportsSpeed, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierPaddleSportsSpeed", identifiers: ["HKQuantityTypeIdentifierPaddleSportsSpeed"], fields: [:], unit: "m/s", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["metersPerSecond": "m/s"]),
    .peakExpiratoryFlowRate: TypeInfo(type: .peakExpiratoryFlowRate, category: .respiratory, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierPeakExpiratoryFlowRate", identifiers: ["HKQuantityTypeIdentifierPeakExpiratoryFlowRate"], fields: [:], unit: "L/min", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["litersPerMinute": "L/min"]),
    .peripheralPerfusionIndex: TypeInfo(type: .peripheralPerfusionIndex, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierPeripheralPerfusionIndex", identifiers: ["HKQuantityTypeIdentifierPeripheralPerfusionIndex"], fields: [:], unit: "%", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["percent": "%"]),
    .persistentIntermenstrualBleeding: TypeInfo(type: .persistentIntermenstrualBleeding, category: .cycle, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierPersistentIntermenstrualBleeding", identifiers: ["HKCategoryTypeIdentifierPersistentIntermenstrualBleeding"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .physicalEffort: TypeInfo(type: .physicalEffort, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierPhysicalEffort", identifiers: ["HKQuantityTypeIdentifierPhysicalEffort"], fields: [:], unit: "kcal/(kg*hr)", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 17"), healthConnect: nil, fieldUnits: ["metsEquivalent": "kcal/(kg·h)"]),
    .power: TypeInfo(type: .power, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: nil, healthConnect: HealthConnectMapping(record: "PowerRecord", permission: "POWER", readable: true, writable: true), fieldUnits: ["watts": "W"]),
    .pregnancy: TypeInfo(type: .pregnancy, category: .cycle, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierPregnancy", identifiers: ["HKCategoryTypeIdentifierPregnancy"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .pregnancyTest: TypeInfo(type: .pregnancyTest, category: .cycle, kind: .sample, aggregate: [.count], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierPregnancyTestResult", identifiers: ["HKCategoryTypeIdentifierPregnancyTestResult"], fields: [:], unit: nil, values: ["negative": 1, "positive": 2, "indeterminate": 3], valueField: "result", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .progesteroneTest: TypeInfo(type: .progesteroneTest, category: .cycle, kind: .sample, aggregate: [.count], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierProgesteroneTestResult", identifiers: ["HKCategoryTypeIdentifierProgesteroneTestResult"], fields: [:], unit: nil, values: ["negative": 1, "positive": 2, "indeterminate": 3], valueField: "result", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .prolongedMenstrualPeriods: TypeInfo(type: .prolongedMenstrualPeriods, category: .cycle, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierProlongedMenstrualPeriods", identifiers: ["HKCategoryTypeIdentifierProlongedMenstrualPeriods"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .respiratoryRate: TypeInfo(type: .respiratoryRate, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierRespiratoryRate", identifiers: ["HKQuantityTypeIdentifierRespiratoryRate"], fields: [:], unit: "count/min", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "RespiratoryRateRecord", permission: "RESPIRATORY_RATE", readable: true, writable: true), fieldUnits: ["breathsPerMinute": "breaths/min"]),
    .restingHeartRate: TypeInfo(type: .restingHeartRate, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierRestingHeartRate", identifiers: ["HKQuantityTypeIdentifierRestingHeartRate"], fields: [:], unit: "count/min", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "RestingHeartRateRecord", permission: "RESTING_HEART_RATE", readable: true, writable: true), fieldUnits: ["bpm": "beats/min"]),
    .rowingSpeed: TypeInfo(type: .rowingSpeed, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierRowingSpeed", identifiers: ["HKQuantityTypeIdentifierRowingSpeed"], fields: [:], unit: "m/s", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["metersPerSecond": "m/s"]),
    .runningGroundContactTime: TypeInfo(type: .runningGroundContactTime, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierRunningGroundContactTime", identifiers: ["HKQuantityTypeIdentifierRunningGroundContactTime"], fields: [:], unit: "ms", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 16"), healthConnect: nil, fieldUnits: ["milliseconds": "ms"]),
    .runningPower: TypeInfo(type: .runningPower, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierRunningPower", identifiers: ["HKQuantityTypeIdentifierRunningPower"], fields: [:], unit: "W", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 16"), healthConnect: nil, fieldUnits: ["watts": "W"]),
    .runningSpeed: TypeInfo(type: .runningSpeed, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierRunningSpeed", identifiers: ["HKQuantityTypeIdentifierRunningSpeed"], fields: [:], unit: "m/s", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 16"), healthConnect: nil, fieldUnits: ["metersPerSecond": "m/s"]),
    .runningStrideLength: TypeInfo(type: .runningStrideLength, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierRunningStrideLength", identifiers: ["HKQuantityTypeIdentifierRunningStrideLength"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 16"), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .runningVerticalOscillation: TypeInfo(type: .runningVerticalOscillation, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierRunningVerticalOscillation", identifiers: ["HKQuantityTypeIdentifierRunningVerticalOscillation"], fields: [:], unit: "cm", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 16"), healthConnect: nil, fieldUnits: ["centimeters": "cm"]),
    .sexualActivity: TypeInfo(type: .sexualActivity, category: .cycle, kind: .sample, aggregate: [.count], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierSexualActivity", identifiers: ["HKCategoryTypeIdentifierSexualActivity"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "SexualActivityRecord", permission: "SEXUAL_ACTIVITY", readable: true, writable: true), fieldUnits: [:]),
    .sixMinuteWalkDistance: TypeInfo(type: .sixMinuteWalkDistance, category: .mobility, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierSixMinuteWalkTestDistance", identifiers: ["HKQuantityTypeIdentifierSixMinuteWalkTestDistance"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .skinTemperature: TypeInfo(type: .skinTemperature, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: nil, healthConnect: HealthConnectMapping(record: "SkinTemperatureRecord", permission: "SKIN_TEMPERATURE", readable: true, writable: true), fieldUnits: ["deltaCelsius": "°C", "baselineCelsius": "°C"]),
    .sleepApneaEvent: TypeInfo(type: .sleepApneaEvent, category: .sleep, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierSleepApneaEvent", identifiers: ["HKCategoryTypeIdentifierSleepApneaEvent"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: [:]),
    .sleepSession: TypeInfo(type: .sleepSession, category: .sleep, kind: .session, aggregate: [.duration, .count], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierSleepAnalysis", identifiers: ["HKCategoryTypeIdentifierSleepAnalysis"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "SleepSessionRecord", permission: "SLEEP", readable: true, writable: true), fieldUnits: [:]),
    .speed: TypeInfo(type: .speed, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: nil, healthConnect: HealthConnectMapping(record: "SpeedRecord", permission: "SPEED", readable: true, writable: true), fieldUnits: ["metersPerSecond": "m/s"]),
    .stairAscentSpeed: TypeInfo(type: .stairAscentSpeed, category: .mobility, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierStairAscentSpeed", identifiers: ["HKQuantityTypeIdentifierStairAscentSpeed"], fields: [:], unit: "m/s", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["metersPerSecond": "m/s"]),
    .stairDescentSpeed: TypeInfo(type: .stairDescentSpeed, category: .mobility, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierStairDescentSpeed", identifiers: ["HKQuantityTypeIdentifierStairDescentSpeed"], fields: [:], unit: "m/s", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["metersPerSecond": "m/s"]),
    .stateOfMind: TypeInfo(type: .stateOfMind, category: .mind, kind: .sample, aggregate: [.count, .avg, .min, .max], healthKit: HealthKitMapping(kind: .stateOfMind, identifier: "HKDataTypeIdentifierStateOfMind", identifiers: ["HKDataTypeIdentifierStateOfMind"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["valence": "valence"]),
    .steps: TypeInfo(type: .steps, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierStepCount", identifiers: ["HKQuantityTypeIdentifierStepCount"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "StepsRecord", permission: "STEPS", readable: true, writable: true), fieldUnits: ["count": "count"]),
    .stepsCadence: TypeInfo(type: .stepsCadence, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: nil, healthConnect: HealthConnectMapping(record: "StepsCadenceRecord", permission: "STEPS_CADENCE", readable: true, writable: true), fieldUnits: ["stepsPerMinute": "steps/min"]),
    .swimmingStrokeCount: TypeInfo(type: .swimmingStrokeCount, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierSwimmingStrokeCount", identifiers: ["HKQuantityTypeIdentifierSwimmingStrokeCount"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["count": "count"]),
    .symptomAbdominalCramps: TypeInfo(type: .symptomAbdominalCramps, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierAbdominalCramps", identifiers: ["HKCategoryTypeIdentifierAbdominalCramps"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomAcne: TypeInfo(type: .symptomAcne, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierAcne", identifiers: ["HKCategoryTypeIdentifierAcne"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomAppetiteChanges: TypeInfo(type: .symptomAppetiteChanges, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierAppetiteChanges", identifiers: ["HKCategoryTypeIdentifierAppetiteChanges"], fields: [:], unit: nil, values: ["unspecified": 0, "no_change": 1, "decreased": 2, "increased": 3], valueField: "change", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomBladderIncontinence: TypeInfo(type: .symptomBladderIncontinence, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierBladderIncontinence", identifiers: ["HKCategoryTypeIdentifierBladderIncontinence"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomBloating: TypeInfo(type: .symptomBloating, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierBloating", identifiers: ["HKCategoryTypeIdentifierBloating"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomBreastPain: TypeInfo(type: .symptomBreastPain, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierBreastPain", identifiers: ["HKCategoryTypeIdentifierBreastPain"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomChestTightnessOrPain: TypeInfo(type: .symptomChestTightnessOrPain, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierChestTightnessOrPain", identifiers: ["HKCategoryTypeIdentifierChestTightnessOrPain"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomChills: TypeInfo(type: .symptomChills, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierChills", identifiers: ["HKCategoryTypeIdentifierChills"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomConstipation: TypeInfo(type: .symptomConstipation, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierConstipation", identifiers: ["HKCategoryTypeIdentifierConstipation"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomCoughing: TypeInfo(type: .symptomCoughing, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierCoughing", identifiers: ["HKCategoryTypeIdentifierCoughing"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomDiarrhea: TypeInfo(type: .symptomDiarrhea, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierDiarrhea", identifiers: ["HKCategoryTypeIdentifierDiarrhea"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomDizziness: TypeInfo(type: .symptomDizziness, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierDizziness", identifiers: ["HKCategoryTypeIdentifierDizziness"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomDrySkin: TypeInfo(type: .symptomDrySkin, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierDrySkin", identifiers: ["HKCategoryTypeIdentifierDrySkin"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomFainting: TypeInfo(type: .symptomFainting, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierFainting", identifiers: ["HKCategoryTypeIdentifierFainting"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomFatigue: TypeInfo(type: .symptomFatigue, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierFatigue", identifiers: ["HKCategoryTypeIdentifierFatigue"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomFever: TypeInfo(type: .symptomFever, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierFever", identifiers: ["HKCategoryTypeIdentifierFever"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomGeneralizedBodyAche: TypeInfo(type: .symptomGeneralizedBodyAche, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierGeneralizedBodyAche", identifiers: ["HKCategoryTypeIdentifierGeneralizedBodyAche"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomHairLoss: TypeInfo(type: .symptomHairLoss, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierHairLoss", identifiers: ["HKCategoryTypeIdentifierHairLoss"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomHeadache: TypeInfo(type: .symptomHeadache, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierHeadache", identifiers: ["HKCategoryTypeIdentifierHeadache"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomHeartburn: TypeInfo(type: .symptomHeartburn, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierHeartburn", identifiers: ["HKCategoryTypeIdentifierHeartburn"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomHotFlashes: TypeInfo(type: .symptomHotFlashes, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierHotFlashes", identifiers: ["HKCategoryTypeIdentifierHotFlashes"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomLossOfSmell: TypeInfo(type: .symptomLossOfSmell, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierLossOfSmell", identifiers: ["HKCategoryTypeIdentifierLossOfSmell"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomLossOfTaste: TypeInfo(type: .symptomLossOfTaste, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierLossOfTaste", identifiers: ["HKCategoryTypeIdentifierLossOfTaste"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomLowerBackPain: TypeInfo(type: .symptomLowerBackPain, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierLowerBackPain", identifiers: ["HKCategoryTypeIdentifierLowerBackPain"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomMemoryLapse: TypeInfo(type: .symptomMemoryLapse, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierMemoryLapse", identifiers: ["HKCategoryTypeIdentifierMemoryLapse"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomMoodChanges: TypeInfo(type: .symptomMoodChanges, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierMoodChanges", identifiers: ["HKCategoryTypeIdentifierMoodChanges"], fields: [:], unit: nil, values: ["present": 0, "not_present": 1], valueField: "presence", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomNausea: TypeInfo(type: .symptomNausea, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierNausea", identifiers: ["HKCategoryTypeIdentifierNausea"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomNightSweats: TypeInfo(type: .symptomNightSweats, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierNightSweats", identifiers: ["HKCategoryTypeIdentifierNightSweats"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomPelvicPain: TypeInfo(type: .symptomPelvicPain, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierPelvicPain", identifiers: ["HKCategoryTypeIdentifierPelvicPain"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomRapidPoundingOrFlutteringHeartbeat: TypeInfo(type: .symptomRapidPoundingOrFlutteringHeartbeat, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat", identifiers: ["HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomRunnyNose: TypeInfo(type: .symptomRunnyNose, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierRunnyNose", identifiers: ["HKCategoryTypeIdentifierRunnyNose"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomShortnessOfBreath: TypeInfo(type: .symptomShortnessOfBreath, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierShortnessOfBreath", identifiers: ["HKCategoryTypeIdentifierShortnessOfBreath"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomSinusCongestion: TypeInfo(type: .symptomSinusCongestion, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierSinusCongestion", identifiers: ["HKCategoryTypeIdentifierSinusCongestion"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomSkippedHeartbeat: TypeInfo(type: .symptomSkippedHeartbeat, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierSkippedHeartbeat", identifiers: ["HKCategoryTypeIdentifierSkippedHeartbeat"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomSleepChanges: TypeInfo(type: .symptomSleepChanges, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierSleepChanges", identifiers: ["HKCategoryTypeIdentifierSleepChanges"], fields: [:], unit: nil, values: ["present": 0, "not_present": 1], valueField: "presence", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomSoreThroat: TypeInfo(type: .symptomSoreThroat, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierSoreThroat", identifiers: ["HKCategoryTypeIdentifierSoreThroat"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomVaginalDryness: TypeInfo(type: .symptomVaginalDryness, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierVaginalDryness", identifiers: ["HKCategoryTypeIdentifierVaginalDryness"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomVomiting: TypeInfo(type: .symptomVomiting, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierVomiting", identifiers: ["HKCategoryTypeIdentifierVomiting"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .symptomWheezing: TypeInfo(type: .symptomWheezing, category: .symptom, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierWheezing", identifiers: ["HKCategoryTypeIdentifierWheezing"], fields: [:], unit: nil, values: ["unspecified": 0, "not_present": 1, "mild": 2, "moderate": 3, "severe": 4], valueField: "severity", readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .timeInDaylight: TypeInfo(type: .timeInDaylight, category: .environment, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierTimeInDaylight", identifiers: ["HKQuantityTypeIdentifierTimeInDaylight"], fields: [:], unit: "min", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 17"), healthConnect: nil, fieldUnits: ["minutes": "min"]),
    .toothbrushingEvent: TypeInfo(type: .toothbrushingEvent, category: .wellness, kind: .interval, aggregate: [.count, .duration], healthKit: HealthKitMapping(kind: .category, identifier: "HKCategoryTypeIdentifierToothbrushingEvent", identifiers: ["HKCategoryTypeIdentifierToothbrushingEvent"], fields: [:], unit: nil, values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: [:]),
    .totalEnergy: TypeInfo(type: .totalEnergy, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .derived, identifier: nil, identifiers: ["HKQuantityTypeIdentifierActiveEnergyBurned", "HKQuantityTypeIdentifierBasalEnergyBurned"], fields: [:], unit: "kcal", values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: HealthConnectMapping(record: "TotalCaloriesBurnedRecord", permission: "TOTAL_CALORIES_BURNED", readable: true, writable: true), fieldUnits: ["kilocalories": "kcal"]),
    .underwaterDepth: TypeInfo(type: .underwaterDepth, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierUnderwaterDepth", identifiers: ["HKQuantityTypeIdentifierUnderwaterDepth"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 16"), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .uvExposure: TypeInfo(type: .uvExposure, category: .environment, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierUVExposure", identifiers: ["HKQuantityTypeIdentifierUVExposure"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["uvIndex": "UV index"]),
    .vo2Max: TypeInfo(type: .vo2Max, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierVO2Max", identifiers: ["HKQuantityTypeIdentifierVO2Max"], fields: [:], unit: "ml/(kg*min)", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "Vo2MaxRecord", permission: "VO2_MAX", readable: true, writable: true), fieldUnits: ["mlPerKgPerMin": "mL/kg/min"]),
    .waistCircumference: TypeInfo(type: .waistCircumference, category: .body, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierWaistCircumference", identifiers: ["HKQuantityTypeIdentifierWaistCircumference"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .walkingAsymmetry: TypeInfo(type: .walkingAsymmetry, category: .mobility, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierWalkingAsymmetryPercentage", identifiers: ["HKQuantityTypeIdentifierWalkingAsymmetryPercentage"], fields: [:], unit: "%", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["percent": "%"]),
    .walkingDoubleSupport: TypeInfo(type: .walkingDoubleSupport, category: .mobility, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierWalkingDoubleSupportPercentage", identifiers: ["HKQuantityTypeIdentifierWalkingDoubleSupportPercentage"], fields: [:], unit: "%", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["percent": "%"]),
    .walkingHeartRateAverage: TypeInfo(type: .walkingHeartRateAverage, category: .vitals, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierWalkingHeartRateAverage", identifiers: ["HKQuantityTypeIdentifierWalkingHeartRateAverage"], fields: [:], unit: "count/min", values: [:], valueField: nil, readable: true, writable: false, since: nil), healthConnect: nil, fieldUnits: ["bpm": "beats/min"]),
    .walkingSpeed: TypeInfo(type: .walkingSpeed, category: .mobility, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierWalkingSpeed", identifiers: ["HKQuantityTypeIdentifierWalkingSpeed"], fields: [:], unit: "m/s", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["metersPerSecond": "m/s"]),
    .walkingStepLength: TypeInfo(type: .walkingStepLength, category: .mobility, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierWalkingStepLength", identifiers: ["HKQuantityTypeIdentifierWalkingStepLength"], fields: [:], unit: "m", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: nil, fieldUnits: ["meters": "m"]),
    .waterTemperature: TypeInfo(type: .waterTemperature, category: .environment, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierWaterTemperature", identifiers: ["HKQuantityTypeIdentifierWaterTemperature"], fields: [:], unit: "degC", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 16"), healthConnect: nil, fieldUnits: ["celsius": "°C"]),
    .weight: TypeInfo(type: .weight, category: .body, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierBodyMass", identifiers: ["HKQuantityTypeIdentifierBodyMass"], fields: [:], unit: "kg", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "WeightRecord", permission: "WEIGHT", readable: true, writable: true), fieldUnits: ["kilograms": "kg"]),
    .wheelchairPushes: TypeInfo(type: .wheelchairPushes, category: .activity, kind: .interval, aggregate: [.sum], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierPushCount", identifiers: ["HKQuantityTypeIdentifierPushCount"], fields: [:], unit: "count", values: [:], valueField: nil, readable: true, writable: true, since: nil), healthConnect: HealthConnectMapping(record: "WheelchairPushesRecord", permission: "WHEELCHAIR_PUSHES", readable: true, writable: true), fieldUnits: ["count": "count"]),
    .workoutEffortScore: TypeInfo(type: .workoutEffortScore, category: .activity, kind: .sample, aggregate: [.avg, .min, .max], healthKit: HealthKitMapping(kind: .quantity, identifier: "HKQuantityTypeIdentifierWorkoutEffortScore", identifiers: ["HKQuantityTypeIdentifierWorkoutEffortScore"], fields: [:], unit: "appleEffortScore", values: [:], valueField: nil, readable: true, writable: true, since: "iOS 18"), healthConnect: nil, fieldUnits: ["score": "score"]),
  ]

  /// Types both platforms persist (38).
  public static let crossPlatform: Set<HealthType> = [.activeEnergy, .basalBodyTemperature, .bloodGlucose, .bloodPressure, .bodyFat, .bodyTemperature, .cervicalMucus, .clinicalAllergy, .clinicalCondition, .clinicalImmunization, .clinicalLabResult, .clinicalMedication, .clinicalProcedure, .clinicalVitalSign, .cyclingCadence, .distance, .exerciseRoute, .exerciseSession, .floorsClimbed, .heartRate, .height, .hydration, .intermenstrualBleeding, .leanBodyMass, .menstruationFlow, .mindfulnessSession, .nutrition, .ovulationTest, .oxygenSaturation, .respiratoryRate, .restingHeartRate, .sexualActivity, .sleepSession, .steps, .totalEnergy, .vo2Max, .weight, .wheelchairPushes]

  /// Types only Apple HealthKit persists (129).
  public static let appleOnly: Set<HealthType> = [.activitySummary, .appleExerciseTime, .appleMoveTime, .appleSleepingBreathingDisturbances, .appleSleepingWristTemperature, .appleStandHour, .appleStandTime, .appleWalkingSteadiness, .appleWalkingSteadinessEvent, .atrialFibrillationBurden, .basalEnergy, .bleedingAfterPregnancy, .bleedingDuringPregnancy, .bloodAlcoholContent, .bodyMassIndex, .clinicalCoverage, .clinicalNote, .contraceptive, .crossCountrySkiingSpeed, .cyclingFunctionalThresholdPower, .cyclingPower, .cyclingSpeed, .distanceCrossCountrySkiing, .distanceCycling, .distanceDownhillSnowSports, .distancePaddleSports, .distanceRowing, .distanceSkatingSports, .distanceSwimming, .distanceWheelchair, .electrocardiogram, .electrodermalActivity, .environmentalAudioExposure, .environmentalAudioExposureEvent, .environmentalSoundReduction, .estimatedWorkoutEffortScore, .forcedExpiratoryVolume1, .forcedVitalCapacity, .handwashingEvent, .headphoneAudioExposure, .headphoneAudioExposureEvent, .heartRateRecoveryOneMinute, .heartbeatSeries, .highHeartRateEvent, .hrvSdnn, .infrequentMenstrualCycles, .inhalerUsage, .insulinDelivery, .irregularHeartRhythmEvent, .irregularMenstrualCycles, .lactation, .lowCardioFitnessEvent, .lowHeartRateEvent, .medicationDose, .nikeFuel, .numberOfAlcoholicBeverages, .numberOfTimesFallen, .paddleSportsSpeed, .peakExpiratoryFlowRate, .peripheralPerfusionIndex, .persistentIntermenstrualBleeding, .physicalEffort, .pregnancy, .pregnancyTest, .progesteroneTest, .prolongedMenstrualPeriods, .rowingSpeed, .runningGroundContactTime, .runningPower, .runningSpeed, .runningStrideLength, .runningVerticalOscillation, .sixMinuteWalkDistance, .sleepApneaEvent, .stairAscentSpeed, .stairDescentSpeed, .stateOfMind, .swimmingStrokeCount, .symptomAbdominalCramps, .symptomAcne, .symptomAppetiteChanges, .symptomBladderIncontinence, .symptomBloating, .symptomBreastPain, .symptomChestTightnessOrPain, .symptomChills, .symptomConstipation, .symptomCoughing, .symptomDiarrhea, .symptomDizziness, .symptomDrySkin, .symptomFainting, .symptomFatigue, .symptomFever, .symptomGeneralizedBodyAche, .symptomHairLoss, .symptomHeadache, .symptomHeartburn, .symptomHotFlashes, .symptomLossOfSmell, .symptomLossOfTaste, .symptomLowerBackPain, .symptomMemoryLapse, .symptomMoodChanges, .symptomNausea, .symptomNightSweats, .symptomPelvicPain, .symptomRapidPoundingOrFlutteringHeartbeat, .symptomRunnyNose, .symptomShortnessOfBreath, .symptomSinusCongestion, .symptomSkippedHeartbeat, .symptomSleepChanges, .symptomSoreThroat, .symptomVaginalDryness, .symptomVomiting, .symptomWheezing, .timeInDaylight, .toothbrushingEvent, .underwaterDepth, .uvExposure, .waistCircumference, .walkingAsymmetry, .walkingDoubleSupport, .walkingHeartRateAverage, .walkingSpeed, .walkingStepLength, .waterTemperature, .workoutEffortScore]

  /// Object type identifiers that must be authorized to use a type.
  public static func identifiers(for type: HealthType) -> [String] { types[type]?.healthKit?.identifiers ?? [] }

  /// Whether HealthKit backs this type at all.
  public static func isSupportedOnApple(_ type: HealthType) -> Bool { types[type]?.healthKit != nil }
}

public extension DeviceType {
  /// HealthKit constant this value maps to, as written in the specification.
  static let healthKitMapping: [DeviceType: String] = [
    .watch: "HKDevice.model contains \"Watch\"",
    .phone: "HKDevice.model contains \"iPhone\"",
  ]
  var healthKitValue: String? { Self.healthKitMapping[self] }
}

public extension ExerciseType {
  /// HealthKit constant this value maps to, as written in the specification.
  static let healthKitMapping: [ExerciseType: String] = [
    .americanFootball: "americanFootball",
    .australianFootball: "australianFootball",
    .badminton: "badminton",
    .baseball: "baseball",
    .basketball: "basketball",
    .bootCamp: "crossTraining",
    .boxing: "boxing",
    .calisthenics: "functionalStrengthTraining",
    .climbing: "climbing",
    .cricket: "cricket",
    .cycling: "cycling",
    .cyclingStationary: "cycling (HKMetadataKeyIndoorWorkout=true)",
    .dance: "dance",
    .discSports: "discSports",
    .elliptical: "elliptical",
    .exerciseClass: "mixedCardio",
    .fencing: "fencing",
    .golf: "golf",
    .guidedBreathing: "mindAndBody",
    .gymnastics: "gymnastics",
    .handball: "handball",
    .hiit: "highIntensityIntervalTraining",
    .hiking: "hiking",
    .iceHockey: "hockey",
    .iceSkating: "skatingSports",
    .martialArts: "martialArts",
    .paddling: "paddleSports",
    .pilates: "pilates",
    .racquetball: "racquetball",
    .rollerHockey: "hockey",
    .rowing: "rowing",
    .rowingMachine: "rowing (HKMetadataKeyIndoorWorkout=true)",
    .rugby: "rugby",
    .running: "running",
    .runningTreadmill: "running (HKMetadataKeyIndoorWorkout=true)",
    .sailing: "sailing",
    .scubaDiving: "underwaterDiving",
    .skating: "skatingSports",
    .skiing: "downhillSkiing",
    .snowboarding: "snowboarding",
    .snowshoeing: "snowSports",
    .soccer: "soccer",
    .softball: "softball",
    .squash: "squash",
    .stairClimbing: "stairs",
    .stairClimbingMachine: "stairClimbing",
    .strengthTraining: "traditionalStrengthTraining",
    .stretching: "flexibility",
    .surfing: "surfingSports",
    .swimmingOpenWater: "swimming (HKMetadataKeySwimmingLocationType=openWater)",
    .swimmingPool: "swimming (HKMetadataKeySwimmingLocationType=pool)",
    .tableTennis: "tableTennis",
    .tennis: "tennis",
    .volleyball: "volleyball",
    .walking: "walking",
    .waterPolo: "waterPolo",
    .weightlifting: "traditionalStrengthTraining",
    .wheelchair: "wheelchairWalkPace",
    .yoga: "yoga",
    .archery: "archery",
    .bowling: "bowling",
    .coreTraining: "coreTraining",
    .crossCountrySkiing: "crossCountrySkiing",
    .curling: "curling",
    .equestrian: "equestrianSports",
    .fishing: "fishing",
    .hunting: "hunting",
    .jumpRope: "jumpRope",
    .kickboxing: "kickboxing",
    .lacrosse: "lacrosse",
    .pickleball: "pickleball",
    .taiChi: "taiChi",
    .trackAndField: "trackAndField",
    .wrestling: "wrestling",
    .other: "other",
  ]
  var healthKitValue: String? { Self.healthKitMapping[self] }
}

public extension RecordingMethod {
  /// HealthKit constant this value maps to, as written in the specification.
  static let healthKitMapping: [RecordingMethod: String] = [
    .manual: "HKMetadataKeyWasUserEntered=true",
    .automatic: "HKMetadataKeyWasUserEntered≠true",
  ]
  var healthKitValue: String? { Self.healthKitMapping[self] }
}

public extension SleepStage {
  /// HealthKit constant this value maps to, as written in the specification.
  static let healthKitMapping: [SleepStage: String] = [
    .awake: "HKCategoryValueSleepAnalysis.awake",
    .inBed: "HKCategoryValueSleepAnalysis.inBed",
    .sleeping: "HKCategoryValueSleepAnalysis.asleepUnspecified",
    .light: "HKCategoryValueSleepAnalysis.asleepCore",
    .deep: "HKCategoryValueSleepAnalysis.asleepDeep",
    .rem: "HKCategoryValueSleepAnalysis.asleepREM",
  ]
  var healthKitValue: String? { Self.healthKitMapping[self] }
}

/**
 * Batch B1 — HealthKit quantity types not yet in the spec (iOS-only unless a Health Connect counterpart exists).
 * Unit strings are HKUnit descriptions; every entry is `verified: false` until checked on a device.
 */
import { enumOf, num, type Category, type Entry } from './write.js';

interface Q {
  id: string;
  identifier: string;
  unit: string;
  field: string;
  fieldUnit: string;
  description: string;
  category: Category;
  kind?: 'sample' | 'interval';
  since?: string;
  range?: [number | undefined, number | undefined];
  example: number;
  extra?: Record<string, unknown>;
  metadataFields?: NonNullable<NonNullable<Entry['hk']>['metadataFields']>;
}

const HKQ = 'HKQuantityTypeIdentifier';

const Q: Q[] = [
  // ---- distance by activity (HealthKit splits what Health Connect keeps in one DistanceRecord)
  { id: 'distance_cycling', identifier: 'DistanceCycling', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Distance cycled during the interval.', category: 'activity', kind: 'interval', example: 12800 },
  { id: 'distance_swimming', identifier: 'DistanceSwimming', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Distance swum during the interval.', category: 'activity', kind: 'interval', example: 1500 },
  { id: 'distance_wheelchair', identifier: 'DistanceWheelchair', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Distance travelled by wheelchair during the interval.', category: 'activity', kind: 'interval', example: 2400 },
  { id: 'distance_downhill_snow_sports', identifier: 'DistanceDownhillSnowSports', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Downhill skiing / snowboarding distance during the interval.', category: 'activity', kind: 'interval', example: 9800 },
  { id: 'distance_rowing', identifier: 'DistanceRowing', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Rowing distance during the interval.', category: 'activity', kind: 'interval', since: 'iOS 18', example: 5000 },
  { id: 'distance_paddle_sports', identifier: 'DistancePaddleSports', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Paddle-sports distance during the interval.', category: 'activity', kind: 'interval', since: 'iOS 18', example: 3000 },
  { id: 'distance_skating_sports', identifier: 'DistanceSkatingSports', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Skating distance during the interval.', category: 'activity', kind: 'interval', since: 'iOS 18', example: 4000 },
  { id: 'distance_cross_country_skiing', identifier: 'DistanceCrossCountrySkiing', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Cross-country skiing distance during the interval.', category: 'activity', kind: 'interval', since: 'iOS 18', example: 7000 },
  // ---- Apple activity rings components
  { id: 'apple_exercise_time', identifier: 'AppleExerciseTime', unit: 'min', field: 'minutes', fieldUnit: 'min', description: 'Minutes of brisk activity credited to the Exercise ring.', category: 'activity', kind: 'interval', example: 5 },
  { id: 'apple_stand_time', identifier: 'AppleStandTime', unit: 'min', field: 'minutes', fieldUnit: 'min', description: 'Minutes standing credited to the Stand ring.', category: 'activity', kind: 'interval', example: 3 },
  { id: 'apple_move_time', identifier: 'AppleMoveTime', unit: 'min', field: 'minutes', fieldUnit: 'min', description: 'Minutes of movement (Move ring in time mode).', category: 'activity', kind: 'interval', example: 4 },
  { id: 'swimming_stroke_count', identifier: 'SwimmingStrokeCount', unit: 'count', field: 'count', fieldUnit: 'count', description: 'Swimming strokes during the interval.', category: 'activity', kind: 'interval', example: 240 },
  { id: 'nike_fuel', identifier: 'NikeFuel', unit: 'count', field: 'count', fieldUnit: 'count', description: 'NikeFuel points during the interval (legacy).', category: 'activity', kind: 'interval', example: 120 },
  { id: 'physical_effort', identifier: 'PhysicalEffort', unit: 'kcal/(kg*hr)', field: 'metsEquivalent', fieldUnit: 'kcal/(kg·h)', description: 'Physical effort (MET-like) sample.', category: 'activity', since: 'iOS 17', example: 6.2 },
  { id: 'workout_effort_score', identifier: 'WorkoutEffortScore', unit: 'appleEffortScore', field: 'score', fieldUnit: 'score', description: 'User-rated workout effort (1–10).', category: 'activity', since: 'iOS 18', range: [1, 10], example: 7 },
  { id: 'estimated_workout_effort_score', identifier: 'EstimatedWorkoutEffortScore', unit: 'appleEffortScore', field: 'score', fieldUnit: 'score', description: 'System-estimated workout effort (1–10).', category: 'activity', since: 'iOS 18', range: [1, 10], example: 6 },
  { id: 'underwater_depth', identifier: 'UnderwaterDepth', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Depth below the water surface.', category: 'activity', since: 'iOS 16', range: [0, undefined], example: 12.4 },
  { id: 'water_temperature', identifier: 'WaterTemperature', unit: 'degC', field: 'celsius', fieldUnit: '°C', description: 'Water temperature sample.', category: 'environment', since: 'iOS 16', example: 21.5 },
  // ---- walking / mobility metrics
  { id: 'walking_speed', identifier: 'WalkingSpeed', unit: 'm/s', field: 'metersPerSecond', fieldUnit: 'm/s', description: 'Walking speed sample.', category: 'mobility', range: [0, undefined], example: 1.3 },
  { id: 'walking_step_length', identifier: 'WalkingStepLength', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Walking step length sample.', category: 'mobility', range: [0, undefined], example: 0.72 },
  { id: 'walking_asymmetry', identifier: 'WalkingAsymmetryPercentage', unit: '%', field: 'percent', fieldUnit: '%', description: 'Walking asymmetry (percentage of steps where one foot moves faster than the other).', category: 'mobility', range: [0, 100], example: 4 },
  { id: 'walking_double_support', identifier: 'WalkingDoubleSupportPercentage', unit: '%', field: 'percent', fieldUnit: '%', description: 'Time with both feet on the ground while walking, percentage.', category: 'mobility', range: [0, 100], example: 28 },
  { id: 'six_minute_walk_distance', identifier: 'SixMinuteWalkTestDistance', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Estimated six-minute walk test distance.', category: 'mobility', range: [0, undefined], example: 520 },
  { id: 'stair_ascent_speed', identifier: 'StairAscentSpeed', unit: 'm/s', field: 'metersPerSecond', fieldUnit: 'm/s', description: 'Stair ascent speed sample.', category: 'mobility', range: [0, undefined], example: 0.6 },
  { id: 'stair_descent_speed', identifier: 'StairDescentSpeed', unit: 'm/s', field: 'metersPerSecond', fieldUnit: 'm/s', description: 'Stair descent speed sample.', category: 'mobility', range: [0, undefined], example: 0.8 },
  { id: 'apple_walking_steadiness', identifier: 'AppleWalkingSteadiness', unit: '%', field: 'percent', fieldUnit: '%', description: 'Walking steadiness score.', category: 'mobility', range: [0, 100], example: 85 },
  // ---- running metrics
  { id: 'running_speed', identifier: 'RunningSpeed', unit: 'm/s', field: 'metersPerSecond', fieldUnit: 'm/s', description: 'Running speed sample.', category: 'activity', since: 'iOS 16', range: [0, undefined], example: 3.1 },
  { id: 'running_power', identifier: 'RunningPower', unit: 'W', field: 'watts', fieldUnit: 'W', description: 'Running power sample.', category: 'activity', since: 'iOS 16', range: [0, undefined], example: 260 },
  { id: 'running_stride_length', identifier: 'RunningStrideLength', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Running stride length sample.', category: 'activity', since: 'iOS 16', range: [0, undefined], example: 1.25 },
  { id: 'running_ground_contact_time', identifier: 'RunningGroundContactTime', unit: 'ms', field: 'milliseconds', fieldUnit: 'ms', description: 'Ground contact time sample.', category: 'activity', since: 'iOS 16', range: [0, undefined], example: 245 },
  { id: 'running_vertical_oscillation', identifier: 'RunningVerticalOscillation', unit: 'cm', field: 'centimeters', fieldUnit: 'cm', description: 'Vertical oscillation sample.', category: 'activity', since: 'iOS 16', range: [0, undefined], example: 8.4 },
  // ---- cycling metrics
  { id: 'cycling_speed', identifier: 'CyclingSpeed', unit: 'm/s', field: 'metersPerSecond', fieldUnit: 'm/s', description: 'Cycling speed sample.', category: 'activity', since: 'iOS 17', range: [0, undefined], example: 7.5 },
  { id: 'cycling_power', identifier: 'CyclingPower', unit: 'W', field: 'watts', fieldUnit: 'W', description: 'Cycling power sample.', category: 'activity', since: 'iOS 17', range: [0, undefined], example: 210 },
  { id: 'cycling_functional_threshold_power', identifier: 'CyclingFunctionalThresholdPower', unit: 'W', field: 'watts', fieldUnit: 'W', description: 'Functional threshold power estimate.', category: 'activity', since: 'iOS 17', range: [0, undefined], example: 240 },
  { id: 'cross_country_skiing_speed', identifier: 'CrossCountrySkiingSpeed', unit: 'm/s', field: 'metersPerSecond', fieldUnit: 'm/s', description: 'Cross-country skiing speed sample.', category: 'activity', since: 'iOS 18', range: [0, undefined], example: 4 },
  { id: 'paddle_sports_speed', identifier: 'PaddleSportsSpeed', unit: 'm/s', field: 'metersPerSecond', fieldUnit: 'm/s', description: 'Paddle-sports speed sample.', category: 'activity', since: 'iOS 18', range: [0, undefined], example: 2.2 },
  { id: 'rowing_speed', identifier: 'RowingSpeed', unit: 'm/s', field: 'metersPerSecond', fieldUnit: 'm/s', description: 'Rowing speed sample.', category: 'activity', since: 'iOS 18', range: [0, undefined], example: 3 },
  // ---- heart & vitals
  { id: 'walking_heart_rate_average', identifier: 'WalkingHeartRateAverage', unit: 'count/min', field: 'bpm', fieldUnit: 'beats/min', description: 'Average heart rate while walking.', category: 'vitals', range: [0, 300], example: 98 },
  { id: 'heart_rate_recovery_one_minute', identifier: 'HeartRateRecoveryOneMinute', unit: 'count/min', field: 'bpm', fieldUnit: 'beats/min', description: 'Heart-rate drop one minute after exercise.', category: 'vitals', since: 'iOS 16', range: [0, 300], example: 28 },
  { id: 'atrial_fibrillation_burden', identifier: 'AtrialFibrillationBurden', unit: '%', field: 'percent', fieldUnit: '%', description: 'Share of time in atrial fibrillation.', category: 'vitals', since: 'iOS 16', range: [0, 100], example: 2 },
  { id: 'peripheral_perfusion_index', identifier: 'PeripheralPerfusionIndex', unit: '%', field: 'percent', fieldUnit: '%', description: 'Peripheral perfusion index.', category: 'vitals', range: [0, 100], example: 3.5 },
  { id: 'apple_sleeping_wrist_temperature', identifier: 'AppleSleepingWristTemperature', unit: 'degC', field: 'celsius', fieldUnit: '°C', description: 'Wrist temperature measured during sleep (absolute; see skin_temperature for Health Connect deltas).', category: 'vitals', since: 'iOS 16', example: 34.1 },
  { id: 'apple_sleeping_breathing_disturbances', identifier: 'AppleSleepingBreathingDisturbances', unit: 'count', field: 'count', fieldUnit: 'count', description: 'Breathing disturbances during sleep.', category: 'vitals', since: 'iOS 18', range: [0, undefined], example: 12 },
  { id: 'electrodermal_activity', identifier: 'ElectrodermalActivity', unit: 'mcS', field: 'microsiemens', fieldUnit: 'µS', description: 'Electrodermal activity (skin conductance).', category: 'vitals', range: [0, undefined], example: 1.8 },
  // ---- respiratory & lab
  { id: 'forced_expiratory_volume_1', identifier: 'ForcedExpiratoryVolume1', unit: 'L', field: 'liters', fieldUnit: 'L', description: 'FEV1 — air exhaled in the first second of a forced breath.', category: 'respiratory', range: [0, undefined], example: 3.4 },
  { id: 'forced_vital_capacity', identifier: 'ForcedVitalCapacity', unit: 'L', field: 'liters', fieldUnit: 'L', description: 'Forced vital capacity.', category: 'respiratory', range: [0, undefined], example: 4.2 },
  { id: 'peak_expiratory_flow_rate', identifier: 'PeakExpiratoryFlowRate', unit: 'L/min', field: 'litersPerMinute', fieldUnit: 'L/min', description: 'Peak expiratory flow rate.', category: 'respiratory', range: [0, undefined], example: 480 },
  { id: 'inhaler_usage', identifier: 'InhalerUsage', unit: 'count', field: 'count', fieldUnit: 'count', description: 'Inhaler puffs.', category: 'respiratory', kind: 'interval', example: 2 },
  {
    id: 'insulin_delivery',
    identifier: 'InsulinDelivery',
    unit: 'IU',
    field: 'internationalUnits',
    fieldUnit: 'IU',
    description: 'Insulin delivered during the interval.',
    category: 'vitals',
    kind: 'interval',
    example: 4.5,
    extra: { reason: enumOf(['basal', 'bolus']) },
    metadataFields: { reason: { key: 'HKInsulinDeliveryReason', type: 'number' } },
  },
  { id: 'blood_alcohol_content', identifier: 'BloodAlcoholContent', unit: '%', field: 'percent', fieldUnit: '%', description: 'Blood alcohol content.', category: 'vitals', range: [0, 100], example: 0.04 },
  { id: 'number_of_alcoholic_beverages', identifier: 'NumberOfAlcoholicBeverages', unit: 'count', field: 'count', fieldUnit: 'count', description: 'Alcoholic drinks consumed during the interval.', category: 'nutrition', kind: 'interval', since: 'iOS 15', example: 1 },
  { id: 'number_of_times_fallen', identifier: 'NumberOfTimesFallen', unit: 'count', field: 'count', fieldUnit: 'count', description: 'Falls during the interval.', category: 'mobility', kind: 'interval', example: 1 },
  // ---- body
  { id: 'body_mass_index', identifier: 'BodyMassIndex', unit: 'count', field: 'value', fieldUnit: 'kg/m²', description: 'Body mass index.', category: 'body', range: [0, 100], example: 23.4 },
  { id: 'waist_circumference', identifier: 'WaistCircumference', unit: 'm', field: 'meters', fieldUnit: 'm', description: 'Waist circumference.', category: 'body', range: [0, 5], example: 0.82 },
  // ---- environment
  { id: 'environmental_audio_exposure', identifier: 'EnvironmentalAudioExposure', unit: 'dBASPL', field: 'decibels', fieldUnit: 'dB(A)', description: 'Environmental sound level exposure.', category: 'environment', range: [0, 200], example: 68 },
  { id: 'headphone_audio_exposure', identifier: 'HeadphoneAudioExposure', unit: 'dBASPL', field: 'decibels', fieldUnit: 'dB(A)', description: 'Headphone sound level exposure.', category: 'environment', range: [0, 200], example: 74 },
  { id: 'environmental_sound_reduction', identifier: 'EnvironmentalSoundReduction', unit: 'dBASPL', field: 'decibels', fieldUnit: 'dB(A)', description: 'Sound reduction from active noise control.', category: 'environment', since: 'iOS 16', range: [0, 200], example: 12 },
  { id: 'uv_exposure', identifier: 'UVExposure', unit: 'count', field: 'uvIndex', fieldUnit: 'UV index', description: 'UV index exposure.', category: 'environment', range: [0, 20], example: 6 },
  { id: 'time_in_daylight', identifier: 'TimeInDaylight', unit: 'min', field: 'minutes', fieldUnit: 'min', description: 'Minutes spent in daylight.', category: 'environment', kind: 'interval', since: 'iOS 17', example: 45 },
];

export const BATCH_B1: Entry[] = Q.map((q) => {
  const kind = q.kind ?? 'sample';
  const [lo, hi] = q.range ?? [0, undefined];
  const prop: Record<string, unknown> = num(q.fieldUnit, { ...(lo !== undefined ? { minimum: lo } : {}), ...(hi !== undefined ? { maximum: hi } : {}) });
  const hk: NonNullable<Entry['hk']> = { kind: 'quantity', identifier: `${HKQ}${q.identifier}`, unit: q.unit };
  if (q.since) hk.since = q.since;
  if (q.metadataFields) hk.metadataFields = q.metadataFields;
  return {
    id: q.id,
    description: q.description,
    category: q.category,
    kind,
    aggregate: kind === 'interval' ? ['sum'] : ['avg', 'min', 'max'],
    hk,
    properties: { [q.field]: prop, ...(q.extra ?? {}) },
    required: [q.field],
    examples: [{ [q.field]: q.example }],
    verified: false,
  };
});

/**
 * Batch B3 — HealthKit category types: symptoms, events, reproductive health. iOS-only (Health Connect has no
 * equivalents); value enums map to HKCategoryValue* raw values. `verified: false` until checked on a device.
 */
import { enumOf, type Category, type Entry } from './write.js';

const HKC = 'HKCategoryTypeIdentifier';

const SEVERITY = { unspecified: 0, not_present: 1, mild: 2, moderate: 3, severe: 4 };
const PRESENCE = { present: 0, not_present: 1 };

const symptoms: Array<[string, string, string]> = [
  ['symptom_abdominal_cramps', 'AbdominalCramps', 'Abdominal cramps'],
  ['symptom_acne', 'Acne', 'Acne'],
  ['symptom_bladder_incontinence', 'BladderIncontinence', 'Bladder incontinence'],
  ['symptom_bloating', 'Bloating', 'Bloating'],
  ['symptom_breast_pain', 'BreastPain', 'Breast pain'],
  ['symptom_chest_tightness_or_pain', 'ChestTightnessOrPain', 'Chest tightness or pain'],
  ['symptom_chills', 'Chills', 'Chills'],
  ['symptom_constipation', 'Constipation', 'Constipation'],
  ['symptom_coughing', 'Coughing', 'Coughing'],
  ['symptom_diarrhea', 'Diarrhea', 'Diarrhea'],
  ['symptom_dizziness', 'Dizziness', 'Dizziness'],
  ['symptom_dry_skin', 'DrySkin', 'Dry skin'],
  ['symptom_fainting', 'Fainting', 'Fainting'],
  ['symptom_fatigue', 'Fatigue', 'Fatigue'],
  ['symptom_fever', 'Fever', 'Fever'],
  ['symptom_generalized_body_ache', 'GeneralizedBodyAche', 'Generalized body ache'],
  ['symptom_hair_loss', 'HairLoss', 'Hair loss'],
  ['symptom_headache', 'Headache', 'Headache'],
  ['symptom_heartburn', 'Heartburn', 'Heartburn'],
  ['symptom_hot_flashes', 'HotFlashes', 'Hot flashes'],
  ['symptom_loss_of_smell', 'LossOfSmell', 'Loss of smell'],
  ['symptom_loss_of_taste', 'LossOfTaste', 'Loss of taste'],
  ['symptom_lower_back_pain', 'LowerBackPain', 'Lower back pain'],
  ['symptom_memory_lapse', 'MemoryLapse', 'Memory lapse'],
  ['symptom_nausea', 'Nausea', 'Nausea'],
  ['symptom_night_sweats', 'NightSweats', 'Night sweats'],
  ['symptom_pelvic_pain', 'PelvicPain', 'Pelvic pain'],
  ['symptom_rapid_pounding_or_fluttering_heartbeat', 'RapidPoundingOrFlutteringHeartbeat', 'Rapid, pounding or fluttering heartbeat'],
  ['symptom_runny_nose', 'RunnyNose', 'Runny nose'],
  ['symptom_shortness_of_breath', 'ShortnessOfBreath', 'Shortness of breath'],
  ['symptom_sinus_congestion', 'SinusCongestion', 'Sinus congestion'],
  ['symptom_skipped_heartbeat', 'SkippedHeartbeat', 'Skipped heartbeat'],
  ['symptom_sore_throat', 'SoreThroat', 'Sore throat'],
  ['symptom_vaginal_dryness', 'VaginalDryness', 'Vaginal dryness'],
  ['symptom_vomiting', 'Vomiting', 'Vomiting'],
  ['symptom_wheezing', 'Wheezing', 'Wheezing'],
];

interface C {
  id: string;
  identifier: string;
  description: string;
  category: Category;
  kind?: 'sample' | 'interval' | 'session';
  valueField?: string;
  values?: Record<string, number>;
  since?: string;
  example?: Record<string, unknown>;
}

const entries: C[] = [
  ...symptoms.map<C>(([id, identifier, label]) => ({ id, identifier, description: `${label} (symptom with severity).`, category: 'symptom', kind: 'interval', valueField: 'severity', values: SEVERITY, example: { severity: 'moderate' } })),
  { id: 'symptom_appetite_changes', identifier: 'AppetiteChanges', description: 'Appetite changes.', category: 'symptom', kind: 'interval', valueField: 'change', values: { unspecified: 0, no_change: 1, decreased: 2, increased: 3 }, example: { change: 'decreased' } },
  { id: 'symptom_mood_changes', identifier: 'MoodChanges', description: 'Mood changes.', category: 'symptom', kind: 'interval', valueField: 'presence', values: PRESENCE, example: { presence: 'present' } },
  { id: 'symptom_sleep_changes', identifier: 'SleepChanges', description: 'Sleep changes.', category: 'symptom', kind: 'interval', valueField: 'presence', values: PRESENCE, example: { presence: 'present' } },
  // events
  { id: 'apple_stand_hour', identifier: 'AppleStandHour', description: 'Whether the user stood during an hour (Stand ring).', category: 'activity', kind: 'interval', valueField: 'status', values: { stood: 0, idle: 1 }, example: { status: 'stood' } },
  { id: 'high_heart_rate_event', identifier: 'HighHeartRateEvent', description: 'High heart-rate notification event (threshold in metadata HKHeartRateEventThreshold).', category: 'vitals', kind: 'interval' },
  { id: 'low_heart_rate_event', identifier: 'LowHeartRateEvent', description: 'Low heart-rate notification event.', category: 'vitals', kind: 'interval' },
  { id: 'irregular_heart_rhythm_event', identifier: 'IrregularHeartRhythmEvent', description: 'Irregular heart rhythm notification event.', category: 'vitals', kind: 'interval' },
  { id: 'low_cardio_fitness_event', identifier: 'LowCardioFitnessEvent', description: 'Low cardio fitness notification event.', category: 'vitals', kind: 'interval' },
  { id: 'environmental_audio_exposure_event', identifier: 'EnvironmentalAudioExposureEvent', description: 'Environmental sound exposure limit event.', category: 'environment', kind: 'interval' },
  { id: 'headphone_audio_exposure_event', identifier: 'HeadphoneAudioExposureEvent', description: 'Headphone sound exposure limit event.', category: 'environment', kind: 'interval' },
  { id: 'apple_walking_steadiness_event', identifier: 'AppleWalkingSteadinessEvent', description: 'Walking steadiness notification event.', category: 'mobility', kind: 'interval', valueField: 'level', values: { initial_low: 1, initial_very_low: 2, repeat_low: 3, repeat_very_low: 4 }, example: { level: 'initial_low' } },
  { id: 'sleep_apnea_event', identifier: 'SleepApneaEvent', description: 'Sleep apnea notification event.', category: 'sleep', kind: 'interval', since: 'iOS 18' },
  { id: 'toothbrushing_event', identifier: 'ToothbrushingEvent', description: 'Toothbrushing session.', category: 'wellness', kind: 'interval' },
  { id: 'handwashing_event', identifier: 'HandwashingEvent', description: 'Handwashing session.', category: 'wellness', kind: 'interval' },
  // reproductive health
  { id: 'pregnancy', identifier: 'Pregnancy', description: 'Pregnancy period.', category: 'cycle', kind: 'interval' },
  { id: 'lactation', identifier: 'Lactation', description: 'Lactation period.', category: 'cycle', kind: 'interval' },
  { id: 'contraceptive', identifier: 'Contraceptive', description: 'Contraceptive in use.', category: 'cycle', kind: 'interval', valueField: 'method', values: { unspecified: 1, implant: 2, injection: 3, intrauterine_device: 4, intravaginal_ring: 5, oral: 6, patch: 7 }, example: { method: 'oral' } },
  { id: 'pregnancy_test', identifier: 'PregnancyTestResult', description: 'Pregnancy test result.', category: 'cycle', kind: 'sample', valueField: 'result', values: { negative: 1, positive: 2, indeterminate: 3 }, example: { result: 'negative' } },
  { id: 'progesterone_test', identifier: 'ProgesteroneTestResult', description: 'Progesterone test result.', category: 'cycle', kind: 'sample', valueField: 'result', values: { negative: 1, positive: 2, indeterminate: 3 }, example: { result: 'positive' } },
  { id: 'persistent_intermenstrual_bleeding', identifier: 'PersistentIntermenstrualBleeding', description: 'Persistent intermenstrual bleeding (cycle deviation notification).', category: 'cycle', kind: 'interval' },
  { id: 'prolonged_menstrual_periods', identifier: 'ProlongedMenstrualPeriods', description: 'Prolonged menstrual periods (cycle deviation notification).', category: 'cycle', kind: 'interval' },
  { id: 'irregular_menstrual_cycles', identifier: 'IrregularMenstrualCycles', description: 'Irregular menstrual cycles (cycle deviation notification).', category: 'cycle', kind: 'interval' },
  { id: 'infrequent_menstrual_cycles', identifier: 'InfrequentMenstrualCycles', description: 'Infrequent menstrual cycles (cycle deviation notification).', category: 'cycle', kind: 'interval' },
  { id: 'bleeding_during_pregnancy', identifier: 'BleedingDuringPregnancy', description: 'Bleeding during pregnancy.', category: 'cycle', kind: 'interval', since: 'iOS 18' },
  { id: 'bleeding_after_pregnancy', identifier: 'BleedingAfterPregnancy', description: 'Bleeding after pregnancy.', category: 'cycle', kind: 'interval', since: 'iOS 18' },
];

export const BATCH_B3: Entry[] = entries.map((c) => {
  const hk: NonNullable<Entry['hk']> = { kind: 'category', identifier: `${HKC}${c.identifier}`, values: c.values ?? {} };
  if (c.valueField) hk.valueField = c.valueField;
  if (c.since) hk.since = c.since;
  const properties: Record<string, unknown> = c.valueField && c.values ? { [c.valueField]: enumOf(Object.keys(c.values)) } : {};
  return {
    id: c.id,
    description: c.description,
    category: c.category,
    kind: c.kind ?? 'sample',
    aggregate: c.kind === 'interval' ? ['count', 'duration'] : ['count'],
    hk,
    properties,
    ...(c.valueField ? { required: [c.valueField] } : {}),
    examples: [c.example ?? {}],
    verified: false,
  };
});

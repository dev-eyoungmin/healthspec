/**
 * Batch B4 — HealthKit special data (ECG, heartbeat series, State of Mind, activity summary, medication doses)
 * and clinical records mapped across HealthKit Clinical Records ↔ Health Connect Personal Health Record.
 */
import { dateTime, enumOf, int, num, str, type Entry } from './write.js';

const STATE_OF_MIND_LABELS = [
  'amazed', 'amused', 'angry', 'anxious', 'ashamed', 'brave', 'calm', 'content', 'disappointed', 'discouraged', 'disgusted', 'embarrassed', 'excited', 'frustrated',
  'grateful', 'guilty', 'happy', 'hopeless', 'irritated', 'jealous', 'joyful', 'lonely', 'passionate', 'peaceful', 'proud', 'relieved', 'sad', 'scared', 'stressed',
  'surprised', 'worried', 'annoyed', 'confident', 'drained', 'hopeful', 'indifferent', 'overwhelmed', 'satisfied',
];
const STATE_OF_MIND_ASSOCIATIONS = [
  'community', 'current_events', 'dating', 'education', 'family', 'fitness', 'friends', 'health', 'hobbies', 'identity', 'money', 'partner', 'self_care', 'spirituality', 'tasks', 'travel', 'work', 'weather',
];

const FHIR_VALUE = {
  resourceType: str({ description: 'FHIR resource type, e.g. "Observation".' }),
  fhirVersion: str({ description: 'FHIR release, e.g. "R4".' }),
  displayName: str(),
  sourceUrl: str(),
  fhir: { type: 'object', additionalProperties: true, description: 'The FHIR resource, verbatim.' },
};

/** [id, HealthKit clinical identifier suffix | null, Health Connect medical resource type | null, description] */
const CLINICAL: Array<[string, string | null, string | null, string]> = [
  ['clinical_allergy', 'AllergyRecord', 'ALLERGIES_INTOLERANCES', 'Allergies and intolerances.'],
  ['clinical_condition', 'ConditionRecord', 'CONDITIONS', 'Conditions / diagnoses.'],
  ['clinical_immunization', 'ImmunizationRecord', 'VACCINES', 'Immunizations.'],
  ['clinical_lab_result', 'LabResultRecord', 'LABORATORY_RESULTS', 'Laboratory results.'],
  ['clinical_medication', 'MedicationRecord', 'MEDICATIONS', 'Prescribed medications.'],
  ['clinical_procedure', 'ProcedureRecord', 'PROCEDURES', 'Procedures.'],
  ['clinical_vital_sign', 'VitalSignRecord', 'VITAL_SIGNS', 'Clinically recorded vital signs.'],
  ['clinical_coverage', 'CoverageRecord', null, 'Insurance coverage (HealthKit only).'],
  ['clinical_note', 'ClinicalNoteRecord', null, 'Clinical notes (HealthKit only, iOS 16).'],
  ['clinical_personal_details', null, 'PERSONAL_DETAILS', 'Personal details (Health Connect only).'],
  ['clinical_practitioner_details', null, 'PRACTITIONER_DETAILS', 'Practitioner details (Health Connect only).'],
  ['clinical_pregnancy', null, 'PREGNANCY', 'Pregnancy records (Health Connect only).'],
  ['clinical_social_history', null, 'SOCIAL_HISTORY', 'Social history (Health Connect only).'],
  ['clinical_visit', null, 'VISITS', 'Visits / encounters (Health Connect only).'],
];

export const BATCH_B4: Entry[] = [
  {
    id: 'electrocardiogram',
    description: 'Single-lead ECG recording: classification and summary values. Voltage samples are fetched separately (readEcgVoltages) because a recording holds thousands.',
    category: 'vitals',
    kind: 'interval',
    aggregate: ['count'],
    hk: { kind: 'electrocardiogram', identifier: 'HKDataTypeIdentifierElectrocardiogram', write: false, since: 'iOS 14' },
    properties: {
      classification: enumOf(['not_set', 'sinus_rhythm', 'atrial_fibrillation', 'inconclusive_low_heart_rate', 'inconclusive_high_heart_rate', 'inconclusive_poor_reading', 'inconclusive_other', 'unrecognized']),
      symptomsStatus: enumOf(['not_set', 'none', 'present']),
      averageBpm: num('beats/min', { minimum: 0, maximum: 300 }),
      samplingFrequencyHz: num('Hz', { minimum: 0 }),
      voltageCount: int('count', { minimum: 0 }),
    },
    required: ['classification'],
    examples: [{ classification: 'sinus_rhythm', symptomsStatus: 'none', averageBpm: 64, samplingFrequencyHz: 512, voltageCount: 15360 }],
    verified: false,
  },
  {
    id: 'heartbeat_series',
    description: 'Beat-to-beat timing series behind an HRV measurement.',
    category: 'vitals',
    kind: 'interval',
    aggregate: ['count'],
    hk: { kind: 'heartbeatSeries', identifier: 'HKDataTypeIdentifierHeartbeatSeries', write: false, since: 'iOS 13' },
    properties: {
      count: int('count', { minimum: 0 }),
      beats: {
        type: 'array',
        items: { type: 'object', properties: { offsetSeconds: num('s', { minimum: 0 }), precededByGap: { type: 'boolean' } }, required: ['offsetSeconds', 'precededByGap'], additionalProperties: false },
      },
    },
    required: ['beats'],
    examples: [{ count: 2, beats: [{ offsetSeconds: 0.81, precededByGap: false }, { offsetSeconds: 1.63, precededByGap: false }] }],
    verified: false,
  },
  {
    id: 'state_of_mind',
    description: 'Logged emotion (momentary) or mood (daily) with valence, labels and life-area associations.',
    category: 'mind',
    kind: 'sample',
    aggregate: ['count', 'avg', 'min', 'max'],
    hk: { kind: 'stateOfMind', identifier: 'HKDataTypeIdentifierStateOfMind', since: 'iOS 18' },
    properties: {
      kind: enumOf(['momentary_emotion', 'daily_mood']),
      valence: num('valence', { minimum: -1, maximum: 1 }),
      valenceClassification: enumOf(['very_unpleasant', 'unpleasant', 'slightly_unpleasant', 'neutral', 'slightly_pleasant', 'pleasant', 'very_pleasant']),
      labels: { type: 'array', items: enumOf(STATE_OF_MIND_LABELS) },
      associations: { type: 'array', items: enumOf(STATE_OF_MIND_ASSOCIATIONS) },
    },
    required: ['kind', 'valence'],
    examples: [{ kind: 'momentary_emotion', valence: 0.6, valenceClassification: 'pleasant', labels: ['calm', 'grateful'], associations: ['family'] }],
  },
  {
    id: 'activity_summary',
    description: 'One day of Apple activity-ring progress and goals.',
    category: 'activity',
    kind: 'interval',
    aggregate: ['count'],
    hk: { kind: 'activitySummary', identifier: 'HKActivitySummaryTypeIdentifier', write: false },
    properties: {
      date: str({ pattern: '^\\d{4}-\\d{2}-\\d{2}$' }),
      activeEnergyKilocalories: num('kcal', { minimum: 0 }),
      activeEnergyGoalKilocalories: num('kcal', { minimum: 0 }),
      exerciseMinutes: num('min', { minimum: 0 }),
      exerciseGoalMinutes: num('min', { minimum: 0 }),
      standHours: num('count', { minimum: 0 }),
      standGoalHours: num('count', { minimum: 0 }),
      moveMinutes: num('min', { minimum: 0 }),
      moveGoalMinutes: num('min', { minimum: 0 }),
      activityMoveMode: enumOf(['active_energy', 'move_time']),
    },
    required: ['date'],
    examples: [{ date: '2026-08-21', activeEnergyKilocalories: 480, activeEnergyGoalKilocalories: 500, exerciseMinutes: 32, exerciseGoalMinutes: 30, standHours: 11, standGoalHours: 12 }],
    verified: false,
  },
  ...CLINICAL.map<Entry>(([id, hk, hc, description]) => ({
    id,
    description: `${description} FHIR resource, read-only. HealthKit needs the clinical-records entitlement; Health Connect needs the Personal Health Record feature and READ_MEDICAL_DATA_* permissions.`,
    category: 'clinical',
    kind: 'interval',
    aggregate: ['count'],
    ...(hk ? { hk: { kind: 'clinical' as const, identifier: `HKClinicalTypeIdentifier${hk}`, write: false, ...(hk === 'ClinicalNoteRecord' ? { since: 'iOS 16' } : {}) } } : {}),
    ...(hc ? { hc: { record: 'MedicalResource', permission: `MEDICAL_DATA_${hc}`, medicalResourceType: hc, read: true, write: false } } : {}),
    properties: FHIR_VALUE,
    required: ['resourceType', 'fhir'],
    examples: [{ resourceType: 'Observation', fhirVersion: 'R4', displayName: 'Hemoglobin A1c', fhir: { resourceType: 'Observation', status: 'final' } }],
    verified: false,
  })),
  {
    id: 'medication_dose',
    description: 'A logged medication dose event (iOS 26 Medications). The medication list itself comes from listMedications().',
    category: 'clinical',
    kind: 'sample',
    aggregate: ['count'],
    hk: { kind: 'medicationDose', identifier: 'HKDataTypeIdentifierMedicationDoseEvent', write: false, since: 'iOS 26' },
    properties: {
      medicationId: str({ description: 'HKMedicationConceptIdentifier' }),
      medicationName: str(),
      status: enumOf(['not_interacted', 'notification_not_sent', 'snoozed', 'taken', 'skipped', 'not_logged']),
      scheduleType: enumOf(['as_needed', 'scheduled']),
      scheduledAt: dateTime(),
      scheduledDose: num('dose', { minimum: 0 }),
      dose: num('dose', { minimum: 0 }),
      unit: str(),
    },
    required: ['medicationId', 'status', 'scheduleType'],
    examples: [{ medicationId: 'rxnorm:197361', medicationName: 'Amoxicillin 500 mg', status: 'taken', scheduleType: 'scheduled', scheduledAt: '2026-08-21T08:00:00Z', dose: 1, unit: 'capsule' }],
    verified: false,
  },
];

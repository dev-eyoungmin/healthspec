/**
 * HealthKit enum raw values for non-sample data. State of Mind and characteristics were verified against
 * @kingstinct/react-native-healthkit's generated enums (2026-08-23); ECG and medication values are transcribed
 * from Apple's documentation and remain unverified until a device build. Medication values match kingstinct's iOS 26 spec.
 */

export const STATE_OF_MIND_KIND: Record<string, number> = { momentary_emotion: 1, daily_mood: 2 };

export const STATE_OF_MIND_VALENCE_CLASSIFICATION: Record<string, number> = {
  very_unpleasant: 1,
  unpleasant: 2,
  slightly_unpleasant: 3,
  neutral: 4,
  slightly_pleasant: 5,
  pleasant: 6,
  very_pleasant: 7,
};

export const STATE_OF_MIND_LABEL: Record<string, number> = {
  amazed: 1, amused: 2, angry: 3, anxious: 4, ashamed: 5, brave: 6, calm: 7, content: 8, disappointed: 9, discouraged: 10,
  disgusted: 11, embarrassed: 12, excited: 13, frustrated: 14, grateful: 15, guilty: 16, happy: 17, hopeless: 18, irritated: 19,
  jealous: 20, joyful: 21, lonely: 22, passionate: 23, peaceful: 24, proud: 25, relieved: 26, sad: 27, scared: 28, stressed: 29,
  surprised: 30, worried: 31, annoyed: 32, confident: 33, drained: 34, hopeful: 35, indifferent: 36, overwhelmed: 37, satisfied: 38,
};

export const STATE_OF_MIND_ASSOCIATION: Record<string, number> = {
  community: 1, current_events: 2, dating: 3, education: 4, family: 5, fitness: 6, friends: 7, health: 8, hobbies: 9, identity: 10,
  money: 11, partner: 12, self_care: 13, spirituality: 14, tasks: 15, travel: 16, work: 17, weather: 18,
};

/** HKElectrocardiogram.Classification — unverified */
export const ECG_CLASSIFICATION: Record<string, number> = {
  not_set: 0,
  sinus_rhythm: 1,
  atrial_fibrillation: 2,
  inconclusive_low_heart_rate: 3,
  inconclusive_high_heart_rate: 4,
  inconclusive_poor_reading: 5,
  inconclusive_other: 6,
  unrecognized: 7,
};

/** HKElectrocardiogram.SymptomsStatus — unverified */
export const ECG_SYMPTOMS_STATUS: Record<string, number> = { not_set: 0, none: 1, present: 2 };

export const BIOLOGICAL_SEX: Record<string, number> = { female: 1, male: 2, other: 3 };
export const BLOOD_TYPE: Record<string, number> = {
  a_positive: 1, a_negative: 2, b_positive: 3, b_negative: 4, ab_positive: 5, ab_negative: 6, o_positive: 7, o_negative: 8,
};
export const FITZPATRICK_SKIN_TYPE: Record<string, number> = { type_1: 1, type_2: 2, type_3: 3, type_4: 4, type_5: 5, type_6: 6 };
export const WHEELCHAIR_USE: Record<string, number> = { not_using: 1, using: 2 };
export const ACTIVITY_MOVE_MODE: Record<string, number> = { active_energy: 1, move_time: 2 };

/** HKMedicationDoseEvent (iOS 26) — transcribed from kingstinct's spec; unverified */
export const MEDICATION_SCHEDULE_TYPE: Record<string, number> = { as_needed: 1, scheduled: 2 };
export const MEDICATION_LOG_STATUS: Record<string, number> = { not_interacted: 1, notification_not_sent: 2, snoozed: 3, taken: 4, skipped: 5, not_logged: 6 };

export const nameOf = (table: Record<string, number>, raw: number | undefined): string | undefined => {
  if (raw === undefined) return undefined;
  for (const [name, value] of Object.entries(table)) if (value === raw) return name;
  return undefined;
};
export const namesOf = (table: Record<string, number>, raws: number[] | undefined): string[] =>
  (raws ?? []).map((r) => nameOf(table, r)).filter((n): n is string => n !== undefined);
export const rawOf = (table: Record<string, number>, name: unknown): number | undefined => (typeof name === 'string' ? table[name] : undefined);

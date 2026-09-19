/**
 * The example's data layer, kept apart from the UI so it can be unit-tested against MockProvider — which is
 * also how an app using HealthSpec would test its own health logic without a device.
 *
 * It depends on @healthspec/core rather than @healthspec/expo: the logic is platform-independent, and core
 * imports no React Native, so these tests run in plain Node.
 */
import type { ExerciseSessionRecord, HealthType, SleepSessionRecord } from '@healthspec/schema';
import { defaultZone, zonedParts, type AggregateResult, type HealthStore, type TypeSupport } from '@healthspec/core';

/** Types this screen shows. Declared once and reused for permissions, support checks and queries. */
export const SCREEN_TYPES = ['steps', 'distance', 'active_energy', 'heart_rate', 'sleep_session', 'weight', 'exercise_session'] as const;
export type ScreenType = (typeof SCREEN_TYPES)[number];

export interface DailySummary {
  /** Local calendar day, YYYY-MM-DD. */
  date: string;
  steps: number | null;
  distanceKm: number | null;
  activeKilocalories: number | null;
}

export interface Summary {
  days: DailySummary[];
  latestHeartRateBpm: number | null;
  latestWeightKg: number | null;
  lastNight: { hours: number; stages: Array<{ stage: string; minutes: number }> } | null;
  workouts: Array<{ activity: string; minutes: number; start: string }>;
  /** Types this platform cannot serve, so the UI can say why instead of showing an empty card. */
  unavailable: TypeSupport[];
}

const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');
/** The calendar day an instant falls on in `zone` — not the UTC date, which is a day off east of Greenwich. */
const localDate = (instant: string, zone: string) => {
  const p = zonedParts(Date.parse(instant), zone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
};
const minutesBetween = (start: string, end: string) => Math.round((Date.parse(end) - Date.parse(start)) / 60_000);

/** Same call on both platforms — the point of the exercise. */
export async function loadSummary(store: HealthStore, options: { days?: number; now?: number; zone?: string } = {}): Promise<Summary> {
  const days = options.days ?? 7;
  const now = options.now ?? Date.now();
  const zone = options.zone ?? defaultZone();
  const start = new Date(now - days * DAY);
  const end = new Date(now);

  const supported = (type: ScreenType) => store.support(type).read;
  const unavailable = SCREEN_TYPES.map((t) => store.support(t)).filter((s) => !s.read);

  const bucket = async (type: ScreenType): Promise<AggregateResult[]> =>
    supported(type) ? store.aggregate(type, { start, end, fn: 'sum', bucket: 'day', zone }) : [];

  const [steps, distance, energy] = await Promise.all([bucket('steps'), bucket('distance'), bucket('active_energy')]);

  const byDay = new Map<string, DailySummary>();
  const dayKey = (instant: string) => localDate(instant, zone);
  const put = (results: AggregateResult[], apply: (row: DailySummary, value: number | null) => void) => {
    for (const r of results) {
      const key = dayKey(r.start);
      const row = byDay.get(key) ?? { date: key, steps: null, distanceKm: null, activeKilocalories: null };
      apply(row, r.value);
      byDay.set(key, row);
    }
  };
  put(steps, (row, v) => (row.steps = v === null ? null : Math.round(v)));
  put(distance, (row, v) => (row.distanceKm = v === null ? null : Math.round(v / 100) / 10));
  put(energy, (row, v) => (row.activeKilocalories = v === null ? null : Math.round(v)));

  const [heartRate, weight, sleep, exercise] = await Promise.all([
    supported('heart_rate') ? store.readLatest('heart_rate', { since: start }) : undefined,
    supported('weight') ? store.readLatest('weight', { since: start }) : undefined,
    supported('sleep_session') ? store.read('sleep_session', { start, end, order: 'desc', limit: 1 }) : [],
    supported('exercise_session') ? store.read('exercise_session', { start, end, order: 'desc', limit: 5 }) : [],
  ]);

  const session = (sleep as SleepSessionRecord[])[0];
  const lastNight = session
    ? {
        hours: Math.round((minutesBetween(session.start, session.end) / 60) * 10) / 10,
        stages: Object.entries(
          session.value.stages.reduce<Record<string, number>>((acc, s) => {
            acc[s.stage] = (acc[s.stage] ?? 0) + minutesBetween(s.start, s.end);
            return acc;
          }, {}),
        ).map(([stage, minutes]) => ({ stage, minutes })),
      }
    : null;

  return {
    days: [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date)),
    latestHeartRateBpm: heartRate?.value.bpm ?? null,
    latestWeightKg: weight?.value.kilograms ?? null,
    lastNight,
    workouts: (exercise as ExerciseSessionRecord[]).map((w) => ({ activity: w.value.activity, minutes: minutesBetween(w.start, w.end), start: w.start })),
    unavailable,
  };
}

/**
 * Everything the screen needs, declared once. Ask through `requestSupportedPermissions` so the same
 * declaration works on a platform that lacks one of the types — requesting an unsupported type rejects.
 */
export const screenPermissions = { read: [...SCREEN_TYPES] as HealthType[], write: ['weight'] as HealthType[], history: true };


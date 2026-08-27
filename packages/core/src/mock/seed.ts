import type { HealthSource, HealthType, HealthValueOf, SleepSessionValue } from '@healthspec/schema';
import { DAY, HOUR, MINUTE, toIso } from '../time.js';
import type { NewRecord } from '../types.js';

/** Small deterministic PRNG so seed data is identical across runs and platforms. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const DEFAULT_SEED_TYPES: HealthType[] = [
  'steps',
  'distance',
  'active_energy',
  'heart_rate',
  'resting_heart_rate',
  'sleep_session',
  'weight',
  'oxygen_saturation',
  'hydration',
  'exercise_session',
];

export interface SeedOptions {
  seed?: number;
  /** Days of history to generate (default 7). */
  days?: number;
  /** Generation stops here (epoch ms, default now). Days are aligned to UTC midnight for determinism. */
  end?: number;
  types?: HealthType[];
}

export const MOCK_APP_ID = 'dev.healthspec.mock';

const WATCH: HealthSource = {
  app: { id: MOCK_APP_ID, name: 'HealthSpec Mock' },
  device: { manufacturer: 'HealthSpec', model: 'Mock Watch', type: 'watch' },
  recordingMethod: 'automatic',
};
const SCALE: HealthSource = {
  app: { id: MOCK_APP_ID, name: 'HealthSpec Mock' },
  device: { manufacturer: 'HealthSpec', model: 'Mock Scale', type: 'scale' },
  recordingMethod: 'automatic',
};
const MANUAL: HealthSource = { app: { id: MOCK_APP_ID, name: 'HealthSpec Mock' }, recordingMethod: 'manual' };

function rec<T extends HealthType>(type: T, startMs: number, endMs: number, value: HealthValueOf<T>, source: HealthSource): NewRecord<T> {
  return { type, start: toIso(startMs), end: toIso(endMs), value, source } as NewRecord<T>;
}

/** Plausible multi-day data: hourly activity, 10-minute heart rate, nightly sleep with stages, daily weight, … */
export function generateSeedRecords(options: SeedOptions = {}): NewRecord[] {
  const rand = mulberry32(options.seed ?? 42);
  const days = options.days ?? 7;
  const endMs = options.end ?? Date.now();
  const want = new Set<HealthType>(options.types ?? DEFAULT_SEED_TYPES);
  const out: NewRecord[] = [];
  const todayStart = Math.floor(endMs / DAY) * DAY;
  let weight = 70 + rand() * 10;

  for (let d = days - 1; d >= 0; d--) {
    const dayStart = todayStart - d * DAY;
    const upTo = Math.min(endMs, dayStart + DAY);

    for (let h = 7; h < 23; h++) {
      const s = dayStart + h * HOUR;
      if (s >= upTo) break;
      const e = Math.min(s + HOUR, upTo);
      const steps = Math.round((200 + rand() * 900) * (h >= 17 && h <= 19 ? 1.5 : 1));
      if (want.has('steps')) out.push(rec('steps', s, e, { count: steps }, WATCH));
      if (want.has('distance')) out.push(rec('distance', s, e, { meters: Math.round(steps * 0.72) }, WATCH));
      if (want.has('active_energy')) out.push(rec('active_energy', s, e, { kilocalories: Math.round(steps * 0.4) / 10 }, WATCH));
    }

    if (want.has('heart_rate')) {
      for (let m = 0; m < 1440; m += 10) {
        const t = dayStart + m * MINUTE;
        if (t >= upTo) break;
        const night = m < 420 || m >= 1380;
        out.push(rec('heart_rate', t, t, { bpm: Math.round((night ? 52 : 70) + rand() * (night ? 12 : 45)) }, WATCH));
      }
    }
    if (want.has('resting_heart_rate')) {
      const t = dayStart + 6 * HOUR;
      if (t < upTo) out.push(rec('resting_heart_rate', t, t, { bpm: Math.round(50 + rand() * 10) }, WATCH));
    }

    if (want.has('sleep_session')) {
      const s = dayStart - 30 * MINUTE;
      const e = dayStart + 7 * HOUR;
      if (e <= upTo) {
        const stages: SleepSessionValue['stages'] = [];
        let t = s;
        let cycle = 0;
        while (t < e) {
          const plan: Array<[SleepSessionValue['stages'][number]['stage'], number]> = [
            ['light', 50],
            ['deep', 25],
            ['rem', 15],
          ];
          if (cycle % 2 === 1) plan.push(['awake', 5]);
          for (const [stage, minutes] of plan) {
            const st = t;
            t = Math.min(t + minutes * MINUTE, e);
            stages.push({ stage, start: toIso(st), end: toIso(t) });
            if (t >= e) break;
          }
          cycle++;
        }
        out.push(rec('sleep_session', s, e, { stages }, WATCH));
      }
    }

    if (want.has('weight')) {
      const t = dayStart + 7.5 * HOUR;
      if (t < upTo) {
        weight += (rand() - 0.5) * 0.4;
        out.push(rec('weight', t, t, { kilograms: Math.round(weight * 10) / 10 }, SCALE));
      }
    }
    if (want.has('oxygen_saturation')) {
      for (const h of [1, 3, 5]) {
        const t = dayStart + h * HOUR;
        if (t < upTo) out.push(rec('oxygen_saturation', t, t, { percent: Math.round((95 + rand() * 4) * 10) / 10 }, WATCH));
      }
    }
    if (want.has('hydration')) {
      for (const h of [8, 10, 12, 15, 18, 20]) {
        const t = dayStart + h * HOUR;
        if (t < upTo) out.push(rec('hydration', t, t + MINUTE, { liters: 0.25 }, MANUAL));
      }
    }
    if (want.has('exercise_session') && d % 2 === 0) {
      const s = dayStart + 7 * HOUR;
      const e = s + 40 * MINUTE;
      if (e <= upTo) out.push(rec('exercise_session', s, e, { activity: rand() > 0.5 ? 'running' : 'cycling', title: 'Morning workout' }, WATCH));
    }
  }
  return out;
}

/**
 * One-off annotator: adds field-level platform availability (`x-platform`) and cross-type counterpart
 * metadata (`x-healthspec.counterparts`) to existing schemas. The JSON stays canonical after this runs.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');
const dir = path.join(ROOT, 'spec/schema/types');

/** field → the only platform that has it */
const FIELD_PLATFORM: Record<string, Record<string, 'healthkit' | 'healthconnect'>> = {
  cervical_mucus: { sensation: 'healthconnect' },
  menstruation_flow: { cycleStart: 'healthkit' },
  skin_temperature: { baselineCelsius: 'healthconnect' },
  exercise_session: { title: 'healthconnect', notes: 'healthconnect' },
  sleep_session: { title: 'healthconnect', notes: 'healthconnect' },
  mindfulness_session: { title: 'healthconnect', notes: 'healthconnect' },
  blood_glucose: { specimenSource: 'healthconnect', relationToMeal: 'healthconnect' },
  body_temperature: { measurementLocation: 'healthconnect' },
  blood_pressure: { bodyPosition: 'healthconnect', measurementLocation: 'healthconnect' },
  vo2_max: { measurementMethod: 'healthconnect' },
};

interface Counterpart {
  type: string;
  /** the platform where the counterpart lives */
  platform: 'healthkit' | 'healthconnect';
  /** false when values must never be converted between the two */
  interchangeable: boolean;
  reason: string;
}

const COUNTERPARTS: Record<string, Counterpart[]> = {
  hrv_sdnn: [{ type: 'hrv_rmssd', platform: 'healthconnect', interchangeable: false, reason: 'SDNN and RMSSD are different statistics computed from the same intervals; neither can be derived from the other.' }],
  hrv_rmssd: [{ type: 'hrv_sdnn', platform: 'healthkit', interchangeable: false, reason: 'RMSSD and SDNN are different statistics computed from the same intervals; neither can be derived from the other.' }],
  basal_energy: [{ type: 'basal_metabolic_rate', platform: 'healthconnect', interchangeable: false, reason: 'basal_energy is energy accumulated over an interval (kcal); basal_metabolic_rate is a rate (kcal/day). Converting needs the interval length and assumes a constant rate.' }],
  basal_metabolic_rate: [{ type: 'basal_energy', platform: 'healthkit', interchangeable: false, reason: 'A rate (kcal/day) cannot be compared with interval energy (kcal) without assuming the rate held for the whole interval.' }],
  skin_temperature: [{ type: 'apple_sleeping_wrist_temperature', platform: 'healthkit', interchangeable: false, reason: 'Health Connect stores a delta from the user baseline; HealthKit stores an absolute nightly wrist temperature.' }],
  apple_sleeping_wrist_temperature: [{ type: 'skin_temperature', platform: 'healthconnect', interchangeable: false, reason: 'HealthKit stores an absolute temperature; Health Connect stores a delta from the user baseline.' }],
  power: [
    { type: 'cycling_power', platform: 'healthkit', interchangeable: true, reason: 'HealthKit splits power by activity; use cycling_power for cycling sessions.' },
    { type: 'running_power', platform: 'healthkit', interchangeable: true, reason: 'HealthKit splits power by activity; use running_power for running sessions.' },
  ],
  cycling_power: [{ type: 'power', platform: 'healthconnect', interchangeable: true, reason: 'Health Connect keeps a single activity-agnostic PowerRecord.' }],
  running_power: [{ type: 'power', platform: 'healthconnect', interchangeable: true, reason: 'Health Connect keeps a single activity-agnostic PowerRecord.' }],
  speed: [
    { type: 'walking_speed', platform: 'healthkit', interchangeable: true, reason: 'HealthKit splits speed by activity.' },
    { type: 'running_speed', platform: 'healthkit', interchangeable: true, reason: 'HealthKit splits speed by activity.' },
    { type: 'cycling_speed', platform: 'healthkit', interchangeable: true, reason: 'HealthKit splits speed by activity.' },
  ],
  walking_speed: [{ type: 'speed', platform: 'healthconnect', interchangeable: true, reason: 'Health Connect keeps a single activity-agnostic SpeedRecord.' }],
  running_speed: [{ type: 'speed', platform: 'healthconnect', interchangeable: true, reason: 'Health Connect keeps a single activity-agnostic SpeedRecord.' }],
  cycling_speed: [{ type: 'speed', platform: 'healthconnect', interchangeable: true, reason: 'Health Connect keeps a single activity-agnostic SpeedRecord.' }],
  distance: [
    { type: 'distance_cycling', platform: 'healthkit', interchangeable: false, reason: 'HealthKit splits distance by activity and `distance` maps to walking/running only; summing both double-counts.' },
    { type: 'distance_swimming', platform: 'healthkit', interchangeable: false, reason: 'HealthKit splits distance by activity and `distance` maps to walking/running only; summing both double-counts.' },
    { type: 'distance_wheelchair', platform: 'healthkit', interchangeable: false, reason: 'HealthKit splits distance by activity and `distance` maps to walking/running only; summing both double-counts.' },
  ],
  distance_cycling: [{ type: 'distance', platform: 'healthconnect', interchangeable: false, reason: 'Health Connect has one DistanceRecord for every activity; it already includes cycling distance.' }],
  distance_swimming: [{ type: 'distance', platform: 'healthconnect', interchangeable: false, reason: 'Health Connect has one DistanceRecord for every activity; it already includes swimming distance.' }],
  distance_wheelchair: [{ type: 'distance', platform: 'healthconnect', interchangeable: false, reason: 'Health Connect has one DistanceRecord for every activity; it already includes wheelchair distance.' }],
  menstruation_period: [{ type: 'menstruation_flow', platform: 'healthkit', interchangeable: false, reason: 'HealthKit has no period record; derive periods by grouping menstruation_flow entries whose cycleStart is true.' }],
  cycling_cadence: [{ type: 'steps_cadence', platform: 'healthconnect', interchangeable: false, reason: 'Pedalling cadence (rpm) and step cadence (steps/min) measure different motions.' }],
  steps_cadence: [{ type: 'cycling_cadence', platform: 'healthkit', interchangeable: false, reason: 'Step cadence (steps/min) and pedalling cadence (rpm) measure different motions.' }],
  elevation_gained: [{ type: 'floors_climbed', platform: 'healthkit', interchangeable: false, reason: 'HealthKit records flights climbed, not metres gained; a flight is a fixed approximation.' }],
};

let changed = 0;
for (const [id, fields] of Object.entries(FIELD_PLATFORM)) {
  const file = path.join(dir, `${id}.json`);
  const json = JSON.parse(await readFile(file, 'utf8')) as { properties: Record<string, Record<string, unknown>> };
  for (const [field, platform] of Object.entries(fields)) {
    const prop = json.properties[field];
    if (!prop) throw new Error(`${id}: no property "${field}"`);
    prop['x-platform'] = platform;
  }
  await writeFile(file, JSON.stringify(json, null, 2) + '\n');
  changed++;
}

for (const [id, counterparts] of Object.entries(COUNTERPARTS)) {
  const file = path.join(dir, `${id}.json`);
  const json = JSON.parse(await readFile(file, 'utf8')) as { 'x-healthspec': Record<string, unknown> };
  json['x-healthspec']['counterparts'] = counterparts;
  await writeFile(file, JSON.stringify(json, null, 2) + '\n');
  changed++;
}

console.log(`annotated ${changed} schema files (${Object.keys(FIELD_PLATFORM).length} with field platforms, ${Object.keys(COUNTERPARTS).length} with counterparts)`);

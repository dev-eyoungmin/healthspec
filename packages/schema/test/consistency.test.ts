import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  EXERCISE_TYPE_MAPPING,
  EXERCISE_TYPE_VALUES,
  HEALTH_CONNECT_PERMISSIONS,
  HEALTH_TYPES,
  HEALTHKIT_IDENTIFIERS,
  SLEEP_STAGE_MAPPING,
  SLEEP_STAGE_VALUES,
  TYPE_MAPPINGS,
  type HealthRecord,
  type StepsRecord,
} from '../src/index.js';
import { SCHEMA_BUNDLE } from '../src/bundle.js';

test('HEALTH_TYPES and TYPE_MAPPINGS agree', () => {
  assert.deepEqual([...HEALTH_TYPES], Object.keys(TYPE_MAPPINGS));
  assert.deepEqual([...HEALTH_TYPES], SCHEMA_BUNDLE.types.map((t) => (t.schema as { title: string }).title));
});

test('every type maps to at least one platform', () => {
  for (const t of HEALTH_TYPES) {
    const m = TYPE_MAPPINGS[t];
    assert.ok(m.healthkit || m.healthconnect, `${t} has no platform`);
  }
});

test('Health Connect permission strings are well-formed and only present when mapped', () => {
  for (const t of HEALTH_TYPES) {
    const p = HEALTH_CONNECT_PERMISSIONS[t];
    const hc = TYPE_MAPPINGS[t].healthconnect;
    if (!hc) {
      assert.deepEqual(p, {});
      continue;
    }
    if (hc.read) assert.match(p.read!, /^android\.permission\.health\.READ_[A-Z0-9_]+$/);
    if (hc.write) assert.match(p.write!, /^android\.permission\.health\.WRITE_[A-Z0-9_]+$/);
  }
});

test('HealthKit identifiers are HK* and only present when mapped', () => {
  for (const t of HEALTH_TYPES) {
    const ids = HEALTHKIT_IDENTIFIERS[t];
    if (!TYPE_MAPPINGS[t].healthkit) assert.deepEqual(ids, []);
    else {
      assert.ok(ids.length > 0, `${t} has a HealthKit mapping but no identifiers`);
      for (const id of ids) assert.match(id, /^HK/);
    }
  }
});

test('single-platform HRV types stay apart', () => {
  assert.equal(TYPE_MAPPINGS.hrv_sdnn.healthconnect, undefined);
  assert.equal(TYPE_MAPPINGS.hrv_rmssd.healthkit, undefined);
});

test('enum mapping tables cover every value', () => {
  assert.deepEqual(Object.keys(SLEEP_STAGE_MAPPING).sort(), [...SLEEP_STAGE_VALUES].sort());
  assert.deepEqual(Object.keys(EXERCISE_TYPE_MAPPING).sort(), [...EXERCISE_TYPE_VALUES].sort());
});

test('record union narrows by type', () => {
  const r: HealthRecord = {
    id: 'x',
    type: 'steps',
    start: '2026-08-21T00:00:00Z',
    end: '2026-08-21T01:00:00Z',
    value: { count: 10 },
    source: { recordingMethod: 'automatic' },
  };
  const narrowed: StepsRecord | undefined = r.type === 'steps' ? r : undefined;
  assert.equal(narrowed?.value.count, 10);
});

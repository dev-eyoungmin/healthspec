import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SCHEMA_BUNDLE } from '../src/bundle.js';
import { TYPE_EXAMPLES, validateRecord, validateValue, type HealthType } from '../src/index.js';

test('validateValue accepts valid values and rejects bad ones with paths', () => {
  assert.deepEqual(validateValue('steps', { count: 10 }), []);
  assert.ok(validateValue('steps', { count: -1 }).length, 'negative');
  assert.ok(validateValue('steps', { count: 1.5 }).length, 'non-integer');
  assert.ok(validateValue('steps', { count: 1, extra: true }).some((i) => i.path === 'value.extra'), 'unknown property');
  assert.ok(validateValue('steps', {}).some((i) => i.path === 'value.count' && i.message === 'required'));
  assert.deepEqual(validateValue('blood_pressure', { systolicMmHg: 120, diastolicMmHg: 80, bodyPosition: 'sitting_down' }), []);
  assert.ok(validateValue('blood_pressure', { systolicMmHg: 120, diastolicMmHg: 80, bodyPosition: 'hanging' }).length, 'inline enum');
  assert.deepEqual(validateValue('sleep_session', { stages: [{ stage: 'rem', start: '2026-08-21T15:00:00Z', end: '2026-08-21T16:00:00Z' }] }), []);
  const bad = validateValue('sleep_session', { stages: [{ stage: 'nap', start: 'x', end: 'y' }] });
  assert.ok(bad.some((i) => i.path === 'value.stages[0].stage'), '$ref enum via path');
  assert.ok(bad.some((i) => i.path === 'value.stages[0].start'), 'nested date-time');
  assert.deepEqual(validateValue('nutrition', { mealType: 'lunch' }), [], 'all-optional value');
});

test('validateRecord enforces envelope, type, and time rules', () => {
  const base = {
    id: 'a',
    type: 'heart_rate',
    start: '2026-08-21T15:00:00Z',
    end: '2026-08-21T15:00:00Z',
    value: { bpm: 60 },
    source: { recordingMethod: 'automatic' },
  };
  assert.deepEqual(validateRecord(base), []);
  assert.ok(validateRecord({ ...base, end: '2026-08-21T15:01:00Z' }).some((i) => i.message.includes('samples')));
  assert.ok(validateRecord({ ...base, start: '2026-08-21T15:02:00Z' }).some((i) => i.path === 'record.end'));
  assert.ok(validateRecord({ ...base, type: 'nope' }).some((i) => i.path === 'record.type'));
  assert.ok(validateRecord({ ...base, source: { recordingMethod: 'telepathy' } }).some((i) => i.path === 'record.source.recordingMethod'));
  assert.ok(validateRecord({ ...base, zoneOffset: '+9' }).some((i) => i.path === 'record.zoneOffset'));
  assert.deepEqual(validateRecord({ ...base, zoneOffset: '+09:00', metadata: { 'hk.foo': 'bar' } }), []);
  assert.ok(validateRecord({ ...base, metadata: { n: 1 } }).some((i) => i.path === 'record.metadata.n'));
  const { id: _id, source: _source, ...partial } = base;
  assert.deepEqual(validateRecord(partial, { partial: true }), []);
  assert.equal(validateRecord(partial).length, 2, 'id and source required when not partial');
});

test('every schema example validates through the generated validators', () => {
  for (const entry of SCHEMA_BUNDLE.types) {
    const s = entry.schema as { title: HealthType; examples: unknown[] };
    for (const ex of s.examples) assert.deepEqual(validateValue(s.title, ex), [], s.title);
  }
});

test('TYPE_EXAMPLES carries every schema example, and each validates', () => {
  for (const entry of SCHEMA_BUNDLE.types) {
    const schema = entry.schema as { title: HealthType; examples: unknown[] };
    assert.deepEqual(TYPE_EXAMPLES[schema.title], schema.examples);
    for (const example of TYPE_EXAMPLES[schema.title]) assert.deepEqual(validateValue(schema.title, example), [], schema.title);
  }
});

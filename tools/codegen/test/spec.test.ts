import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { loadSpec } from '../src/load.js';
import { buildValidator, lintSpec, validateExamples } from '../src/validate.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const bundle = await loadSpec(ROOT);
const ajv = buildValidator(bundle);

test('spec passes structural lint', () => {
  assert.deepEqual(lintSpec(bundle), []);
});

test('every example validates against its type schema', () => {
  assert.deepEqual(validateExamples(ajv, bundle), []);
});

test('value schemas reject unknown properties and out-of-range numbers', () => {
  const steps = ajv.getSchema('https://healthspec.dev/schema/types/steps.json')!;
  assert.equal(steps({ count: 10, extra: 1 }), false);
  assert.equal(steps({ count: -1 }), false);
  assert.equal(steps({ count: 1.5 }), false, 'steps must be an integer');
  assert.equal(steps({ count: 0 }), true);
});

test('enum $refs resolve across files', () => {
  const sleep = ajv.getSchema('https://healthspec.dev/schema/types/sleep_session.json')!;
  assert.equal(sleep({ stages: [{ stage: 'rem', start: '2026-08-21T15:00:00Z', end: '2026-08-21T16:00:00Z' }] }), true);
  assert.equal(sleep({ stages: [{ stage: 'napping', start: '2026-08-21T15:00:00Z', end: '2026-08-21T16:00:00Z' }] }), false);
});

test('envelope requires id/type/start/end/value/source', () => {
  const envelope = ajv.getSchema('https://healthspec.dev/schema/common/record.json')!;
  assert.equal(envelope({ id: 'a', type: 'steps', start: '2026-08-21T00:00:00Z', end: '2026-08-21T01:00:00Z', value: { count: 1 }, source: { recordingMethod: 'automatic' } }), true);
  assert.equal(envelope({ id: 'a', type: 'steps', start: '2026-08-21T00:00:00Z', end: '2026-08-21T01:00:00Z', value: { count: 1 } }), false, 'source is required');
  assert.equal(envelope({ id: 'a', type: 'steps', start: 'yesterday', end: '2026-08-21T01:00:00Z', value: {}, source: { recordingMethod: 'manual' } }), false, 'start must be date-time');
});

test('HRV variants never map to each other', () => {
  const sdnn = bundle.types.find((t) => t.json.title === 'hrv_sdnn')!.json['x-healthspec'].platforms;
  const rmssd = bundle.types.find((t) => t.json.title === 'hrv_rmssd')!.json['x-healthspec'].platforms;
  assert.equal(sdnn.healthconnect, undefined);
  assert.equal(rmssd.healthkit, undefined);
});

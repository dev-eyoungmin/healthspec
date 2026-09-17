import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeCursor, isHealthError } from '@healthspec/core';
import { HC_BACKGROUND_PERMISSION, HC_HISTORY_PERMISSION, HealthConnectProvider } from '../src/HealthConnectProvider.js';
import { FakeHealthConnect } from './fakes.js';

const code = (c: string) => (e: unknown) => isHealthError(e) && e.code === c;
const T0 = Date.parse('2026-08-21T00:00:00.000Z');
const at = (h: number) => new Date(T0 + h * 3_600_000).toISOString();
const day = { start: new Date(T0), end: new Date(at(24)) };

test('availability gates calls with a readable message', async () => {
  const fake = new FakeHealthConnect();
  fake.status = 'not_installed';
  const p = new HealthConnectProvider(fake);
  assert.equal(await p.availability(), 'not_installed');
  await assert.rejects(p.read('steps', day), (e: unknown) => isHealthError(e) && e.code === 'NOT_AVAILABLE' && /not installed/.test(e.message));
  await p.openInstaller();
  assert.ok(fake.calls.some((c) => c.fn === 'openInstaller'));
});

test('capabilities and permissions follow the Health Connect mapping', async () => {
  const fake = new FakeHealthConnect();
  const p = new HealthConnectProvider(fake);
  const caps = p.capabilities();
  assert.ok(caps.types.includes('hrv_rmssd') && !caps.types.includes('hrv_sdnn'));
  const res = await p.requestPermissions({ read: ['steps', 'heart_rate'], write: ['weight'], background: true, history: true });
  const asked = fake.calls.find((c) => c.fn === 'requestPermissions')!.args[0] as string[];
  assert.deepEqual(asked.sort(), ['android.permission.health.READ_HEART_RATE', 'android.permission.health.READ_STEPS', HC_BACKGROUND_PERMISSION, HC_HISTORY_PERMISSION, 'android.permission.health.WRITE_WEIGHT'].sort());
  assert.deepEqual(res.read, { steps: 'granted', heart_rate: 'granted' });
  assert.deepEqual(res.write, { weight: 'granted' });
  assert.deepEqual(res.capabilities, { background: 'granted', history: 'granted' });
  const later = await p.getPermissions(['steps', 'weight']);
  assert.deepEqual(later.read, { steps: 'granted', weight: 'denied' });
  assert.deepEqual(later.write, { steps: 'denied', weight: 'granted' });
  await assert.rejects(p.requestPermissions({ read: ['hrv_sdnn'] }), code('NOT_SUPPORTED'));
});

test('read adds the type and forwards filters', async () => {
  const fake = new FakeHealthConnect();
  fake.add('steps', { start: at(9), end: at(10), value: { count: 500 }, zoneOffset: '+09:00' });
  fake.add('steps', { start: at(10), end: at(11), value: { count: 20 }, source: { app: { id: 'com.example.app' }, recordingMethod: 'manual' } });
  const p = new HealthConnectProvider(fake);
  const all = await p.read('steps', day);
  assert.equal(all.length, 2);
  assert.deepEqual([all[0]!.type, all[0]!.value.count, all[0]!.zoneOffset, all[0]!.id], ['steps', 500, '+09:00', 'hc-1']);
  const auto = await p.read('steps', { ...day, sources: { excludeManual: true }, limit: 5, order: 'desc' });
  assert.equal(auto.length, 1);
  const opts = fake.calls.at(-1)!.args[1] as { excludeManual?: boolean; limit?: number; ascending: boolean };
  assert.deepEqual([opts.excludeManual, opts.limit, opts.ascending], [true, 5, false]);
});

test('aggregate forwards zone, bucket and field', async () => {
  const fake = new FakeHealthConnect();
  fake.aggregateResponse = [{ start: day.start.toISOString(), end: day.end.toISOString(), value: 42 }];
  const p = new HealthConnectProvider(fake);
  const out = await p.aggregate('blood_pressure', { ...day, fn: 'avg', bucket: 'day', zone: 'Asia/Seoul', field: 'diastolicMmHg' });
  assert.equal(out[0]!.value, 42);
  const opts = fake.calls.at(-1)!.args[1] as { zone: string; bucket?: string; field?: string; fn: string };
  assert.deepEqual([opts.zone, opts.bucket, opts.field, opts.fn], ['Asia/Seoul', 'day', 'diastolicMmHg', 'avg']);
  await assert.rejects(p.aggregate('steps', { ...day, fn: 'avg' }), code('NOT_SUPPORTED'));
});

test('write validates first, then inserts the whole batch in one atomic call', async () => {
  const fake = new FakeHealthConnect();
  const p = new HealthConnectProvider(fake);
  const out = await p.write([
    { type: 'weight', start: at(7), end: at(7), value: { kilograms: 70 }, source: { recordingMethod: 'automatic', device: { type: 'scale' } } },
    { type: 'steps', start: at(8), end: at(9), value: { count: 100 } },
    { type: 'heart_rate', start: at(20), end: at(20), value: { bpm: 61 }, zoneOffset: '+09:00' },
  ]);
  const inserts = fake.calls.filter((c) => c.fn === 'insertRecords');
  assert.equal(inserts.length, 1, 'one native call for every type');
  const payload = inserts[0]!.args[0] as Array<{ type: string; recordingMethod: string; zoneOffset?: string; device?: { type?: string } }>;
  assert.deepEqual(payload.map((r) => [r.type, r.recordingMethod, r.zoneOffset, r.device?.type]), [['weight', 'automatic', undefined, 'scale'], ['steps', 'manual', undefined, undefined], ['heart_rate', 'manual', '+09:00', undefined]]);
  assert.deepEqual(out.map((r) => r.type), ['weight', 'steps', 'heart_rate']);
  assert.ok(out.every((r) => r.id.startsWith('hc-') && r.source.app?.id === 'com.example.app'));
  assert.ok(out[2]!.id.endsWith('#0'), 'a written series sample carries the id a read returns');
  assert.equal(out[0]!.source.device?.type, 'scale');

  fake.calls.length = 0;
  await assert.rejects(p.write([{ type: 'weight', start: at(7), end: at(7), value: { kilograms: 70 } }, { type: 'steps', start: at(8), end: at(9), value: { count: -5 } }]), code('INVALID_ARGUMENT'));
  assert.equal(fake.calls.filter((c) => c.fn === 'insertRecords').length, 0, 'an invalid record stops the batch before the platform is called');
});

test('device features gate types and capabilities', async () => {
  const fake = new FakeHealthConnect();
  fake.deviceFeatures = { ...fake.deviceFeatures, SKIN_TEMPERATURE: false, PERSONAL_HEALTH_RECORD: false, READ_HEALTH_DATA_IN_BACKGROUND: false };
  const p = new HealthConnectProvider(fake);
  const caps = p.capabilities();
  assert.ok(!caps.types.includes('skin_temperature') && !caps.types.includes('clinical_immunization'));
  assert.ok(caps.types.includes('mindfulness_session'));
  assert.equal(caps.background, false);
  assert.equal(caps.history, true);
  await assert.rejects(p.read('skin_temperature', day), code('NOT_SUPPORTED'));
  await assert.rejects(p.requestPermissions({ read: ['steps'], background: true }), code('NOT_SUPPORTED'));
});

test('aggregate rejects a field the type does not have', async () => {
  const p = new HealthConnectProvider(new FakeHealthConnect());
  await assert.rejects(p.aggregate('nutrition', { ...day, fn: 'sum', field: 'kilojoules' }), code('INVALID_ARGUMENT'));
});

test('changes: snapshot honours the history window, deltas carry deletes, expired tokens reject', async () => {
  const fake = new FakeHealthConnect();
  fake.add('weight', { start: at(7), end: at(7), value: { kilograms: 70 } });
  const p = new HealthConnectProvider(fake);
  const before = Date.now();
  const snap = await p.changes('weight');
  assert.equal(snap.snapshot, true);
  assert.equal(snap.upserts.length, 1);
  const readOpts = fake.calls.find((c) => c.fn === 'readRecords')!.args[1] as { start: string };
  assert.ok(Math.abs(Date.parse(readOpts.start) - (before - 30 * 86_400_000)) < 5_000, 'no history permission → 30-day window');
  assert.equal(decodeCursor(snap.cursor, 'google').t, 'weight:1');

  fake.add('weight', { start: at(8), end: at(8), value: { kilograms: 71 } });
  fake.remove('weight', 'hc-1');
  const delta = await p.changes('weight', { cursor: snap.cursor });
  assert.equal(delta.snapshot, false);
  assert.deepEqual(delta.upserts.map((r) => r.id), ['hc-2']);
  assert.deepEqual(delta.deletes, ['hc-1']);

  fake.expiredTokens.add(decodeCursor(delta.cursor, 'google').t);
  await assert.rejects(p.changes('weight', { cursor: delta.cursor }), code('CURSOR_EXPIRED'));

  fake.granted.add(HC_HISTORY_PERMISSION);
  await p.changes('weight');
  const full = fake.calls.filter((c) => c.fn === 'readRecords').at(-1)!.args[1] as { start: string };
  assert.equal(Date.parse(full.start), 0, 'history permission → since the epoch');
});

test('subscribe polls getChanges and reports changed types', async () => {
  const fake = new FakeHealthConnect();
  const p = new HealthConnectProvider(fake, { pollIntervalMs: 5 });
  const events: string[][] = [];
  const off = p.subscribe(['steps', 'weight'], (e) => events.push(e.types));
  await new Promise((r) => setTimeout(r, 15));
  fake.add('steps', { start: at(1), end: at(2), value: { count: 1 } });
  await new Promise((r) => setTimeout(r, 30));
  off();
  assert.ok(events.length >= 1 && events.every((e) => e.length === 1 && e[0] === 'steps'), JSON.stringify(events));
  const count = fake.calls.length;
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(fake.calls.length, count, 'no polling after unsubscribe');
});

test('Batch A types are declared; exercise_route is reached only through a dedicated operation', async () => {
  const p = new HealthConnectProvider(new FakeHealthConnect());
  const caps = p.capabilities();
  for (const t of ['menstruation_flow', 'menstruation_period', 'ovulation_test', 'cervical_mucus', 'basal_metabolic_rate', 'body_water_mass', 'bone_mass', 'speed', 'power', 'steps_cadence', 'elevation_gained'] as const) {
    assert.ok(caps.types.includes(t), t);
  }
  assert.ok(!caps.types.includes('exercise_route') && !caps.types.includes('basal_energy'));
  await assert.rejects(p.read('exercise_route', day), code('NOT_SUPPORTED'));
  const res = await p.requestPermissions({ read: ['menstruation_flow', 'menstruation_period'], write: ['exercise_route'] }).catch((e: unknown) => e);
  assert.ok(isHealthError(res) && res.code === 'NOT_SUPPORTED', 'route permissions are not requested through the generic path yet');
});

test('Personal Health Record types, routes, readById, settings and revocation', async () => {
  const fake = new FakeHealthConnect();
  fake.medical.set('clinical_immunization', [
    {
      id: 'ds1/1/imm-1',
      resourceType: 'Immunization',
      fhirVersion: 'R4',
      dataSourceId: 'ds1',
      fhir: JSON.stringify({ resourceType: 'Immunization', id: 'imm-1', status: 'completed', occurrenceDateTime: at(3), vaccineCode: { coding: [{ display: 'Influenza' }] } }),
    },
    { id: 'ds1/1/imm-2', resourceType: 'Immunization', fhirVersion: 'R4', dataSourceId: 'ds1', fhir: JSON.stringify({ resourceType: 'Immunization', occurrenceDateTime: '2019' }) },
  ]);
  fake.add('exercise_session', { id: 'sess-1', start: at(7), end: at(8), value: { activity: 'running' } });
  fake.routes.set('sess-1', [{ time: at(7), latitude: 37.5, longitude: 127 }, { time: at(8), latitude: 37.51, longitude: 127.01, altitudeMeters: 12 }]);
  const p = new HealthConnectProvider(fake);
  const caps = p.capabilities();
  assert.ok(caps.types.includes('clinical_immunization') && caps.types.includes('clinical_visit') && !caps.types.includes('clinical_coverage'));
  assert.ok(!caps.profile && caps.routes && caps.revokePermissions);
  const vaccines = await p.read('clinical_immunization', day);
  assert.equal(vaccines.length, 1, 'the resource dated 2019 is outside the range');
  const [vaccine] = vaccines;
  assert.equal(vaccine!.type, 'clinical_immunization');
  assert.equal(vaccine!.start, at(3), 'the envelope date comes from the FHIR resource');
  assert.equal(vaccine!.value.displayName, 'Influenza');
  assert.equal((vaccine!.value.fhir as { status: string }).status, 'completed');
  assert.equal(fake.calls.at(-1)!.args[0], 'clinical_immunization', 'the Kotlin module resolves spec type ids');
  const older = await p.read('clinical_immunization', { start: new Date(0), end: new Date(T0) });
  assert.equal(older[0]!.start, '2019-01-01T00:00:00.000Z');
  await assert.rejects(p.changes('clinical_immunization'), code('NOT_SUPPORTED'));
  assert.throws(() => p.subscribe(['clinical_immunization'], () => {}), code('NOT_SUPPORTED'));
  const route = await p.readRoute('sess-1');
  assert.equal(route?.value.points[1]!.altitudeMeters, 12);
  assert.equal(await p.readRoute('sess-2'), undefined);
  assert.equal((await p.readById('exercise_session', 'sess-1'))?.value.activity, 'running');
  assert.equal(await p.readById('exercise_session', 'sess-9'), undefined);
  const [hr] = await p.write([{ type: 'heart_rate', start: at(5), end: at(5), value: { bpm: 70 } }]);
  assert.equal((await p.readById('heart_rate', hr!.id))?.value.bpm, 70);
  assert.equal(fake.calls.at(-1)!.args[1], hr!.id, 'series ids reach the native module intact');
  await p.openSettings();
  await p.requestPermissions({ read: ['steps'] });
  await p.revokePermissions();
  assert.deepEqual((await p.getPermissions(['steps'])).read, { steps: 'denied' });
  await assert.rejects(p.requestPermissions({ read: ['steps'], write: ['clinical_immunization'] }), code('NOT_SUPPORTED'));
});

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HealthStore, MockProvider, isHealthError, type NewRecord } from '../src/index.js';

const NOW = Date.parse('2026-08-21T10:00:00Z');
const DAY = 86_400_000;
const code = (c: string) => (e: unknown) => isHealthError(e) && e.code === c;

function mock(options: ConstructorParameters<typeof MockProvider>[0] = {}) {
  return new MockProvider({ now: () => NOW, ...options });
}

test('seed data is deterministic and spans the requested days', async () => {
  const a = mock({ seed: 7, days: 3 });
  const b = mock({ seed: 7, days: 3 });
  assert.deepEqual(a.all(), b.all());
  assert.notDeepEqual(a.all('steps'), mock({ seed: 8, days: 3 }).all('steps'));
  await a.requestPermissions({ read: ['steps', 'sleep_session', 'heart_rate'] });
  const steps = await a.read('steps', { start: new Date(NOW - 3 * DAY), end: new Date(NOW) });
  assert.ok(steps.length > 20 && steps.length <= 16 * 3, `got ${steps.length}`);
  assert.ok(steps.every((r) => r.type === 'steps' && r.value.count >= 0 && r.source.device?.type === 'watch'));
  const sleep = await a.read('sleep_session', { start: new Date(NOW - 3 * DAY), end: new Date(NOW) });
  assert.ok(sleep.length >= 2 && sleep[0]!.value.stages.length > 5);
  const hr = await a.read('heart_rate', { start: new Date(NOW - DAY), end: new Date(NOW), order: 'desc', limit: 3 });
  assert.equal(hr.length, 3);
  assert.ok(Date.parse(hr[0]!.start) >= Date.parse(hr[1]!.start));
});

test('iOS semantics: read status is unknown, denied reads are empty, unrequested reads reject', async () => {
  const m = mock({ permissionPolicy: (t) => (t === 'weight' ? 'denied' : 'granted') });
  await assert.rejects(m.read('steps', { start: new Date(NOW - DAY), end: new Date(NOW) }), code('PERMISSION_DENIED'));
  const res = await m.requestPermissions({ read: ['steps', 'weight'], write: ['weight'], background: true, history: true });
  assert.deepEqual(res.read, { steps: 'unknown', weight: 'unknown' });
  assert.equal(res.write.weight, 'denied');
  assert.deepEqual(res.capabilities, { background: 'granted', history: 'granted' });
  assert.ok((await m.read('steps', { start: new Date(NOW - DAY), end: new Date(NOW) })).length > 0);
  assert.deepEqual(await m.read('weight', { start: new Date(NOW - DAY), end: new Date(NOW) }), []);
});

test('Android semantics: read status is known and denied reads reject', async () => {
  const m = mock({ platform: 'android', permissionPolicy: 'deny' });
  const res = await m.requestPermissions({ read: ['steps'] });
  assert.deepEqual(res.read, { steps: 'denied' });
  await assert.rejects(m.read('steps', { start: new Date(NOW - DAY), end: new Date(NOW) }), code('PERMISSION_DENIED'));
  const g = mock({ platform: 'android' });
  assert.deepEqual((await g.requestPermissions({ read: ['steps'] })).read, { steps: 'granted' });
  assert.deepEqual((await g.getPermissions(['heart_rate'])).read, { heart_rate: 'denied' });
});

test('write validates, stamps source, and shows up in reads/changes; delete propagates', async () => {
  const m = mock({ seed: false });
  await m.requestPermissions({ read: ['weight'], write: ['weight'] });
  await assert.rejects(m.write([{ type: 'weight', start: '2026-08-21T09:00:00Z', end: '2026-08-21T09:00:00Z', value: { kilograms: -1 } }]), code('INVALID_ARGUMENT'));
  await assert.rejects(m.write([{ type: 'steps', start: '2026-08-21T09:00:00Z', end: '2026-08-21T10:00:00Z', value: { count: 5 } }]), code('PERMISSION_DENIED'));
  const [w] = await m.write([{ type: 'weight', start: '2026-08-21T09:00:00Z', end: '2026-08-21T09:00:00Z', value: { kilograms: 71.5 } }]);
  assert.ok(w && w.id.startsWith('mock-'));
  assert.deepEqual(w.source, { app: { id: 'dev.healthspec.mock' }, recordingMethod: 'manual' });

  const snapshot = await m.changes('weight');
  assert.equal(snapshot.snapshot, true);
  assert.deepEqual(snapshot.upserts.map((r) => r.id), [w.id]);

  const [ext] = m.simulateExternalWrite([{ type: 'weight', start: '2026-08-21T09:30:00Z', end: '2026-08-21T09:30:00Z', value: { kilograms: 80 } }]);
  await m.delete({ type: 'weight', ids: [w.id, ext!.id] });
  const delta = await m.changes('weight', { cursor: snapshot.cursor });
  assert.equal(delta.snapshot, false);
  assert.deepEqual(delta.upserts.map((r) => r.id), [ext!.id], 'external write is an upsert');
  assert.deepEqual(delta.deletes, [w.id], 'only our own record was deletable');

  const nothing = await m.changes('weight', { cursor: delta.cursor });
  assert.deepEqual([nothing.upserts, nothing.deletes], [[], []]);
});

test('cursor expiry and HealthStore.sync resync', async () => {
  const m = mock({ seed: false, cursorTtlMs: 1000 });
  const store = new HealthStore(m);
  await store.requestPermissions({ read: ['steps'], write: ['steps'] });
  const first = await store.changes('steps');
  m.expireCursors();
  await assert.rejects(store.changes('steps', { cursor: first.cursor }), code('CURSOR_EXPIRED'));
  const { resynced, changes } = await store.sync('steps', first.cursor);
  assert.equal(resynced, true);
  assert.equal(changes.snapshot, true);
  await assert.rejects(m.changes('steps', { cursor: 'garbage' }), code('INVALID_ARGUMENT'));
});

test('aggregate sums per day bucket and respects source filters', async () => {
  const m = mock({ seed: 1, days: 2 });
  await m.requestPermissions({ read: ['steps', 'hydration'] });
  const days = await m.aggregate('steps', { start: new Date(NOW - 2 * DAY), end: new Date(NOW), fn: 'sum', bucket: 'day', zone: 'UTC' });
  assert.equal(days.length, 3);
  assert.ok(days.every((d) => d.value === null || d.value > 0));
  const all = await m.aggregate('steps', { start: new Date(NOW - 2 * DAY), end: new Date(NOW), fn: 'sum' });
  assert.equal(all[0]!.value, days.reduce((a, d) => a + (d.value ?? 0), 0));
  const manual = await m.aggregate('hydration', { start: new Date(NOW - DAY), end: new Date(NOW), fn: 'sum', sources: { excludeManual: true } });
  assert.equal(manual[0]!.value, null, 'hydration is manual-only');
  await assert.rejects(m.aggregate('steps', { start: new Date(NOW - DAY), end: new Date(NOW), fn: 'avg' }), code('NOT_SUPPORTED'));
});

test('subscribe fires for affected types only', async () => {
  const m = mock({ seed: false });
  await m.requestPermissions({ write: ['steps', 'weight'] });
  const events: string[][] = [];
  const off = m.subscribe(['steps'], (e) => events.push(e.types));
  await m.write([{ type: 'weight', start: '2026-08-21T09:00:00Z', end: '2026-08-21T09:00:00Z', value: { kilograms: 70 } }]);
  await m.write([{ type: 'steps', start: '2026-08-21T09:00:00Z', end: '2026-08-21T10:00:00Z', value: { count: 5 } }]);
  await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(events, [['steps']]);
  off();
  await m.write([{ type: 'steps', start: '2026-08-21T10:00:00Z', end: '2026-08-21T11:00:00Z', value: { count: 5 } }]);
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(events.length, 1);
});

test('availability gates everything', async () => {
  const m = mock({ availability: 'not_installed' });
  assert.equal(await m.availability(), 'not_installed');
  await assert.rejects(m.requestPermissions({ read: ['steps'] }), code('NOT_AVAILABLE'));
  await assert.rejects(m.read('steps', { start: new Date(0), end: new Date(NOW) }), code('NOT_AVAILABLE'));
});

test('undeclared types are NOT_SUPPORTED at provider and store level', async () => {
  const m = mock({ types: ['steps'] });
  const store = new HealthStore(m);
  assert.deepEqual(store.capabilities().types, ['steps']);
  await assert.rejects(m.read('weight', { start: new Date(0), end: new Date(NOW) }), code('NOT_SUPPORTED'));
  assert.throws(() => store.subscribe(['weight'], () => {}), code('NOT_SUPPORTED'));
  await assert.rejects(store.read('nope' as never, { start: new Date(0), end: new Date(NOW) }), code('INVALID_ARGUMENT'));
  const bad: NewRecord[] = [{ type: 'steps', start: '2026-08-21T10:00:00Z', end: '2026-08-21T09:00:00Z', value: { count: 1 } }];
  await assert.rejects(store.write(bad), (e: unknown) => isHealthError(e) && e.code === 'INVALID_ARGUMENT' && /records\[0\]\.end/.test(e.message));
});

test('optional operations: profile, route, readById, revoke, preferred units', async () => {
  const m = mock({ seed: 3, days: 4 });
  const store = new HealthStore(m);
  assert.ok(store.capabilities().profile && store.capabilities().routes && !store.capabilities().types.includes('exercise_route'));
  await store.requestPermissions({ read: ['exercise_session', 'weight'], profile: true });
  const profile = await store.getProfile();
  assert.equal(profile.biologicalSex, 'female');
  const [session] = await store.read('exercise_session', { start: new Date(NOW - 4 * DAY), end: new Date(NOW) });
  assert.ok(session);
  const route = await store.readRoute(session.id);
  assert.equal(route?.type, 'exercise_route');
  assert.equal(route?.value.sessionId, session.id);
  assert.ok((route?.value.points.length ?? 0) > 10);
  assert.equal(await store.readRoute('nope'), undefined);
  assert.equal((await store.readById('exercise_session', session.id))?.id, session.id);
  assert.deepEqual(await store.preferredUnits(['weight', 'steps']), { weight: 'kg', steps: 'count' });
  await store.revokePermissions();
  await assert.rejects(store.read('weight', { start: new Date(0), end: new Date(NOW) }), code('PERMISSION_DENIED'));
  const android = new HealthStore(mock({ platform: 'android', seed: false }));
  assert.deepEqual(await android.getProfile(), {}, 'Health Connect has no profile');
});

test('support() and describe() report platform differences and point at counterparts', async () => {
  const ios = new HealthStore(mock({ seed: false }));
  const sdnn = ios.support('hrv_sdnn');
  assert.deepEqual([sdnn.supported, sdnn.read, sdnn.counterparts.length], [true, true, 1]);
  assert.equal(sdnn.counterparts[0]!.type, 'hrv_rmssd');
  assert.equal(sdnn.counterparts[0]!.interchangeable, false, 'SDNN and RMSSD must never be swapped');

  const mucus = ios.support('cervical_mucus');
  assert.deepEqual(mucus.missingFields, ['sensation'], 'HealthKit has no sensation field');
  assert.deepEqual(ios.support('sleep_session').missingFields, ['title', 'notes']);
  assert.deepEqual(ios.support('steps').missingFields, []);

  const report = ios.describe();
  assert.equal(report.types.length, 182);
  assert.ok(report.supportedCount > 100 && report.unsupportedCount > 0);

  // A provider limited to one type reports everything else as unsupported without throwing.
  const narrow = new HealthStore(mock({ types: ['steps'], seed: false }));
  assert.equal(narrow.support('weight').supported, false);
  assert.equal(narrow.support('weight').read, false);
  assert.throws(() => narrow.support('nope' as never), code('INVALID_ARGUMENT'));
});

test('NOT_SUPPORTED errors name the counterpart', async () => {
  const narrow = new HealthStore(mock({ types: ['steps'], seed: false }));
  await assert.rejects(
    narrow.read('hrv_sdnn', { start: new Date(0), end: new Date(NOW) }),
    (e: unknown) => isHealthError(e) && e.code === 'NOT_SUPPORTED' && /hrv_rmssd/.test(e.message) && /measures something different/.test(e.message),
  );
  await assert.rejects(
    narrow.read('distance_cycling', { start: new Date(0), end: new Date(NOW) }),
    (e: unknown) => isHealthError(e) && /"distance"/.test(e.message),
  );
});

test('supportedTypes narrows a declaration to what the provider offers', async () => {
  const store = new HealthStore(mock({ types: ['steps', 'heart_rate'], seed: false }));
  assert.deepEqual(store.supportedTypes(['steps', 'sleep_session', 'heart_rate']), ['steps', 'heart_rate']);
  // One declaration, both platforms: the unsupported type is dropped instead of rejecting the whole request.
  const result = await store.requestSupportedPermissions({ read: ['steps', 'sleep_session'], write: ['weight'] });
  assert.deepEqual(Object.keys(result.read), ['steps']);
  assert.deepEqual(Object.keys(result.write), []);
  await assert.rejects(store.requestPermissions({ read: ['steps', 'sleep_session'] }), code('NOT_SUPPORTED'));
});

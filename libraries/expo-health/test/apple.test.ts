import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeCursor, encodeCursor, isHealthError } from '@healthspec/core';
import { AppleHealthProvider, deriveSleepSessions } from '../src/AppleHealthProvider.js';
import type { HKSaveSample } from '../src/native.js';
import { FakeApple } from './fakes.js';

const code = (c: string) => (e: unknown) => isHealthError(e) && e.code === c;
const T0 = Date.parse('2026-08-21T00:00:00.000Z');
const at = (h: number, m = 0) => new Date(T0 + h * 3_600_000 + m * 60_000).toISOString();
const day = { start: new Date(T0), end: new Date(at(24)) };
const STEPS = 'HKQuantityTypeIdentifierStepCount';
const SLEEP = 'HKCategoryTypeIdentifierSleepAnalysis';
const HR = 'HKQuantityTypeIdentifierHeartRate';

test('capabilities follow the spec mapping', () => {
  const caps = new AppleHealthProvider(new FakeApple()).capabilities();
  assert.ok(caps.types.includes('hrv_sdnn') && !caps.types.includes('hrv_rmssd') && !caps.types.includes('skin_temperature'));
  assert.ok(caps.write.includes('steps') && !caps.write.includes('total_energy'));
});

test('requestPermissions: reads are unknown, writes reflect authorization, correlations are not authorized directly', async () => {
  const fake = new FakeApple();
  fake.denied.add('HKQuantityTypeIdentifierBodyMass');
  const p = new AppleHealthProvider(fake);
  const res = await p.requestPermissions({ read: ['steps', 'blood_pressure'], write: ['steps', 'weight', 'blood_pressure'], background: true, history: true });
  assert.deepEqual(res.read, { steps: 'unknown', blood_pressure: 'unknown' });
  assert.deepEqual(res.write, { steps: 'granted', weight: 'denied', blood_pressure: 'granted' });
  assert.deepEqual(res.capabilities, { background: 'granted', history: 'granted' });
  const [read, write] = fake.calls.find((c) => c.fn === 'requestAuthorization')!.args as [string[], string[]];
  assert.ok(![...read, ...write].some((id) => id.startsWith('HKCorrelationTypeIdentifier')));
  assert.ok(read.includes('HKQuantityTypeIdentifierBloodPressureSystolic'));
  await assert.rejects(p.requestPermissions({ write: ['total_energy'] }), code('NOT_SUPPORTED'));
  await assert.rejects(p.requestPermissions({ read: ['hrv_rmssd'] }), code('NOT_SUPPORTED'));
});

test('read maps quantity samples, scales percent units, derives zoneOffset and device type', async () => {
  const fake = new FakeApple();
  fake.add(STEPS, { start: at(9), end: at(10), value: 1200, metadata: { HKTimeZone: 'Asia/Seoul' }, device: { model: 'Watch7,1', manufacturer: 'Apple Inc.' } });
  fake.add(STEPS, { start: at(10), end: at(11), value: 300, wasUserEntered: true, metadata: { HKWasUserEntered: 'true' } });
  fake.add('HKQuantityTypeIdentifierBodyFatPercentage', { start: at(8), end: at(8), value: 0.213 });
  const p = new AppleHealthProvider(fake);
  const steps = await p.read('steps', day);
  assert.equal(steps.length, 2);
  assert.equal(steps[0]!.value.count, 1200);
  assert.equal(steps[0]!.zoneOffset, '+09:00');
  assert.equal(steps[0]!.source.device?.type, 'watch');
  assert.equal(steps[0]!.metadata?.['hk.identifier'], STEPS);
  assert.equal(steps[1]!.source.recordingMethod, 'manual');
  assert.equal((await p.read('steps', { ...day, sources: { excludeManual: true } })).length, 1);
  assert.equal((await p.read('steps', { ...day, order: 'desc', limit: 1 }))[0]!.value.count, 300);
  const fat = await p.read('body_fat', day);
  assert.ok(Math.abs(fat[0]!.value.percent - 21.3) < 1e-9);
  assert.equal((fake.calls.find((c) => c.fn === 'querySamples')!.args[0] as { unit: string }).unit, 'count');
});

test('sleep sessions are derived per source with a 60-minute gap and stage mapping', () => {
  const fake = new FakeApple();
  fake.add(SLEEP, { start: at(-1, 30), end: at(0, 30), category: 3 });
  fake.add(SLEEP, { start: at(0, 30), end: at(2), category: 4 });
  fake.add(SLEEP, { start: at(2), end: at(2, 20), category: 5 });
  fake.add(SLEEP, { start: at(2, 20), end: at(7), category: 0 });
  fake.add(SLEEP, { start: at(14), end: at(14, 30), category: 1 });
  fake.add(SLEEP, { start: at(1), end: at(6), category: 1, sourceBundleId: 'com.other' });
  const sessions = deriveSleepSessions(fake.samples.get(SLEEP)!);
  assert.equal(sessions.length, 3);
  const [night, other, nap] = sessions;
  assert.equal(night!.type, 'sleep_session');
  if (night!.type !== 'sleep_session' || nap!.type !== 'sleep_session') throw new Error('unreachable');
  assert.deepEqual(night.value.stages.map((s) => s.stage), ['light', 'deep', 'rem', 'in_bed']);
  assert.deepEqual([night.start, night.end], [at(-1, 30), at(7)]);
  assert.equal(night.metadata?.['hk.sampleIds']?.split(',').length, 4);
  assert.equal(other!.source.app?.id, 'com.other');
  assert.equal(nap.value.stages[0]!.stage, 'sleeping');
});

test('read sleep_session widens the native window and keeps only overlapping sessions', async () => {
  const fake = new FakeApple();
  fake.add(SLEEP, { start: at(-1), end: at(7), category: 1 });
  fake.add(SLEEP, { start: at(14), end: at(15), category: 1 });
  const p = new AppleHealthProvider(fake);
  const sessions = await p.read('sleep_session', { start: new Date(at(3)), end: new Date(at(5)) });
  assert.equal(sessions.length, 1);
  const q = fake.calls.find((c) => c.fn === 'querySamples')!.args[0] as { start: string };
  assert.equal(q.start, at(3 - 24));
});

test('blood pressure correlations, workouts and nutrition convert to spec values', async () => {
  const fake = new FakeApple();
  const sub = (identifier: string, value: number) => ({ uuid: `${identifier}-1`, identifier, start: at(7), end: at(7), value, metadata: {}, sourceBundleId: 'x', wasUserEntered: false });
  fake.add('HKCorrelationTypeIdentifierBloodPressure', { start: at(7), end: at(7), objects: [sub('HKQuantityTypeIdentifierBloodPressureSystolic', 118), sub('HKQuantityTypeIdentifierBloodPressureDiastolic', 76)] });
  fake.add('HKWorkoutTypeIdentifier', { start: at(7), end: at(7, 40), workoutActivityType: 37, totals: { distanceMeters: 5000 } });
  fake.add('HKWorkoutTypeIdentifier', { start: at(18), end: at(19), workoutActivityType: 13, metadata: { HKIndoorWorkout: 'true' } });
  fake.add('HKWorkoutTypeIdentifier', { start: at(20), end: at(21), workoutActivityType: 46, metadata: { HKSwimmingLocationType: '2' } });
  fake.add('HKWorkoutTypeIdentifier', { start: at(21), end: at(22), workoutActivityType: 9999 });
  fake.add('HKQuantityTypeIdentifierDietaryEnergyConsumed', { start: at(12), end: at(12, 30), value: 620, metadata: { HKFoodType: 'Bibimbap' } });
  fake.add('HKQuantityTypeIdentifierDietaryProtein', { start: at(12), end: at(12, 30), value: 32 });
  fake.add('HKQuantityTypeIdentifierDietaryProtein', { start: at(19), end: at(19, 10), value: 20 });
  const p = new AppleHealthProvider(fake);
  const bp = await p.read('blood_pressure', day);
  assert.deepEqual(bp[0]!.value, { systolicMmHg: 118, diastolicMmHg: 76 });
  const workouts = await p.read('exercise_session', day);
  assert.deepEqual(workouts.map((r) => r.value.activity), ['running', 'cycling_stationary', 'swimming_open_water', 'other']);
  assert.equal(workouts[0]!.metadata?.['hk.totalDistanceMeters'], '5000');
  const meals = await p.read('nutrition', day);
  assert.equal(meals.length, 2);
  assert.deepEqual(meals[0]!.value, { kilocalories: 620, proteinGrams: 32, name: 'Bibimbap' });
  assert.deepEqual(meals[1]!.value, { proteinGrams: 20 });
});

test('aggregate uses HKStatistics for quantities, sums derived components, and falls back to records otherwise', async () => {
  const fake = new FakeApple();
  fake.statsResponse = [{ start: at(0), end: at(24), value: 0.5 }];
  fake.add('HKCategoryTypeIdentifierMindfulSession', { start: at(7), end: at(7, 10), category: 0 });
  const p = new AppleHealthProvider(fake);
  const fat = await p.aggregate('body_fat', { ...day, fn: 'avg', bucket: 'day' });
  assert.equal(fat[0]!.value, 50);
  const call = fake.calls.find((c) => c.fn === 'statistics')!.args[0] as { interval?: unknown; anchor?: string; unit: string };
  assert.deepEqual(call.interval, { unit: 'day', count: 1 });
  assert.ok(call.anchor);
  assert.equal(call.unit, '%');
  const mind = await p.aggregate('mindfulness_session', { ...day, fn: 'duration' });
  assert.equal(mind[0]!.value, 600);
  fake.statsResponse = [{ start: at(0), end: at(24), value: 100 }];
  assert.equal((await p.aggregate('total_energy', { ...day, fn: 'sum' }))[0]!.value, 200);
  const bp = await p.aggregate('blood_pressure', { ...day, fn: 'avg', field: 'diastolicMmHg' });
  assert.equal(bp[0]!.value, 100);
  assert.equal((fake.calls.at(-1)!.args[0] as { identifier: string }).identifier, 'HKQuantityTypeIdentifierBloodPressureDiastolic');
  await assert.rejects(p.aggregate('steps', { ...day, fn: 'sum', zone: 'Mars/Olympus' }), code('NOT_SUPPORTED'));
  await assert.rejects(p.aggregate('steps', { ...day, fn: 'avg' }), code('NOT_SUPPORTED'));
});

test('write builds HK samples: units, percent fractions, sleep stages, correlations, workouts', async () => {
  const fake = new FakeApple();
  const p = new AppleHealthProvider(fake);
  const out = await p.write([
    { type: 'weight', start: at(7), end: at(7), value: { kilograms: 72.4 }, source: { recordingMethod: 'manual' } },
    { type: 'body_fat', start: at(7), end: at(7), value: { percent: 21 } },
    { type: 'sleep_session', start: at(-1), end: at(7), value: { stages: [{ stage: 'light', start: at(-1), end: at(3) }, { stage: 'awake_in_bed', start: at(3), end: at(7) }] } },
    { type: 'blood_pressure', start: at(8), end: at(8), value: { systolicMmHg: 120, diastolicMmHg: 80 } },
    { type: 'exercise_session', start: at(9), end: at(10), value: { activity: 'running_treadmill' } },
    { type: 'nutrition', start: at(12), end: at(12, 30), value: { kilocalories: 500, proteinGrams: 20, name: 'Lunch' } },
  ]);
  const saved = fake.calls.find((c) => c.fn === 'save')!.args[0] as HKSaveSample[];
  assert.equal(saved.length, 7);
  assert.deepEqual([saved[0]!.unit, saved[0]!.value, saved[0]!.metadata?.['HKWasUserEntered']], ['kg', 72.4, true], 'HealthKit validates metadata types, so booleans stay booleans');
  assert.equal(saved[1]!.value, 0.21);
  assert.deepEqual([saved[2]!.category, saved[3]!.category], [3, 0]);
  assert.equal(saved[4]!.objects?.length, 2);
  assert.deepEqual([saved[5]!.workoutActivityType, saved[5]!.metadata?.['HKIndoorWorkout']], [37, 'true']);
  assert.deepEqual([saved[6]!.identifier, saved[6]!.objects?.length, saved[6]!.metadata?.['HKFoodType']], ['HKCorrelationTypeIdentifierFood', 2, 'Lunch']);
  assert.equal(out.length, 6);
  assert.equal(out[2]!.metadata?.['hk.sampleIds']?.split(',').length, 2);
  assert.equal(out[0]!.source.app?.id, 'com.example.app');
  await assert.rejects(p.write([{ type: 'total_energy', start: at(0), end: at(1), value: { kilocalories: 1 } }]), code('NOT_SUPPORTED'));
  await assert.rejects(p.write([{ type: 'nutrition', start: at(0), end: at(1), value: { name: 'empty' } }]), code('INVALID_ARGUMENT'));

  // Validation happens before the native call, so nothing is written (SPEC §7).
  fake.calls.length = 0;
  await assert.rejects(p.write([{ type: 'weight', start: at(1), end: at(1), value: { kilograms: 70 } }, { type: 'weight', start: at(1), end: at(1), value: { kilograms: -1 } }]), code('INVALID_ARGUMENT'));
  assert.equal(fake.calls.filter((c) => c.fn === 'save').length, 0);

  // Types Apple reserves are never offered for writing, and a read-back record's HealthKit metadata is not echoed.
  await assert.rejects(p.write([{ type: 'apple_stand_hour', start: at(0), end: at(1), value: { status: 'stood' } }]), code('NOT_SUPPORTED'));
  await p.write([{ type: 'steps', start: at(2), end: at(3), value: { count: 10 }, metadata: { HKAverageMETs: '8.2 kcal/hr·kg', 'hk.identifier': 'x', appKey: 'kept' } }]);
  const echoed = (fake.calls.at(-1)!.args[0] as HKSaveSample[])[0]!.metadata;
  assert.deepEqual(echoed, { appKey: 'kept' });
});

test('HealthKit-required metadata: insulin reason is mapped to its raw value, cycle start defaults to false', async () => {
  const fake = new FakeApple();
  const p = new AppleHealthProvider(fake);
  await p.write([
    { type: 'insulin_delivery', start: at(1), end: at(1), value: { internationalUnits: 4, reason: 'bolus' } },
    { type: 'menstruation_flow', start: at(0), end: at(24), value: { flow: 'light' } },
  ]);
  const saved = fake.calls.find((c) => c.fn === 'save')!.args[0] as HKSaveSample[];
  assert.equal(saved[0]!.metadata?.['HKInsulinDeliveryReason'], 2);
  assert.equal(saved[1]!.metadata?.['HKMenstrualCycleStart'], false);
  fake.add('HKQuantityTypeIdentifierInsulinDelivery', { start: at(5), end: at(5), value: 3, metadata: { HKInsulinDeliveryReason: '1' } });
  const [dose] = await p.read('insulin_delivery', { start: new Date(at(4)), end: new Date(at(6)) });
  assert.deepEqual(dose!.value, { internationalUnits: 3, reason: 'basal' });
});

test('types newer than the OS are unsupported, and background delivery needs the plugin', async () => {
  const fake = new FakeApple();
  fake.unsupported.add('HKDataTypeIdentifierStateOfMind');
  fake.backgroundConfigured = false;
  const p = new AppleHealthProvider(fake);
  const caps = p.capabilities();
  assert.ok(!caps.types.includes('state_of_mind') && caps.types.includes('steps'));
  assert.equal(caps.background, false);
  await assert.rejects(p.read('state_of_mind', day), code('NOT_SUPPORTED'));
  await assert.rejects(p.requestPermissions({ read: ['steps'], background: true }), code('NOT_SUPPORTED'));
});

test('changes round-trips anchors through the cursor and reports deletions', async () => {
  const fake = new FakeApple();
  fake.add(HR, { start: at(1), end: at(1), value: 60 });
  const p = new AppleHealthProvider(fake);
  const first = await p.changes('heart_rate');
  assert.equal(first.snapshot, true);
  assert.equal(first.upserts.length, 1);
  assert.deepEqual(JSON.parse(decodeCursor(first.cursor, 'apple').t), { [HR]: '1' });
  fake.add(HR, { start: at(2), end: at(2), value: 70 });
  fake.anchoredResponse = { deleted: ['gone'] };
  const delta = await p.changes('heart_rate', { cursor: first.cursor });
  assert.equal(delta.snapshot, false);
  assert.deepEqual(delta.upserts.map((r) => r.value.bpm), [70]);
  assert.deepEqual(delta.deletes, ['gone']);
  await assert.rejects(p.changes('heart_rate', { cursor: encodeCursor({ p: 'apple', t: JSON.stringify({ [HR]: 'bad' }), at: 0 }) }), code('CURSOR_EXPIRED'));
  await assert.rejects(p.changes('heart_rate', { cursor: encodeCursor({ p: 'google', t: '{}', at: 0 }) }), code('INVALID_ARGUMENT'));
});

test('subscribe starts observers, dispatches by type, enables background delivery, and stops on unsubscribe', async () => {
  const fake = new FakeApple();
  const p = new AppleHealthProvider(fake);
  await p.requestPermissions({ read: ['steps'], background: true });
  const events: string[][] = [];
  const off = p.subscribe(['steps', 'heart_rate'], (e) => events.push(e.types));
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(fake.calls.filter((c) => c.fn === 'startObserving').length, 2);
  assert.equal(fake.calls.filter((c) => c.fn === 'enableBackgroundDelivery').length, 2);
  fake.emit(STEPS);
  fake.emit('HKQuantityTypeIdentifierBodyMass');
  assert.deepEqual(events, [['steps']]);
  off();
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(fake.calls.filter((c) => c.fn === 'stopObserving').length, 2);
  assert.equal(fake.listeners.length, 0);
});

test('unavailable HealthKit rejects everything with NOT_AVAILABLE', async () => {
  const fake = new FakeApple();
  fake.available = false;
  const p = new AppleHealthProvider(fake);
  assert.equal(await p.availability(), 'not_supported');
  await assert.rejects(p.read('steps', day), code('NOT_AVAILABLE'));
  await assert.rejects(p.requestPermissions({ read: ['steps'] }), code('NOT_AVAILABLE'));
});

test('schema-driven category mapping: enum values and metadata fields round-trip', async () => {
  const fake = new FakeApple();
  fake.add('HKCategoryTypeIdentifierMenstrualFlow', { start: at(0), end: at(24), category: 3, metadata: { HKMenstrualCycleStart: 'true' } });
  fake.add('HKCategoryTypeIdentifierOvulationTestResult', { start: at(8), end: at(8), category: 2 });
  fake.add('HKCategoryTypeIdentifierSexualActivity', { start: at(22), end: at(22), category: 0, metadata: { HKSexualActivityProtectionUsed: 'false' } });
  fake.add('HKCategoryTypeIdentifierCervicalMucusQuality', { start: at(9), end: at(9), category: 5 });
  const p = new AppleHealthProvider(fake);
  const [flow] = await p.read('menstruation_flow', { start: new Date(T0), end: new Date(at(48)) });
  assert.deepEqual(flow!.value, { flow: 'medium', cycleStart: true });
  const [ovulation] = await p.read('ovulation_test', day);
  assert.deepEqual(ovulation!.value, { result: 'positive' });
  const [sex] = await p.read('sexual_activity', day);
  assert.deepEqual(sex!.value, { protectionUsed: 'unprotected' });
  const [mucus] = await p.read('cervical_mucus', day);
  assert.deepEqual(mucus!.value, { appearance: 'egg_white' });

  await p.write([
    { type: 'menstruation_flow', start: at(24), end: at(48), value: { flow: 'heavy', cycleStart: false } },
    { type: 'ovulation_test', start: at(30), end: at(30), value: { result: 'high' } },
    { type: 'sexual_activity', start: at(31), end: at(31), value: { protectionUsed: 'protected' } },
    { type: 'intermenstrual_bleeding', start: at(32), end: at(32), value: {} },
  ]);
  const saved = fake.calls.find((c) => c.fn === 'save')!.args[0] as HKSaveSample[];
  assert.deepEqual(saved.map((s) => s.category), [4, 4, 0, 0]);
  assert.equal(saved[0]!.metadata?.['HKMenstrualCycleStart'], false);
  assert.equal(saved[2]!.metadata?.['HKSexualActivityProtectionUsed'], true);
});

test('series types are excluded from generic operations and capabilities', async () => {
  const p = new AppleHealthProvider(new FakeApple());
  assert.ok(!p.capabilities().types.includes('exercise_route'));
  assert.ok(p.capabilities().types.includes('basal_energy') && !p.capabilities().types.includes('basal_metabolic_rate'));
  await assert.rejects(p.read('exercise_route', day), code('NOT_SUPPORTED'));
});

test('special HealthKit data: ECG, state of mind, heartbeat series, clinical records', async () => {
  const fake = new FakeApple();
  fake.add('HKDataTypeIdentifierElectrocardiogram', { start: at(8), end: at(8, 0.5), ecg: { classification: 1, symptomsStatus: 1, averageHeartRate: 64, samplingFrequency: 512, voltageCount: 15360 } });
  fake.add('HKDataTypeIdentifierStateOfMind', { start: at(9), end: at(9), stateOfMind: { kind: 1, valence: 0.6, valenceClassification: 6, labels: [7, 15], associations: [5] } });
  const hb = fake.add('HKDataTypeIdentifierHeartbeatSeries', { start: at(10), end: at(10, 1), heartbeatCount: 2 });
  fake.heartbeats.set(hb.uuid, [{ offsetSeconds: 0.8, precededByGap: false }, { offsetSeconds: 1.62, precededByGap: false }]);
  fake.add('HKClinicalTypeIdentifierLabResultRecord', { start: at(11), end: at(11), clinical: { resourceType: 'Observation', fhirVersion: 'R4', displayName: 'HbA1c', fhir: '{"resourceType":"Observation","status":"final"}' } });
  const p = new AppleHealthProvider(fake);
  const [ecg] = await p.read('electrocardiogram', day);
  assert.deepEqual(ecg!.value, { classification: 'sinus_rhythm', symptomsStatus: 'none', averageBpm: 64, samplingFrequencyHz: 512, voltageCount: 15360 });
  const [mood] = await p.read('state_of_mind', day);
  assert.deepEqual(mood!.value, { kind: 'momentary_emotion', valence: 0.6, valenceClassification: 'pleasant', labels: ['calm', 'grateful'], associations: ['family'] });
  const [series] = await p.read('heartbeat_series', day);
  assert.equal(series!.value.count, 2);
  assert.equal(series!.value.beats[1]!.offsetSeconds, 1.62);
  const [lab] = await p.read('clinical_lab_result', day);
  assert.deepEqual(lab!.value, { resourceType: 'Observation', fhirVersion: 'R4', displayName: 'HbA1c', fhir: { resourceType: 'Observation', status: 'final' } });
  await p.write([{ type: 'state_of_mind', start: at(12), end: at(12), value: { kind: 'daily_mood', valence: -0.3, labels: ['stressed'], associations: ['work'] } }]);
  const saved = fake.calls.find((c) => c.fn === 'save')!.args[0] as HKSaveSample[];
  assert.deepEqual(saved[0]!.stateOfMind, { kind: 2, valence: -0.3, labels: [29], associations: [17] });
  await assert.rejects(p.write([{ type: 'electrocardiogram', start: at(0), end: at(1), value: { classification: 'sinus_rhythm' } }]), code('NOT_SUPPORTED'));
  const caps = p.capabilities();
  assert.ok(caps.types.includes('clinical_allergy') && !caps.types.includes('clinical_visit') && !caps.write.includes('electrocardiogram') && caps.write.includes('state_of_mind'));
});

test('activity summaries, profile, routes, readById and preferred units', async () => {
  const fake = new FakeApple();
  fake.summaries = [{ date: '2026-08-21', activeEnergyKilocalories: 480, activeEnergyGoalKilocalories: 500, exerciseMinutes: 32, exerciseGoalMinutes: 30, standHours: 11, standGoalHours: 12, activityMoveMode: 1 }];
  const workout = fake.add('HKWorkoutTypeIdentifier', { start: at(7), end: at(8), workoutActivityType: 37 });
  fake.routes.set(workout.uuid, [{ time: at(7), latitude: 37.5, longitude: 127, altitudeMeters: 30 }, { time: at(8), latitude: 37.51, longitude: 127.01 }]);
  const steps = fake.add(STEPS, { start: at(9), end: at(10), value: 100 });
  const p = new AppleHealthProvider(fake);
  const [summary] = await p.read('activity_summary', day);
  assert.equal(summary!.value.date, '2026-08-21');
  assert.equal(summary!.value.activityMoveMode, 'active_energy');
  const snap = await p.changes('activity_summary');
  assert.equal(snap.snapshot, true);
  assert.equal((await p.changes('activity_summary', { cursor: snap.cursor })).snapshot, false);

  await p.requestPermissions({ read: ['steps', 'medication_dose'], profile: true });
  const [readIds] = fake.calls.find((c) => c.fn === 'requestAuthorization')!.args as [string[]];
  assert.ok(readIds.includes('HKCharacteristicTypeIdentifierDateOfBirth'));
  assert.ok(fake.calls.some((c) => c.fn === 'requestMedicationsAuthorization'));
  assert.deepEqual(await p.getProfile(), { biologicalSex: 'male', dateOfBirth: '1990-05-14', bloodType: 'o_positive', wheelchairUse: false, activityMoveMode: 'active_energy' });

  const route = await p.readRoute(workout.uuid);
  assert.equal(route?.value.points.length, 2);
  assert.equal(route?.value.sessionId, workout.uuid);
  assert.equal(await p.readRoute('nope'), undefined);

  const byId = await p.readById('steps', steps.uuid);
  assert.equal(byId?.value.count, 100);
  assert.equal(await p.readById('steps', 'missing'), undefined);
  assert.deepEqual(await p.preferredUnits(['weight', 'steps']), { weight: 'lb', steps: 'count' });
  await p.openSettings();
  assert.ok(fake.calls.some((c) => c.fn === 'openHealthApp'));
});

test('a meal keeps one id across write, read, readById and delete', async () => {
  const fake = new FakeApple();
  const p = new AppleHealthProvider(fake);
  // What HealthKit holds after a food correlation was saved: the correlation and, separately, its nutrient samples.
  const protein = fake.add('HKQuantityTypeIdentifierDietaryProtein', { uuid: 'protein-1', start: at(12), end: at(12), value: 20 });
  const energy = fake.add('HKQuantityTypeIdentifierDietaryEnergyConsumed', { uuid: 'energy-1', start: at(12), end: at(12), value: 500 });
  fake.add('HKCorrelationTypeIdentifierFood', { uuid: 'meal-1', start: at(12), end: at(12), objects: [protein, energy], metadata: { HKFoodType: 'Lunch' } });
  fake.add('HKQuantityTypeIdentifierDietaryCaffeine', { uuid: 'coffee-1', start: at(15), end: at(15), value: 95 });
  const meals = await p.read('nutrition', day);
  assert.equal(meals.length, 2, 'the correlation and one standalone nutrient sample');
  const lunch = meals.find((m) => m.id === 'meal-1')!;
  assert.deepEqual(lunch.value, { proteinGrams: 20, kilocalories: 500, name: 'Lunch' });
  assert.ok(!meals.some((m) => m.id === 'protein-1'), 'nutrients inside a meal are not reported twice');
  assert.equal((await p.readById('nutrition', 'meal-1'))?.value.name, 'Lunch');

  await p.delete({ type: 'nutrition', ids: ['meal-1'] });
  const deleted = fake.calls.filter((c) => c.fn === 'deleteObjects').map((c) => c.args[2] as string[]);
  assert.ok(deleted.every((ids) => ['meal-1', 'protein-1', 'energy-1'].every((id) => ids.includes(id))), 'the meal and its nutrient samples are deleted');
});

test('deleting a sleep session deletes every stage sample it was derived from', async () => {
  const fake = new FakeApple();
  fake.add('HKCategoryTypeIdentifierSleepAnalysis', { uuid: 's1', start: at(-2), end: at(0), category: 3 });
  fake.add('HKCategoryTypeIdentifierSleepAnalysis', { uuid: 's2', start: at(0), end: at(2), category: 4 });
  fake.add('HKCategoryTypeIdentifierSleepAnalysis', { uuid: 's3', start: at(2), end: at(5), category: 5 });
  const p = new AppleHealthProvider(fake);
  const session = await p.readById('sleep_session', 's1');
  assert.equal(session?.value.stages.length, 3, 'readById returns the whole session, not one stage');
  assert.equal((await p.readById('sleep_session', 's2'))?.id, 's1', 'any stage id resolves to its session');
  await p.delete({ type: 'sleep_session', ids: ['s1'] });
  const ids = fake.calls.find((c) => c.fn === 'deleteObjects')!.args[2] as string[];
  assert.deepEqual([...ids].sort(), ['s1', 's2', 's3']);
});

test('changes observed before JavaScript listened are delivered to the first subscription', async () => {
  const fake = new FakeApple();
  fake.pending = ['HKQuantityTypeIdentifierStepCount'];
  const p = new AppleHealthProvider(fake);
  const events: string[][] = [];
  const off = p.subscribe(['steps'], (e) => events.push(e.types));
  await new Promise((r) => setTimeout(r, 5));
  off();
  assert.deepEqual(events, [['steps']]);
});

test('reading workouts also asks for their routes', async () => {
  const fake = new FakeApple();
  const p = new AppleHealthProvider(fake);
  await p.requestPermissions({ read: ['exercise_session', 'medication_dose'].filter((t) => p.capabilities().types.includes(t as never)) as never[] });
  const read = fake.calls.find((c) => c.fn === 'requestAuthorization')!.args[0] as string[];
  assert.ok(read.includes('HKWorkoutRouteTypeIdentifier'));
  assert.ok(!read.includes('HKDataTypeIdentifierMedicationDoseEvent'), 'dose events use per-object authorization');
});

test('aggregate passes the app filter to HealthKit statistics', async () => {
  const fake = new FakeApple();
  fake.statsResponse = [{ start: at(0), end: at(24), value: 100 }];
  const p = new AppleHealthProvider(fake);
  await p.aggregate('steps', { ...day, fn: 'sum', sources: { apps: ['com.example.watch'] } });
  const opts = fake.calls.find((c) => c.fn === 'statistics')!.args[0] as { sourceBundleIds?: string[] };
  assert.deepEqual(opts.sourceBundleIds, ['com.example.watch']);
  await assert.rejects(p.aggregate('steps', { ...day, fn: 'sum', field: 'kilometers' }), code('INVALID_ARGUMENT'));
});

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HealthStore, MockProvider } from '@healthspec/core';
import { SCREEN_TYPES, loadSummary, screenPermissions } from '../src/summary.js';

const NOW = Date.parse('2026-08-21T10:00:00Z');

async function store(options: ConstructorParameters<typeof MockProvider>[0] = {}) {
  const s = new HealthStore(new MockProvider({ now: () => NOW, seed: 11, days: 8, ...options }));
  await s.requestSupportedPermissions(screenPermissions);
  return s;
}

test('the same call produces a summary on either platform', async () => {
  for (const platform of ['ios', 'android'] as const) {
    const s = await store({ platform });
    const summary = await loadSummary(s, { now: NOW, days: 7 });
    assert.ok(summary.days.length >= 7, `${platform}: expected a week of days, got ${summary.days.length}`);
    assert.ok(summary.days.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date)), `${platform}: malformed date`);
    assert.ok(summary.days.some((d) => (d.steps ?? 0) > 0), `${platform}: no step data`);
    assert.equal(typeof summary.latestHeartRateBpm, 'number', `${platform}: no heart rate`);
    assert.ok(summary.lastNight && summary.lastNight.hours > 3, `${platform}: no sleep session`);
    assert.ok(summary.lastNight.stages.length >= 3, `${platform}: sleep has no stages`);
    assert.ok(summary.workouts.length > 0, `${platform}: no workouts`);
  }
});

test('a platform missing a type reports it instead of showing an empty card', async () => {
  const s = await store({ types: SCREEN_TYPES.filter((t) => t !== 'sleep_session' && t !== 'weight') });
  const summary = await loadSummary(s, { now: NOW, days: 7 });
  assert.deepEqual(summary.unavailable.map((u) => u.type).sort(), ['sleep_session', 'weight']);
  assert.equal(summary.lastNight, null);
  assert.equal(summary.latestWeightKg, null);
  // Everything else still renders.
  assert.ok(summary.days.some((d) => (d.steps ?? 0) > 0));
});

test('units arrive canonical, so the screen never converts', async () => {
  const s = await store();
  const summary = await loadSummary(s, { now: NOW, days: 3 });
  const day = summary.days.find((d) => d.distanceKm !== null);
  assert.ok(day && day.distanceKm! > 0 && day.distanceKm! < 200, `distance should be plausible km, got ${day?.distanceKm}`);
  assert.ok(summary.latestWeightKg! > 30 && summary.latestWeightKg! < 200, 'weight should be plausible kg');
  assert.ok(summary.latestHeartRateBpm! > 30 && summary.latestHeartRateBpm! < 220, 'heart rate should be plausible bpm');
});

test('an empty store yields empty days rather than throwing', async () => {
  const s = await store({ seed: false });
  const summary = await loadSummary(s, { now: NOW, days: 7 });
  // Aggregation keeps empty buckets (SPEC §6.2) so a calendar view can draw gaps instead of collapsing them.
  assert.ok(summary.days.length >= 7);
  assert.ok(summary.days.every((d) => d.steps === null && d.distanceKm === null && d.activeKilocalories === null));
  assert.equal(summary.lastNight, null);
  assert.deepEqual(summary.workouts, []);
  assert.deepEqual(summary.unavailable, []);
});

test('days are labelled with the local calendar date, not the UTC one', async () => {
  const s = await store();
  // Midnight in Seoul is 15:00 UTC the day before; a UTC label would put every day one day early.
  const summary = await loadSummary(s, { now: NOW, days: 3, zone: 'Asia/Seoul' });
  assert.deepEqual(summary.days.map((d) => d.date), ['2026-08-18', '2026-08-19', '2026-08-20', '2026-08-21']);
});

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DAY, HealthStore, MockProvider, readAll, readChunks } from '../src/index.js';

const START = Date.parse('2026-08-01T00:00:00Z');
const END = Date.parse('2026-08-29T00:00:00Z'); // four 7-day windows
const iso = (ms: number) => new Date(ms).toISOString();

async function setup(records: Array<{ type: 'weight' | 'sleep_session'; start: number; end: number }>) {
  const mock = new MockProvider({ now: () => END, seed: false });
  const store = new HealthStore(mock);
  await store.requestPermissions({ read: ['weight', 'sleep_session'], write: ['weight', 'sleep_session'] });
  await store.write(
    records.map((r) =>
      r.type === 'weight'
        ? { type: 'weight' as const, start: iso(r.start), end: iso(r.start), value: { kilograms: 70 } }
        : { type: 'sleep_session' as const, start: iso(r.start), end: iso(r.end), value: { stages: [] } },
    ),
  );
  return store;
}

const daily = (count: number) => Array.from({ length: count }, (_, i) => ({ type: 'weight' as const, start: START + i * DAY, end: START + i * DAY }));

test('a wide range arrives a window at a time, in order, complete', async () => {
  const store = await setup(daily(28));
  const pages: number[] = [];
  const ids: string[] = [];
  for await (const page of readChunks(store, 'weight', { start: iso(START), end: iso(END) })) {
    pages.push(page.length);
    ids.push(...page.map((r) => r.start));
  }
  assert.deepEqual(pages, [7, 7, 7, 7], 'four windows of seven days');
  assert.equal(ids.length, 28);
  assert.deepEqual([...ids].sort(), ids, 'ascending across windows, not only within one');
});

test('a record straddling a window boundary is yielded once', async () => {
  // A session from day 6 to day 9 overlaps the first and second 7-day windows, and is returned whole in both.
  const store = await setup([{ type: 'sleep_session', start: START + 6 * DAY, end: START + 9 * DAY }]);
  const seen = await readAll(store, 'sleep_session', { start: iso(START), end: iso(END) });
  assert.equal(seen.length, 1);
  assert.equal(new Set(seen.map((r) => r.id)).size, 1);
});

test('a record longer than the window is still yielded once', async () => {
  const store = await setup([{ type: 'sleep_session', start: START + DAY, end: START + 20 * DAY }]);
  const seen = await readAll(store, 'sleep_session', { start: iso(START), end: iso(END) }, { window: 2 * DAY });
  assert.equal(seen.length, 1, 'it overlaps ten windows');
});

test('descending order walks the windows backwards', async () => {
  const store = await setup(daily(28));
  const starts: string[] = [];
  for await (const page of readChunks(store, 'weight', { start: iso(START), end: iso(END), order: 'desc' })) starts.push(...page.map((r) => r.start));
  assert.equal(starts.length, 28);
  assert.deepEqual(starts, [...starts].sort().reverse(), 'newest first across windows');
});

test('limit stops the walk without reading the rest of the range', async () => {
  const store = await setup(daily(28));
  let windows = 0;
  const seen: unknown[] = [];
  for await (const page of readChunks(store, 'weight', { start: iso(START), end: iso(END) }, { limit: 9 })) {
    windows++;
    seen.push(...page);
  }
  assert.equal(seen.length, 9);
  assert.equal(windows, 2, 'it stopped in the second window rather than reading all four');
});

test('an aborted read stops between windows', async () => {
  const store = await setup(daily(28));
  const signal = { aborted: false };
  const pages: number[] = [];
  for await (const page of readChunks(store, 'weight', { start: iso(START), end: iso(END) }, { signal })) {
    pages.push(page.length);
    signal.aborted = true;
  }
  assert.deepEqual(pages, [7]);
});

test("the query's own limit caps the walk rather than every window", async () => {
  const store = await setup(daily(28));
  const seen = await readAll(store, 'weight', { start: iso(START), end: iso(END), limit: 10 });
  assert.equal(seen.length, 10, 'ten in total, not ten per window');
});

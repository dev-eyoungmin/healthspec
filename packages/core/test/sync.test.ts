import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HealthStore, MockProvider, resetCursors, syncTypes, type CursorStorage, type SyncBatch } from '../src/index.js';

const NOW = Date.parse('2026-08-21T10:00:00Z');

/** AsyncStorage, in a Map. */
function storage(): CursorStorage & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return { map, getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v), removeItem: (k) => void map.delete(k) };
}

const weight = (kilograms: number, hour: number) => ({
  type: 'weight' as const,
  start: `2026-08-21T0${hour}:00:00.000Z`,
  end: `2026-08-21T0${hour}:00:00.000Z`,
  value: { kilograms },
});

async function setup(options: ConstructorParameters<typeof MockProvider>[0] = {}) {
  const mock = new MockProvider({ now: () => NOW, seed: false, ...options });
  const store = new HealthStore(mock);
  await store.requestSupportedPermissions({ read: ['weight', 'steps'], write: ['weight'] });
  return { mock, store, storage: storage() };
}

test('the first sync is a snapshot, later ones are deltas, and cursors persist per type', async () => {
  const { store, storage, mock } = await setup();
  await store.write([weight(70, 1)]);
  const batches: SyncBatch[] = [];
  const run = () => syncTypes({ store, storage, types: ['weight', 'steps'], onBatch: (b) => void batches.push(b) });

  const first = await run();
  assert.deepEqual(first.failures, []);
  assert.deepEqual(first.batches.map((b) => b.type), ['weight', 'steps']);
  assert.equal(first.batches[0]!.resynced, true, 'no cursor yet, so the whole history arrives');
  assert.equal(first.batches[0]!.upserts.length, 1);
  assert.equal(storage.map.size, 2, 'one cursor per type');

  const [second] = await store.write([weight(71, 2)]);
  await mock.delete({ type: 'weight', ids: [first.batches[0]!.upserts[0]!.id] });
  batches.length = 0;
  const delta = await run();
  assert.equal(delta.batches[0]!.resynced, false);
  assert.deepEqual(delta.batches[0]!.upserts.map((r) => r.id), [second!.id]);
  assert.deepEqual(delta.batches[0]!.deletes, [first.batches[0]!.upserts[0]!.id]);

  batches.length = 0;
  const quiet = await run();
  assert.deepEqual(quiet.batches.map((b) => [b.upserts.length, b.deletes.length]), [[0, 0], [0, 0]], 'nothing changed');
});

test('a handler that throws keeps the cursor, so the batch arrives again', async () => {
  const { store, storage } = await setup();
  await store.write([weight(70, 1)]);
  let attempts = 0;
  const failing = () =>
    syncTypes({
      store,
      storage,
      types: ['weight'],
      onBatch: () => {
        attempts++;
        if (attempts === 1) throw new Error('database is locked');
      },
    });

  const first = await failing();
  assert.equal(first.batches.length, 0);
  assert.equal((first.failures[0]?.error as Error).message, 'database is locked');
  assert.equal(storage.map.size, 0, 'no cursor is stored for a batch that was not handled');

  const second = await failing();
  assert.equal(second.batches[0]!.upserts.length, 1, 'the same batch is delivered again');
  assert.equal(storage.map.size, 1);
});

test('an expired cursor resyncs and says so', async () => {
  const { store, storage, mock } = await setup();
  await store.write([weight(70, 1)]);
  const batches: SyncBatch[] = [];
  const run = () => syncTypes({ store, storage, types: ['weight'], onBatch: (b) => void batches.push(b) });
  await run();
  mock.expireCursors();
  await store.write([weight(71, 2)]);
  batches.length = 0;
  await run();
  assert.equal(batches[0]!.resynced, true);
  assert.equal(batches[0]!.upserts.length, 2, 'a resync carries everything, not just what changed');
});

test('types the provider does not support are skipped, and cursors can be reset', async () => {
  const { store, storage } = await setup({ types: ['weight'] });
  const report = await syncTypes({ store, storage, types: ['weight', 'hrv_rmssd'], onBatch: () => {} });
  assert.deepEqual(report.skipped, ['hrv_rmssd']);
  assert.deepEqual(report.batches.map((b) => b.type), ['weight']);

  await resetCursors({ storage, types: ['weight'] });
  const again = await syncTypes({ store, storage, types: ['weight'], onBatch: () => {} });
  assert.equal(again.batches[0]!.resynced, true, 'after a reset the next sync is a snapshot');
});

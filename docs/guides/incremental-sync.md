# Keeping a copy of the data in sync

An app that shows a chart can read a range whenever it renders. An app that mirrors health data to a database
or a server needs to know what *changed* — and to survive expired cursors, interrupted batches and a user who
deletes a record two weeks later.

That is what `changes()` and cursors are for (SPEC §8.1), and `syncTypes` is the loop around them.

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthStore, syncTypes } from '@healthspec/expo';

const TYPES = ['steps', 'heart_rate', 'sleep_session'] as const;

export async function sync() {
  const store = HealthStore.default();
  const report = await syncTypes({
    store,
    storage: AsyncStorage, // anything with getItem/setItem
    types: [...TYPES],
    onBatch: async ({ type, upserts, deletes, resynced }) => {
      if (resynced) await db.deleteAllOf(type); // the cursor expired: this batch is the whole history
      await db.upsert(type, upserts);
      await db.delete(type, deletes);
    },
  });

  for (const { type, error } of report.failures) console.warn(`[sync] ${type} failed`, error);
  return report;
}
```

## What it guarantees

- **Deliveries are at least once.** A type's cursor is stored only after `onBatch` resolves. If the app is killed
  mid-batch, the same records arrive again on the next run, so `onBatch` must be idempotent — upsert by
  `record.id` and the repetition is harmless.
- **An expired cursor rebuilds the mirror.** Health Connect tokens expire after 30 days, and a HealthKit anchor
  is invalidated when the store is reset. `resynced: true` means `upserts` is everything, not a delta; delete
  what you held for that type before applying it.
- **One type's failure does not stop the others.** Failures are reported per type, with their cursors untouched.
- **Types this platform lacks are skipped**, so one declaration works on both (`report.skipped`).

## When to call it

| Moment | Why |
|---|---|
| App launch, after permissions are granted | catches everything written while the app was away |
| `AppState` returning to `active` | the platform wrote while the user was elsewhere |
| Inside `store.subscribe([...types], sync)` | the platform says something changed |
| From a background task | see below |

`subscribe` alone is not enough: HealthKit coalesces its notifications and Health Connect has no push at all.
Sync on launch and on foreground, and treat `subscribe` as an optimisation.

## In the background

**iOS.** Request `background: true` and set `background: true` in the config plugin. The module registers
background delivery and re-creates its observers while the app launches, so HealthKit can wake the app; your
`subscribe` handler then calls `sync()`.

**Android.** Health Connect has no push. Request `background: true` (that permission is
`READ_HEALTH_DATA_IN_BACKGROUND`) and schedule the work yourself, for example with
[`expo-background-task`](https://docs.expo.dev/versions/latest/sdk/background-task/):

```ts
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

const TASK = 'healthspec-sync';

TaskManager.defineTask(TASK, async () => {
  const report = await sync();
  return report.failures.length ? BackgroundTask.BackgroundTaskResult.Failed : BackgroundTask.BackgroundTaskResult.Success;
});

await BackgroundTask.registerTaskAsync(TASK, { minimumInterval: 15 }); // minutes; the system decides when
```

Both platforms decide when background work actually runs, so a mirror should never assume a schedule — the
cursor is what makes a late sync correct rather than lossy.

## Reading history the first time

Health Connect only returns the last 30 days unless the user grants `history: true`
(`READ_HEALTH_DATA_HISTORY`); HealthKit has no such limit. The first `syncTypes` run therefore returns as much
history as the user has granted, and `store.support(type)` tells you what this platform can do before you ask.

A first sync of a dense type is large — a year of heart rate is hundreds of thousands of samples, and `read`
returns them in one array. When you are importing history rather than following changes, walk the range instead:

```ts
import { readChunks } from '@healthspec/expo';

for await (const page of readChunks(store, 'heart_rate', { start: new Date('2025-01-01'), end: new Date() })) {
  await db.insertMany('heart_rate', page); // one week at a time; records on a boundary arrive once
}
```

`window` sets the slice (7 days by default), `limit` stops the walk, and a `signal` stops it between windows when
the user leaves the screen.

## Series and derived records

Two shapes need care in a mirror, both specified (SPEC §5.3, §5.4):

- **Series** (Health Connect heart rate, cadence, power, speed, skin temperature) arrive as one record per
  sample with ids like `<recordId>#3`. A deletion is reported as the record's id without a suffix: delete every
  row whose id starts with `<recordId>#`, plus the row with that exact id.
- **Derived sleep sessions** (HealthKit) are re-derived from their stage samples. Their deletions arrive as
  *sample* ids; drop the session that holds a deleted sample id and take the upserts in the same batch.

```ts
onBatch: async ({ type, upserts, deletes }) => {
  await db.upsert(type, upserts);
  for (const id of deletes) await db.deleteWhereIdOrSeriesOf(type, id); // id = '<id>' or '<id>#<n>'
}
```

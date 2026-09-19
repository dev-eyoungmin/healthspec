# Migrating from `react-native-health-connect`

`react-native-health-connect` wraps Health Connect's Jetpack client: record types, unit objects and
permission descriptors are Health Connect's. HealthSpec maps Health Connect *and* HealthKit onto one data model,
so most of the migration is replacing record types with spec type ids and unit objects with canonical numbers.

What you gain: the same code on iOS, Expo Go and tests (MockProvider), validation before anything reaches
Health Connect, device feature checks that turn "not on this device" into `NOT_SUPPORTED`, and a config plugin
that declares exactly the permissions your types need.

## 1. Install and configure

```sh
npm uninstall react-native-health-connect expo-build-properties   # keep expo-build-properties if you use it for anything else
npx expo install @healthspec/expo
```

```jsonc
// before
"plugins": [
  "react-native-health-connect",
  ["expo-build-properties", { "android": { "compileSdkVersion": 36, "targetSdkVersion": 36, "minSdkVersion": 26 } }]
]

// after
"plugins": [
  ["@healthspec/expo", { "read": ["active_energy", "steps"], "write": ["weight"], "background": true, "history": true }]
]
```

The plugin raises `minSdkVersion` to 26 itself, declares the `READ_*`/`WRITE_*` permissions for the listed types
(plus the background and history permissions when enabled), adds the rationale intent filter, the Android 14
permission-usage activity alias and the `<queries>` entry for Health Connect. In a bare React Native app, the
`HealthConnectPermissionDelegate` line in `MainActivity` is no longer needed: the Expo module registers its
activity-result contracts itself.

Then `npx expo prebuild --clean` and `npx healthspec doctor`. The Play Console health apps declaration is still
required — `doctor` prints the permissions to justify.

## 2. Record types become type ids

| react-native-health-connect | HealthSpec |
|---|---|
| `'ActiveCaloriesBurned'` | `'active_energy'` |
| `'Steps'` | `'steps'` |
| `'HeartRate'` | `'heart_rate'` |
| `'HeartRateVariabilityRmssd'` | `'hrv_rmssd'` |
| `'SleepSession'` | `'sleep_session'` |
| `'ExerciseSession'` | `'exercise_session'` |
| `'Weight'` | `'weight'` |
| `'Nutrition'` | `'nutrition'` |

Every record is listed in the [mapping table](../mapping/README.md).

## 3. Calls

```ts
// before
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

await initialize();
await requestPermission([{ accessType: 'read', recordType: 'ActiveCaloriesBurned' }]);
const { result } = await readRecords('ActiveCaloriesBurned', {
  timeRangeFilter: { operator: 'between', startTime: '2023-01-09T12:00:00.405Z', endTime: '2023-01-09T23:53:15.405Z' },
});
const kcal = result[0].energy.inKilocalories;
const id = result[0].metadata.id;
```

```ts
// after
import { HealthStore } from '@healthspec/expo';

const store = HealthStore.default(); // no initialize step
await store.requestPermissions({ read: ['active_energy'] });
const records = await store.read('active_energy', { start: '2023-01-09T12:00:00.405Z', end: '2023-01-09T23:53:15.405Z' });
const kcal = records[0].value.kilocalories;
const id = records[0].id;
```

| react-native-health-connect | HealthSpec |
|---|---|
| `getSdkStatus()` | `store.availability()` → `'available' \| 'not_installed' \| 'update_required' \| 'not_supported'` |
| `initialize()` | not needed |
| `requestPermission([{ accessType, recordType }])` | `store.requestPermissions({ read, write, background, history })` |
| `getGrantedPermissions()` | `store.getPermissions(types)` |
| `revokeAllPermissions()` | `store.revokePermissions()` |
| `openHealthConnectSettings()` | `store.openSettings()` |
| Play Store link for installing Health Connect | `store.openInstaller()` |
| `readRecords(type, { timeRangeFilter })` | `store.read(type, { start, end, limit, order, sources })` |
| `readRecord(type, id)` | `store.readById(type, id)` |
| `insertRecords(records)` | `store.write(records)` |
| `deleteRecordsByUuids`, `deleteRecordsByTimeRange` | `store.delete({ type, ids })`, `store.delete({ type, start, end })` |
| `aggregateRecord`, `aggregateGroupByDuration`, `aggregateGroupByPeriod` | `store.aggregate(type, { start, end, fn, bucket })` |
| `getChanges` | `store.changes(type, { cursor })` / `store.sync(type, cursor)` |
| `requestExerciseRoute(sessionId)` | `store.readRoute(sessionId)` |

## 4. Behaviour that changes

**Units are numbers in the field's unit.** Instead of `{ inKilocalories, inJoules, … }` objects, values are
plain numbers named for their unit: `kilocalories`, `kilograms`, `meters`, `millimolesPerLiter`. Convert for
display with `units` from `@healthspec/schema`.

**Series are flattened.** A `HeartRateRecord` with 60 samples reads back as 60 `heart_rate` records with ids
`<recordId>#0` … `#59`, each at its sample's time, and only the samples inside the query range are returned.
Deleting `<recordId>#5` removes that one sample. A change feed reports a deleted record as `<recordId>`, which
stands for all of its samples (SPEC §5.3).

**Writes are one batch.** `store.write` validates every record against the spec and inserts all types in one
atomic call; one invalid record rejects the batch before Health Connect is touched.

**Aggregation buckets are calendar-aligned.** Buckets start at midnight, Monday or the first of the month in the
query zone, and only data inside `[start, end)` is counted. Where Health Connect has no aggregate metric for a
type, or when you exclude manual entries, HealthSpec reduces the raw records itself — those results are not
de-duplicated across apps.

**Background reads need your own periodic work.** Health Connect has no push. `store.subscribe` polls while
the app runs; for background reads, request `background: true` and call `store.sync()` from a background task
such as `expo-background-task`.

**Unavailable features are unsupported types.** On a device without skin temperature, mindfulness or Personal
Health Record support, those types are absent from `store.capabilities().types` and reject with
`NOT_SUPPORTED`.

**Clinical records.** `clinical_*` types read Personal Health Record resources. Their `start` and `displayName`
come from the FHIR resource (SPEC §5.5), and `value.fhir` is the parsed resource object.

## Not covered

- Planned exercise sessions and exercise segments/laps as separate data.
- Health Connect's data-management screen.

If you depend on one of these, open an issue with your use case.

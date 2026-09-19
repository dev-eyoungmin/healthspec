# Migrating from `react-native-health`

`react-native-health` exposes HealthKit through one callback-based method per data type
(`getHeartRateSamples`, `saveWeight`, …) on the legacy bridge. HealthSpec replaces the method-per-type surface
with a handful of promise-based operations that take a type id, and runs on both platforms.

What you gain: promises instead of callbacks, the same code on Android, Expo Go and tests (MockProvider), a config
plugin instead of Xcode capability edits, and background delivery without editing `AppDelegate`.

## 1. Install and configure

```sh
npm uninstall react-native-health
npx expo install @healthspec/expo
```

Remove what you added by hand — the plugin generates all of it:

- `NSHealthShareUsageDescription`, `NSHealthUpdateUsageDescription` and
  `NSHealthClinicalHealthRecordsShareUsageDescription` in `Info.plist`
- the HealthKit capability (and Clinical Health Records) in Xcode
- `[[RCTAppleHealthKit new] initializeBackgroundObservers:bridge]` in `AppDelegate`

```jsonc
"plugins": [
  ["@healthspec/expo", {
    "read": ["heart_rate", "steps", "sleep_session"],
    "write": ["weight"],
    "background": true,
    "clinicalRecords": false,
    "healthShareUsageDescription": "Read and understand health data.",
    "healthUpdateUsageDescription": "Share workout data with other apps."
  }]
]
```

Then `npx expo prebuild --clean` and `npx healthspec doctor`.

## 2. Permissions

```ts
// before
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
} as HealthKitPermissions;

AppleHealthKit.initHealthKit(permissions, (error: string) => {
  if (error) console.log('[ERROR] Cannot grant permissions!');
});
```

```ts
// after
import { HealthStore, isHealthError } from '@healthspec/expo';

const store = HealthStore.default();
try {
  await store.requestPermissions({ read: ['heart_rate'], write: ['steps'] });
} catch (e) {
  if (isHealthError(e)) console.log(e.code, e.message);
}
```

`AppleHealthKit.Constants.Permissions.X` becomes the spec type id: `HeartRate` → `heart_rate`, `Steps` →
`steps`, `Weight` → `weight`, `SleepAnalysis` → `sleep_session`, `MindfulSession` → `mindfulness_session`. See
the [mapping table](../mapping/README.md).

## 3. Reading and writing

```ts
// before
AppleHealthKit.getHeartRateSamples({ startDate: new Date(2020, 1, 1).toISOString() }, (err, results) => {
  /* results: HealthValue[] */
});
```

```ts
// after
const samples = await store.read('heart_rate', { start: new Date(2020, 1, 1), end: new Date() });
// samples[i].value.bpm, samples[i].start, samples[i].source
```

The method-per-type surface maps onto a few operations:

| react-native-health | HealthSpec |
|---|---|
| `isAvailable` | `store.availability()` |
| `initHealthKit` | `store.requestPermissions({ read, write })` |
| `getAuthStatus` | `store.getPermissions(types)` — read statuses are `'unknown'` on iOS (see below) |
| `get<Type>Samples` (`getHeartRateSamples`, `getWeightSamples`, `getSleepSamples`, …) | `store.read(type, { start, end })` |
| `getLatest<Type>` (`getLatestWeight`, `getLatestHeight`, `getLatestBmi`, …) | `store.readLatest(type)` |
| `getStepCount`, `getDistanceWalkingRunning`, `getFlightsClimbed`, … | `store.aggregate(type, { start, end, fn: 'sum' })` |
| `getDaily<Type>Samples` (`getDailyStepCountSamples`, …) | `store.aggregate(type, { start, end, fn: 'sum', bucket: 'day' })` |
| `save<Type>` (`saveWeight`, `saveSteps`, `saveMindfulSession`, `saveWorkout`, …) | `store.write([{ type, start, end, value }])` |
| `saveFood` | `store.write([{ type: 'nutrition', … }])` |
| `delete<Type>Sample` | `store.delete({ type, ids: [id] })` |
| `getAnchoredWorkouts` | `store.changes('exercise_session', { cursor })` |
| `getWorkoutRouteSamples` | `store.readRoute(workoutId)` |
| `getBiologicalSex`, `getDateOfBirth` | `store.getProfile()` |
| `getClinicalRecords` | `store.read('clinical_lab_result', …)` and the other `clinical_*` types |
| background observers (`initializeBackgroundObservers` + event listeners) | `store.subscribe(types, handler)` with `background: true` |

## 4. Behaviour that changes

**Values are canonical numbers.** Instead of choosing a unit per call, values arrive in the unit their field
names: `kilograms`, `meters`, `bpm`, `percent` (0–100). Convert for display with `units` from
`@healthspec/schema`, or ask `store.preferredUnits(types)`.

**Read permission is `unknown`.** HealthKit never reveals whether read access was granted. HealthSpec reports
every read status on iOS as `'unknown'` instead of guessing; an empty result can mean "no data" or "not allowed".

**Errors have codes.** Callback error strings become `HealthError`s with a `code` (`NOT_SUPPORTED`,
`PERMISSION_DENIED`, `INVALID_ARGUMENT`, …). Misuse HealthKit would crash on — writing a type Apple reserves for
itself, a missing usage description — rejects instead.

**Sleep is sessions.** Stage samples are grouped into `sleep_session` records with a `stages` array.

**Totals are de-duplicated.** `store.aggregate` uses HealthKit statistics, so phone and watch steps are counted
once. Summing `store.read` results double-counts — by design (SPEC §6.3).

**Background delivery needs no AppDelegate code.** With `background: true` in the plugin, the module registers
its observers at launch; `store.subscribe` delivers the changes, including those observed while the app was not
running.

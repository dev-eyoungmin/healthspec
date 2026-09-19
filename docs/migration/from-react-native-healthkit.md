# Migrating from `@kingstinct/react-native-healthkit`

`@kingstinct/react-native-healthkit` maps HealthKit one to one: identifiers, units and sample shapes are
HealthKit's. HealthSpec maps HealthKit *and* Health Connect onto one data model, so most of the migration is
replacing identifiers with spec type ids and letting values arrive in canonical units.

What you gain: the same code on Android, Expo Go and tests (MockProvider), validation before anything reaches
HealthKit, crash-prone misuse turned into rejections, and a config plugin that derives entitlements and usage
strings from the types you declare.

What you give up: a few HealthKit-specific conveniences listed under [Not covered](#not-covered).

## 1. Install and configure

```sh
npm uninstall @kingstinct/react-native-healthkit react-native-nitro-modules
npx expo install @healthspec/expo
```

Replace the plugin entry. HealthSpec's plugin wants the types you use, so it can declare exactly the Health
Connect permissions they need on Android:

```jsonc
// before
["@kingstinct/react-native-healthkit", { "NSHealthShareUsageDescription": "…", "NSHealthUpdateUsageDescription": "…", "background": true }]

// after
["@healthspec/expo", {
  "read": ["steps", "heart_rate", "sleep_session"],
  "write": ["weight"],
  "background": true,
  "healthShareUsageDescription": "…",
  "healthUpdateUsageDescription": "…"
}]
```

Then `npx expo prebuild --clean` and `npx healthspec doctor` to check the result.

## 2. Identifiers become type ids

| kingstinct | HealthSpec |
|---|---|
| `'HKQuantityTypeIdentifierStepCount'` | `'steps'` |
| `'HKQuantityTypeIdentifierHeartRate'` | `'heart_rate'` |
| `'HKQuantityTypeIdentifierBodyFatPercentage'` | `'body_fat'` |
| `'HKQuantityTypeIdentifierInsulinDelivery'` | `'insulin_delivery'` |
| `'HKCategoryTypeIdentifierSleepAnalysis'` (stage samples) | `'sleep_session'` (sessions with stages) |
| `'HKCategoryTypeIdentifierMindfulSession'` | `'mindfulness_session'` |
| workouts | `'exercise_session'` |

Every identifier is listed in the [mapping table](../mapping/README.md); `npx healthspec mapping <type>`
prints one type with its units and caveats.

## 3. Calls

```ts
// before
import { isHealthDataAvailable, requestAuthorization, getMostRecentQuantitySample, saveQuantitySample, subscribeToChanges } from '@kingstinct/react-native-healthkit';

const available = await isHealthDataAvailable();
await requestAuthorization({ toRead: ['HKQuantityTypeIdentifierBodyFatPercentage'], toShare: ['HKQuantityTypeIdentifierInsulinDelivery'] });
const { quantity, unit } = await getMostRecentQuantitySample('HKQuantityTypeIdentifierBodyFatPercentage');
await saveQuantitySample('HKQuantityTypeIdentifierInsulinDelivery', 'IU', 5.5, new Date(), new Date(), { HKInsulinDeliveryReason: HKInsulinDeliveryReason.basal });
const unsubscribe = subscribeToChanges('HKQuantityTypeIdentifierHeartRate', () => refetch());
```

```ts
// after
import { HealthStore } from '@healthspec/expo';

const store = HealthStore.default();
const available = (await store.availability()) === 'available';
await store.requestPermissions({ read: ['body_fat'], write: ['insulin_delivery'] });
const latest = await store.readLatest('body_fat'); // latest?.value.percent — always 0–100
const now = new Date().toISOString();
await store.write([{ type: 'insulin_delivery', start: now, end: now, value: { internationalUnits: 5.5, reason: 'basal' } }]);
const unsubscribe = store.subscribe(['heart_rate'], () => refetch());
```

| kingstinct | HealthSpec |
|---|---|
| `isHealthDataAvailable()` | `store.availability()` |
| `requestAuthorization({ toRead, toShare })` | `store.requestPermissions({ read, write })` |
| `useHealthkitAuthorization` | `useHealthPermissions(request)` |
| `queryQuantitySamples`, `queryCategorySamples` | `store.read(type, { start, end, limit, order })` |
| `getMostRecentQuantitySample`, `useMostRecentQuantitySample` | `store.readLatest(type)`, `useHealthQuery(type, { …, order: 'desc', limit: 1 })` |
| `queryStatisticsForQuantity` | `store.aggregate(type, { start, end, fn })` |
| `queryStatisticsCollectionForQuantity` | `store.aggregate(type, { start, end, fn, bucket: 'day' })` |
| `queryQuantitySamplesWithAnchor` and the other `*WithAnchor` queries | `store.changes(type, { cursor })` / `store.sync(type, cursor)` |
| `saveQuantitySample`, `saveCategorySample`, `saveCorrelationSample`, `saveWorkoutSample` | `store.write([records])` |
| `deleteObjects` | `store.delete({ type, ids })` or `store.delete({ type, start, end })` |
| `subscribeToChanges` | `store.subscribe(types, handler)` |
| `workout.getWorkoutRoutes()` | `store.readRoute(sessionId)` |
| characteristics (biological sex, date of birth, …) | `store.getProfile()` |
| preferred units | `store.preferredUnits(types)` |

## 4. Behaviour that changes

**Units are fixed.** kingstinct returns the user's preferred unit unless you ask for one. HealthSpec always
returns the canonical unit named in the field (`kilograms`, `meters`, `millimolesPerLiter`); percentages are
0–100, not fractions. Convert for display with `units` from `@healthspec/schema`, or ask
`store.preferredUnits` which unit the user prefers.

**Read permission is `unknown`.** HealthKit never reveals whether read access was granted, and HealthSpec says
so instead of guessing: every read status on iOS is `'unknown'`. An empty result can mean "no data" or "not
allowed".

**Misuse rejects instead of crashing.** kingstinct warns that requesting data before authorization crashes the
app. HealthSpec validates records before they reach HealthKit and turns HealthKit's exceptions (a type Apple
reserves for itself, a missing usage description, a unit in the wrong dimension) into `HealthError`s with a
`code`.

**Sleep is sessions.** Stage samples from one source with gaps under an hour are grouped into a `sleep_session`
whose `value.stages` holds the stages. Its id is the first sample's UUID; `metadata['hk.sampleIds']` lists them
all, and deleting the session deletes every sample.

**Nutrition is one record per meal.** A food correlation and its nutrient samples read back as one `nutrition`
record whose id is the correlation's UUID.

**Aggregates are de-duplicated, reads are not.** `store.aggregate` uses HealthKit statistics, so an iPhone and
an Apple Watch counting the same steps are counted once. Summing `store.read` results double-counts — by design
(SPEC §6.3).

**Background delivery persists.** With `background: true`, subscriptions register background delivery, and
observers are re-created at launch before JavaScript runs. Unsubscribing does not disable it; call
`provider.disableBackgroundDelivery(types)` on the `AppleHealthProvider` when you want it off.

## Not covered

- CDA documents (`HKCDADocument`).
- Statistics separated by source (`separateBySource`).
- Writing workout routes.
- Live workout sessions (`HKWorkoutSession`, `HKLiveWorkoutDataSource`).

If you depend on one of these, open an issue with your use case.

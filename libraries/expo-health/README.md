# @healthspec/expo

Apple HealthKit and Android Health Connect behind one spec-conformant API, for Expo and React Native (New
Architecture).

```ts
import { HealthStore } from '@healthspec/expo';

const store = HealthStore.default(); // Apple Health on iOS, Health Connect on Android, Mock in Expo Go / tests

await store.requestSupportedPermissions({ read: ['steps', 'heart_rate', 'sleep_session'], write: ['weight'] });
const steps = await store.read('steps', { start: new Date('2026-08-01'), end: new Date() });
const daily = await store.aggregate('steps', { start, end, fn: 'sum', bucket: 'day' });
```

## Install

```sh
npx expo install @healthspec/expo
```

List the types your app uses in the config plugin. Native permissions, entitlements and usage descriptions are
derived from the spec, so nothing can be forgotten:

```json
{
  "expo": {
    "plugins": [
      ["@healthspec/expo", {
        "read": ["steps", "heart_rate", "sleep_session"],
        "write": ["weight"],
        "background": true,
        "history": true,
        "healthShareUsageDescription": "Reads your activity to show daily progress.",
        "healthUpdateUsageDescription": "Saves the weight you enter."
      }]
    ]
  }
}
```

| Option | Effect |
|---|---|
| `read`, `write` | type ids, or `"all"` · Health Connect `READ_*`/`WRITE_*` permissions |
| `background` | HealthKit background-delivery entitlement · `READ_HEALTH_DATA_IN_BACKGROUND` |
| `history` | `READ_HEALTH_DATA_HISTORY` (Health Connect limits reads to 30 days before the first grant without it) |
| `clinicalRecords` | HealthKit health-records entitlement and its usage description |
| `healthShareUsageDescription`, `healthUpdateUsageDescription`, `healthClinicalRecordsUsageDescription` | Info.plist strings — App Review expects them to say what *your* app does |

The plugin also raises Android's `minSdkVersion` to 26, adds the permission-rationale intent filter, the
Android 14 permission-usage activity alias and package visibility for Health Connect.

Then `npx expo prebuild` and check the result:

```sh
npx healthspec doctor
```

`doctor` reads the generated `ios/` and `android/` projects and reports anything App Review or Play Console would
reject, plus the checklist of what only the store consoles can check.

In Expo Go the native module is absent and `HealthStore.default()` falls back to `MockProvider` with seed data.
The mock mirrors the platform it runs on — its types and optional operations — so a screen that works in Expo Go
works on a device.

## Hooks

```ts
const { request, data: permissions } = useHealthPermissions({ read: ['steps'] });
const { data: records, loading, error, refetch } = useHealthQuery('heart_rate', { start, end }, { live: true });
const { data: buckets } = useHealthAggregate('steps', { start, end, fn: 'sum', bucket: 'day' });
const { sync, cursor } = useHealthChanges('weight', { cursor: savedCursor, live: true });
```

A hook applies only the response to its latest request, and `useHealthChanges` runs syncs one at a time.

## What differs by platform

The API is identical; these behaviours are specified (see [SPEC.md](../../spec/SPEC.md)) rather than hidden.

- **Types.** `store.capabilities().types` lists what *this device* supports — HealthKit types newer than the OS,
  and Health Connect features the device lacks (skin temperature, mindfulness, Personal Health Record), are
  absent and reject with `NOT_SUPPORTED`. `store.support(type)` names the counterpart on the other platform.
- **Read permission.** HealthKit never reveals it: every read status on iOS is `'unknown'`.
- **Units.** Always canonical (`kilograms`, `meters`, `percent` 0–100). Convert with `units` from `@healthspec/schema`.
- **Series.** Health Connect heart rate, cadence, power, speed and skin temperature records are flattened: one
  record per sample, id `<recordId>#<index>`.
- **Sleep.** HealthKit stage samples are grouped into sessions; the session id is the first sample's UUID.
- **Aggregates are de-duplicated across apps** where the platform aggregates: HealthKit statistics for quantity
  types, Health Connect aggregate metrics for steps, distance, energy, floors, wheelchair pushes, exercise and
  sleep duration, hydration, heart rate, resting heart rate, weight, height, blood pressure, elevation, speed,
  power, cadence and seven nutrients. Other types — and every query that excludes manual entries on Health
  Connect — are reduced from records and **not** de-duplicated. `count` and `duration` are always reduced from
  records.
- **Zones.** HealthKit aggregates in the device zone only; another `zone` rejects with `NOT_SUPPORTED`.
- **Background.**
  - *iOS:* with `background: true`, subscriptions register background delivery and observers are re-created
    at launch; changes observed while the app was not running reach the first `subscribe` handler. Unsubscribing
    keeps background delivery on — call `(store.provider as AppleHealthProvider).disableBackgroundDelivery(types)`
    to stop it.
  - *Android:* Health Connect has no push. `subscribe` polls while the app runs. For background reads, grant
    `background` and call `store.sync(type, cursor)` from periodic work such as `expo-background-task`.

## Platform-specific extras

`AppleHealthProvider` also offers `listMedications()` (iOS 26), `readEcgVoltages(id)` and
`disableBackgroundDelivery(types)`.

## Status

Pre-release. The Android module compiles in a real Expo app and its serialization is unit-tested against the
spec; the iOS module is type-checked against the iOS 15 and iOS 26 SDKs and its HealthKit tables are checked
against the HealthKit runtime. Behaviour on devices is still being verified — see
[NATIVE-VERIFICATION.md](../../docs/NATIVE-VERIFICATION.md).

Migrating from another library: [react-native-healthkit](../../docs/migration/from-react-native-healthkit.md) ·
[react-native-health-connect](../../docs/migration/from-react-native-health-connect.md) ·
[react-native-health](../../docs/migration/from-react-native-health.md).

MIT licensed.

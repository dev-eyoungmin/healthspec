# Native verification

What the native code has been checked against, at which level of evidence (see
[VERIFICATION.md](VERIFICATION.md#levels-of-evidence)), and what still needs a device.

The Expo module lives in [`libraries/expo-health`](../libraries/expo-health). It compiles copies of
`packages/apple/Sources/HealthSpec/HealthSpecSupport.swift` (into `ios/Shared/`) and of
`packages/google/src/main/kotlin/dev/healthspec` (into `android/src/main/java/dev/healthspec/`); `pnpm codegen`
writes the copies and `pnpm codegen:check` fails when one is stale.

## Established

### Android — compiled and unit-tested

| Check | Command | Level |
|---|---|---|
| `packages/google` compiles against `androidx.health.connect:connect-client:1.1.0` (AGP 8.11, Kotlin 2.1.20, compileSdk 36) | `cd packages/google && ./gradlew compileDebugKotlin` | compilation |
| Every Health Connect–writable type survives spec value → `Record` → spec value, using its schema's own example | `./gradlew testDebugUnitTest` | runtime (JVM) |
| Series samples are clipped to the query range, ordered with it and keep their native index; single samples can be removed | same | runtime (JVM) |
| Aggregates use each field's canonical unit (grams, milligrams, micrograms, kilograms; durations to the millisecond) | same | runtime (JVM) |
| Day and week buckets align in the query zone, including a 23-hour DST day | same | runtime (JVM) |
| The Expo module compiles inside a prebuilt Expo SDK 54 / React Native 0.81 app, with no warnings from HealthSpec code | `example: npx expo prebuild -p android && ./gradlew :app:assembleDebug` | compilation |
| Autolinking resolves the Gradle project and module class | `npx expo-modules-autolinking resolve --platform android` | compilation |
| The config plugin emits every health permission, the rationale intent filter, the permission-usage alias, package visibility and `minSdkVersion 26` | `npx healthspec doctor example` | generated files |

Compiling for the first time found and fixed: experimental APIs used without opt-in, `IntervalRecord` /
`InstantaneousRecord` being internal, eight record constructors called with arguments in the wrong order,
`Metadata` factories called with a nullable id, a mindfulness constant that does not exist, a FHIR field that does
not exist, a missing `medicalDataSourceIds` argument, and an unresolvable Gradle project dependency. The unit tests
then found that nutrient aggregates were reported 1000× (sodium 1,000,000×) too small, and that
`menstruation_flow` cannot keep its end time on Health Connect (now documented in the type).

### iOS — runtime-checked and type-checked

| Check | Command | Level |
|---|---|---|
| HealthKit resolves all 194 identifiers the spec names | `swift run healthspec-check` | runtime |
| HealthKit parses all 122 unit strings providers send, and each is compatible with its quantity type | same | runtime |
| Every `sum` aggregate targets a cumulative quantity and every `avg`/`min`/`max` a discrete one | same | runtime |
| HealthKit allows sharing every identifier the spec marks writable | same | runtime |
| The Expo module (Swift + the Objective-C exception catcher) type-checks against the iOS 15.1 and iOS 26 APIs (Mac Catalyst SDK, ExpoModulesCore signatures from `expo-modules-core` 3.0) | Swift type check | compilation (partial) |
| HealthKit accepts the half-open range predicate providers use, and validates predicates when the query is created | probe against the HealthKit runtime | runtime |
| HealthKit enum raw values in `src/hk-tables.ts` (ECG, characteristics, medications) | SDK headers | compilation |
| Autolinking resolves the pod, the Swift module, the module class and the app delegate subscriber | `npx expo-modules-autolinking resolve --platform apple` | compilation |
| The config plugin emits the HealthKit entitlements and every usage description HealthKit needs | `npx healthspec doctor example` | generated files |

The runtime check found 17 types marked writable that HealthKit reserves for Apple (requesting write access
to any of them terminates the app) and an ECG raw value that was wrong (`unrecognized` is 100). Type-checking
found a compile error in the ECG voltage query and iOS 26 APIs that would not compile with Xcode 16; both are
fixed, the latter behind `#if compiler(>=6.2)`.

### Both — TypeScript providers against the conformance suite

`libraries/expo-health/test/conformance.test.ts` runs every conformance scenario, writes included, against
`AppleHealthProvider` and `HealthConnectProvider` over fakes that enforce the native modules' contracts (spec
type ids, atomic inserts, flattened series ids, HealthKit's required metadata and reserved types). The same
suite runs on a device from the example app's **Conformance** panel.

## Not yet established

These need a real build on a device (or, for iOS, a full Xcode build — CI's `ios` job covers compilation).

### Both platforms

- [ ] The example app's Conformance panel passes, read-only and with writes, on an iPhone and on an Android device.
- [ ] Permission dialogs appear and their results arrive (Expo activity-result contracts on Android; HealthKit's sheet on iOS).

### iOS

- [ ] `pod install` and `xcodebuild` succeed for the example app with Xcode 16.4 and Xcode 26 (CI job `ios`).
- [ ] Swift sees `HealthSpecCatchException` through the pod's umbrella header.
- [ ] `HKStatisticsCollectionQuery` bucket boundaries match `startOfBucket` in the device zone across a DST change.
- [ ] Background delivery: observers created by `HealthSpecAppDelegateSubscriber` fire while the app is suspended, and `pendingChanges()` hands the change to the first subscription after launch.
- [ ] `HKSourceQuery` + `predicateForObjects(from:)` filters samples and statistics by app.
- [ ] A batch that fails in `HKWorkoutBuilder` leaves nothing behind (the samples saved before it are deleted).
- [ ] `HKElectrocardiogramQuery`, `HKHeartbeatSeriesQuery`, `HKStateOfMind`, `HKClinicalRecord` and iOS 26 medication queries return data in the shapes serialized.
- [ ] `HKHealthConceptIdentifier` archives to the same string across launches.
- [ ] `x-apple-health://` opens the Health app.
- [ ] `deleteObjects` refuses other apps' data with `errorAuthorizationDenied` → `PERMISSION_DENIED`.

### Android

- [ ] `getSdkStatus` and `features()` report correctly on Android 13 (Health Connect app) and 14+ (framework).
- [ ] The permission contract returns, and `getGrantedPermissions()` reflects new grants immediately; background and history permissions are requestable through it.
- [ ] Which exception `readRecord` throws for an unknown id (the module maps `IllegalArgumentException` and `NoSuchElementException` to "not found").
- [ ] `updateRecords` accepts a series record rewritten without some samples, keeping its id.
- [ ] Health Connect accepts series records written with a 1 ms span.
- [ ] `aggregateGroupByPeriod` result `startTime`s line up with the aligned bucket starts.
- [ ] `getChanges` token expiry surfaces as `changesTokenExpired`.
- [ ] The exercise route consent dialog returns a route, and a declined consent yields none.
- [ ] Personal Health Record reads, pagination and the `READ_MEDICAL_DATA_*` permissions.
- [ ] Play Console: the permission dialog works on a production build only after the health apps declaration is approved.

# Native verification checklist (Phase 1.5)

> **Mapping identifiers are now cross-checked** against three independently maintained libraries — see
> [VERIFICATION.md](VERIFICATION.md) (HealthKit 159/167, Health Connect 41/53). That establishes the
> *identifiers, record classes, fields and category raw values* exist. Everything below is about **behaviour**,
> which still needs a real build on a real device.

The Swift and Kotlin modules under `packages/expo/{ios,android}` were written **without a toolchain** (no Xcode, no
Android SDK on the authoring machine). Everything TypeScript is compiled and unit-tested against fake native modules;
the items below are the assumptions the native code makes that must be checked on real builds and devices.

## Both platforms

- [ ] `npx create-expo-module` scaffolding conventions for the current Expo SDK (podspec fields, `expo-module-gradle-plugin`, `expo-module.config.json` keys) match what is in the repo.
- [ ] `requireOptionalNativeModule('HealthSpec')` resolves the module and `addListener('onChange', …)` works on the module object.
- [ ] Example app (`example/`, not yet created) runs on a device and in Expo Go (Mock fallback).

## iOS — `packages/expo/ios`

- [ ] Expo Modules `Record` structs with nested `[SaveSample]?` arrays decode from JS objects.
- [ ] `AsyncFunction` closures with a trailing `promise: Promise` parameter and `promise.resolve(nil)` compile on the current ExpoModulesCore.
- [ ] `HKUnit(from:)` accepts every unit string in `spec/schema` (`"count/min"`, `"ml/(kg*min)"`, `"mmol<180.1558800000541>/L"`, `"%"`, `"degC"`). Fix the schema strings if not.
- [x] `HKWorkoutActivityType` raw values in `src/hk-workout-types.ts` match the SDK headers — verified against kingstinct's header-generated enum (2026-08-23).
- [x] `HKCategoryValueSleepAnalysis` raw values (inBed 0, asleepUnspecified 1, awake 2, asleepCore 3, asleepDeep 4, asleepREM 5) and the `HKIndoorWorkout` / `HKSwimmingLocationType` / `HKWasUserEntered` / `HKTimeZone` metadata key strings — verified against kingstinct's generated constants (2026-08-23).
- [ ] `predicateForObjects(withMetadataKey: HKMetadataKeyWasUserEntered, operatorType: .notEqualTo, value: true)` excludes manual entries without dropping samples that lack the key.
- [ ] `HKStatisticsCollectionQuery` bucket boundaries line up with `startOfBucket` from `@healthspec/core` in the device zone (DST days).
- [ ] `HKQueryAnchor` round-trips through `NSKeyedArchiver` base64 and survives app restarts.
- [ ] Background delivery requires the `com.apple.developer.healthkit.background-delivery` entitlement the plugin adds; observer queries fire while backgrounded.
- [ ] `HKWorkoutBuilder` flow saves a workout and returns its UUID; `addMetadata` accepts `HKIndoorWorkout` / `HKSwimmingLocationType` as typed values.
- [ ] Saving an `HKCorrelation` (blood pressure, food) also persists its contained quantity samples.

### iOS — special data (added 2026-08-25)

- [ ] `HKElectrocardiogram.{classification, symptomsStatus, averageHeartRate, samplingFrequency, numberOfVoltageMeasurements}` and `HKElectrocardiogramQuery` voltage enumeration with `.appleWatchSimilarToLeadI`.
- [ ] `ECG_CLASSIFICATION` / `ECG_SYMPTOMS_STATUS` raw values in `src/hk-tables.ts` (transcribed from documentation, **not** verified against a generated enum unlike the workout and State of Mind tables).
- [ ] `HKHeartbeatSeriesQuery` callback signature `(query, timeSinceSeriesStart, precededByGap, done, error)`.
- [ ] `HKStateOfMind` init parameters and `Kind`/`Label`/`Association` raw values (verified against kingstinct's generated enums, but the initialiser is not).
- [ ] `HKClinicalRecord.fhirResource.{resourceType, data, sourceURL, fhirVersion.fhirRelease}` and the clinical-records entitlement flow.
- [ ] `HKActivitySummaryQuery` + `predicate(forActivitySummariesBetweenStart:end:)` with `DateComponents` carrying `.era`, and `summary.dateComponents(for:)`.
- [ ] iOS 26 medications: `HKUserAnnotatedMedicationQueryDescriptor().result(for:)`, `HKMedicationDoseEvent.{medicationConceptIdentifier, scheduleType, logStatus, scheduledDate, scheduledDoseQuantity, doseQuantity}`, `requestPerObjectReadAuthorization`, and `HKObjectType.userAnnotatedMedicationType()`. **Highest risk item** — written entirely from a third-party spec file.
- [ ] `store.preferredUnits(for:)` returns units for every requested quantity type.
- [ ] `x-apple-health://` opens the Health app.
- [ ] `deleteObjects(of:predicate:)` refuses other apps' data with `errorAuthorizationDenied` → mapped to `PERMISSION_DENIED`.

## Android — `packages/expo/android`

- [ ] `androidx.health.connect:connect-client:1.1.0` API surface: `Metadata.manualEntry()/autoRecorded()/activelyRecorded()/unknownRecordingMethod()`, `MindfulnessSessionRecord`, `SkinTemperatureRecord`, `TemperatureDelta` all exist at that version (bump the version in `build.gradle` otherwise).
- [ ] Record constructor parameter order/names used in `Serialization.fromJson` (named arguments are used where signatures are long).
- [ ] `AggregationResult.get(metric)` with the unchecked `AggregateMetric<Any>` cast compiles and returns typed values (`Length`, `Energy`, `Mass`, `Volume`, `Pressure`, `Duration`, `Long`, `Double`).
- [ ] `aggregateGroupByPeriod` results: whether empty slices are omitted (the code fills them with `null` either way) and whether `startTime` is aligned to the request start (the code pre-aligns to the bucket boundary).
- [ ] `PermissionController.createRequestPermissionResultContract().createIntent(...)` + `startActivityForResult` + Expo `OnActivityResult` delivers the result; `getGrantedPermissions()` reflects the new grants immediately.
- [ ] `READ_HEALTH_DATA_IN_BACKGROUND` / `READ_HEALTH_DATA_HISTORY` are requestable through the same contract.
- [ ] `getChanges` token expiry surfaces as `changesTokenExpired` (mapped to `CURSOR_EXPIRED`).
- [ ] Play Console: the Health Connect data-access declaration is required before the permission dialog works on production builds — document in the README.
- [ ] `minSdkVersion 26` in the module's `build.gradle` merges cleanly with an Expo app whose minSdk is 24 (expect a manifest-merger error that the README must explain how to resolve with `expo-build-properties`).

### Android — dedicated operations (added 2026-08-25)

- [ ] `client.readRecord(recordClass, id)` returns `ReadRecordResponse<T>` with `.record`, and rejects unknown ids with an exception rather than null.
- [ ] `ExerciseSessionRecord.exerciseRouteResult` is one of `ExerciseRouteResult.Data` / `.NoData` / `.ConsentRequired`, and `ExerciseRoute.Location` exposes `time`, `latitude`, `longitude`, `altitude`, `horizontalAccuracy`, `verticalAccuracy` as `Length?`.
- [ ] `ExerciseRouteRequestContract().createIntent(activity, sessionId)` + `startActivityForResult` + `parseResult(resultCode, data)` returns `ExerciseRoute?`, and a declined consent yields null rather than throwing.
- [ ] Personal Health Record: `HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD` gate, `ReadMedicalResourcesInitialRequest(medicalResourceType = …)` / `ReadMedicalResourcesPageRequest(token)` pagination, and `MedicalResource.{id, dataSourceId, fhirResource}` with `FhirResource.{type, id, data, lastUpdated}`. The API is behind `@ExperimentalPersonalHealthRecordApi` — confirm the annotation name and that `MEDICAL_RESOURCE_TYPE_*` constants live on `MedicalResource`.
- [ ] `FhirResource.FHIR_RESOURCE_TYPE_*` constant names in `Serialization.fhirTypeNames` match the SDK (the map falls back to `"Unknown"`, so a mismatch degrades rather than crashes).
- [ ] `READ_MEDICAL_DATA_*` permission strings match `HealthSpecMedicalTypes.permissionById`, and the Play Console declaration for medical data is separate from the fitness one.
- [ ] `HealthConnectClient.ACTION_HEALTH_CONNECT_SETTINGS` still exists (newer SDKs may prefer `ACTION_MANAGE_HEALTH_PERMISSIONS`) and resolves on Android 13 and 14+.
- [ ] `permissionController.revokeAllPermissions()` is callable from a coroutine and takes effect before the next `getGrantedPermissions()`.
- [ ] Two activity results share `OnActivityResult`; confirm `payload.requestCode` is delivered so the permission and route flows do not cross.

## Spec follow-ups discovered while writing the providers

- Series deletions (`HeartRateRecord`, `SkinTemperatureRecord`) arrive as the parent record id; flattened ids are `<id>#<index>`. SPEC §8.1 should say consumers treat a delete of `<id>` as deleting every `<id>#n`.
- HealthKit sleep sessions are derived, so `changes('sleep_session')` re-derives sessions in the changed window; deletes carry sample UUIDs, not session ids. SPEC §5.4/§8.1 should document this.
- Neither platform can aggregate in a zone other than the device zone; SPEC §6.2 should make `zone` override explicitly optional-to-support (`NOT_SUPPORTED`).


## Compiled and runtime-checked (`pnpm verify:swift`)

The Apple package now builds on a plain Swift toolchain and `healthspec-check` asks HealthKit to resolve every
identifier the spec names. 858 checks pass. This closed two classes of risk that no amount of cross-referencing
could:

- [x] The generated Swift compiles — the emitter's string escaping was wrong (mapping strings contain quotes).
- [x] Availability annotations name every declared platform, not just iOS.
- [x] HealthKit resolves all 194 quantity and category identifiers — one was wrong (`environmental_audio_exposure_event`).
- [ ] `HKUnit(from:)` parsing — the check only asserts unit strings are non-empty, because an unknown unit
      raises an Objective-C exception rather than returning nil. Needs a device or an exception-catching shim.
- [ ] Behaviour of every query, save and delete path. Still requires a device.

## Expo integration (asserted by `packages/expo/test/expo-integration.test.ts`)

These were checked against the installed `expo@54` / `expo-modules-core@3` packages and are now regression-tested:

- [x] `requireOptionalNativeModule` is exported from `expo-modules-core`.
- [x] `expo-module.config.json` matches `RawExpoModuleConfig` and names classes that exist in the Swift and Kotlin sources.
- [x] Module name agrees across `store.ts`, `Name("HealthSpec")` in Swift and Kotlin.
- [x] Gradle namespace equals the Kotlin package; `build.gradle` uses the `plugins { }` block like every first-party Expo module.
- [x] `kotlinx-coroutines` is *not* redeclared — `expo-modules-core` exposes it as an `api` dependency.
- [x] Podspec only reads `package.json` fields that exist.
- [x] `package.json` `files` covers `ios`, `android`, `expo-module.config.json` and `app.plugin.js`.
- [x] `OnActivityResultPayload(requestCode, resultCode, data)`, `Promise.reject(CodedException)`, `CodedException(code, message, cause)`, `appContext.currentActivity` / `reactContext` — signatures confirmed against the installed source.
- [ ] `pod install` succeeds and the pod builds (needs Xcode).
- [ ] `expo prebuild` + Gradle sync succeeds (needs Android SDK).

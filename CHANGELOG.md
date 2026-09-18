# Changelog

Versions move independently for the specification and each platform package; see
[`healthspec-versions.json`](healthspec-versions.json).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

Everything below is pre-release. Nothing is published to npm, Maven, CocoaPods or pub.dev yet, and behaviour on
physical devices is still being verified — see [`docs/NATIVE-VERIFICATION.md`](docs/NATIVE-VERIFICATION.md).

### The native modules build

Until now neither native module had been compiled. The Android module now builds inside a real Expo SDK 54 app and
the iOS module type-checks against the iOS 15 and iOS 26 SDKs; CI builds both example apps.

- **Packaging.** `@healthspec/expo` depended on a Gradle project autolinking never includes and on a `HealthSpec`
  pod that is not published, so no app could build it. `pnpm codegen` now copies the shared Swift and Kotlin
  sources into the Expo package, and `codegen:check` keeps the copies in sync.
- **Android** compile errors fixed: experimental APIs without opt-in, internal record interfaces, eight record
  constructors with arguments in the wrong order, `Metadata` factories, a nonexistent mindfulness constant and
  FHIR field, a missing PHR request argument. `packages/google` builds standalone and is unit-tested.
- **iOS** compile errors fixed: the ECG voltage query's callback, and iOS 26 medication APIs that did not compile
  with Xcode 16 (now behind `#if compiler(>=6.2)`).
- The config plugin raises `minSdkVersion` to 26, always sets the HealthKit update description, and sets the
  clinical records description.

### Fixed

Crashes (HealthKit raises exceptions Swift cannot catch):

- 17 types were declared writable that HealthKit reserves for Apple; requesting write access to any of them
  terminated the app. `healthspec-check` now asks the HealthKit runtime which types may be shared, parses every
  unit string and checks aggregate functions against each quantity's aggregation style.
- `medication_dose` was requested through type-wide read authorization, which HealthKit forbids.
- `insulin_delivery` and `menstruation_flow` were written without metadata HealthKit requires; the insulin reason
  was also sent as a string. Mappings can now declare enum values and required metadata.
- Metadata read back from HealthKit was written again as strings. Calls that can raise now run through an
  Objective-C exception catcher and reject instead.

Wrong data:

- Health Connect nutrient aggregates were 1000× too small (sodium 1,000,000×).
- Health Connect clinical records could not be read: the provider sent a resource type where the module expected a
  type id. Dates and names are now derived from the FHIR resource.
- Series samples outside the query range were returned; `readById` of a sample returned the first sample; writes
  returned ids a read never produced; deleting one sample deleted the whole record.
- Skin temperature samples could not be written, because Health Connect requires a series record to span time; series samples are now written with a 1 ms span.
- HealthKit reads included intervals ending exactly at `start`; `limit` was applied before the app filter; bucketed
  statistics had a trailing empty bucket; aggregates ignored the app filter.
- Deleting a HealthKit sleep session deleted one stage; a meal read back under a different id than it was written with.
- Health Connect aggregation counted data before the range start and silently returned `null` for unknown fields.
- The ECG `unrecognized` classification had the wrong raw value.
- Activity summaries were anchored to UTC midnight instead of local midnight.
- The example app labelled days with their UTC date.

Spec compliance:

- Writes are atomic on both platforms and validated before the native call (SPEC §7).
- Capabilities reflect the running device: HealthKit types newer than the OS and Health Connect features the
  device lacks are unsupported, not failures.
- A Health Connect permission request that failed to launch blocked every later one, and concurrent requests failed; requests now queue.
- API 26–27 reported Health Connect as `not_installed` instead of `not_supported`.
- HealthKit background delivery: observers are re-created at launch by an app delegate subscriber, and changes
  observed before JavaScript listens are delivered to the first subscription.
- React hooks no longer apply a stale response over a newer one.

### Fit for an app to depend on

- **Half the bundle, gone.** `@healthspec/expo` added 345 kB (minified) to an app; it now adds 183 kB, and a CI
  budget keeps it there. The generated validators were a function per constraint across 182 types — the
  constraints are data now, interpreted by 120 lines. The platform, identifier and permission tables are derived
  from the mappings instead of generated a second time, provenance metadata stays out of the runtime table, and
  the raw JSON Schemas and type examples moved behind `@healthspec/schema/bundle` and `/examples`.
- **CommonJS as well as ES modules.** Metro reads the ES build, Jest and Node read the CommonJS one, so an app
  testing with `jest-expo` no longer needs a `transformIgnorePatterns` entry. The release check installs each
  packed tarball and loads it both ways.
- **`syncTypes`** — the incremental-sync loop every mirroring app writes: cursors per type in any AsyncStorage-like
  storage, stored only after a batch is handled (at least once, never lost), a resync flag when a cursor expires,
  and types the platform lacks skipped rather than failing.
- **The hooks are tested**, rendered: a slow earlier query no longer wins, no state is set after unmount, and two
  overlapping syncs do not report the same changes twice. They no longer import React Native either, so they can
  be rendered in a plain Node test.
- **Guides** for [incremental sync](docs/guides/incremental-sync.md), [testing without a device](docs/guides/testing.md)
  and [what each error means](docs/guides/errors.md).
- Peer dependency ranges an app can check (`expo >=54`, `react >=19`, `react-native >=0.81`), and release checks
  for bundle size, module formats and version agreement across packages.
- **Every package carries its licence and says where to file a bug.** npm publishes one directory, not the
  repository, so each package now packs its own `LICENSE` and declares `keywords`, `bugs` and the Node version it
  needs. The release check fails if a tarball loses any of them.

### Added

- **`@healthspec/cli`** — `healthspec doctor` checks a prebuilt Expo project for what App Review and Play Console
  reject; `healthspec mapping <type>` prints one type's platform mapping.
- **Conformance** — scenarios for atomic writes, write → read → delete round trips, change feeds, read-only types,
  unknown aggregate fields, DST buckets and HealthKit's `unknown` read status. Both Expo providers pass the suite
  in CI; the example app runs it on a device.
- **Migration guides** from `@kingstinct/react-native-healthkit`, `react-native-health-connect` and
  `react-native-health`.
- `MockProvider({ platform })` mirrors a platform's types and optional operations; Expo Go uses it.
- `TYPE_EXAMPLES`; `SCHEMA_BUNDLE` moved to `@healthspec/schema/bundle` so apps do not bundle it.
- SPEC: series ids and single-sample deletes (§5.3), derived-session deletes (§5.4), clinical record dates (§5.5),
  range-clipped buckets and zone support (§6.2), non-de-duplicated fallbacks (§6.3), atomic writes and
  platform-required fields (§7), background delivery (§8.2), device-specific capabilities (§9).
- CI: Android (unit tests and example app build), iOS (example app build with Xcode 16.4 and the latest Xcode),
  Dart, and npm tarball checks; a tag-triggered npm release workflow.

### Added

- **Specification** — 182 health types as JSON Schema with their HealthKit and Health Connect mappings, plus
  `spec/SPEC.md` for permission semantics, availability, cursors, aggregation and the provider contract.
- **Codegen** — 13 artefacts generated from the spec: TypeScript types, dependency-free validators, platform
  tables, Kotlin, Swift, Dart and the Expo plugin's permission table.
- **`@healthspec/schema`** — generated types and the platform-difference tables (cross-platform / iOS-only /
  Android-only, missing fields, counterparts with an `interchangeable` flag).
- **`@healthspec/core`** — the `Provider` contract, `HealthStore`, opaque sync cursors, zone-aware time
  buckets and `MockProvider` with deterministic seed data.
- **`@healthspec/conformance`** — scenarios that each cite the SPEC clause they enforce.
- **Platform packages** — `HealthSpec` (Swift), `dev.healthspec:healthspec` (Kotlin), `healthspec` (Dart), all
  free of any framework dependency.
- **`@healthspec/expo`** — Expo module with both providers, a config plugin that derives native permissions
  from the declared types, and React hooks.
- **Verification** — cross-check against three libraries that compile against the real SDKs, plus
  `healthspec-check`, which asks HealthKit to resolve every identifier the spec names.

### Fixed before first release

Found by the verification tooling rather than by users:

- Five quantity types were declared writable that HealthKit refuses to write.
- `environmental_audio_exposure_event` used an identifier HealthKit does not resolve. Apple renamed the Swift
  case in iOS 14 but kept the raw value `HKCategoryTypeIdentifierAudioExposureEvent`; the comparison library
  had derived its string from the case name, so only the runtime check caught it.
- The Swift, Dart and Kotlin emitters did not escape quotes in generated string literals.
- `MockProvider` disagreed with its own `capabilities()`, so an unsupported type surfaced as
  `PERMISSION_DENIED` instead of `NOT_SUPPORTED`.
- `MockProvider` reported write permission statuses for types requested only for reading.
- `HealthStore` threw synchronously on argument validation while returning a promise, so a single `.catch()`
  did not cover both failure modes.

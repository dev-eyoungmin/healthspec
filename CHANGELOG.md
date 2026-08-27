# Changelog

Versions move independently for the specification and each platform package; see
[`healthspec-versions.json`](healthspec-versions.json).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

Everything below is pre-release. Nothing is published to npm, Maven, CocoaPods or pub.dev yet, and no code
has run on a physical device — see [`docs/NATIVE-VERIFICATION.md`](docs/NATIVE-VERIFICATION.md).

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

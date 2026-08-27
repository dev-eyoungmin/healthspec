# HealthSpec

[English](README.md) · [한국어](README.ko.md)

> One schema, one permission model, one sync model for on-device health data — across Apple HealthKit, Android Health Connect, and vendor SDKs.

**Status: pre-alpha.** Phase 0 (specification + codegen) is complete; Phase 1 (reference SDK) is in progress. Nothing is published to npm yet.

## Why

Every React Native app that touches health data today installs one iOS-only library and one Android-only library, then writes its own normalisation layer on top. The two platforms disagree on types, units, permission semantics and sync models, and that knowledge lives in app code and library comments instead of a specification.

HealthSpec is a *specification first*: the JSON Schemas under [`spec/schema`](spec/schema) are the single source of truth. TypeScript types, runtime validators, the platform mapping table, native mapping tables and the documentation are all generated from them. The reference SDK for React Native / Expo (`@healthspec/expo`) implements the spec; any other library or vendor SDK can do the same and prove it with the conformance suite.

Semantics align with [IEEE 1752 / Open mHealth](https://www.openmhealth.org/) where they exist. HealthSpec adds what a mobile SDK needs that those standards leave open: platform mapping metadata, permission semantics (`unknown` is a first-class state, because iOS never reveals read grants), availability, and an incremental-sync model with opaque cursors.

## Packages

| Package | What it is | Status |
|---|---|---|
| [`spec/`](spec) | The specification — [`SPEC.md`](spec/SPEC.md) (behaviour) and JSON Schemas (data) | draft 0.1 |
| [`@healthspec/schema`](packages/schema) | Generated types, validators, mapping tables, unit helpers — no runtime deps | Phase 0 ✔ |
| [`@healthspec/core`](packages/core) | `Provider` contract, `HealthStore`, `MockProvider`, cursors, time buckets — pure TS | Phase 1 |
| [`@healthspec/expo`](packages/expo) | Expo module: Apple Health + Health Connect providers, config plugin, hooks | Phase 1 (not yet compiled) |
| [`docs/mapping`](docs/mapping/README.md) | Generated HealthKit ↔ Health Connect mapping table | generated |

## Packages

| Package | What it is | Consumers |
|---|---|---|
| [`spec/`](spec) | the specification — [`SPEC.md`](spec/SPEC.md) and JSON Schemas | everyone |
| [`@healthspec/schema`](packages/schema) | generated TypeScript types, validators, mapping tables | TypeScript |
| [`@healthspec/core`](packages/core) | `Provider` contract, `HealthStore`, `MockProvider` | TypeScript |
| [`@healthspec/conformance`](packages/conformance) | the conformance suite every provider must pass | implementers |
| [`HealthSpec`](packages/apple) | Swift package + CocoaPod — HealthKit mapping, no React Native required | Swift / iOS |
| [`dev.healthspec:healthspec`](packages/google) | Android library — Health Connect mapping, serialization, aggregation | Kotlin / Android |
| [`healthspec`](packages/dart) | Dart package — type system and mapping | Dart / Flutter |
| [`@healthspec/expo`](libraries/expo-health) | Expo module: both providers, config plugin, hooks | Expo / React Native |

The platform packages carry no framework dependency, so a plain Swift, Kotlin or Flutter project can adopt the
specification without React Native.

## Platform differences

The spec covers what each platform actually stores, so differences are declared rather than hidden:

- **Type availability** — `CROSS_PLATFORM_TYPES` / `IOS_ONLY_TYPES` / `ANDROID_ONLY_TYPES` at build time, `store.support(type)` at runtime.
- **Field availability** — a shared type can still lack a field on one platform; `support(type).missingFields` lists them.
- **Counterparts** — `hrv_sdnn` (iOS) and `hrv_rmssd` (Android) are related but *not* interchangeable, and the spec says so. A `NOT_SUPPORTED` error names the counterpart and why it differs.

See the generated [platform differences](docs/mapping/README.md#platform-differences) table.

## Develop

```sh
pnpm install
pnpm codegen        # spec → generated code + docs
pnpm verify         # codegen is fresh + build + typecheck + tests
```

Adding a health type = adding one JSON file under `spec/schema/types/` and running `pnpm codegen`. Never edit `packages/*/src/generated` by hand.

## Verification

Platform mappings are cross-checked against libraries that compile against the real SDKs — see
[VERIFICATION.md](docs/VERIFICATION.md) (HealthKit 159/167 identifiers, Health Connect 41/53 records
confirmed; the rest are APIs no comparison library implements).

```sh
HEALTHSPEC_SOURCES=/path/to/sources pnpm verify:mappings
```

Identifier existence is not behaviour: what still needs a real device build is tracked in
[NATIVE-VERIFICATION.md](docs/NATIVE-VERIFICATION.md).

## Documents

- [Specification](spec/SPEC.md) (English, normative)
- [Platform mapping](docs/mapping/README.md) (generated)
- [PRD](docs/PRD.md) (Korean)

## Acknowledgements

Built on the platform SDKs only — no third-party runtime dependencies. Three MIT-licensed libraries
(`@kingstinct/react-native-healthkit`, `react-native-health`, `react-native-health-connect`) served as
verification oracles and prior art during development; see [NOTICE.md](NOTICE.md) for what each contributed.

## License

MIT

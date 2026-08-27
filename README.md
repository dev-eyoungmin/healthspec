<div align="center">

# HealthSpec

**Standardized specification for on-device health data across every platform**

[English](README.md) · [한국어](README.ko.md)

</div>

## Overview

HealthSpec describes Apple HealthKit and Android Health Connect in one place: 182 health types, the identifier
and unit each platform uses for every one of them, and the behaviour a client must implement — permissions,
availability, incremental sync, aggregation and de-duplication.

The specification is the product. [`spec/schema`](spec/schema) is the single source of truth; types,
validators, mapping tables and the native packages are generated from it. Any library can implement the
specification and prove it with the conformance suite.

Type semantics follow [IEEE 1752 / Open mHealth](https://www.openmhealth.org/) where those standards define a
concept.

> **Pre-release.** Nothing is published yet and no code has run on a physical device.
> See [NATIVE-VERIFICATION.md](docs/NATIVE-VERIFICATION.md).

## Packages

| Package | Language | Contents |
|---|---|---|
| [`spec`](spec) | — | [`SPEC.md`](spec/SPEC.md) and 182 JSON Schemas |
| [`@healthspec/schema`](packages/schema) | TypeScript | types, validators, platform tables |
| [`@healthspec/core`](packages/core) | TypeScript | `Provider` contract, `HealthStore`, `MockProvider` |
| [`@healthspec/conformance`](packages/conformance) | TypeScript | conformance suite |
| [`HealthSpec`](packages/apple) | Swift | HealthKit mapping — SPM and CocoaPods |
| [`dev.healthspec:healthspec`](packages/google) | Kotlin | Health Connect mapping, serialization, aggregation |
| [`healthspec`](packages/dart) | Dart | type system and mapping |

The platform packages carry no framework dependency, so a plain Swift, Kotlin or Flutter project can use the
specification directly.

## Libraries

| Framework | Platforms | Package | Status |
|---|---|---|---|
| [Expo · React Native](libraries/expo-health) | iOS, Android | `@healthspec/expo` | unreleased |
| Flutter | iOS, Android | — | planned |
| Kotlin Multiplatform | iOS, Android | — | planned |
| .NET MAUI | iOS, Android | — | planned |

## Usage

```ts
import { HealthStore } from '@healthspec/expo';

const store = HealthStore.default();          // Apple Health · Health Connect · Mock in Expo Go and tests

await store.requestSupportedPermissions({ read: ['steps', 'heart_rate', 'sleep_session'], write: ['weight'] });

const daily = await store.aggregate('steps', { start, end, fn: 'sum', bucket: 'day' });
const [latest] = await store.read('heart_rate', { start, end, order: 'desc', limit: 1 });
await store.write([{ type: 'weight', start: now, end: now, value: { kilograms: 72.4 } }]);
```

Declare the types in `app.json` and the config plugin derives every native permission, entitlement and usage
string from the specification:

```json
["@healthspec/expo", { "read": ["steps", "heart_rate", "sleep_session"], "write": ["weight"], "background": true }]
```

## Health types

182 types — **38** on both platforms, **129** Apple only, **15** Android only.
See the generated [mapping table](docs/mapping/README.md).

Differences are declared rather than discovered:

```ts
store.support('hrv_sdnn').read;            // false on Android
store.support('hrv_sdnn').counterparts;    // [{ type: 'hrv_rmssd', interchangeable: false, reason: … }]
store.support('cervical_mucus').missingFields;  // ['sensation'] on iOS
```

`interchangeable: false` means the two measure different things and must never be converted into each other.

## Conformance

```ts
import { runConformanceSuite } from '@healthspec/conformance';

const report = await runConformanceSuite(myProvider);
report.conformant;   // every scenario cites the SPEC clause it enforces
```

## Documentation

| | |
|---|---|
| [Specification](spec/SPEC.md) | normative behaviour |
| [Platform mapping](docs/mapping/README.md) | generated, per type and per field |
| [Verification](docs/VERIFICATION.md) | what is established, and at which level of evidence |
| [Native verification](docs/NATIVE-VERIFICATION.md) | what still needs a device |
| [Parity](docs/PARITY.md) | comparison with existing libraries |

## Develop

```sh
pnpm install
pnpm codegen        # spec → generated code and docs
pnpm verify         # codegen freshness + build + typecheck + tests + the Swift runtime check
```

Adding a health type is one JSON file under `spec/schema/types/` plus `pnpm codegen`. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## Acknowledgements

No third-party runtime dependencies. Three MIT-licensed libraries served as verification oracles and prior
art during development — see [NOTICE.md](NOTICE.md) for what each contributed.

## License

MIT

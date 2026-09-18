# Contributing

## The rule that matters

`spec/schema` is the single source of truth. Everything under any `generated/` directory is produced from it.

Adding a health type is one JSON file plus `pnpm codegen`. Never edit generated output by hand — CI fails if
it is stale.

## Setup

```sh
pnpm install
pnpm verify        # codegen freshness + build + typecheck + tests + the Swift runtime check
```

`pnpm verify` needs a Swift toolchain for its last step. On Linux, run `pnpm test` instead.

## Native code

Native sources live in the platform packages; `pnpm codegen` copies what the Expo module compiles into
`libraries/expo-health/ios/Shared` and `libraries/expo-health/android/src/main/java/dev/healthspec`. Edit the
originals, never the copies — `pnpm codegen:check` fails when a copy is stale.

| Change | Check locally |
|---|---|
| `packages/apple` | `swift build && swift run healthspec-check` (Command Line Tools are enough) |
| `packages/google` | `cd packages/google && ./gradlew testDebugUnitTest` (JDK 17, Android SDK 36) |
| `libraries/expo-health/android` | `cd example && npx expo prebuild -p android && cd android && ./gradlew :app:assembleDebug` |
| `libraries/expo-health/ios` | `cd example && npx expo prebuild -p ios && cd ios && pod install`, then build in Xcode — or rely on CI's `ios` job |
| config plugin | `cd example && npx expo prebuild && npx healthspec doctor` |

HealthKit raises Objective-C exceptions for several kinds of misuse. Swift cannot catch them, so any HealthKit call
that can raise goes through `catchingHealthKit` in the Expo module, and `healthspec-check` verifies the spec
against the HealthKit runtime so that such calls are not made in the first place.

## Adding a health type

1. Write `spec/schema/types/<id>.json`. Copy a neighbouring type; the `x-healthspec` block carries the
   category, kind, aggregate functions and the platform mappings.
2. `pnpm codegen`
3. `pnpm verify`

If the type exists on one platform only, that is fine — say so by omitting the other mapping. Do not invent a
mapping to make a type look cross-platform.

## Changing a mapping

Mappings are claims about somebody else's SDK, so they need evidence. In increasing order of strength:

1. another library that compiles against the SDK agrees (`pnpm verify:mappings`)
2. the generated code compiles against the SDK
3. the SDK resolves the identifier (`swift run healthspec-check`)
4. a device returns the right data

Level 1 has already been wrong once — see [`docs/VERIFICATION.md`](docs/VERIFICATION.md). When levels
disagree, the higher one wins. Record what you relied on in the type's `notes`.

## Implementing a provider

Implement `Provider` from `@healthspec/core` and run the conformance suite:

```ts
import { runConformanceSuite } from '@healthspec/conformance';
const report = await runConformanceSuite(myProvider);
```

Declaring `changes: false` is a legitimate choice — the suite skips what you do not claim. Claiming something
you do not do is what it is there to catch.

## Releasing

1. `pnpm release:version <x.y.z>` — one version across the five npm packages and `healthspec-versions.json`. Add
   the release to `CHANGELOG.md`.
2. `pnpm verify && pnpm release:check` — the second one packs every tarball and checks entry points, licences,
   module formats, bundle size and that the versions agree.
3. Tag `npm-v<version>` and push the tag. The release workflow publishes to npm with provenance.
4. The Swift and Kotlin packages are released separately: `pod trunk push packages/apple/HealthSpec.podspec` after
   tagging `apple-<version>`; Maven Central publishing of `dev.healthspec:healthspec` needs signing credentials and
   is not automated yet.

## Commit messages

`type(scope): what changed`, then why in the body. Explain the reasoning, not the diff.

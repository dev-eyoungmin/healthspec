# Notice

HealthSpec is MIT licensed (see [LICENSE](LICENSE)) and has no third-party runtime dependencies beyond the
platform SDKs it wraps:

| Layer | Depends on |
|---|---|
| `@healthspec/schema` | nothing |
| `@healthspec/core` | `@healthspec/schema` |
| `@healthspec/expo` | the above, plus `expo` / `react` / `react-native` as peers |
| iOS | Apple `HealthKit`, `ExpoModulesCore` |
| Android | `androidx.health.connect:connect-client`, `ExpoModulesCore` |

No code from the projects below is bundled, vendored or shipped.

## Acknowledgements

Three MIT-licensed libraries were used during development. None is a dependency; each is credited for the role
it played.

### [@kingstinct/react-native-healthkit](https://github.com/kingstinct/react-native-healthkit) — MIT

Its `src/generated/healthkit.generated.ts` is produced from the HealthKit headers, which makes it an excellent
oracle for facts about Apple's API. It is used by [`tools/verify`](tools/verify) — a development-time tool that
reads the file from a path you supply — to confirm identifier spelling, category raw values and read-only
flags. That check found five real bugs in this repo (quantity types wrongly declared writable).

Some enumeration values in `packages/expo/src/hk-tables.ts` were transcribed from that file rather than
independently derived: `STATE_OF_MIND_LABEL`, `STATE_OF_MIND_ASSOCIATION`, `STATE_OF_MIND_KIND`,
`STATE_OF_MIND_VALENCE_CLASSIFICATION` and `MEDICATION_LOG_STATUS` / `MEDICATION_SCHEDULE_TYPE`. These are raw
values of Apple's own enumerations — facts about the platform API rather than authored expression — but the
project deserves the credit for surfacing them, particularly the iOS 26 medication values, which no other
public source we could reach documents. Those remain flagged unverified in
[`docs/VERIFICATION.md`](docs/VERIFICATION.md) until confirmed against the SDK.

`HK_WORKOUT_ACTIVITY_TYPES` was written independently and afterwards found to match theirs exactly.

### [react-native-health](https://github.com/agencyenterprise/react-native-health) — MIT

Used by `tools/verify` to confirm the clinical (`HKClinicalTypeIdentifier*`) and correlation
(`HKCorrelationTypeIdentifier*`) identifiers, which the generated source above does not cover. Its breadth of
type-specific methods also informed which HealthKit types real apps actually ask for.

### [react-native-health-connect](https://github.com/matinzd/react-native-health-connect) — MIT

Used by `tools/verify` to confirm Health Connect record classes and field names against Kotlin that compiles
against `connect-client`. Its handling of the Play Console declaration flow and permission rationale
requirements informed the config plugin.

## Standards

Type semantics follow [Open mHealth / IEEE 1752](https://www.openmhealth.org/) where those standards define a
concept. HealthSpec adds what a mobile SDK needs and they leave open: platform mapping metadata, permission
semantics, availability, and incremental sync.

## Trademarks

HealthKit, Health Connect, Apple, Android and Google are trademarks of their respective owners. HealthSpec is
not affiliated with, endorsed by, or sponsored by Apple or Google. Their names are used descriptively to
identify the APIs this project maps.

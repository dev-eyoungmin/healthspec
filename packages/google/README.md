# HealthSpec for Android

Health Connect implementation of the [HealthSpec](https://github.com/dev-eyoungmin/healthspec) specification, usable from any
Android project — a React Native bridge is not required.

```kotlin
import dev.healthspec.Serialization
import dev.healthspec.generated.HealthSpecTypes

val spec = HealthSpecTypes.require("steps")          // record class + permissions, generated from the spec
val records = client.readRecords(/* … */).records.flatMap { Serialization.toJson(it) }
```

Everything under `dev.healthspec.generated` is produced from `spec/schema` by `pnpm codegen`; do not edit it.

## Build and test

The package builds on its own, with the toolchain React Native 0.81 uses (AGP 8.11, Kotlin 2.1.20, JDK 17,
compileSdk 36):

```sh
./gradlew compileDebugKotlin
./gradlew testDebugUnitTest   # every writable type round-trips its spec example; series, units, buckets
```

`@healthspec/expo` compiles a copy of these sources (written by `pnpm codegen`), because the Expo module cannot
depend on a Gradle project autolinking does not include.

## Contents

| Object | Purpose |
|---|---|
| `HealthSpecTypes` | spec type id → Health Connect record class, permission suffix, series and primary field |
| `HealthSpecMedicalTypes` | spec type id → Personal Health Record resource type and permission |
| `HealthSpecEnums` | spec enum value ↔ Health Connect integer constants |
| `HealthSpecNutrition` | `NutritionRecord` ↔ the spec's 42 nutrient fields |
| `Serialization` | records ↔ spec-shaped maps (series flattened to `<id>#<index>`, clipped to a query window), single-sample removal, exercise routes, medical resources |
| `Aggregation` | SPEC §6 aggregation: native metrics (de-duplicated) where they exist, calendar-aligned buckets clipped to the range, a record-reading fallback otherwise |

MIT licensed. See [NOTICE.md](../../NOTICE.md).

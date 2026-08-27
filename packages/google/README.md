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

## Contents

| Object | Purpose |
|---|---|
| `HealthSpecTypes` | spec type id → Health Connect record class, permission suffix, series and primary field |
| `HealthSpecMedicalTypes` | spec type id → Personal Health Record resource type and permission |
| `HealthSpecEnums` | spec enum value ↔ Health Connect integer constants |
| `HealthSpecNutrition` | `NutritionRecord` ↔ the spec's 42 nutrient fields |
| `Serialization` | records ↔ spec-shaped maps, exercise routes, medical resources |
| `Aggregation` | SPEC §6 aggregation over native metrics, with a record-reading fallback |

MIT licensed. See [NOTICE.md](../../NOTICE.md).

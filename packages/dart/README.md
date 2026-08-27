# healthspec (Dart)

Type system and platform mapping for the [HealthSpec](https://healthspec.dev) specification, for Flutter
plugins and Dart tooling.

```dart
import 'package:healthspec/healthspec.dart';

final info = healthSpecTypes[HealthType.steps]!;
info.healthKit?.identifier;    // 'HKQuantityTypeIdentifierStepCount'
info.healthConnect?.record;    // 'StepsRecord'
info.fieldUnits;               // {'count': 'count'}
crossPlatformTypes.contains(HealthType.hrvSdnn);  // false — HealthKit only
```

This package carries no implementation. `lib/src/generated` is produced from `spec/schema` by `pnpm codegen`;
do not edit it.

MIT licensed. See [NOTICE.md](../../NOTICE.md).

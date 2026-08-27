import 'package:healthspec/healthspec.dart';
import 'package:test/test.dart';

void main() {
  test('every type has info and maps to at least one platform', () {
    expect(healthSpecTypes.length, HealthType.values.length);
    for (final type in HealthType.values) {
      final info = healthSpecTypes[type];
      expect(info, isNotNull, reason: '${type.id} has no TypeInfo');
      expect(info!.healthKit != null || info.healthConnect != null, isTrue, reason: '${type.id} maps to no platform');
    }
  });

  test('platform sets agree with the mappings', () {
    for (final type in crossPlatformTypes) {
      expect(healthSpecTypes[type]!.isCrossPlatform, isTrue);
    }
    for (final type in iosOnlyTypes) {
      expect(healthSpecTypes[type]!.healthConnect, isNull, reason: '${type.id} is not iOS-only');
    }
    for (final type in androidOnlyTypes) {
      expect(healthSpecTypes[type]!.healthKit, isNull, reason: '${type.id} is not Android-only');
    }
    expect(crossPlatformTypes.length + iosOnlyTypes.length + androidOnlyTypes.length, HealthType.values.length);
  });

  test('heart rate variability variants stay apart', () {
    expect(healthSpecTypes[HealthType.hrvSdnn]!.healthConnect, isNull);
    expect(healthSpecTypes[HealthType.hrvRmssd]!.healthKit, isNull);
  });

  test('ids round-trip', () {
    expect(HealthType.fromId('steps'), HealthType.steps);
    expect(HealthType.fromId('not_a_type'), isNull);
  });
}

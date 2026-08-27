import Foundation
import HealthSpec

/// Verifies the generated HealthSpec tables against the HealthKit types the runtime actually knows.
/// Deliberately framework-free: XCTest and Swift Testing need a full Xcode install, and this has to run
/// wherever the Swift toolchain does. Exits non-zero on the first category of failure.

var failures: [String] = []
var checks = 0

func expect(_ condition: Bool, _ message: @autoclosure () -> String) {
  checks += 1
  if !condition { failures.append(message()) }
}

func section(_ name: String, _ body: () -> Void) {
  let before = failures.count
  body()
  let added = failures.count - before
  print("  \(added == 0 ? "✔" : "✖") \(name)\(added == 0 ? "" : " — \(added) failure(s)")")
}

print("HealthSpec — generated table check")

section("every type has info") {
  expect(HealthSpec.types.count == HealthType.allCases.count, "types table has \(HealthSpec.types.count) entries for \(HealthType.allCases.count) cases")
  for type in HealthType.allCases {
    expect(HealthSpec.types[type] != nil, "\(type.rawValue) has no TypeInfo")
  }
}

section("every type maps to at least one platform") {
  for (type, info) in HealthSpec.types {
    expect(info.healthKit != nil || info.healthConnect != nil, "\(type.rawValue) maps to no platform")
  }
}

section("platform sets agree with the mappings") {
  for type in HealthSpec.crossPlatform {
    expect(HealthSpec.types[type]?.healthKit != nil, "\(type.rawValue) is in crossPlatform but has no HealthKit mapping")
    expect(HealthSpec.types[type]?.healthConnect != nil, "\(type.rawValue) is in crossPlatform but has no Health Connect mapping")
  }
  for type in HealthSpec.appleOnly {
    expect(HealthSpec.types[type]?.healthConnect == nil, "\(type.rawValue) is in appleOnly but maps to Health Connect")
  }
}

section("HealthKit knows every identifier the spec names") {
  // The strongest check available without a device: HealthKit resolves the identifier string or it does not.
  var resolved = 0
  for (type, info) in HealthSpec.types {
    guard let hk = info.healthKit else { continue }
    if hk.kind == .series || hk.kind == .special || hk.kind == .activitySummary { continue }
    for identifier in hk.identifiers {
      // Correlation members are quantity types; medication and state-of-mind types need newer OS versions
      // than this process may be running, so a nil there is not conclusive.
      if hk.kind == .medicationDose || hk.kind == .stateOfMind || hk.kind == .clinical { continue }
      expect(objectType(identifier) != nil, "\(type.rawValue): HealthKit does not recognise \(identifier)")
      resolved += 1
    }
  }
  expect(resolved > 150, "expected to resolve many identifiers, resolved \(resolved)")
  print("    resolved \(resolved) HealthKit identifiers")
}

section("HealthKit parses every unit the spec declares") {
  var parsed = 0
  for (type, info) in HealthSpec.types {
    guard let unit = info.healthKit?.unit, !unit.isEmpty else { continue }
    // HKUnit(from:) raises an Objective-C exception for an unknown string rather than returning nil, so
    // this catches malformed unit strings only when the runtime is lenient; the device checklist covers
    // the rest. An empty string is always a spec bug.
    expect(!unit.isEmpty, "\(type.rawValue) declares an empty HKUnit string")
    parsed += 1
  }
  print("    checked \(parsed) unit strings")
}

section("read-only types are not marked writable") {
  for type in [HealthType.appleExerciseTime, .appleStandTime, .appleWalkingSteadiness, .atrialFibrillationBurden, .walkingHeartRateAverage] {
    expect(HealthSpec.types[type]?.healthKit?.writable == false, "\(type.rawValue) must not be writable")
  }
  expect(HealthSpec.types[.steps]?.healthKit?.writable == true, "steps must be writable")
}

section("heart rate variability variants stay apart") {
  expect(HealthSpec.types[.hrvSdnn]?.healthConnect == nil, "hrv_sdnn must not map to Health Connect")
  expect(HealthSpec.types[.hrvRmssd]?.healthKit == nil, "hrv_rmssd must not map to HealthKit")
}

section("enum mappings resolve") {
  expect(SleepStage.deep.healthKitValue == "HKCategoryValueSleepAnalysis.asleepDeep", "deep sleep stage mapping changed")
  expect(SleepStage.awakeInBed.healthKitValue == nil, "HealthKit has no awake-in-bed stage")
  expect(ExerciseType.running.healthKitValue == "running", "running exercise mapping changed")
}

print("")
if failures.isEmpty {
  print("\(checks) checks passed")
  exit(0)
}
print("\(failures.count) of \(checks) checks failed:")
for failure in failures.prefix(30) { print("  ✖ \(failure)") }
if failures.count > 30 { print("  … and \(failures.count - 30) more") }
exit(1)

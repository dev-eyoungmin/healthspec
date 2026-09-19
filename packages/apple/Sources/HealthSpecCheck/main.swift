import Foundation
import HealthKit
import HealthSpec
import HealthSpecCheckSupport

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

/// Every (quantity identifier, HKUnit string) pair a provider sends to HealthKit, with the aggregate functions
/// that reach HKStatistics for it. Nutrition-style `multi` types use the field's canonical unit symbol as the
/// HKUnit string (see AppleHealthProvider.hkUnit), so those symbols must parse too.
func quantityUnits(_ info: TypeInfo, _ hk: HealthKitMapping) -> [(identifier: String, unit: String)] {
  switch hk.kind {
  case .quantity: return hk.identifier.flatMap { id in hk.unit.map { [(id, $0)] } } ?? []
  case .derived: return hk.identifiers.compactMap { id in hk.unit.map { (id, $0) } }
  case .correlation: return hk.identifiers.filter { !$0.hasPrefix("HKCorrelationTypeIdentifier") }.compactMap { id in hk.unit.map { (id, $0) } }
  case .multi: return hk.fields.compactMap { field, id in info.fieldUnits[field].map { (id, $0) } }
  default: return []
  }
}

section("HealthKit parses every unit the spec declares") {
  // HKUnit(from:) raises for a string it does not know. In an app that is a crash, so it is checked here.
  var parsed = 0
  for (type, info) in HealthSpec.types {
    guard let hk = info.healthKit else { continue }
    for (identifier, unit) in quantityUnits(info, hk) {
      var hkUnit: HKUnit?
      let failure = HSCatchException { hkUnit = HKUnit(from: unit) }
      expect(failure == nil, "\(type.rawValue): HealthKit rejects unit \"\(unit)\" — \(failure ?? "")")
      parsed += 1
      guard let hkUnit, let quantityType = objectType(identifier) as? HKQuantityType else { continue }
      expect(quantityType.is(compatibleWith: hkUnit), "\(type.rawValue): unit \"\(unit)\" is incompatible with \(identifier)")
    }
  }
  print("    parsed \(parsed) unit strings")
}

section("aggregate functions match each quantity's aggregation style") {
  // A cumulative-sum statistics query on a discrete type (or the reverse) raises when it runs.
  for (type, info) in HealthSpec.types {
    guard let hk = info.healthKit else { continue }
    let fns = Set(info.aggregate)
    for (identifier, _) in quantityUnits(info, hk) {
      guard let quantityType = objectType(identifier) as? HKQuantityType else { continue }
      let cumulative = quantityType.aggregationStyle == .cumulative
      if fns.contains(.sum) { expect(cumulative, "\(type.rawValue): declares sum but \(identifier) is discrete") }
      if !fns.isDisjoint(with: [.avg, .min, .max]) { expect(!cumulative, "\(type.rawValue): declares avg/min/max but \(identifier) is cumulative") }
    }
  }
}

section("HealthKit lets apps share every type the spec marks writable") {
  // Requesting share access to a type HealthKit reserves for itself raises instead of failing. The runtime
  // flags behind that decision are not public API, which is fine for a check tool and never shipped.
  func allowed(_ type: HKObjectType, _ key: String) -> Bool? {
    (type as NSObject).responds(to: NSSelectorFromString(key)) ? (type as NSObject).value(forKey: key) as? Bool : nil
  }
  var inspected = 0
  for (type, info) in HealthSpec.types {
    guard let hk = info.healthKit else { continue }
    for identifier in hk.identifiers where !identifier.hasPrefix("HKCorrelationTypeIdentifier") {
      guard let objectType = objectType(identifier) else { continue }
      if hk.writable, let share = allowed(objectType, "sharingAuthorizationAllowed") {
        expect(share, "\(type.rawValue): marked writable but HealthKit does not allow sharing \(identifier)")
        inspected += 1
      }
      // Medication dose events use per-object authorization and are never part of a type-wide read request.
      if hk.readable, hk.kind != .medicationDose, let read = allowed(objectType, "readingAuthorizationAllowed") {
        expect(read, "\(type.rawValue): marked readable but HealthKit does not allow reading \(identifier)")
      }
    }
  }
  expect(HealthSpec.types[.steps]?.healthKit?.writable == true, "steps must be writable")
  print("    inspected \(inspected) writable identifiers")
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

// COPIED from packages/apple/Sources/HealthSpec/HealthSpecSupport.swift by `pnpm codegen` — edit the original, not this file.
import Foundation
import HealthKit

// Conversions between HealthKit objects and the JSON shapes the HealthSpec providers exchange
// (see libraries/expo-health/src/native.ts). Written before a toolchain was available — see
// docs/NATIVE-VERIFICATION.md for what still needs a real build.

public enum HealthSpecError: Error {
  case invalidArgument(String)
}

public let healthSpecWorkoutIdentifier = "HKWorkoutTypeIdentifier"

private let isoWithFraction: ISO8601DateFormatter = {
  let f = ISO8601DateFormatter()
  f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
  return f
}()

private let isoPlain: ISO8601DateFormatter = {
  let f = ISO8601DateFormatter()
  f.formatOptions = [.withInternetDateTime]
  return f
}()

public func isoString(_ date: Date) -> String {
  isoWithFraction.string(from: date)
}

public func parseDate(_ s: String) throws -> Date {
  // RFC 3339 allows a lowercase "t" and "z"; ISO8601DateFormatter does not.
  let normalized = s.uppercased()
  if let d = isoWithFraction.date(from: normalized) ?? isoPlain.date(from: normalized) { return d }
  throw HealthSpecError.invalidArgument("not an ISO 8601 date: \(s)")
}

public func objectType(_ identifier: String) -> HKObjectType? {
  if identifier == healthSpecWorkoutIdentifier { return HKObjectType.workoutType() }
  if identifier == "HKWorkoutRouteTypeIdentifier" { return HKSeriesType.workoutRoute() }
  if identifier == "HKDataTypeIdentifierElectrocardiogram" { return HKObjectType.electrocardiogramType() }
  if identifier == "HKDataTypeIdentifierHeartbeatSeries" { return HKSeriesType.heartbeat() }
  if identifier == "HKActivitySummaryTypeIdentifier" { return HKObjectType.activitySummaryType() }
  if identifier == "HKDataTypeIdentifierStateOfMind" {
    if #available(iOS 18.0, macOS 15.0, watchOS 11.0, *) { return HKObjectType.stateOfMindType() }
    return nil
  }
  if identifier == "HKDataTypeIdentifierMedicationDoseEvent" {
    // Medications arrived with the iOS 26 SDK; older Xcode versions cannot even name the type.
    #if compiler(>=6.2)
    if #available(iOS 26.0, macOS 26.0, watchOS 26.0, *) { return HKSeriesType.medicationDoseEventType() }
    #endif
    return nil
  }
  if identifier.hasPrefix("HKClinicalTypeIdentifier") {
    return HKObjectType.clinicalType(forIdentifier: HKClinicalTypeIdentifier(rawValue: identifier))
  }
  if identifier.hasPrefix("HKCharacteristicTypeIdentifier") {
    return HKObjectType.characteristicType(forIdentifier: HKCharacteristicTypeIdentifier(rawValue: identifier))
  }
  if identifier.hasPrefix("HKQuantityTypeIdentifier") {
    return HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: identifier))
  }
  if identifier.hasPrefix("HKCategoryTypeIdentifier") {
    return HKObjectType.categoryType(forIdentifier: HKCategoryTypeIdentifier(rawValue: identifier))
  }
  if identifier.hasPrefix("HKCorrelationTypeIdentifier") {
    return HKObjectType.correlationType(forIdentifier: HKCorrelationTypeIdentifier(rawValue: identifier))
  }
  return nil
}

public func sampleType(_ identifier: String) throws -> HKSampleType {
  guard let type = objectType(identifier) as? HKSampleType else {
    throw HealthSpecError.invalidArgument("unknown HealthKit sample type: \(identifier)")
  }
  return type
}

public func quantityType(_ identifier: String) throws -> HKQuantityType {
  guard let type = objectType(identifier) as? HKQuantityType else {
    throw HealthSpecError.invalidArgument("not a HealthKit quantity type: \(identifier)")
  }
  return type
}

/// Error code the JS layer maps onto HealthErrorCode (see packages/expo/src/errors.ts).
public func errorCode(_ error: Error) -> String {
  let ns = error as NSError
  guard ns.domain == HKErrorDomain, let code = HKError.Code(rawValue: ns.code) else { return "E_PLATFORM" }
  switch code {
  case .errorAuthorizationNotDetermined: return "E_AUTH_NOT_DETERMINED"
  case .errorAuthorizationDenied: return "E_PERMISSION_DENIED"
  case .errorHealthDataUnavailable, .errorHealthDataRestricted: return "E_NOT_AVAILABLE"
  case .errorInvalidArgument: return "E_INVALID_ARGUMENT"
  default: return "E_PLATFORM"
  }
}

private func isBoolean(_ value: Any) -> Bool {
  CFGetTypeID(value as CFTypeRef) == CFBooleanGetTypeID()
}

/// HealthKit metadata → string map. Booleans become "true"/"false", numbers their decimal form.
public func stringifyMetadata(_ metadata: [String: Any]?) -> [String: String] {
  var out: [String: String] = [:]
  for (key, value) in metadata ?? [:] {
    if isBoolean(value) {
      out[key] = (value as? Bool ?? false) ? "true" : "false"
    } else if let n = value as? NSNumber {
      out[key] = n.stringValue
    } else if let s = value as? String {
      out[key] = s
    } else if let d = value as? Date {
      out[key] = isoString(d)
    } else {
      out[key] = String(describing: value)
    }
  }
  return out
}

/// HealthKit metadata keys whose values HealthKit validates as booleans or integers. A value of the wrong type is
/// not an error but an exception, so values are coerced here whatever form they arrive in.
private let booleanMetadataKeys: Set<String> = [
  HKMetadataKeyWasUserEntered, HKMetadataKeyIndoorWorkout, HKMetadataKeyMenstrualCycleStart,
  HKMetadataKeySexualActivityProtectionUsed, HKMetadataKeyCoachedWorkout, HKMetadataKeyWasTakenInLab,
]
private let integerMetadataKeys: Set<String> = [
  HKMetadataKeySwimmingLocationType, HKMetadataKeyInsulinDeliveryReason, HKMetadataKeyBloodGlucoseMealTime,
  HKMetadataKeyHeartRateMotionContext, HKMetadataKeyVO2MaxTestType, HKMetadataKeySyncVersion,
  HKMetadataKeyHeartRateSensorLocation, HKMetadataKeyBodyTemperatureSensorLocation, HKMetadataKeyWeatherCondition,
]

/// Metadata from JS → the typed values HealthKit expects. Strings, numbers and booleans are accepted for every key.
public func parseMetadata(_ metadata: [String: Any]?) -> [String: Any] {
  var out: [String: Any] = [:]
  for (key, value) in metadata ?? [:] {
    let text = (value as? String) ?? (value as? NSNumber)?.stringValue
    if booleanMetadataKeys.contains(key) {
      if let b = value as? Bool { out[key] = b } else if let text { out[key] = text == "true" || text == "1" }
    } else if integerMetadataKeys.contains(key) {
      if let n = (value as? NSNumber)?.intValue ?? text.flatMap({ Int($0) }) { out[key] = n }
    } else if let text {
      out[key] = value is String ? text : value
    }
  }
  return out
}

public func serialize(_ sample: HKSample, unit: HKUnit?, units: [String: HKUnit]) -> [String: Any] {
  var dict: [String: Any] = [
    "uuid": sample.uuid.uuidString,
    "identifier": sample.sampleType.identifier,
    "start": isoString(sample.startDate),
    "end": isoString(sample.endDate),
    "metadata": stringifyMetadata(sample.metadata),
    "sourceBundleId": sample.sourceRevision.source.bundleIdentifier,
    "sourceName": sample.sourceRevision.source.name,
    "wasUserEntered": (sample.metadata?[HKMetadataKeyWasUserEntered] as? Bool) ?? false,
  ]
  if let device = sample.device {
    var d: [String: Any] = [:]
    if let m = device.manufacturer { d["manufacturer"] = m }
    if let m = device.model { d["model"] = m }
    if let n = device.name { d["name"] = n }
    dict["device"] = d
  }
  if let quantity = sample as? HKQuantitySample {
    let u = unit ?? units[sample.sampleType.identifier]
    if let u, quantity.quantity.is(compatibleWith: u) {
      dict["value"] = quantity.quantity.doubleValue(for: u)
    }
  } else if let category = sample as? HKCategorySample {
    dict["category"] = category.value
  } else if let workout = sample as? HKWorkout {
    dict["workoutActivityType"] = Int(workout.workoutActivityType.rawValue)
    var totals: [String: Double] = [:]
    if let distance = workout.totalDistance { totals["distanceMeters"] = distance.doubleValue(for: .meter()) }
    if #available(iOS 16.0, macOS 13.0, watchOS 9.0, *) {
      if let energy = workout.statistics(for: HKQuantityType(.activeEnergyBurned))?.sumQuantity() { totals["energyKilocalories"] = energy.doubleValue(for: .kilocalorie()) }
    } else if let energy = workout.totalEnergyBurned {
      totals["energyKilocalories"] = energy.doubleValue(for: .kilocalorie())
    }
    dict["totals"] = totals
  } else if let correlation = sample as? HKCorrelation {
    dict["objects"] = correlation.objects.map { serialize($0, unit: nil, units: units) }
  } else if let ecg = sample as? HKElectrocardiogram {
    var e: [String: Any] = [
      "classification": ecg.classification.rawValue,
      "symptomsStatus": ecg.symptomsStatus.rawValue,
      "voltageCount": ecg.numberOfVoltageMeasurements,
    ]
    if let hr = ecg.averageHeartRate { e["averageHeartRate"] = hr.doubleValue(for: HKUnit.count().unitDivided(by: .minute())) }
    if let f = ecg.samplingFrequency { e["samplingFrequency"] = f.doubleValue(for: .hertz()) }
    dict["ecg"] = e
  } else if let series = sample as? HKHeartbeatSeriesSample {
    dict["heartbeatCount"] = series.count
  } else if let clinical = sample as? HKClinicalRecord {
    var c: [String: Any] = [
      "resourceType": clinical.fhirResource?.resourceType.rawValue ?? "Unknown",
      "displayName": clinical.displayName,
      "fhir": clinical.fhirResource.flatMap { String(data: $0.data, encoding: .utf8) } ?? "{}",
    ]
    if let url = clinical.fhirResource?.sourceURL?.absoluteString { c["sourceUrl"] = url }
    if #available(iOS 14.0, *), let version = clinical.fhirResource?.fhirVersion { c["fhirVersion"] = version.fhirRelease.rawValue }
    dict["clinical"] = c
  }
  if #available(iOS 18.0, macOS 15.0, watchOS 11.0, *), let mind = sample as? HKStateOfMind {
    dict["stateOfMind"] = [
      "kind": mind.kind.rawValue,
      "valence": mind.valence,
      "valenceClassification": mind.valenceClassification.rawValue,
      "labels": mind.labels.map { $0.rawValue },
      "associations": mind.associations.map { $0.rawValue },
    ]
  }
  #if compiler(>=6.2)
  if #available(iOS 26.0, macOS 26.0, watchOS 26.0, *), let dose = sample as? HKMedicationDoseEvent {
    var m: [String: Any] = [
      "conceptIdentifier": conceptIdentifierString(dose.medicationConceptIdentifier),
      "scheduleType": dose.scheduleType.rawValue,
      "logStatus": dose.logStatus.rawValue,
      "unit": dose.unit.unitString,
    ]
    if let d = dose.scheduledDate { m["scheduledDate"] = isoString(d) }
    if let q = dose.scheduledDoseQuantity { m["scheduledDoseQuantity"] = q }
    if let q = dose.doseQuantity { m["doseQuantity"] = q }
    dict["medication"] = m
  }
  #endif
  return dict
}

#if compiler(>=6.2)
/// HKHealthConceptIdentifier exposes only its domain; its archived form is the stable, comparable identity.
@available(iOS 26.0, macOS 26.0, watchOS 26.0, *)
public func conceptIdentifierString(_ identifier: HKHealthConceptIdentifier) -> String {
  let data = try? NSKeyedArchiver.archivedData(withRootObject: identifier, requiringSecureCoding: true)
  return "\(identifier.domain.rawValue):\(data?.base64EncodedString() ?? "")"
}
#endif

/// SPEC §5.1: samples overlapping [start, end). An interval that ends exactly at `start` does not overlap, but an
/// instantaneous sample at `start` is inside. HealthKit's own range predicate includes both, hence the OR.
public func predicateForRange(_ start: Date, _ end: Date, excludeUserEntered: Bool) -> NSPredicate {
  let range = NSCompoundPredicate(andPredicateWithSubpredicates: [
    NSPredicate(format: "%K < %@", HKPredicateKeyPathStartDate, end as NSDate),
    NSCompoundPredicate(orPredicateWithSubpredicates: [
      NSPredicate(format: "%K > %@", HKPredicateKeyPathEndDate, start as NSDate),
      NSPredicate(format: "%K >= %@", HKPredicateKeyPathStartDate, start as NSDate),
    ]),
  ])
  guard excludeUserEntered else { return range }
  let notManual = HKQuery.predicateForObjects(withMetadataKey: HKMetadataKeyWasUserEntered, operatorType: .notEqualTo, value: true)
  return NSCompoundPredicate(andPredicateWithSubpredicates: [range, notManual])
}

public func statisticsOptions(_ fn: String) -> HKStatisticsOptions {
  switch fn {
  case "sum": return .cumulativeSum
  case "avg": return .discreteAverage
  case "min": return .discreteMin
  default: return .discreteMax
  }
}

/// Why a statistics query cannot run, or nil. HealthKit raises — it does not fail — when the options disagree with
/// the type's aggregation style or the unit with its dimension, so this is checked before the query exists.
public func statisticsProblem(_ type: HKQuantityType, _ fn: String, _ unit: HKUnit) -> String? {
  if !type.is(compatibleWith: unit) { return "unit \(unit.unitString) is incompatible with \(type.identifier)" }
  let cumulative = type.aggregationStyle == .cumulative
  if fn == "sum", !cumulative { return "\(type.identifier) is a discrete quantity; use avg, min or max" }
  if fn != "sum", cumulative { return "\(type.identifier) is a cumulative quantity; use sum" }
  return nil
}

public func statisticValue(_ stats: HKStatistics, _ fn: String, _ unit: HKUnit) -> Any {
  let quantity: HKQuantity?
  switch fn {
  case "sum": quantity = stats.sumQuantity()
  case "avg": quantity = stats.averageQuantity()
  case "min": quantity = stats.minimumQuantity()
  default: quantity = stats.maximumQuantity()
  }
  guard let quantity else { return NSNull() }
  return quantity.doubleValue(for: unit)
}

public func updateFrequency(_ frequency: String) -> HKUpdateFrequency {
  switch frequency {
  case "hourly": return .hourly
  case "daily": return .daily
  default: return .immediate
  }
}


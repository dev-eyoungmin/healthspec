import ExpoModulesCore
import HealthKit
import HealthSpec

// Helpers that speak the Expo Record types declared in HealthSpecRecords.swift. Everything platform-generic
// lives in the HealthSpec package (packages/apple) so non-Expo projects can use it too.

func intervalComponents(_ interval: IntervalOptions) -> DateComponents {
  var components = DateComponents()
  switch interval.unit {
  case "hour": components.hour = interval.count
  case "week": components.weekOfYear = interval.count
  case "month": components.month = interval.count
  default: components.day = interval.count
  }
  return components
}


/// Build an HKObject for non-workout samples (workouts go through HKWorkoutBuilder).
func buildObject(_ s: SaveSample) throws -> HKSample {
  let start = try parseDate(s.start)
  let end = try parseDate(s.end)
  let metadata = parseMetadata(s.metadata)
  switch s.kind {
  case "quantity":
    guard let unit = s.unit, let value = s.value else { throw HealthSpecError.invalidArgument("quantity sample needs unit and value") }
    let type = try quantityType(s.identifier)
    return HKQuantitySample(type: type, quantity: HKQuantity(unit: HKUnit(from: unit), doubleValue: value), start: start, end: end, metadata: metadata)
  case "category":
    guard let type = objectType(s.identifier) as? HKCategoryType else { throw HealthSpecError.invalidArgument("not a category type: \(s.identifier)") }
    return HKCategorySample(type: type, value: s.category ?? 0, start: start, end: end, metadata: metadata)
  case "correlation":
    guard let type = objectType(s.identifier) as? HKCorrelationType else { throw HealthSpecError.invalidArgument("not a correlation type: \(s.identifier)") }
    let objects = try (s.objects ?? []).map { try buildObject($0) }
    return HKCorrelation(type: type, start: start, end: end, objects: Set(objects), metadata: metadata)
  case "stateOfMind":
    guard #available(iOS 18.0, *) else { throw HealthSpecError.invalidArgument("State of Mind requires iOS 18") }
    guard let fields = s.stateOfMind else { throw HealthSpecError.invalidArgument("stateOfMind fields missing") }
    return HKStateOfMind(
      date: start,
      kind: HKStateOfMind.Kind(rawValue: fields.kind) ?? .momentaryEmotion,
      valence: fields.valence,
      labels: fields.labels.compactMap { HKStateOfMind.Label(rawValue: $0) },
      associations: fields.associations.compactMap { HKStateOfMind.Association(rawValue: $0) },
      metadata: metadata
    )
  default:
    throw HealthSpecError.invalidArgument("unsupported sample kind: \(s.kind)")
  }
}

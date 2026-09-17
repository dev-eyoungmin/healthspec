import ExpoModulesCore

// Argument records for the HealthSpec module. Field names mirror libraries/expo-health/src/native.ts.

struct QueryOptions: Record {
  @Field var identifier: String = ""
  @Field var kind: String = "quantity"
  @Field var unit: String? = nil
  @Field var units: [String: String]? = nil
  @Field var start: String = ""
  @Field var end: String = ""
  @Field var limit: Int? = nil
  @Field var ascending: Bool = true
  @Field var excludeUserEntered: Bool = false
  @Field var sourceBundleIds: [String]? = nil
  @Field var uuids: [String]? = nil
}

struct IntervalOptions: Record {
  @Field var unit: String = "day"
  @Field var count: Int = 1
}

struct StatisticsOptions: Record {
  @Field var identifier: String = ""
  @Field var unit: String = ""
  @Field var start: String = ""
  @Field var end: String = ""
  @Field var fn: String = "sum"
  @Field var interval: IntervalOptions? = nil
  @Field var anchor: String? = nil
  @Field var excludeUserEntered: Bool = false
  @Field var sourceBundleIds: [String]? = nil
}

struct AnchoredOptions: Record {
  @Field var identifier: String = ""
  @Field var kind: String = "quantity"
  @Field var unit: String? = nil
  @Field var units: [String: String]? = nil
  @Field var anchor: String? = nil
  @Field var limit: Int? = nil
}

struct StateOfMindFields: Record {
  @Field var kind: Int = 1
  @Field var valence: Double = 0
  @Field var labels: [Int] = []
  @Field var associations: [Int] = []
}

struct SaveSample: Record {
  @Field var kind: String = "quantity"
  @Field var identifier: String = ""
  @Field var unit: String? = nil
  @Field var value: Double? = nil
  @Field var category: Int? = nil
  @Field var start: String = ""
  @Field var end: String = ""
  /// Strings, numbers and booleans; typed for HealthKit by parseMetadata.
  @Field var metadata: [String: Any]? = nil
  @Field var objects: [SaveSample]? = nil
  @Field var workoutActivityType: Int? = nil
  @Field var stateOfMind: StateOfMindFields? = nil
}

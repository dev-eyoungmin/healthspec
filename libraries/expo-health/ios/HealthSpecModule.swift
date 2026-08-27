import ExpoModulesCore
import HealthKit
import HealthSpec
import UIKit

/**
 * Thin bridge over HealthKit primitives. Type mapping, unit scaling and session derivation live in TypeScript
 * (packages/expo/src/AppleHealthProvider.ts); this module only moves samples across the boundary.
 *
 * Written before a toolchain was available — compile and device-test in Phase 1.5.
 */
public class HealthSpecModule: Module {
  private let store = HKHealthStore()
  private var observers: [String: HKObserverQuery] = [:]

  public func definition() -> ModuleDefinition {
    Name("HealthSpec")

    Events("onChange")

    Function("isHealthDataAvailable") { () -> Bool in
      HKHealthStore.isHealthDataAvailable()
    }

    Function("bundleIdentifier") { () -> String in
      Bundle.main.bundleIdentifier ?? ""
    }

    AsyncFunction("requestAuthorization") { (read: [String], write: [String], promise: Promise) in
      guard HKHealthStore.isHealthDataAvailable() else {
        promise.reject("E_NOT_AVAILABLE", "HealthKit is not available on this device")
        return
      }
      let readTypes = Set(read.compactMap { objectType($0) })
      let shareTypes = Set(write.compactMap { objectType($0) as? HKSampleType })
      self.store.requestAuthorization(toShare: shareTypes, read: readTypes) { _, error in
        if let error {
          promise.reject(errorCode(error), error.localizedDescription)
        } else {
          promise.resolve(nil)
        }
      }
    }

    AsyncFunction("authorizationStatus") { (identifiers: [String]) -> [String: String] in
      var out: [String: String] = [:]
      for identifier in identifiers {
        guard let type = objectType(identifier) else { continue }
        switch self.store.authorizationStatus(for: type) {
        case .sharingAuthorized: out[identifier] = "sharingAuthorized"
        case .sharingDenied: out[identifier] = "sharingDenied"
        default: out[identifier] = "notDetermined"
        }
      }
      return out
    }

    AsyncFunction("querySamples") { (options: QueryOptions, promise: Promise) in
      do {
        let type = try sampleType(options.identifier)
        let start = try parseDate(options.start)
        let end = try parseDate(options.end)
        let unit = options.unit.map { HKUnit(from: $0) }
        let units = (options.units ?? [:]).mapValues { HKUnit(from: $0) }
        let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: options.ascending)
        var predicate = predicateForRange(start, end, excludeUserEntered: options.excludeUserEntered)
        if let uuids = options.uuids, !uuids.isEmpty {
          let byId = HKQuery.predicateForObjects(with: Set(uuids.compactMap { UUID(uuidString: $0) }))
          predicate = NSCompoundPredicate(andPredicateWithSubpredicates: [predicate, byId])
        }
        let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: options.limit ?? HKObjectQueryNoLimit, sortDescriptors: [sort]) { _, samples, error in
          if let error {
            promise.reject(errorCode(error), error.localizedDescription)
            return
          }
          var result = samples ?? []
          if let bundleIds = options.sourceBundleIds {
            let allowed = Set(bundleIds)
            result = result.filter { allowed.contains($0.sourceRevision.source.bundleIdentifier) }
          }
          promise.resolve(result.map { serialize($0, unit: unit, units: units) })
        }
        self.store.execute(query)
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
      }
    }

    AsyncFunction("statistics") { (options: StatisticsOptions, promise: Promise) in
      do {
        let type = try quantityType(options.identifier)
        let start = try parseDate(options.start)
        let end = try parseDate(options.end)
        let unit = HKUnit(from: options.unit)
        let statsOptions = statisticsOptions(options.fn)
        let predicate = predicateForRange(start, end, excludeUserEntered: options.excludeUserEntered)
        if let interval = options.interval {
          let anchor = try options.anchor.map { try parseDate($0) } ?? start
          let query = HKStatisticsCollectionQuery(quantityType: type, quantitySamplePredicate: predicate, options: statsOptions, anchorDate: anchor, intervalComponents: intervalComponents(interval))
          query.initialResultsHandler = { _, collection, error in
            if let error {
              promise.reject(errorCode(error), error.localizedDescription)
              return
            }
            var out: [[String: Any]] = []
            collection?.enumerateStatistics(from: min(anchor, start), to: end) { stats, _ in
              out.append(["start": isoString(stats.startDate), "end": isoString(stats.endDate), "value": statisticValue(stats, options.fn, unit)])
            }
            promise.resolve(out)
          }
          self.store.execute(query)
        } else {
          let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: statsOptions) { _, stats, error in
            if let error, (error as NSError).code != HKError.errorNoData.rawValue {
              promise.reject(errorCode(error), error.localizedDescription)
              return
            }
            let value: Any = stats.map { statisticValue($0, options.fn, unit) } ?? NSNull()
            promise.resolve([["start": isoString(start), "end": isoString(end), "value": value]])
          }
          self.store.execute(query)
        }
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
      }
    }

    AsyncFunction("anchoredQuery") { (options: AnchoredOptions, promise: Promise) in
      do {
        let type = try sampleType(options.identifier)
        let unit = options.unit.map { HKUnit(from: $0) }
        let units = (options.units ?? [:]).mapValues { HKUnit(from: $0) }
        var anchor: HKQueryAnchor? = nil
        if let encoded = options.anchor, !encoded.isEmpty {
          guard let data = Data(base64Encoded: encoded),
                let decoded = try? NSKeyedUnarchiver.unarchivedObject(ofClass: HKQueryAnchor.self, from: data) else {
            promise.reject("E_CURSOR_EXPIRED", "HealthKit anchor could not be decoded")
            return
          }
          anchor = decoded
        }
        let query = HKAnchoredObjectQuery(type: type, predicate: nil, anchor: anchor, limit: options.limit ?? HKObjectQueryNoLimit) { _, samples, deleted, newAnchor, error in
          if let error {
            promise.reject(errorCode(error), error.localizedDescription)
            return
          }
          var encodedAnchor = ""
          if let newAnchor, let data = try? NSKeyedArchiver.archivedData(withRootObject: newAnchor, requiringSecureCoding: true) {
            encodedAnchor = data.base64EncodedString()
          }
          promise.resolve([
            "samples": (samples ?? []).map { serialize($0, unit: unit, units: units) },
            "deleted": (deleted ?? []).map { $0.uuid.uuidString },
            "anchor": encodedAnchor,
          ])
        }
        self.store.execute(query)
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
      }
    }

    AsyncFunction("save") { (samples: [SaveSample], promise: Promise) in
      // Saved one at a time so the returned UUIDs line up with the input order.
      var uuids: [String] = []
      func saveNext(_ index: Int) {
        guard index < samples.count else {
          promise.resolve(uuids)
          return
        }
        let sample = samples[index]
        if sample.kind == "workout" {
          self.saveWorkout(sample) { result in
            switch result {
            case .success(let uuid):
              uuids.append(uuid)
              saveNext(index + 1)
            case .failure(let error):
              promise.reject(errorCode(error), error.localizedDescription)
            }
          }
          return
        }
        do {
          let object = try buildObject(sample)
          self.store.save(object) { _, error in
            if let error {
              promise.reject(errorCode(error), error.localizedDescription)
              return
            }
            uuids.append(object.uuid.uuidString)
            saveNext(index + 1)
          }
        } catch {
          promise.reject("E_INVALID_ARGUMENT", "\(error)")
        }
      }
      saveNext(0)
    }

    AsyncFunction("deleteObjects") { (identifier: String, kind: String, uuids: [String], promise: Promise) in
      do {
        let type = try sampleType(identifier)
        let predicate = HKQuery.predicateForObjects(with: Set(uuids.compactMap { UUID(uuidString: $0) }))
        self.store.deleteObjects(of: type, predicate: predicate) { _, count, error in
          if let error {
            promise.reject(errorCode(error), error.localizedDescription)
          } else {
            promise.resolve(count)
          }
        }
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
      }
    }

    AsyncFunction("deleteByRange") { (identifier: String, kind: String, start: String, end: String, promise: Promise) in
      do {
        let type = try sampleType(identifier)
        let predicate = HKQuery.predicateForSamples(withStart: try parseDate(start), end: try parseDate(end), options: [])
        self.store.deleteObjects(of: type, predicate: predicate) { _, count, error in
          if let error {
            promise.reject(errorCode(error), error.localizedDescription)
          } else {
            promise.resolve(count)
          }
        }
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
      }
    }

    AsyncFunction("enableBackgroundDelivery") { (identifier: String, kind: String, frequency: String, promise: Promise) in
      guard let type = objectType(identifier) else {
        promise.reject("E_INVALID_ARGUMENT", "unknown type \(identifier)")
        return
      }
      self.store.enableBackgroundDelivery(for: type, frequency: updateFrequency(frequency)) { ok, error in
        if let error {
          promise.reject(errorCode(error), error.localizedDescription)
        } else {
          promise.resolve(ok)
        }
      }
    }

    AsyncFunction("disableBackgroundDelivery") { (identifier: String, kind: String, promise: Promise) in
      guard let type = objectType(identifier) else {
        promise.reject("E_INVALID_ARGUMENT", "unknown type \(identifier)")
        return
      }
      self.store.disableBackgroundDelivery(for: type) { ok, error in
        if let error {
          promise.reject(errorCode(error), error.localizedDescription)
        } else {
          promise.resolve(ok)
        }
      }
    }

    AsyncFunction("startObserving") { (identifier: String, kind: String, promise: Promise) in
      do {
        let type = try sampleType(identifier)
        let observerId = UUID().uuidString
        let query = HKObserverQuery(sampleType: type, predicate: nil) { [weak self] _, completion, error in
          if error == nil {
            self?.sendEvent("onChange", ["identifier": identifier])
          }
          completion()
        }
        self.observers[observerId] = query
        self.store.execute(query)
        promise.resolve(observerId)
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
      }
    }

    AsyncFunction("stopObserving") { (observerId: String) in
      if let query = self.observers.removeValue(forKey: observerId) {
        self.store.stop(query)
      }
    }

    // ---------------------------------------------------------------- non-sample data

    AsyncFunction("characteristics") { () -> [String: Any] in
      var out: [String: Any] = ["biologicalSex": 0, "bloodType": 0, "fitzpatrickSkinType": 0, "wheelchairUse": 0, "activityMoveMode": 0]
      if let sex = try? self.store.biologicalSex() { out["biologicalSex"] = sex.biologicalSex.rawValue }
      if let blood = try? self.store.bloodType() { out["bloodType"] = blood.bloodType.rawValue }
      if let skin = try? self.store.fitzpatrickSkinType() { out["fitzpatrickSkinType"] = skin.skinType.rawValue }
      if let wheelchair = try? self.store.wheelchairUse() { out["wheelchairUse"] = wheelchair.wheelchairUse.rawValue }
      if #available(iOS 14.0, *), let mode = try? self.store.activityMoveMode() { out["activityMoveMode"] = mode.activityMoveMode.rawValue }
      if let dob = try? self.store.dateOfBirthComponents(), let y = dob.year, let m = dob.month, let d = dob.day {
        out["dateOfBirth"] = String(format: "%04d-%02d-%02d", y, m, d)
      }
      return out
    }

    AsyncFunction("preferredUnits") { (identifiers: [String], promise: Promise) in
      let types = Set(identifiers.compactMap { objectType($0) as? HKQuantityType })
      self.store.preferredUnits(for: types) { units, error in
        if let error {
          promise.reject(errorCode(error), error.localizedDescription)
          return
        }
        var out: [String: String] = [:]
        for (type, unit) in units { out[type.identifier] = unit.unitString }
        promise.resolve(out)
      }
    }

    AsyncFunction("workoutRoute") { (workoutUuid: String, promise: Promise) in
      guard let uuid = UUID(uuidString: workoutUuid) else {
        promise.reject("E_INVALID_ARGUMENT", "not a UUID: \(workoutUuid)")
        return
      }
      let workoutQuery = HKSampleQuery(sampleType: .workoutType(), predicate: HKQuery.predicateForObject(with: uuid), limit: 1, sortDescriptors: nil) { _, samples, error in
        if let error {
          promise.reject(errorCode(error), error.localizedDescription)
          return
        }
        guard let workout = samples?.first as? HKWorkout else {
          promise.resolve(nil)
          return
        }
        let routeQuery = HKSampleQuery(sampleType: HKSeriesType.workoutRoute(), predicate: HKQuery.predicateForObjects(from: workout), limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, routes, error in
          if let error {
            promise.reject(errorCode(error), error.localizedDescription)
            return
          }
          guard let route = routes?.first as? HKWorkoutRoute else {
            promise.resolve(nil)
            return
          }
          var points: [[String: Any]] = []
          var settled = false
          let locationQuery = HKWorkoutRouteQuery(route: route) { _, locations, done, error in
            if settled { return }
            if let error {
              settled = true
              promise.reject(errorCode(error), error.localizedDescription)
              return
            }
            for location in locations ?? [] {
              var point: [String: Any] = [
                "time": isoString(location.timestamp),
                "latitude": location.coordinate.latitude,
                "longitude": location.coordinate.longitude,
              ]
              if location.verticalAccuracy >= 0 {
                point["altitudeMeters"] = location.altitude
                point["verticalAccuracyMeters"] = location.verticalAccuracy
              }
              if location.horizontalAccuracy >= 0 { point["horizontalAccuracyMeters"] = location.horizontalAccuracy }
              points.append(point)
            }
            if done {
              settled = true
              promise.resolve(points)
            }
          }
          self.store.execute(locationQuery)
        }
        self.store.execute(routeQuery)
      }
      self.store.execute(workoutQuery)
    }

    AsyncFunction("heartbeatSeries") { (uuid: String, promise: Promise) in
      guard let id = UUID(uuidString: uuid) else {
        promise.reject("E_INVALID_ARGUMENT", "not a UUID: \(uuid)")
        return
      }
      let query = HKSampleQuery(sampleType: HKSeriesType.heartbeat(), predicate: HKQuery.predicateForObject(with: id), limit: 1, sortDescriptors: nil) { _, samples, error in
        if let error {
          promise.reject(errorCode(error), error.localizedDescription)
          return
        }
        guard let series = samples?.first as? HKHeartbeatSeriesSample else {
          promise.resolve([])
          return
        }
        var beats: [[String: Any]] = []
        var settled = false
        let seriesQuery = HKHeartbeatSeriesQuery(heartbeatSeries: series) { _, offset, precededByGap, done, error in
          if settled { return }
          if let error {
            settled = true
            promise.reject(errorCode(error), error.localizedDescription)
            return
          }
          beats.append(["offsetSeconds": offset, "precededByGap": precededByGap])
          if done {
            settled = true
            promise.resolve(beats)
          }
        }
        self.store.execute(seriesQuery)
      }
      self.store.execute(query)
    }

    AsyncFunction("ecgVoltages") { (uuid: String, promise: Promise) in
      guard let id = UUID(uuidString: uuid) else {
        promise.reject("E_INVALID_ARGUMENT", "not a UUID: \(uuid)")
        return
      }
      let query = HKSampleQuery(sampleType: .electrocardiogramType(), predicate: HKQuery.predicateForObject(with: id), limit: 1, sortDescriptors: nil) { _, samples, error in
        if let error {
          promise.reject(errorCode(error), error.localizedDescription)
          return
        }
        guard let ecg = samples?.first as? HKElectrocardiogram else {
          promise.resolve([])
          return
        }
        var out: [[String: Any]] = []
        var settled = false
        let voltageQuery = HKElectrocardiogramQuery(ecg) { _, measurement, done, error in
          if settled { return }
          if let error {
            settled = true
            promise.reject(errorCode(error), error.localizedDescription)
            return
          }
          if let measurement, let quantity = measurement.quantity(for: .appleWatchSimilarToLeadI) {
            out.append(["offsetSeconds": measurement.timeSinceSampleStart, "microvolts": quantity.doubleValue(for: HKUnit.voltUnit(with: .micro))])
          }
          if done {
            settled = true
            promise.resolve(out)
          }
        }
        self.store.execute(voltageQuery)
      }
      self.store.execute(query)
    }

    AsyncFunction("activitySummaries") { (start: String, end: String, promise: Promise) in
      do {
        let calendar = Calendar.current
        var from = calendar.dateComponents([.year, .month, .day, .era], from: try parseDate(start))
        var to = calendar.dateComponents([.year, .month, .day, .era], from: try parseDate(end))
        from.calendar = calendar
        to.calendar = calendar
        let predicate = HKQuery.predicate(forActivitySummariesBetweenStart: from, end: to)
        let query = HKActivitySummaryQuery(predicate: predicate) { _, summaries, error in
          if let error {
            promise.reject(errorCode(error), error.localizedDescription)
            return
          }
          let formatter = DateFormatter()
          formatter.dateFormat = "yyyy-MM-dd"
          formatter.calendar = calendar
          let out: [[String: Any]] = (summaries ?? []).compactMap { summary in
            let components = summary.dateComponents(for: calendar)
            guard let date = calendar.date(from: components) else { return nil }
            var dict: [String: Any] = [
              "date": formatter.string(from: date),
              "activeEnergyKilocalories": summary.activeEnergyBurned.doubleValue(for: .kilocalorie()),
              "activeEnergyGoalKilocalories": summary.activeEnergyBurnedGoal.doubleValue(for: .kilocalorie()),
              "exerciseMinutes": summary.appleExerciseTime.doubleValue(for: .minute()),
              "exerciseGoalMinutes": summary.appleExerciseTimeGoal.doubleValue(for: .minute()),
              "standHours": summary.appleStandHours.doubleValue(for: .count()),
              "standGoalHours": summary.appleStandHoursGoal.doubleValue(for: .count()),
            ]
            if #available(iOS 14.0, *) {
              dict["moveMinutes"] = summary.appleMoveTime.doubleValue(for: .minute())
              dict["moveGoalMinutes"] = summary.appleMoveTimeGoal.doubleValue(for: .minute())
              dict["activityMoveMode"] = summary.activityMoveMode.rawValue
            }
            return dict
          }
          promise.resolve(out)
        }
        self.store.execute(query)
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
      }
    }

    AsyncFunction("requestMedicationsAuthorization") { (promise: Promise) in
      if #available(iOS 26.0, *) {
        // Medications use per-object read authorization (WWDC25). Unverified until built against the iOS 26 SDK.
        self.store.requestPerObjectReadAuthorization(for: HKObjectType.userAnnotatedMedicationType(), predicate: nil) { _, error in
          if let error {
            promise.reject(errorCode(error), error.localizedDescription)
          } else {
            promise.resolve(nil)
          }
        }
      } else {
        promise.reject("E_NOT_SUPPORTED", "Medications require iOS 26")
      }
    }

    AsyncFunction("medications") { (promise: Promise) in
      if #available(iOS 26.0, *) {
        Task {
          do {
            let descriptor = HKUserAnnotatedMedicationQueryDescriptor()
            let medications = try await descriptor.result(for: self.store)
            let out: [[String: Any]] = medications.map { med in
              var dict: [String: Any] = [
                "conceptIdentifier": "\(med.medication.identifier)",
                "displayText": med.medication.displayText,
                "generalForm": "\(med.medication.generalForm)",
                "isArchived": med.isArchived,
                "hasSchedule": med.hasSchedule,
              ]
              if let nickname = med.nickname { dict["nickname"] = nickname }
              return dict
            }
            promise.resolve(out)
          } catch {
            promise.reject(errorCode(error), error.localizedDescription)
          }
        }
      } else {
        promise.reject("E_NOT_SUPPORTED", "Medications require iOS 26")
      }
    }

    AsyncFunction("openHealthApp") { (promise: Promise) in
      DispatchQueue.main.async {
        guard let url = URL(string: "x-apple-health://") else {
          promise.reject("E_PLATFORM", "invalid Health app URL")
          return
        }
        UIApplication.shared.open(url, options: [:]) { ok in
          promise.resolve(ok)
        }
      }
    }

    OnDestroy {
      for query in self.observers.values {
        self.store.stop(query)
      }
      self.observers.removeAll()
    }
  }

  /// Workouts are created through HKWorkoutBuilder (HKWorkout's initialisers are deprecated).
  private func saveWorkout(_ sample: SaveSample, completion: @escaping (Result<String, Error>) -> Void) {
    do {
      let start = try parseDate(sample.start)
      let end = try parseDate(sample.end)
      let configuration = HKWorkoutConfiguration()
      configuration.activityType = HKWorkoutActivityType(rawValue: UInt(sample.workoutActivityType ?? 3000)) ?? .other
      let builder = HKWorkoutBuilder(healthStore: store, configuration: configuration, device: .local())
      let metadata = parseMetadata(sample.metadata)
      builder.beginCollection(withStart: start) { _, error in
        if let error { completion(.failure(error)); return }
        let finish = {
          builder.endCollection(withEnd: end) { _, error in
            if let error { completion(.failure(error)); return }
            builder.finishWorkout { workout, error in
              if let error { completion(.failure(error)); return }
              completion(.success(workout?.uuid.uuidString ?? ""))
            }
          }
        }
        if metadata.isEmpty {
          finish()
        } else {
          builder.addMetadata(metadata) { _, error in
            if let error { completion(.failure(error)); return }
            finish()
          }
        }
      }
    } catch {
      completion(.failure(error))
    }
  }
}

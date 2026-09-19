import ExpoModulesCore
import HealthKit
import UIKit

/// Info.plist key the config plugin sets when the app has the background-delivery entitlement.
private let backgroundDeliveryPlistKey = "HealthSpecBackgroundDelivery"

/**
 Thin bridge over HealthKit primitives. Type mapping, unit scaling and session derivation live in TypeScript
 (libraries/expo-health/src/AppleHealthProvider.ts); this module only moves samples across the boundary.

 HealthKit raises Objective-C exceptions for several kinds of misuse. Calls that can raise go through
 catchingHealthKit, and statistics are validated before the query exists, so misuse rejects instead of crashing.
 */
public class HealthSpecModule: Module {
  private let store = HKHealthStore()
  private var changeObserver: NSObjectProtocol?

  public func definition() -> ModuleDefinition {
    Name("HealthSpec")

    Events("onChange")

    OnStartObserving("onChange") {
      self.changeObserver = NotificationCenter.default.addObserver(forName: HealthSpecObservers.changed, object: nil, queue: nil) { [weak self] note in
        guard let identifier = note.userInfo?["identifier"] as? String else { return }
        self?.sendEvent("onChange", ["identifier": identifier])
      }
      HealthSpecObservers.shared.setListening(true)
    }

    OnStopObserving("onChange") {
      HealthSpecObservers.shared.setListening(false)
      if let observer = self.changeObserver { NotificationCenter.default.removeObserver(observer) }
      self.changeObserver = nil
    }

    Function("isHealthDataAvailable") { () -> Bool in
      HKHealthStore.isHealthDataAvailable()
    }

    Function("bundleIdentifier") { () -> String in
      Bundle.main.bundleIdentifier ?? ""
    }

    /// The identifiers this OS version knows. Types newer than the device are unsupported, not errors (SPEC §9).
    Function("supportedIdentifiers") { (identifiers: [String]) -> [String] in
      identifiers.filter { objectType($0) != nil }
    }

    Function("backgroundDeliveryConfigured") { () -> Bool in
      Bundle.main.object(forInfoDictionaryKey: backgroundDeliveryPlistKey) as? Bool ?? false
    }

    AsyncFunction("requestAuthorization") { (read: [String], write: [String], promise: Promise) in
      guard HKHealthStore.isHealthDataAvailable() else {
        promise.reject("E_NOT_AVAILABLE", "HealthKit is not available on this device")
        return
      }
      let readTypes = Set(read.compactMap { objectType($0) })
      let shareTypes = Set(write.compactMap { objectType($0) as? HKSampleType })
      do {
        // Sharing a type Apple reserves, or asking without the usage description, raises synchronously.
        try catchingHealthKit {
          self.store.requestAuthorization(toShare: shareTypes, read: readTypes) { _, error in
            if let error {
              promise.reject(errorCode(error), error.localizedDescription)
            } else {
              promise.resolve(nil)
            }
          }
        }
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
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
        let unit = try options.unit.map { try parseUnit($0) }
        let units = try (options.units ?? [:]).mapValues { try parseUnit($0) }
        let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: options.ascending)
        var predicates = [predicateForRange(start, end, excludeUserEntered: options.excludeUserEntered)]
        if let uuids = options.uuids, !uuids.isEmpty {
          predicates.append(HKQuery.predicateForObjects(with: Set(uuids.compactMap { UUID(uuidString: $0) })))
        }
        // The source filter is part of the predicate so `limit` counts only matching samples.
        self.sourcePredicate(type, options.sourceBundleIds, promise) { sources in
          let predicate = NSCompoundPredicate(andPredicateWithSubpredicates: predicates + (sources.map { [$0] } ?? []))
          let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: options.limit ?? HKObjectQueryNoLimit, sortDescriptors: [sort]) { _, samples, error in
            if let error {
              promise.reject(errorCode(error), error.localizedDescription)
              return
            }
            promise.resolve((samples ?? []).map { serialize($0, unit: unit, units: units) })
          }
          self.store.execute(query)
        }
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
      }
    }

    AsyncFunction("statistics") { (options: StatisticsOptions, promise: Promise) in
      do {
        let type = try quantityType(options.identifier)
        let start = try parseDate(options.start)
        let end = try parseDate(options.end)
        let unit = try parseUnit(options.unit)
        if let problem = statisticsProblem(type, options.fn, unit) {
          promise.reject("E_NOT_SUPPORTED", problem)
          return
        }
        let statsOptions = statisticsOptions(options.fn)
        let range = predicateForRange(start, end, excludeUserEntered: options.excludeUserEntered)
        self.sourcePredicate(type, options.sourceBundleIds, promise) { sources in
          let predicate = NSCompoundPredicate(andPredicateWithSubpredicates: [range] + (sources.map { [$0] } ?? []))
          if let interval = options.interval {
            let anchor = (try? options.anchor.map { try parseDate($0) }) ?? start
            let query = HKStatisticsCollectionQuery(quantityType: type, quantitySamplePredicate: predicate, options: statsOptions, anchorDate: anchor, intervalComponents: intervalComponents(interval))
            query.initialResultsHandler = { _, collection, error in
              if let error {
                promise.reject(errorCode(error), error.localizedDescription)
                return
              }
              var out: [[String: Any]] = []
              collection?.enumerateStatistics(from: min(anchor, start), to: end) { stats, _ in
                // enumerateStatistics includes the bucket that starts at `end`; the range is [start, end).
                guard stats.startDate < end else { return }
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
        }
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
      }
    }

    AsyncFunction("anchoredQuery") { (options: AnchoredOptions, promise: Promise) in
      do {
        let type = try sampleType(options.identifier)
        let unit = try options.unit.map { try parseUnit($0) }
        let units = try (options.units ?? [:]).mapValues { try parseUnit($0) }
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

    /**
     SPEC §7 forbids partial writes. Every object is built (and validated by HealthKit's initialisers) before
     anything is saved; samples then go to HealthKit in one call, which is atomic. Workouts can only be created
     through HKWorkoutBuilder, one at a time, so if a workout fails everything saved by this call is deleted again.
     */
    AsyncFunction("save") { (samples: [SaveSample], promise: Promise) in
      var objects: [Int: HKSample] = [:]
      do {
        for (index, sample) in samples.enumerated() where sample.kind != "workout" {
          objects[index] = try buildObject(sample)
        }
      } catch {
        promise.reject("E_INVALID_ARGUMENT", "\(error)")
        return
      }
      let batch = objects.keys.sorted().compactMap { objects[$0] }
      let saveWorkouts = {
        self.saveWorkouts(samples, from: 0, saved: []) { result in
          switch result {
          case .success(let workouts):
            promise.resolve(samples.indices.map { objects[$0]?.uuid.uuidString ?? workouts[$0] ?? "" })
          case .failure(let error):
            let code = error is HealthSpecError || error is HealthKitRaised ? "E_INVALID_ARGUMENT" : errorCode(error)
            if batch.isEmpty {
              promise.reject(code, "\(error)")
            } else {
              self.store.delete(batch) { _, _ in promise.reject(code, "\(error)") }
            }
          }
        }
      }
      if batch.isEmpty {
        saveWorkouts()
        return
      }
      self.store.save(batch) { _, error in
        if let error {
          promise.reject(errorCode(error), error.localizedDescription)
        } else {
          saveWorkouts()
        }
      }
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
        let predicate = predicateForRange(try parseDate(start), try parseDate(end), excludeUserEntered: false)
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
          // Remembered so the observer that background delivery needs is re-created at the next launch.
          if ok { HealthSpecObservers.shared.setBackground(identifier, enabled: true) }
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
          HealthSpecObservers.shared.setBackground(identifier, enabled: false)
          promise.resolve(ok)
        }
      }
    }

    AsyncFunction("startObserving") { (identifier: String, kind: String) -> String in
      HealthSpecObservers.shared.start(try sampleType(identifier))
    }

    AsyncFunction("stopObserving") { (observerId: String) in
      HealthSpecObservers.shared.stop(observerId)
    }

    /// Identifiers whose observers fired while JavaScript was not listening (e.g. a background launch).
    Function("pendingChanges") { () -> [String] in
      HealthSpecObservers.shared.takePending()
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
        out["dateOfBirth"] = String(format: "%04ld-%02ld-%02ld", y, m, d)
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
        let voltageQuery = HKElectrocardiogramQuery(ecg) { _, result in
          if settled { return }
          switch result {
          case .measurement(let measurement):
            if let quantity = measurement.quantity(for: .appleWatchSimilarToLeadI) {
              out.append(["offsetSeconds": measurement.timeSinceSampleStart, "microvolts": quantity.doubleValue(for: HKUnit.voltUnit(with: .micro))])
            }
          case .done:
            settled = true
            promise.resolve(out)
          case .error(let error):
            settled = true
            promise.reject(errorCode(error), error.localizedDescription)
          @unknown default:
            break
          }
        }
        self.store.execute(voltageQuery)
      }
      self.store.execute(query)
    }

    /// Activity summaries for the calendar days touching [start, end) in the device's calendar.
    AsyncFunction("activitySummaries") { (start: String, end: String, promise: Promise) in
      do {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone.current
        let startDate = try parseDate(start)
        // The summary predicate includes its end day; the last instant before `end` names the last day wanted.
        let lastDate = max(startDate, try parseDate(end).addingTimeInterval(-0.001))
        var from = calendar.dateComponents([.era, .year, .month, .day], from: startDate)
        var to = calendar.dateComponents([.era, .year, .month, .day], from: lastDate)
        from.calendar = calendar
        to.calendar = calendar
        let predicate = HKQuery.predicate(forActivitySummariesBetweenStart: from, end: to)
        let query = HKActivitySummaryQuery(predicate: predicate) { _, summaries, error in
          if let error {
            promise.reject(errorCode(error), error.localizedDescription)
            return
          }
          let formatter = DateFormatter()
          formatter.locale = Locale(identifier: "en_US_POSIX")
          formatter.calendar = calendar
          formatter.timeZone = calendar.timeZone
          formatter.dateFormat = "yyyy-MM-dd"
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
      #if compiler(>=6.2)
      if #available(iOS 26.0, *) {
        // Medications use per-object read authorization; the type is never part of requestAuthorization.
        self.store.requestPerObjectReadAuthorization(for: HKObjectType.userAnnotatedMedicationType(), predicate: nil) { _, error in
          if let error {
            promise.reject(errorCode(error), error.localizedDescription)
          } else {
            promise.resolve(nil)
          }
        }
        return
      }
      #endif
      promise.reject("E_NOT_SUPPORTED", "Medications require iOS 26")
    }

    AsyncFunction("medications") { (promise: Promise) in
      #if compiler(>=6.2)
      if #available(iOS 26.0, *) {
        Task {
          do {
            let descriptor = HKUserAnnotatedMedicationQueryDescriptor()
            let medications = try await descriptor.result(for: self.store)
            let out: [[String: Any]] = medications.map { med in
              var dict: [String: Any] = [
                "conceptIdentifier": conceptIdentifierString(med.medication.identifier),
                "displayText": med.medication.displayText,
                "generalForm": med.medication.generalForm.rawValue,
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
        return
      }
      #endif
      promise.reject("E_NOT_SUPPORTED", "Medications require iOS 26")
    }

    AsyncFunction("openHealthApp") { (promise: Promise) in
      DispatchQueue.main.async {
        guard let url = URL(string: "x-apple-health://") else {
          promise.reject("E_PLATFORM", "invalid Health app URL")
          return
        }
        UIApplication.shared.open(url, options: [:]) { opened in
          if opened {
            promise.resolve(nil)
          } else {
            promise.reject("E_NOT_AVAILABLE", "the Health app could not be opened")
          }
        }
      }
    }

    OnDestroy {
      HealthSpecObservers.shared.stopAll()
      if let observer = self.changeObserver { NotificationCenter.default.removeObserver(observer) }
    }
  }

  /**
   Resolves bundle identifiers to a predicate over their HKSources, then continues with it (nil when no filter was
   asked for). Filtering in the predicate, not afterwards, keeps `limit` and statistics honest. No matching source
   means no matching samples, so a predicate that matches nothing is passed on.
   */
  private func sourcePredicate(_ type: HKSampleType, _ bundleIds: [String]?, _ promise: Promise, _ next: @escaping (NSPredicate?) -> Void) {
    guard let bundleIds else {
      next(nil)
      return
    }
    let wanted = Set(bundleIds)
    let query = HKSourceQuery(sampleType: type, samplePredicate: nil) { _, sources, error in
      if let error {
        promise.reject(errorCode(error), error.localizedDescription)
        return
      }
      let matching = Set((sources ?? []).filter { wanted.contains($0.bundleIdentifier) })
      next(HKQuery.predicateForObjects(from: matching))
    }
    store.execute(query)
  }

  /// Workouts from `samples`, in order, keyed by input index. On failure every workout saved so far is deleted.
  private func saveWorkouts(_ samples: [SaveSample], from index: Int, saved: [(Int, HKWorkout)], completion: @escaping (Result<[Int: String], Error>) -> Void) {
    guard let next = samples.indices.first(where: { $0 >= index && samples[$0].kind == "workout" }) else {
      completion(.success(Dictionary(uniqueKeysWithValues: saved.map { ($0.0, $0.1.uuid.uuidString) })))
      return
    }
    saveWorkout(samples[next]) { result in
      switch result {
      case .success(let workout):
        self.saveWorkouts(samples, from: next + 1, saved: saved + [(next, workout)], completion: completion)
      case .failure(let error):
        let rollback = saved.map { $0.1 }
        if rollback.isEmpty {
          completion(.failure(error))
        } else {
          self.store.delete(rollback) { _, _ in completion(.failure(error)) }
        }
      }
    }
  }

  /// Workouts are created through HKWorkoutBuilder (HKWorkout's initialisers are deprecated).
  private func saveWorkout(_ sample: SaveSample, completion: @escaping (Result<HKWorkout, Error>) -> Void) {
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
              guard let workout else {
                completion(.failure(HealthSpecError.invalidArgument("HealthKit did not return the saved workout")))
                return
              }
              completion(.success(workout))
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

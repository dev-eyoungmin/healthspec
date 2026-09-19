import ExpoModulesCore
import HealthKit
import UIKit

/**
 HealthKit observer queries, shared by the module and the app delegate subscriber.

 Background delivery only wakes an app that has an observer query for the type; Apple requires those queries to
 be set up while the app finishes launching, before JavaScript runs. Identifiers registered for background
 delivery are therefore persisted, and `HealthSpecAppDelegateSubscriber` re-creates their observers at launch.
 A change that arrives while nothing in JavaScript is listening is kept until `takePending()`.
 */
final class HealthSpecObservers {
  static let shared = HealthSpecObservers()
  static let changed = Notification.Name("dev.healthspec.observedChange")

  private static let backgroundKey = "dev.healthspec.backgroundIdentifiers"

  private let store = HKHealthStore()
  private let lock = NSLock()
  private var queries: [String: HKObserverQuery] = [:]
  private var launchQueries: [String: HKObserverQuery] = [:]
  private var pending = Set<String>()
  private var listening = false

  var backgroundIdentifiers: [String] {
    UserDefaults.standard.stringArray(forKey: Self.backgroundKey) ?? []
  }

  func setBackground(_ identifier: String, enabled: Bool) {
    lock.lock()
    defer { lock.unlock() }
    var set = Set(backgroundIdentifiers)
    if enabled { set.insert(identifier) } else { set.remove(identifier) }
    UserDefaults.standard.set(set.sorted(), forKey: Self.backgroundKey)
  }

  func setListening(_ value: Bool) {
    lock.lock()
    listening = value
    lock.unlock()
  }

  /// Identifiers that changed while nothing was listening; clears them.
  func takePending() -> [String] {
    lock.lock()
    defer { lock.unlock() }
    let out = pending.sorted()
    pending.removeAll()
    return out
  }

  /// A foreground observer for a JavaScript subscription. Returns its id.
  func start(_ type: HKSampleType) -> String {
    let id = UUID().uuidString
    let query = makeQuery(type)
    lock.lock()
    queries[id] = query
    lock.unlock()
    store.execute(query)
    return id
  }

  func stop(_ id: String) {
    lock.lock()
    let query = queries.removeValue(forKey: id)
    lock.unlock()
    if let query { store.stop(query) }
  }

  func stopAll() {
    lock.lock()
    let all = Array(queries.values)
    queries.removeAll()
    lock.unlock()
    all.forEach { store.stop($0) }
  }

  /// Observers for every identifier registered for background delivery. Called once while the app launches.
  func startLaunchObservers() {
    for identifier in backgroundIdentifiers {
      guard let type = objectType(identifier) as? HKSampleType else { continue }
      lock.lock()
      let exists = launchQueries[identifier] != nil
      lock.unlock()
      if exists { continue }
      let query = makeQuery(type)
      lock.lock()
      launchQueries[identifier] = query
      lock.unlock()
      store.execute(query)
    }
  }

  private func makeQuery(_ type: HKSampleType) -> HKObserverQuery {
    let identifier = type.identifier
    return HKObserverQuery(sampleType: type, predicate: nil) { [weak self] _, completion, error in
      if error == nil { self?.record(identifier) }
      // HealthKit only needs to know the update was received; JavaScript fetches the data through changes().
      completion()
    }
  }

  private func record(_ identifier: String) {
    lock.lock()
    let deliver = listening
    if !deliver { pending.insert(identifier) }
    lock.unlock()
    if deliver {
      NotificationCenter.default.post(name: Self.changed, object: nil, userInfo: ["identifier": identifier])
    }
  }
}

/// Registered in expo-module.config.json so observers for background delivery exist before JavaScript starts.
public class HealthSpecAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    if HKHealthStore.isHealthDataAvailable() {
      HealthSpecObservers.shared.startLaunchObservers()
    }
    return true
  }
}

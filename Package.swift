// swift-tools-version: 6.0
import PackageDescription

// Root manifest so the repository can be consumed directly as a Swift package:
//   .package(url: "https://github.com/dev-eyoungmin/healthspec.git", from: "0.1.0")
//
// `HealthSpecCheck` verifies the generated tables without XCTest or Swift Testing, so it runs on a plain
// toolchain (Command Line Tools, CI containers) as well as inside Xcode: `swift run healthspec-check`.
let package = Package(
  name: "HealthSpec",
  platforms: [.iOS(.v15), .macOS(.v13), .watchOS(.v8)],
  products: [
    .library(name: "HealthSpec", targets: ["HealthSpec"]),
    .executable(name: "healthspec-check", targets: ["HealthSpecCheck"]),
  ],
  targets: [
    .target(name: "HealthSpec", path: "packages/apple/Sources/HealthSpec", swiftSettings: [.swiftLanguageMode(.v5)]),
    // Objective-C, because HealthKit reports misuse by raising exceptions Swift cannot catch.
    .target(name: "HealthSpecCheckSupport", path: "packages/apple/Sources/HealthSpecCheckSupport"),
    .executableTarget(name: "HealthSpecCheck", dependencies: ["HealthSpec", "HealthSpecCheckSupport"], path: "packages/apple/Sources/HealthSpecCheck", swiftSettings: [.swiftLanguageMode(.v5)]),
  ]
)

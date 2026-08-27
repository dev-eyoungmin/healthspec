# HealthSpec for Apple platforms

HealthKit side of the [HealthSpec](https://github.com/dev-eyoungmin/healthspec) specification, usable from any Swift project — a
React Native bridge is not required.

```swift
import HealthSpec

let info = HealthSpec.types[.steps]!
info.healthKit?.identifier      // "HKQuantityTypeIdentifierStepCount"
info.healthKit?.unit            // "count"
info.fieldUnits                 // ["count": "count"]
HealthSpec.crossPlatform.contains(.steps)   // true — Health Connect stores it too
```

Install with Swift Package Manager:

```swift
.package(url: "https://github.com/dev-eyoungmin/healthspec.git", from: "0.1.0")
```

or CocoaPods:

```ruby
pod 'HealthSpec'
```

`Sources/HealthSpec/Generated` is produced from `spec/schema` by `pnpm codegen`; do not edit it.

MIT licensed. See [NOTICE.md](../../NOTICE.md).

# @healthspec/cli

```sh
npx healthspec doctor [project] [--json]
npx healthspec mapping <type>
```

## doctor

Finds HealthKit and Health Connect configuration mistakes in an Expo project before App Review or Play Console
does. It reads the `@healthspec/expo` plugin options (from `app.json`, or `expo config` for a dynamic config) and
the prebuilt `ios/` and `android/` projects:

| Checked | Why it matters |
|---|---|
| HealthKit entitlement, background-delivery and health-records entitlements | missing entitlements fail silently or at review |
| `NSHealthShareUsageDescription`, `NSHealthUpdateUsageDescription`, clinical records description | HealthKit terminates the app without them; placeholder text fails App Review 5.1.3 |
| every Health Connect permission the declared types need, and none they do not | Health Connect never grants an undeclared permission; Play Console asks you to justify each one |
| the permissions-rationale intent filter and the Android 14 permission-usage activity alias | without them the permission dialog does not appear |
| `<queries>` visibility of `com.google.android.apps.healthdata` | without it `availability()` cannot see Health Connect |
| `android.minSdkVersion` ≥ 26 | Health Connect's client library requires it |
| types listed under `write` that a platform does not let apps write | e.g. HealthKit reserves stand hours for Apple |

It exits with 1 when it finds an error, so it can gate CI after `expo prebuild`, and ends with the checklist of what
only the store consoles can verify (the Play Console health apps declaration, the HealthKit capability on the App
ID, the privacy policy).

## mapping

Prints one type's mapping on both platforms: identifiers or record class, units, permissions, required metadata,
device features, fields a platform never populates, notes and counterparts.

```
$ npx healthspec mapping hrv_sdnn
hrv_sdnn  (vitals · sample · since 1.0)
  value fields: milliseconds [ms]
…
Counterparts
  hrv_rmssd — NOT interchangeable: …
```

`doctor` and `mapping` are also importable: `import { diagnose, describeMapping } from '@healthspec/cli'`.

MIT licensed.

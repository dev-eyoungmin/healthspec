# Errors, and what to do about them

Every rejection is a `HealthError` with a `code` (SPEC §9). Native errors never cross the boundary, so an app
can branch on the code rather than on a message.

```ts
import { isHealthError } from '@healthspec/expo';

try {
  await store.read('steps', { start, end });
} catch (e) {
  if (isHealthError(e) && e.code === 'NOT_AVAILABLE') showInstallPrompt();
  else throw e;
}
```

| Code | What happened | What to do |
|---|---|---|
| `NOT_AVAILABLE` | The health store is not usable here: Health Connect is missing, too old or unavailable; HealthKit is absent (a simulator, some iPads). | Check `store.availability()` first; offer `store.openInstaller()` for `not_installed` and `update_required`. |
| `NOT_SUPPORTED` | This platform, this OS version or this device does not have the type or operation. The message names the counterpart when there is one. | Ask `store.support(type)` before offering the feature, or narrow the request with `store.supportedTypes` / `requestSupportedPermissions`. |
| `PERMISSION_DENIED` | Health Connect refused the read or write; HealthKit refused a write, or a delete of another app's data. | Ask again (`requestPermissions`), or send the user to `store.openSettings()`. On iOS a *read* is never denied out loud — see below. |
| `CURSOR_EXPIRED` | A sync cursor can no longer be resumed: a Health Connect token older than 30 days, or an invalidated HealthKit anchor. | Resync from scratch. `store.sync()` and `syncTypes` already do. |
| `INVALID_ARGUMENT` | The arguments or a record do not satisfy the specification: a reversed range, a value out of range, an unknown field, a `sample` record whose end differs from its start. | Fix the call; the message carries the path (`records[0].value.kilograms`). |
| `RATE_LIMITED` | The platform is throttling. | Back off and retry; batch reads into wider ranges instead of many small ones. |
| `PLATFORM_ERROR` | Something the platform reported that has no spec meaning. `error.cause` holds the native error. | Log it with `cause`; it usually needs a look at the platform's own documentation. |

## Two cases that are not errors

**Empty results on iOS.** HealthKit never says whether read access was granted, so a read returns an empty
array whether the user said no or simply has no data. Permission statuses on iOS are `'unknown'` by design
(SPEC §3.1). If a screen has nothing to show, say "no data yet" and offer a link to the Health app rather than
claiming a permission problem.

**A type that is missing here.** `store.support(type)` reports it before the call, with `counterparts` naming
the nearest type on the other platform and whether the two are interchangeable. Reaching for a counterpart is
the caller's decision, never the provider's.

## Crashes the library turns into errors

HealthKit answers some misuse with an Objective-C exception, which in an app is a crash rather than a rejection:
a type Apple reserves for itself, a missing usage description, a unit in the wrong dimension, a statistics query
whose function does not match the quantity. The module catches those and rejects with `INVALID_ARGUMENT` or
`NOT_SUPPORTED`, and `healthspec-check` verifies the spec's own tables against the HealthKit runtime so they do
not happen in the first place. If you see one of these codes from a call that looks correct, the mapping is
worth reporting.

## Before submitting the app

`npx healthspec doctor` finds the configuration mistakes that surface as `NOT_AVAILABLE`, a permission dialog
that never appears, or an App Review rejection — missing entitlements, usage descriptions, manifest
declarations, `minSdkVersion`, and the Play Console health declaration checklist.

# @healthspec/conformance

The conformance suite for [HealthSpec](https://github.com/dev-eyoungmin/healthspec). Run it against any `Provider` to check it
against the specification — and to claim compatibility honestly.

```ts
import { runConformanceSuite } from '@healthspec/conformance';

const report = await runConformanceSuite(myProvider, { readOnly: true });
console.log(`${report.passed} passed · ${report.failed} failed · ${report.skipped} skipped`);
if (!report.conformant) {
  for (const r of report.results.filter((r) => r.status === 'failed')) {
    console.error(`${r.clause} — ${r.title}\n  ${r.detail}`);
  }
}
```

Every scenario cites the clause of [`SPEC.md`](../../spec/SPEC.md) it enforces, so a failure points at the
rule rather than at an implementation detail.

## How it runs

- Scenarios call the **provider directly**, not through `HealthStore`. The facade enforces several rules on
  its own, so testing through it would certify the facade instead of the implementation.
- A scenario whose capability the provider does not declare is **skipped, not failed** — declaring
  `changes: false` is a legitimate choice; lying about it is not.
- `readOnly: true` (the default) skips anything that would write to a real health store. Pass `false` when
  running against a mock or a disposable test account; write scenarios delete what they write.
- `readableType` / `writableType` choose the types scenarios use — pick ones the app has permission for.

## Scenarios

Capabilities and undeclared types (§2.1, §9) · availability before permissions (§4) · permission result shape
and HealthKit's `unknown` read status (§3.1) · read ordering, limits and ranges (§5.1) · contiguous, DST-aware
aggregate buckets and unknown fields (§6.2) · unsupported aggregate functions (§6.1) · snapshot and delta
changes, malformed cursors, and writes and deletes reported by the change feed (§8.1) · atomic, validated
writes, empty batches, read-only types and a write → read → delete round trip (§7) · optional operations (§9.1).

## Where it runs

- **CI, over fakes.** `libraries/expo-health/test/conformance.test.ts` certifies `AppleHealthProvider` and
  `HealthConnectProvider` against fakes that enforce the native modules' contracts.
- **On a device.** The example app's *Conformance* panel runs the suite against the real HealthKit or Health
  Connect provider.

## What it caught

The suite is not decorative. Run against the providers it found that `MockProvider` let apps write read-only
types (`PERMISSION_DENIED` instead of `NOT_SUPPORTED`). On its first run against `MockProvider` it found a real
inconsistency — `capabilities().types` excluded `exercise_route` while the internal type check still allowed
it, so an unsupported type surfaced as `PERMISSION_DENIED` instead of `NOT_SUPPORTED`, leaving callers unable
to tell "unsupported" from "not granted".

MIT licensed. See [NOTICE.md](../../NOTICE.md).

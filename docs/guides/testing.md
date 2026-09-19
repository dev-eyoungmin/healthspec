# Testing an app that reads health data

Health data is the hardest thing in a mobile app to test: it needs a device, a person who slept, and
permissions a simulator cannot grant. `MockProvider` removes the device from that list, and it is the same
provider the conformance suite is run against, so code that works with it works against a platform.

## Unit tests, in plain Node or Jest

Keep the health logic in a function that takes a `HealthStore`, and it runs anywhere:

```ts
// summary.ts
import type { HealthStore } from '@healthspec/core';

export async function weeklySteps(store: HealthStore, now = Date.now()) {
  const buckets = await store.aggregate('steps', { start: new Date(now - 7 * 86_400_000), end: new Date(now), fn: 'sum', bucket: 'day' });
  return buckets.map((b) => ({ date: b.start.slice(0, 10), steps: b.value ?? 0 }));
}
```

```ts
// summary.test.ts
import { HealthStore, MockProvider } from '@healthspec/core';
import { weeklySteps } from './summary';

const NOW = Date.parse('2026-08-21T10:00:00Z');

test('a week of steps', async () => {
  const store = new HealthStore(new MockProvider({ now: () => NOW, seed: 42, days: 10 }));
  await store.requestPermissions({ read: ['steps'] });
  expect(await weeklySteps(store, NOW)).toHaveLength(8);
});
```

`@healthspec/core` ships CommonJS as well as ES modules, so Jest needs no `transformIgnorePatterns` entry for
it. The seed is deterministic: the same seed produces the same records on every machine.

## The cases worth testing

`MockProvider` can produce the situations a device will eventually produce, and which usually reach users
untested:

```ts
// The platform is missing or too old.
new MockProvider({ availability: 'not_installed' });

// The user said no. On iOS reads then return nothing; on Android they reject.
new MockProvider({ platform: 'ios', permissionPolicy: 'deny' });
new MockProvider({ platform: 'android', permissionPolicy: (type) => (type === 'weight' ? 'denied' : 'granted') });

// A type this platform does not have at all (Health Connect has no hrv_sdnn).
new MockProvider({ platform: 'android' }); // capabilities().types mirrors the platform

// The sync cursor expired while the app was away.
const mock = new MockProvider({ seed: false });
mock.expireCursors();

// Another app wrote data your app cannot delete.
mock.simulateExternalWrite([{ type: 'weight', start, end, value: { kilograms: 70 } }]);

// An empty store — the state most screens forget.
new MockProvider({ seed: false });
```

Passing `platform` makes the mock mirror that platform's types, writable types and optional operations, so a
screen that only works on iOS fails in a test rather than in review.

## In the app, without a device

In Expo Go there is no native module, so `HealthStore.default()` returns a `MockProvider` with seed data and
mirrors the platform the app is running on. The whole screen — permissions, empty states, charts — can be built
before touching a device. `store.id` is `'mock'` when that fallback is in use, which is worth showing in a debug
menu.

To use the mock deliberately (a demo build, a screenshot run):

```ts
const store = HealthStore.default({ forceMock: true, mock: { seed: 7, days: 30 } });
```

## Against the specification

If you write your own `Provider` — a vendor SDK, a test double with particular behaviour — run the conformance
suite against it:

```ts
import { runConformanceSuite } from '@healthspec/conformance';

const report = await runConformanceSuite(myProvider, { readOnly: false });
expect(report.failed).toBe(0);
```

Every scenario names the clause of [`SPEC.md`](../../spec/SPEC.md) it enforces, so a failure points at the rule.

## On a device

Two things only a device can answer: whether permission dialogs behave, and whether the platform returns what
the mapping says. The example app's **Conformance** panel runs the same suite against the real provider —
read-only, or with a write that it deletes again.

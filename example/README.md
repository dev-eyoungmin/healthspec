# HealthSpec example

A seven-day summary — steps, distance, active energy, heart rate, sleep stages and workouts — built once and
running on both platforms.

```sh
pnpm install
pnpm --filter healthspec-example test    # the data layer, against MockProvider
npx expo start                           # Expo Go: MockProvider with seed data, no device needed
npx expo run:ios                         # a real build, reading Apple Health
npx expo run:android                     # a real build, reading Health Connect
```

## What it demonstrates

**One call, both platforms.** `loadSummary` is the whole data layer and contains no `Platform.OS`:

```ts
const daily = await store.aggregate('steps', { start, end, fn: 'sum', bucket: 'day' });
const [latest] = await store.read('heart_rate', { start, end, order: 'desc', limit: 1 });
```

**Values arrive canonical.** Distance is metres, weight kilograms, heart rate bpm — on both platforms. The
screen formats; it never converts.

**Differences are declared, not discovered.** The screen asks `store.support(type)` and renders a "not
available here" row with the counterpart, instead of an empty card the user cannot explain.

**Permissions are declared once.** `requestSupportedPermissions` narrows the app's type list to what the
platform actually has, so the same declaration works on iOS and Android.

**No device required to build the screen.** Without a native module the store falls back to `MockProvider`
with deterministic seed data, which is also what the tests run against — `test/summary.test.ts` exercises the
whole data layer in plain Node, including a platform that is missing two of the types.

# @healthspec/expo

Apple HealthKit and Android Health Connect behind one spec-conformant API.

```ts
import { HealthStore } from '@healthspec/expo';

const store = HealthStore.default(); // Apple Health on iOS, Health Connect on Android, Mock in Expo Go / tests

await store.requestPermissions({ read: ['steps', 'heart_rate', 'sleep_session'], write: ['weight'] });
const steps = await store.read('steps', { start: new Date('2026-08-01'), end: new Date() });
const daily = await store.aggregate('steps', { start, end, fn: 'sum', bucket: 'day' });
```

## Install

```sh
npx expo install @healthspec/expo
```

Add the config plugin and list the types your app uses — native permissions and entitlements are derived from the spec, so nothing can be forgotten:

```json
{
  "expo": {
    "plugins": [
      ["@healthspec/expo", { "read": ["steps", "heart_rate", "sleep_session"], "write": ["weight"], "background": true }]
    ]
  }
}
```

Then `npx expo prebuild` and run a development build. In Expo Go the native modules are absent and `HealthStore.default()` falls back to `MockProvider` with seed data, so screens can be built without a device.

## Status

Phase 1 — TypeScript providers are written and unit-tested against fake native modules; the Swift and Kotlin modules are written but **not yet compiled or run on devices**.

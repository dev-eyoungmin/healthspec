import type { HealthStore } from './store.js';

/**
 * The app-wide store, without the hooks having to import it.
 *
 * `HealthStore.default()` reaches for the native modules, and so pulls in React Native. The hooks work with any
 * store, so they ask for the default one through this registry instead — which also lets them be rendered in a
 * plain Node test.
 */
let factory: (() => HealthStore) | undefined;

export function setDefaultStore(create: () => HealthStore): void {
  factory = create;
}

export function defaultStore(): HealthStore {
  if (!factory) throw new Error('[healthspec] no default store — import HealthStore from @healthspec/expo, or pass { store } to the hook');
  return factory();
}

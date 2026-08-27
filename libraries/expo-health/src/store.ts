import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';
import { HealthStore as CoreHealthStore, MockProvider, type MockProviderOptions, type Provider } from '@healthspec/core';
import { AppleHealthProvider, type AppleHealthProviderOptions } from './AppleHealthProvider.js';
import { HealthConnectProvider, type HealthConnectProviderOptions } from './HealthConnectProvider.js';
import type { AppleHealthNative, HealthConnectNative } from './native.js';

export interface DefaultProviderOptions {
  apple?: AppleHealthProviderOptions;
  healthConnect?: HealthConnectProviderOptions;
  mock?: MockProviderOptions;
  /** Use MockProvider even when the native module is present (UI tests, demos). */
  forceMock?: boolean;
}

let warnedAboutMock = false;

/** Apple Health on iOS, Health Connect on Android, MockProvider where no native module is linked (Expo Go, web, tests). */
export function createDefaultProvider(options: DefaultProviderOptions = {}): Provider {
  if (!options.forceMock) {
    if (Platform.OS === 'ios') {
      const module = requireOptionalNativeModule<AppleHealthNative>('HealthSpec');
      if (module) return new AppleHealthProvider(module, options.apple);
    } else if (Platform.OS === 'android') {
      const module = requireOptionalNativeModule<HealthConnectNative>('HealthSpec');
      if (module) return new HealthConnectProvider(module, options.healthConnect);
    }
    if (!warnedAboutMock && (Platform.OS === 'ios' || Platform.OS === 'android')) {
      warnedAboutMock = true;
      console.warn('[healthspec] native module "HealthSpec" not found (Expo Go or missing prebuild) — using MockProvider with seed data.');
    }
  }
  return new MockProvider(options.mock);
}

export class HealthStore extends CoreHealthStore {
  private static instance: HealthStore | undefined;

  /** The app-wide store. Passing options replaces the shared instance. */
  static default(options?: DefaultProviderOptions): HealthStore {
    if (options !== undefined || HealthStore.instance === undefined) HealthStore.instance = new HealthStore(createDefaultProvider(options));
    return HealthStore.instance;
  }

  static reset(): void {
    HealthStore.instance = undefined;
  }
}

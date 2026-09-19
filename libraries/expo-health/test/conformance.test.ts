/**
 * Both providers against the specification's conformance suite, over fakes that behave like the native modules.
 * This certifies the TypeScript layer — mapping, validation, error codes, cursors — without a device; the same
 * suite runs on devices from the example app.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runConformanceSuite } from '@healthspec/conformance';
import type { Provider } from '@healthspec/core';
import { AppleHealthProvider } from '../src/AppleHealthProvider.js';
import { HealthConnectProvider } from '../src/HealthConnectProvider.js';
import { FakeApple, FakeHealthConnect } from './fakes.js';

async function conformant(provider: Provider) {
  const caps = provider.capabilities();
  await provider.requestPermissions({ read: caps.types.filter((t) => !t.startsWith('clinical_')), write: caps.write });
  const report = await runConformanceSuite(provider, { readOnly: false });
  assert.deepEqual(
    report.results.filter((r) => r.status === 'failed').map((r) => `${r.id}: ${r.detail}`),
    [],
    `${provider.id} must pass every scenario`,
  );
  assert.ok(report.passed >= 18, `only ${report.passed} scenarios ran`);
}

test('HealthConnectProvider is conformant', () => conformant(new HealthConnectProvider(new FakeHealthConnect())));
test('AppleHealthProvider is conformant', () => conformant(new AppleHealthProvider(new FakeApple())));

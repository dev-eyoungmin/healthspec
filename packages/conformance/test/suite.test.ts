import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MockProvider, type Capabilities, type Provider, type ReadQuery } from '@healthspec/core';
import type { HealthRecordOf, HealthType } from '@healthspec/schema';
import { SCENARIOS, runConformanceSuite } from '../src/index.js';

/**
 * Delegates to a real provider so prototype methods survive, while letting a test override individual ones.
 * A spread of a class instance would drop every method, which is not the deviation we mean to test.
 */
function deviant(base: Provider, overrides: Partial<Provider>): Provider {
  return new Proxy(base, {
    get(target, prop, receiver) {
      if (prop in overrides) return (overrides as Record<string | symbol, unknown>)[prop];
      const value = Reflect.get(target, prop, target) as unknown;
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

const NOW = Date.parse('2026-08-21T10:00:00Z');
const options = { now: () => NOW, readOnly: false };

test('the reference MockProvider is conformant', async () => {
  const mock = new MockProvider({ now: () => NOW, seed: 5, days: 7 });
  await mock.requestPermissions({ read: mock.capabilities().types, write: mock.capabilities().write, profile: true });
  const report = await runConformanceSuite(mock, options);
  const failures = report.results.filter((r) => r.status === 'failed');
  assert.deepEqual(failures.map((f) => `${f.id}: ${f.detail}`), [], 'MockProvider must pass every scenario');
  assert.equal(report.conformant, true);
  assert.ok(report.passed >= 10, `only ${report.passed} scenarios ran`);
});

test('every scenario names the clause it enforces', () => {
  for (const s of SCENARIOS) {
    assert.match(s.clause, /^SPEC §/, `${s.id} must cite a SPEC clause`);
    assert.ok(s.title.length > 10, `${s.id} needs a descriptive title`);
  }
  assert.equal(new Set(SCENARIOS.map((s) => s.id)).size, SCENARIOS.length, 'scenario ids must be unique');
});

test('scenarios are skipped, not failed, when a capability is absent', async () => {
  const mock = new MockProvider({ now: () => NOW, seed: false });
  await mock.requestPermissions({ read: mock.capabilities().types, write: mock.capabilities().write, profile: true });
  const limited = deviant(mock, { capabilities: (): Capabilities => ({ ...mock.capabilities(), changes: false, aggregate: false }) });
  const report = await runConformanceSuite(limited, options);
  const skipped = report.results.filter((r) => r.status === 'skipped');
  assert.ok(skipped.some((s) => s.id === 'changes-snapshot-then-delta'));
  assert.ok(skipped.every((s) => s.detail?.includes('declares')));
});

test('a provider that violates the spec fails the matching scenario', async () => {
  const mock = new MockProvider({ now: () => NOW, seed: false });
  await mock.requestPermissions({ read: mock.capabilities().types });
  // SPEC §2.1 forbids returning empty for an undeclared type; this provider does it anyway.
  const cheating = deviant(mock, {
    capabilities: (): Capabilities => ({ ...mock.capabilities(), types: ['steps'] }),
    read: async <T extends HealthType>(_type: T, _query: ReadQuery): Promise<HealthRecordOf<T>[]> => [],
  });
  const report = await runConformanceSuite(cheating, options);
  const failure = report.results.find((r) => r.id === 'undeclared-types-reject');
  assert.equal(failure?.status, 'failed');
  assert.match(failure?.detail ?? '', /NOT_SUPPORTED/);
  assert.equal(report.conformant, false);
});

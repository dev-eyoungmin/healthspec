import { TYPE_MAPPINGS, type HealthType } from '@healthspec/schema';
import { HealthStore, type Provider } from '@healthspec/core';
import { SCENARIOS, type Scenario, type ScenarioContext } from './scenarios.js';

export interface ConformanceOptions {
  /** Read-only run: scenarios that would write to a real health store are skipped. Default true. */
  readOnly?: boolean;
  /** Type used by read scenarios. Defaults to the first supported type with data-bearing fields. */
  readableType?: HealthType;
  /** Type used by write scenarios. Defaults to the first writable type. */
  writableType?: HealthType;
  /** Only run these scenario ids. */
  only?: string[];
  /** Clock, for deterministic runs. */
  now?: () => number;
}

export interface ConformanceResult {
  id: string;
  clause: string;
  title: string;
  status: 'passed' | 'failed' | 'skipped';
  /** Why it was skipped, or how it failed. */
  detail?: string;
  durationMs: number;
}

export interface ConformanceReport {
  provider: string;
  passed: number;
  failed: number;
  skipped: number;
  results: ConformanceResult[];
  /** True when nothing failed — the provider may claim conformance at this spec version. */
  conformant: boolean;
}

const CAPABILITY_KEYS = { aggregate: 'aggregate', changes: 'changes', subscribe: 'subscribe', profile: 'profile', routes: 'routes', readById: 'readById' } as const;

function missingCapability(scenario: Scenario, provider: Provider): string | undefined {
  const caps = provider.capabilities();
  for (const required of scenario.requires ?? []) {
    if (required === 'write') {
      if (caps.write.length === 0) return 'provider declares no writable types';
      continue;
    }
    const key = CAPABILITY_KEYS[required];
    if (!caps[key]) return `provider declares ${key}: false`;
  }
  return undefined;
}

/**
 * Runs the specification's conformance scenarios against a provider. Every scenario names the SPEC clause it
 * enforces, so a failure points at the rule rather than at an implementation detail.
 *
 * Scenarios call the provider directly rather than through HealthStore: the facade enforces several rules on
 * its own, so testing through it would certify the facade instead of the implementation. The two scenarios
 * that are about the facade say so.
 */
export async function runConformanceSuite(provider: Provider, options: ConformanceOptions = {}): Promise<ConformanceReport> {
  const store = new HealthStore(provider);
  const caps = provider.capabilities();
  const readOnly = options.readOnly ?? true;
  const now = options.now?.() ?? Date.now();

  const readableType = options.readableType ?? caps.types.find((t) => Object.keys(TYPE_MAPPINGS[t].fieldUnits).length > 0) ?? caps.types[0];
  const writableType = options.writableType ?? caps.write.find((t) => Object.keys(TYPE_MAPPINGS[t].fieldUnits).length > 0);
  const context: ScenarioContext = { provider, store, readableType, writableType, readOnly, now };

  const results: ConformanceResult[] = [];
  for (const scenario of SCENARIOS) {
    if (options.only && !options.only.includes(scenario.id)) continue;
    const started = Date.now();
    const skip = missingCapability(scenario, provider);
    if (skip) {
      results.push({ id: scenario.id, clause: scenario.clause, title: scenario.title, status: 'skipped', detail: skip, durationMs: 0 });
      continue;
    }
    try {
      await scenario.run(context);
      results.push({ id: scenario.id, clause: scenario.clause, title: scenario.title, status: 'passed', durationMs: Date.now() - started });
    } catch (e) {
      results.push({
        id: scenario.id,
        clause: scenario.clause,
        title: scenario.title,
        status: 'failed',
        detail: e instanceof Error ? e.message : String(e),
        durationMs: Date.now() - started,
      });
    }
  }

  const failed = results.filter((r) => r.status === 'failed').length;
  return {
    provider: provider.id,
    passed: results.filter((r) => r.status === 'passed').length,
    failed,
    skipped: results.filter((r) => r.status === 'skipped').length,
    results,
    conformant: failed === 0,
  };
}

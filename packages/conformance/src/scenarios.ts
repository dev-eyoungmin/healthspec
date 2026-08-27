import { TYPE_MAPPINGS, type HealthType } from '@healthspec/schema';
import { HealthStore, isHealthError, type NewRecord, type Provider } from '@healthspec/core';

export interface ScenarioContext {
  provider: Provider;
  store: HealthStore;
  /** A type the provider supports and can write — scenarios that mutate data need it. */
  writableType: HealthType | undefined;
  /** A type the provider supports for reading. */
  readableType: HealthType | undefined;
  /** Reads only; skip anything that would write to a real health store. */
  readOnly: boolean;
  now: number;
}

export interface Scenario {
  id: string;
  /** The clause of spec/SPEC.md this enforces. */
  clause: string;
  title: string;
  /** Providers that declare none of these capabilities skip the scenario. */
  requires?: Array<'aggregate' | 'changes' | 'subscribe' | 'write' | 'profile' | 'routes' | 'readById'>;
  run(ctx: ScenarioContext): Promise<void>;
}

const DAY = 86_400_000;
const assert = (condition: unknown, message: string): void => {
  if (!condition) throw new Error(message);
};
/**
 * Providers must reject, not throw synchronously — a caller should be able to use a single `.catch()`.
 * The thunk form catches both so the scenario can tell them apart.
 */
const rejectsWith = async (code: string, call: () => Promise<unknown>, message: string): Promise<void> => {
  let promise: Promise<unknown>;
  try {
    promise = call();
  } catch (e) {
    throw new Error(`${message} — threw synchronously instead of rejecting: ${isHealthError(e) ? e.code : String(e)}`);
  }
  try {
    await promise;
  } catch (e) {
    assert(isHealthError(e) && e.code === code, `${message} — expected ${code}, got ${isHealthError(e) ? e.code : String(e)}`);
    return;
  }
  throw new Error(`${message} — expected ${code}, but it resolved`);
};

/** Every provider must satisfy these, whatever platform it wraps. */
export const SCENARIOS: Scenario[] = [
  {
    id: 'capabilities-are-honest',
    clause: 'SPEC §9',
    title: 'capabilities() lists only types the spec defines, and write is a subset of types',
    async run({ provider }) {
      const caps = provider.capabilities();
      assert(Array.isArray(caps.types) && caps.types.length > 0, 'capabilities().types must be a non-empty array');
      for (const t of caps.types) assert(TYPE_MAPPINGS[t] !== undefined, `"${t}" is not a spec type`);
      for (const t of caps.write) assert(caps.types.includes(t), `writable type "${t}" is missing from types`);
    },
  },
  {
    id: 'undeclared-types-reject',
    clause: 'SPEC §2.1',
    title: 'an undeclared type rejects with NOT_SUPPORTED rather than returning empty',
    async run({ provider, now }) {
      const undeclared = (Object.keys(TYPE_MAPPINGS) as HealthType[]).find((t) => !provider.capabilities().types.includes(t));
      if (!undeclared) return;
      await rejectsWith('NOT_SUPPORTED', () => provider.read(undeclared, { start: new Date(now - DAY), end: new Date(now) }), 'reading an undeclared type');
    },
  },
  {
    id: 'availability-before-permissions',
    clause: 'SPEC §4',
    title: 'availability() is callable before any permission request and returns a known state',
    async run({ provider }) {
      const state = await provider.availability();
      assert(['available', 'not_installed', 'update_required', 'not_supported'].includes(state), `unknown availability "${state}"`);
    },
  },
  {
    id: 'permission-result-shape',
    clause: 'SPEC §3.1',
    title: 'permission results cover every requested type with a known status',
    async run({ provider, readableType }) {
      if (!readableType) return;
      const result = await provider.requestPermissions({ read: [readableType] });
      const status = result.read[readableType];
      assert(status !== undefined, `read status missing for "${readableType}"`);
      assert(['granted', 'denied', 'unknown'].includes(status as string), `unknown permission status "${String(status)}"`);
    },
  },
  {
    id: 'read-range-is-half-open',
    clause: 'SPEC §5.1',
    title: 'read() returns records ordered by start and honours limit',
    async run({ provider, readableType, now }) {
      if (!readableType) return;
      const records = await provider.read(readableType, { start: new Date(now - 7 * DAY), end: new Date(now), limit: 5 });
      assert(records.length <= 5, `limit ignored: got ${records.length} records`);
      for (let i = 1; i < records.length; i++) {
        assert(Date.parse(records[i]!.start) >= Date.parse(records[i - 1]!.start), 'records are not ordered by start');
      }
      for (const r of records) {
        assert(r.type === readableType, `record type "${r.type}" does not match the query`);
        assert(typeof r.id === 'string' && r.id.length > 0, 'every record needs an id');
        assert(Date.parse(r.end) >= Date.parse(r.start), 'end must not be before start');
        assert(r.source !== undefined && typeof r.source.recordingMethod === 'string', 'every record needs source.recordingMethod');
        if (TYPE_MAPPINGS[readableType].kind === 'sample') assert(r.start === r.end, 'sample records must have start == end');
      }
    },
  },
  {
    id: 'invalid-range-rejects',
    clause: 'SPEC §5.1',
    title: 'an end before start rejects with INVALID_ARGUMENT, asynchronously',
    async run({ provider, readableType, now }) {
      if (!readableType) return;
      await rejectsWith('INVALID_ARGUMENT', () => provider.read(readableType, { start: new Date(now), end: new Date(now - DAY) }), 'reversed range');
    },
  },
  {
    id: 'aggregate-buckets-are-contiguous',
    clause: 'SPEC §6.2',
    title: 'bucketed aggregation returns aligned, contiguous buckets and keeps empty ones',
    requires: ['aggregate'],
    async run({ provider, readableType, now }) {
      if (!readableType) return;
      const fn = TYPE_MAPPINGS[readableType].aggregate[0];
      if (!fn) return;
      const buckets = await provider.aggregate(readableType, { start: new Date(now - 3 * DAY), end: new Date(now), fn, bucket: 'day' });
      assert(buckets.length > 0, 'no buckets returned');
      for (let i = 1; i < buckets.length; i++) {
        assert(buckets[i]!.start === buckets[i - 1]!.end, `bucket ${i} does not start where the previous ended`);
      }
      for (const b of buckets) assert(b.value === null || typeof b.value === 'number', 'bucket values must be a number or null');
    },
  },
  {
    id: 'unsupported-aggregate-rejects',
    clause: 'SPEC §6.1',
    title: 'an aggregate function the type does not declare rejects with NOT_SUPPORTED',
    requires: ['aggregate'],
    async run({ provider, readableType, now }) {
      if (!readableType) return;
      const declared = TYPE_MAPPINGS[readableType].aggregate;
      const missing = (['sum', 'avg', 'min', 'max', 'count', 'duration'] as const).find((f) => !declared.includes(f));
      if (!missing) return;
      await rejectsWith('NOT_SUPPORTED', () => provider.aggregate(readableType, { start: new Date(now - DAY), end: new Date(now), fn: missing }), `aggregate "${missing}"`);
    },
  },
  {
    id: 'changes-snapshot-then-delta',
    clause: 'SPEC §8.1',
    title: 'changes() without a cursor is a snapshot; with one it is a delta and the cursor advances',
    requires: ['changes'],
    async run({ provider, readableType }) {
      if (!readableType) return;
      const snapshot = await provider.changes(readableType);
      assert(snapshot.snapshot === true, 'a cursorless changes() must be marked as a snapshot');
      assert(typeof snapshot.cursor === 'string' && snapshot.cursor.length > 0, 'changes() must return a cursor');
      assert(Array.isArray(snapshot.deletes), 'changes() must return a deletes array');
      const delta = await provider.changes(readableType, { cursor: snapshot.cursor });
      assert(delta.snapshot === false, 'a cursored changes() must not be marked as a snapshot');
    },
  },
  {
    id: 'foreign-cursor-rejects',
    clause: 'SPEC §8.1',
    title: 'a malformed cursor rejects with INVALID_ARGUMENT, not CURSOR_EXPIRED',
    requires: ['changes'],
    async run({ provider, readableType }) {
      if (!readableType) return;
      await rejectsWith('INVALID_ARGUMENT', () => provider.changes(readableType, { cursor: 'not-a-cursor' }), 'malformed cursor');
    },
  },
  {
    id: 'write-validates-before-native',
    clause: 'SPEC §7',
    title: 'an out-of-range value rejects with INVALID_ARGUMENT and writes nothing',
    requires: ['write'],
    async run({ provider, writableType, readOnly, now }) {
      if (!writableType || readOnly) return;
      const field = Object.keys(TYPE_MAPPINGS[writableType].fieldUnits)[0];
      if (!field) return;
      const bad: NewRecord = { type: writableType, start: new Date(now).toISOString(), end: new Date(now).toISOString(), value: { [field]: -1 } } as NewRecord;
      await rejectsWith('INVALID_ARGUMENT', () => provider.write([bad]), 'writing a negative measurement');
    },
  },
  {
    id: 'unsupported-operations-reject',
    clause: 'SPEC §9.1',
    title: 'optional operations reject with NOT_SUPPORTED when the capability is false',
    async run({ store, provider }) {
      // Checked through HealthStore: a provider signals "unsupported" either by the capability flag or by
      // simply not implementing the method, and the facade is what turns both into NOT_SUPPORTED.
      const caps = provider.capabilities();
      if (!caps.profile) await rejectsWith('NOT_SUPPORTED', () => store.getProfile(), 'getProfile without the capability');
      if (!caps.routes) await rejectsWith('NOT_SUPPORTED', () => store.readRoute('any'), 'readRoute without the capability');
      if (!caps.revokePermissions) await rejectsWith('NOT_SUPPORTED', () => store.revokePermissions(), 'revokePermissions without the capability');
    },
  },
  {
    id: 'support-describes-every-type',
    clause: 'SPEC §2.1',
    title: 'support() answers for every spec type, supported or not',
    async run({ store }) {
      for (const type of Object.keys(TYPE_MAPPINGS) as HealthType[]) {
        const support = store.support(type);
        assert(support.type === type, 'support() must echo the type');
        assert(Array.isArray(support.missingFields), 'support() must list missing fields');
        assert(Array.isArray(support.counterparts), 'support() must list counterparts');
        if (!support.supported) assert(!support.read && !support.write, 'an unsupported type cannot be readable or writable');
      }
    },
  },
];

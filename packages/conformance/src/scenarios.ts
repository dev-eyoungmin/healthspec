import { TYPE_EXAMPLES } from '@healthspec/schema/examples';
import { TYPE_MAPPINGS, validateRecord, type HealthRecord, type HealthType } from '@healthspec/schema';
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
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
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

const HOUR = 3_600_000;
const isoSeconds = (ms: number) => new Date(Math.floor(ms / 1000) * 1000).toISOString();

/** A valid record of `type` from its schema example, placed an hour or two before `now` in whole seconds. */
function exampleRecord(type: HealthType, now: number, offsetHours = 2): NewRecord {
  const value = TYPE_EXAMPLES[type][0] ?? {};
  const start = isoSeconds(now - offsetHours * HOUR);
  const end = TYPE_MAPPINGS[type].kind === 'sample' ? start : isoSeconds(now - (offsetHours - 1) * HOUR);
  return { type, start, end, value, source: { recordingMethod: 'manual' } } as NewRecord;
}

/** Numbers equal to the precision platforms store (HealthKit and Health Connect both use doubles). */
const sameNumber = (a: unknown, b: unknown) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a));

/** The native id a flattened series id belongs to — what a change feed reports on deletion (SPEC §5.3). */
const nativeId = (id: string) => id.replace(/#\d+$/, '');

async function findById(provider: Provider, record: HealthRecord, id: string, window: { start: number; end: number }): Promise<HealthRecord | undefined> {
  const found = await provider.read(record.type, { start: new Date(window.start), end: new Date(window.end) });
  return found.find((r) => r.id === id);
}

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
    title: 'a batch with one invalid record rejects with INVALID_ARGUMENT and writes nothing',
    requires: ['write'],
    async run({ provider, writableType, readOnly, now }) {
      if (!writableType || readOnly) return;
      const valid = exampleRecord(writableType, now);
      const field = Object.keys(TYPE_MAPPINGS[writableType].fieldUnits)[0];
      // An out-of-range value the spec's own validator rejects, whichever bound the field has.
      const invalid = [-1, 1e12, 'not a number']
        .map((bad) => ({ ...valid, value: { ...(valid.value as object), ...(field ? { [field]: bad } : { unexpected: bad }) } }) as NewRecord)
        .find((r) => validateRecord(r, { partial: true }).length > 0);
      if (!invalid) return;
      await rejectsWith('INVALID_ARGUMENT', () => provider.write([valid, invalid]), 'writing a batch with an invalid record');
      const readable = provider.capabilities().types.includes(writableType);
      if (!readable) return;
      const after = await provider.read(writableType, { start: new Date(Date.parse(valid.start)), end: new Date(Date.parse(valid.end) + 1000) }).catch(() => []);
      assert(!after.some((r) => r.start === valid.start && r.source.app !== undefined && r.metadata?.['hk.derived'] === undefined && sameNumber((r.value as Record<string, unknown>)[field ?? ''], (valid.value as Record<string, unknown>)[field ?? ''])), 'the valid record of a rejected batch was written');
    },
  },
  {
    id: 'empty-write-is-a-no-op',
    clause: 'SPEC §7',
    title: 'writing an empty batch resolves with an empty array',
    requires: ['write'],
    async run({ provider, readOnly }) {
      if (readOnly) return;
      const out = await provider.write([]);
      assert(Array.isArray(out) && out.length === 0, 'write([]) must resolve with []');
    },
  },
  {
    id: 'write-read-delete-round-trip',
    clause: 'SPEC §7',
    title: 'a written record reads back with its id, value and app, honours [start, end), and deletes by id',
    requires: ['write'],
    async run({ provider, writableType, readOnly, now }) {
      if (!writableType || readOnly) return;
      const input = exampleRecord(writableType, now);
      const [written] = await provider.write([input]);
      assert(written !== undefined && typeof written.id === 'string' && written.id.length > 0, 'write must resolve with the stored record and its id');
      assert(written.source.app?.id !== undefined, 'a written record must carry the writing app (SPEC §1.4)');
      const startMs = Date.parse(input.start);
      const endMs = Date.parse(input.end);
      const window = { start: startMs, end: Math.max(endMs, startMs + 1000) };
      const read = await findById(provider, written, written.id, window);
      assert(read !== undefined, `record ${written.id} was not returned by read() — grant read and write access to "${writableType}" before running`);
      for (const [field, expected] of Object.entries(input.value as Record<string, unknown>)) {
        if (typeof expected !== 'number') continue;
        const actual = (read.value as Record<string, unknown>)[field];
        assert(sameNumber(actual, expected), `${writableType}.${field} read back as ${String(actual)}, wrote ${expected}`);
      }
      assert(read.source.app?.id === written.source.app?.id, 'the record must read back with the app that wrote it');
      if (TYPE_MAPPINGS[writableType].kind === 'sample') {
        const before = await findById(provider, written, written.id, { start: startMs - HOUR, end: startMs });
        assert(before === undefined, 'an instant at `start` must not be returned by a range that ends there — the range is [start, end)');
      }
      await provider.delete({ type: writableType, ids: [written.id] });
      const gone = await findById(provider, written, written.id, window);
      assert(gone === undefined, `record ${written.id} is still readable after delete`);
    },
  },
  {
    id: 'non-writable-types-reject',
    clause: 'SPEC §7',
    title: 'writing a declared but read-only type rejects with NOT_SUPPORTED, not PERMISSION_DENIED',
    requires: ['write'],
    async run({ provider, readOnly, now }) {
      if (readOnly) return;
      const caps = provider.capabilities();
      const readOnlyType = caps.types.find((t) => !caps.write.includes(t) && (TYPE_EXAMPLES[t]?.length ?? 0) > 0);
      if (!readOnlyType) return;
      await rejectsWith('NOT_SUPPORTED', () => provider.write([exampleRecord(readOnlyType, now)]), `writing read-only "${readOnlyType}"`);
    },
  },
  {
    id: 'changes-report-writes-and-deletes',
    clause: 'SPEC §8.1',
    title: 'after a cursor, changes() reports a written record as an upsert and its deletion as a delete',
    requires: ['changes', 'write'],
    async run({ provider, writableType, readOnly, now }) {
      if (!writableType || readOnly) return;
      const { cursor } = await provider.changes(writableType);
      const [written] = await provider.write([exampleRecord(writableType, now, 3)]);
      assert(written !== undefined, 'write must resolve with the stored record');
      const afterWrite = await provider.changes(writableType, { cursor });
      assert(afterWrite.upserts.some((r) => r.id === written.id || nativeId(r.id) === nativeId(written.id)), `changes() did not report the upsert of ${written.id}`);
      await provider.delete({ type: writableType, ids: [written.id] });
      const afterDelete = await provider.changes(writableType, { cursor: afterWrite.cursor });
      assert(afterDelete.deletes.some((id) => id === written.id || id === nativeId(written.id)), `changes() did not report the deletion of ${written.id}`);
    },
  },
  {
    id: 'aggregate-rejects-unknown-field',
    clause: 'SPEC §6.2',
    title: 'aggregating a field the type does not have rejects with INVALID_ARGUMENT',
    requires: ['aggregate'],
    async run({ provider, readableType, now }) {
      if (!readableType) return;
      const fn = TYPE_MAPPINGS[readableType].aggregate.find((f) => f === 'sum' || f === 'avg' || f === 'min' || f === 'max');
      if (!fn) return;
      await rejectsWith('INVALID_ARGUMENT', () => provider.aggregate(readableType, { start: new Date(now - DAY), end: new Date(now), fn, field: '__not_a_field__' }), 'unknown aggregate field');
    },
  },
  {
    id: 'aggregate-buckets-follow-dst',
    clause: 'SPEC §6.2',
    title: 'day buckets across a DST change stay contiguous and follow the wall clock (or the zone is NOT_SUPPORTED)',
    requires: ['aggregate'],
    async run({ provider, readableType }) {
      if (!readableType) return;
      const fn = TYPE_MAPPINGS[readableType].aggregate[0];
      if (!fn) return;
      // 8 March 2026: clocks in New York spring forward, so that day is 23 hours long.
      const query = { start: new Date('2026-03-07T12:00:00Z'), end: new Date('2026-03-09T12:00:00Z'), fn, bucket: 'day' as const, zone: 'America/New_York' };
      let buckets;
      try {
        buckets = await provider.aggregate(readableType, query);
      } catch (e) {
        // A platform may aggregate in the device zone only; it must say so rather than return device-zone buckets.
        assert(isHealthError(e) && (e.code === 'NOT_SUPPORTED' || e.code === 'PERMISSION_DENIED'), `unexpected ${isHealthError(e) ? e.code : String(e)}`);
        return;
      }
      assert(buckets.length === 3, `expected 3 day buckets, got ${buckets.length}`);
      for (let i = 1; i < buckets.length; i++) assert(buckets[i]!.start === buckets[i - 1]!.end, 'buckets must be contiguous');
      const dstDay = buckets[1]!;
      assert(Date.parse(dstDay.end) - Date.parse(dstDay.start) === 23 * HOUR, `the DST day bucket spans ${(Date.parse(dstDay.end) - Date.parse(dstDay.start)) / HOUR} hours, expected 23`);
    },
  },
  {
    id: 'healthkit-read-status-is-unknown',
    clause: 'SPEC §3.1',
    title: 'a HealthKit provider reports every read permission as unknown',
    async run({ provider, readableType }) {
      if (provider.platform !== 'ios' || !readableType) return;
      const result = await provider.getPermissions([readableType]);
      assert(result.read[readableType] === 'unknown', `read status for "${readableType}" is "${String(result.read[readableType])}"; HealthKit never reveals it`);
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

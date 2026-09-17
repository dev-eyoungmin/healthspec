import { TYPE_MAPPINGS, type AggregateFn, type HealthRecord, type HealthType } from '@healthspec/schema';
import { invalidArgument, notSupported } from './errors.js';
import { assertRange, bucketRanges, defaultZone, toIso } from './time.js';
import type { AggregateQuery, AggregateResult } from './types.js';

/** The value field aggregated by default: the type's first numeric field in schema order. */
export function primaryField(type: HealthType): string | undefined {
  return Object.keys(TYPE_MAPPINGS[type].fieldUnits)[0];
}

export function assertAggregateSupported(type: HealthType, fn: AggregateFn): void {
  if (!TYPE_MAPPINGS[type].aggregate.includes(fn)) throw notSupported(`"${type}" does not support aggregate "${fn}"`);
}

const NUMERIC_FNS: ReadonlySet<AggregateFn> = new Set(['sum', 'avg', 'min', 'max']);

/**
 * Reference aggregation over already-fetched records (SPEC §6). Used by MockProvider and the conformance suite.
 * Buckets are aligned (§6.2), but a bucket's value covers only its part inside [start, end): a record counts in
 * the bucket containing its `start`, and only when that start is inside the range. No cross-source
 * de-duplication is performed — callers pass one source's records or accept the over-count documented in §6.3.
 */
export function aggregateRecords(type: HealthType, records: readonly HealthRecord[], query: AggregateQuery): AggregateResult[] {
  assertAggregateSupported(type, query.fn);
  const { startMs, endMs } = assertRange(query.start, query.end);
  const zone = query.zone ?? defaultZone();
  const field = query.field ?? primaryField(type);
  if (NUMERIC_FNS.has(query.fn)) {
    if (!field) throw notSupported(`"${type}" has no numeric field to aggregate`);
    if (!(field in TYPE_MAPPINGS[type].fieldUnits)) throw invalidArgument(`"${field}" is not a numeric field of "${type}"`);
  }

  const overlaps = (r: HealthRecord) => {
    const s = Date.parse(r.start);
    const e = Date.parse(r.end);
    return s === e ? s >= startMs && s < endMs : e > startMs && s < endMs;
  };
  const inRange = records.filter((r) => r.type === type && overlaps(r));
  const ranges = query.bucket ? bucketRanges(startMs, endMs, query.bucket, zone) : [{ start: startMs, end: endMs }];

  return ranges.map((range) => {
    const from = Math.max(range.start, startMs);
    const to = Math.min(range.end, endMs);
    const rs = inRange.filter((r) => {
      const s = Date.parse(r.start);
      return s >= from && s < to;
    });
    let value: number | null = null;
    if (rs.length > 0) {
      switch (query.fn) {
        case 'count':
          value = rs.length;
          break;
        case 'duration':
          value = rs.reduce((acc, r) => acc + (Date.parse(r.end) - Date.parse(r.start)), 0) / 1000;
          break;
        default: {
          const nums = rs.map((r) => (r.value as Record<string, unknown>)[field as string]).filter((n): n is number => typeof n === 'number');
          if (nums.length > 0) {
            const sum = nums.reduce((a, b) => a + b, 0);
            value = query.fn === 'sum' ? sum : query.fn === 'avg' ? sum / nums.length : query.fn === 'min' ? Math.min(...nums) : Math.max(...nums);
          }
        }
      }
    }
    return { start: toIso(range.start), end: toIso(range.end), value, count: rs.length };
  });
}

import type { HealthRecordOf, HealthType } from '@healthspec/schema';
import type { HealthStore } from './store.js';
import { DAY, assertRange, toIso, toMs } from './time.js';
import type { ReadQuery } from './types.js';

/**
 * Reading a wide range in one call is how apps run out of memory: a year of heart rate on HealthKit is hundreds
 * of thousands of samples, and they all cross the bridge into one array. `readChunks` walks the range in windows
 * and yields a page at a time, so only one window is ever in memory.
 *
 * Records that straddle a window boundary are returned whole in each window they overlap (SPEC §5.1), so they are
 * de-duplicated here — only ids that can still reappear are remembered, not every id seen.
 */

export interface ChunkOptions {
  /** Window length in milliseconds. Default 7 days — shorter for dense types, longer for sparse ones. */
  window?: number;
  /** Stop after this many records in total. Defaults to the query's own `limit`, which caps the walk, not each window. */
  limit?: number;
  /** Checked between windows; an aborted read stops rather than throwing. */
  signal?: { aborted: boolean };
}

/**
 * Yields the records in `[start, end)` a window at a time, in the requested order (`asc` by default).
 *
 * ```ts
 * for await (const page of readChunks(store, 'heart_rate', { start, end })) {
 *   await db.insertMany(page); // one week of samples, not a year
 * }
 * ```
 */
export async function* readChunks<T extends HealthType>(
  store: HealthStore,
  type: T,
  query: ReadQuery,
  options: ChunkOptions = {},
): AsyncGenerator<HealthRecordOf<T>[], void, undefined> {
  const { startMs, endMs } = assertRange(query.start, query.end);
  const window = options.window ?? 7 * DAY;
  if (!Number.isFinite(window) || window <= 0) throw new RangeError('window must be a positive number of milliseconds');
  const descending = query.order === 'desc';
  const limit = options.limit ?? query.limit;
  // The caller's `limit` counts across windows, so each window is read without one.
  const { limit: _total, ...windowQuery } = query;

  /** Ids that can still come back in a later window, with the boundary they reach past. */
  const straddling = new Map<string, number>();
  let emitted = 0;

  for (let i = 0; ; i++) {
    const from = descending ? Math.max(startMs, endMs - (i + 1) * window) : Math.min(endMs, startMs + i * window);
    const to = descending ? Math.max(startMs, endMs - i * window) : Math.min(endMs, startMs + (i + 1) * window);
    if (from >= to) break;
    if (options.signal?.aborted) return;

    const page: HealthRecordOf<T>[] = [];
    for (const record of await store.read(type, { ...windowQuery, start: toIso(from), end: toIso(to) })) {
      if (straddling.has(record.id)) continue;
      page.push(record);
      // It reappears in the next window only if it reaches past this window's far edge.
      const edge = descending ? toMs(record.start) : toMs(record.end);
      if (descending ? edge < from : edge > to) straddling.set(record.id, edge);
      if (limit !== undefined && emitted + page.length >= limit) break;
    }
    // Everything that can no longer overlap is forgotten, so this stays bounded by the records on one boundary.
    for (const [id, edge] of straddling) if (descending ? edge >= from : edge <= to) straddling.delete(id);

    emitted += page.length;
    if (page.length) yield page;
    if (limit !== undefined && emitted >= limit) return;
  }
}

/** The same walk, collected. Convenient for a range too wide for one call but small enough to hold. */
export async function readAll<T extends HealthType>(
  store: HealthStore,
  type: T,
  query: ReadQuery,
  options: ChunkOptions = {},
): Promise<HealthRecordOf<T>[]> {
  const all: HealthRecordOf<T>[] = [];
  for await (const page of readChunks(store, type, query, options)) all.push(...page);
  return all;
}

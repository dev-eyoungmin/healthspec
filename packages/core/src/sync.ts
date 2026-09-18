import type { HealthType } from '@healthspec/schema';
import { isHealthError } from './errors.js';
import type { HealthStore } from './store.js';
import type { ChangeSet } from './types.js';

/**
 * Incremental sync: the loop every app that mirrors health data writes, with the parts that are easy to get
 * wrong already decided.
 *
 * A cursor is only stored after the batch it describes has been handled, so a crash repeats a batch rather than
 * losing one — deliveries are at least once, and handlers must be idempotent (record ids make that easy). An
 * expired cursor (Health Connect tokens last 30 days) resyncs from scratch and says so, so a mirror can be
 * rebuilt rather than silently diverge.
 */

/** The slice of AsyncStorage / expo-sqlite / localStorage this needs. */
export interface CursorStorage {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem?(key: string): Promise<void> | void;
}

export interface SyncBatch<T extends HealthType = HealthType> {
  type: T;
  upserts: ChangeSet<T>['upserts'];
  deletes: string[];
  /** The cursor expired (or there was none): `upserts` is the whole history, not a delta. */
  resynced: boolean;
}

export interface SyncOptions {
  store: HealthStore;
  /** Types to sync. Types this provider does not support are skipped, not an error. */
  types: readonly HealthType[];
  storage: CursorStorage;
  /** Storage key prefix. Default `healthspec.cursor.`; include a user id when several accounts share a device. */
  keyPrefix?: string;
  /** Handles one type's changes. Throwing keeps the cursor where it was, so the batch arrives again. */
  onBatch: (batch: SyncBatch) => Promise<void> | void;
}

export interface SyncReport {
  batches: SyncBatch[];
  /** Types that failed; their cursors were not advanced, so the next run tries again. */
  failures: Array<{ type: HealthType; error: unknown }>;
  skipped: HealthType[];
}

/**
 * Syncs each type once and reports what happened. Call it on launch, when the app comes back to the foreground,
 * from a `subscribe` handler, or from a background task.
 */
export async function syncTypes(options: SyncOptions): Promise<SyncReport> {
  const { store, storage, onBatch } = options;
  const prefix = options.keyPrefix ?? 'healthspec.cursor.';
  const supported = new Set(store.capabilities().changes ? store.supportedTypes(options.types) : []);
  const report: SyncReport = { batches: [], failures: [], skipped: options.types.filter((t) => !supported.has(t)) };

  for (const type of options.types) {
    if (!supported.has(type)) continue;
    const key = prefix + type;
    try {
      // An empty string means "no cursor" for storages that cannot remove a key.
      const stored = (await storage.getItem(key)) || undefined;
      const { changes, resynced } = await store.sync(type, stored);
      const batch: SyncBatch = { type, upserts: changes.upserts, deletes: changes.deletes, resynced: resynced || changes.snapshot };
      await onBatch(batch);
      // Only now: if the handler threw, this type starts from the same cursor next time.
      await storage.setItem(key, changes.cursor);
      report.batches.push(batch);
    } catch (error) {
      report.failures.push({ type, error });
    }
  }
  return report;
}

/** Forget the stored cursors, so the next sync starts from a full snapshot. */
export async function resetCursors(options: Pick<SyncOptions, 'storage' | 'types' | 'keyPrefix'>): Promise<void> {
  const prefix = options.keyPrefix ?? 'healthspec.cursor.';
  for (const type of options.types) {
    const key = prefix + type;
    if (options.storage.removeItem) await options.storage.removeItem(key);
    else await options.storage.setItem(key, '');
  }
}

/** True when an error means the cursor could not be resumed. `syncTypes` handles it; direct callers may not. */
export const isCursorExpired = (error: unknown): boolean => isHealthError(error) && error.code === 'CURSOR_EXPIRED';

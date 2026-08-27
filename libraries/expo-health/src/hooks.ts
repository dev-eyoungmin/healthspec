import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Cursor, HealthRecordOf, HealthType } from '@healthspec/schema';
import type { AggregateQuery, AggregateResult, ChangeSet, HealthError, PermissionRequest, PermissionResult, ReadQuery } from '@healthspec/core';
import { toHealthError } from './errors.js';
import { HealthStore } from './store.js';

export interface AsyncState<T> {
  data: T | undefined;
  error: HealthError | undefined;
  loading: boolean;
}

/** Stable identity for query objects (Dates become ISO strings). */
const keyOf = (value: unknown): string => JSON.stringify(value, (_k, v: unknown) => (v instanceof Date ? v.toISOString() : v));

export function useHealthStore(store?: HealthStore): HealthStore {
  return useMemo(() => store ?? HealthStore.default(), [store]);
}

export function useHealthPermissions(request: PermissionRequest, options: { store?: HealthStore; auto?: boolean } = {}) {
  const store = useHealthStore(options.store);
  const [state, setState] = useState<AsyncState<PermissionResult>>({ data: undefined, error: undefined, loading: false });
  const latest = useRef(request);
  latest.current = request;
  const key = keyOf(request);
  const run = useCallback(async (): Promise<PermissionResult> => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await store.requestPermissions(latest.current);
      setState({ data, error: undefined, loading: false });
      return data;
    } catch (e) {
      const error = toHealthError(e);
      setState({ data: undefined, error, loading: false });
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands in for the request object
  }, [store, key]);
  useEffect(() => {
    if (options.auto) run().catch(() => undefined);
  }, [run, options.auto]);
  return { ...state, request: run };
}

export function useHealthQuery<T extends HealthType>(type: T, query: ReadQuery | null, options: { store?: HealthStore; live?: boolean } = {}) {
  const store = useHealthStore(options.store);
  const [state, setState] = useState<AsyncState<HealthRecordOf<T>[]>>({ data: undefined, error: undefined, loading: query !== null });
  const latest = useRef(query);
  latest.current = query;
  const key = keyOf(query);
  const refetch = useCallback(async () => {
    const q = latest.current;
    if (!q) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await store.read(type, q);
      setState({ data, error: undefined, loading: false });
    } catch (e) {
      setState({ data: undefined, error: toHealthError(e), loading: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands in for the query object
  }, [store, type, key]);
  useEffect(() => {
    void refetch();
  }, [refetch]);
  useEffect(() => {
    if (!options.live || !latest.current) return undefined;
    try {
      return store.subscribe([type], () => void refetch());
    } catch {
      return undefined;
    }
  }, [store, type, options.live, refetch]);
  return { ...state, refetch };
}

export function useHealthAggregate(type: HealthType, query: AggregateQuery | null, options: { store?: HealthStore; live?: boolean } = {}) {
  const store = useHealthStore(options.store);
  const [state, setState] = useState<AsyncState<AggregateResult[]>>({ data: undefined, error: undefined, loading: query !== null });
  const latest = useRef(query);
  latest.current = query;
  const key = keyOf(query);
  const refetch = useCallback(async () => {
    const q = latest.current;
    if (!q) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await store.aggregate(type, q);
      setState({ data, error: undefined, loading: false });
    } catch (e) {
      setState({ data: undefined, error: toHealthError(e), loading: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands in for the query object
  }, [store, type, key]);
  useEffect(() => {
    void refetch();
  }, [refetch]);
  useEffect(() => {
    if (!options.live || !latest.current) return undefined;
    try {
      return store.subscribe([type], () => void refetch());
    } catch {
      return undefined;
    }
  }, [store, type, options.live, refetch]);
  return { ...state, refetch };
}

/** Incremental sync helper: keeps the cursor, exposes `sync()`, and resyncs transparently when the cursor expires. */
export function useHealthChanges<T extends HealthType>(type: T, options: { store?: HealthStore; cursor?: Cursor; live?: boolean } = {}) {
  const store = useHealthStore(options.store);
  const [cursor, setCursor] = useState<Cursor | undefined>(options.cursor);
  const cursorRef = useRef(cursor);
  cursorRef.current = cursor;
  const [state, setState] = useState<AsyncState<ChangeSet<T>> & { resynced: boolean }>({ data: undefined, error: undefined, loading: false, resynced: false });
  const sync = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const { changes, resynced } = await store.sync(type, cursorRef.current);
      setCursor(changes.cursor);
      setState({ data: changes, error: undefined, loading: false, resynced });
      return changes;
    } catch (e) {
      setState((s) => ({ ...s, error: toHealthError(e), loading: false }));
      throw toHealthError(e);
    }
  }, [store, type]);
  useEffect(() => {
    if (!options.live) return undefined;
    try {
      return store.subscribe([type], () => sync().catch(() => undefined));
    } catch {
      return undefined;
    }
  }, [store, type, options.live, sync]);
  return { ...state, cursor, sync };
}

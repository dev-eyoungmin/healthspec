/**
 * The hooks, rendered. They are most of the API an app actually types, and the bugs they can have — a stale
 * response overwriting a newer one, a setState after unmount, two syncs sharing a cursor — only appear when
 * something renders them.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement, type ReactNode } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { HealthStore, MockProvider, type Provider } from '@healthspec/core';
import { useHealthAggregate, useHealthChanges, useHealthPermissions, useHealthQuery } from '../src/hooks.js';

const NOW = Date.parse('2026-08-21T10:00:00Z');
const DAY = 86_400_000;
const range = { start: new Date(NOW - DAY), end: new Date(NOW) };

/** Renders a hook with props, records every state it went through, and can re-render it with new props. */
function renderHook<P, T>(hook: (props: P) => T, initial: P) {
  const states: T[] = [];
  const Probe = ({ props }: { props: P }): ReactNode => {
    states.push(hook(props));
    return null;
  };
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(createElement(Probe, { props: initial }));
  });
  const wait = async (ms: number) => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, ms));
    });
  };
  return {
    states,
    latest: () => states[states.length - 1] as T,
    settle: () => wait(0),
    wait,
    rerender: (props: P) => act(() => renderer.update(createElement(Probe, { props }))),
    unmount: () => act(() => renderer.unmount()),
  };
}

const store = (options: ConstructorParameters<typeof MockProvider>[0] = {}) => new HealthStore(new MockProvider({ now: () => NOW, seed: 5, days: 3, ...options }));

test('useHealthQuery loads, exposes errors as HealthError, and refetches', async () => {
  const s = store();
  await s.requestPermissions({ read: ['steps'] });
  const hook = renderHook(() => useHealthQuery('steps', range, { store: s }), null);
  assert.equal(hook.latest().loading, true);
  await hook.settle();
  assert.ok((hook.latest().data?.length ?? 0) > 0);
  assert.equal(hook.latest().error, undefined);

  const denied = store({ permissionPolicy: 'deny', platform: 'android' });
  const failing = renderHook(() => useHealthQuery('steps', range, { store: denied }), null);
  await failing.settle();
  assert.equal(failing.latest().error?.code, 'PERMISSION_DENIED');
  assert.equal(failing.latest().data, undefined);
  hook.unmount();
  failing.unmount();
});

test('a slow earlier query never overwrites a newer one', async () => {
  const s = store();
  await s.requestPermissions({ read: ['steps', 'weight'] });
  const provider = s.provider as Provider;
  const read = provider.read.bind(provider);
  const delays: Record<string, number> = { steps: 30, weight: 0 };
  // The first query answers last, as a wide range would on a device.
  provider.read = (async (type, query) => {
    await new Promise((resolve) => setTimeout(resolve, delays[type] ?? 0));
    return read(type, query);
  }) as Provider['read'];

  const hook = renderHook((type: 'steps' | 'weight') => useHealthQuery(type, range, { store: s }), 'steps');
  hook.rerender('weight');
  await hook.wait(60);
  const data = hook.latest().data ?? [];
  assert.ok(
    data.every((record) => record.type === 'weight'),
    `expected only weight records, got ${[...new Set(data.map((r) => r.type))].join(', ')}`,
  );
  hook.unmount();
});

test('useHealthAggregate buckets, and useHealthPermissions reports what was granted', async () => {
  const s = store();
  await s.requestPermissions({ read: ['steps'] });
  const aggregate = renderHook(() => useHealthAggregate('steps', { ...range, fn: 'sum', bucket: 'day', zone: 'UTC' }, { store: s }), null);
  await aggregate.settle();
  assert.equal(aggregate.latest().data?.length, 2);
  aggregate.unmount();

  const permissions = renderHook(() => useHealthPermissions({ read: ['steps'], write: ['weight'] }, { store: s, auto: true }), null);
  await permissions.settle();
  assert.equal(permissions.latest().data?.read.steps, 'unknown', 'the mock follows HealthKit semantics by default');
  assert.equal(permissions.latest().data?.write.weight, 'granted');
  permissions.unmount();
});

test('useHealthChanges keeps its cursor, and overlapping syncs do not repeat changes', async () => {
  const mock = new MockProvider({ now: () => NOW, seed: false });
  const s = new HealthStore(mock);
  await s.requestPermissions({ read: ['weight'], write: ['weight'] });
  const hook = renderHook(() => useHealthChanges('weight', { store: s }), null);
  await act(async () => {
    await hook.latest().sync();
  });
  const first = hook.latest().cursor;
  assert.ok(first, 'a snapshot returns a cursor');

  const [written] = await s.write([{ type: 'weight', start: '2026-08-21T09:00:00Z', end: '2026-08-21T09:00:00Z', value: { kilograms: 70 } }]);
  let both: Array<string[]> = [];
  await act(async () => {
    // Two syncs started together must not both report the same record.
    const results = await Promise.all([hook.latest().sync(), hook.latest().sync()]);
    both = results.map((r) => r.upserts.map((u) => u.id));
  });
  assert.deepEqual(both[0], [written!.id]);
  assert.deepEqual(both[1], [], 'the second sync resumes from the cursor the first returned');
  assert.notEqual(hook.latest().cursor, first, 'the cursor advances');
  hook.unmount();
});

test('a response arriving after unmount is dropped', async () => {
  const s = store();
  await s.requestPermissions({ read: ['steps'] });
  const provider = s.provider as Provider;
  const read = provider.read.bind(provider);
  provider.read = (async (type, query) => {
    await new Promise((resolve) => setTimeout(resolve, 20));
    return read(type, query);
  }) as Provider['read'];
  const hook = renderHook(() => useHealthQuery('steps', range, { store: s }), null);
  hook.unmount();
  const renders = hook.states.length;
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
  });
  assert.equal(hook.states.length, renders, 'no state update after unmount');
});

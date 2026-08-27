import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bucketRanges, isHealthError, nextBucketStart, startOfBucket, toMs, zonedParts, zonedToMs } from '../src/index.js';

const iso = (ms: number) => new Date(ms).toISOString();

test('zonedParts reads wall-clock time and offset in a zone', () => {
  const p = zonedParts(Date.parse('2026-08-21T10:00:00Z'), 'Asia/Seoul');
  assert.deepEqual({ y: p.year, m: p.month, d: p.day, h: p.hour, wd: p.weekday, off: p.offsetMs }, { y: 2026, m: 8, d: 21, h: 19, wd: 5, off: 9 * 3600_000 });
  assert.equal(zonedToMs(2026, 8, 21, 19, 0, 0, 'Asia/Seoul'), Date.parse('2026-08-21T10:00:00Z'));
});

test('day/week/month bucket starts in Asia/Seoul', () => {
  const t = Date.parse('2026-08-21T10:00:00Z'); // Fri 21 Aug 19:00 KST
  assert.equal(iso(startOfBucket(t, 'hour', 'Asia/Seoul')), '2026-08-21T10:00:00.000Z');
  assert.equal(iso(startOfBucket(t, 'day', 'Asia/Seoul')), '2026-08-20T15:00:00.000Z');
  assert.equal(iso(startOfBucket(t, 'week', 'Asia/Seoul')), '2026-08-16T15:00:00.000Z', 'Monday 17 Aug 00:00 KST');
  assert.equal(iso(startOfBucket(t, 'month', 'Asia/Seoul')), '2026-07-31T15:00:00.000Z');
});

test('DST transition in America/New_York yields a 23-hour day bucket', () => {
  const t = Date.parse('2026-03-08T12:00:00Z'); // DST starts 2026-03-08 02:00 local
  const start = startOfBucket(t, 'day', 'America/New_York');
  const end = nextBucketStart(start, 'day', 'America/New_York');
  assert.equal(iso(start), '2026-03-08T05:00:00.000Z', 'midnight EST');
  assert.equal(iso(end), '2026-03-09T04:00:00.000Z', 'midnight EDT');
  assert.equal((end - start) / 3600_000, 23);
});

test('bucketRanges covers the query range with aligned, contiguous buckets', () => {
  const ranges = bucketRanges(Date.parse('2026-08-19T03:00:00Z'), Date.parse('2026-08-21T10:00:00Z'), 'day', 'Asia/Seoul');
  assert.equal(ranges.length, 3);
  assert.equal(iso(ranges[0]!.start), '2026-08-18T15:00:00.000Z');
  for (let i = 1; i < ranges.length; i++) assert.equal(ranges[i]!.start, ranges[i - 1]!.end);
  assert.ok(ranges[ranges.length - 1]!.end >= Date.parse('2026-08-21T10:00:00Z'));
  assert.equal(bucketRanges(Date.parse('2026-01-01T00:00:00Z'), Date.parse('2026-04-01T00:00:00Z'), 'month', 'UTC').length, 3);
});

test('invalid dates and zones are INVALID_ARGUMENT', () => {
  assert.throws(() => toMs('yesterday'), (e: unknown) => isHealthError(e) && e.code === 'INVALID_ARGUMENT');
  assert.throws(() => zonedParts(0, 'Mars/Olympus'), (e: unknown) => isHealthError(e) && e.code === 'INVALID_ARGUMENT');
});

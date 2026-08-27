import type { TimeBucket } from '@healthspec/schema';
import { invalidArgument } from './errors.js';
import type { Instant } from './types.js';

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export function toMs(instant: Instant, label = 'instant'): number {
  const ms = instant instanceof Date ? instant.getTime() : Date.parse(instant);
  if (Number.isNaN(ms)) throw invalidArgument(`${label} is not a valid date`);
  return ms;
}

export const toIso = (ms: number): string => new Date(ms).toISOString();

export function assertRange(start: Instant, end: Instant): { startMs: number; endMs: number } {
  const startMs = toMs(start, 'start');
  const endMs = toMs(end, 'end');
  if (endMs < startMs) throw invalidArgument('end must not be before start');
  return { startMs, endMs };
}

export function defaultZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export interface ZonedParts {
  year: number;
  /** 1–12 */
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
  /** zone offset at this instant, in ms (e.g. +09:00 → 32 400 000) */
  offsetMs: number;
}

const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(zone: string): Intl.DateTimeFormat {
  let f = formatters.get(zone);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hourCycle: 'h23',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'short',
      });
    } catch {
      throw invalidArgument(`unknown time zone "${zone}"`);
    }
    formatters.set(zone, f);
  }
  return f;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Wall-clock parts of an instant in a zone. Uses Intl only — no tz database shipped. */
export function zonedParts(ms: number, zone: string): ZonedParts {
  const parts = formatter(zone).formatToParts(new Date(ms));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const year = Number(get('year'));
  const month = Number(get('month'));
  const day = Number(get('day'));
  const hour = Number(get('hour')) % 24;
  const minute = Number(get('minute'));
  const second = Number(get('second'));
  const weekday = Math.max(0, WEEKDAYS.indexOf(get('weekday')));
  const offsetMs = Date.UTC(year, month - 1, day, hour, minute, second) - Math.floor(ms / SECOND) * SECOND;
  return { year, month, day, hour, minute, second, weekday, offsetMs };
}

/** Instant for a wall-clock time in a zone. Handles DST by re-checking the offset once. */
export function zonedToMs(year: number, month: number, day: number, hour: number, minute: number, second: number, zone: string): number {
  const guess = Date.UTC(year, month - 1, day, hour, minute, second);
  const off1 = zonedParts(guess, zone).offsetMs;
  let result = guess - off1;
  const off2 = zonedParts(result, zone).offsetMs;
  if (off2 !== off1) result = guess - off2;
  return result;
}

/** Start of the bucket containing `ms`. Weeks start on Monday (SPEC §6.2). */
export function startOfBucket(ms: number, bucket: TimeBucket, zone: string): number {
  const p = zonedParts(ms, zone);
  switch (bucket) {
    case 'hour':
      return zonedToMs(p.year, p.month, p.day, p.hour, 0, 0, zone);
    case 'day':
      return zonedToMs(p.year, p.month, p.day, 0, 0, 0, zone);
    case 'week': {
      const back = (p.weekday + 6) % 7; // days since Monday
      return zonedToMs(p.year, p.month, p.day - back, 0, 0, 0, zone);
    }
    case 'month':
      return zonedToMs(p.year, p.month, 1, 0, 0, 0, zone);
  }
}

/** Start of the bucket after the one starting at `bucketStart`. */
export function nextBucketStart(bucketStart: number, bucket: TimeBucket, zone: string): number {
  const p = zonedParts(bucketStart, zone);
  switch (bucket) {
    case 'hour':
      return zonedToMs(p.year, p.month, p.day, p.hour + 1, 0, 0, zone);
    case 'day':
      return zonedToMs(p.year, p.month, p.day + 1, 0, 0, 0, zone);
    case 'week':
      return zonedToMs(p.year, p.month, p.day + 7, 0, 0, 0, zone);
    case 'month':
      return zonedToMs(p.year, p.month + 1, 1, 0, 0, 0, zone);
  }
}

export interface BucketRange {
  start: number;
  end: number;
}

/** Aligned buckets covering [startMs, endMs). The first bucket may begin before startMs and the last may end after endMs. */
export function bucketRanges(startMs: number, endMs: number, bucket: TimeBucket, zone: string): BucketRange[] {
  const out: BucketRange[] = [];
  let s = startOfBucket(startMs, bucket, zone);
  while (s < endMs) {
    const e = nextBucketStart(s, bucket, zone);
    if (e <= s) throw new Error(`bucket did not advance at ${toIso(s)} (${zone})`);
    out.push({ start: s, end: e });
    s = e;
  }
  return out;
}

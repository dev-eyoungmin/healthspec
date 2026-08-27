import type { Cursor } from '@healthspec/schema';
import { invalidArgument } from './errors.js';

/** What a cursor string carries. `t` is the provider's native token (HealthKit anchor, Health Connect changes token, …). */
export interface CursorPayload {
  v: 1;
  /** provider id */
  p: string;
  /** native token */
  t: string;
  /** issued at, epoch ms */
  at: number;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function utf8Encode(s: string): number[] {
  const bytes: number[] = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp < 0x80) bytes.push(cp);
    else if (cp < 0x800) bytes.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
    else if (cp < 0x10000) bytes.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    else bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
  }
  return bytes;
}

function utf8Decode(bytes: number[]): string {
  let s = '';
  for (let i = 0; i < bytes.length; ) {
    const b = bytes[i] ?? 0;
    let cp: number;
    let n: number;
    if (b < 0x80) [cp, n] = [b, 1];
    else if (b >> 5 === 6) [cp, n] = [b & 31, 2];
    else if (b >> 4 === 14) [cp, n] = [b & 15, 3];
    else [cp, n] = [b & 7, 4];
    for (let j = 1; j < n; j++) cp = (cp << 6) | ((bytes[i + j] ?? 0) & 63);
    s += String.fromCodePoint(cp);
    i += n;
  }
  return s;
}

/** base64url without padding; implemented locally because RN runtimes disagree on atob/btoa/TextEncoder. */
export function base64UrlEncode(s: string): string {
  const bytes = utf8Encode(s);
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    const n = (b0 << 16) | ((b1 ?? 0) << 8) | (b2 ?? 0);
    out += ALPHABET[(n >> 18) & 63];
    out += ALPHABET[(n >> 12) & 63];
    if (b1 !== undefined) out += ALPHABET[(n >> 6) & 63];
    if (b2 !== undefined) out += ALPHABET[n & 63];
  }
  return out;
}

export function base64UrlDecode(s: string): string {
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const ch of s) {
    const v = ALPHABET.indexOf(ch);
    if (v < 0) throw new Error('invalid base64url character');
    buffer = ((buffer << 6) | v) & 0x3ffff;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 255);
    }
  }
  return utf8Decode(bytes);
}

export function encodeCursor(payload: Omit<CursorPayload, 'v'>): Cursor {
  return base64UrlEncode(JSON.stringify({ v: 1, ...payload })) as Cursor;
}

const isPayload = (x: unknown): x is CursorPayload =>
  typeof x === 'object' && x !== null && (x as CursorPayload).v === 1 && typeof (x as CursorPayload).p === 'string' && typeof (x as CursorPayload).t === 'string' && typeof (x as CursorPayload).at === 'number';

/** Decode a cursor, verifying it belongs to `expectedProvider` when given. Throws INVALID_ARGUMENT, never CURSOR_EXPIRED — expiry is the provider's call. */
export function decodeCursor(cursor: unknown, expectedProvider?: string): CursorPayload {
  if (typeof cursor !== 'string' || cursor.length === 0) throw invalidArgument('cursor must be a non-empty string');
  let parsed: unknown;
  try {
    parsed = JSON.parse(base64UrlDecode(cursor));
  } catch {
    throw invalidArgument('cursor is malformed');
  }
  if (!isPayload(parsed)) throw invalidArgument('cursor is malformed');
  if (expectedProvider !== undefined && parsed.p !== expectedProvider) {
    throw invalidArgument(`cursor belongs to provider "${parsed.p}", not "${expectedProvider}"`);
  }
  return parsed;
}

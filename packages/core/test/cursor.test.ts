import assert from 'node:assert/strict';
import { test } from 'node:test';
import { base64UrlDecode, base64UrlEncode, decodeCursor, encodeCursor, isHealthError } from '../src/index.js';

test('base64url round-trips ASCII and non-ASCII text without padding', () => {
  for (const s of ['', 'a', 'ab', 'abc', 'abcd', '{"t":"AQID"}', '한글 🩺 token', 'x'.repeat(300)]) {
    const enc = base64UrlEncode(s);
    assert.doesNotMatch(enc, /[=+/]/);
    assert.equal(base64UrlDecode(enc), s);
  }
});

test('cursor encodes provider, token and issue time', () => {
  const c = encodeCursor({ p: 'apple', t: 'anchor-123', at: 1_700_000_000_000 });
  assert.deepEqual(decodeCursor(c), { v: 1, p: 'apple', t: 'anchor-123', at: 1_700_000_000_000 });
  assert.deepEqual(decodeCursor(c, 'apple').t, 'anchor-123');
});

test('malformed or foreign cursors are INVALID_ARGUMENT, never CURSOR_EXPIRED', () => {
  for (const bad of ['', 42, 'not-base64!', base64UrlEncode('{"v":2}'), base64UrlEncode('[]')]) {
    assert.throws(
      () => decodeCursor(bad),
      (e: unknown) => isHealthError(e) && e.code === 'INVALID_ARGUMENT',
      String(bad),
    );
  }
  const c = encodeCursor({ p: 'google', t: 'tok', at: 1 });
  assert.throws(() => decodeCursor(c, 'apple'), (e: unknown) => isHealthError(e) && e.code === 'INVALID_ARGUMENT' && /google/.test(e.message));
});

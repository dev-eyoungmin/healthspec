import { HealthError, isHealthError } from '@healthspec/core';
import type { HealthErrorCode } from '@healthspec/schema';

/** Native modules reject with these codes; anything else becomes PLATFORM_ERROR with the native error as cause. */
const NATIVE_CODES: Record<string, HealthErrorCode> = {
  E_NOT_AVAILABLE: 'NOT_AVAILABLE',
  E_NOT_SUPPORTED: 'NOT_SUPPORTED',
  E_PERMISSION_DENIED: 'PERMISSION_DENIED',
  E_AUTH_NOT_DETERMINED: 'PERMISSION_DENIED',
  E_CURSOR_EXPIRED: 'CURSOR_EXPIRED',
  E_INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  E_RATE_LIMITED: 'RATE_LIMITED',
};

export function toHealthError(e: unknown): HealthError {
  if (isHealthError(e)) return e;
  const code = typeof e === 'object' && e !== null && typeof (e as { code?: unknown }).code === 'string' ? (e as { code: string }).code : '';
  const message = e instanceof Error ? e.message : String(e);
  return new HealthError(NATIVE_CODES[code] ?? 'PLATFORM_ERROR', message, { cause: e });
}

/** Run a native call, translating rejections into HealthError. */
export async function native<T>(call: () => Promise<T>): Promise<T> {
  try {
    return await call();
  } catch (e) {
    throw toHealthError(e);
  }
}

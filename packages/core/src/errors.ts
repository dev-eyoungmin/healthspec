import type { HealthErrorCode } from '@healthspec/schema';

/** The only error type that crosses the provider boundary (SPEC §9). */
export class HealthError extends Error {
  readonly code: HealthErrorCode;

  constructor(code: HealthErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'HealthError';
    this.code = code;
  }
}

export const isHealthError = (e: unknown): e is HealthError => e instanceof HealthError;

export const invalidArgument = (message: string): HealthError => new HealthError('INVALID_ARGUMENT', message);
export const notSupported = (message: string): HealthError => new HealthError('NOT_SUPPORTED', message);
export const notAvailable = (message: string): HealthError => new HealthError('NOT_AVAILABLE', message);
export const permissionDenied = (message: string): HealthError => new HealthError('PERMISSION_DENIED', message);
export const cursorExpired = (message = 'cursor expired — perform a full resync'): HealthError => new HealthError('CURSOR_EXPIRED', message);

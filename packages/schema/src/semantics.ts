/**
 * API-level semantics shared by every HealthSpec provider. These are not data-schema concepts
 * (see generated/types.ts for those) but the vocabulary of the provider interface — see spec/SPEC.md.
 */

/** Status of one (type, access) permission. `unknown` is first-class: iOS never reveals whether a read grant exists. */
export type PermissionStatus = 'granted' | 'denied' | 'unknown';
export const PERMISSION_STATUSES = ['granted', 'denied', 'unknown'] as const;

export type AccessType = 'read' | 'write';
export const ACCESS_TYPES = ['read', 'write'] as const;

/** Cross-cutting capabilities requested alongside type permissions. */
export type Capability = 'background' | 'history' | 'profile';
export const CAPABILITIES = ['background', 'history', 'profile'] as const;

/** Whether the platform health store can be used on this device right now. */
export type Availability = 'available' | 'not_installed' | 'update_required' | 'not_supported';
export const AVAILABILITY_STATES = ['available', 'not_installed', 'update_required', 'not_supported'] as const;

export type HealthErrorCode =
  /** availability() is not 'available' */
  | 'NOT_AVAILABLE'
  /** the provider/platform does not support this type or operation (e.g. writing total_energy on iOS) */
  | 'NOT_SUPPORTED'
  /** the platform reported a definite denial (Android); never raised for iOS reads */
  | 'PERMISSION_DENIED'
  /** the sync cursor can no longer be resumed — perform a full resync */
  | 'CURSOR_EXPIRED'
  /** malformed query or record (fails schema validation, end < start, …) */
  | 'INVALID_ARGUMENT'
  /** platform throttled the call */
  | 'RATE_LIMITED'
  /** anything else; `cause` carries the native error */
  | 'PLATFORM_ERROR';
export const HEALTH_ERROR_CODES = ['NOT_AVAILABLE', 'NOT_SUPPORTED', 'PERMISSION_DENIED', 'CURSOR_EXPIRED', 'INVALID_ARGUMENT', 'RATE_LIMITED', 'PLATFORM_ERROR'] as const;

export type TimeBucket = 'hour' | 'day' | 'week' | 'month';
export const TIME_BUCKETS = ['hour', 'day', 'week', 'month'] as const;

/** Opaque, provider-specific sync position (HealthKit anchor / Health Connect changes token), serialised as a string. */
export type Cursor = string & { readonly __brand?: 'HealthSpecCursor' };

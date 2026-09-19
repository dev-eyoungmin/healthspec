import { TYPE_MAPPINGS } from './generated/mapping.js';
import { FIELD_PLATFORMS, TYPE_COUNTERPARTS, type Counterpart } from './generated/platform.js';
import { HEALTH_TYPES, type HealthType } from './generated/types.js';

/**
 * Which platform persists what, derived from the mappings rather than generated a second time: an app bundles
 * these tables, and the same facts twice is a table an app pays for twice.
 */

export type PlatformId = 'ios' | 'android';

export interface PlatformTypeSupport {
  supported: boolean;
  read: boolean;
  write: boolean;
  /** reachable through read()/write(); false when a dedicated operation is required (e.g. readRoute) */
  generic: boolean;
  /** minimum OS version, when newer than the library baseline */
  since?: string;
  notes?: string[];
}

export interface TypePlatforms {
  ios: PlatformTypeSupport;
  android: PlatformTypeSupport;
}

const UNSUPPORTED: PlatformTypeSupport = { supported: false, read: false, write: false, generic: false };

function support(mapping: { read: boolean; write: boolean; since?: string; notes?: string[]; special?: boolean; kind?: string } | undefined): PlatformTypeSupport {
  if (!mapping) return UNSUPPORTED;
  const entry: PlatformTypeSupport = {
    supported: true,
    read: mapping.read !== false,
    write: mapping.write === true,
    generic: !mapping.special && mapping.kind !== 'series' && mapping.kind !== 'special',
  };
  if (mapping.since) entry.since = mapping.since;
  if (mapping.notes?.length) entry.notes = mapping.notes;
  return entry;
}

export const TYPE_PLATFORMS: Record<HealthType, TypePlatforms> = Object.fromEntries(
  HEALTH_TYPES.map((type) => [type, { ios: support(TYPE_MAPPINGS[type].healthkit), android: support(TYPE_MAPPINGS[type].healthconnect) }]),
) as Record<HealthType, TypePlatforms>;

/** Types both platforms persist. */
export const CROSS_PLATFORM_TYPES: readonly HealthType[] = HEALTH_TYPES.filter((t) => TYPE_PLATFORMS[t].ios.supported && TYPE_PLATFORMS[t].android.supported);
/** Types only Apple HealthKit persists. */
export const IOS_ONLY_TYPES: readonly HealthType[] = HEALTH_TYPES.filter((t) => TYPE_PLATFORMS[t].ios.supported && !TYPE_PLATFORMS[t].android.supported);
/** Types only Android Health Connect persists. */
export const ANDROID_ONLY_TYPES: readonly HealthType[] = HEALTH_TYPES.filter((t) => !TYPE_PLATFORMS[t].ios.supported && TYPE_PLATFORMS[t].android.supported);

/** Platform support for one type, without needing a provider instance. */
export const platformSupport = (type: HealthType, platform: PlatformId): PlatformTypeSupport => TYPE_PLATFORMS[type][platform];

/**
 * Value fields this platform does not persist for a type it otherwise supports (SPEC §2.1) — Health Connect
 * records `cervical_mucus.sensation`, HealthKit does not. Empty for a type the platform does not support at all.
 */
export const unsupportedFields = (type: HealthType, platform: PlatformId): string[] =>
  TYPE_PLATFORMS[type][platform].supported ? Object.entries(FIELD_PLATFORMS[type] ?? {}).filter(([, on]) => !on[platform]).map(([field]) => field) : [];

/** Related types on the other platform. Check `interchangeable` before substituting one for the other. */
export const counterpartsOf = (type: HealthType): Counterpart[] => TYPE_COUNTERPARTS[type] ?? [];

export const isCrossPlatform = (type: HealthType): boolean => TYPE_PLATFORMS[type].ios.supported && TYPE_PLATFORMS[type].android.supported;

export type { Counterpart };

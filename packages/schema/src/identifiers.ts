import { TYPE_MAPPINGS } from './generated/mapping.js';
import { HEALTH_TYPES, type HealthType } from './generated/types.js';

/** Permission and identifier tables, derived from the mappings so apps bundle them once. */

export const HEALTH_CONNECT_PERMISSION_PREFIX = 'android.permission.health.';

/** Health Connect runtime permissions per type. Empty object when Health Connect does not support the type. */
export const HEALTH_CONNECT_PERMISSIONS: Record<HealthType, { read?: string; write?: string }> = Object.fromEntries(
  HEALTH_TYPES.map((type) => {
    const mapping = TYPE_MAPPINGS[type].healthconnect;
    const permissions: { read?: string; write?: string } = {};
    if (mapping?.read) permissions.read = `${HEALTH_CONNECT_PERMISSION_PREFIX}READ_${mapping.permission}`;
    if (mapping?.write) permissions.write = `${HEALTH_CONNECT_PERMISSION_PREFIX}WRITE_${mapping.permission}`;
    return [type, permissions];
  }),
) as Record<HealthType, { read?: string; write?: string }>;

/** Every HealthKit object type identifier a type needs authorization for. Empty when HealthKit lacks the type. */
export const HEALTHKIT_IDENTIFIERS: Record<HealthType, string[]> = Object.fromEntries(
  HEALTH_TYPES.map((type) => {
    const mapping = TYPE_MAPPINGS[type].healthkit;
    if (!mapping) return [type, []];
    const identifiers = [mapping.identifier, ...(mapping.identifiers ?? []), ...Object.values(mapping.fields ?? {})];
    return [type, [...new Set(identifiers.filter((id): id is string => Boolean(id)))]];
  }),
) as Record<HealthType, string[]>;

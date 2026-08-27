import type { SpecBundle } from './load.js';

/**
 * Permission tables for the Expo config plugin. Generated into the plugin so that the (CommonJS) plugin
 * never has to require the ESM @healthspec/schema package at config time.
 */
export function emitPluginPermissions(b: SpecBundle): string {
  const rows = b.types.map((t) => {
    const x = t.json['x-healthspec'];
    const hk = x.platforms?.healthkit;
    const hc = x.platforms?.healthconnect;
    const hkIds = new Set<string>();
    if (hk?.identifier) hkIds.add(hk.identifier);
    for (const i of hk?.identifiers ?? []) hkIds.add(i);
    for (const i of Object.values<string>(hk?.fields ?? {})) hkIds.add(i);
    return {
      type: t.json.title as string,
      healthkit: hk ? { identifiers: [...hkIds], write: Boolean(hk.write) } : null,
      healthconnect: hc
        ? {
            read: hc.read ? `android.permission.health.READ_${hc.permission}` : null,
            write: hc.write ? `android.permission.health.WRITE_${hc.permission}` : null,
          }
        : null,
    };
  });
  return `// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with \`pnpm codegen\`.

export type HealthType = ${rows.map((r) => JSON.stringify(r.type)).join(' | ')};

export interface TypePermissions {
  healthkit: { identifiers: string[]; write: boolean } | null;
  healthconnect: { read: string | null; write: string | null } | null;
}

export const HEALTH_TYPES: readonly HealthType[] = ${JSON.stringify(rows.map((r) => r.type))};

export const PERMISSIONS: Record<HealthType, TypePermissions> = ${JSON.stringify(Object.fromEntries(rows.map((r) => [r.type, { healthkit: r.healthkit, healthconnect: r.healthconnect }])), null, 2)};

export const HEALTH_CONNECT_BACKGROUND_PERMISSION = 'android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND';
export const HEALTH_CONNECT_HISTORY_PERMISSION = 'android.permission.health.READ_HEALTH_DATA_HISTORY';
`;
}

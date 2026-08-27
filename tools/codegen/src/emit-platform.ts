import { basename, type SpecBundle } from './load.js';

const HEADER = '// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.\n';

export type PlatformId = 'healthkit' | 'healthconnect';

interface TypeInfo {
  id: string;
  hk: any;
  hc: any;
  fields: Record<string, { properties: string[]; ios: boolean; android: boolean }>;
}

/**
 * Which value fields each platform actually persists.
 *
 * A mapping's `fields` map names the *measured* quantities the platform stores, so it is authoritative only for
 * properties carrying `x-unit`. Descriptive properties (mealType, title, bodyPosition, …) are not in it and
 * follow the type's own platform support unless the schema pins them with `x-platform`, which always wins.
 */
export function fieldSupport(t: any): Record<string, { ios: boolean; android: boolean }> {
  const x = t.json['x-healthspec'];
  const hk = x.platforms?.healthkit;
  const hc = x.platforms?.healthconnect;
  const hkFields = hk?.fields ? new Set(Object.keys(hk.fields)) : undefined;
  const hcFields = hc?.fields ? new Set(Object.keys(hc.fields)) : undefined;
  const out: Record<string, { ios: boolean; android: boolean }> = {};
  for (const [name, prop] of Object.entries<any>(t.json.properties ?? {})) {
    const explicit = prop['x-platform'] as PlatformId | undefined;
    if (explicit) {
      out[name] = { ios: explicit === 'healthkit', android: explicit === 'healthconnect' };
      continue;
    }
    const measured = prop['x-unit'] !== undefined;
    out[name] = {
      ios: Boolean(hk) && (measured && hkFields ? hkFields.has(name) : true),
      android: Boolean(hc) && (measured && hcFields ? hcFields.has(name) : true),
    };
  }
  return out;
}

const isReachable = (m: any): boolean => Boolean(m) && !m.special && m.kind !== 'series' && m.kind !== 'special';

export function emitPlatform(b: SpecBundle): string {
  const infos = b.types.map((t) => ({ t, id: t.json.title as string, x: t.json['x-healthspec'] }));
  const support = (x: any) => ({ hk: x.platforms?.healthkit, hc: x.platforms?.healthconnect });

  const cross: string[] = [];
  const iosOnly: string[] = [];
  const androidOnly: string[] = [];
  for (const { id, x } of infos) {
    const { hk, hc } = support(x);
    if (hk && hc) cross.push(id);
    else if (hk) iosOnly.push(id);
    else androidOnly.push(id);
  }

  const platforms = Object.fromEntries(
    infos.map(({ id, x }) => {
      const { hk, hc } = support(x);
      const entry = (m: any) =>
        m
          ? {
              supported: true,
              read: m.read !== false,
              write: m.write === true,
              /** false when the type needs a dedicated operation (routes) rather than read()/write() */
              generic: isReachable(m),
              ...(m.since ? { since: m.since } : {}),
              ...(m.notes?.length ? { notes: m.notes } : {}),
            }
          : { supported: false, read: false, write: false, generic: false };
      return [id, { ios: entry(hk), android: entry(hc), fields: fieldSupport(infos.find((i) => i.id === id)!.t) }];
    }),
  );

  const counterparts = Object.fromEntries(infos.filter(({ x }) => x.counterparts?.length).map(({ id, x }) => [id, x.counterparts]));

  const out: string[] = [HEADER];
  out.push(`import type { HealthType } from './types.js';\n`);
  out.push(`export type PlatformId = 'ios' | 'android';\n`);
  out.push(`export interface PlatformTypeSupport {
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
  /** value field → the platforms that persist it */
  fields: Record<string, { ios: boolean; android: boolean }>;
}

/**
 * A related type on the other platform. \`interchangeable: false\` means the values measure different things
 * and MUST NOT be converted or summed together — only used to point the developer at the right type.
 */
export interface Counterpart {
  type: HealthType;
  platform: 'healthkit' | 'healthconnect';
  interchangeable: boolean;
  reason: string;
}\n`);
  out.push(`/** Types both platforms persist (${cross.length}). */`);
  out.push(`export const CROSS_PLATFORM_TYPES = ${JSON.stringify(cross)} as const;`);
  out.push(`export type CrossPlatformType = (typeof CROSS_PLATFORM_TYPES)[number];\n`);
  out.push(`/** Types only Apple HealthKit persists (${iosOnly.length}). */`);
  out.push(`export const IOS_ONLY_TYPES = ${JSON.stringify(iosOnly)} as const;`);
  out.push(`export type IosOnlyType = (typeof IOS_ONLY_TYPES)[number];\n`);
  out.push(`/** Types only Android Health Connect persists (${androidOnly.length}). */`);
  out.push(`export const ANDROID_ONLY_TYPES = ${JSON.stringify(androidOnly)} as const;`);
  out.push(`export type AndroidOnlyType = (typeof ANDROID_ONLY_TYPES)[number];\n`);
  out.push(`export const TYPE_PLATFORMS: Record<HealthType, TypePlatforms> = ${JSON.stringify(platforms, null, 2)};\n`);
  out.push(`export const TYPE_COUNTERPARTS: Partial<Record<HealthType, Counterpart[]>> = ${JSON.stringify(counterparts, null, 2)};\n`);
  out.push(`/** Platform support for one type, without needing a provider instance. */
export const platformSupport = (type: HealthType, platform: PlatformId): PlatformTypeSupport => TYPE_PLATFORMS[type][platform];

/** Value fields the given platform does not persist for this type. */
export const unsupportedFields = (type: HealthType, platform: PlatformId): string[] =>
  Object.entries(TYPE_PLATFORMS[type].fields)
    .filter(([, f]) => !f[platform])
    .map(([name]) => name);

/** Related types on the other platform. Check \`interchangeable\` before substituting one for the other. */
export const counterpartsOf = (type: HealthType): Counterpart[] => TYPE_COUNTERPARTS[type] ?? [];

export const isCrossPlatform = (type: HealthType): type is CrossPlatformType => TYPE_PLATFORMS[type].ios.supported && TYPE_PLATFORMS[type].android.supported;`);
  return out.join('\n') + '\n';
}

void basename;

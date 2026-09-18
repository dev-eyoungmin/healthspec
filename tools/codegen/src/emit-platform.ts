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

  // Only fields one platform persists and the other does not: everything else follows the type's own support,
  // which packages/schema/src/platform.ts derives from the mappings.
  const fields = Object.fromEntries(
    infos
      .map(({ id, t }) => [id, Object.fromEntries(Object.entries(fieldSupport(t)).filter(([, on]) => !on.ios || !on.android))] as const)
      .filter(([, partial]) => Object.keys(partial).length > 0),
  );
  const counterparts = Object.fromEntries(infos.filter(({ x }) => x.counterparts?.length).map(({ id, x }) => [id, x.counterparts]));
  const union = (ids: string[]) => (ids.length ? ids.map((id) => JSON.stringify(id)).join(' | ') : 'never');
  const supported = (platform: 'healthkit' | 'healthconnect') => infos.filter(({ x }) => x.platforms?.[platform]).map(({ id }) => id);
  const ios = supported('healthkit');
  const android = supported('healthconnect');

  return (
    [
      HEADER,
      `import type { HealthType } from './types.js';\n`,
      `/**
 * A related type on the other platform. \`interchangeable: false\` means the values measure different things
 * and MUST NOT be converted or summed together — only used to point the developer at the right type.
 */
export interface Counterpart {
  type: HealthType;
  platform: 'healthkit' | 'healthconnect';
  interchangeable: boolean;
  reason: string;
}\n`,
      `/** Types both platforms persist (${ios.filter((id) => android.includes(id)).length}). */`,
      `export type CrossPlatformType = ${union(ios.filter((id) => android.includes(id)))};`,
      `/** Types only Apple HealthKit persists (${ios.filter((id) => !android.includes(id)).length}). */`,
      `export type IosOnlyType = ${union(ios.filter((id) => !android.includes(id)))};`,
      `/** Types only Android Health Connect persists (${android.filter((id) => !ios.includes(id)).length}). */`,
      `export type AndroidOnlyType = ${union(android.filter((id) => !ios.includes(id)))};\n`,
      `/** Value fields only one platform persists. Everything absent here follows the type's platform support. */`,
      `export const FIELD_PLATFORMS: Partial<Record<HealthType, Record<string, { ios: boolean; android: boolean }>>> = ${JSON.stringify(fields, null, 2)};\n`,
      `export const TYPE_COUNTERPARTS: Partial<Record<HealthType, Counterpart[]>> = ${JSON.stringify(counterparts, null, 2)};`,
    ].join('\n') + '\n'
  );
}

void basename;

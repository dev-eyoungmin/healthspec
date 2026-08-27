import { basename, type SpecBundle } from './load.js';

const HEADER = '// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.\n';

export const pascal = (s: string): string =>
  s.split(/[^A-Za-z0-9]+/).filter(Boolean).map((w) => w[0]!.toUpperCase() + w.slice(1)).join('');
export const constCase = (s: string): string => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[^A-Za-z0-9]+/g, '_').toUpperCase();

const isIdent = (k: string) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);
const key = (k: string) => (isIdent(k) ? k : JSON.stringify(k));

/** Resolve a relative `$ref` ("../enums/sleep_stage.json", "source.json") to the referenced schema's title. */
function refName(ref: string, bundle: SpecBundle): string {
  const target = bundle.byBasename.get(basename(ref));
  if (!target) throw new Error(`Unresolvable $ref "${ref}"`);
  return target.json.title;
}

function docComment(v: any, pad: string): string {
  const parts: string[] = [];
  if (v.description) parts.push(String(v.description).replace(/\*\//g, '* /'));
  if (v['x-unit']) parts.push(`Unit: ${v['x-unit']}`);
  const lo = v.minimum ?? v.exclusiveMinimum;
  const hi = v.maximum ?? v.exclusiveMaximum;
  if (lo !== undefined || hi !== undefined) parts.push(`Range: ${lo ?? '…'}–${hi ?? '…'}`);
  return parts.length ? `${pad}/** ${parts.join('. ')} */\n` : '';
}

function tsType(schema: any, bundle: SpecBundle, depth: number): string {
  if (schema.$ref) return refName(schema.$ref, bundle);
  if (schema.enum) return schema.enum.map((v: unknown) => JSON.stringify(v)).join(' | ');
  switch (schema.type) {
    case 'integer':
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'array':
      return `Array<${tsType(schema.items, bundle, depth)}>`;
    case 'object':
      if (!schema.properties && schema.additionalProperties === true) return 'Record<string, unknown>';
      if (!schema.properties && schema.additionalProperties) {
        return `Record<string, ${tsType(schema.additionalProperties, bundle, depth)}>`;
      }
      return objectType(schema, bundle, depth);
  }
  throw new Error(`Unsupported schema fragment: ${JSON.stringify(schema)}`);
}

function objectType(schema: any, bundle: SpecBundle, depth: number): string {
  const required = new Set<string>(schema.required ?? []);
  const pad = '  '.repeat(depth);
  const lines = Object.entries<any>(schema.properties ?? {}).map(
    ([k, v]) => `${docComment(v, pad)}${pad}${key(k)}${required.has(k) ? '' : '?'}: ${tsType(v, bundle, depth + 1)};`,
  );
  return `{\n${lines.join('\n')}\n${'  '.repeat(depth - 1)}}`;
}

export function emitTypes(b: SpecBundle): string {
  const out: string[] = [HEADER];
  out.push('// ---------------------------------------------------------------- enums\n');
  for (const e of b.enums) {
    const T: string = e.json.title;
    out.push(`/** ${e.json.description ?? T} */`);
    out.push(`export type ${T} = ${e.json.enum.map((v: string) => JSON.stringify(v)).join(' | ')};`);
    out.push(`export const ${constCase(T)}_VALUES = ${JSON.stringify(e.json.enum)} as const;\n`);
  }

  const ids: string[] = b.types.map((t) => t.json.title);
  out.push('// ---------------------------------------------------------------- health types\n');
  out.push(`export type HealthType = ${ids.map((i) => JSON.stringify(i)).join(' | ')};`);
  out.push(`export const HEALTH_TYPES = ${JSON.stringify(ids)} as const;\n`);
  const categories = [...new Set<string>(b.types.map((t) => t.json['x-healthspec'].category))].sort();
  out.push(`export type HealthCategory = ${categories.map((c) => JSON.stringify(c)).join(' | ')};`);
  out.push(`export const HEALTH_CATEGORIES = ${JSON.stringify(categories)} as const;`);
  out.push(`/** sample: point in time (start == end) · interval: cumulative over [start, end] · session: an episode with optional structure */`);
  out.push(`export type RecordKind = 'sample' | 'interval' | 'session';`);
  out.push(`export type AggregateFn = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'duration';\n`);

  out.push('// ---------------------------------------------------------------- common\n');
  const envelope = b.common.find((c) => c.json.title === 'HealthRecordEnvelope');
  if (!envelope) throw new Error('common/record.json (HealthRecordEnvelope) missing');
  for (const c of b.common) {
    if (c === envelope) continue;
    out.push(`/** ${c.json.description ?? c.json.title} */`);
    out.push(`export interface ${c.json.title} ${objectType(c.json, b, 1)}\n`);
  }
  const base = {
    ...envelope.json,
    properties: Object.fromEntries(Object.entries(envelope.json.properties).filter(([k]) => k !== 'type' && k !== 'value')),
    required: (envelope.json.required as string[]).filter((k) => k !== 'type' && k !== 'value'),
  };
  out.push(`/** ${envelope.json.description} */`);
  out.push(`export interface HealthRecordBase ${objectType(base, b, 1)}\n`);

  out.push('// ---------------------------------------------------------------- values\n');
  for (const t of b.types) {
    out.push(`/** ${t.json.description} */`);
    out.push(`export interface ${pascal(t.json.title)}Value ${objectType(t.json, b, 1)}\n`);
  }

  out.push('// ---------------------------------------------------------------- records\n');
  for (const id of ids) {
    const P = pascal(id);
    out.push(`export interface ${P}Record extends HealthRecordBase {\n  type: ${JSON.stringify(id)};\n  value: ${P}Value;\n}`);
  }
  out.push('');
  out.push(`export interface HealthValueMap {\n${ids.map((i) => `  ${JSON.stringify(i)}: ${pascal(i)}Value;`).join('\n')}\n}`);
  out.push(`export interface HealthRecordMap {\n${ids.map((i) => `  ${JSON.stringify(i)}: ${pascal(i)}Record;`).join('\n')}\n}`);
  out.push(`export type HealthRecord = HealthRecordMap[HealthType];`);
  out.push(`export type HealthRecordOf<T extends HealthType> = HealthRecordMap[T];`);
  out.push(`export type HealthValueOf<T extends HealthType> = HealthValueMap[T];`);
  return out.join('\n') + '\n';
}

function healthKitIdentifiers(hk: any): string[] {
  if (!hk) return [];
  const ids = new Set<string>();
  if (hk.identifier) ids.add(hk.identifier);
  for (const i of hk.identifiers ?? []) ids.add(i);
  for (const i of Object.values<string>(hk.fields ?? {})) ids.add(i);
  return [...ids];
}

export function emitMapping(b: SpecBundle): string {
  const enumTitles: string[] = b.enums.filter((e) => e.json['x-healthspec']?.mapping).map((e) => e.json.title);
  const out: string[] = [HEADER];
  out.push(`import type { AggregateFn, HealthCategory, HealthType, RecordKind${enumTitles.map((t) => `, ${t}`).join('')} } from './types.js';\n`);
  out.push(`export interface HealthKitMapping {
  /** quantity | category | correlation | workout · derived: computed from several identifiers · multi: one identifier per value field · series: HKSeriesType read through a dedicated operation · special: non-sample HealthKit API */
  kind: 'quantity' | 'category' | 'correlation' | 'workout' | 'derived' | 'multi' | 'series' | 'special' | 'electrocardiogram' | 'heartbeatSeries' | 'stateOfMind' | 'activitySummary' | 'clinical' | 'medicationDose';
  identifier?: string;
  identifiers?: string[];
  /** value field → HK identifier (kind: multi) */
  fields?: Record<string, string>;
  /** HKUnit string used when reading/writing */
  unit?: string;
  /** category: spec enum value → HKCategoryValue raw value */
  values?: Record<string, number>;
  /** category: the value field that carries the enum */
  valueField?: string;
  /** value field → HealthKit metadata key, with the coercion applied on read/write */
  metadataFields?: Record<string, { key: string; type: 'boolean' | 'number' | 'string'; booleanEnum?: { true: string; false: string } }>;
  /** minimum OS version when newer than the baseline */
  since?: string;
  read: boolean;
  write: boolean;
  notes?: string[];
  /** Sources that independently confirmed this mapping — see tools/verify and docs/VERIFICATION.md. */
  verifiedBy?: { identifiers?: string[]; record?: string[] };
}
export interface HealthConnectMapping {
  /** androidx.health.connect.client.records class name */
  record: string;
  /** Suffix of android.permission.health.READ_* / WRITE_* */
  permission: string;
  field?: string;
  /** value field → record property */
  fields?: Record<string, string>;
  unit?: string;
  /** Record holds a series of samples; providers flatten to one record per sample */
  series?: boolean;
  /** Sources that independently confirmed this mapping — see tools/verify and docs/VERIFICATION.md. */
  verifiedBy?: { identifiers?: string[]; record?: string[] };
  /** Not a Record class — reached through a dedicated operation (e.g. readRoute), never readRecords */
  special?: boolean;
  /** Personal Health Record (FHIR) resource type — read through readMedicalResources */
  medicalResourceType?: string;
  read: boolean;
  write: boolean;
  notes?: string[];
}
export interface TypeMapping {
  type: HealthType;
  category: HealthCategory;
  kind: RecordKind;
  since: string;
  aggregate: AggregateFn[];
  healthkit?: HealthKitMapping;
  healthconnect?: HealthConnectMapping;
  openmhealth?: { schema: string };
  notes: string[];
  /** value field → canonical unit symbol */
  fieldUnits: Record<string, string>;
}\n`);

  const entries = b.types.map((t) => {
    const x = t.json['x-healthspec'];
    const fieldUnits = Object.fromEntries(
      Object.entries<any>(t.json.properties ?? {}).filter(([, v]) => v['x-unit']).map(([k, v]) => [k, v['x-unit']]),
    );
    const m: Record<string, unknown> = { type: t.json.title, category: x.category, kind: x.kind, since: x.since, aggregate: x.aggregate ?? [] };
    if (x.platforms?.healthkit) m.healthkit = x.platforms.healthkit;
    if (x.platforms?.healthconnect) m.healthconnect = x.platforms.healthconnect;
    if (x.openmhealth) m.openmhealth = x.openmhealth;
    m.notes = x.notes ?? [];
    m.fieldUnits = fieldUnits;
    return m as { type: string; healthkit?: any; healthconnect?: any };
  });

  out.push(`export const TYPE_MAPPINGS: Record<HealthType, TypeMapping> = ${JSON.stringify(Object.fromEntries(entries.map((e) => [e.type, e])), null, 2)};\n`);
  out.push(`export const HEALTH_CONNECT_PERMISSION_PREFIX = 'android.permission.health.';\n`);
  out.push(`/** Health Connect runtime permissions per type. Empty object when Health Connect does not support the type. */`);
  out.push(
    `export const HEALTH_CONNECT_PERMISSIONS: Record<HealthType, { read?: string; write?: string }> = ${JSON.stringify(
      Object.fromEntries(
        entries.map((e) => {
          const hc = e.healthconnect;
          const p: Record<string, string> = {};
          if (hc?.read) p.read = `android.permission.health.READ_${hc.permission}`;
          if (hc?.write) p.write = `android.permission.health.WRITE_${hc.permission}`;
          return [e.type, p];
        }),
      ),
      null,
      2,
    )};\n`,
  );
  out.push(`/** Every HealthKit object type identifier that must be authorized for a type. Empty when HealthKit does not support the type. */`);
  out.push(
    `export const HEALTHKIT_IDENTIFIERS: Record<HealthType, string[]> = ${JSON.stringify(
      Object.fromEntries(entries.map((e) => [e.type, healthKitIdentifiers(e.healthkit)])),
      null,
      2,
    )};\n`,
  );
  for (const e of b.enums) {
    const mapping = e.json['x-healthspec']?.mapping;
    if (!mapping) continue;
    const T: string = e.json.title;
    if (e.json['x-healthspec'].verified === false) out.push(`/** DRAFT — platform values not yet verified against SDK headers. */`);
    out.push(`export const ${constCase(T)}_MAPPING: Record<${T}, { healthkit?: string; healthconnect?: string }> = ${JSON.stringify(mapping, null, 2)};\n`);
  }
  return out.join('\n');
}

export function emitBundle(b: SpecBundle): string {
  const strip = (s: { file: string; json: unknown }) => ({ file: s.file, schema: s.json });
  return (
    HEADER +
    `\nexport type JsonSchema = Record<string, unknown>;\nexport interface SchemaEntry { file: string; schema: JsonSchema }\n\n` +
    `/** Every spec schema, verbatim, for runtime validation (e.g. with Ajv 2020-12) and conformance tooling. */\n` +
    `export const SCHEMA_BUNDLE: { common: SchemaEntry[]; enums: SchemaEntry[]; types: SchemaEntry[] } = ${JSON.stringify(
      { common: b.common.map(strip), enums: b.enums.map(strip), types: b.types.map(strip) },
      null,
      2,
    )};\n`
  );
}

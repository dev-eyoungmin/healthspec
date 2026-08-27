import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type Category = 'activity' | 'body' | 'vitals' | 'sleep' | 'nutrition' | 'wellness' | 'cycle' | 'symptom' | 'environment' | 'mobility' | 'respiratory' | 'clinical' | 'mind';
export type Kind = 'sample' | 'interval' | 'session';
export type Aggregate = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'duration';

export interface HKMap {
  kind: 'quantity' | 'category' | 'correlation' | 'workout' | 'derived' | 'multi' | 'series' | 'special' | 'electrocardiogram' | 'heartbeatSeries' | 'stateOfMind' | 'activitySummary' | 'clinical' | 'medicationDose';
  identifier?: string;
  identifiers?: string[];
  fields?: Record<string, string>;
  unit?: string;
  /** category: spec enum value → HKCategoryValue raw int */
  values?: Record<string, number>;
  /** category: which value field carries the enum */
  valueField?: string;
  /** value field → HK metadata key (with coercion) */
  metadataFields?: Record<string, { key: string; type: 'boolean' | 'number' | 'string'; booleanEnum?: { true: string; false: string } }>;
  read?: boolean;
  write?: boolean;
  notes?: string[];
  /** minimum iOS version when newer than the baseline */
  since?: string;
}

export interface HCMap {
  record: string;
  permission: string;
  /** not a Record class; reached through a dedicated operation */
  special?: boolean;
  /** Personal Health Record (FHIR) resource type */
  medicalResourceType?: string;
  field?: string;
  fields?: Record<string, string>;
  unit?: string;
  series?: boolean;
  read?: boolean;
  write?: boolean;
  notes?: string[];
}

export interface Entry {
  id: string;
  description: string;
  category: Category;
  kind: Kind;
  aggregate?: Aggregate[];
  since?: string;
  hk?: HKMap;
  hc?: HCMap;
  omh?: string;
  notes?: string[];
  properties: Record<string, unknown>;
  required?: string[];
  examples: unknown[];
  /** mapping not yet checked against SDK headers */
  verified?: boolean;
}

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');

export function toSchema(e: Entry): Record<string, unknown> {
  const platforms: Record<string, unknown> = {};
  if (e.hk) platforms['healthkit'] = { read: true, write: true, ...e.hk };
  if (e.hc) platforms['healthconnect'] = { read: true, write: true, ...e.hc };
  const x: Record<string, unknown> = { category: e.category, kind: e.kind, since: e.since ?? '1.0', aggregate: e.aggregate ?? [], platforms };
  if (e.omh) x['openmhealth'] = { schema: e.omh };
  x['notes'] = e.notes ?? [];
  if (e.verified === false) x['verified'] = false;
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `https://healthspec.dev/schema/types/${e.id}.json`,
    title: e.id,
    description: e.description,
    'x-healthspec': x,
    type: 'object',
    properties: e.properties,
    ...(e.required?.length ? { required: e.required } : {}),
    additionalProperties: false,
    examples: e.examples,
  };
}

export async function writeEntries(entries: Entry[], force: string[] | boolean): Promise<{ written: string[]; skipped: string[] }> {
  const dir = path.join(ROOT, 'spec/schema/types');
  await mkdir(dir, { recursive: true });
  const written: string[] = [];
  const skipped: string[] = [];
  for (const e of entries) {
    const file = path.join(dir, `${e.id}.json`);
    const exists = await readFile(file, 'utf8').then(() => true, () => false);
    const overwrite = force === true || (Array.isArray(force) && force.includes(e.id));
    if (exists && !overwrite) {
      skipped.push(e.id);
      continue;
    }
    await writeFile(file, JSON.stringify(toSchema(e), null, 2) + '\n');
    written.push(e.id);
  }
  return { written, skipped };
}

// Reusable property fragments
export const num = (unit: string, extra: Record<string, unknown> = {}) => ({ type: 'number', 'x-unit': unit, ...extra });
export const int = (unit: string, extra: Record<string, unknown> = {}) => ({ type: 'integer', 'x-unit': unit, ...extra });
export const str = (extra: Record<string, unknown> = {}) => ({ type: 'string', ...extra });
export const enumOf = (values: string[]) => ({ type: 'string', enum: values });
export const dateTime = () => ({ type: 'string', format: 'date-time' });

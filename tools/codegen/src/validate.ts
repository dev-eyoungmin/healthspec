import { Ajv2020 } from 'ajv/dist/2020.js';
import addFormatsModule, { type FormatsPlugin } from 'ajv-formats';
import { basename, type SpecBundle } from './load.js';

// ajv-formats ships CJS (`module.exports = plugin`, `.default = plugin`); under NodeNext the default import is
// typed as the module object, so unwrap it once here.
const addFormats: FormatsPlugin =
  (addFormatsModule as unknown as { default?: FormatsPlugin }).default ?? (addFormatsModule as unknown as FormatsPlugin);

export type Ajv = Ajv2020;

export interface Issue {
  file: string;
  message: string;
}

export function buildValidator(bundle: SpecBundle): Ajv {
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(ajv);
  for (const s of bundle.all) ajv.addSchema(s.json, s.id);
  return ajv;
}

const REQUIRED_X = ['category', 'kind', 'since'] as const;
const KINDS = new Set(['sample', 'interval', 'session']);
const AGGREGATES = new Set(['sum', 'avg', 'min', 'max', 'count', 'duration']);
const ID_PREFIX = 'https://healthspec.dev/schema/';

/** Structural rules every spec file must satisfy — beyond what JSON Schema itself checks. */
export function lintSpec(bundle: SpecBundle): Issue[] {
  const issues: Issue[] = [];
  const push = (file: string, message: string) => issues.push({ file, message });

  for (const s of bundle.all) {
    const expected = ID_PREFIX + s.file.replace(/^spec\/schema\//, '');
    if (s.id !== expected) push(s.file, `$id must be ${expected}`);
    if (s.json.$schema !== 'https://json-schema.org/draft/2020-12/schema') push(s.file, '$schema must be draft 2020-12');
    if (typeof s.json.title !== 'string') push(s.file, 'title required');
  }

  for (const t of bundle.types) {
    const j = t.json;
    const name = basename(t.file).replace(/\.json$/, '');
    if (j.title !== name) push(t.file, `title "${j.title}" must equal file name "${name}"`);
    const x = j['x-healthspec'];
    if (!x) {
      push(t.file, 'x-healthspec block required');
      continue;
    }
    for (const k of REQUIRED_X) if (x[k] === undefined) push(t.file, `x-healthspec.${k} required`);
    if (!KINDS.has(x.kind)) push(t.file, `x-healthspec.kind "${x.kind}" must be sample | interval | session`);
    for (const a of x.aggregate ?? []) if (!AGGREGATES.has(a)) push(t.file, `aggregate "${a}" unknown`);
    const p = x.platforms ?? {};
    if (!p.healthkit && !p.healthconnect) push(t.file, 'at least one platform mapping required');
    for (const [platform, m] of Object.entries<any>(p)) {
      if (typeof m.read !== 'boolean' || typeof m.write !== 'boolean') push(t.file, `platforms.${platform}.read/write must be booleans`);
    }
    if (p.healthkit && !p.healthkit.identifier && !p.healthkit.identifiers && !p.healthkit.fields) {
      push(t.file, 'healthkit mapping needs identifier, identifiers or fields');
    }
    if (p.healthconnect && (!p.healthconnect.record || !p.healthconnect.permission)) {
      push(t.file, 'healthconnect mapping needs record and permission');
    }
    if (j.type !== 'object' || j.additionalProperties !== false) push(t.file, 'value schema must be an object with additionalProperties:false');
    if (!Array.isArray(j.examples) || j.examples.length === 0) push(t.file, 'at least one example required');
    for (const c of x.counterparts ?? []) {
      if (typeof c.type !== 'string') push(t.file, 'counterpart needs a type');
      if (typeof c.interchangeable !== 'boolean') push(t.file, `counterpart "${c.type}" needs interchangeable`);
      if (!c.reason) push(t.file, `counterpart "${c.type}" needs a reason`);
    }
    for (const [k, v] of Object.entries<any>(j.properties ?? {})) {
      const p = v['x-platform'];
      if (p !== undefined && p !== 'healthkit' && p !== 'healthconnect') push(t.file, `property "${k}": x-platform must be healthkit or healthconnect`);
    }
    for (const [k, v] of Object.entries<any>(j.properties ?? {})) {
      if ((v.type === 'number' || v.type === 'integer') && !v['x-unit']) push(t.file, `numeric property "${k}" needs x-unit`);
    }
  }

  for (const e of bundle.enums) {
    const j = e.json;
    if (!Array.isArray(j.enum) || j.enum.length === 0) push(e.file, 'enum[] required');
    const mapping = j['x-healthspec']?.mapping;
    if (mapping) {
      for (const k of Object.keys(mapping)) if (!j.enum.includes(k)) push(e.file, `mapping key "${k}" is not an enum value`);
      for (const v of j.enum) if (!mapping[v]) push(e.file, `enum value "${v}" has no mapping entry`);
    }
  }
  return issues;
}

/** Every type's `examples` must validate against its own schema. */
export function validateExamples(ajv: Ajv, bundle: SpecBundle): Issue[] {
  const issues: Issue[] = [];
  for (const t of bundle.types) {
    const validate = ajv.getSchema(t.id);
    if (!validate) {
      issues.push({ file: t.file, message: 'schema failed to compile' });
      continue;
    }
    (t.json.examples as unknown[]).forEach((example, i) => {
      if (!validate(example)) issues.push({ file: t.file, message: `examples[${i}] invalid: ${ajv.errorsText(validate.errors)}` });
    });
  }
  return issues;
}

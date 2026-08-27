import { basename, type SpecBundle } from './load.js';
import { constCase } from './emit-ts.js';

const HEADER = '// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.\n';

interface Ctx {
  bundle: SpecBundle;
  n: number;
}

const fresh = (ctx: Ctx, prefix: string) => `${prefix}${ctx.n++}`;
const indent = (lines: string[], by = '  ') => lines.map((l) => by + l);

function refCheckName(ref: string, ctx: Ctx): string {
  const target = ctx.bundle.byBasename.get(basename(ref));
  if (!target) throw new Error(`Unresolvable $ref "${ref}"`);
  return `check${target.json.title}`;
}

/**
 * Emit statements validating the JS expression `v` (already bound to a const) against `schema`.
 * `path` is a JS *expression* evaluating to the human-readable path.
 */
function gen(schema: any, v: string, path: string, ctx: Ctx): string[] {
  const fail = (message: string) => `out.push({ path: ${path}, message: ${JSON.stringify(message)} });`;
  const L: string[] = [];

  if (schema.$ref) {
    L.push(`${refCheckName(schema.$ref, ctx)}(${v}, ${path}, out);`);
    return L;
  }
  if (schema.enum) {
    L.push(`if (typeof ${v} !== 'string' || !${JSON.stringify(schema.enum)}.includes(${v})) ${fail(`must be one of ${schema.enum.join(', ')}`)}`);
    return L;
  }
  switch (schema.type) {
    case 'integer':
    case 'number': {
      L.push(`if (typeof ${v} !== 'number' || Number.isNaN(${v})) ${fail('must be a number')}`);
      const inner: string[] = [];
      if (schema.type === 'integer') inner.push(`if (!Number.isInteger(${v})) ${fail('must be an integer')}`);
      if (schema.minimum !== undefined) inner.push(`if (${v} < ${schema.minimum}) ${fail(`must be ≥ ${schema.minimum}`)}`);
      if (schema.exclusiveMinimum !== undefined) inner.push(`if (${v} <= ${schema.exclusiveMinimum}) ${fail(`must be > ${schema.exclusiveMinimum}`)}`);
      if (schema.maximum !== undefined) inner.push(`if (${v} > ${schema.maximum}) ${fail(`must be ≤ ${schema.maximum}`)}`);
      if (schema.exclusiveMaximum !== undefined) inner.push(`if (${v} >= ${schema.exclusiveMaximum}) ${fail(`must be < ${schema.exclusiveMaximum}`)}`);
      if (inner.length) L.push('else {', ...indent(inner), '}');
      return L;
    }
    case 'string': {
      L.push(`if (typeof ${v} !== 'string') ${fail('must be a string')}`);
      if (schema.format === 'date-time') L.push(`else if (!DATE_TIME_RE.test(${v})) ${fail('must be an RFC 3339 date-time')}`);
      if (schema.pattern) L.push(`else if (!new RegExp(${JSON.stringify(schema.pattern)}).test(${v})) ${fail(`must match ${schema.pattern}`)}`);
      return L;
    }
    case 'boolean':
      L.push(`if (typeof ${v} !== 'boolean') ${fail('must be a boolean')}`);
      return L;
    case 'array': {
      const a = fresh(ctx, 'a');
      const i = fresh(ctx, 'i');
      const item = fresh(ctx, 'v');
      L.push(`if (!Array.isArray(${v})) ${fail('must be an array')}`);
      L.push('else {');
      L.push(`  const ${a}: unknown[] = ${v};`);
      L.push(`  for (let ${i} = 0; ${i} < ${a}.length; ${i}++) {`);
      L.push(`    const ${item} = ${a}[${i}];`);
      L.push(...indent(gen(schema.items, item, `${path} + '[' + ${i} + ']'`, ctx), '    '));
      L.push('  }');
      L.push('}');
      return L;
    }
    case 'object': {
      const o = fresh(ctx, 'o');
      L.push(`if (!isObject(${v})) ${fail('must be an object')}`);
      L.push('else {');
      L.push(`  const ${o} = ${v};`);
      if (schema.properties) {
        const keys = Object.keys(schema.properties);
        if (schema.additionalProperties === false) {
          L.push(`  for (const k of Object.keys(${o})) if (!(${JSON.stringify(keys)} as string[]).includes(k)) out.push({ path: ${path} + '.' + k, message: 'unknown property' });`);
        }
        const required = new Set<string>(schema.required ?? []);
        for (const k of keys) {
          const pv = fresh(ctx, 'v');
          const pp = `${path} + ${JSON.stringify('.' + k)}`;
          L.push(`  const ${pv} = ${o}[${JSON.stringify(k)}];`);
          if (required.has(k)) {
            L.push(`  if (${pv} === undefined) out.push({ path: ${pp}, message: 'required' });`);
            L.push('  else {');
          } else {
            L.push(`  if (${pv} !== undefined) {`);
          }
          L.push(...indent(gen(schema.properties[k], pv, pp, ctx), '    '));
          L.push('  }');
        }
      } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
        const pv = fresh(ctx, 'v');
        L.push(`  for (const k of Object.keys(${o})) {`);
        L.push(`    const ${pv} = ${o}[k];`);
        L.push(...indent(gen(schema.additionalProperties, pv, `${path} + '.' + k`, ctx), '    '));
        L.push('  }');
      }
      L.push('}');
      return L;
    }
  }
  throw new Error(`Unsupported schema fragment: ${JSON.stringify(schema)}`);
}

export function emitValidators(b: SpecBundle): string {
  const ctx: Ctx = { bundle: b, n: 0 };
  const enumTitles = b.enums.map((e) => e.json.title as string);
  const out: string[] = [HEADER];
  out.push(`import { HEALTH_TYPES${enumTitles.map((t) => `, ${constCase(t)}_VALUES`).join('')} } from './types.js';`);
  out.push(`import type { HealthType } from './types.js';`);
  out.push(`import { TYPE_MAPPINGS } from './mapping.js';\n`);
  out.push(`export interface ValidationIssue {\n  /** e.g. "value.stages[2].stage" */\n  path: string;\n  message: string;\n}`);
  out.push(`export type Check = (v: unknown, path: string, out: ValidationIssue[]) => void;\n`);
  out.push(`const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);`);
  out.push(`const DATE_TIME_RE = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})$/;`);
  out.push(`const enumCheck = (values: readonly string[]): Check => (v, path, out) => {\n  if (typeof v !== 'string' || !values.includes(v)) out.push({ path, message: 'must be one of ' + values.join(', ') });\n};\n`);

  out.push('// ---------------------------------------------------------------- enums\n');
  for (const e of b.enums) out.push(`export const check${e.json.title}: Check = enumCheck(${constCase(e.json.title)}_VALUES);`);
  out.push('');

  out.push('// ---------------------------------------------------------------- common\n');
  const envelope = b.common.find((c) => c.json.title === 'HealthRecordEnvelope');
  if (!envelope) throw new Error('HealthRecordEnvelope missing');
  for (const c of b.common) {
    if (c === envelope) continue;
    out.push(`export const check${c.json.title}: Check = (v, path, out) => {`);
    out.push(...indent(gen(c.json, 'v', 'path', ctx)));
    out.push('};\n');
  }
  // Envelope: everything except `value` (checked per type) and `type` (checked against HEALTH_TYPES).
  const env = envelope.json;
  const envSchema = {
    ...env,
    properties: Object.fromEntries(Object.entries(env.properties).filter(([k]) => k !== 'value' && k !== 'type')),
    required: (env.required as string[]).filter((k) => k !== 'value' && k !== 'type'),
    additionalProperties: false,
  };
  out.push(`export interface EnvelopeOptions {\n  /** Records being written may omit id (assigned by the store) and source (filled by the provider). */\n  partial?: boolean;\n}`);
  out.push(`const ENVELOPE_KEYS = ${JSON.stringify(Object.keys(env.properties))};`);
  out.push(`export const checkEnvelope = (v: unknown, path: string, out: ValidationIssue[], options: EnvelopeOptions = {}): void => {`);
  out.push(`  if (!isObject(v)) { out.push({ path, message: 'must be an object' }); return; }`);
  out.push(`  for (const k of Object.keys(v)) if (!ENVELOPE_KEYS.includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });`);
  out.push(`  const partial = options.partial === true;`);
  // generate property checks but relax id/source when partial
  const relaxed = new Set(['id', 'source']);
  for (const [k, prop] of Object.entries<any>(envSchema.properties)) {
    const pv = fresh(ctx, 'v');
    const pp = `path + ${JSON.stringify('.' + k)}`;
    out.push(`  const ${pv} = v[${JSON.stringify(k)}];`);
    const required = (envSchema.required as string[]).includes(k);
    if (required && relaxed.has(k)) out.push(`  if (${pv} === undefined) { if (!partial) out.push({ path: ${pp}, message: 'required' }); }`);
    else if (required) out.push(`  if (${pv} === undefined) out.push({ path: ${pp}, message: 'required' });`);
    else out.push(`  if (${pv} === undefined) { /* optional */ }`);
    out.push('  else {');
    out.push(...indent(gen(prop, pv, pp, ctx), '    '));
    out.push('  }');
  }
  out.push(`  const t = v['type'];`);
  out.push(`  if (t === undefined) out.push({ path: path + '.type', message: 'required' });`);
  out.push(`  else if (typeof t !== 'string' || !(HEALTH_TYPES as readonly string[]).includes(t)) out.push({ path: path + '.type', message: 'unknown health type' });`);
  out.push(`  if (v['value'] === undefined) out.push({ path: path + '.value', message: 'required' });`);
  out.push('};\n');

  out.push('// ---------------------------------------------------------------- values\n');
  for (const t of b.types) {
    out.push(`const check_${t.json.title}: Check = (v, path, out) => {`);
    out.push(...indent(gen(t.json, 'v', 'path', ctx)));
    out.push('};');
  }
  out.push('');
  out.push(`export const VALUE_CHECKS: Record<HealthType, Check> = {\n${b.types.map((t) => `  ${t.json.title}: check_${t.json.title},`).join('\n')}\n};\n`);
  out.push(`/** Validate a type's \`value\` object. Empty array = valid. */`);
  out.push(`export function validateValue(type: HealthType, value: unknown, path = 'value'): ValidationIssue[] {\n  const out: ValidationIssue[] = [];\n  VALUE_CHECKS[type](value, path, out);\n  return out;\n}\n`);
  out.push(`/**
 * Validate a whole record: envelope, known type, value, and the time rules of SPEC §1.1
 * (end ≥ start; samples have start == end). Pass { partial: true } for records about to be written.
 */`);
  out.push(`export function validateRecord(record: unknown, options: EnvelopeOptions = {}, path = 'record'): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  checkEnvelope(record, path, out, options);
  if (out.length || !isObject(record)) return out;
  const type = record['type'] as HealthType;
  VALUE_CHECKS[type](record['value'], path + '.value', out);
  const start = Date.parse(String(record['start']));
  const end = Date.parse(String(record['end']));
  if (end < start) out.push({ path: path + '.end', message: 'must not be before start' });
  else if (TYPE_MAPPINGS[type].kind === 'sample' && end !== start) out.push({ path: path + '.end', message: 'samples must have end == start' });
  return out;
}`);
  return out.join('\n') + '\n';
}

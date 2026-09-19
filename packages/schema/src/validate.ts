import { HEALTH_TYPES, type HealthType } from './generated/types.js';
import { TYPE_MAPPINGS } from './generated/mapping.js';
import { ENVELOPE_SCHEMA, VALUE_SCHEMAS } from './generated/value-schemas.js';

/**
 * Validation against the spec's JSON Schemas, without shipping them.
 *
 * `spec/schema` is JSON Schema 2020-12, which needs a validator an app should not have to bundle. Code generated
 * per type is no better: one function per constraint across 182 types is hundreds of kilobytes of JavaScript.
 * Instead the generator emits the constraints as data (`value-schemas.ts`) and this file interprets them — same
 * rules, same messages, a fraction of the size.
 */

export interface ValidationIssue {
  /** e.g. "value.stages[2].stage" */
  path: string;
  message: string;
}

/** A value constraint. Keys are short because this shape is generated 182 times over. */
export type SchemaNode =
  | { k: 'n'; int?: true; min?: number; max?: number; xmin?: number; xmax?: number }
  | { k: 's'; dt?: true; re?: string }
  | { k: 'b' }
  | { k: 'e'; v: readonly string[] }
  | { k: 'a'; i: SchemaNode }
  | { k: 'o'; p?: Record<string, SchemaNode>; r?: readonly string[]; ap?: SchemaNode }
  /** A property another check owns: known, so not an unknown property, but not checked here. */
  | { k: 'any' };

export interface EnvelopeOptions {
  /** Records being written may omit id (assigned by the store) and source (filled by the provider). */
  partial?: boolean;
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const patterns = new Map<string, RegExp>();
const pattern = (re: string): RegExp => {
  let compiled = patterns.get(re);
  if (!compiled) {
    compiled = new RegExp(re);
    patterns.set(re, compiled);
  }
  return compiled;
};

/** Collects every issue in `value` against `node`; an empty `out` means valid. */
export function checkNode(node: SchemaNode, value: unknown, path: string, out: ValidationIssue[]): void {
  const fail = (message: string): void => {
    out.push({ path, message });
  };
  switch (node.k) {
    case 'n': {
      if (typeof value !== 'number' || Number.isNaN(value)) return fail('must be a number');
      if (node.int && !Number.isInteger(value)) fail('must be an integer');
      if (node.min !== undefined && value < node.min) fail(`must be ≥ ${node.min}`);
      if (node.xmin !== undefined && value <= node.xmin) fail(`must be > ${node.xmin}`);
      if (node.max !== undefined && value > node.max) fail(`must be ≤ ${node.max}`);
      if (node.xmax !== undefined && value >= node.xmax) fail(`must be < ${node.xmax}`);
      return;
    }
    case 's': {
      if (typeof value !== 'string') return fail('must be a string');
      if (node.dt && !DATE_TIME_RE.test(value)) return fail('must be an RFC 3339 date-time');
      if (node.re && !pattern(node.re).test(value)) fail(`must match ${node.re}`);
      return;
    }
    case 'b':
      if (typeof value !== 'boolean') fail('must be a boolean');
      return;
    case 'e':
      if (typeof value !== 'string' || !node.v.includes(value)) fail('must be one of ' + node.v.join(', '));
      return;
    case 'a': {
      if (!Array.isArray(value)) return fail('must be an array');
      value.forEach((item, i) => checkNode(node.i, item, `${path}[${i}]`, out));
      return;
    }
    case 'any':
      return;
    case 'o': {
      if (!isObject(value)) return fail('must be an object');
      if (node.p) {
        for (const key of Object.keys(value)) if (!(key in node.p)) out.push({ path: `${path}.${key}`, message: 'unknown property' });
        for (const [key, child] of Object.entries(node.p)) {
          const v = value[key];
          if (v === undefined) {
            if (node.r?.includes(key)) out.push({ path: `${path}.${key}`, message: 'required' });
            continue;
          }
          checkNode(child, v, `${path}.${key}`, out);
        }
      }
      if (node.ap) for (const [key, v] of Object.entries(value)) checkNode(node.ap, v, `${path}.${key}`, out);
    }
  }
}

/** Validate a type's `value` object. Empty array = valid. */
export function validateValue(type: HealthType, value: unknown, path = 'value'): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  checkNode(VALUE_SCHEMAS[type], value, path, out);
  return out;
}

/** Validate the record envelope (everything but `value`, which is type-specific). */
export function checkEnvelope(record: unknown, path: string, out: ValidationIssue[], options: EnvelopeOptions = {}): void {
  if (!isObject(record)) {
    out.push({ path, message: 'must be an object' });
    return;
  }
  const before = out.length;
  checkNode(ENVELOPE_SCHEMA, record, path, out);
  if (options.partial) {
    // A record about to be written has no id yet, and its source is completed by the provider.
    for (let i = out.length - 1; i >= before; i--) {
      const issue = out[i] as ValidationIssue;
      if (issue.message === 'required' && (issue.path === `${path}.id` || issue.path === `${path}.source`)) out.splice(i, 1);
    }
  }
  const type = record['type'];
  if (type === undefined) out.push({ path: `${path}.type`, message: 'required' });
  else if (typeof type !== 'string' || !(HEALTH_TYPES as readonly string[]).includes(type)) out.push({ path: `${path}.type`, message: 'unknown health type' });
  if (record['value'] === undefined) out.push({ path: `${path}.value`, message: 'required' });
}

/**
 * Validate a whole record: envelope, known type, value, and the time rules of SPEC §1.1
 * (end ≥ start; samples have start == end). Pass { partial: true } for records about to be written.
 */
export function validateRecord(record: unknown, options: EnvelopeOptions = {}, path = 'record'): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  checkEnvelope(record, path, out, options);
  if (out.length || !isObject(record)) return out;
  const type = record['type'] as HealthType;
  checkNode(VALUE_SCHEMAS[type], record['value'], `${path}.value`, out);
  const start = Date.parse(String(record['start']));
  const end = Date.parse(String(record['end']));
  if (end < start) out.push({ path: `${path}.end`, message: 'must not be before start' });
  else if (TYPE_MAPPINGS[type].kind === 'sample' && end !== start) out.push({ path: `${path}.end`, message: 'samples must have end == start' });
  return out;
}

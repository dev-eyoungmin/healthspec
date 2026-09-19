import { basename, type SpecBundle } from './load.js';
import { constCase } from './emit-ts.js';

const HEADER = '// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.\n';

/**
 * The spec's JSON Schemas as data the runtime interprets (packages/schema/src/validate.ts).
 *
 * Generating a function per constraint is the obvious approach and produces a fifth of a megabyte of JavaScript
 * for 182 types, which every app then bundles. The constraints themselves are small; only the code around them
 * was large.
 */

/** A schema fragment as a SchemaNode literal. `enums` collects the value arrays it references. */
function node(schema: any, bundle: SpecBundle, enums: Set<string>): string {
  if (schema.$ref) {
    const target = bundle.byBasename.get(basename(schema.$ref));
    if (!target) throw new Error(`Unresolvable $ref "${schema.$ref}"`);
    // Enums are exported by types.ts already, so reference them; anything else is inlined.
    if (Array.isArray(target.json.enum)) {
      const name = `${constCase(target.json.title as string)}_VALUES`;
      enums.add(name);
      return `{ k: 'e', v: ${name} }`;
    }
    return node(target.json, bundle, enums);
  }
  if (schema['x-any']) return `{ k: 'any' }`;
  if (schema.enum) return `{ k: 'e', v: ${JSON.stringify(schema.enum)} }`;
  switch (schema.type) {
    case 'integer':
    case 'number': {
      const parts = [
        `k: 'n'`,
        ...(schema.type === 'integer' ? ['int: true'] : []),
        ...(schema.minimum !== undefined ? [`min: ${schema.minimum}`] : []),
        ...(schema.maximum !== undefined ? [`max: ${schema.maximum}`] : []),
        ...(schema.exclusiveMinimum !== undefined ? [`xmin: ${schema.exclusiveMinimum}`] : []),
        ...(schema.exclusiveMaximum !== undefined ? [`xmax: ${schema.exclusiveMaximum}`] : []),
      ];
      return `{ ${parts.join(', ')} }`;
    }
    case 'string': {
      const parts = [`k: 's'`, ...(schema.format === 'date-time' ? ['dt: true'] : []), ...(schema.pattern ? [`re: ${JSON.stringify(schema.pattern)}`] : [])];
      return `{ ${parts.join(', ')} }`;
    }
    case 'boolean':
      return `{ k: 'b' }`;
    case 'array':
      return `{ k: 'a', i: ${node(schema.items, bundle, enums)} }`;
    case 'object': {
      const parts = [`k: 'o'`];
      if (schema.properties) {
        const props = Object.entries<any>(schema.properties).map(([key, value]) => `${JSON.stringify(key)}: ${node(value, bundle, enums)}`);
        parts.push(`p: { ${props.join(', ')} }`);
        if (schema.required?.length) parts.push(`r: ${JSON.stringify(schema.required)}`);
      }
      if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
        parts.push(`ap: ${node(schema.additionalProperties, bundle, enums)}`);
      }
      return `{ ${parts.join(', ')} }`;
    }
  }
  throw new Error(`Unsupported schema fragment: ${JSON.stringify(schema)}`);
}

export function emitValidators(b: SpecBundle): string {
  const enums = new Set<string>();
  const envelope = b.common.find((c) => c.json.title === 'HealthRecordEnvelope');
  if (!envelope) throw new Error('HealthRecordEnvelope missing');

  // `type` and `value` are checked separately: the type against HEALTH_TYPES, the value against its own schema.
  // They stay in the node as placeholders, so that they are not reported as unknown properties.
  const envelopeSchema = {
    ...envelope.json,
    properties: Object.fromEntries(Object.entries(envelope.json.properties).map(([k, v]) => [k, k === 'value' || k === 'type' ? { 'x-any': true } : v])),
    required: (envelope.json.required as string[]).filter((k) => k !== 'value' && k !== 'type'),
  };
  const envelopeNode = node(envelopeSchema, b, enums);
  const values = b.types.map((t) => `  ${t.json.title}: ${node(t.json, b, enums)},`);
  const commons = b.common.filter((c) => c !== envelope).map((c) => `  ${c.json.title}: ${node(c.json, b, enums)},`);

  return [
    HEADER,
    `import type { HealthType } from './types.js';`,
    `import { ${[...enums].sort().join(', ')} } from './types.js';`,
    `import type { SchemaNode } from '../validate.js';\n`,
    `/** The record envelope, minus \`type\` and \`value\`. Unknown properties are rejected (SPEC §1.1). */`,
    `export const ENVELOPE_SCHEMA: SchemaNode = ${envelopeNode};\n`,
    `/** Shared value shapes (profile, source, exercise route points). */`,
    `export const COMMON_SCHEMAS: Record<string, SchemaNode> = {`,
    ...commons,
    `};\n`,
    `/** Each type's \`value\` object. */`,
    `export const VALUE_SCHEMAS: Record<HealthType, SchemaNode> = {`,
    ...values,
    `};`,
  ].join('\n');
}

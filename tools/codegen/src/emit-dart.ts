import type { SpecBundle } from './load.js';

const HEADER = '// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.\n';

const camel = (s: string): string => s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
/** Dart reserves these; enum values that collide get a trailing underscore. */
const RESERVED = new Set(['default', 'in', 'is', 'as', 'if', 'else', 'for', 'while', 'switch', 'return', 'this', 'super', 'null', 'true', 'false', 'var', 'final', 'const', 'class', 'enum', 'new', 'void', 'part', 'show', 'hide', 'sync', 'async', 'await', 'index', 'values', 'other']);
const name = (s: string): string => {
  const c = camel(s);
  return RESERVED.has(c) ? `${c}_` : c;
};
/** Dart string literal — mapping strings contain quotes and may contain backslashes or `$`. */
const str = (s: string | undefined): string =>
  s === undefined ? 'null' : `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$')}'`;
const dartMap = (obj: Record<string, string | number>): string => {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '{}';
  return `{${entries.map(([k, v]) => `'${k}': ${typeof v === 'number' ? v : str(v)}`).join(', ')}}`;
};
const dartList = (xs: string[]): string => (xs.length === 0 ? 'const []' : `const [${xs.map((x) => str(x)).join(', ')}]`);

/** The spec's type system and platform mapping as a dependency-free Dart library, for Flutter implementations. */
export function emitDart(b: SpecBundle): string {
  const out: string[] = [HEADER];
  out.push(`/// HealthSpec — the specification's type system for Dart and Flutter.
///
/// This library carries no implementation: it describes which types exist, what each platform calls them and
/// which units the specification is written in. A Flutter plugin implements the behaviour on top.
library healthspec;
`);

  out.push('/// Every type the specification defines. `id` is the spec id used across all platforms.');
  out.push('enum HealthType {');
  const cases = b.types.map((t) => `  ${name(t.json.title)}(${str(t.json.title)})`);
  out.push(cases.join(',\n') + ';\n');
  out.push('  const HealthType(this.id);');
  out.push('  final String id;\n');
  out.push('  static HealthType? fromId(String id) {');
  out.push('    for (final value in HealthType.values) {');
  out.push('      if (value.id == id) return value;');
  out.push('    }');
  out.push('    return null;');
  out.push('  }');
  out.push('}\n');

  const categories = [...new Set(b.types.map((t) => t.json['x-healthspec'].category as string))].sort();
  out.push('enum HealthCategory {');
  out.push(categories.map((c) => `  ${name(c)}('${c}')`).join(',\n') + ';\n');
  out.push('  const HealthCategory(this.id);');
  out.push('  final String id;');
  out.push('}\n');
  out.push("/// sample: a point in time (start == end) · interval: accumulated over [start, end] · session: an episode");
  out.push('enum RecordKind { sample, interval, session }\n');
  out.push('enum AggregateFunction { sum, avg, min, max, count, duration }\n');

  for (const e of b.enums) {
    const title = e.json.title as string;
    out.push(`/// ${String(e.json.description ?? title).replace(/\s+/g, ' ')}`);
    out.push(`enum ${title} {`);
    out.push((e.json.enum as string[]).map((v) => `  ${name(v)}('${v}')`).join(',\n') + ';\n');
    out.push(`  const ${title}(this.id);`);
    out.push('  final String id;');
    out.push('}\n');
  }

  out.push(`/// How a HealthKit object backs a spec type.
class HealthKitMapping {
  const HealthKitMapping({
    required this.kind,
    this.identifier,
    this.identifiers = const [],
    this.fields = const {},
    this.unit,
    this.values = const {},
    this.valueField,
    required this.readable,
    required this.writable,
    this.since,
  });

  final String kind;
  final String? identifier;
  final List<String> identifiers;
  final Map<String, String> fields;
  final String? unit;
  final Map<String, int> values;
  final String? valueField;
  final bool readable;
  final bool writable;
  final String? since;
}

/// How a Health Connect record backs a spec type.
class HealthConnectMapping {
  const HealthConnectMapping({required this.record, required this.permission, required this.readable, required this.writable});

  final String record;
  final String permission;
  final bool readable;
  final bool writable;
}

class TypeInfo {
  const TypeInfo({
    required this.type,
    required this.category,
    required this.kind,
    required this.aggregate,
    this.healthKit,
    this.healthConnect,
    this.fieldUnits = const {},
  });

  final HealthType type;
  final HealthCategory category;
  final RecordKind kind;
  final List<AggregateFunction> aggregate;
  final HealthKitMapping? healthKit;
  final HealthConnectMapping? healthConnect;

  /// Value field → canonical unit symbol.
  final Map<String, String> fieldUnits;

  bool get isCrossPlatform => healthKit != null && healthConnect != null;
}
`);

  out.push('/// Every type the specification defines, keyed by id.');
  out.push('const Map<HealthType, TypeInfo> healthSpecTypes = {');
  for (const t of b.types) {
    const x = t.json['x-healthspec'];
    const hk = x.platforms?.healthkit;
    const hc = x.platforms?.healthconnect;
    const fieldUnits: Record<string, string> = {};
    for (const [k, v] of Object.entries<any>(t.json.properties ?? {})) if (v['x-unit']) fieldUnits[k] = v['x-unit'];
    const identifiers = new Set<string>();
    if (hk?.identifier) identifiers.add(hk.identifier);
    for (const i of hk?.identifiers ?? []) identifiers.add(i);
    for (const i of Object.values<string>(hk?.fields ?? {})) identifiers.add(i);
    const hkLiteral = hk
      ? `HealthKitMapping(kind: '${hk.kind}', identifier: ${str(hk.identifier)}, identifiers: ${dartList([...identifiers])}, fields: ${dartMap(hk.fields ?? {})}, unit: ${str(hk.unit)}, values: ${dartMap(hk.values ?? {})}, valueField: ${str(hk.valueField)}, readable: ${hk.read !== false}, writable: ${hk.write === true}, since: ${str(hk.since)})`
      : 'null';
    const hcLiteral = hc ? `HealthConnectMapping(record: '${hc.record}', permission: '${hc.permission}', readable: ${hc.read !== false}, writable: ${hc.write === true})` : 'null';
    out.push(
      `  HealthType.${name(t.json.title)}: TypeInfo(type: HealthType.${name(t.json.title)}, category: HealthCategory.${name(x.category)}, kind: RecordKind.${x.kind}, aggregate: const [${(x.aggregate ?? []).map((a: string) => `AggregateFunction.${a}`).join(', ')}], healthKit: ${hkLiteral}, healthConnect: ${hcLiteral}, fieldUnits: ${dartMap(fieldUnits)}),`,
    );
  }
  out.push('};\n');

  const of = (pred: (t: any) => boolean) => b.types.filter(pred).map((t) => `HealthType.${name(t.json.title)}`);
  const cross = of((t) => t.json['x-healthspec'].platforms?.healthkit && t.json['x-healthspec'].platforms?.healthconnect);
  const ios = of((t) => t.json['x-healthspec'].platforms?.healthkit && !t.json['x-healthspec'].platforms?.healthconnect);
  const android = of((t) => !t.json['x-healthspec'].platforms?.healthkit && t.json['x-healthspec'].platforms?.healthconnect);
  out.push(`/// Types both platforms persist (${cross.length}).`);
  out.push(`const Set<HealthType> crossPlatformTypes = {${cross.join(', ')}};\n`);
  out.push(`/// Types only Apple HealthKit persists (${ios.length}).`);
  out.push(`const Set<HealthType> iosOnlyTypes = {${ios.join(', ')}};\n`);
  out.push(`/// Types only Android Health Connect persists (${android.length}).`);
  out.push(`const Set<HealthType> androidOnlyTypes = {${android.join(', ')}};`);
  return out.join('\n') + '\n';
}

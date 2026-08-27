import type { SpecBundle } from './load.js';

const HEADER = '// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.\n';

const camel = (s: string): string => s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
const pascal = (s: string): string => {
  const c = camel(s);
  return c.charAt(0).toUpperCase() + c.slice(1);
};
/** Swift keywords that must be escaped when used as enum case names. */
const RESERVED = new Set(['default', 'internal', 'operator', 'protocol', 'repeat', 'return', 'self', 'static', 'switch', 'where', 'while', 'true', 'false', 'nil', 'in', 'is', 'as', 'for', 'if', 'else', 'none']);
const caseName = (s: string): string => {
  const c = camel(s);
  return RESERVED.has(c) ? `\`${c}\`` : c;
};
const doc = (text: string | undefined, indent = ''): string => (text ? `${indent}/// ${String(text).replace(/\s+/g, ' ')}\n` : '');
/** Swift string literal — mapping strings contain quotes (`HKDevice.model contains "Watch"`). */
const lit = (s: string): string => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

/** The spec's type system, enum mappings and HealthKit tables as a dependency-free Swift module. */
export function emitSwift(b: SpecBundle): string {
  const out: string[] = [HEADER, 'import Foundation\n'];
  const ids = b.types.map((t) => t.json.title as string);

  out.push('// MARK: - Health types\n');
  out.push('/// Every type the specification defines. The raw value is the spec id used across all platforms.');
  out.push('public enum HealthType: String, CaseIterable, Sendable, Codable {');
  for (const t of b.types) {
    out.push(doc(t.json.description, '  ') + `  case ${caseName(t.json.title)} = ${lit(t.json.title)}`);
  }
  out.push('}\n');

  const categories = [...new Set(b.types.map((t) => t.json['x-healthspec'].category as string))].sort();
  out.push('public enum HealthCategory: String, CaseIterable, Sendable, Codable {');
  for (const c of categories) out.push(`  case ${caseName(c)} = "${c}"`);
  out.push('}\n');
  out.push('/// sample: a point in time (start == end) · interval: accumulated over [start, end] · session: an episode');
  out.push('public enum RecordKind: String, Sendable, Codable {\n  case sample, interval, session\n}\n');
  out.push('public enum AggregateFunction: String, Sendable, Codable {\n  case sum, avg, min, max, count, duration\n}\n');

  out.push('// MARK: - Shared enumerations\n');
  for (const e of b.enums) {
    const name = e.json.title as string;
    out.push(doc(e.json.description));
    out.push(`public enum ${name}: String, CaseIterable, Sendable, Codable {`);
    for (const v of e.json.enum as string[]) out.push(`  case ${caseName(v)} = "${v}"`);
    out.push('}\n');
  }

  out.push('// MARK: - Platform mapping\n');
  out.push(`/// How a HealthKit object backs a spec type.
public enum HealthKitKind: String, Sendable {
  case quantity, category, correlation, workout, derived, multi, series, special
  case electrocardiogram, heartbeatSeries, stateOfMind, activitySummary, clinical, medicationDose
}

public struct HealthKitMapping: Sendable {
  public let kind: HealthKitKind
  /// Primary object type identifier, when the type maps to exactly one.
  public let identifier: String?
  /// Every identifier that must be authorized for this type.
  public let identifiers: [String]
  /// Value field → object type identifier, for types spread across several quantities.
  public let fields: [String: String]
  /// HKUnit string used when reading and writing.
  public let unit: String?
  /// Spec enum value → HKCategoryValue raw value.
  public let values: [String: Int]
  /// The value field carrying the category enum.
  public let valueField: String?
  public let readable: Bool
  public let writable: Bool
  /// Minimum OS version when newer than the library baseline.
  public let since: String?
}

public struct HealthConnectMapping: Sendable {
  public let record: String
  public let permission: String
  public let readable: Bool
  public let writable: Bool
}

public struct TypeInfo: Sendable {
  public let type: HealthType
  public let category: HealthCategory
  public let kind: RecordKind
  public let aggregate: [AggregateFunction]
  public let healthKit: HealthKitMapping?
  public let healthConnect: HealthConnectMapping?
  /// Value field → canonical unit symbol.
  public let fieldUnits: [String: String]
}\n`);

  const swiftDict = (obj: Record<string, string | number>): string => {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '[:]';
    return `[${entries.map(([k, v]) => `${lit(k)}: ${typeof v === 'number' ? v : lit(v)}`).join(', ')}]`;
  };
  const swiftArray = (xs: string[]): string => (xs.length === 0 ? '[]' : `[${xs.map(lit).join(', ')}]`);
  const opt = (v: string | undefined): string => (v === undefined ? 'nil' : lit(v));

  out.push('public enum HealthSpec {');
  out.push('  /// Every type the specification defines, keyed by id.');
  out.push('  public static let types: [HealthType: TypeInfo] = [');
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
      ? `HealthKitMapping(kind: .${hk.kind}, identifier: ${opt(hk.identifier)}, identifiers: ${swiftArray([...identifiers])}, fields: ${swiftDict(hk.fields ?? {})}, unit: ${opt(hk.unit)}, values: ${swiftDict(hk.values ?? {})}, valueField: ${opt(hk.valueField)}, readable: ${hk.read !== false}, writable: ${hk.write === true}, since: ${opt(hk.since)})`
      : 'nil';
    const hcLiteral = hc ? `HealthConnectMapping(record: "${hc.record}", permission: "${hc.permission}", readable: ${hc.read !== false}, writable: ${hc.write === true})` : 'nil';
    out.push(
      `    .${caseName(t.json.title)}: TypeInfo(type: .${caseName(t.json.title)}, category: .${caseName(x.category)}, kind: .${x.kind}, aggregate: [${(x.aggregate ?? []).map((a: string) => `.${a}`).join(', ')}], healthKit: ${hkLiteral}, healthConnect: ${hcLiteral}, fieldUnits: ${swiftDict(fieldUnits)}),`,
    );
  }
  out.push('  ]\n');

  const crossPlatform = b.types.filter((t) => t.json['x-healthspec'].platforms?.healthkit && t.json['x-healthspec'].platforms?.healthconnect).map((t) => t.json.title as string);
  const appleOnly = b.types.filter((t) => t.json['x-healthspec'].platforms?.healthkit && !t.json['x-healthspec'].platforms?.healthconnect).map((t) => t.json.title as string);
  out.push(`  /// Types both platforms persist (${crossPlatform.length}).`);
  out.push(`  public static let crossPlatform: Set<HealthType> = [${crossPlatform.map((i) => `.${caseName(i)}`).join(', ')}]\n`);
  out.push(`  /// Types only Apple HealthKit persists (${appleOnly.length}).`);
  out.push(`  public static let appleOnly: Set<HealthType> = [${appleOnly.map((i) => `.${caseName(i)}`).join(', ')}]\n`);
  out.push('  /// Object type identifiers that must be authorized to use a type.');
  out.push('  public static func identifiers(for type: HealthType) -> [String] { types[type]?.healthKit?.identifiers ?? [] }\n');
  out.push('  /// Whether HealthKit backs this type at all.');
  out.push('  public static func isSupportedOnApple(_ type: HealthType) -> Bool { types[type]?.healthKit != nil }');
  out.push('}\n');

  for (const e of b.enums) {
    const mapping = e.json['x-healthspec']?.mapping;
    if (!mapping) continue;
    const name = e.json.title as string;
    const pairs = (e.json.enum as string[]).filter((v) => mapping[v]?.healthkit).map((v) => `    .${caseName(v)}: ${lit(mapping[v].healthkit)}`);
    if (pairs.length === 0) continue;
    out.push(`public extension ${name} {`);
    out.push(`  /// HealthKit constant this value maps to, as written in the specification.`);
    out.push(`  static let healthKitMapping: [${name}: String] = [\n${pairs.join(',\n')},\n  ]`);
    out.push(`  var healthKitValue: String? { Self.healthKitMapping[self] }`);
    out.push('}\n');
  }

  void ids;
  void pascal;
  return out.join('\n');
}

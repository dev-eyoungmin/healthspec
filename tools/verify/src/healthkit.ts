/**
 * Cross-checks every HealthKit mapping in spec/schema against @kingstinct/react-native-healthkit's
 * `healthkit.generated.ts`, which is generated from the HealthKit headers and is therefore authoritative for
 * identifier spelling, category raw values and enum membership.
 *
 * Usage: tsx tools/verify/src/healthkit.ts <path-to-healthkit.generated.ts>
 * Exits non-zero when a mapping cannot be confirmed.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { confirmedBy, loadSources, type LoadedSource } from './sources.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const sourceRoot = args.find((a) => !a.startsWith('--'));
if (!sourceRoot) {
  console.error('usage: tsx tools/verify/src/healthkit.ts <sources-dir> [--apply]');
  process.exit(2);
}

const sources = await loadSources(sourceRoot, [
  {
    id: 'kingstinct-generated',
    kind: 'header-generated',
    description: '@kingstinct/react-native-healthkit — generated from the HealthKit headers',
    files: ['kh/react-native-healthkit-master/packages/react-native-healthkit/src/generated/healthkit.generated.ts'],
  },
  {
    id: 'react-native-health',
    kind: 'hand-written',
    description: 'react-native-health (AE Studio) — Objective-C bindings and TypeScript declarations',
    files: [
      'rnh/react-native-health-master/index.d.ts',
      'rnh/react-native-health-master/RCTAppleHealthKit/RCTAppleHealthKit+Utils.m',
      'rnh/react-native-health-master/RCTAppleHealthKit/RCTAppleHealthKit+Queries.m',
      'rnh/react-native-health-master/RCTAppleHealthKit/RCTAppleHealthKit+Methods_Vitals.m',
      'rnh/react-native-health-master/RCTAppleHealthKit/RCTAppleHealthKit+Methods_Dietary.m',
      'rnh/react-native-health-master/docs/permissions.md',
    ],
  },
]);
if (sources.length === 0) {
  console.error('no verification sources found');
  process.exit(2);
}
const generatedSource = sources.find((s) => s.kind === 'header-generated');
const generated = generatedSource?.text ?? '';

/** Every HK*TypeIdentifier string literal the generated file declares. */
const known = new Set([...generated.matchAll(/'(HK(?:Quantity|Category|Correlation|Characteristic|Clinical)TypeIdentifier[A-Za-z0-9]+)'/g)].map((m) => m[1] as string));
/** Identifiers the generated file marks read-only (no `save*` path). */
const readOnlyBlock = generated.slice(generated.indexOf('QuantityTypeIdentifierReadOnly'), generated.indexOf('export type QuantityTypeIdentifierWriteable') >= 0 ? generated.indexOf('export type QuantityTypeIdentifierWriteable') : undefined);
const readOnly = new Set([...readOnlyBlock.matchAll(/'(HKQuantityTypeIdentifier[A-Za-z0-9]+)'/g)].map((m) => m[1] as string));

/** enum Name { case = 1, … } → { case: 1 } */
function parseEnum(name: string): Record<string, number> | undefined {
  const start = generated.indexOf(`enum ${name} {`);
  if (start < 0) return undefined;
  const body = generated.slice(start, generated.indexOf('}', start));
  const out: Record<string, number> = {};
  for (const m of body.matchAll(/^\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*(-?\d+)/gm)) out[m[1] as string] = Number(m[2]);
  return out;
}

/** Spec category enum → the generated enum that defines its raw values. */
const SEVERITY_SYMPTOMS = [
  'abdominal_cramps', 'acne', 'bladder_incontinence', 'bloating', 'breast_pain', 'chest_tightness_or_pain', 'chills', 'constipation',
  'coughing', 'diarrhea', 'dizziness', 'dry_skin', 'fainting', 'fatigue', 'fever', 'generalized_body_ache', 'hair_loss', 'headache',
  'heartburn', 'hot_flashes', 'loss_of_smell', 'loss_of_taste', 'lower_back_pain', 'memory_lapse', 'nausea', 'night_sweats',
  'pelvic_pain', 'rapid_pounding_or_fluttering_heartbeat', 'runny_nose', 'shortness_of_breath', 'sinus_congestion', 'skipped_heartbeat',
  'sore_throat', 'vaginal_dryness', 'vomiting', 'wheezing',
];

const CATEGORY_ENUM: Record<string, string> = {
  ...Object.fromEntries(SEVERITY_SYMPTOMS.map((s) => [`symptom_${s}`, 'CategoryValueSeverity'])),
  symptom_mood_changes: 'CategoryValuePresence',
  symptom_sleep_changes: 'CategoryValuePresence',
  bleeding_during_pregnancy: 'CategoryValueVaginalBleeding',
  bleeding_after_pregnancy: 'CategoryValueVaginalBleeding',
  sleep_session: 'CategoryValueSleepAnalysis',
  menstruation_flow: 'CategoryValueMenstrualFlow',
  ovulation_test: 'CategoryValueOvulationTestResult',
  cervical_mucus: 'CategoryValueCervicalMucusQuality',
  pregnancy_test: 'CategoryValuePregnancyTestResult',
  progesterone_test: 'CategoryValueProgesteroneTestResult',
  contraceptive: 'CategoryValueContraceptive',
  apple_stand_hour: 'CategoryValueAppleStandHour',
  apple_walking_steadiness_event: 'CategoryValueAppleWalkingSteadinessEvent',
  symptom_appetite_changes: 'CategoryValueAppetiteChanges',
};
/** Spec value → the generated enum case it should equal, where names differ. */
const NOT_PRESENT = { not_present: 'notPresent' };
const CASE_ALIAS: Record<string, Record<string, string>> = {
  ...Object.fromEntries(SEVERITY_SYMPTOMS.map((s) => [`symptom_${s}`, NOT_PRESENT])),
  symptom_mood_changes: NOT_PRESENT,
  symptom_sleep_changes: NOT_PRESENT,
  menstruation_flow: { unknown: 'unspecified' },
  bleeding_during_pregnancy: {},
  bleeding_after_pregnancy: {},
  sleep_session: { light: 'asleepCore', deep: 'asleepDeep', rem: 'asleepREM', sleeping: 'asleepUnspecified', in_bed: 'inBed' },
  ovulation_test: { positive: 'luteinizingHormoneSurge', high: 'estrogenSurge', inconclusive: 'indeterminate' },
  cervical_mucus: { egg_white: 'eggWhite' },
  contraceptive: { intrauterine_device: 'intrauterineDevice', intravaginal_ring: 'intravaginalRing' },
  apple_walking_steadiness_event: { initial_low: 'initialLow', initial_very_low: 'initialVeryLow', repeat_low: 'repeatLow', repeat_very_low: 'repeatVeryLow' },
  symptom_appetite_changes: { no_change: 'noChange' },
  pregnancy_test: { indeterminate: 'indeterminate' },
  progesterone_test: { indeterminate: 'indeterminate' },
};

const snakeToCamel = (s: string) => s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

interface Issue {
  type: string;
  severity: 'error' | 'warn';
  message: string;
}
const issues: Issue[] = [];
/** type id → sources that confirmed every identifier it maps */
const confirmed = new Map<string, string[]>();
const err = (type: string, message: string) => issues.push({ type, severity: 'error', message });
const warn = (type: string, message: string) => issues.push({ type, severity: 'warn', message });

const dir = path.join(ROOT, 'spec/schema/types');
const files = (await readdir(dir)).filter((f) => f.endsWith('.json')).sort();
let checkedIds = 0;
let checkedValues = 0;

for (const file of files) {
  const json = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
  const id = json.title as string;
  const hk = json['x-healthspec'].platforms?.healthkit;
  if (!hk) continue;

  const identifiers: string[] = [];
  if (hk.identifier) identifiers.push(hk.identifier);
  for (const i of hk.identifiers ?? []) identifiers.push(i);
  for (const i of Object.values<string>(hk.fields ?? {})) identifiers.push(i);

  const provenance = new Set<string>();
  let allConfirmed = identifiers.length > 0;
  for (const identifier of identifiers) {
    checkedIds++;
    // Non-sample data (ECG, heartbeat series, state of mind, workouts, activity summaries, medications) are not
    // TypeIdentifier string constants, so no source declares a literal for them.
    if (/^HK(DataTypeIdentifier|WorkoutTypeIdentifier|ActivitySummaryTypeIdentifier|WorkoutRouteTypeIdentifier)/.test(identifier)) {
      allConfirmed = false;
      continue;
    }
    if (known.has(identifier)) {
      provenance.add(generatedSource!.id);
      if (hk.write === true && readOnly.has(identifier)) err(id, `"${identifier}" is read-only in HealthKit but the mapping declares write: true`);
      continue;
    }
    // Sources spell identifiers differently: TypeScript as string literals, Objective-C as bare constants.
    const rest = sources.filter((s) => s !== generatedSource);
    const others = [`'${identifier}'`, `"${identifier}"`, identifier].flatMap((form) => confirmedBy(rest, form));
    const unique = [...new Set(others.map((s) => s.id))];
    if (unique.length === 0) {
      err(id, `no source declares HealthKit identifier "${identifier}"`);
      allConfirmed = false;
    } else {
      for (const u of unique) provenance.add(u);
    }
  }
  if (allConfirmed && provenance.size > 0) confirmed.set(id, [...provenance].sort());

  const enumName = CATEGORY_ENUM[id];
  if (enumName && hk.values) {
    const cases = parseEnum(enumName);
    if (!cases) {
      warn(id, `generated file has no enum ${enumName}`);
    } else {
      for (const [specValue, raw] of Object.entries<number>(hk.values)) {
        checkedValues++;
        const caseName = CASE_ALIAS[id]?.[specValue] ?? snakeToCamel(specValue);
        const expected = cases[caseName];
        if (expected === undefined) err(id, `${enumName} has no case "${caseName}" (spec value "${specValue}")`);
        else if (expected !== raw) err(id, `${enumName}.${caseName} is ${expected}, spec says ${raw} for "${specValue}"`);
      }
    }
  } else if (hk.kind === 'category' && hk.values && Object.keys(hk.values).length > 0 && !enumName) {
    warn(id, `category values are not cross-checked (no enum mapped): ${Object.keys(hk.values).join(', ')}`);
  }
}

if (apply) {
  let written = 0;
  for (const file of files) {
    const filePath = path.join(dir, file);
    const json = JSON.parse(await readFile(filePath, 'utf8'));
    const id = json.title as string;
    const hk = json['x-healthspec'].platforms?.healthkit;
    if (!hk) continue;
    const sourcesFor = confirmed.get(id);
    const hadError = issues.some((i) => i.type === id && i.severity === 'error');
    const next = sourcesFor && !hadError ? { identifiers: sourcesFor } : undefined;
    const current = JSON.stringify(hk.verifiedBy);
    if (JSON.stringify(next) === current) continue;
    if (next) hk.verifiedBy = next;
    else delete hk.verifiedBy;
    await writeFile(filePath, JSON.stringify(json, null, 2) + '\n');
    written++;
  }
  console.log(`applied provenance to ${written} schema file(s)`);
}

const errors = issues.filter((i) => i.severity === 'error');
const warns = issues.filter((i) => i.severity === 'warn');
console.log(`HealthKit sources: ${sources.map((s) => `${s.id} (${s.kind})`).join(', ')}`);
console.log(`HealthKit: checked ${checkedIds} identifiers and ${checkedValues} category values across ${files.length} types; ${confirmed.size} types fully confirmed`);
for (const i of errors) console.error(`✖ ${i.type}: ${i.message}`);
for (const i of warns) console.warn(`… ${i.type}: ${i.message}`);
console.log(`${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length ? 1 : 0);

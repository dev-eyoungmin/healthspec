/**
 * Cross-checks every Health Connect mapping in spec/schema against react-native-health-connect's Kotlin
 * bindings, which compile against androidx.health.connect:connect-client. A confirmation means an
 * independently maintained library agrees the record class and field exist — not that it ran on a device.
 *
 * Usage: tsx tools/verify/src/healthconnect.ts <sources-dir> [--apply]
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadSources } from './sources.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const sourceRoot = args.find((a) => !a.startsWith('--'));
if (!sourceRoot) {
  console.error('usage: tsx tools/verify/src/healthconnect.ts <sources-dir> [--apply]');
  process.exit(2);
}

const HC = 'hc/react-native-health-connect-main';
const recordFiles = await readdir(path.join(sourceRoot, HC, 'android/src/main/java/dev/matinzd/healthconnect/records')).catch(() => [] as string[]);
const sources = await loadSources(sourceRoot, [
  {
    id: 'react-native-health-connect',
    kind: 'hand-written',
    description: 'react-native-health-connect — Kotlin bindings compiled against connect-client',
    files: [
      ...recordFiles.map((f) => `${HC}/android/src/main/java/dev/matinzd/healthconnect/records/${f}`),
      `${HC}/android/src/main/java/dev/matinzd/healthconnect/utils/HealthConnectUtils.kt`,
      `${HC}/src/types/records.types.ts`,
      `${HC}/src/types/aggregate.types.ts`,
    ],
  },
]);
if (sources.length === 0) {
  console.error('no verification sources found');
  process.exit(2);
}
const kotlin = sources[0]!;

interface Issue {
  type: string;
  severity: 'error' | 'warn';
  message: string;
}
const issues: Issue[] = [];
const err = (type: string, message: string) => issues.push({ type, severity: 'error', message });
const warn = (type: string, message: string) => issues.push({ type, severity: 'warn', message });
const confirmed = new Map<string, string[]>();

/** Field paths in the spec may be `samples[].beatsPerMinute`; the property name is the last segment. */
const propertyOf = (field: string): string => (field.split('.').pop() ?? field).replace(/\[\]$/, '');

const dir = path.join(ROOT, 'spec/schema/types');
const files = (await readdir(dir)).filter((f) => f.endsWith('.json')).sort();
let checkedRecords = 0;
let checkedFields = 0;

for (const file of files) {
  const json = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
  const id = json.title as string;
  const hc = json['x-healthspec'].platforms?.healthconnect;
  if (!hc) continue;

  // Personal Health Record resources are not Record classes; the source predates that API.
  if (hc.medicalResourceType) {
    warn(id, `medical resource "${hc.medicalResourceType}" is not cross-checkable against this source`);
    continue;
  }

  checkedRecords++;
  const recordOk = new RegExp(`\\b${hc.record}\\b`).test(kotlin.text);
  if (!recordOk) {
    err(id, `no source declares Health Connect record "${hc.record}"`);
    continue;
  }

  const fields = [hc.field, ...Object.values<string>(hc.fields ?? {})].filter((f): f is string => typeof f === 'string');
  let fieldsOk = true;
  for (const field of fields) {
    checkedFields++;
    const prop = propertyOf(field);
    // Kotlin bindings reference the property directly (record.count) or via a map key ("count").
    const patterns = [new RegExp(`\\.${prop}\\b`), new RegExp(`"${prop}"`), new RegExp(`\\b${prop}\\s*=`)];
    if (!patterns.some((p) => p.test(kotlin.text))) {
      err(id, `record "${hc.record}" — no source references field "${prop}"`);
      fieldsOk = false;
    }
  }
  if (fieldsOk) confirmed.set(id, [kotlin.id]);
}

if (apply) {
  let written = 0;
  for (const file of files) {
    const filePath = path.join(dir, file);
    const json = JSON.parse(await readFile(filePath, 'utf8'));
    const id = json.title as string;
    const hc = json['x-healthspec'].platforms?.healthconnect;
    if (!hc) continue;
    const sourcesFor = confirmed.get(id);
    const hadError = issues.some((i) => i.type === id && i.severity === 'error');
    const next = sourcesFor && !hadError ? { record: sourcesFor } : undefined;
    if (JSON.stringify(next) === JSON.stringify(hc.verifiedBy)) continue;
    if (next) hc.verifiedBy = next;
    else delete hc.verifiedBy;
    await writeFile(filePath, JSON.stringify(json, null, 2) + '\n');
    written++;
  }
  console.log(`applied provenance to ${written} schema file(s)`);
}

const errors = issues.filter((i) => i.severity === 'error');
const warns = issues.filter((i) => i.severity === 'warn');
console.log(`Health Connect sources: ${sources.map((s) => `${s.id} (${s.kind})`).join(', ')}`);
console.log(`Health Connect: checked ${checkedRecords} records and ${checkedFields} fields; ${confirmed.size} types fully confirmed`);
for (const i of errors) console.error(`✖ ${i.type}: ${i.message}`);
for (const i of warns) console.warn(`… ${i.type}: ${i.message}`);
console.log(`${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length ? 1 : 0);

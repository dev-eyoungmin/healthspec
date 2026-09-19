import { HEALTH_TYPES, TYPE_MAPPINGS, counterpartsOf, unsupportedFields, type HealthType } from '@healthspec/schema';

const list = (items: readonly string[]) => (items.length ? items.join(', ') : '—');

/** One type's mapping on both platforms, with the differences an implementer trips over. Plain text. */
export function describeMapping(type: string): string {
  if (!(HEALTH_TYPES as readonly string[]).includes(type)) {
    const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const wanted = squash(type);
    const near = HEALTH_TYPES.filter((t) => squash(t).includes(wanted) || wanted.includes(squash(t))).slice(0, 8);
    throw new Error(`unknown health type "${type}"${near.length ? ` — did you mean ${near.join(', ')}?` : ''}`);
  }
  const t = type as HealthType;
  const m = TYPE_MAPPINGS[t];
  const lines: string[] = [];
  lines.push(`${t}  (${m.category} · ${m.kind} · since ${m.since})`);
  const fields = Object.entries(m.fieldUnits);
  lines.push(`  value fields: ${fields.length ? fields.map(([f, u]) => `${f} [${u}]`).join(', ') : 'none (enum or structured value)'}`);
  lines.push(`  aggregate: ${list(m.aggregate)}`);

  lines.push('', 'Apple HealthKit');
  const hk = m.healthkit;
  if (!hk) {
    lines.push('  not available');
  } else {
    lines.push(`  ${hk.kind}: ${hk.identifier ?? list(hk.identifiers ?? [])}`);
    if (hk.fields) lines.push(`  fields: ${Object.entries(hk.fields).map(([f, id]) => `${f} → ${id}`).join(', ')}`);
    if (hk.unit) lines.push(`  unit: ${hk.unit}`);
    lines.push(`  read: ${hk.read ? 'yes' : 'no'} · write: ${hk.write ? 'yes' : 'no'}${hk.since ? ` · requires ${hk.since}` : ''}`);
    for (const [field, meta] of Object.entries(hk.metadataFields ?? {})) lines.push(`  ${field} ↔ metadata ${meta.key}${meta.required ? ' (required by HealthKit)' : ''}`);
    const missing = unsupportedFields(t, 'ios');
    if (missing.length) lines.push(`  never populated: ${missing.join(', ')}`);
    for (const note of hk.notes ?? []) lines.push(`  · ${note}`);
  }

  lines.push('', 'Android Health Connect');
  const hc = m.healthconnect;
  if (!hc) {
    lines.push('  not available');
  } else {
    lines.push(`  record: ${hc.record}${hc.field ? ` (${hc.field})` : ''}${hc.series ? ' — series, one spec record per sample' : ''}`);
    lines.push(`  permission: ${hc.read ? `android.permission.health.READ_${hc.permission}` : '—'}${hc.write ? ` · android.permission.health.WRITE_${hc.permission}` : ''}`);
    if (hc.feature) lines.push(`  needs feature: HealthConnectFeatures.FEATURE_${hc.feature}`);
    const missing = unsupportedFields(t, 'android');
    if (missing.length) lines.push(`  never populated: ${missing.join(', ')}`);
    for (const note of hc.notes ?? []) lines.push(`  · ${note}`);
  }

  const counterparts = counterpartsOf(t);
  if (counterparts.length) {
    lines.push('', 'Counterparts');
    for (const c of counterparts) lines.push(`  ${c.type} — ${c.interchangeable ? 'interchangeable' : 'NOT interchangeable'}: ${c.reason}`);
  }
  for (const note of m.notes) lines.push(`· ${note}`);
  return lines.join('\n');
}

import type { SpecBundle } from './load.js';
import { platformSection } from './emit-platform-docs.js';

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

function hkCell(hk: any): string {
  if (!hk) return '—';
  const ids: string[] = [];
  if (hk.identifier) ids.push(hk.identifier);
  for (const i of hk.identifiers ?? []) ids.push(i);
  for (const [f, i] of Object.entries<string>(hk.fields ?? {})) ids.push(`${f} → ${i}`);
  const unit = hk.unit ? ` · \`${hk.unit}\`` : '';
  const rw = hk.write ? '' : ' · read-only';
  return ids.map((i) => `\`${i.replace(/^HK(Quantity|Category|Correlation|Workout)TypeIdentifier/, '')}\``).join('<br>') + unit + rw;
}

function hcCell(hc: any): string {
  if (!hc) return '—';
  const fields = hc.field ? ` · ${hc.field}` : hc.fields ? ' · ' + Object.entries<string>(hc.fields).map(([f, p]) => `${f} → ${p}`).join(', ') : '';
  const unit = hc.unit ? ` · \`${hc.unit}\`` : '';
  const series = hc.series ? ' · series' : '';
  return `\`${hc.record}\`${fields}${unit}${series}`;
}

export function emitMappingDocs(b: SpecBundle): string {
  const lines: string[] = [];
  lines.push('# Platform mapping');
  lines.push('');
  lines.push('<!-- GENERATED from spec/schema by `pnpm codegen` — edit the JSON, not this file. -->');
  lines.push('');
  lines.push(`${b.types.length} health types. ◐ marks a type available on only one platform; the other platform reports it as unsupported via \`capabilities()\`.`);
  lines.push('');
  lines.push(...platformSection(b));
  lines.push('## Type mapping');
  lines.push('');
  lines.push('| Type | Category | Kind | HealthKit | Health Connect | Canonical units | Notes |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const t of b.types) {
    const x = t.json['x-healthspec'];
    const p = x.platforms ?? {};
    const single = !(p.healthkit && p.healthconnect) ? ' ◐' : '';
    const units = Object.entries<any>(t.json.properties ?? {})
      .filter(([, v]) => v['x-unit'])
      .map(([k, v]) => `${k}: ${v['x-unit']}`)
      .join('<br>');
    const notes = [...(x.notes ?? []), ...(p.healthkit?.notes ?? []).map((n: string) => `HK: ${n}`), ...(p.healthconnect?.notes ?? []).map((n: string) => `HC: ${n}`)];
    lines.push(
      `| \`${t.json.title}\`${single} | ${x.category} | ${x.kind} | ${cell(hkCell(p.healthkit))} | ${cell(hcCell(p.healthconnect))} | ${cell(units || '—')} | ${cell(notes.join(' '))} |`,
    );
  }
  lines.push('');
  lines.push('## Enumerations');
  for (const e of b.enums) {
    const mapping = e.json['x-healthspec']?.mapping;
    if (!mapping) continue;
    lines.push('');
    lines.push(`### ${e.json.title}${e.json['x-healthspec'].verified === false ? ' (draft — unverified)' : ''}`);
    lines.push('');
    if (e.json.description) lines.push(e.json.description), lines.push('');
    lines.push('| Value | HealthKit | Health Connect |');
    lines.push('|---|---|---|');
    for (const v of e.json.enum as string[]) {
      const m = mapping[v] ?? {};
      lines.push(`| \`${v}\` | ${m.healthkit ? cell('`' + m.healthkit + '`') : '—'} | ${m.healthconnect ? cell('`' + m.healthconnect + '`') : '—'} |`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

import type { SpecBundle } from './load.js';
import { fieldSupport } from './emit-platform.js';

const code = (s: string) => '`' + s + '`';
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

/** The "what differs between platforms" chapter of the generated mapping doc. */
export function platformSection(b: SpecBundle): string[] {
  const info = b.types.map((t) => ({ id: t.json.title as string, x: t.json['x-healthspec'], props: t.json.properties ?? {} }));
  const hasHk = (i: (typeof info)[number]) => Boolean(i.x.platforms?.healthkit);
  const hasHc = (i: (typeof info)[number]) => Boolean(i.x.platforms?.healthconnect);
  const cross = info.filter((i) => hasHk(i) && hasHc(i));
  const ios = info.filter((i) => hasHk(i) && !hasHc(i));
  const android = info.filter((i) => !hasHk(i) && hasHc(i));

  const lines: string[] = [];
  lines.push('## Platform differences');
  lines.push('');
  lines.push('Every type below is part of the spec; what differs is which platform persists it. Check at runtime with');
  lines.push(`${code('store.support(type)')} — which also reports missing fields and counterparts — or at build time with`);
  lines.push(`${code('CROSS_PLATFORM_TYPES')} / ${code('IOS_ONLY_TYPES')} / ${code('ANDROID_ONLY_TYPES')} from ${code('@healthspec/schema')}.`);
  lines.push('');
  lines.push('| Availability | Types |');
  lines.push('|---|---:|');
  lines.push(`| Both platforms | ${cross.length} |`);
  lines.push(`| Apple HealthKit only | ${ios.length} |`);
  lines.push(`| Android Health Connect only | ${android.length} |`);
  lines.push(`| **Total** | **${info.length}** |`);
  lines.push('');
  lines.push(`### Apple HealthKit only (${ios.length})`);
  lines.push('');
  lines.push(ios.map((i) => code(i.id)).join(', ') || '_none_');
  lines.push('');
  lines.push(`### Android Health Connect only (${android.length})`);
  lines.push('');
  lines.push(android.map((i) => code(i.id)).join(', ') || '_none_');
  lines.push('');

  // Fields absent on one platform, derived by the same rule the generated tables use.
  const fieldRows: string[] = [];
  for (const i of cross) {
    const t = b.types.find((x) => x.json.title === i.id)!;
    const support = fieldSupport(t);
    const missingIos = Object.entries(support).filter(([, f]) => !f.ios).map(([n]) => n);
    const missingAndroid = Object.entries(support).filter(([, f]) => !f.android).map(([n]) => n);
    if (missingIos.length || missingAndroid.length) {
      fieldRows.push(`| ${code(i.id)} | ${missingIos.map(code).join(', ') || '—'} | ${missingAndroid.map(code).join(', ') || '—'} |`);
    }
  }
  if (fieldRows.length) {
    lines.push('### Fields absent on one platform');
    lines.push('');
    lines.push('These types exist on both platforms, but the listed value fields are never populated there.');
    lines.push(`${code('store.support(type).missingFields')} returns the same list at runtime.`);
    lines.push('');
    lines.push('| Type | Absent on iOS | Absent on Android |');
    lines.push('|---|---|---|');
    lines.push(...fieldRows);
    lines.push('');
  }

  const counterpartRows: string[] = [];
  for (const i of info) {
    for (const c of (i.x.counterparts ?? []) as Array<{ type: string; interchangeable: boolean; reason: string }>) {
      counterpartRows.push(`| ${code(i.id)} | ${code(c.type)} | ${c.interchangeable ? 'yes' : '**no**'} | ${cell(c.reason)} |`);
    }
  }
  if (counterpartRows.length) {
    lines.push('### Counterparts');
    lines.push('');
    lines.push('The nearest type on the other platform. **Interchangeable = no** means the two measure different things —');
    lines.push('their values must never be converted into each other or summed together. A `NOT_SUPPORTED` error names the');
    lines.push('counterpart, and `store.support(type).counterparts` returns this table at runtime.');
    lines.push('');
    lines.push('| Type | Counterpart | Interchangeable | Why |');
    lines.push('|---|---|---|---|');
    lines.push(...counterpartRows);
    lines.push('');
  }
  return lines;
}

import type { LoadedSchema, SpecBundle } from '../../codegen/src/load.js';
import { marked } from 'marked';
import { GITHUB, escapeHtml, layout, slug } from './pages.js';

/** One row of the browsable index, and the JSON the client-side filter works on. */
export interface TypeEntry {
  id: string;
  description: string;
  category: string;
  kind: string;
  ios: boolean;
  android: boolean;
  write: boolean;
  aggregate: string[];
  units: string[];
}

const x = (schema: LoadedSchema): any => schema.json['x-healthspec'] ?? {};

export function entryFor(schema: LoadedSchema): TypeEntry {
  const meta = x(schema);
  const platforms = meta.platforms ?? {};
  const units = Object.values<any>(schema.json.properties ?? {})
    .map((p) => p['x-unit'])
    .filter((u): u is string => typeof u === 'string');
  return {
    id: schema.json.title,
    description: schema.json.description ?? '',
    category: meta.category ?? 'other',
    kind: meta.kind ?? 'sample',
    ios: Boolean(platforms.healthkit),
    android: Boolean(platforms.healthconnect),
    write: Boolean(platforms.healthkit?.write || platforms.healthconnect?.write),
    aggregate: meta.aggregate ?? [],
    units: [...new Set(units)],
  };
}

const code = (s: string) => `<code>${escapeHtml(s)}</code>`;

/** Enum values, all of them unless there are so many that the table stops being readable. */
const enumValues = (values: string[]): string =>
  values.length > 10 ? `${values.slice(0, 10).map(code).join(' ')} <span class="more">+${values.length - 10} more</span>` : values.map(code).join(' ');

/** A property's type, readably: `number`, `string (enum)`, `array of objects`, with the enum's values listed. */
function describeType(property: any, bundle: SpecBundle): string {
  if (property.$ref) {
    const target = bundle.byBasename.get(property.$ref.split('/').pop() ?? '');
    const values: string[] | undefined = target?.json.enum;
    if (values) return `enum · ${enumValues(values)}`;
    return target ? `${escapeHtml(target.json.title ?? 'object')}` : 'object';
  }
  if (property.type === 'array') {
    const items = property.items ?? {};
    if (items.properties) {
      // One level in: a stage's `stage` is an enum, and its values are what a reader is looking for.
      const inner = Object.entries<any>(items.properties).map(([name, sub]) => {
        const values = sub.$ref ? bundle.byBasename.get(sub.$ref.split('/').pop() ?? '')?.json.enum : sub.enum;
        return values ? `${code(name)}: ${enumValues(values)}` : code(name);
      });
      return `array of objects — ${inner.join(', ')}`;
    }
    return `array of ${escapeHtml(items.type ?? 'values')}`;
  }
  if (property.enum) return `enum · ${enumValues(property.enum)}`;
  return escapeHtml(property.type ?? 'any');
}

function range(property: any): string {
  const min = property.minimum ?? property.exclusiveMinimum;
  const max = property.maximum ?? property.exclusiveMaximum;
  if (min === undefined && max === undefined) return '—';
  if (max === undefined) return `≥ ${min}`;
  if (min === undefined) return `≤ ${max}`;
  return `${min} – ${max}`;
}

function valueTable(schema: LoadedSchema, bundle: SpecBundle): string {
  const properties = Object.entries<any>(schema.json.properties ?? {});
  if (!properties.length) return '<p>This type carries no value fields; the record is the event.</p>';
  const required: string[] = schema.json.required ?? [];
  const rows = properties.map(([name, property]) => {
    const only = property['x-platform'];
    const note = only ? `<span class="only">${only === 'healthkit' ? 'iOS only' : 'Android only'}</span>` : '';
    return `<tr><td>${code(name)}${required.includes(name) ? '<span class="req" title="required">*</span>' : ''} ${note}</td><td>${describeType(property, bundle)}</td><td>${property['x-unit'] ? code(property['x-unit']) : '—'}</td><td>${range(property)}</td></tr>`;
  });
  return `<table class="fields"><thead><tr><th>Field</th><th>Type</th><th>Unit</th><th>Range</th></tr></thead><tbody>${rows.join('')}</tbody></table>
<p class="hint"><span class="req">*</span> required · units are canonical: a provider converts to them before the record reaches your app.</p>`;
}

function healthkitCard(hk: any): string {
  if (!hk) return `<div class="card absent"><h3>Apple HealthKit</h3><p>Not available. <code>capabilities().types</code> omits this type on iOS, and calls reject with <code>NOT_SUPPORTED</code>.</p></div>`;
  const identifiers = [hk.identifier, ...(hk.identifiers ?? [])].filter(Boolean) as string[];
  const fields = Object.entries<string>(hk.fields ?? {});
  return `<div class="card"><h3>Apple HealthKit</h3><dl>
${identifiers.length ? `<dt>Identifier</dt><dd>${identifiers.map(code).join('<br>')}</dd>` : ''}
${fields.length ? `<dt>Fields</dt><dd>${fields.map(([f, i]) => `${code(f)} → ${code(i)}`).join('<br>')}</dd>` : ''}
${hk.kind ? `<dt>Kind</dt><dd>${escapeHtml(hk.kind)}</dd>` : ''}
${hk.unit ? `<dt>Unit</dt><dd>${code(hk.unit)}</dd>` : ''}
${hk.since ? `<dt>Since</dt><dd>iOS ${escapeHtml(String(hk.since))}</dd>` : ''}
<dt>Access</dt><dd>${hk.read === false ? 'no read' : 'read'}${hk.write ? ' · write' : ' · <strong>read-only</strong> (HealthKit reserves writing to Apple)'}</dd>
</dl></div>`;
}

function healthConnectCard(hc: any): string {
  if (!hc) return `<div class="card absent"><h3>Android Health Connect</h3><p>Not available. <code>capabilities().types</code> omits this type on Android, and calls reject with <code>NOT_SUPPORTED</code>.</p></div>`;
  const fields = Object.entries<string>(hc.fields ?? {});
  return `<div class="card"><h3>Android Health Connect</h3><dl>
<dt>Record</dt><dd>${code(hc.record)}</dd>
${hc.field ? `<dt>Field</dt><dd>${code(hc.field)}</dd>` : ''}
${fields.length ? `<dt>Fields</dt><dd>${fields.map(([f, p]) => `${code(f)} → ${code(p)}`).join('<br>')}</dd>` : ''}
${hc.permission ? `<dt>Permission</dt><dd>${code(`READ_${hc.permission}`)}${hc.write ? `<br>${code(`WRITE_${hc.permission}`)}` : ''}</dd>` : ''}
${hc.unit ? `<dt>Unit</dt><dd>${code(hc.unit)}</dd>` : ''}
${hc.feature ? `<dt>Feature</dt><dd>${code(hc.feature)} — absent on devices whose Health Connect is older</dd>` : ''}
${hc.series ? '<dt>Series</dt><dd>Stored as a series; each sample becomes its own record with id <code>&lt;recordId&gt;#&lt;index&gt;</code></dd>' : ''}
<dt>Access</dt><dd>${hc.read === false ? 'no read' : 'read'}${hc.write ? ' · write' : ' · read-only'}</dd>
</dl></div>`;
}

export function typePage(schema: LoadedSchema, bundle: SpecBundle, entry: TypeEntry): string {
  const meta = x(schema);
  const platforms = meta.platforms ?? {};
  const example = schema.json.examples?.[0];
  const notes: string[] = meta.notes ?? [];
  const out = `types/${entry.id}.html`;

  const body = `
<p class="crumbs"><a href="index.html">Health types</a> / ${escapeHtml(entry.id)}</p>
<h1><code class="title">${escapeHtml(entry.id)}</code></h1>
<p class="lede">${escapeHtml(entry.description)}</p>
<p class="badges">
  <span class="badge">${escapeHtml(entry.category)}</span>
  <span class="badge">${escapeHtml(entry.kind)}</span>
  <span class="badge ${entry.ios ? 'yes' : 'no'}">iOS ${entry.ios ? '✓' : '✗'}</span>
  <span class="badge ${entry.android ? 'yes' : 'no'}">Android ${entry.android ? '✓' : '✗'}</span>
  ${entry.write ? '<span class="badge">writable</span>' : '<span class="badge">read-only</span>'}
</p>

<h2 id="value">Value</h2>
${valueTable(schema, bundle)}

<h2 id="reading">Reading it</h2>
<pre><code>const records = await store.read('${escapeHtml(entry.id)}', { start, end });${
    entry.aggregate.length
      ? `\nconst buckets = await store.aggregate('${escapeHtml(entry.id)}', { start, end, fn: '${escapeHtml(entry.aggregate[0]!)}', bucket: 'day' });`
      : ''
  }</code></pre>
<p>${entry.aggregate.length ? `Aggregate functions: ${entry.aggregate.map(code).join(' ')}.` : 'This type cannot be aggregated; read the records.'}</p>

<h2 id="platforms">Platform mapping</h2>
<div class="cards">
${healthkitCard(platforms.healthkit)}
${healthConnectCard(platforms.healthconnect)}
</div>
${notes.length ? `<h2 id="notes">Notes</h2><ul class="notes">${notes.map((n) => `<li>${marked.parseInline(n, { async: false })}</li>`).join('')}</ul>` : ''}
${example ? `<h2 id="example">Example record</h2><pre><code>${escapeHtml(JSON.stringify({ id: '…', type: entry.id, start: '2026-08-21T07:30:00+09:00', end: '2026-08-21T07:30:00+09:00', source: { id: 'com.example.app', name: 'Example' }, recordingMethod: 'automatic', value: example }, null, 2))}</code></pre>` : ''}
${meta.openmhealth?.schema ? `<p class="hint">Open mHealth equivalent: ${code(meta.openmhealth.schema)}</p>` : ''}
`;

  return layout({
    out,
    title: `${entry.id} · HealthSpec`,
    description: entry.description || `The ${entry.id} health type: value fields, platform mapping and aggregation.`,
    section: 'types',
    body,
    sourceFile: schema.file,
  });
}

export function typeIndexPage(entries: TypeEntry[], categories: string[]): string {
  const rows = entries
    .map(
      (e) => `<tr data-id="${escapeHtml(e.id)}" data-category="${escapeHtml(e.category)}" data-platform="${e.ios ? 'ios ' : ''}${e.android ? 'android' : ''}" data-text="${escapeHtml(`${e.id} ${e.description} ${e.category}`.toLowerCase())}">
<td><a href="${escapeHtml(e.id)}.html"><code>${escapeHtml(e.id)}</code></a><span class="desc">${escapeHtml(e.description)}</span></td>
<td>${escapeHtml(e.category)}</td>
<td>${escapeHtml(e.kind)}</td>
<td class="mark">${e.ios ? '✓' : '·'}</td>
<td class="mark">${e.android ? '✓' : '·'}</td>
<td>${e.aggregate.length ? e.aggregate.map(code).join(' ') : '—'}</td>
</tr>`,
    )
    .join('');

  const both = entries.filter((e) => e.ios && e.android).length;
  const body = `
<h1>Health types</h1>
<p class="lede">${entries.length} types, one API. ${both} exist on both platforms; the rest exist on one, and
<code>store.support(type)</code> reports which — with the nearest counterpart on the other platform — before you call.</p>

<div class="filters">
  <label class="search"><span class="visually-hidden">Search types</span>
    <input type="search" id="q" placeholder="Search ${entries.length} types — name, description, category" autocomplete="off">
  </label>
  <div class="chips" id="platform-filters" role="group" aria-label="Platform">
    <button type="button" data-platform="" class="on">All platforms</button>
    <button type="button" data-platform="ios">iOS</button>
    <button type="button" data-platform="android">Android</button>
    <button type="button" data-platform="both">Both</button>
  </div>
  <select id="category" aria-label="Category">
    <option value="">All categories</option>
    ${categories.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}
  </select>
</div>
<p class="count" id="count" aria-live="polite">${entries.length} types</p>

<table class="types">
<thead><tr><th>Type</th><th>Category</th><th>Kind</th><th>iOS</th><th>Android</th><th>Aggregates</th></tr></thead>
<tbody id="rows">${rows}</tbody>
</table>
<p class="empty" id="empty" hidden>Nothing matches. The full mapping table lives in <a href="${GITHUB}/blob/main/docs/mapping/README.md" rel="noreferrer">docs/mapping</a>.</p>
`;

  const script = `<script>
(() => {
  const rows = [...document.querySelectorAll('#rows tr')];
  const q = document.getElementById('q');
  const category = document.getElementById('category');
  const count = document.getElementById('count');
  const empty = document.getElementById('empty');
  let platform = '';

  function apply() {
    const text = q.value.trim().toLowerCase();
    const cat = category.value;
    let shown = 0;
    for (const row of rows) {
      const platforms = row.dataset.platform;
      const okPlatform =
        !platform ||
        (platform === 'both' ? platforms.includes('ios') && platforms.includes('android') : platforms.includes(platform));
      const ok = okPlatform && (!cat || row.dataset.category === cat) && (!text || row.dataset.text.includes(text));
      row.hidden = !ok;
      if (ok) shown++;
    }
    count.textContent = shown + (shown === 1 ? ' type' : ' types');
    empty.hidden = shown > 0;
  }

  q.addEventListener('input', apply);
  category.addEventListener('change', apply);
  for (const button of document.querySelectorAll('#platform-filters button')) {
    button.addEventListener('click', () => {
      platform = button.dataset.platform;
      for (const other of document.querySelectorAll('#platform-filters button')) other.classList.toggle('on', other === button);
      apply();
    });
  }
  // A link like types/#steps opens on that type.
  if (location.hash) { q.value = decodeURIComponent(location.hash.slice(1)); apply(); }
})();
</script>`;

  return layout({
    out: 'types/index.html',
    title: 'Health types · HealthSpec',
    description: `Every health type in the HealthSpec specification — ${entries.length} of them — with its fields, units, aggregation and platform mapping.`,
    section: 'types',
    body,
    scripts: script,
    wide: true,
    sourceFile: 'spec/schema/types',
  });
}

export const categoriesOf = (entries: TypeEntry[]): string[] => [...new Set(entries.map((e) => e.category))].sort();

export const anchorFor = (id: string): string => slug(id);

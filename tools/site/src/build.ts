/**
 * Builds the documentation site published at https://dev-eyoungmin.github.io/healthspec/.
 *
 * Everything on it comes from the repository: the guides and the specification are the markdown files, and the
 * type reference is generated from `spec/schema` — the same source the TypeScript, Swift, Kotlin and Dart
 * definitions are generated from, so the site cannot drift from what the packages do.
 *
 * `pnpm site` writes `site/`; `pnpm site:serve` looks at it.
 */
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSpec } from '../../codegen/src/load.js';
import { layout, renderMarkdown } from './pages.js';
import { categoriesOf, entryFor, typeIndexPage, typePage, type TypeEntry } from './types-pages.js';
import { STYLESHEET } from './style.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const OUT = path.join(ROOT, 'site');

/** Markdown documents rendered as they are, with their links rewritten to site pages. */
const DOCUMENTS: Array<{ source: string; out: string; section?: string; title?: string; description: string }> = [
  { source: 'spec/SPEC.md', out: 'spec.html', section: 'spec', description: 'The specification every HealthSpec provider implements: types, permissions, reads, aggregation, writes, cursors and errors.' },
  { source: 'docs/guides/incremental-sync.md', out: 'guides/incremental-sync.html', section: 'guides', description: 'Keeping a copy of health data in sync: cursors, at-least-once delivery, expired cursors and background work on both platforms.' },
  { source: 'docs/guides/testing.md', out: 'guides/testing.html', section: 'guides', description: 'Testing an app that reads health data, without a device: MockProvider, denied permissions, missing platforms and empty stores.' },
  { source: 'docs/guides/errors.md', out: 'guides/errors.html', section: 'guides', description: 'Every HealthSpec error code, what causes it, and what an app should do about it.' },
  { source: 'docs/migration/from-react-native-healthkit.md', out: 'migration/from-react-native-healthkit.html', section: 'guides', description: 'Moving an app from @kingstinct/react-native-healthkit to HealthSpec.' },
  { source: 'docs/migration/from-react-native-health-connect.md', out: 'migration/from-react-native-health-connect.html', section: 'guides', description: 'Moving an app from react-native-health-connect to HealthSpec.' },
  { source: 'docs/migration/from-react-native-health.md', out: 'migration/from-react-native-health.html', section: 'guides', description: 'Moving an app from react-native-health to HealthSpec.' },
  { source: 'docs/NATIVE-VERIFICATION.md', out: 'verification.html', description: 'What has been verified on real devices, and what is still open.' },
  { source: 'CONTRIBUTING.md', out: 'contributing.html', description: 'How to add a health type, change a mapping, implement a provider, and release.' },
  { source: 'CHANGELOG.md', out: 'changelog.html', description: 'What changed in each release of the HealthSpec packages.' },
];

const written: string[] = [];
async function write(out: string, contents: string): Promise<void> {
  const file = path.join(OUT, out);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents);
  written.push(out);
}

function landing(entries: TypeEntry[]): string {
  const both = entries.filter((e) => e.ios && e.android).length;
  const ios = entries.filter((e) => e.ios && !e.android).length;
  const android = entries.filter((e) => e.android && !e.ios).length;

  const body = `
<section class="hero">
  <h1>One health API, two platforms, no guessing</h1>
  <p class="lede">HealthSpec is a specification for health data and an SDK that implements it: Apple HealthKit and
  Android Health Connect behind the same calls, the same units, the same errors — and a written rule for every
  place the two platforms genuinely differ.</p>
  <p class="cta">
    <a class="button" href="types/index.html">Browse ${entries.length} health types</a>
    <a class="button ghost" href="guides/index.html">Read the guides</a>
  </p>
</section>

<section class="quick">
<pre><code>npx expo install @healthspec/expo</code></pre>
<pre><code>import { HealthStore } from '@healthspec/expo';

// Apple Health on iOS, Health Connect on Android, Mock in Expo Go and tests
const store = HealthStore.default();

await store.requestSupportedPermissions({
  read: ['steps', 'heart_rate', 'sleep_session'],
  write: ['weight'],
});

const steps = await store.read('steps', { start, end });
const daily = await store.aggregate('steps', { start, end, fn: 'sum', bucket: 'day' });</code></pre>
</section>

<section>
<h2 id="what">What it decides for you</h2>
<div class="tiles">
  <div class="tile">
    <h3>Canonical units</h3>
    <p>Kilograms, meters, percent 0–100 — converted before the record reaches your app, whichever platform it came
    from. Conversions for display live in <code>units</code>.</p>
  </div>
  <div class="tile">
    <h3>Differences, written down</h3>
    <p>HealthKit never reveals read permission; Health Connect cursors expire after 30 days; sleep stages become
    sessions. Each is a clause in the <a href="spec.html">specification</a>, not a surprise in production.</p>
  </div>
  <div class="tile">
    <h3>Errors you can branch on</h3>
    <p>Eight codes cross the native boundary, never a platform message. HealthKit's uncatchable exceptions are
    caught natively and become <a href="guides/errors.html">ordinary rejections</a>.</p>
  </div>
  <div class="tile">
    <h3>Testable without a device</h3>
    <p><code>MockProvider</code> produces denied permissions, missing types, expired cursors and empty stores — and
    it is what runs in Expo Go, so a screen can be <a href="guides/testing.html">built before the build</a>.</p>
  </div>
  <div class="tile">
    <h3>Sync that survives a crash</h3>
    <p><code>syncTypes</code> stores a cursor only after its batch is handled, resyncs when one expires, and
    <code>readChunks</code> walks a year of history <a href="guides/incremental-sync.html">a week at a time</a>.</p>
  </div>
  <div class="tile">
    <h3>Configuration checked</h3>
    <p>The config plugin derives entitlements, usage descriptions and Android permissions from the types you list;
    <code>npx healthspec doctor</code> finds what App Review and Play Console would reject.</p>
  </div>
</div>
</section>

<section>
<h2 id="types">${entries.length} types, and what has them</h2>
<table class="summary">
  <tbody>
    <tr><td><a href="types/index.html#">Both platforms</a></td><td class="num">${both}</td><td>the same call works on iOS and Android</td></tr>
    <tr><td>Apple HealthKit only</td><td class="num">${ios}</td><td><code>store.support(type)</code> names the nearest Android counterpart</td></tr>
    <tr><td>Android Health Connect only</td><td class="num">${android}</td><td>…and the nearest iOS one</td></tr>
  </tbody>
</table>
<p>Every type page lists its fields, units, aggregation functions and the exact HealthKit identifier or Health
Connect record it maps to. <a href="types/index.html">Browse them →</a></p>
</section>

<section>
<h2 id="packages">Packages</h2>
<table class="summary">
  <tbody>
    <tr><td><code>@healthspec/expo</code></td><td>Expo / React Native module — the one an app installs. 184 kB minified, ESM and CommonJS.</td></tr>
    <tr><td><code>@healthspec/core</code></td><td>Provider contract, <code>HealthStore</code>, <code>MockProvider</code>, cursors, buckets, <code>syncTypes</code>. No React Native.</td></tr>
    <tr><td><code>@healthspec/schema</code></td><td>Generated types, mapping tables, unit helpers.</td></tr>
    <tr><td><code>@healthspec/conformance</code></td><td>The suite a provider has to pass to claim compatibility.</td></tr>
    <tr><td><code>@healthspec/cli</code></td><td><code>healthspec doctor</code>, <code>healthspec mapping &lt;type&gt;</code>.</td></tr>
  </tbody>
</table>
</section>

<section class="status">
<h2 id="status">Status</h2>
<p>Pre-release. The native modules compile and are checked in CI against both platforms' SDKs; the HealthKit
mapping tables are verified against the HealthKit runtime, and both providers pass the conformance suite. What is
still open is behaviour on physical devices — permission dialogs, background delivery, Personal Health Record
reads — tracked in <a href="verification.html">device verification</a>.</p>
</section>
`;

  return layout({
    out: 'index.html',
    title: 'HealthSpec — HealthKit and Health Connect behind one API',
    description: `A specification and SDK for health data: ${entries.length} types, Apple HealthKit and Android Health Connect behind one conformant API for Expo and React Native.`,
    section: 'home',
    body,
    bodyClass: 'home',
  });
}

function guidesIndex(): string {
  const card = (href: string, title: string, blurb: string) =>
    `<a class="tile link" href="${href}"><h3>${title}</h3><p>${blurb}</p></a>`;
  const body = `
<h1>Guides</h1>
<p class="lede">The problems every app that reads health data runs into, and what this SDK decides about them.</p>
<div class="tiles">
${card('incremental-sync.html', 'Keeping a copy in sync', 'Cursors, at-least-once delivery, expired cursors, background work on iOS and Android, and the two record shapes a mirror has to handle.')}
${card('testing.html', 'Testing without a device', 'MockProvider: denied permissions, a platform that lacks the type, expired cursors, an empty store — and the conformance suite against your own provider.')}
${card('errors.html', 'Errors, and what to do about them', 'Every code that crosses the boundary, what causes it, and the two cases that look like errors but are not.')}
</div>
<h2 id="migration">Coming from another library</h2>
<div class="tiles">
${card('../migration/from-react-native-healthkit.html', 'from react-native-healthkit', 'Identifier-by-identifier, with the units that change.')}
${card('../migration/from-react-native-health-connect.html', 'from react-native-health-connect', 'Records to types, permissions to declarations.')}
${card('../migration/from-react-native-health.html', 'from react-native-health', 'The callback API to promises, and what has no counterpart.')}
</div>
<h2 id="more">Also</h2>
<ul>
  <li><a href="../spec.html">The specification</a> — what a provider must do, clause by clause.</li>
  <li><a href="../types/index.html">Health types</a> — fields, units and platform mapping for each of them.</li>
  <li><a href="../contributing.html">Contributing</a> — adding a type, changing a mapping, implementing a provider.</li>
  <li><a href="../changelog.html">Changelog</a>.</li>
</ul>
`;
  return layout({
    out: 'guides/index.html',
    title: 'Guides · HealthSpec',
    description: 'Guides for syncing health data, testing without a device, handling errors, and migrating from other React Native health libraries.',
    section: 'guides',
    body,
  });
}

/** 404 on GitHub Pages: same shell, so a mistyped type id still offers the browser. */
function notFound(): string {
  return layout({
    out: '404.html',
    title: 'Not found · HealthSpec',
    description: 'That page does not exist.',
    body: `<h1>Not found</h1>
<p class="lede">That page does not exist. If you were looking for a health type, the
<a href="types/index.html">type browser</a> searches all of them.</p>`,
  });
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const bundle = await loadSpec(ROOT);
const entries = bundle.types.map(entryFor).sort((a, b) => a.id.localeCompare(b.id));
const byId = new Map(bundle.types.map((t) => [t.json.title as string, t]));

await write('index.html', landing(entries));
await write('guides/index.html', guidesIndex());
await write('404.html', notFound());
await write('types/index.html', typeIndexPage(entries, categoriesOf(entries)));
for (const entry of entries) await write(`types/${entry.id}.html`, typePage(byId.get(entry.id)!, bundle, entry));

for (const doc of DOCUMENTS) {
  const source = await readFile(path.join(ROOT, doc.source), 'utf8');
  const rendered = renderMarkdown(source, doc.source, doc.out);
  await write(
    doc.out,
    layout({
      out: doc.out,
      title: `${doc.title ?? rendered.title ?? doc.out} · HealthSpec`,
      description: doc.description,
      body: `<article class="prose">${rendered.html}</article>`,
      toc: rendered.headings,
      sourceFile: doc.source,
      ...(doc.section ? { section: doc.section } : {}),
    }),
  );
}

await write('assets/site.css', STYLESHEET);
// GitHub Pages runs Jekyll otherwise, which drops files beginning with an underscore.
await write('.nojekyll', '');
await cp(path.join(ROOT, 'LICENSE'), path.join(OUT, 'LICENSE'));

console.log(`✔ site: ${written.length} files in site/, ${entries.length} of them type pages`);
console.log('  open site/index.html, or run `pnpm site:serve`');

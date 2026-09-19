/**
 * Checks the built site: every internal link points at a page that exists, and every `#fragment` at an element
 * that exists on it. A guide that renames a heading breaks its links silently otherwise — and the site is
 * generated, so nobody would notice until a reader did.
 *
 * `pnpm --filter @healthspec/site check` (run after `pnpm site`).
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../site');

async function htmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(full);
      return entry.name.endsWith('.html') ? [full] : [];
    }),
  );
  return files.flat();
}

const pages = await htmlFiles(SITE);
if (!pages.length) {
  console.error('✖ site/ is empty — run `pnpm site` first');
  process.exit(1);
}

/** Every id each page offers, so a fragment can be checked against the page it points at. */
const ids = new Map<string, Set<string>>();
const sources = new Map<string, string>();
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  sources.set(file, html);
  ids.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]!)));
}

const problems: string[] = [];
let checked = 0;

for (const [file, html] of sources) {
  const from = path.relative(SITE, file);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1]!;
    if (/^(https?:|mailto:|data:|#$)/.test(raw)) continue;
    checked++;
    const [target, fragment] = raw.split('#');
    const page = target ? path.resolve(path.dirname(file), decodeURIComponent(target)) : file;
    if (!sources.has(page)) {
      // A non-HTML asset (the stylesheet) only has to exist.
      if (target && !target.endsWith('.html')) {
        const exists = await readFile(page).then(() => true, () => false);
        if (!exists) problems.push(`${from} → ${raw} (missing file)`);
        continue;
      }
      problems.push(`${from} → ${raw} (missing page)`);
      continue;
    }
    if (fragment && !ids.get(page)?.has(decodeURIComponent(fragment))) {
      problems.push(`${from} → ${raw} (no such anchor on ${path.relative(SITE, page)})`);
    }
  }
}

if (problems.length) {
  for (const problem of problems) console.error(`✖ ${problem}`);
  console.error(`\n${problems.length} broken links of ${checked}`);
  process.exit(1);
}
console.log(`✔ ${pages.length} pages, ${checked} internal links, every one resolves`);

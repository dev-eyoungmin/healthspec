/**
 * Sets one version across everything npm publishes, so a release cannot go out half-bumped.
 *
 * `pnpm release:version 0.2.0` — the five package manifests and `healthspec-versions.json`. The Swift, Kotlin and
 * Dart packages version separately (`healthspec-versions.json` records those); this does not touch them.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const PACKAGES = ['packages/schema', 'packages/core', 'packages/conformance', 'packages/cli', 'libraries/expo-health'];

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error('usage: pnpm release:version <x.y.z[-tag]>');
  process.exit(2);
}

/** Rewrites the one line rather than reserialising, so field order and formatting survive. */
function setField(file: string, pattern: RegExp, replacement: string): void {
  const source = readFileSync(file, 'utf8');
  const updated = source.replace(pattern, replacement);
  if (updated === source) {
    console.error(`✖ ${path.relative(ROOT, file)}: nothing matched ${pattern}`);
    process.exit(1);
  }
  writeFileSync(file, updated);
}

for (const dir of PACKAGES) {
  const file = path.join(ROOT, dir, 'package.json');
  setField(file, /("version":\s*)"[^"]+"/, `$1"${version}"`);
  console.log(`· ${dir} → ${version}`);
}
setField(path.join(ROOT, 'healthspec-versions.json'), /("expo-health":\s*)"[^"]+"/, `$1"${version}"`);

console.log(`✔ npm packages are ${version}. Now: add it to CHANGELOG.md, run \`pnpm verify\` and the release check, then tag npm-v${version}.`);

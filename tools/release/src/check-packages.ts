/**
 * Packs every public npm package and checks the tarball an app would install: every entry point resolves to a
 * packed file, workspace dependencies are pinned to versions, and @healthspec/expo carries the native sources
 * autolinking compiles (including the copies from packages/apple and packages/google).
 *
 * Run after `pnpm build`: `pnpm --filter @healthspec/release check`.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

const PACKAGES: Record<string, string[]> = {
  'packages/schema': ['dist/index.js', 'dist/bundle.js'],
  'packages/core': ['dist/index.js'],
  'packages/conformance': ['dist/index.js'],
  'packages/cli': ['dist/index.js', 'dist/api.js'],
  'libraries/expo-health': [
    'build/index.js',
    'plugin/build/index.js',
    'app.plugin.js',
    'expo-module.config.json',
    'ios/HealthSpecExpo.podspec',
    'ios/HealthSpecModule.swift',
    'ios/HealthSpecExceptionCatcher.m',
    'ios/Shared/HealthSpecSupport.swift',
    'android/build.gradle',
    'android/src/main/java/dev/healthspec/expo/HealthSpecModule.kt',
    'android/src/main/java/dev/healthspec/Serialization.kt',
    'android/src/main/java/dev/healthspec/generated/HealthSpecTypes.kt',
  ],
};

const problems: string[] = [];

/** What npm shows on the package page, and what a licence audit looks for. Missing fields are found by users. */
function checkMetadata(name: string, manifest: Record<string, unknown>, entries: Set<string>): string[] {
  const issues: string[] = [];
  for (const field of ['description', 'keywords', 'license', 'homepage', 'bugs', 'repository']) {
    const value = manifest[field];
    if (value === undefined || (Array.isArray(value) && value.length === 0)) issues.push(`${name}: package.json has no ${field}`);
  }
  if (!entries.has('LICENSE')) issues.push(`${name}: the tarball carries no LICENSE`);
  return issues;
}

/** One version across the npm packages, and the platform packages in step with healthspec-versions.json. */
function checkVersions(): string[] {
  const issues: string[] = [];
  const versions = JSON.parse(readFileSync(path.join(ROOT, 'healthspec-versions.json'), 'utf8')) as Record<string, string | Record<string, string>>;
  const npm = Object.keys(PACKAGES).map((dir) => JSON.parse(readFileSync(path.join(ROOT, dir, 'package.json'), 'utf8')) as { name: string; version: string });
  const distinct = [...new Set(npm.map((p) => p.version))];
  if (distinct.length > 1) issues.push(`npm packages disagree on the version: ${npm.map((p) => `${p.name}@${p.version}`).join(', ')}`);
  const expo = npm.find((p) => p.name === '@healthspec/expo')?.version;
  const declared = (versions['libraries'] as Record<string, string>)['expo-health'];
  if (expo !== declared) issues.push(`healthspec-versions.json says expo-health is ${declared}, the package says ${expo}`);
  const pubspec = readFileSync(path.join(ROOT, 'packages/dart/pubspec.yaml'), 'utf8').match(/^version:\s*(\S+)/m)?.[1];
  if (pubspec !== versions['dart']) issues.push(`healthspec-versions.json says dart is ${String(versions['dart'])}, pubspec.yaml says ${pubspec}`);
  return issues;
}
/** Each package carries its own copy, because npm publishes one directory, not the repository. */
const license = readFileSync(path.join(ROOT, 'LICENSE'), 'utf8');
const out = mkdtempSync(path.join(tmpdir(), 'healthspec-pack-'));
/** The packed packages, unpacked as an app would install them, so they can be imported for real. */
const modules = path.join(out, 'node_modules');
try {
  for (const [dir, required] of Object.entries(PACKAGES)) {
    const cwd = path.join(ROOT, dir);
    const name = (JSON.parse(readFileSync(path.join(cwd, 'package.json'), 'utf8')) as { name: string }).name;
    const tarball = execFileSync('pnpm', ['pack', '--pack-destination', out], { cwd, encoding: 'utf8' }).trim().split('\n').pop() ?? '';
    const installed = path.join(modules, ...name.split('/'));
    mkdirSync(installed, { recursive: true });
    execFileSync('tar', ['-xzf', tarball, '-C', installed, '--strip-components=1']);
    const entries = new Set(execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' }).split('\n').map((e) => e.replace(/^package\//, '')));
    for (const file of required) if (!entries.has(file)) problems.push(`${name}: ${file} is not in the tarball`);
    if ([...entries].some((e) => e.includes('/build/intermediates/') || e.startsWith('android/build/') || e.includes('.gradle/'))) problems.push(`${name}: Gradle build output is packed`);

    const manifest = JSON.parse(execFileSync('tar', ['-xzOf', tarball, 'package/package.json'], { encoding: 'utf8' })) as Record<string, Record<string, string> | undefined>;
    problems.push(...checkMetadata(name, manifest, entries));
    if (readFileSync(path.join(cwd, 'LICENSE'), 'utf8') !== license) problems.push(`${name}: LICENSE differs from the repository's`);
    for (const field of ['dependencies', 'peerDependencies']) {
      for (const [dep, range] of Object.entries(manifest[field] ?? {})) {
        if (range.startsWith('workspace:')) problems.push(`${name}: ${field}.${dep} is still "${range}"`);
      }
    }
    console.log(`${problems.length ? '·' : '✔'} ${name} (${entries.size} files)`);
  }

  // An app may reach these packages from ESM (Metro, a modern bundler) or from CommonJS (Jest, a Node script).
  // Both have to work without the app configuring anything.
  const run = (flag: string[], code: string, what: string) => {
    const result = execFileSync('node', [...flag, '-e', code], { cwd: out, env: { ...process.env, NODE_PATH: modules }, encoding: 'utf8', stdio: 'pipe' }).trim();
    if (result !== 'ok') problems.push(`${what}: expected "ok", got ${JSON.stringify(result)}`);
  };
  for (const name of ['@healthspec/schema', '@healthspec/core', '@healthspec/conformance', '@healthspec/cli']) {
    try {
      run([], `require(${JSON.stringify(name)}); console.log('ok')`, `require("${name}")`);
      run(['--input-type=module'], `await import(${JSON.stringify(name)}); console.log('ok')`, `import("${name}")`);
    } catch (e) {
      problems.push(`${name} could not be loaded: ${(e as { stderr?: string }).stderr?.split('\n')[1] ?? String(e)}`);
    }
  }
  run([], `require('@healthspec/schema/bundle'); require('@healthspec/schema/examples'); console.log('ok')`, 'subpath exports');
  console.log('✔ every package loads from CommonJS and from ESM');

  problems.push(...checkVersions());
  if (!problems.length) console.log('✔ versions agree across packages');

  // @healthspec/expo needs React Native, so it cannot be loaded here; its entry points must still be the right format.
  const entry = readFileSync(path.join(modules, '@healthspec/expo/build/index.js'), 'utf8');
  const esm = readFileSync(path.join(modules, '@healthspec/expo/build/esm/index.js'), 'utf8');
  if (!/^"use strict"/m.test(entry) || /^export /m.test(entry)) problems.push('@healthspec/expo: build/index.js must be CommonJS (Jest and Node read it)');
  if (!/^export /m.test(esm)) problems.push('@healthspec/expo: build/esm/index.js must be ES modules');
} finally {
  rmSync(out, { recursive: true, force: true });
}

if (problems.length) {
  for (const p of problems) console.error(`✖ ${p}`);
  process.exit(1);
}

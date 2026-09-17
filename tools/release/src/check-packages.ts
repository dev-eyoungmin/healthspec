/**
 * Packs every public npm package and checks the tarball an app would install: every entry point resolves to a
 * packed file, workspace dependencies are pinned to versions, and @healthspec/expo carries the native sources
 * autolinking compiles (including the copies from packages/apple and packages/google).
 *
 * Run after `pnpm build`: `pnpm --filter @healthspec/release check`.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
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
const out = mkdtempSync(path.join(tmpdir(), 'healthspec-pack-'));
try {
  for (const [dir, required] of Object.entries(PACKAGES)) {
    const cwd = path.join(ROOT, dir);
    const name = (JSON.parse(readFileSync(path.join(cwd, 'package.json'), 'utf8')) as { name: string }).name;
    const tarball = execFileSync('pnpm', ['pack', '--pack-destination', out], { cwd, encoding: 'utf8' }).trim().split('\n').pop() ?? '';
    const entries = new Set(execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' }).split('\n').map((e) => e.replace(/^package\//, '')));
    for (const file of required) if (!entries.has(file)) problems.push(`${name}: ${file} is not in the tarball`);
    if ([...entries].some((e) => e.includes('/build/intermediates/') || e.startsWith('android/build/') || e.includes('.gradle/'))) problems.push(`${name}: Gradle build output is packed`);

    const manifest = JSON.parse(execFileSync('tar', ['-xzOf', tarball, 'package/package.json'], { encoding: 'utf8' })) as Record<string, Record<string, string> | undefined>;
    for (const field of ['dependencies', 'peerDependencies']) {
      for (const [dep, range] of Object.entries(manifest[field] ?? {})) {
        if (range.startsWith('workspace:')) problems.push(`${name}: ${field}.${dep} is still "${range}"`);
      }
    }
    console.log(`${problems.length ? '·' : '✔'} ${name} (${entries.size} files)`);
  }
} finally {
  rmSync(out, { recursive: true, force: true });
}

if (problems.length) {
  for (const p of problems) console.error(`✖ ${p}`);
  process.exit(1);
}

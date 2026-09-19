/**
 * What `import { HealthStore } from '@healthspec/expo'` costs an app.
 *
 * Metro does not tree-shake, so every table this package exports ships in the app. The budget is here to make a
 * regression visible in review rather than in someone's bundle report.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const BUDGET_KB = 200;

const out = mkdtempSync(path.join(tmpdir(), 'healthspec-size-'));
try {
  const bundle = path.join(out, 'bundle.js');
  execFileSync(
    'npx',
    [
      'esbuild',
      '--bundle',
      '--format=esm',
      '--platform=neutral',
      '--minify',
      `--outfile=${bundle}`,
      '--external:react',
      '--external:react-native',
      '--external:expo-modules-core',
      // What Metro resolves for a React Native app (the "react-native" field), not the CommonJS entry Jest reads.
      path.join(ROOT, 'libraries/expo-health', (JSON.parse(readFileSync(path.join(ROOT, 'libraries/expo-health/package.json'), 'utf8')) as Record<string, string>)['react-native'] ?? 'build/index.js'),
    ],
    { cwd: ROOT, stdio: 'pipe' },
  );
  const kb = statSync(bundle).size / 1024;
  const verdict = kb <= BUDGET_KB ? '✔' : '✖';
  console.log(`${verdict} @healthspec/expo bundles to ${kb.toFixed(1)} kB minified (budget ${BUDGET_KB} kB)`);
  if (kb > BUDGET_KB) {
    console.error('Trim a generated table, move it behind a subpath export, or raise the budget deliberately.');
    process.exit(1);
  }
} finally {
  rmSync(out, { recursive: true, force: true });
}

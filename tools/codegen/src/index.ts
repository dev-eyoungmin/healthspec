import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitMappingDocs } from './emit-docs.js';
import { emitPlatform } from './emit-platform.js';
import { emitKotlinEnums, emitKotlinMedicalTypes, emitKotlinNutrition, emitKotlinTypes } from './emit-kotlin.js';
import { emitPluginPermissions } from './emit-plugin.js';
import { emitDart } from './emit-dart.js';
import { emitSwift } from './emit-swift.js';
import { emitBundle, emitExamples, emitMapping, emitTypes } from './emit-ts.js';
import { emitValidators } from './emit-validators.js';
import { loadSpec } from './load.js';
import { buildValidator, lintSpec, validateExamples } from './validate.js';
import { vendorNativeSources } from './vendor.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const check = process.argv.includes('--check');

const bundle = await loadSpec(ROOT);
const issues = [...lintSpec(bundle), ...validateExamples(buildValidator(bundle), bundle)];
if (issues.length) {
  for (const i of issues) console.error(`✖ ${i.file}: ${i.message}`);
  process.exit(1);
}

const outputs: Record<string, string> = {
  'packages/schema/src/generated/types.ts': emitTypes(bundle),
  'packages/schema/src/generated/mapping.ts': emitMapping(bundle),
  'packages/schema/src/generated/platform.ts': emitPlatform(bundle),
  'packages/schema/src/generated/schema-bundle.ts': emitBundle(bundle),
  'packages/schema/src/generated/examples.ts': emitExamples(bundle),
  'packages/schema/src/generated/validators.ts': emitValidators(bundle),
  'packages/google/src/main/kotlin/dev/healthspec/generated/HealthSpecTypes.kt': emitKotlinTypes(bundle),
  'packages/google/src/main/kotlin/dev/healthspec/generated/HealthSpecEnums.kt': emitKotlinEnums(bundle),
  'packages/google/src/main/kotlin/dev/healthspec/generated/HealthSpecNutrition.kt': emitKotlinNutrition(bundle),
  'packages/google/src/main/kotlin/dev/healthspec/generated/HealthSpecMedicalTypes.kt': emitKotlinMedicalTypes(bundle),
  'libraries/expo-health/plugin/src/generated/permissions.ts': emitPluginPermissions(bundle),
  'packages/apple/Sources/HealthSpec/Generated/HealthSpec.swift': emitSwift(bundle),
  'packages/dart/lib/src/generated/healthspec.dart': emitDart(bundle),
  'docs/mapping/README.md': emitMappingDocs(bundle),
};

// Native sources the Expo module compiles, copied from the platform packages (see vendor.ts).
const vendored = await vendorNativeSources(ROOT, outputs);
Object.assign(outputs, vendored.outputs);

let stale = 0;
for (const orphan of vendored.orphans) {
  if (check) {
    console.error(`✖ orphaned copy: ${orphan}`);
    stale++;
  } else {
    await rm(path.join(ROOT, orphan));
    console.log(`✔ removed ${orphan}`);
  }
}
for (const [rel, content] of Object.entries(outputs)) {
  const abs = path.join(ROOT, rel);
  if (check) {
    const current = await readFile(abs, 'utf8').catch(() => null);
    if (current !== content) {
      console.error(`✖ stale: ${rel}`);
      stale++;
    }
  } else {
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, content);
    console.log(`✔ ${rel}`);
  }
}
if (check && stale) {
  console.error(`${stale} generated file(s) out of date — run \`pnpm codegen\``);
  process.exit(1);
}
console.log(`${check ? 'up to date' : 'generated'}: ${bundle.types.length} types · ${bundle.enums.length} enums · ${bundle.common.length} common`);

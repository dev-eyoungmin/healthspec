/**
 * Guards the contract between the JavaScript layer, the native modules and Expo's autolinking. These are the
 * pieces that only break at build time on a device, so they are asserted here instead.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel: string) => readFileSync(path.join(PKG, rel), 'utf8');
const json = (rel: string) => JSON.parse(read(rel)) as Record<string, any>;

const pkg = json('package.json');
const moduleConfig = json('expo-module.config.json');
const swift = read('ios/HealthSpecModule.swift');
const kotlin = read('android/src/main/java/dev/healthspec/expo/HealthSpecModule.kt');
const podspec = read('ios/HealthSpecExpo.podspec');
const gradle = read('android/build.gradle');
const storeSource = read('src/store.ts');

/** The single name that must agree across JS, Swift and Kotlin. */
const MODULE_NAME = 'HealthSpec';

test('the native module name agrees across JavaScript, Swift and Kotlin', () => {
  assert.match(storeSource, new RegExp(`requireOptionalNativeModule<[A-Za-z]+>\\('${MODULE_NAME}'\\)`), 'store.ts must look up the module by name');
  assert.match(swift, new RegExp(`Name\\("${MODULE_NAME}"\\)`), 'Swift module must declare the same name');
  assert.match(kotlin, new RegExp(`Name\\("${MODULE_NAME}"\\)`), 'Kotlin module must declare the same name');
});

test('expo-module.config.json points at classes that exist', () => {
  assert.deepEqual(moduleConfig.platforms, ['apple', 'android']);
  const appleClass = moduleConfig.apple.modules[0] as string;
  assert.match(swift, new RegExp(`class ${appleClass}\\b`), `Swift class ${appleClass} must exist`);
  // Background delivery needs observer queries before JavaScript runs, so a launch-time subscriber is registered.
  const subscriber = moduleConfig.apple.appDelegateSubscribers[0] as string;
  assert.match(read('ios/HealthSpecObservers.swift'), new RegExp(`class ${subscriber}: ExpoAppDelegateSubscriber\\b`), `Swift subscriber ${subscriber} must exist`);

  const androidClass = moduleConfig.android.modules[0] as string;
  const [, ...rest] = [androidClass.slice(0, androidClass.lastIndexOf('.')), androidClass.slice(androidClass.lastIndexOf('.') + 1)];
  const simpleName = rest[0] as string;
  const packageName = androidClass.slice(0, androidClass.lastIndexOf('.'));
  assert.match(kotlin, new RegExp(`^package ${packageName.replace(/\./g, '\\.')}$`, 'm'), 'Kotlin package must match the autolinking entry');
  assert.match(kotlin, new RegExp(`class ${simpleName}\\b`), `Kotlin class ${simpleName} must exist`);
  assert.equal(packageName, gradle.match(/namespace "([^"]+)"/)?.[1], 'Kotlin package must match the Gradle namespace');
});

test('the podspec only reads package.json fields that exist', () => {
  for (const field of [...podspec.matchAll(/package\['([^']+)'\]/g)].map((m) => m[1] as string)) {
    assert.ok(pkg[field] !== undefined, `podspec reads package.json "${field}", which is missing`);
  }
  assert.ok(pkg.repository?.url, 'podspec dereferences repository.url');
  assert.match(podspec, /s\.dependency 'ExpoModulesCore'/);
  // The HealthSpec pod is not published; the shared sources are copied into ios/Shared instead.
  assert.doesNotMatch(podspec, /s\.dependency 'HealthSpec'/, 'the pod must not depend on an unpublished pod');
  assert.match(podspec, /s\.source_files = "\*\*\/\*\.\{h,m,mm,swift,hpp,cpp\}"/, 'Shared/ and the Objective-C exception catcher must be compiled');
  assert.match(podspec, /s\.frameworks = 'HealthKit'/);
});

test('the Gradle module follows current Expo conventions', () => {
  const code = gradle.replace(/\/\/[^\n]*/g, '');
  assert.match(code, /plugins \{[\s\S]*id 'com\.android\.library'[\s\S]*id 'expo-module-gradle-plugin'[\s\S]*\}/, 'must use the plugins block, not apply plugin:');
  // Autolinking includes only this module's Gradle project, so there is no project(':healthspec') to depend on.
  assert.doesNotMatch(code, /project\(/, 'must not depend on a Gradle project autolinking does not include');
  assert.match(code, /api "androidx\.health\.connect:connect-client:[\d.]+"/, 'the copied sources compile against the Health Connect client');
  assert.equal(code.match(/connect-client:([\d.]+)/)?.[1], readFileSync(path.resolve(PKG, '../../packages/google/build.gradle'), 'utf8').match(/connect-client:([\d.]+)/)?.[1], 'both builds use one client version');
  assert.doesNotMatch(code, /kotlinx-coroutines/, 'coroutines come from expo-modules-core; declaring them again risks a version clash');
  assert.equal(gradle.match(/minSdkVersion (\d+)/)?.[1], '26', 'Health Connect requires API 26');
});

test('publishing includes the native sources autolinking needs', () => {
  for (const entry of ['build', 'plugin/build', 'app.plugin.js', 'ios', 'android', 'expo-module.config.json']) {
    assert.ok((pkg.files as string[]).includes(entry), `package.json files must include "${entry}"`);
  }
  assert.equal(pkg.main, 'build/index.js');
  assert.equal(pkg.types, 'build/index.d.ts');
  for (const peer of ['expo', 'react', 'react-native']) assert.ok(pkg.peerDependencies[peer], `${peer} must be a peer dependency`);
  assert.ok(!pkg.dependencies['expo-modules-core'], 'expo-modules-core is provided by expo, not a direct dependency');
});

test('the config plugin entry point resolves to the built plugin', () => {
  assert.match(read('app.plugin.js'), /require\('\.\/plugin\/build'\)\.default/);
  assert.equal(json('plugin/tsconfig.json').compilerOptions.module, 'CommonJS', 'config plugins are loaded by Node as CommonJS');
  assert.equal(json('plugin/tsconfig.json').compilerOptions.outDir, 'build');
});

test('every native method the TypeScript providers call is implemented on both platforms', () => {
  const native = read('src/native.ts');
  const block = (start: string, end?: string) => {
    const from = native.indexOf(start);
    return native.slice(from, end ? native.indexOf(end) : undefined);
  };
  const declared = (source: string) => [...source.matchAll(/^  ([a-zA-Z]+)[(<]/gm)].map((m) => m[1] as string).filter((n) => n !== 'addListener');
  const implemented = (source: string) => new Set([...source.matchAll(/(?:Async)?Function\("([a-zA-Z]+)"/g)].map((m) => m[1] as string));

  const appleMethods = declared(block('export interface AppleHealthNative', '// ---------------------------------------------------------------- Android'));
  const androidMethods = declared(block('export interface HealthConnectNative'));
  assert.ok(appleMethods.length > 15 && androidMethods.length > 10, 'sanity: the interfaces were parsed');

  const inSwift = implemented(swift);
  const inKotlin = implemented(kotlin);
  assert.deepEqual(appleMethods.filter((m) => !inSwift.has(m)), [], 'Swift module is missing methods');
  assert.deepEqual(androidMethods.filter((m) => !inKotlin.has(m)), [], 'Kotlin module is missing methods');
});

test('the published packages carry no third-party runtime dependencies', () => {
  // HealthSpec credits its verification oracles in NOTICE.md but must never ship their code.
  const FORBIDDEN = ['@kingstinct/react-native-healthkit', 'react-native-health', 'react-native-health-connect'];
  for (const rel of ['package.json', '../../packages/core/package.json', '../../packages/schema/package.json']) {
    const p = json(rel);
    const declared = Object.keys({ ...(p.dependencies ?? {}), ...(p.peerDependencies ?? {}) });
    for (const forbidden of FORBIDDEN) {
      assert.ok(!declared.includes(forbidden), `${p.name} must not depend on ${forbidden}`);
    }
  }
  assert.deepEqual(Object.keys(pkg.dependencies), ['@healthspec/core', '@healthspec/schema']);
  // Native builds pull from the platform vendors only; the Health Connect client is declared by the
  // shared package this bridge depends on.
  const sharedGradle = readFileSync(path.resolve(PKG, '../../packages/google/build.gradle'), 'utf8');
  assert.match(sharedGradle, /androidx\.health\.connect:connect-client/);
  assert.doesNotMatch(read('android/build.gradle'), /matinzd|kingstinct/);
  assert.doesNotMatch(sharedGradle, /matinzd|kingstinct/);
  assert.doesNotMatch(read('ios/HealthSpecExpo.podspec'), /kingstinct|RCTAppleHealthKit/);
});

test('the native sources the bridge needs ship inside the npm package', () => {
  // packages/apple and packages/google are the source of truth, but neither is published to CocoaPods or Maven, so
  // `pnpm codegen` copies what the bridge compiles into ios/Shared and android/src/main/java/dev/healthspec, and
  // `pnpm codegen:check` fails when a copy is stale.
  const apple = path.resolve(PKG, '../../packages/apple/Sources/HealthSpec');
  const google = path.resolve(PKG, '../../packages/google/src/main/kotlin/dev/healthspec');
  const banner = /^\/\/ COPIED from packages\/(apple|google)\/.+ by `pnpm codegen`/;
  const swiftCopy = read('ios/Shared/HealthSpecSupport.swift');
  assert.match(swiftCopy, banner);
  assert.ok(swiftCopy.endsWith(readFileSync(path.join(apple, 'HealthSpecSupport.swift'), 'utf8')), 'the Swift copy matches its source');
  for (const file of ['Serialization.kt', 'Aggregation.kt']) {
    const copy = read(`android/src/main/java/dev/healthspec/${file}`);
    assert.match(copy, banner);
    assert.ok(copy.endsWith(readFileSync(path.join(google, file), 'utf8')), `the Kotlin copy of ${file} matches its source`);
  }
  assert.doesNotMatch(swift, /^import HealthSpec$/m, 'the shared Swift code is part of this pod, not a separate module');
  assert.match(kotlin, /^import dev\.healthspec\.Serialization$/m, 'the Expo module uses the shared Kotlin code');

  // The shared packages must not depend on Expo — that would defeat the point.
  assert.doesNotMatch(readFileSync(path.join(apple, 'HealthSpecSupport.swift'), 'utf8'), /ExpoModulesCore/);
  for (const file of ['Serialization.kt', 'Aggregation.kt']) {
    assert.doesNotMatch(readFileSync(path.join(google, file), 'utf8'), /expo\.modules/, `${file} must not import Expo`);
  }
});

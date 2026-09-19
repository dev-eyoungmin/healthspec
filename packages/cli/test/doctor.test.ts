import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { describeMapping, diagnose } from '../src/api.js';
import { readPlist } from '../src/files.js';

const FIXTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'app');

/** A copy of the example app's prebuild output, edited by `mutate`. */
function project(mutate: (dir: string) => void = () => {}): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'healthspec-doctor-'));
  cpSync(FIXTURE, dir, { recursive: true });
  mutate(dir);
  return dir;
}
const edit = (file: string, from: string | RegExp, to: string) => writeFileSync(file, readFileSync(file, 'utf8').replace(from, to));
const errors = (dir: string) => diagnose(dir).findings.filter((f) => f.level === 'error').map((f) => f.message);

test('the example app, prebuilt with the config plugin, is clean', () => {
  const dir = project();
  try {
    const report = diagnose(dir);
    assert.deepEqual(report.findings.filter((f) => f.level === 'error'), []);
    assert.ok(report.findings.filter((f) => f.level === 'ok').length >= 8);
    assert.ok(report.checklist.android.some((c) => c.includes('android.permission.health.WRITE_WEIGHT')));
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('missing iOS usage descriptions and entitlements are errors', () => {
  const dir = project((d) => {
    edit(path.join(d, 'ios/App/Info.plist'), /<key>NSHealthUpdateUsageDescription<\/key>\s*<string>[^<]*<\/string>/, '');
    edit(path.join(d, 'ios/App/App.entitlements'), /<key>com.apple.developer.healthkit.background-delivery<\/key>\s*<true\/>/, '');
  });
  try {
    const found = errors(dir);
    assert.ok(found.some((m) => m.startsWith('NSHealthUpdateUsageDescription is missing')), found.join('\n'));
    assert.ok(found.some((m) => m.includes('background-delivery entitlement is missing')), found.join('\n'));
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('Android: undeclared permissions, missing rationale, low minSdk and invisible Health Connect are errors', () => {
  const dir = project((d) => {
    const manifest = path.join(d, 'android/app/src/main/AndroidManifest.xml');
    edit(manifest, '<uses-permission android:name="android.permission.health.WRITE_WEIGHT"/>', '');
    edit(manifest, '<action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE"/>', '');
    edit(manifest, '<package android:name="com.google.android.apps.healthdata"/>', '');
    edit(path.join(d, 'android/gradle.properties'), 'android.minSdkVersion=26', 'android.minSdkVersion=24');
  });
  try {
    const found = errors(dir);
    assert.ok(found.some((m) => m.includes('WRITE_WEIGHT')), found.join('\n'));
    assert.ok(found.some((m) => m.includes('ACTION_SHOW_PERMISSIONS_RATIONALE')), found.join('\n'));
    assert.ok(found.some((m) => m.includes('minSdkVersion is 24')), found.join('\n'));
    assert.ok(found.some((m) => m.includes('com.google.android.apps.healthdata')), found.join('\n'));
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('configuration mistakes are reported before any native check', () => {
  const dir = project((d) => {
    const file = path.join(d, 'app.json');
    const json = JSON.parse(readFileSync(file, 'utf8'));
    json.expo.plugins[0][1].write = ['weight', 'apple_stand_hour', 'stepz'];
    writeFileSync(file, JSON.stringify(json));
  });
  try {
    const report = diagnose(dir);
    const messages = report.findings.map((f) => `${f.level}: ${f.message}`);
    assert.ok(messages.some((m) => m.startsWith('error: unknown health types: stepz')), messages.join('\n'));
    assert.ok(messages.some((m) => m.startsWith('error: "apple_stand_hour" is listed under write')), messages.join('\n'));
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('a project without native directories is told to prebuild', () => {
  const dir = project((d) => {
    rmSync(path.join(d, 'ios'), { recursive: true });
    rmSync(path.join(d, 'android'), { recursive: true });
  });
  try {
    assert.ok(diagnose(dir).findings.some((f) => f.message.includes('no ios/ or android/ directory')));
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('the plist reader handles nested dictionaries and arrays', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'healthspec-plist-'));
  try {
    const file = path.join(dir, 'Info.plist');
    writeFileSync(file, `<?xml version="1.0"?><plist version="1.0"><dict>
      <key>NSAppTransportSecurity</key><dict><key>NSExceptionDomains</key><dict><key>localhost</key><dict><key>NSHealthShareUsageDescription</key><string>nested</string></dict></dict></dict>
      <key>com.apple.developer.healthkit.access</key><array><string>health-records</string></array>
      <key>NSHealthShareUsageDescription</key><string>Reads &amp; shows steps</string>
      <key>Empty</key><string/><key>On</key><true/><key>Count</key><integer>3</integer>
    </dict></plist>`);
    const plist = readPlist(file);
    assert.equal(plist['NSHealthShareUsageDescription'], 'Reads & shows steps', 'a nested key must not shadow the top-level one');
    assert.deepEqual(plist['com.apple.developer.healthkit.access'], ['health-records']);
    assert.deepEqual([plist['Empty'], plist['On'], plist['Count']], ['', true, 3]);
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('mapping describes both platforms and warns about non-interchangeable counterparts', () => {
  const text = describeMapping('hrv_sdnn');
  assert.match(text, /HKQuantityTypeIdentifierHeartRateVariabilitySDNN/);
  assert.match(text, /Android Health Connect\n {2}not available/);
  assert.match(text, /hrv_rmssd — NOT interchangeable/);
  assert.match(describeMapping('skin_temperature'), /needs feature: HealthConnectFeatures\.FEATURE_SKIN_TEMPERATURE/);
  assert.throws(() => describeMapping('heartrate'), /did you mean/);
});

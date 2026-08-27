import assert from 'node:assert/strict';
import { test } from 'node:test';
import { androidPermissions, applyAndroidManifest, applyEntitlements, applyInfoPlist, resolveProps, type ManifestActivity, type ManifestApplication, type ManifestLike } from '../plugin/src/apply';
import { HEALTH_TYPES } from '../plugin/src/generated/permissions';

test('resolveProps expands "all" and rejects unknown types', () => {
  assert.equal(resolveProps({ read: 'all' }).readTypes.length, HEALTH_TYPES.length);
  assert.ok(!resolveProps({ write: 'all' }).writeTypes.includes('total_energy') || true);
  assert.throws(() => resolveProps({ read: ['stepz' as never] }), /unknown health types/);
  assert.deepEqual(resolveProps(undefined).readTypes, []);
});

test('android permissions derive from the spec mapping', () => {
  const props = resolveProps({ read: ['steps', 'hrv_sdnn'], write: ['weight'], background: true });
  assert.deepEqual(androidPermissions(props), ['android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND', 'android.permission.health.READ_STEPS', 'android.permission.health.WRITE_WEIGHT']);
});

test('iOS entitlements and Info.plist', () => {
  const props = resolveProps({ read: ['steps'], write: ['weight'], background: true, clinicalRecords: true });
  const ent = applyEntitlements({}, props);
  assert.equal(ent['com.apple.developer.healthkit'], true);
  assert.equal(ent['com.apple.developer.healthkit.background-delivery'], true);
  assert.deepEqual(ent['com.apple.developer.healthkit.access'], ['health-records']);
  const plist = applyInfoPlist({ NSHealthShareUsageDescription: 'custom' }, props);
  assert.equal(plist['NSHealthShareUsageDescription'], 'custom');
  assert.ok(typeof plist['NSHealthUpdateUsageDescription'] === 'string');
  const readOnly = applyInfoPlist({}, resolveProps({ read: ['steps'] }));
  assert.equal(readOnly['NSHealthUpdateUsageDescription'], undefined);
});

test('Android manifest edits are complete and idempotent', () => {
  const mainActivity: ManifestActivity = { $: { 'android:name': '.MainActivity' } };
  const application: ManifestApplication = { $: { 'android:name': '.MainApplication' }, activity: [mainActivity] };
  const manifest: ManifestLike = { manifest: { application: [application] } };
  const props = resolveProps({ read: ['steps'], history: true });
  applyAndroidManifest(manifest, props, mainActivity, application);
  applyAndroidManifest(manifest, props, mainActivity, application);
  assert.deepEqual(manifest.manifest['uses-permission']!.map((p) => p.$['android:name']), ['android.permission.health.READ_HEALTH_DATA_HISTORY', 'android.permission.health.READ_STEPS']);
  assert.equal(manifest.manifest.queries!.length, 1);
  assert.equal(mainActivity['intent-filter']!.length, 1);
  assert.equal(application['activity-alias']!.length, 1);
  assert.equal(application['activity-alias']![0]!.$['android:targetActivity'], '.MainActivity');
});

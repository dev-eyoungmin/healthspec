/**
 * Pure manifest/plist transformations — kept free of expo/config-plugins so they can be unit-tested in Node.
 */
import { HEALTH_CONNECT_BACKGROUND_PERMISSION, HEALTH_CONNECT_HISTORY_PERMISSION, HEALTH_TYPES, PERMISSIONS, type HealthType } from './generated/permissions';

export interface HealthSpecPluginProps {
  /** Types the app reads; 'all' for every spec type. */
  read?: HealthType[] | 'all';
  /** Types the app writes; 'all' for every writable type. */
  write?: HealthType[] | 'all';
  /** Read while backgrounded (HealthKit background-delivery entitlement, Health Connect background permission). */
  background?: boolean;
  /** Read Health Connect data older than 30 days. No effect on iOS. */
  history?: boolean;
  healthShareUsageDescription?: string;
  healthUpdateUsageDescription?: string;
  /** HealthKit clinical records entitlement. Off by default. */
  clinicalRecords?: boolean;
}

export interface ResolvedProps extends HealthSpecPluginProps {
  readTypes: HealthType[];
  writeTypes: HealthType[];
}

export const HEALTH_CONNECT_PACKAGE = 'com.google.android.apps.healthdata';
export const RATIONALE_ACTION = 'androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE';
export const VIEW_USAGE_ACTION = 'android.intent.action.VIEW_PERMISSION_USAGE';
export const HEALTH_PERMISSIONS_CATEGORY = 'android.intent.category.HEALTH_PERMISSIONS';
export const DEFAULT_SHARE_DESCRIPTION = 'This app reads your health data to show your activity, vitals and sleep.';
export const DEFAULT_UPDATE_DESCRIPTION = 'This app saves the health data you record back to your health store.';

export function resolveProps(props: HealthSpecPluginProps | undefined): ResolvedProps {
  const p = props ?? {};
  const resolve = (value: HealthType[] | 'all' | undefined, writable: boolean): HealthType[] => {
    if (value === 'all') return HEALTH_TYPES.filter((t) => !writable || Boolean(PERMISSIONS[t].healthkit?.write || PERMISSIONS[t].healthconnect?.write));
    return value ?? [];
  };
  const readTypes = resolve(p.read, false);
  const writeTypes = resolve(p.write, true);
  const unknown = [...readTypes, ...writeTypes].filter((t) => !HEALTH_TYPES.includes(t));
  if (unknown.length) throw new Error(`[@healthspec/expo] unknown health types in plugin config: ${unknown.join(', ')}`);
  return { ...p, readTypes, writeTypes };
}

/** Health Connect runtime permissions the manifest must declare. */
export function androidPermissions(props: ResolvedProps): string[] {
  const out = new Set<string>();
  for (const t of props.readTypes) {
    const p = PERMISSIONS[t].healthconnect?.read;
    if (p) out.add(p);
  }
  for (const t of props.writeTypes) {
    const p = PERMISSIONS[t].healthconnect?.write;
    if (p) out.add(p);
  }
  if (props.background) out.add(HEALTH_CONNECT_BACKGROUND_PERMISSION);
  if (props.history) out.add(HEALTH_CONNECT_HISTORY_PERMISSION);
  return [...out].sort();
}

export function applyEntitlements(entitlements: Record<string, unknown>, props: ResolvedProps): Record<string, unknown> {
  entitlements['com.apple.developer.healthkit'] = true;
  if (props.background) entitlements['com.apple.developer.healthkit.background-delivery'] = true;
  if (props.clinicalRecords) entitlements['com.apple.developer.healthkit.access'] = ['health-records'];
  return entitlements;
}

export function applyInfoPlist(plist: Record<string, unknown>, props: ResolvedProps): Record<string, unknown> {
  plist['NSHealthShareUsageDescription'] = props.healthShareUsageDescription ?? plist['NSHealthShareUsageDescription'] ?? DEFAULT_SHARE_DESCRIPTION;
  if (props.writeTypes.length) {
    plist['NSHealthUpdateUsageDescription'] = props.healthUpdateUsageDescription ?? plist['NSHealthUpdateUsageDescription'] ?? DEFAULT_UPDATE_DESCRIPTION;
  }
  return plist;
}

// Minimal structural view of the xml2js manifest that expo/config-plugins hands us.
interface Attr {
  $: Record<string, string>;
}
interface IntentFilter {
  action?: Attr[];
  category?: Attr[];
}
export interface ManifestActivity extends Attr {
  'intent-filter'?: IntentFilter[];
}
export interface ManifestApplication extends Attr {
  activity?: ManifestActivity[];
  'activity-alias'?: Array<Attr & { 'intent-filter'?: IntentFilter[] }>;
}
export interface ManifestLike {
  manifest: {
    'uses-permission'?: Attr[];
    queries?: Array<{ package?: Attr[] }>;
    application?: ManifestApplication[];
  };
}

/** Adds permissions, package visibility, the rationale intent filter and the Android 14 usage alias. */
export function applyAndroidManifest(manifest: ManifestLike, props: ResolvedProps, mainActivity: ManifestActivity, application: ManifestApplication): ManifestLike {
  const root = manifest.manifest;
  root['uses-permission'] ??= [];
  for (const name of androidPermissions(props)) {
    if (!root['uses-permission'].some((p) => p.$['android:name'] === name)) root['uses-permission'].push({ $: { 'android:name': name } });
  }

  root.queries ??= [];
  if (!root.queries.some((q) => q.package?.some((p) => p.$['android:name'] === HEALTH_CONNECT_PACKAGE))) {
    root.queries.push({ package: [{ $: { 'android:name': HEALTH_CONNECT_PACKAGE } }] });
  }

  mainActivity['intent-filter'] ??= [];
  if (!mainActivity['intent-filter'].some((f) => f.action?.some((a) => a.$['android:name'] === RATIONALE_ACTION))) {
    mainActivity['intent-filter'].push({ action: [{ $: { 'android:name': RATIONALE_ACTION } }] });
  }

  application['activity-alias'] ??= [];
  if (!application['activity-alias'].some((a) => a.$['android:name'] === 'ViewPermissionUsageActivity')) {
    application['activity-alias'].push({
      $: {
        'android:name': 'ViewPermissionUsageActivity',
        'android:exported': 'true',
        'android:targetActivity': mainActivity.$['android:name'] ?? '.MainActivity',
        'android:permission': 'android.permission.START_VIEW_PERMISSION_USAGE',
      },
      'intent-filter': [{ action: [{ $: { 'android:name': VIEW_USAGE_ACTION } }], category: [{ $: { 'android:name': HEALTH_PERMISSIONS_CATEGORY } }] }],
    });
  }
  return manifest;
}

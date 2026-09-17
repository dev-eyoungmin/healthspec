import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { HEALTH_CONNECT_PERMISSIONS, HEALTH_TYPES, TYPE_MAPPINGS, type HealthType } from '@healthspec/schema';
import { elements, filesOneLevelDown, readPlist, readProperties } from './files.js';

export type Level = 'error' | 'warning' | 'ok';
export type Area = 'config' | 'ios' | 'android';

export interface Finding {
  level: Level;
  area: Area;
  message: string;
  /** How to fix it, when the finding is not ok. */
  fix?: string;
}

/** The @healthspec/expo config plugin options, as written in app.json. */
export interface PluginProps {
  read?: HealthType[] | 'all';
  write?: HealthType[] | 'all';
  background?: boolean;
  history?: boolean;
  clinicalRecords?: boolean;
  healthShareUsageDescription?: string;
  healthUpdateUsageDescription?: string;
}

export interface DoctorReport {
  project: string;
  /** null when the project does not use the config plugin (or its config could not be resolved). */
  props: PluginProps | null;
  findings: Finding[];
  /** Not checkable from files — things the store consoles ask for. */
  checklist: { ios: string[]; android: string[] };
}

const PLUGIN = '@healthspec/expo';
const HC_BACKGROUND = 'android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND';
const HC_HISTORY = 'android.permission.health.READ_HEALTH_DATA_HISTORY';
const HC_PACKAGE = 'com.google.android.apps.healthdata';
const RATIONALE_ACTION = 'androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE';
const MIN_SDK = 26;
/** The config plugin's placeholder descriptions (libraries/expo-health/plugin/src/apply.ts). */
const PLACEHOLDER_DESCRIPTIONS = [
  'This app reads your health data to show your activity, vitals and sleep.',
  'This app saves the health data you record back to your health store.',
];

/** The plugin's props from app.json, or from `expo config` for a dynamic app.config.js / .ts. */
export function loadPluginProps(project: string): PluginProps | null {
  let config: { plugins?: unknown[] } | undefined;
  const appJson = path.join(project, 'app.json');
  if (existsSync(appJson)) {
    const json = JSON.parse(readFileSync(appJson, 'utf8')) as { expo?: { plugins?: unknown[] }; plugins?: unknown[] };
    config = json.expo ?? json;
  }
  const dynamic = ['app.config.ts', 'app.config.js', 'app.config.mjs', 'app.config.cjs'].some((f) => existsSync(path.join(project, f)));
  if (dynamic) {
    const result = spawnSync('npx', ['expo', 'config', '--type', 'prebuild', '--json'], { cwd: project, encoding: 'utf8' });
    if (result.status === 0) config = JSON.parse(result.stdout) as { plugins?: unknown[] };
  }
  const entry = (config?.plugins ?? []).find((p) => p === PLUGIN || (Array.isArray(p) && p[0] === PLUGIN));
  if (entry === undefined) return null;
  return Array.isArray(entry) ? ((entry[1] as PluginProps | undefined) ?? {}) : {};
}

const typesOf = (value: HealthType[] | 'all' | undefined, writable: boolean): HealthType[] =>
  value === 'all' ? HEALTH_TYPES.filter((t) => !writable || TYPE_MAPPINGS[t].healthkit?.write || TYPE_MAPPINGS[t].healthconnect?.write) : (value ?? []);

export function diagnose(project: string, propsOverride?: PluginProps | null): DoctorReport {
  const findings: Finding[] = [];
  const add = (level: Level, area: Area, message: string, fix?: string) => findings.push({ level, area, message, ...(fix ? { fix } : {}) });
  const props = propsOverride !== undefined ? propsOverride : loadPluginProps(project);

  // ---------------------------------------------------------------- config
  if (!props) {
    add('warning', 'config', `the ${PLUGIN} config plugin is not configured`, `add ["${PLUGIN}", { "read": [...], "write": [...] }] to expo.plugins in app.json`);
  }
  const read = typesOf(props?.read, false);
  const write = typesOf(props?.write, true);
  const unknown = [...read, ...write].filter((t) => !(HEALTH_TYPES as readonly string[]).includes(t));
  if (unknown.length) add('error', 'config', `unknown health types: ${unknown.join(', ')}`, 'use the type ids from docs/mapping/README.md');
  const known = (ts: HealthType[]) => ts.filter((t) => (HEALTH_TYPES as readonly string[]).includes(t));
  for (const t of known(write)) {
    const m = TYPE_MAPPINGS[t];
    if (!m.healthkit?.write && !m.healthconnect?.write) add('error', 'config', `"${t}" is listed under write but no platform lets apps write it`, `move "${t}" to read`);
    else if (m.healthkit && !m.healthkit.write) add('warning', 'config', `"${t}" cannot be written on iOS — HealthKit only lets apps read it`);
  }
  if (props && read.length === 0 && write.length === 0) add('warning', 'config', 'the plugin declares no types, so no permissions are declared', 'list the types the app reads and writes');

  // ---------------------------------------------------------------- iOS
  const ios = path.join(project, 'ios');
  if (existsSync(ios)) {
    const infoPlists = filesOneLevelDown(ios, 'Info.plist');
    const entitlementFiles = filesOneLevelDown(ios, '.entitlements');
    const entitlements = Object.assign({}, ...entitlementFiles.map((f) => readPlist(f))) as Record<string, unknown>;
    const info = Object.assign({}, ...infoPlists.map((f) => readPlist(f))) as Record<string, unknown>;

    if (entitlements['com.apple.developer.healthkit'] === true) add('ok', 'ios', 'HealthKit entitlement');
    else add('error', 'ios', 'the HealthKit entitlement (com.apple.developer.healthkit) is missing', 'run `npx expo prebuild` with the config plugin, and enable HealthKit for the App ID in the Apple Developer portal');

    for (const [key, what, needed] of [
      ['NSHealthShareUsageDescription', 'reading', true],
      ['NSHealthUpdateUsageDescription', 'writing', true],
    ] as const) {
      const text = info[key];
      if (typeof text !== 'string' || text.trim() === '') {
        if (needed) add('error', 'ios', `${key} is missing — HealthKit terminates the app when it asks for ${what} access`, `set healthShareUsageDescription / healthUpdateUsageDescription in the plugin options`);
      } else if (PLACEHOLDER_DESCRIPTIONS.includes(text)) {
        add('warning', 'ios', `${key} is the plugin's placeholder text`, 'App Review (guideline 5.1.3) expects a description of what this app does with the data');
      } else {
        add('ok', 'ios', key);
      }
    }

    if (props?.background) {
      if (entitlements['com.apple.developer.healthkit.background-delivery'] === true) add('ok', 'ios', 'background delivery entitlement');
      else add('error', 'ios', 'background: true, but the background-delivery entitlement is missing', 'run `npx expo prebuild` again');
      if (info['HealthSpecBackgroundDelivery'] !== true) add('error', 'ios', 'background: true, but Info.plist lacks HealthSpecBackgroundDelivery, so the module reports background as unsupported', 'run `npx expo prebuild` again');
    } else if (entitlements['com.apple.developer.healthkit.background-delivery'] === true) {
      add('warning', 'ios', 'the background-delivery entitlement is present but the plugin does not enable background', 'set background: true or remove the entitlement');
    }

    const clinical = read.some((t) => t.startsWith('clinical_'));
    const access = entitlements['com.apple.developer.healthkit.access'];
    const hasRecords = Array.isArray(access) && access.includes('health-records');
    if (clinical || props?.clinicalRecords) {
      if (hasRecords) add('ok', 'ios', 'clinical records entitlement');
      else add('error', 'ios', 'clinical_* types are read, but the health-records entitlement is missing', 'set clinicalRecords: true in the plugin options');
      if (typeof info['NSHealthClinicalHealthRecordsShareUsageDescription'] !== 'string') {
        add('error', 'ios', 'NSHealthClinicalHealthRecordsShareUsageDescription is missing — reading clinical records terminates the app', 'set clinicalRecords: true (and healthClinicalRecordsUsageDescription) in the plugin options');
      }
    }
  }

  // ---------------------------------------------------------------- Android
  const android = path.join(project, 'android');
  if (existsSync(android)) {
    const manifestFile = path.join(android, 'app', 'src', 'main', 'AndroidManifest.xml');
    if (!existsSync(manifestFile)) {
      add('error', 'android', 'android/app/src/main/AndroidManifest.xml not found', 'run `npx expo prebuild`');
    } else {
      const manifest = readFileSync(manifestFile, 'utf8');
      const declared = new Set(elements(manifest, 'uses-permission').map((e) => e.attributes['android:name'] ?? ''));
      const expected = new Set<string>();
      for (const t of known(read)) {
        const p = HEALTH_CONNECT_PERMISSIONS[t].read;
        if (p) expected.add(p);
      }
      for (const t of known(write)) {
        const p = HEALTH_CONNECT_PERMISSIONS[t].write;
        if (p) expected.add(p);
      }
      if (props?.background) expected.add(HC_BACKGROUND);
      if (props?.history) expected.add(HC_HISTORY);

      const missing = [...expected].filter((p) => !declared.has(p)).sort();
      if (missing.length) add('error', 'android', `health permissions missing from the manifest: ${missing.join(', ')}`, 'run `npx expo prebuild` — Health Connect never grants an undeclared permission');
      else if (expected.size) add('ok', 'android', `${expected.size} health permissions declared`);
      const extra = [...declared].filter((p) => p.startsWith('android.permission.health.') && !expected.has(p)).sort();
      if (extra.length) add('warning', 'android', `health permissions declared but not in the plugin options: ${extra.join(', ')}`, 'Play Console asks you to justify every declared health permission; remove what the app does not use');

      const rationale = elements(manifest, 'activity').some((a) => a.inner.includes(RATIONALE_ACTION)) || elements(manifest, 'activity-alias').some((a) => a.inner.includes(RATIONALE_ACTION));
      if (rationale) add('ok', 'android', 'permissions rationale intent filter (Android 13 and lower)');
      else add('error', 'android', `no activity handles ${RATIONALE_ACTION} — Health Connect will not show the permission dialog on Android 13 and lower`, 'run `npx expo prebuild`; the activity must show your privacy policy');

      const usage = elements(manifest, 'activity-alias').find((a) => a.inner.includes('android.intent.action.VIEW_PERMISSION_USAGE') && a.inner.includes('android.intent.category.HEALTH_PERMISSIONS'));
      if (!usage) add('error', 'android', 'no activity-alias handles VIEW_PERMISSION_USAGE with the HEALTH_PERMISSIONS category — required on Android 14 and later', 'run `npx expo prebuild`');
      else if (usage.attributes['android:permission'] !== 'android.permission.START_VIEW_PERMISSION_USAGE') add('error', 'android', 'the permission-usage activity-alias is not protected by START_VIEW_PERMISSION_USAGE', 'run `npx expo prebuild`');
      else add('ok', 'android', 'permission usage activity (Android 14 and later)');

      const visible = elements(manifest, 'queries').some((q) => elements(q.inner, 'package').some((p) => p.attributes['android:name'] === HC_PACKAGE));
      if (visible) add('ok', 'android', 'Health Connect package visibility');
      else add('error', 'android', `<queries> does not include ${HC_PACKAGE} — availability() cannot see Health Connect on Android 11 and later`, 'run `npx expo prebuild`');
    }

    const propsFile = path.join(android, 'gradle.properties');
    const minSdk = existsSync(propsFile) ? Number(readProperties(propsFile)['android.minSdkVersion'] ?? NaN) : NaN;
    if (Number.isNaN(minSdk)) add('error', 'android', `android.minSdkVersion is not set, so it defaults to 24; Health Connect needs ${MIN_SDK}`, 'run `npx expo prebuild` — the config plugin raises it');
    else if (minSdk < MIN_SDK) add('error', 'android', `android.minSdkVersion is ${minSdk}; Health Connect needs ${MIN_SDK}`, 'raise it in the plugin options of expo-build-properties, or remove the override');
    else add('ok', 'android', `minSdkVersion ${minSdk}`);
  }

  if (!existsSync(ios) && !existsSync(android)) {
    add('warning', 'config', 'no ios/ or android/ directory — native projects were not checked', 'run `npx expo prebuild`, then `healthspec doctor` again');
  }

  const permissions = [...new Set([...known(read).map((t) => HEALTH_CONNECT_PERMISSIONS[t].read), ...known(write).map((t) => HEALTH_CONNECT_PERMISSIONS[t].write)].filter((p): p is string => Boolean(p)))].sort();
  return {
    project,
    props,
    findings,
    checklist: {
      ios: [
        'Enable the HealthKit capability for the App ID in the Apple Developer portal (and Clinical Health Records if you read clinical_* types).',
        'App Review guideline 5.1.3: health data may not be used for advertising or data mining, stored in iCloud, or disclosed to third parties without consent.',
        'Your privacy policy must describe the health data you read and write.',
      ],
      android: [
        'Play Console → App content → Health apps: complete the declaration before release; production permission dialogs fail until it is approved (allow up to 7 days, plus 5–7 business days to propagate).',
        `Justify each declared permission in the declaration${permissions.length ? `: ${permissions.join(', ')}` : ''}.`,
        'The rationale activity (ACTION_SHOW_PERMISSIONS_RATIONALE) must show your privacy policy.',
        ...(props?.background ? ['Background reads need READ_HEALTH_DATA_IN_BACKGROUND justified in the declaration, and periodic work (e.g. expo-background-task) that calls sync().'] : []),
      ],
    },
  };
}

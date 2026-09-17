import { AndroidConfig, createRunOncePlugin, withAndroidManifest, withEntitlementsPlist, withGradleProperties, withInfoPlist, type ConfigPlugin } from 'expo/config-plugins';
import { applyAndroidManifest, applyEntitlements, applyGradleProperties, applyInfoPlist, resolveProps, type GradleProperty, type HealthSpecPluginProps, type ManifestActivity, type ManifestApplication, type ManifestLike } from './apply';

export type { HealthSpecPluginProps } from './apply';

const withHealthSpec: ConfigPlugin<HealthSpecPluginProps | void> = (config, props) => {
  const resolved = resolveProps(props ?? undefined);
  config = withEntitlementsPlist(config, (c) => {
    applyEntitlements(c.modResults as Record<string, unknown>, resolved);
    return c;
  });
  config = withInfoPlist(config, (c) => {
    applyInfoPlist(c.modResults as Record<string, unknown>, resolved);
    return c;
  });
  config = withGradleProperties(config, (c) => {
    applyGradleProperties(c.modResults as GradleProperty[]);
    return c;
  });
  config = withAndroidManifest(config, (c) => {
    const manifest = c.modResults;
    const mainActivity = AndroidConfig.Manifest.getMainActivityOrThrow(manifest) as unknown as ManifestActivity;
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest) as unknown as ManifestApplication;
    applyAndroidManifest(manifest as unknown as ManifestLike, resolved, mainActivity, application);
    return c;
  });
  return config;
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require('../../package.json') as { name: string; version: string };

export default createRunOncePlugin(withHealthSpec, pkg.name, pkg.version);

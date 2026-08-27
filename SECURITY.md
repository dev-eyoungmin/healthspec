# Security

## Reporting a vulnerability

Open a [security advisory](https://github.com/dev-eyoungmin/healthspec/security/advisories/new) rather than a
public issue.

## What the published packages depend on

Nothing third-party at runtime. This is the property that determines a consumer's exposure:

| Package | Runtime dependencies |
|---|---|
| `@healthspec/schema` | none |
| `@healthspec/core` | `@healthspec/schema` |
| `@healthspec/conformance` | `@healthspec/core`, `@healthspec/schema` |
| `@healthspec/expo` | the above; `expo`, `react`, `react-native` are **peer** dependencies |
| `HealthSpec` (Swift) | Apple `HealthKit` |
| `dev.healthspec:healthspec` (Kotlin) | `androidx.health.connect:connect-client` |
| `healthspec` (Dart) | none |

An app brings its own Expo and React Native, so their versions — not ours — determine that part of its
exposure. A test in `libraries/expo-health/test/expo-integration.test.ts` fails the build if a third-party
runtime dependency is ever added.

## Handling data

HealthSpec is on-device only. It has no server, sends nothing anywhere, and stores nothing outside the
platform health store. Health records pass through memory and are returned to the caller. What an application
does with them afterwards is outside this project's scope, and is where HIPAA, GDPR and the App Store and Play
health-data policies apply.

## Known advisories in the development tree

These reach the lockfile through `example`, which is `private: true` and never published, and through the
Expo toolchain used to build and test. None of them ships to a consumer of the packages above.

### Fixed

**postcss** — four advisories (GHSA-6g55-p6wh-862q and related), path traversal and arbitrary `.map` file
disclosure via `sourceMappingURL`. Reached through `expo > @expo/metro-config`. Resolved with a
`pnpm.overrides` entry pinning `postcss ^8.5.26`; the same major as what Expo resolves, so this is a patch
bump rather than a behaviour change.

### Not applicable

**uuid** ([GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq), moderate) — missing buffer
bounds check **in the `v3`, `v5` and `v6` generators** when a `buf` argument is supplied. Reached through
`expo > @expo/config-plugins > xcode`, which declares `uuid ^7.0.3` and calls only `uuid.v4` — verified by
reading its source. The affected code paths are never executed.

Not overridden: the patched line is `uuid@11`, four majors ahead of what `xcode` is written against, and the
upgrade would risk breaking `expo prebuild` to fix a function nobody calls.

### No fix available

**image-size** (two advisories, high) — denial of service through infinite loops in the ICNS, JXL and HEIF
parsers. Reached through `expo > @expo/metro > metro`, which uses it to size image assets while bundling.
Every published version is affected; there is no patched release to move to.

Exposure is limited to bundling: it requires a malicious image inside the project being built, and it affects
the developer's own machine at build time, not any shipped application. Tracked for a Metro release that
changes the dependency.

## Keeping this current

[Dependabot](.github/dependabot.yml) opens grouped update pull requests weekly. Re-run the analysis with:

```sh
pnpm audit
```

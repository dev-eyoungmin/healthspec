<!-- What changed, and why. The commit messages carry the detail; this is the summary a reviewer reads first. -->

## What this changes

## How it was verified

<!-- Which of these ran, and what they said. Delete what does not apply. -->

- [ ] `pnpm verify` (codegen freshness, build, typecheck, tests, the HealthKit runtime check)
- [ ] `pnpm --filter @healthspec/release check` (tarballs, module formats, versions, bundle size)
- [ ] Android: `packages/google` unit tests · the example app builds
- [ ] iOS: the example app builds (CI job `ios`)
- [ ] On a device: the example app's Conformance panel

## Mapping changes

<!-- A mapping is a claim about somebody else's SDK. Say what backs it: another library, a compile, the
     runtime check, or a device. See CONTRIBUTING.md. Delete this section if nothing in spec/ changed. -->

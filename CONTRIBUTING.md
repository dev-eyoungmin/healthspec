# Contributing

## The rule that matters

`spec/schema` is the single source of truth. Everything under any `generated/` directory is produced from it.

Adding a health type is one JSON file plus `pnpm codegen`. Never edit generated output by hand — CI fails if
it is stale.

## Setup

```sh
pnpm install
pnpm verify        # codegen freshness + build + typecheck + tests + the Swift runtime check
```

`pnpm verify` needs a Swift toolchain for its last step. On Linux, run `pnpm test` instead.

## Adding a health type

1. Write `spec/schema/types/<id>.json`. Copy a neighbouring type; the `x-healthspec` block carries the
   category, kind, aggregate functions and the platform mappings.
2. `pnpm codegen`
3. `pnpm verify`

If the type exists on one platform only, that is fine — say so by omitting the other mapping. Do not invent a
mapping to make a type look cross-platform.

## Changing a mapping

Mappings are claims about somebody else's SDK, so they need evidence. In increasing order of strength:

1. another library that compiles against the SDK agrees (`pnpm verify:mappings`)
2. the generated code compiles against the SDK
3. the SDK resolves the identifier (`swift run healthspec-check`)
4. a device returns the right data

Level 1 has already been wrong once — see [`docs/VERIFICATION.md`](docs/VERIFICATION.md). When levels
disagree, the higher one wins. Record what you relied on in the type's `notes`.

## Implementing a provider

Implement `Provider` from `@healthspec/core` and run the conformance suite:

```ts
import { runConformanceSuite } from '@healthspec/conformance';
const report = await runConformanceSuite(myProvider);
```

Declaring `changes: false` is a legitimate choice — the suite skips what you do not claim. Claiming something
you do not do is what it is there to catch.

## Commit messages

`type(scope): what changed`, then why in the body. Explain the reasoning, not the diff.

# @healthspec/core

Platform-independent half of the HealthSpec SDK:

- `Provider` — the contract every data source implements (SPEC §9)
- `HealthStore` — the facade apps use; validates arguments and records before they reach a provider
- `MockProvider` — in-memory provider with deterministic seed data, permission/cursor simulation; runs in Expo Go, Jest and CI
- `encodeCursor` / `decodeCursor` — opaque sync cursors
- `bucketRanges` and friends — zone-aware hour/day/week/month buckets via `Intl`
- `aggregateRecords` — reference aggregation used by the mock and by conformance tests
- `HealthError` — the only error type that crosses the provider boundary

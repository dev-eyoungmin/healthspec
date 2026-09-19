# @healthspec/core

Platform-independent half of the HealthSpec SDK:

- `Provider` — the contract every data source implements (SPEC §9)
- `HealthStore` — the facade apps use; validates arguments and records before they reach a provider
- `MockProvider` — in-memory provider with deterministic seed data, permission/cursor simulation; runs in Expo Go, Jest and CI.
  Pass `platform: 'ios' | 'android'` to mirror that platform's types, writable types, optional operations and
  permission semantics
- `encodeCursor` / `decodeCursor` — opaque sync cursors
- `bucketRanges` and friends — zone-aware hour/day/week/month buckets via `Intl`
- `aggregateRecords` — reference aggregation (aligned buckets, values clipped to the range) used by the mock and providers' record fallbacks
- `readChunks` / `readAll` — walk a wide range a window at a time, so a year of heart rate never lands in one array
- `syncTypes` — incremental sync with cursor storage: at-least-once delivery, resync when a cursor expires
- `HealthError` — the only error type that crosses the provider boundary

Ships as both ES modules and CommonJS, so Jest needs no extra configuration.

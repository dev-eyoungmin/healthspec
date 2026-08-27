# HealthSpec — the specification

- [`SPEC.md`](SPEC.md) — normative behaviour: permissions, availability, reading, aggregation, cursors, provider contract.
- [`schema/common`](schema/common) — record envelope and source.
- [`schema/enums`](schema/enums) — shared enumerations with per-platform mappings.
- [`schema/types`](schema/types) — one JSON Schema (draft 2020-12) per health type, including the HealthKit / Health Connect mapping in `x-healthspec`.
- `conformance/` — provider test scenarios (Phase 2).

The generated, human-readable mapping table lives at [`../docs/mapping/README.md`](../docs/mapping/README.md).

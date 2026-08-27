# @healthspec/schema

Generated from the HealthSpec specification (`spec/schema`). Contains:

- `HealthType`, per-type `…Value` / `…Record` interfaces and the `HealthRecord` union
- `TYPE_MAPPINGS`, `HEALTHKIT_IDENTIFIERS`, `HEALTH_CONNECT_PERMISSIONS` and enum mapping tables
- `SCHEMA_BUNDLE` — every JSON Schema verbatim, for runtime validation and conformance tooling
- `units` — conversions between canonical units and common display units
- API semantics shared by every provider: `PermissionStatus`, `Availability`, `HealthErrorCode`

No runtime dependencies.

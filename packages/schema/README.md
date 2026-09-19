# @healthspec/schema

Generated from the HealthSpec specification (`spec/schema`). Contains:

- `HealthType`, per-type `…Value` / `…Record` interfaces and the `HealthRecord` union
- `TYPE_MAPPINGS`, `HEALTHKIT_IDENTIFIERS`, `HEALTH_CONNECT_PERMISSIONS` and enum mapping tables
- `validateRecord` / `validateValue` — dependency-free validators generated from the schemas
- `TYPE_EXAMPLES` — each type's schema examples, all valid
- `SCHEMA_BUNDLE` — every JSON Schema verbatim, for Ajv and tooling. Import it from `@healthspec/schema/bundle`; it
  is not part of the main entry point, so apps do not bundle half a megabyte of schemas
- `units` — conversions between canonical units and common display units
- API semantics shared by every provider: `PermissionStatus`, `Availability`, `HealthErrorCode`

No runtime dependencies.

# HealthSpec — Specification

**Version 0.1 (draft) · 2026-08-23**

HealthSpec defines a platform-neutral data model and provider contract for on-device health data. The JSON Schemas in `schema/` are normative for *data*; this document is normative for *behaviour*. The key words MUST, MUST NOT, SHOULD and MAY are to be interpreted as in RFC 2119.

A **provider** is an implementation of the contract in §9 over one data store: Apple HealthKit, Android Health Connect, a vendor SDK, or a mock. A **conformant provider** passes the conformance suite (`conformance/`, forthcoming) for every type and capability it declares.

Semantics follow IEEE 1752.1 / Open mHealth where both define a concept. HealthSpec adds what a mobile SDK needs and those standards leave open: platform mapping, permissions, availability, and incremental sync.

---

## 1. Data model

### 1.1 Record envelope

Every record is a JSON object conforming to `schema/common/record.json`:

| Field | Semantics |
|---|---|
| `id` | Stable within a provider. MUST be unique per `(provider, type)`. Providers that flatten a native series (§5.3) MUST derive ids as `<nativeId>#<index>`. |
| `type` | A health type id (§2). |
| `start`, `end` | RFC 3339 instants. `end` MUST be ≥ `start`. For `kind: sample`, `end` MUST equal `start`. |
| `zoneOffset` | The UTC offset in effect at `start`, when the platform records it. Consumers MUST NOT infer it from the device's current zone. |
| `value` | Type-specific object in **canonical units** (§1.3). MUST validate against `schema/types/<type>.json`. |
| `source` | §1.4. Always present; `recordingMethod` MUST be set (`unknown` is allowed). |
| `metadata` | Provider-specific string map, passed through untouched. Keys SHOULD be namespaced (`hk.`, `hc.`, `<vendor>.`). |

### 1.2 Record kinds

Each type declares a `kind` in `x-healthspec`:

- **sample** — a measurement at an instant. `start == end`.
- **interval** — a quantity accumulated over `[start, end]` (steps, energy, distance, hydration, nutrition). Intervals from one source MUST NOT overlap for the same type; providers MUST NOT split or merge native intervals except as required by §5.3.
- **session** — an episode with optional internal structure (exercise, sleep, mindfulness). Duration is `end − start`.

### 1.3 Units

Every numeric value field carries its canonical unit in the schema (`x-unit`). Providers MUST convert native values to the canonical unit on read and from it on write, without rounding beyond the platform's own precision. Canonical units are SI-based: metres, kilograms, kilocalories, degrees Celsius, millimoles per litre, litres, percent (0–100), milliseconds, beats/min, breaths/min. `@healthspec/schema` ships conversion helpers for display units; conversions are the *consumer's* job, never the provider's.

Distinct statistics are distinct types even when their units match. `hrv_sdnn` and `hrv_rmssd` MUST NOT be converted into one another.

### 1.4 Source

`source.app` identifies the writing application (bundle id / package name). `source.device` describes the measuring device when the platform exposes it. `source.recordingMethod` is `manual` for user-entered data, `automatic` for passive sensor data, `active` for data captured during a user-initiated session (Health Connect only), else `unknown`.

Providers MUST preserve source information on read; consumers use it for de-duplication (§6.3) and filtering.

### 1.5 Time

All instants are UTC-anchored RFC 3339 strings. Day/week/month bucketing (§6) is performed in the **query's** zone, which defaults to the device's current zone and MAY be overridden per query. A bucket boundary that does not exist or exists twice (DST) resolves as the platform does; conformance tests only require that no record is counted twice or dropped.

---

## 2. Types

Health types are identified by snake_case ids (`steps`, `heart_rate`, …) defined one per file under `schema/types/`. A type's `x-healthspec` block is part of the specification:

```
category   activity | body | vitals | sleep | nutrition | wellness
kind       sample | interval | session
since      spec version that introduced the type
aggregate  aggregate functions the type supports (§6)
platforms  healthkit / healthconnect mapping (identifiers, units, read/write support, notes)
openmhealth  the Open mHealth schema this type aligns with, when one exists
```

A provider declares the subset of types it supports via `capabilities()`. A type present on one platform only is still a first-class type; the other platform simply does not declare it.

### 2.1 Platform differences

Differences between platforms are part of the specification, not something an implementation hides. Three kinds exist, and each MUST be discoverable before a call is made:

**Type availability.** Each type declares which platforms persist it. The generated tables `CROSS_PLATFORM_TYPES`, `IOS_ONLY_TYPES` and `ANDROID_ONLY_TYPES` expose this at build time; `store.support(type)` at runtime. Calling an unsupported type MUST reject with `NOT_SUPPORTED` — never return an empty result, which is indistinguishable from "no data".

**Field availability.** A type supported by both platforms may still have value fields only one of them persists (Health Connect records `cervical_mucus.sensation`; HealthKit does not). Such fields are optional in the schema, MUST be absent rather than defaulted on the platform that lacks them, and are listed by `store.support(type).missingFields`. A provider MUST NOT invent a value for a field its platform cannot supply.

**Counterparts.** Where the platforms model the same domain differently, each type names its nearest relative on the other platform with an explicit `interchangeable` flag:

- `interchangeable: true` — the same measurement organised differently (Health Connect's activity-agnostic `speed` vs HealthKit's `running_speed`/`cycling_speed`). Substituting one for the other is correct.
- `interchangeable: false` — different measurements that must never be converted into each other or summed (`hrv_sdnn` vs `hrv_rmssd`; `basal_energy` in kcal vs `basal_metabolic_rate` in kcal/day; `distance` vs `distance_cycling`, where adding both double-counts).

Providers MUST include the counterpart in the `NOT_SUPPORTED` message so the error itself tells the developer where to go. Implementations MUST NOT silently substitute a counterpart, including an interchangeable one — the choice belongs to the caller.

**Capabilities.** Beyond types, `capabilities()` declares the optional operations a provider offers (`profile`, `routes`, `readById`, `openSettings`, `revokePermissions`, `preferredUnits`). Each MUST reject with `NOT_SUPPORTED` where the flag is false. Health Connect has no user characteristics, so an Android provider declares `profile: false`; HealthKit has no permission-revocation API, so an iOS provider declares `revokePermissions: false`.

Adding a type is a *minor* spec version; changing a value schema incompatibly or removing a type is a *major* version (§10).

---

## 3. Permissions

### 3.1 Status

Permission is tracked per `(type, access)` where access is `read` or `write`.

```
PermissionStatus = granted | denied | unknown
```

`unknown` is a legitimate, permanent state, not a transient one. Apple HealthKit does not reveal whether read access was granted; a HealthKit provider MUST report `unknown` for every read permission and MUST NOT infer `granted` from the presence of data or `denied` from its absence. Health Connect providers MUST report `granted`/`denied` from `getGrantedPermissions`.

### 3.2 Requesting

`requestPermissions({ read, write, background?, history? })` prompts the user as the platform allows and resolves with the status of every requested item plus the capabilities:

- `background` — read while the app is not in the foreground. Health Connect: `READ_HEALTH_DATA_IN_BACKGROUND`. HealthKit: background delivery, which requires no user prompt; providers report `granted` when the app is entitled, else `not_supported` semantics via `NOT_SUPPORTED`.
- `history` — read data older than the platform's default window. Health Connect: `READ_HEALTH_DATA_HISTORY` (default window is 30 days before first grant). HealthKit has no such window; providers report `granted`.

Requesting a type the provider does not support MUST reject with `NOT_SUPPORTED` before any prompt.

### 3.3 Declaration

Native manifests/entitlements MUST declare exactly the permissions implied by the types an app requests. `HEALTH_CONNECT_PERMISSIONS` and `HEALTHKIT_IDENTIFIERS` in `@healthspec/schema` are the authoritative mapping; the reference config plugin derives declarations from them.

---

## 4. Availability

```
Availability = available | not_installed | update_required | not_supported
```

`availability()` MUST be callable before any permission request and MUST NOT prompt. Health Connect: `not_supported` below API 26, `not_installed` when the Health Connect app is absent (Android ≤ 13), `update_required` when the installed client is too old. HealthKit: `not_supported` when `HKHealthStore.isHealthDataAvailable()` is false. Any other call while availability is not `available` MUST reject with `NOT_AVAILABLE`. Providers SHOULD offer `openInstaller()` for the two recoverable states.

---

## 5. Reading

### 5.1 Query

```
read(type, { start, end, sources?, limit?, order?, zone? })
```

- The range is `[start, end)`. Interval records overlapping the range are returned whole (not clipped).
- `sources.excludeManual` omits `recordingMethod = manual`. `sources.apps` / `sources.devices` filter by source when the platform can.
- Results are ordered by `start` ascending unless `order: 'desc'`.
- `limit` caps the result count; providers MUST NOT silently truncate without `limit`.

### 5.2 Raw results

`read` returns raw records with full `source` information. It MUST NOT de-duplicate across sources (§6.3 explains why).

### 5.3 Series flattening

Where the native store holds a series inside one record (Health Connect `HeartRateRecord.samples`, `SkinTemperatureRecord.deltas`), the provider MUST return one `sample` record per element with `id = <nativeId>#<index>` and `start = end = sample.time`. The native record's `source` applies to every element.

### 5.4 Session derivation

Where the native store has no session object (HealthKit sleep analysis), the provider MUST derive sessions: group consecutive stage samples from the same `source` whose gap is ≤ 60 minutes; the session's `id` is the first sample's native id, `start`/`end` span the group, and `value.stages` lists the samples in order. Consumers needing the raw samples use `metadata.hk.sampleIds`.

---

## 6. Aggregation

```
aggregate(type, { start, end, fn, bucket?, zone?, sources? })
```

### 6.1 Functions

`sum` (interval kinds), `avg` / `min` / `max` (sample kinds), `count` (any), `duration` (session kinds; sum of `end − start`). A type lists its supported functions in `x-healthspec.aggregate`; others MUST reject with `NOT_SUPPORTED`.

### 6.2 Buckets

`bucket` is `hour | day | week | month`, evaluated in `zone` (§1.5). Weeks start on Monday (ISO 8601). Multi-field types (blood pressure, nutrition) aggregate their first numeric field unless the query names a `field`. Each bucket result carries its own `start`/`end`. Empty buckets MUST be present with `null` values so consumers can draw gaps.

### 6.3 De-duplication

Two sources often record the same physical activity (phone + watch steps). Platforms resolve this in their own aggregate APIs — HealthKit by source priority in statistics queries, Health Connect inside `aggregate`. Therefore:

- `aggregate()` MUST return the platform's de-duplicated result.
- `read()` MUST return the raw, possibly overlapping records.
- A consumer summing `read()` results will over-count; this is by design and MUST be documented by every SDK.

---

## 7. Writing and deleting

`write(records)` accepts records without `id` (assigned by the store) and resolves with the stored records including ids. Providers MUST validate every record against its schema before touching the native store and reject the whole batch with `INVALID_ARGUMENT` on the first failure — partial writes are not allowed. A type whose platform mapping has `write: false` MUST reject with `NOT_SUPPORTED`.

`delete({ ids })` and `delete({ type, start, end })` remove records the calling app wrote. Platforms refuse to delete other apps' data; providers surface that as `PERMISSION_DENIED`.

---

## 8. Changes and subscriptions

### 8.1 Cursors

```
changes(type, { cursor? }) → { upserts, deletes, cursor }
```

A **cursor** is an opaque string encoding the provider's sync position (HealthKit `HKQueryAnchor`, Health Connect changes token). Calling `changes` without a cursor returns every current record and a cursor; calling with a cursor returns only what changed since. Cursors MUST be safe to persist and MUST be monotonic: replaying a cursor never yields changes older than those already returned for it.

`deletes` is a list of ids. Providers MUST deliver deletions; a consumer that mirrors data needs them.

When a cursor can no longer be resumed (Health Connect tokens expire after 30 days; anchors are invalidated by a store reset) the provider MUST reject with `CURSOR_EXPIRED`. The consumer then performs a full resync by calling `changes` without a cursor.

### 8.2 Subscriptions

`subscribe(types, handler)` invokes `handler` when the store reports new data for any listed type, and returns an unsubscribe function. Delivery is best-effort and MAY be coalesced; handlers MUST fetch via `changes` rather than trusting the event payload. With the `background` capability, HealthKit providers MUST register background delivery and Health Connect providers SHOULD schedule periodic work, since Health Connect has no push mechanism.

---

## 9. Provider contract

```
Provider {
  id: string                                   // 'apple' | 'google' | 'mock' | '<vendor>'
  capabilities(): {
    types: HealthType[]                        // supported types
    write: HealthType[]                        // writable subset
    aggregate: boolean
    changes: boolean
    subscribe: boolean
    background: boolean
    history: boolean
  }
  availability(): Promise<Availability>
  openInstaller?(): Promise<void>
  requestPermissions(request): Promise<PermissionResult>
  getPermissions(types): Promise<PermissionResult>
  read(type, query): Promise<HealthRecordOf<type>[]>
  aggregate(type, query): Promise<AggregateResult[]>
  write(records): Promise<HealthRecord[]>
  delete(selector): Promise<void>
  changes(type, { cursor? }): Promise<ChangeSet>
  subscribe(types, handler): () => void
}
```

Every rejection is a `HealthError { code: HealthErrorCode, message, cause? }` (codes in `@healthspec/schema`). A provider MUST NOT throw native error objects across the contract boundary.

A provider's `capabilities()` is a promise to the conformance suite: every declared type and capability is exercised; undeclared ones are asserted to reject with `NOT_SUPPORTED`. `capabilities().types` is the single answer to "is this type supported" — any internal check a provider performs MUST agree with it, so that an unsupported type rejects with `NOT_SUPPORTED` before permissions are ever consulted.

### 9.1 Optional operations

Beyond the operations above, a provider MAY implement `getProfile`, `readRoute`, `readById`, `openSettings`, `revokePermissions` and `preferredUnits`. Each is announced by the matching `capabilities()` flag and MUST reject with `NOT_SUPPORTED` where that flag is false. Not every platform can offer them: Health Connect has no user characteristics, so an Android provider declares `profile: false`; HealthKit has no permission-revocation API, so an Apple provider declares `revokePermissions: false`.

### 9.2 Conformance

`@healthspec/conformance` runs the specification's scenarios against a provider. Each scenario cites the clause it enforces and calls the provider directly rather than through a facade. A provider MAY claim conformance at a spec version when the suite reports no failures at that version; skipped scenarios (capabilities the provider does not declare) do not prevent conformance.

---

## 10. Versioning

The spec uses semantic versioning. Within a major version: schemas only gain optional fields or new types; enum values may be added (consumers MUST tolerate unknown values by mapping them to `unknown`/`other`); canonical units never change. `x-healthspec.since` records the version that introduced each type.

Platform mapping corrections (wrong identifier, wrong unit) are patch releases — they change provider behaviour but not the data model.

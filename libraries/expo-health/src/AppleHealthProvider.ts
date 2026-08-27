import {
  EXERCISE_TYPE_MAPPING,
  EXERCISE_TYPE_VALUES,
  HEALTHKIT_IDENTIFIERS,
  HEALTH_TYPES,
  SLEEP_STAGE_MAPPING,
  SLEEP_STAGE_VALUES,
  TYPE_MAPPINGS,
  type DeviceType,
  type ExerciseRouteRecord,
  type ExerciseType,
  type HealthKitMapping,
  type HealthProfile,
  type HealthRecord,
  type HealthRecordOf,
  type HealthSource,
  type HealthType,
  type SleepStage,
  type SleepSessionValue,
} from '@healthspec/schema';
import {
  DAY,
  aggregateRecords,
  assertAggregateSupported,
  assertRange,
  decodeCursor,
  defaultZone,
  encodeCursor,
  invalidArgument,
  notAvailable,
  notSupported,
  primaryField,
  startOfBucket,
  toIso,
  zonedParts,
  type AggregateQuery,
  type AggregateResult,
  type Capabilities,
  type ChangeHandler,
  type ChangeSet,
  type ChangesOptions,
  type DeleteSelector,
  type NewRecord,
  type PermissionRequest,
  type PermissionResult,
  type Provider,
  type ReadQuery,
  type Unsubscribe,
} from '@healthspec/core';
import { native } from './errors.js';
import { defined } from './util.js';
import {
  ACTIVITY_MOVE_MODE,
  BIOLOGICAL_SEX,
  BLOOD_TYPE,
  ECG_CLASSIFICATION,
  ECG_SYMPTOMS_STATUS,
  FITZPATRICK_SKIN_TYPE,
  MEDICATION_LOG_STATUS,
  MEDICATION_SCHEDULE_TYPE,
  STATE_OF_MIND_ASSOCIATION,
  STATE_OF_MIND_KIND,
  STATE_OF_MIND_LABEL,
  STATE_OF_MIND_VALENCE_CLASSIFICATION,
  nameOf,
  namesOf,
  rawOf,
} from './hk-tables.js';
import { HK_WORKOUT_ACTIVITY_TYPES, hkWorkoutName } from './hk-workout-types.js';
import type { AppleHealthNative, HKKind, HKMedication, HKQueryOptions, HKSample, HKSaveSample } from './native.js';

const HOUR = 3_600_000;
/** SPEC §5.4 — sleep samples closer than this belong to one session. */
const SESSION_GAP_MS = 60 * 60_000;
const WORKOUT_IDENTIFIER = 'HKWorkoutTypeIdentifier';
const FOOD_CORRELATION = 'HKCorrelationTypeIdentifierFood';
const SLEEP_IDENTIFIER = 'HKCategoryTypeIdentifierSleepAnalysis';
const CHARACTERISTIC_IDENTIFIERS = [
  'HKCharacteristicTypeIdentifierBiologicalSex',
  'HKCharacteristicTypeIdentifierBloodType',
  'HKCharacteristicTypeIdentifierDateOfBirth',
  'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
  'HKCharacteristicTypeIdentifierWheelchairUse',
  'HKCharacteristicTypeIdentifierActivityMoveMode',
];
/** HK metadata dictionary keys behind the HKMetadataKey* constants used in the spec's mapping strings. */
const METADATA_KEYS: Record<string, string> = {
  HKMetadataKeyIndoorWorkout: 'HKIndoorWorkout',
  HKMetadataKeySwimmingLocationType: 'HKSwimmingLocationType',
  HKMetadataKeyWasUserEntered: 'HKWasUserEntered',
  HKMetadataKeyTimeZone: 'HKTimeZone',
};
const METADATA_VALUES: Record<string, string> = { true: 'true', pool: '1', openWater: '2' };

/** Mapping kinds whose native objects are HKSampleTypes: queryable, anchorable, observable, deletable. */
const SAMPLE_KINDS: ReadonlySet<HealthKitMapping['kind']> = new Set(['quantity', 'category', 'correlation', 'workout', 'electrocardiogram', 'heartbeatSeries', 'stateOfMind', 'clinical', 'medicationDose']);

// HKCategoryValueSleepAnalysis raw values by case name.
const SLEEP_VALUE_BY_CASE: Record<string, number> = { inBed: 0, asleepUnspecified: 1, awake: 2, asleepCore: 3, asleepDeep: 4, asleepREM: 5 };
const SLEEP_STAGE_BY_VALUE = new Map<number, SleepStage>();
const SLEEP_VALUE_BY_STAGE = new Map<SleepStage, number>();
for (const stage of SLEEP_STAGE_VALUES) {
  const hk = SLEEP_STAGE_MAPPING[stage].healthkit;
  const value = hk ? SLEEP_VALUE_BY_CASE[hk.split('.').pop() ?? ''] : undefined;
  if (value === undefined) continue;
  SLEEP_STAGE_BY_VALUE.set(value, stage);
  SLEEP_VALUE_BY_STAGE.set(stage, value);
}
/** Stages HealthKit cannot express are written as the nearest category value. */
const SLEEP_FALLBACK_VALUE: Partial<Record<SleepStage, number>> = { awake_in_bed: 0, out_of_bed: 2, unknown: 1 };

interface ExerciseRule {
  type: ExerciseType;
  hkName: string;
  condition?: { key: string; value: string };
}
/** Parsed from the spec's HealthKit mapping strings, e.g. "running (HKMetadataKeyIndoorWorkout=true)". */
const EXERCISE_RULES: ExerciseRule[] = [];
for (const type of EXERCISE_TYPE_VALUES) {
  const hk = EXERCISE_TYPE_MAPPING[type].healthkit;
  const m = hk ? /^(\w+)(?: \((\w+)=(\w+)\))?$/.exec(hk) : null;
  if (!m) continue;
  const rule: ExerciseRule = { type, hkName: m[1] ?? '' };
  if (m[2] && m[3]) rule.condition = { key: m[2], value: m[3] };
  EXERCISE_RULES.push(rule);
}

function resolveExerciseType(sample: HKSample): ExerciseType {
  const name = sample.workoutActivityType === undefined ? undefined : hkWorkoutName(sample.workoutActivityType);
  if (!name) return 'other';
  const candidates = EXERCISE_RULES.filter((r) => r.hkName === name);
  const conditional = candidates.find((r) => {
    if (!r.condition) return false;
    const key = METADATA_KEYS[r.condition.key] ?? r.condition.key;
    return sample.metadata[key] === (METADATA_VALUES[r.condition.value] ?? r.condition.value);
  });
  return (conditional ?? candidates.find((r) => !r.condition) ?? candidates[0])?.type ?? 'other';
}

function exerciseToHK(activity: ExerciseType): { rawValue: number; metadata: Record<string, string> } {
  const rule = EXERCISE_RULES.find((r) => r.type === activity);
  const rawValue = (rule && HK_WORKOUT_ACTIVITY_TYPES[rule.hkName]) ?? HK_WORKOUT_ACTIVITY_TYPES['other'] ?? 3000;
  const metadata: Record<string, string> = {};
  if (rule?.condition) metadata[METADATA_KEYS[rule.condition.key] ?? rule.condition.key] = METADATA_VALUES[rule.condition.value] ?? rule.condition.value;
  return { rawValue, metadata };
}

/** Category sample → spec value, driven by the schema's `values` / `valueField` / `metadataFields`. */
function categoryToValue(m: HealthKitMapping, s: HKSample): Record<string, unknown> {
  const value: Record<string, unknown> = {};
  if (m.valueField && m.values) {
    const entry = Object.entries(m.values).find(([, raw]) => raw === s.category);
    if (entry) value[m.valueField] = entry[0];
  }
  for (const [field, spec] of Object.entries(m.metadataFields ?? {})) {
    const raw = s.metadata[spec.key];
    if (raw === undefined) continue;
    if (spec.type === 'boolean') {
      const b = raw === 'true' || raw === '1';
      value[field] = spec.booleanEnum ? (b ? spec.booleanEnum.true : spec.booleanEnum.false) : b;
    } else if (spec.type === 'number') {
      const n = Number(raw);
      if (!Number.isNaN(n)) value[field] = n;
    } else {
      value[field] = raw;
    }
  }
  return value;
}

/** Spec value → HKCategoryValue raw value plus the metadata entries the schema maps. */
function valueToCategory(m: HealthKitMapping, value: Record<string, unknown>): { category: number; metadata: Record<string, string> } {
  let category = 0;
  if (m.valueField && m.values) {
    const v = value[m.valueField];
    category = (typeof v === 'string' ? m.values[v] : undefined) ?? Object.values(m.values)[0] ?? 0;
  }
  const metadata: Record<string, string> = {};
  for (const [field, spec] of Object.entries(m.metadataFields ?? {})) {
    const v = value[field];
    if (v === undefined) continue;
    if (spec.type === 'boolean') {
      if (spec.booleanEnum) {
        if (v === spec.booleanEnum.true) metadata[spec.key] = 'true';
        else if (v === spec.booleanEnum.false) metadata[spec.key] = 'false';
      } else {
        metadata[spec.key] = v ? 'true' : 'false';
      }
    } else {
      metadata[spec.key] = String(v);
    }
  }
  return { category, metadata };
}

const formatOffset = (ms: number): string => {
  const sign = ms < 0 ? '-' : '+';
  const abs = Math.abs(ms) / 60_000;
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
};

const unique = <T>(xs: T[]): T[] => [...new Set(xs)];

function inferDeviceType(device: NonNullable<HKSample['device']>): DeviceType | undefined {
  const text = `${device.model ?? ''} ${device.name ?? ''}`;
  if (/watch/i.test(text)) return 'watch';
  if (/iphone/i.test(text)) return 'phone';
  return undefined;
}

function toSource(s: HKSample): HealthSource {
  const app: NonNullable<HealthSource['app']> = { id: s.sourceBundleId };
  if (s.sourceName) app.name = s.sourceName;
  const source: HealthSource = { app, recordingMethod: s.wasUserEntered ? 'manual' : 'automatic' };
  if (s.device) {
    const device: NonNullable<HealthSource['device']> = {};
    if (s.device.manufacturer) device.manufacturer = s.device.manufacturer;
    if (s.device.model) device.model = s.device.model;
    const type = inferDeviceType(s.device);
    if (type) device.type = type;
    source.device = device;
  }
  return source;
}

interface RecordBase {
  id: string;
  start: string;
  end: string;
  zoneOffset?: string;
  source: HealthSource;
  metadata: Record<string, string>;
}

function baseOf(s: HKSample, extra: Record<string, string> = {}): RecordBase {
  const base: RecordBase = { id: s.uuid, start: s.start, end: s.end, source: toSource(s), metadata: { ...s.metadata, 'hk.identifier': s.identifier, ...extra } };
  const zone = s.metadata[METADATA_KEYS['HKMetadataKeyTimeZone'] ?? 'HKTimeZone'];
  if (zone) {
    try {
      base.zoneOffset = formatOffset(zonedParts(Date.parse(s.start), zone).offsetMs);
    } catch {
      /* unknown zone name — leave unset */
    }
  }
  return base;
}

const record = (type: HealthType, base: RecordBase, value: unknown): HealthRecord => ({ type, ...base, value }) as HealthRecord;

type Sortable = { start: string; id?: string; uuid?: string };
const byStart = (a: Sortable, b: Sortable) => Date.parse(a.start) - Date.parse(b.start) || (a.id ?? a.uuid ?? '').localeCompare(b.id ?? b.uuid ?? '');

function sortLimit(records: HealthRecord[], query: Pick<ReadQuery, 'order' | 'limit'>): HealthRecord[] {
  const sorted = [...records].sort(byStart);
  if (query.order === 'desc') sorted.reverse();
  return query.limit === undefined ? sorted : sorted.slice(0, query.limit);
}

/** Hide provider-internal keys before handing metadata back to the platform. */
const externalMetadata = (metadata: Record<string, string> | undefined): Record<string, string> =>
  Object.fromEntries(Object.entries(metadata ?? {}).filter(([k]) => !k.startsWith('hk.')));

/** SPEC §5.4: group consecutive stage samples of one source (gap ≤ 60 min) into sessions. */
export function deriveSleepSessions(samples: HKSample[]): HealthRecord[] {
  const bySource = new Map<string, HKSample[]>();
  for (const s of [...samples].sort(byStart)) {
    const list = bySource.get(s.sourceBundleId) ?? [];
    list.push(s);
    bySource.set(s.sourceBundleId, list);
  }
  const sessions: HealthRecord[] = [];
  for (const list of bySource.values()) {
    let group: HKSample[] = [];
    let groupEnd = -Infinity;
    const flush = () => {
      if (group.length === 0) return;
      const first = group[0] as HKSample;
      const stages: SleepSessionValue['stages'] = group.map((s) => ({ stage: SLEEP_STAGE_BY_VALUE.get(s.category ?? -1) ?? 'unknown', start: s.start, end: s.end }));
      const base = baseOf(first, { 'hk.sampleIds': group.map((s) => s.uuid).join(',') });
      base.start = first.start;
      base.end = toIso(groupEnd);
      sessions.push(record('sleep_session', base, { stages } satisfies SleepSessionValue));
      group = [];
      groupEnd = -Infinity;
    };
    for (const s of list) {
      if (group.length && Date.parse(s.start) - groupEnd > SESSION_GAP_MS) flush();
      group.push(s);
      groupEnd = Math.max(groupEnd, Date.parse(s.end));
    }
    flush();
  }
  return sessions.sort(byStart);
}

interface AnchorTarget {
  identifier: string;
  kind: HKKind;
  unit?: string;
  units?: Record<string, string>;
}

export interface AppleHealthProviderOptions {
  /** Background delivery frequency applied to subscriptions once `background` has been requested. Default 'immediate'. */
  backgroundFrequency?: 'immediate' | 'hourly' | 'daily';
}

export interface Medication {
  id: string;
  name: string;
  nickname?: string;
  /** HKMedicationGeneralForm raw value */
  generalForm: string;
  isArchived: boolean;
  hasSchedule: boolean;
}

/**
 * HealthKit provider. The native module is a thin bridge over HealthKit primitives; all type mapping,
 * unit scaling, sleep-session derivation and correlation handling lives here, where it is unit-testable.
 */
export class AppleHealthProvider implements Provider {
  readonly id = 'apple';
  readonly platform = 'ios' as const;
  private backgroundRequested = false;
  private listener: { remove(): void } | undefined;
  private readonly subscriptions = new Map<symbol, { handler: ChangeHandler; types: Set<HealthType>; observerIds: string[] }>();
  private readonly typesByIdentifier = new Map<string, HealthType[]>();

  constructor(
    private readonly nativeModule: AppleHealthNative,
    private readonly options: AppleHealthProviderOptions = {},
  ) {
    for (const type of this.capabilities().types) {
      for (const target of this.anchorTargets(type)) {
        const list = this.typesByIdentifier.get(target.identifier) ?? [];
        list.push(type);
        this.typesByIdentifier.set(target.identifier, list);
      }
    }
  }

  // ---------------------------------------------------------------- contract

  capabilities(): Capabilities {
    const types = HEALTH_TYPES.filter((t) => {
      const m = TYPE_MAPPINGS[t].healthkit;
      return m !== undefined && m.kind !== 'series' && m.kind !== 'special';
    });
    return {
      types,
      write: types.filter((t) => TYPE_MAPPINGS[t].healthkit?.write === true),
      aggregate: true,
      changes: true,
      subscribe: true,
      background: true,
      history: true,
      profile: true,
      routes: true,
      readById: true,
      openSettings: true,
      revokePermissions: false,
      preferredUnits: true,
    };
  }

  async availability() {
    return this.nativeModule.isHealthDataAvailable() ? ('available' as const) : ('not_supported' as const);
  }

  async requestPermissions(request: PermissionRequest): Promise<PermissionResult> {
    this.assertAvailable();
    const read = request.read ?? [];
    const write = request.write ?? [];
    for (const t of [...read, ...write]) this.assertType(t);
    for (const t of write) if (!this.mapping(t).write) throw notSupported(`HealthKit cannot write "${t}"`);
    const readIds = unique([...read.flatMap((t) => this.authorizationIdentifiers(t)), ...(request.profile ? CHARACTERISTIC_IDENTIFIERS : [])]);
    const writeIds = unique(write.flatMap((t) => this.authorizationIdentifiers(t)));
    await native(() => this.nativeModule.requestAuthorization(readIds, writeIds));
    if (read.some((t) => this.mapping(t).kind === 'medicationDose')) await native(() => this.nativeModule.requestMedicationsAuthorization());
    if (request.background) this.backgroundRequested = true;
    return this.permissionResult(read, write, request);
  }

  async getPermissions(types: HealthType[]): Promise<PermissionResult> {
    this.assertAvailable();
    for (const t of types) this.assertType(t);
    return this.permissionResult(types, types, {});
  }

  async read<T extends HealthType>(type: T, query: ReadQuery): Promise<HealthRecordOf<T>[]> {
    this.assertAvailable();
    this.assertType(type);
    const { startMs, endMs } = assertRange(query.start, query.end);
    if (type === 'sleep_session') return (await this.readSleepSessions(startMs, endMs, query)) as HealthRecordOf<T>[];
    const m = this.mapping(type);
    if (m.kind === 'activitySummary') return (await this.readActivitySummaries(type, startMs, endMs, query)) as HealthRecordOf<T>[];
    const samples = await this.fetch(m, this.queryOptions(query, startMs, endMs));
    const records = sortLimit(this.convert(type, m, samples), query);
    if (m.kind === 'heartbeatSeries') await this.attachHeartbeats(records);
    return records as HealthRecordOf<T>[];
  }

  async aggregate(type: HealthType, query: AggregateQuery): Promise<AggregateResult[]> {
    this.assertAvailable();
    this.assertType(type);
    assertAggregateSupported(type, query.fn);
    const { startMs, endMs } = assertRange(query.start, query.end);
    const zone = defaultZone();
    if (query.zone !== undefined && query.zone !== zone) throw notSupported('HealthKit aggregates in the device time zone only');
    const m = this.mapping(type);
    const fn = query.fn;
    const statistical = fn === 'sum' || fn === 'avg' || fn === 'min' || fn === 'max';
    const identifiers = statistical ? this.statisticsIdentifiers(type, m, query.field) : [];
    if (!statistical || identifiers.length === 0) {
      const records = await this.read(type, { start: query.start, end: query.end, ...(query.sources ? { sources: query.sources } : {}) });
      return aggregateRecords(type, records, query);
    }
    const unit = this.statisticsUnit(type, m, query.field);
    const run = (identifier: string) =>
      native(() =>
        this.nativeModule.statistics({
          identifier,
          unit,
          start: toIso(startMs),
          end: toIso(endMs),
          fn,
          ...(query.bucket ? { interval: { unit: query.bucket, count: 1 }, anchor: toIso(startOfBucket(startMs, query.bucket, zone)) } : {}),
          ...(query.sources?.excludeManual ? { excludeUserEntered: true } : {}),
        }),
      );
    const results = await Promise.all(identifiers.map(run));
    const scale = m.unit === '%' ? 100 : 1;
    const merged = new Map<string, AggregateResult>();
    for (const stats of results) {
      for (const s of stats) {
        const prev = merged.get(s.start);
        const value = s.value === null ? null : s.value * scale;
        if (!prev) merged.set(s.start, { start: s.start, end: s.end, value });
        else if (value !== null) prev.value = (prev.value ?? 0) + value;
      }
    }
    return [...merged.values()].sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  }

  async write(records: NewRecord[]): Promise<HealthRecord[]> {
    this.assertAvailable();
    const groups = records.map((r) => {
      this.assertType(r.type);
      if (!this.mapping(r.type).write) throw notSupported(`HealthKit cannot write "${r.type}"`);
      return { record: r, samples: this.toSaveSamples(r) };
    });
    const flat = groups.flatMap((g) => g.samples);
    const uuids = await native(() => this.nativeModule.save(flat));
    const bundleId = this.nativeModule.bundleIdentifier();
    let offset = 0;
    return groups.map((g) => {
      const ids = uuids.slice(offset, offset + g.samples.length);
      offset += g.samples.length;
      const source: HealthSource = { app: { id: bundleId }, recordingMethod: g.record.source?.recordingMethod ?? 'manual' };
      if (g.record.source?.device) source.device = g.record.source.device;
      const metadata: Record<string, string> = { ...(g.record.metadata ?? {}) };
      if (ids.length > 1) metadata['hk.sampleIds'] = ids.join(',');
      return { ...g.record, id: ids[0] ?? '', source, metadata } as HealthRecord;
    });
  }

  async delete(selector: DeleteSelector): Promise<void> {
    this.assertAvailable();
    this.assertType(selector.type);
    const targets = this.deleteTargets(selector.type);
    if ('ids' in selector) {
      await Promise.all(targets.map((t) => native(() => this.nativeModule.deleteObjects(t.identifier, t.kind, selector.ids))));
    } else {
      const { startMs, endMs } = assertRange(selector.start, selector.end);
      await Promise.all(targets.map((t) => native(() => this.nativeModule.deleteByRange(t.identifier, t.kind, toIso(startMs), toIso(endMs)))));
    }
  }

  async changes<T extends HealthType>(type: T, options: ChangesOptions = {}): Promise<ChangeSet<T>> {
    this.assertAvailable();
    this.assertType(type);
    const m = this.mapping(type);
    const targets = this.anchorTargets(type);
    if (targets.length === 0) return (await this.timeBasedChanges(type, options)) as ChangeSet<T>;
    let anchors: Record<string, string> = {};
    if (options.cursor !== undefined) {
      const payload = decodeCursor(options.cursor, this.id);
      try {
        anchors = JSON.parse(payload.t) as Record<string, string>;
      } catch {
        throw invalidArgument('cursor is malformed');
      }
    }
    const results = await Promise.all(
      targets.map((t) =>
        native(() =>
          this.nativeModule.anchoredQuery({
            identifier: t.identifier,
            kind: t.kind,
            ...(t.unit ? { unit: t.unit } : {}),
            ...(t.units ? { units: t.units } : {}),
            ...(anchors[t.identifier] ? { anchor: anchors[t.identifier] as string } : {}),
            ...(options.limit !== undefined ? { limit: options.limit } : {}),
          }),
        ),
      ),
    );
    const newAnchors = Object.fromEntries(targets.map((t, i) => [t.identifier, results[i]?.anchor ?? '']));
    const cursor = encodeCursor({ p: this.id, t: JSON.stringify(newAnchors), at: Date.now() });
    const samples = results.flatMap((r) => r.samples);
    const deletes = results.flatMap((r) => r.deleted);
    let upserts: HealthRecord[];
    if (type === 'sleep_session') {
      // Sessions are derived, so re-derive every session touching the changed samples' window.
      if (samples.length === 0) upserts = [];
      else {
        const lo = Math.min(...samples.map((s) => Date.parse(s.start))) - 2 * HOUR;
        const hi = Math.max(...samples.map((s) => Date.parse(s.end))) + 2 * HOUR;
        upserts = await this.readSleepSessions(lo, hi, {});
      }
    } else {
      upserts = this.convert(type, m, samples).sort(byStart);
      if (m.kind === 'heartbeatSeries') await this.attachHeartbeats(upserts);
    }
    return { upserts: upserts as HealthRecordOf<T>[], deletes, cursor, snapshot: options.cursor === undefined };
  }

  subscribe(types: HealthType[], handler: ChangeHandler): Unsubscribe {
    for (const t of types) this.assertType(t);
    const key = Symbol('subscription');
    const entry = { handler, types: new Set(types), observerIds: [] as string[] };
    this.subscriptions.set(key, entry);
    this.ensureListener();
    const targets = unique(types.flatMap((t) => this.anchorTargets(t).map((x) => `${x.kind}|${x.identifier}`))).map((s) => {
      const [kind, identifier] = s.split('|') as [HKKind, string];
      return { kind, identifier };
    });
    void (async () => {
      for (const t of targets) {
        if (!this.subscriptions.has(key)) return;
        entry.observerIds.push(await native(() => this.nativeModule.startObserving(t.identifier, t.kind)));
        if (this.backgroundRequested) {
          await native(() => this.nativeModule.enableBackgroundDelivery(t.identifier, t.kind, this.options.backgroundFrequency ?? 'immediate')).catch(() => undefined);
        }
      }
    })().catch((e: unknown) => console.warn('[healthspec] failed to start HealthKit observer', e));
    return () => {
      const sub = this.subscriptions.get(key);
      if (!sub) return;
      this.subscriptions.delete(key);
      for (const id of sub.observerIds) this.nativeModule.stopObserving(id).catch(() => undefined);
      if (this.subscriptions.size === 0) {
        this.listener?.remove();
        this.listener = undefined;
      }
    };
  }

  // ---------------------------------------------------------------- optional operations

  async getProfile(): Promise<HealthProfile> {
    this.assertAvailable();
    const c = await native(() => this.nativeModule.characteristics());
    const profile: HealthProfile = {};
    const sex = nameOf(BIOLOGICAL_SEX, c.biologicalSex) as HealthProfile['biologicalSex'];
    if (sex) profile.biologicalSex = sex;
    if (c.dateOfBirth) profile.dateOfBirth = c.dateOfBirth;
    const blood = nameOf(BLOOD_TYPE, c.bloodType) as HealthProfile['bloodType'];
    if (blood) profile.bloodType = blood;
    const skin = nameOf(FITZPATRICK_SKIN_TYPE, c.fitzpatrickSkinType) as HealthProfile['fitzpatrickSkinType'];
    if (skin) profile.fitzpatrickSkinType = skin;
    if (c.wheelchairUse === 1) profile.wheelchairUse = false;
    else if (c.wheelchairUse === 2) profile.wheelchairUse = true;
    const move = nameOf(ACTIVITY_MOVE_MODE, c.activityMoveMode) as HealthProfile['activityMoveMode'];
    if (move) profile.activityMoveMode = move;
    return profile;
  }

  async readRoute(sessionId: string): Promise<ExerciseRouteRecord | undefined> {
    this.assertAvailable();
    const points = await native(() => this.nativeModule.workoutRoute(sessionId));
    if (!points || points.length === 0) return undefined;
    const first = points[0] as (typeof points)[number];
    const last = points[points.length - 1] as (typeof points)[number];
    return {
      id: `route:${sessionId}`,
      type: 'exercise_route',
      start: first.time,
      end: last.time,
      value: { sessionId, points: points.map((p) => defined({ time: p.time, latitude: p.latitude, longitude: p.longitude, altitudeMeters: p.altitudeMeters, horizontalAccuracyMeters: p.horizontalAccuracyMeters, verticalAccuracyMeters: p.verticalAccuracyMeters })) },
      source: { recordingMethod: 'automatic' },
      metadata: { 'hk.workoutUuid': sessionId },
    };
  }

  async readById<T extends HealthType>(type: T, id: string): Promise<HealthRecordOf<T> | undefined> {
    this.assertAvailable();
    this.assertType(type);
    const m = this.mapping(type);
    if (m.kind === 'activitySummary') throw notSupported('activity summaries have no ids — read them by date range');
    const opts: Omit<HKQueryOptions, 'identifier' | 'kind'> = { start: toIso(0), end: toIso(Date.now() + 365 * DAY), ascending: true, uuids: [id] };
    const samples = await this.fetch(m, opts);
    const records = type === 'sleep_session' ? deriveSleepSessions(samples) : this.convert(type, m, samples);
    if (m.kind === 'heartbeatSeries') await this.attachHeartbeats(records);
    return records[0] as HealthRecordOf<T> | undefined;
  }

  async openSettings(): Promise<void> {
    await native(() => this.nativeModule.openHealthApp());
  }

  async preferredUnits(types: HealthType[]): Promise<Partial<Record<HealthType, string>>> {
    this.assertAvailable();
    const identifierOf = new Map<string, HealthType>();
    for (const t of types) {
      this.assertType(t);
      const m = this.mapping(t);
      if (m.kind === 'quantity' && m.identifier) identifierOf.set(m.identifier, t);
    }
    const units = await native(() => this.nativeModule.preferredUnits([...identifierOf.keys()]));
    const out: Partial<Record<HealthType, string>> = {};
    for (const [identifier, unit] of Object.entries(units)) {
      const t = identifierOf.get(identifier);
      if (t) out[t] = unit;
    }
    return out;
  }

  /** Medications the user tracks (iOS 26). Dose events are the `medication_dose` type. */
  async listMedications(): Promise<Medication[]> {
    this.assertAvailable();
    const list: HKMedication[] = await native(() => this.nativeModule.medications());
    return list.map((m) => defined({ id: m.conceptIdentifier, name: m.displayText, nickname: m.nickname, generalForm: m.generalForm, isArchived: m.isArchived, hasSchedule: m.hasSchedule }));
  }

  /** Voltage samples (µV) of one electrocardiogram record. */
  async readEcgVoltages(id: string): Promise<Array<{ offsetSeconds: number; microvolts: number }>> {
    this.assertAvailable();
    return native(() => this.nativeModule.ecgVoltages(id));
  }

  // ---------------------------------------------------------------- mapping helpers

  private mapping(type: HealthType): HealthKitMapping {
    const m = TYPE_MAPPINGS[type].healthkit;
    if (!m) throw notSupported(`HealthKit does not support "${type}"`);
    return m;
  }

  private assertAvailable(): void {
    if (!this.nativeModule.isHealthDataAvailable()) throw notAvailable('HealthKit is not available on this device');
  }

  private assertType(type: HealthType): void {
    const m = TYPE_MAPPINGS[type]?.healthkit;
    if (!m) throw notSupported(`HealthKit does not support "${String(type)}"`);
    if (m.kind === 'series' || m.kind === 'special') throw notSupported(`"${String(type)}" is reached through a dedicated operation, not read/write`);
  }

  /** Object types to request authorization for. Correlation types cannot be authorized — their quantities are. */
  private authorizationIdentifiers(type: HealthType): string[] {
    return HEALTHKIT_IDENTIFIERS[type].filter((id) => !id.startsWith('HKCorrelationTypeIdentifier'));
  }

  private async permissionResult(read: HealthType[], write: HealthType[], request: PermissionRequest): Promise<PermissionResult> {
    const result: PermissionResult = { read: {}, write: {}, capabilities: {} };
    for (const t of read) result.read[t] = 'unknown'; // SPEC §3.1 — HealthKit never reveals read grants
    const writable = write.filter((t) => this.mapping(t).write);
    for (const t of write) if (!this.mapping(t).write) result.write[t] = 'denied';
    if (writable.length) {
      const status = await native(() => this.nativeModule.authorizationStatus(unique(writable.flatMap((t) => this.authorizationIdentifiers(t)))));
      for (const t of writable) {
        const states = this.authorizationIdentifiers(t).map((id) => status[id] ?? 'notDetermined');
        result.write[t] = states.every((s) => s === 'sharingAuthorized') ? 'granted' : states.some((s) => s === 'sharingDenied') ? 'denied' : 'unknown';
      }
    }
    if (request.background) result.capabilities.background = 'granted';
    if (request.history) result.capabilities.history = 'granted';
    if (request.profile) result.capabilities.profile = 'unknown';
    return result;
  }

  private queryOptions(query: ReadQuery, startMs: number, endMs: number): Omit<HKQueryOptions, 'identifier' | 'kind'> {
    const o: Omit<HKQueryOptions, 'identifier' | 'kind'> = { start: toIso(startMs), end: toIso(endMs), ascending: query.order !== 'desc' };
    if (query.limit !== undefined) o.limit = query.limit;
    if (query.sources?.excludeManual) o.excludeUserEntered = true;
    if (query.sources?.apps) o.sourceBundleIds = query.sources.apps;
    return o;
  }

  /** Everything `changes`/`subscribe` must watch for a type — empty for data that is not an HKSampleType. */
  private anchorTargets(type: HealthType): AnchorTarget[] {
    const m = this.mapping(type);
    switch (m.kind) {
      case 'quantity':
        return [{ identifier: m.identifier as string, kind: 'quantity', ...(m.unit ? { unit: m.unit } : {}) }];
      case 'derived':
        return (m.identifiers ?? []).map((identifier) => ({ identifier, kind: 'quantity' as const, ...(m.unit ? { unit: m.unit } : {}) }));
      case 'category':
        return [{ identifier: m.identifier as string, kind: 'category' }];
      case 'correlation':
        return [{ identifier: m.identifier as string, kind: 'correlation', units: Object.fromEntries((m.identifiers ?? []).map((id) => [id, m.unit ?? ''])) }];
      case 'workout':
        return [{ identifier: WORKOUT_IDENTIFIER, kind: 'workout' }];
      case 'multi':
        return Object.entries(m.fields ?? {}).map(([field, identifier]) => ({ identifier, kind: 'quantity' as const, unit: this.hkUnit(type, field) }));
      case 'electrocardiogram':
      case 'heartbeatSeries':
      case 'stateOfMind':
      case 'clinical':
      case 'medicationDose':
        return [{ identifier: m.identifier as string, kind: m.kind }];
      case 'activitySummary':
      case 'series':
      case 'special':
        return [];
    }
  }

  private deleteTargets(type: HealthType): AnchorTarget[] {
    const m = this.mapping(type);
    if (!SAMPLE_KINDS.has(m.kind) && m.kind !== 'multi') throw notSupported(`"${type}" cannot be deleted through delete()`);
    return this.anchorTargets(type);
  }

  /** HKUnit string for a value field; the spec's canonical unit symbols double as HKUnit strings. */
  private hkUnit(type: HealthType, field: string): string {
    return TYPE_MAPPINGS[type].fieldUnits[field] ?? '';
  }

  private statisticsIdentifiers(type: HealthType, m: HealthKitMapping, field: string | undefined): string[] {
    switch (m.kind) {
      case 'quantity':
        return [m.identifier as string];
      case 'derived':
        return m.identifiers ?? [];
      case 'correlation': {
        const fields = Object.keys(TYPE_MAPPINGS[type].fieldUnits);
        const index = Math.max(0, fields.indexOf(field ?? fields[0] ?? ''));
        const id = (m.identifiers ?? [])[index];
        return id ? [id] : [];
      }
      case 'multi': {
        const f = field ?? primaryField(type);
        const id = f ? m.fields?.[f] : undefined;
        return id ? [id] : [];
      }
      default:
        return [];
    }
  }

  private statisticsUnit(type: HealthType, m: HealthKitMapping, field: string | undefined): string {
    if (m.kind === 'multi') return this.hkUnit(type, field ?? primaryField(type) ?? '');
    return m.unit ?? '';
  }

  private async fetch(m: HealthKitMapping, opts: Omit<HKQueryOptions, 'identifier' | 'kind'>): Promise<HKSample[]> {
    const query = (identifier: string, kind: HKKind, extra: Partial<HKQueryOptions> = {}, keepLimit = true) => {
      const { limit, ...rest } = opts;
      return native(() => this.nativeModule.querySamples({ ...rest, ...(keepLimit && limit !== undefined ? { limit } : {}), ...extra, identifier, kind }));
    };
    switch (m.kind) {
      case 'quantity':
        return query(m.identifier as string, 'quantity', { unit: m.unit as string });
      case 'derived':
        return (await Promise.all((m.identifiers ?? []).map((id) => query(id, 'quantity', { unit: m.unit as string }, false)))).flat();
      case 'category':
        return query(m.identifier as string, 'category');
      case 'correlation':
        return query(m.identifier as string, 'correlation', { units: Object.fromEntries((m.identifiers ?? []).map((id) => [id, m.unit ?? ''])) });
      case 'workout':
        return query(WORKOUT_IDENTIFIER, 'workout');
      case 'multi': {
        const fields = Object.entries(m.fields ?? {});
        const type = HEALTH_TYPES.find((t) => TYPE_MAPPINGS[t].healthkit === m) ?? 'nutrition';
        return (await Promise.all(fields.map(([field, id]) => query(id, 'quantity', { unit: this.hkUnit(type, field) }, false)))).flat();
      }
      case 'electrocardiogram':
      case 'heartbeatSeries':
      case 'stateOfMind':
      case 'clinical':
      case 'medicationDose':
        return query(m.identifier as string, m.kind);
      case 'activitySummary':
      case 'series':
      case 'special':
        throw notSupported('this HealthKit type is read through a dedicated operation');
    }
  }

  /** Raw samples → spec records. Sleep sessions are derived elsewhere (readSleepSessions). */
  private convert(type: HealthType, m: HealthKitMapping, samples: HKSample[]): HealthRecord[] {
    switch (m.kind) {
      case 'quantity': {
        const field = primaryField(type) ?? 'value';
        const scale = m.unit === '%' ? 100 : 1;
        return samples.map((s) => record(type, baseOf(s), { [field]: (s.value ?? 0) * scale, ...categoryToValue(m, s) }));
      }
      case 'derived': {
        const field = primaryField(type) ?? 'value';
        return samples.map((s) => record(type, baseOf(s, { 'hk.derived': 'true' }), { [field]: s.value ?? 0 }));
      }
      case 'category':
        return type === 'sleep_session' ? deriveSleepSessions(samples) : samples.map((s) => record(type, baseOf(s), categoryToValue(m, s)));
      case 'correlation': {
        const [sysId, diaId] = m.identifiers ?? [];
        const out: HealthRecord[] = [];
        for (const s of samples) {
          const systolic = s.objects?.find((o) => o.identifier === sysId)?.value;
          const diastolic = s.objects?.find((o) => o.identifier === diaId)?.value;
          if (systolic === undefined || diastolic === undefined) continue;
          out.push(record(type, baseOf(s), { systolicMmHg: systolic, diastolicMmHg: diastolic }));
        }
        return out;
      }
      case 'workout':
        return samples.map((s) => {
          const extra: Record<string, string> = {};
          if (s.totals?.distanceMeters !== undefined) extra['hk.totalDistanceMeters'] = String(s.totals.distanceMeters);
          if (s.totals?.energyKilocalories !== undefined) extra['hk.totalEnergyKilocalories'] = String(s.totals.energyKilocalories);
          return record(type, baseOf(s, extra), { activity: resolveExerciseType(s) });
        });
      case 'multi': {
        const fieldById = new Map(Object.entries(m.fields ?? {}).map(([field, id]) => [id, field]));
        const groups = new Map<string, { base: RecordBase; value: Record<string, unknown>; ids: string[] }>();
        for (const s of [...samples].sort(byStart)) {
          const key = `${s.start}|${s.end}|${s.sourceBundleId}`;
          let g = groups.get(key);
          if (!g) {
            g = { base: baseOf(s), value: {}, ids: [] };
            groups.set(key, g);
          }
          const field = fieldById.get(s.identifier);
          if (field) g.value[field] = s.value ?? 0;
          g.ids.push(s.uuid);
          const name = s.metadata['HKFoodType'];
          if (name) g.value['name'] = name;
        }
        return [...groups.values()].map((g) => {
          if (g.ids.length > 1) g.base.metadata['hk.sampleIds'] = g.ids.join(',');
          return record(type, g.base, g.value);
        });
      }
      case 'electrocardiogram':
        return samples.map((s) =>
          record(
            type,
            baseOf(s),
            defined({
              classification: nameOf(ECG_CLASSIFICATION, s.ecg?.classification) ?? 'not_set',
              symptomsStatus: nameOf(ECG_SYMPTOMS_STATUS, s.ecg?.symptomsStatus),
              averageBpm: s.ecg?.averageHeartRate,
              samplingFrequencyHz: s.ecg?.samplingFrequency,
              voltageCount: s.ecg?.voltageCount,
            }),
          ),
        );
      case 'heartbeatSeries':
        return samples.map((s) => record(type, baseOf(s), defined({ count: s.heartbeatCount, beats: [] })));
      case 'stateOfMind':
        return samples.map((s) =>
          record(
            type,
            baseOf(s),
            defined({
              kind: nameOf(STATE_OF_MIND_KIND, s.stateOfMind?.kind) ?? 'momentary_emotion',
              valence: s.stateOfMind?.valence ?? 0,
              valenceClassification: nameOf(STATE_OF_MIND_VALENCE_CLASSIFICATION, s.stateOfMind?.valenceClassification),
              labels: namesOf(STATE_OF_MIND_LABEL, s.stateOfMind?.labels),
              associations: namesOf(STATE_OF_MIND_ASSOCIATION, s.stateOfMind?.associations),
            }),
          ),
        );
      case 'clinical':
        return samples.map((s) => {
          let fhir: Record<string, unknown> = {};
          try {
            fhir = JSON.parse(s.clinical?.fhir ?? '{}') as Record<string, unknown>;
          } catch {
            /* keep empty */
          }
          return record(
            type,
            baseOf(s),
            defined({ resourceType: s.clinical?.resourceType ?? 'Unknown', fhirVersion: s.clinical?.fhirVersion, displayName: s.clinical?.displayName, sourceUrl: s.clinical?.sourceUrl, fhir }),
          );
        });
      case 'medicationDose':
        return samples.map((s) =>
          record(
            type,
            baseOf(s),
            defined({
              medicationId: s.medication?.conceptIdentifier ?? '',
              medicationName: s.medication?.displayText,
              status: nameOf(MEDICATION_LOG_STATUS, s.medication?.logStatus) ?? 'not_logged',
              scheduleType: nameOf(MEDICATION_SCHEDULE_TYPE, s.medication?.scheduleType) ?? 'scheduled',
              scheduledAt: s.medication?.scheduledDate,
              scheduledDose: s.medication?.scheduledDoseQuantity,
              dose: s.medication?.doseQuantity,
              unit: s.medication?.unit,
            }),
          ),
        );
      case 'activitySummary':
      case 'series':
      case 'special':
        return [];
    }
  }

  private async attachHeartbeats(records: HealthRecord[]): Promise<void> {
    await Promise.all(
      records.map(async (r) => {
        const beats = await native(() => this.nativeModule.heartbeatSeries(r.id));
        (r.value as { beats: unknown[]; count?: number }).beats = beats;
        if ((r.value as { count?: number }).count === undefined) (r.value as { count?: number }).count = beats.length;
      }),
    );
  }

  private async readSleepSessions(startMs: number, endMs: number, query: Pick<ReadQuery, 'order' | 'limit' | 'sources'>): Promise<HealthRecord[]> {
    const opts: HKQueryOptions = { identifier: SLEEP_IDENTIFIER, kind: 'category', start: toIso(startMs - 24 * HOUR), end: toIso(endMs), ascending: true };
    if (query.sources?.excludeManual) opts.excludeUserEntered = true;
    if (query.sources?.apps) opts.sourceBundleIds = query.sources.apps;
    const samples = await native(() => this.nativeModule.querySamples(opts));
    const sessions = deriveSleepSessions(samples).filter((r) => Date.parse(r.end) > startMs && Date.parse(r.start) < endMs);
    return sortLimit(sessions, query);
  }

  private async readActivitySummaries(type: HealthType, startMs: number, endMs: number, query: Pick<ReadQuery, 'order' | 'limit'>): Promise<HealthRecord[]> {
    const summaries = await native(() => this.nativeModule.activitySummaries(toIso(startMs), toIso(endMs)));
    const zone = defaultZone();
    const records = summaries.map((s) => {
      const [y, mo, d] = s.date.split('-').map(Number) as [number, number, number];
      const start = new Date(Date.UTC(y, mo - 1, d));
      const end = new Date(Date.UTC(y, mo - 1, d + 1));
      const base: RecordBase = { id: `activity:${s.date}`, start: start.toISOString(), end: end.toISOString(), source: { recordingMethod: 'automatic' }, metadata: { 'hk.identifier': 'HKActivitySummaryTypeIdentifier', 'hk.zone': zone } };
      return record(
        type,
        base,
        defined({
          date: s.date,
          activeEnergyKilocalories: s.activeEnergyKilocalories,
          activeEnergyGoalKilocalories: s.activeEnergyGoalKilocalories,
          exerciseMinutes: s.exerciseMinutes,
          exerciseGoalMinutes: s.exerciseGoalMinutes,
          standHours: s.standHours,
          standGoalHours: s.standGoalHours,
          moveMinutes: s.moveMinutes,
          moveGoalMinutes: s.moveGoalMinutes,
          activityMoveMode: nameOf(ACTIVITY_MOVE_MODE, s.activityMoveMode),
        }),
      );
    });
    return sortLimit(records, query);
  }

  /** Data without anchors (activity summaries): a time-based cursor re-reads a trailing window. */
  private async timeBasedChanges(type: HealthType, options: ChangesOptions): Promise<ChangeSet> {
    const now = Date.now();
    let since = now - 30 * DAY;
    if (options.cursor !== undefined) {
      const payload = decodeCursor(options.cursor, this.id);
      const parsed = Number(payload.t);
      if (!Number.isFinite(parsed)) throw invalidArgument('cursor is malformed');
      since = parsed - 2 * DAY;
    }
    const upserts = await this.read(type, { start: new Date(since), end: new Date(now) });
    return { upserts, deletes: [], cursor: encodeCursor({ p: this.id, t: String(now), at: now }), snapshot: options.cursor === undefined };
  }

  private toSaveSamples(r: NewRecord): HKSaveSample[] {
    const m = this.mapping(r.type);
    const metadata = externalMetadata(r.metadata);
    if (r.source?.recordingMethod === 'manual') metadata[METADATA_KEYS['HKMetadataKeyWasUserEntered'] ?? 'HKWasUserEntered'] = 'true';
    const value = r.value as Record<string, unknown>;
    switch (m.kind) {
      case 'quantity': {
        const field = primaryField(r.type) ?? '';
        const raw = Number(value[field]);
        return [{ kind: 'quantity', identifier: m.identifier as string, unit: m.unit as string, value: m.unit === '%' ? raw / 100 : raw, start: r.start, end: r.end, metadata: { ...metadata, ...valueToCategory(m, value).metadata } }];
      }
      case 'category': {
        if (r.type !== 'sleep_session') {
          const c = valueToCategory(m, value);
          return [{ kind: 'category', identifier: m.identifier as string, category: c.category, start: r.start, end: r.end, metadata: { ...metadata, ...c.metadata } }];
        }
        const stages = (value['stages'] as SleepSessionValue['stages'] | undefined) ?? [];
        if (stages.length === 0) return [{ kind: 'category', identifier: m.identifier as string, category: 0, start: r.start, end: r.end, metadata }];
        return stages.map((st) => ({
          kind: 'category' as const,
          identifier: m.identifier as string,
          category: SLEEP_VALUE_BY_STAGE.get(st.stage) ?? SLEEP_FALLBACK_VALUE[st.stage] ?? 1,
          start: st.start,
          end: st.end,
          metadata,
        }));
      }
      case 'correlation': {
        const [sysId, diaId] = m.identifiers ?? [];
        return [
          {
            kind: 'correlation',
            identifier: m.identifier as string,
            start: r.start,
            end: r.end,
            metadata,
            objects: [
              { kind: 'quantity', identifier: sysId ?? '', unit: 'mmHg', value: Number(value['systolicMmHg']), start: r.start, end: r.end },
              { kind: 'quantity', identifier: diaId ?? '', unit: 'mmHg', value: Number(value['diastolicMmHg']), start: r.start, end: r.end },
            ],
          },
        ];
      }
      case 'workout': {
        const { rawValue, metadata: extra } = exerciseToHK(value['activity'] as ExerciseType);
        return [{ kind: 'workout', identifier: WORKOUT_IDENTIFIER, workoutActivityType: rawValue, start: r.start, end: r.end, metadata: { ...metadata, ...extra } }];
      }
      case 'multi': {
        const objects: HKSaveSample[] = Object.entries(m.fields ?? {})
          .filter(([field]) => typeof value[field] === 'number')
          .map(([field, identifier]) => ({ kind: 'quantity' as const, identifier, unit: this.hkUnit(r.type, field), value: value[field] as number, start: r.start, end: r.end }));
        if (objects.length === 0) throw invalidArgument(`"${r.type}" record has no nutrient values to write`);
        const name = value['name'];
        return [{ kind: 'correlation', identifier: FOOD_CORRELATION, start: r.start, end: r.end, metadata: { ...metadata, ...(typeof name === 'string' ? { HKFoodType: name } : {}) }, objects }];
      }
      case 'stateOfMind': {
        const labels = (value['labels'] as string[] | undefined) ?? [];
        const associations = (value['associations'] as string[] | undefined) ?? [];
        return [
          {
            kind: 'stateOfMind',
            identifier: m.identifier as string,
            start: r.start,
            end: r.end,
            metadata,
            stateOfMind: {
              kind: rawOf(STATE_OF_MIND_KIND, value['kind']) ?? 1,
              valence: Number(value['valence']),
              labels: labels.map((l) => rawOf(STATE_OF_MIND_LABEL, l)).filter((n): n is number => n !== undefined),
              associations: associations.map((a) => rawOf(STATE_OF_MIND_ASSOCIATION, a)).filter((n): n is number => n !== undefined),
            },
          },
        ];
      }
      case 'derived':
        throw notSupported(`"${r.type}" is derived on HealthKit and cannot be written`);
      case 'electrocardiogram':
      case 'heartbeatSeries':
      case 'clinical':
      case 'medicationDose':
      case 'activitySummary':
        throw notSupported(`"${r.type}" is system-generated on HealthKit and cannot be written`);
      case 'series':
      case 'special':
        throw notSupported(`"${r.type}" is written through a dedicated operation`);
    }
  }

  private ensureListener(): void {
    this.listener ??= this.nativeModule.addListener('onChange', ({ identifier }) => {
      const affected = this.typesByIdentifier.get(identifier) ?? [];
      for (const sub of this.subscriptions.values()) {
        const hit = affected.filter((t) => sub.types.has(t));
        if (hit.length) sub.handler({ types: hit });
      }
    });
  }
}

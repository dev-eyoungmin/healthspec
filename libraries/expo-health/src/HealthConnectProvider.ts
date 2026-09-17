import { HEALTH_CONNECT_PERMISSIONS, HEALTH_TYPES, TYPE_MAPPINGS, validateRecord, type ExerciseRouteRecord, type HealthConnectMapping, type HealthRecord, type HealthRecordOf, type HealthSource, type HealthType } from '@healthspec/schema';
import {
  aggregateRecords,
  assertAggregateSupported,
  assertRange,
  cursorExpired,
  decodeCursor,
  defaultZone,
  encodeCursor,
  invalidArgument,
  notAvailable,
  notSupported,
  primaryField,
  toIso,
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
import { fhirDisplayName, fhirTimes, parseFhir } from './fhir.js';
import { defined } from './util.js';
import type { HCFeature, HCInsertRecord, HCMedicalResource, HCReadOptions, HCRecord, HealthConnectNative } from './native.js';

export const HC_BACKGROUND_PERMISSION = 'android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND';
export const HC_HISTORY_PERMISSION = 'android.permission.health.READ_HEALTH_DATA_HISTORY';
const DAY = 86_400_000;
/** Without READ_HEALTH_DATA_HISTORY, Health Connect rejects reads older than this (SPEC §3.2). */
const DEFAULT_HISTORY_WINDOW_MS = 30 * DAY;

const unique = <T>(xs: T[]): T[] => [...new Set(xs)];

export interface HealthConnectProviderOptions {
  /**
   * Health Connect has no push mechanism; subscriptions poll `getChanges` at this interval while the app runs.
   * Default 60 s. For reading while backgrounded, schedule `store.sync()` from a background task
   * (e.g. expo-background-task) after the `background` permission is granted.
   */
  pollIntervalMs?: number;
}

/** Health Connect provider. The Kotlin module serialises records in spec shape, so this layer stays thin. */
export class HealthConnectProvider implements Provider {
  readonly id = 'google';
  readonly platform = 'android' as const;
  private featureCache: Record<HCFeature, boolean> | undefined;

  constructor(
    private readonly nativeModule: HealthConnectNative,
    private readonly options: HealthConnectProviderOptions = {},
  ) {}

  /**
   * Types and capabilities this device can actually serve. Features Health Connect rolls out per device
   * (mindfulness, skin temperature, Personal Health Record, background and history reads) are checked, so an
   * unsupported type rejects with NOT_SUPPORTED instead of failing inside the platform (SPEC §9).
   */
  capabilities(): Capabilities {
    const features = this.features();
    const types = HEALTH_TYPES.filter((t) => {
      const m = TYPE_MAPPINGS[t].healthconnect;
      return m !== undefined && !m.special && (m.feature === undefined || features[m.feature]);
    });
    return {
      types,
      write: types.filter((t) => TYPE_MAPPINGS[t].healthconnect?.write === true),
      aggregate: true,
      changes: true,
      subscribe: true,
      background: features.READ_HEALTH_DATA_IN_BACKGROUND,
      history: features.READ_HEALTH_DATA_HISTORY,
      profile: false,
      routes: true,
      readById: true,
      openSettings: true,
      revokePermissions: true,
      preferredUnits: false,
    };
  }

  async availability() {
    return native(async () => this.nativeModule.getSdkStatus());
  }

  async openInstaller(): Promise<void> {
    await native(() => this.nativeModule.openInstaller());
  }

  async requestPermissions(request: PermissionRequest): Promise<PermissionResult> {
    this.assertAvailable();
    const read = request.read ?? [];
    const write = request.write ?? [];
    const caps = this.capabilities();
    const wanted: string[] = [];
    for (const t of read) wanted.push(this.permission(t, 'read'));
    for (const t of write) wanted.push(this.permission(t, 'write'));
    if (request.background) {
      if (!caps.background) throw notSupported('this device cannot grant background reads');
      wanted.push(HC_BACKGROUND_PERMISSION);
    }
    if (request.history) {
      if (!caps.history) throw notSupported('this device cannot grant reads beyond 30 days');
      wanted.push(HC_HISTORY_PERMISSION);
    }
    const granted = new Set(await native(() => this.nativeModule.requestPermissions(unique(wanted))));
    return this.permissionResult(read, write, request, granted);
  }

  async getPermissions(types: HealthType[]): Promise<PermissionResult> {
    this.assertAvailable();
    for (const t of types) this.assertType(t);
    const caps = this.capabilities();
    const granted = new Set(await native(() => this.nativeModule.getGrantedPermissions()));
    return this.permissionResult(types, types, { background: caps.background, history: caps.history }, granted);
  }

  async read<T extends HealthType>(type: T, query: ReadQuery): Promise<HealthRecordOf<T>[]> {
    this.assertAvailable();
    this.assertType(type);
    const { startMs, endMs } = assertRange(query.start, query.end);
    const options: HCReadOptions = {
      start: toIso(startMs),
      end: toIso(endMs),
      ascending: query.order !== 'desc',
      ...(query.limit !== undefined ? { limit: query.limit } : {}),
      ...(query.sources?.excludeManual ? { excludeManual: true } : {}),
      ...(query.sources?.apps ? { apps: query.sources.apps } : {}),
    };
    if (this.mapping(type).medicalResourceType) return this.readMedical(type, query, startMs, endMs);
    const records = await native(() => this.nativeModule.readRecords(type, options));
    return records.map((r) => this.toRecord(type, r)) as HealthRecordOf<T>[];
  }

  async aggregate(type: HealthType, query: AggregateQuery): Promise<AggregateResult[]> {
    this.assertAvailable();
    this.assertType(type);
    assertAggregateSupported(type, query.fn);
    const { startMs, endMs } = assertRange(query.start, query.end);
    if (query.field !== undefined && !(query.field in TYPE_MAPPINGS[type].fieldUnits)) {
      throw invalidArgument(`"${query.field}" is not a numeric field of "${type}"`);
    }
    if (this.mapping(type).medicalResourceType) {
      const records = await this.read(type, { start: query.start, end: query.end, ...(query.sources ? { sources: query.sources } : {}) });
      return aggregateRecords(type, records, query);
    }
    const field = query.field ?? primaryField(type);
    const buckets = await native(() =>
      this.nativeModule.aggregate(type, {
        start: toIso(startMs),
        end: toIso(endMs),
        fn: query.fn,
        zone: query.zone ?? defaultZone(),
        ...(field !== undefined ? { field } : {}),
        ...(query.bucket !== undefined ? { bucket: query.bucket } : {}),
        ...(query.sources?.excludeManual ? { excludeManual: true } : {}),
        ...(query.sources?.apps ? { apps: query.sources.apps } : {}),
      }),
    );
    return buckets.map((b) => ({ start: b.start, end: b.end, value: b.value }));
  }

  /** SPEC §7: every record is validated before the platform is touched, and the batch is written in one call. */
  async write(records: NewRecord[]): Promise<HealthRecord[]> {
    this.assertAvailable();
    if (records.length === 0) return [];
    records.forEach((r, i) => {
      const issues = validateRecord(r, { partial: true }, `records[${i}]`);
      if (issues.length) throw invalidArgument(issues.map((x) => `${x.path}: ${x.message}`).join('; '));
      this.assertType(r.type);
      if (!this.mapping(r.type).write) throw notSupported(`Health Connect cannot write "${r.type}"`);
    });
    const payload: HCInsertRecord[] = records.map((r) => {
      const p: HCInsertRecord = { type: r.type, start: r.start, end: r.end, value: r.value as Record<string, unknown>, recordingMethod: r.source?.recordingMethod ?? 'manual' };
      if (r.zoneOffset) p.zoneOffset = r.zoneOffset;
      if (r.source?.device) p.device = r.source.device;
      if (r.metadata) p.metadata = r.metadata;
      return p;
    });
    const ids = await native(() => this.nativeModule.insertRecords(payload));
    const packageName = this.nativeModule.packageName();
    return records.map((r, i) => {
      const source: HealthSource = { app: { id: packageName }, recordingMethod: r.source?.recordingMethod ?? 'manual' };
      if (r.source?.device) source.device = r.source.device;
      return { ...r, id: ids[i] ?? '', source } as HealthRecord;
    });
  }

  async delete(selector: DeleteSelector): Promise<void> {
    this.assertAvailable();
    this.assertType(selector.type);
    if (this.mapping(selector.type).medicalResourceType) throw notSupported('Personal Health Record resources cannot be deleted by apps');
    if ('ids' in selector) {
      await native(() => this.nativeModule.deleteRecordsByIds(selector.type, selector.ids));
    } else {
      const { startMs, endMs } = assertRange(selector.start, selector.end);
      await native(() => this.nativeModule.deleteRecordsByRange(selector.type, toIso(startMs), toIso(endMs)));
    }
  }

  async changes<T extends HealthType>(type: T, options: ChangesOptions = {}): Promise<ChangeSet<T>> {
    this.assertAvailable();
    this.assertType(type);
    if (this.mapping(type).medicalResourceType) throw notSupported('Personal Health Record resources have no change tracking');
    if (options.cursor === undefined) {
      // SPEC §8.1: no cursor → snapshot plus a cursor for deltas. The token is taken before the read so nothing slips between.
      const token = await native(() => this.nativeModule.getChangesToken(type));
      const granted = new Set(await native(() => this.nativeModule.getGrantedPermissions()));
      const end = Date.now();
      const start = granted.has(HC_HISTORY_PERMISSION) ? 0 : end - DEFAULT_HISTORY_WINDOW_MS;
      const upserts = await this.read(type, { start: new Date(start), end: new Date(end) });
      return { upserts, deletes: [], cursor: encodeCursor({ p: this.id, t: token, at: end }), snapshot: true };
    }
    const payload = decodeCursor(options.cursor, this.id);
    const result = await native(() => this.nativeModule.getChanges(type, payload.t));
    if (result.expired) throw cursorExpired('Health Connect changes token expired — perform a full resync');
    return {
      upserts: result.upserts.map((r) => this.toRecord(type, r)) as HealthRecordOf<T>[],
      deletes: result.deletes,
      cursor: encodeCursor({ p: this.id, t: result.token, at: Date.now() }),
      snapshot: false,
    };
  }

  subscribe(types: HealthType[], handler: ChangeHandler): Unsubscribe {
    for (const t of types) {
      this.assertType(t);
      if (this.mapping(t).medicalResourceType) throw notSupported(`"${t}" has no change tracking`);
    }
    const tokens = new Map<HealthType, string>();
    let stopped = false;
    let busy = false;
    const tick = async () => {
      if (stopped || busy) return;
      busy = true;
      try {
        const changed: HealthType[] = [];
        for (const t of types) {
          const token = tokens.get(t);
          if (token === undefined) {
            tokens.set(t, await native(() => this.nativeModule.getChangesToken(t)));
            continue;
          }
          const res = await native(() => this.nativeModule.getChanges(t, token));
          if (res.expired) {
            tokens.delete(t);
            changed.push(t);
            continue;
          }
          tokens.set(t, res.token);
          if (res.upserts.length || res.deletes.length) changed.push(t);
        }
        if (changed.length && !stopped) handler({ types: changed });
      } catch (e) {
        console.warn('[healthspec] Health Connect change poll failed', e);
      } finally {
        busy = false;
      }
    };
    void tick();
    const timer = setInterval(() => void tick(), this.options.pollIntervalMs ?? 60_000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }

  // ---------------------------------------------------------------- optional operations

  async readRoute(sessionId: string): Promise<ExerciseRouteRecord | undefined> {
    this.assertAvailable();
    const points = await native(() => this.nativeModule.readExerciseRoute(sessionId));
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
      metadata: { 'hc.sessionId': sessionId },
    };
  }

  async readById<T extends HealthType>(type: T, id: string): Promise<HealthRecordOf<T> | undefined> {
    this.assertAvailable();
    this.assertType(type);
    if (this.mapping(type).medicalResourceType) throw notSupported('Personal Health Record resources are read by type and range');
    const r = await native(() => this.nativeModule.readRecord(type, id));
    if (!r) return undefined;
    return this.toRecord(type, r) as HealthRecordOf<T>;
  }

  async openSettings(): Promise<void> {
    await native(() => this.nativeModule.openSettings());
  }

  async revokePermissions(): Promise<void> {
    this.assertAvailable();
    await native(() => this.nativeModule.revokeAllPermissions());
  }

  // ---------------------------------------------------------------- helpers

  private features(): Record<HCFeature, boolean> {
    if (this.featureCache) return this.featureCache;
    let features: Record<HCFeature, boolean>;
    try {
      features = this.nativeModule.features();
    } catch {
      features = { MINDFULNESS_SESSION: false, SKIN_TEMPERATURE: false, PERSONAL_HEALTH_RECORD: false, READ_HEALTH_DATA_IN_BACKGROUND: false, READ_HEALTH_DATA_HISTORY: false };
    }
    // Features do not change while the app runs, except that none are known until Health Connect is available.
    if (this.nativeModule.getSdkStatus() === 'available') this.featureCache = features;
    return features;
  }

  /** Clinical records carry their dates inside the FHIR resource, so range, order and limit apply here. */
  private async readMedical<T extends HealthType>(type: T, query: ReadQuery, startMs: number, endMs: number): Promise<HealthRecordOf<T>[]> {
    const resources = await native(() => this.nativeModule.readMedicalResources(type, { start: toIso(startMs), end: toIso(endMs), ascending: true }));
    const records = resources
      .map((r) => this.medicalRecord(type, r))
      .filter((r) => {
        const s = Date.parse(r.start);
        return s >= startMs && s < endMs;
      })
      .filter((r) => !query.sources?.apps || query.sources.apps.includes(r.source.app?.id ?? ''))
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start) || a.id.localeCompare(b.id));
    if (query.order === 'desc') records.reverse();
    return (query.limit !== undefined ? records.slice(0, query.limit) : records) as HealthRecordOf<T>[];
  }

  private medicalRecord(type: HealthType, r: HCMedicalResource): HealthRecord {
    const fhir = parseFhir(r.fhir);
    const { start, end } = fhirTimes(fhir);
    return {
      id: r.id,
      type,
      start,
      end,
      value: { resourceType: r.resourceType, fhirVersion: r.fhirVersion, displayName: fhirDisplayName(fhir, r.resourceType), fhir },
      source: { app: { id: r.dataSourceId }, recordingMethod: 'unknown' },
      metadata: { 'hc.dataSourceId': r.dataSourceId },
    } as HealthRecord;
  }

  private mapping(type: HealthType): HealthConnectMapping {
    const m = TYPE_MAPPINGS[type].healthconnect;
    if (!m) throw notSupported(`Health Connect does not support "${type}"`);
    return m;
  }

  private assertAvailable(): void {
    const status = this.nativeModule.getSdkStatus();
    if (status !== 'available') throw notAvailable(`Health Connect is ${status.replace('_', ' ')}`);
  }

  /** Must agree with capabilities().types, so an unsupported type rejects before permissions are consulted (SPEC §9). */
  private assertType(type: HealthType): void {
    const m = TYPE_MAPPINGS[type]?.healthconnect;
    if (!m) throw notSupported(`Health Connect does not support "${String(type)}"`);
    if (m.special) throw notSupported(`"${String(type)}" is reached through a dedicated operation, not read/write`);
    if (m.feature !== undefined && !this.features()[m.feature]) throw notSupported(`"${String(type)}" needs the Health Connect feature ${m.feature}, which this device does not offer`);
  }

  private permission(type: HealthType, access: 'read' | 'write'): string {
    this.assertType(type);
    const p = HEALTH_CONNECT_PERMISSIONS[type][access];
    if (!p) throw notSupported(`Health Connect cannot ${access} "${type}"`);
    return p;
  }

  private permissionResult(read: HealthType[], write: HealthType[], request: PermissionRequest, granted: Set<string>): PermissionResult {
    const result: PermissionResult = { read: {}, write: {}, capabilities: {} };
    for (const t of read) {
      const p = HEALTH_CONNECT_PERMISSIONS[t].read;
      result.read[t] = p && granted.has(p) ? 'granted' : 'denied';
    }
    for (const t of write) {
      const p = HEALTH_CONNECT_PERMISSIONS[t].write;
      result.write[t] = p && granted.has(p) ? 'granted' : 'denied';
    }
    if (request.background) result.capabilities.background = granted.has(HC_BACKGROUND_PERMISSION) ? 'granted' : 'denied';
    if (request.history) result.capabilities.history = granted.has(HC_HISTORY_PERMISSION) ? 'granted' : 'denied';
    if (request.profile) result.capabilities.profile = 'denied';
    return result;
  }

  private toRecord(type: HealthType, r: HCRecord): HealthRecord {
    const rec: Record<string, unknown> = { id: r.id, type, start: r.start, end: r.end, value: r.value, source: r.source, metadata: r.metadata };
    if (r.zoneOffset) rec['zoneOffset'] = r.zoneOffset;
    return rec as unknown as HealthRecord;
  }
}

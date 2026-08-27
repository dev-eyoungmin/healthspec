import {
  HEALTH_TYPES,
  TYPE_MAPPINGS,
  validateRecord,
  type AccessType,
  type Availability,
  type Capability,
  type ExerciseRouteRecord,
  type HealthProfile,
  type HealthRecord,
  type HealthRecordOf,
  type HealthSource,
  type HealthType,
  type PermissionStatus,
  type PlatformId,
} from '@healthspec/schema';
import { aggregateRecords } from '../aggregate.js';
import { decodeCursor, encodeCursor } from '../cursor.js';
import { cursorExpired, invalidArgument, notAvailable, notSupported, permissionDenied } from '../errors.js';
import { assertRange } from '../time.js';
import type {
  AggregateQuery,
  AggregateResult,
  Capabilities,
  ChangeHandler,
  ChangeSet,
  ChangesOptions,
  DeleteSelector,
  NewRecord,
  PermissionRequest,
  PermissionResult,
  Provider,
  ReadQuery,
  SourceFilter,
  Unsubscribe,
} from '../types.js';
import { MOCK_APP_ID, generateSeedRecords, mulberry32 } from './seed.js';

export type PermissionPolicy = 'grant' | 'deny' | ((type: HealthType, access: AccessType) => PermissionStatus);

export interface MockProviderOptions {
  /** Seed data: a seed number (default 42), or `false` for an empty store. */
  seed?: number | false;
  /** Days of seed history (default 7). */
  days?: number;
  /** Types the mock declares; default every spec type. Seed data is limited to the declared types. */
  types?: HealthType[];
  /**
   * 'ios' mirrors HealthKit: read grants are never revealed (`unknown`) and denied reads return empty results.
   * 'android' mirrors Health Connect: read status is known and denied reads reject with PERMISSION_DENIED. Default 'ios'.
   */
  platform?: 'ios' | 'android';
  /** How requestPermissions decides. Default 'grant'. */
  permissionPolicy?: PermissionPolicy;
  availability?: Availability;
  /** Cursors older than this many ms are reported expired. Default: never. */
  cursorTtlMs?: number;
  /** Clock, for deterministic tests. */
  now?: () => number;
  /** App id stamped on records written through the provider. */
  appId?: string;
  /** Profile returned by getProfile(). */
  profile?: HealthProfile;
}

interface LogEntry {
  seq: number;
  type: HealthType;
  id: string;
  op: 'upsert' | 'delete';
}
interface Subscriber {
  types: Set<HealthType>;
  handler: ChangeHandler;
}

const overlaps = (r: HealthRecord, startMs: number, endMs: number): boolean => {
  const s = Date.parse(r.start);
  const e = Date.parse(r.end);
  return s === e ? s >= startMs && s < endMs : e > startMs && s < endMs;
};

const matchesSource = (r: HealthRecord, f: SourceFilter | undefined): boolean => {
  if (!f) return true;
  if (f.excludeManual && r.source.recordingMethod === 'manual') return false;
  if (f.apps && !f.apps.includes(r.source.app?.id ?? '')) return false;
  return true;
};

const byStart = (a: HealthRecord, b: HealthRecord) => Date.parse(a.start) - Date.parse(b.start) || a.id.localeCompare(b.id);

/**
 * In-memory provider implementing the full contract, for Expo Go, Jest/CI and the conformance suite.
 * Permission, availability and cursor behaviour are simulated faithfully enough that app code paths are exercised.
 */
export class MockProvider implements Provider {
  readonly id = 'mock';
  readonly platform: PlatformId | 'mock' = 'mock';
  private readonly options: MockProviderOptions & Required<Pick<MockProviderOptions, 'platform' | 'availability' | 'appId'>>;
  private readonly store = new Map<HealthType, Map<string, HealthRecord>>();
  private readonly log: LogEntry[] = [];
  private seq = 0;
  private nextId = 1;
  private generation = 0;
  private readonly requested = new Set<HealthType>();
  private readonly deniedReads = new Set<HealthType>();
  private readonly readStatus = new Map<HealthType, PermissionStatus>();
  private readonly writeStatus = new Map<HealthType, PermissionStatus>();
  private readonly capabilityStatus = new Map<Capability, PermissionStatus>();
  private readonly subscribers = new Set<Subscriber>();
  private readonly profile: HealthProfile;

  constructor(options: MockProviderOptions = {}) {
    this.options = { platform: 'ios', availability: 'available', appId: MOCK_APP_ID, ...options };
    this.profile = options.profile ?? { biologicalSex: 'female', dateOfBirth: '1990-05-14', bloodType: 'o_positive', wheelchairUse: false, activityMoveMode: 'active_energy' };
    if (options.seed !== false) {
      const seed = generateSeedRecords({
        seed: options.seed ?? 42,
        days: options.days ?? 7,
        end: this.now(),
        ...(options.types ? { types: options.types } : {}),
      });
      this.load(seed, 'seed');
    }
  }

  // ---------------------------------------------------------------- contract

  capabilities(): Capabilities {
    const types = this.supportedTypes().filter((t) => t !== 'exercise_route');
    const write = types.filter((t) => !t.startsWith('clinical_') && t !== 'activity_summary' && t !== 'electrocardiogram' && t !== 'heartbeat_series' && t !== 'medication_dose');
    return { types, write, aggregate: true, changes: true, subscribe: true, background: true, history: true, profile: true, routes: true, readById: true, openSettings: true, revokePermissions: true, preferredUnits: true };
  }

  async availability(): Promise<Availability> {
    return this.options.availability;
  }

  async openInstaller(): Promise<void> {
    /* nothing to install */
  }

  async requestPermissions(request: PermissionRequest): Promise<PermissionResult> {
    this.assertAvailable();
    const read = request.read ?? [];
    const write = request.write ?? [];
    for (const t of [...read, ...write]) this.assertType(t);
    const ios = this.options.platform === 'ios';
    for (const t of read) {
      const decision = this.decide(t, 'read');
      this.requested.add(t);
      if (decision === 'denied') this.deniedReads.add(t);
      else this.deniedReads.delete(t);
      this.readStatus.set(t, ios ? 'unknown' : decision);
    }
    for (const t of write) this.writeStatus.set(t, this.decide(t, 'write'));
    if (request.background) this.capabilityStatus.set('background', this.decideCapability());
    if (request.history) this.capabilityStatus.set('history', ios ? 'granted' : this.decideCapability());
    if (request.profile) this.capabilityStatus.set('profile', ios ? this.decideCapability() : 'denied');
    return this.permissionResult([...new Set([...read, ...write])]);
  }

  async getPermissions(types: HealthType[]): Promise<PermissionResult> {
    this.assertAvailable();
    for (const t of types) this.assertType(t);
    return this.permissionResult(types);
  }

  async read<T extends HealthType>(type: T, query: ReadQuery): Promise<HealthRecordOf<T>[]> {
    this.assertAvailable();
    this.assertType(type);
    if (!this.gateRead(type)) return [];
    const { startMs, endMs } = assertRange(query.start, query.end);
    let rs = this.records(type)
      .filter((r) => overlaps(r, startMs, endMs))
      .filter((r) => matchesSource(r, query.sources))
      .sort(byStart);
    if (query.order === 'desc') rs.reverse();
    if (query.limit !== undefined) rs = rs.slice(0, query.limit);
    return rs as HealthRecordOf<T>[];
  }

  async aggregate(type: HealthType, query: AggregateQuery): Promise<AggregateResult[]> {
    this.assertAvailable();
    this.assertType(type);
    const rs = this.gateRead(type) ? this.records(type).filter((r) => matchesSource(r, query.sources)) : [];
    return aggregateRecords(type, rs, query);
  }

  async write(records: NewRecord[]): Promise<HealthRecord[]> {
    this.assertAvailable();
    records.forEach((r, i) => {
      const issues = validateRecord(r, { partial: true }, `records[${i}]`);
      if (issues.length) throw invalidArgument(issues.map((x) => `${x.path}: ${x.message}`).join('; '));
      this.assertType(r.type);
      if (this.writeStatus.get(r.type) !== 'granted') throw permissionDenied(`write permission for "${r.type}" not granted`);
    });
    const stored = this.load(records, 'mock', this.options.appId);
    this.notify([...new Set(stored.map((r) => r.type))]);
    return stored;
  }

  async delete(selector: DeleteSelector): Promise<void> {
    this.assertAvailable();
    this.assertType(selector.type);
    const map = this.map(selector.type);
    let ids: string[];
    if ('ids' in selector) {
      ids = selector.ids.filter((id) => map.has(id));
    } else {
      const { startMs, endMs } = assertRange(selector.start, selector.end);
      ids = [...map.values()].filter((r) => overlaps(r, startMs, endMs)).map((r) => r.id);
    }
    // Platforms only delete the calling app's own records.
    ids = ids.filter((id) => map.get(id)?.source.app?.id === this.options.appId);
    for (const id of ids) {
      map.delete(id);
      this.log.push({ seq: ++this.seq, type: selector.type, id, op: 'delete' });
    }
    if (ids.length) this.notify([selector.type]);
  }

  async changes<T extends HealthType>(type: T, options: ChangesOptions = {}): Promise<ChangeSet<T>> {
    this.assertAvailable();
    this.assertType(type);
    const readable = this.gateRead(type);
    let since = 0;
    let snapshot = true;
    if (options.cursor !== undefined) {
      const payload = decodeCursor(options.cursor, this.id);
      const [gen, seq] = payload.t.split(':').map(Number);
      if (gen === undefined || seq === undefined || !Number.isFinite(gen) || !Number.isFinite(seq)) throw invalidArgument('cursor is malformed');
      const ttl = this.options.cursorTtlMs;
      if (gen !== this.generation || (ttl !== undefined && this.now() - payload.at > ttl)) throw cursorExpired();
      since = seq;
      snapshot = false;
    }
    const cursor = encodeCursor({ p: this.id, t: `${this.generation}:${this.seq}`, at: this.now() });
    if (!readable) return { upserts: [], deletes: [], cursor, snapshot };
    if (snapshot) return { upserts: this.records(type).sort(byStart) as HealthRecordOf<T>[], deletes: [], cursor, snapshot: true };

    const latest = new Map<string, 'upsert' | 'delete'>();
    for (const e of this.log) if (e.seq > since && e.type === type) latest.set(e.id, e.op);
    const map = this.map(type);
    const upserts: HealthRecord[] = [];
    const deletes: string[] = [];
    for (const [id, op] of latest) {
      const r = map.get(id);
      if (op === 'upsert' && r) upserts.push(r);
      else deletes.push(id);
    }
    return { upserts: upserts.sort(byStart) as HealthRecordOf<T>[], deletes, cursor, snapshot: false };
  }

  subscribe(types: HealthType[], handler: ChangeHandler): Unsubscribe {
    for (const t of types) this.assertType(t);
    const sub: Subscriber = { types: new Set(types), handler };
    this.subscribers.add(sub);
    return () => {
      this.subscribers.delete(sub);
    };
  }

  // ---------------------------------------------------------------- optional operations

  async getProfile(): Promise<HealthProfile> {
    this.assertAvailable();
    if (this.capabilityStatus.get('profile') !== 'granted' && this.options.platform === 'android') return {};
    return { ...this.profile };
  }

  async readRoute(sessionId: string): Promise<ExerciseRouteRecord | undefined> {
    this.assertAvailable();
    const session = this.map('exercise_session').get(sessionId);
    if (!session) return undefined;
    const rand = mulberry32(sessionId.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    const startMs = Date.parse(session.start);
    const endMs = Date.parse(session.end);
    const points: ExerciseRouteRecord['value']['points'] = [];
    let lat = 37.5665;
    let lng = 126.978;
    for (let i = 0; i <= 20; i++) {
      lat += (rand() - 0.5) * 0.002;
      lng += (rand() - 0.5) * 0.002;
      points.push({ time: new Date(startMs + ((endMs - startMs) * i) / 20).toISOString(), latitude: lat, longitude: lng, altitudeMeters: 30 + rand() * 20 });
    }
    return { id: `route-${sessionId}`, type: 'exercise_route', start: session.start, end: session.end, value: { sessionId, points }, source: session.source };
  }

  async readById<T extends HealthType>(type: T, id: string): Promise<HealthRecordOf<T> | undefined> {
    this.assertAvailable();
    this.assertType(type);
    if (!this.gateRead(type)) return undefined;
    return this.map(type).get(id) as HealthRecordOf<T> | undefined;
  }

  async openSettings(): Promise<void> {
    /* nothing to open */
  }

  async revokePermissions(): Promise<void> {
    this.requested.clear();
    this.deniedReads.clear();
    this.readStatus.clear();
    this.writeStatus.clear();
    this.capabilityStatus.clear();
  }

  async preferredUnits(types: HealthType[]): Promise<Partial<Record<HealthType, string>>> {
    const out: Partial<Record<HealthType, string>> = {};
    for (const t of types) {
      this.assertType(t);
      const unit = Object.values(TYPE_MAPPINGS[t].fieldUnits)[0];
      if (unit) out[t] = unit;
    }
    return out;
  }

  // ---------------------------------------------------------------- test helpers

  /** Data arriving from another app or device (bypasses this app's write permission; its source app is `app`). */
  simulateExternalWrite(records: NewRecord[], app = 'com.example.other'): HealthRecord[] {
    records.forEach((r, i) => {
      const issues = validateRecord(r, { partial: true }, `records[${i}]`);
      if (issues.length) throw invalidArgument(issues.map((x) => `${x.path}: ${x.message}`).join('; '));
      this.assertType(r.type);
    });
    const stored = this.load(records, 'ext', app);
    this.notify([...new Set(stored.map((r) => r.type))]);
    return stored;
  }

  /** Invalidate every cursor issued so far — the next `changes` call with one rejects with CURSOR_EXPIRED. */
  expireCursors(): void {
    this.generation++;
  }

  /** Every stored record, optionally of one type. */
  all(type?: HealthType): HealthRecord[] {
    const types = type ? [type] : [...this.store.keys()];
    return types.flatMap((t) => this.records(t)).sort(byStart);
  }

  // ---------------------------------------------------------------- internals

  private now(): number {
    return this.options.now?.() ?? Date.now();
  }

  private supportedTypes(): HealthType[] {
    return this.options.types ?? [...HEALTH_TYPES];
  }

  private decide(type: HealthType, access: AccessType): PermissionStatus {
    const policy = this.options.permissionPolicy ?? 'grant';
    if (typeof policy === 'function') return policy(type, access);
    return policy === 'grant' ? 'granted' : 'denied';
  }

  private decideCapability(): PermissionStatus {
    return this.options.permissionPolicy === 'deny' ? 'denied' : 'granted';
  }

  private permissionResult(types: HealthType[]): PermissionResult {
    const ios = this.options.platform === 'ios';
    const result: PermissionResult = { read: {}, write: {}, capabilities: {} };
    for (const t of types) {
      result.read[t] = this.readStatus.get(t) ?? (ios ? 'unknown' : 'denied');
      result.write[t] = this.writeStatus.get(t) ?? (ios ? 'unknown' : 'denied');
    }
    for (const [c, s] of this.capabilityStatus) result.capabilities[c] = s;
    return result;
  }

  /** false → (iOS) read was denied, so results are empty. Throws where the platform would. */
  private gateRead(type: HealthType): boolean {
    if (this.options.platform === 'android') {
      if (this.readStatus.get(type) !== 'granted') throw permissionDenied(`read permission for "${type}" not granted`);
      return true;
    }
    if (!this.requested.has(type)) throw permissionDenied(`authorization for "${type}" not determined — call requestPermissions first`);
    return !this.deniedReads.has(type);
  }

  private load(records: NewRecord[], idPrefix: string, app?: string): HealthRecord[] {
    const stored: HealthRecord[] = [];
    for (const r of records) {
      const id = r.id ?? `${idPrefix}-${this.nextId++}`;
      const source: HealthSource = { ...(app ? { app: { id: app } } : {}), recordingMethod: 'manual', ...r.source };
      const full = { ...r, id, source } as HealthRecord;
      this.map(full.type).set(id, full);
      this.log.push({ seq: ++this.seq, type: full.type, id, op: 'upsert' });
      stored.push(full);
    }
    return stored;
  }

  private notify(types: HealthType[]): void {
    for (const s of this.subscribers) {
      const hit = types.filter((t) => s.types.has(t));
      if (hit.length) queueMicrotask(() => s.handler({ types: hit }));
    }
  }

  private assertAvailable(): void {
    if (this.options.availability !== 'available') throw notAvailable(`health store is ${this.options.availability}`);
  }

  private assertType(type: HealthType): void {
    // Must agree with capabilities().types — a type absent there has to reject as NOT_SUPPORTED before any
    // permission check, or callers cannot tell "unsupported" from "not granted" (SPEC §2.1).
    if (!this.capabilities().types.includes(type)) throw notSupported(`mock provider does not declare "${type}"`);
  }

  private map(type: HealthType): Map<string, HealthRecord> {
    let m = this.store.get(type);
    if (!m) {
      m = new Map();
      this.store.set(type, m);
    }
    return m;
  }

  private records(type: HealthType): HealthRecord[] {
    return [...this.map(type).values()];
  }
}

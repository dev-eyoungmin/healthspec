import { HEALTH_TYPES, TYPE_MAPPINGS, TYPE_PLATFORMS, validateRecord, type Availability, type Cursor, type ExerciseRouteRecord, type HealthProfile, type HealthRecord, type HealthRecordOf, type HealthType, type PlatformId } from '@healthspec/schema';
import { assertAggregateSupported } from './aggregate.js';
import { counterpartHint, describeType, type SupportReport, type TypeSupport } from './support.js';
import { invalidArgument, isHealthError, notSupported } from './errors.js';
import { assertRange } from './time.js';
import type {
  AggregateQuery,
  AggregateResult,
  Capabilities,
  ChangeHandler,
  ChangeSet,
  ChangesOptions,
  DeleteSelector,
  Instant,
  NewRecord,
  PermissionRequest,
  PermissionResult,
  Provider,
  ReadQuery,
  Unsubscribe,
} from './types.js';

/**
 * The facade apps use. Validates arguments and records *before* they reach a provider, so every provider
 * can assume well-formed input, and adds conveniences (`readLatest`, `sync`) on top of the raw contract.
 *
 * Every promise-returning method rejects rather than throwing synchronously, so a single `.catch()` handles
 * both argument validation and platform failures. `capabilities`, `support`, `describe` and `subscribe` are
 * synchronous and throw directly.
 */
export class HealthStore {
  constructor(readonly provider: Provider) {}

  get id(): string {
    return this.provider.id;
  }

  capabilities(): Capabilities {
    return this.provider.capabilities();
  }

  availability(): Promise<Availability> {
    return this.provider.availability();
  }

  async openInstaller(): Promise<void> {
    if (!this.provider.openInstaller) throw notSupported(`provider "${this.id}" cannot open an installer`);
    await this.provider.openInstaller();
  }

  async requestPermissions(request: PermissionRequest): Promise<PermissionResult> {
    for (const t of [...(request.read ?? []), ...(request.write ?? [])]) this.assertType(t);
    const caps = this.capabilities();
    if (request.background && !caps.background) throw notSupported(`provider "${this.id}" cannot read in the background`);
    if (request.history && !caps.history) throw notSupported(`provider "${this.id}" cannot read history`);
    return this.provider.requestPermissions(request);
  }

  async getPermissions(types: HealthType[]): Promise<PermissionResult> {
    for (const t of types) this.assertType(t);
    return this.provider.getPermissions(types);
  }

  async read<T extends HealthType>(type: T, query: ReadQuery): Promise<HealthRecordOf<T>[]> {
    this.assertType(type);
    assertRange(query.start, query.end);
    if (query.limit !== undefined && (!Number.isInteger(query.limit) || query.limit <= 0)) throw invalidArgument('limit must be a positive integer');
    return this.provider.read(type, query);
  }

  /** Most recent record of a type, looking back from now to `since` (default: the epoch). */
  async readLatest<T extends HealthType>(type: T, options: { since?: Instant } = {}): Promise<HealthRecordOf<T> | undefined> {
    const [latest] = await this.read(type, { start: options.since ?? new Date(0), end: new Date(), order: 'desc', limit: 1 });
    return latest;
  }

  async aggregate(type: HealthType, query: AggregateQuery): Promise<AggregateResult[]> {
    this.assertType(type);
    if (!this.capabilities().aggregate) throw notSupported(`provider "${this.id}" cannot aggregate`);
    assertAggregateSupported(type, query.fn);
    assertRange(query.start, query.end);
    if (query.field !== undefined && !(query.field in TYPE_MAPPINGS[type].fieldUnits)) throw invalidArgument(`"${query.field}" is not a numeric field of "${type}"`);
    return this.provider.aggregate(type, query);
  }

  async write(records: NewRecord[]): Promise<HealthRecord[]> {
    if (records.length === 0) return [];
    const writable = new Set(this.capabilities().write);
    records.forEach((r, i) => {
      const issues = validateRecord(r, { partial: true }, `records[${i}]`);
      if (issues.length) throw invalidArgument(issues.map((x) => `${x.path}: ${x.message}`).join('; '));
      this.assertType(r.type);
      if (!writable.has(r.type)) throw notSupported(`provider "${this.id}" cannot write "${r.type}"`);
    });
    return this.provider.write(records);
  }

  async delete(selector: DeleteSelector): Promise<void> {
    this.assertType(selector.type);
    if ('start' in selector) assertRange(selector.start, selector.end);
    else if (selector.ids.length === 0) return;
    return this.provider.delete(selector);
  }

  async changes<T extends HealthType>(type: T, options: ChangesOptions = {}): Promise<ChangeSet<T>> {
    this.assertType(type);
    if (!this.capabilities().changes) throw notSupported(`provider "${this.id}" cannot report changes`);
    return this.provider.changes(type, options);
  }

  /** `changes` that transparently falls back to a full snapshot when the cursor has expired (SPEC §8.1). */
  async sync<T extends HealthType>(type: T, cursor?: Cursor): Promise<{ changes: ChangeSet<T>; resynced: boolean }> {
    try {
      return { changes: await this.changes(type, cursor !== undefined ? { cursor } : {}), resynced: false };
    } catch (e) {
      if (isHealthError(e) && e.code === 'CURSOR_EXPIRED') return { changes: await this.changes(type, {}), resynced: true };
      throw e;
    }
  }

  subscribe(types: HealthType[], handler: ChangeHandler): Unsubscribe {
    for (const t of types) this.assertType(t);
    if (!this.capabilities().subscribe) throw notSupported(`provider "${this.id}" cannot subscribe`);
    return this.provider.subscribe(types, handler);
  }

  // ---- platform differences (SPEC §2.1)

  /**
   * What this provider can do with one type on this platform, plus the fields it will never return and the
   * related types on the other platform. Safe to call for any spec type, supported or not.
   */
  support(type: HealthType): TypeSupport {
    if (!(HEALTH_TYPES as readonly string[]).includes(type)) throw invalidArgument(`unknown health type "${String(type)}"`);
    return describeType(type, this.platform, this.capabilities());
  }

  /**
   * The subset of `types` this provider supports. Apps declare one type list for a screen, but a platform may
   * lack some of them; requesting an unsupported type rejects (SPEC §2.1), so filter before asking.
   */
  supportedTypes(types: readonly HealthType[]): HealthType[] {
    const declared = this.capabilities().types;
    return types.filter((t) => declared.includes(t));
  }

  /** Permission request narrowed to what this provider supports, so one declaration works on both platforms. */
  requestSupportedPermissions(request: PermissionRequest): Promise<PermissionResult> {
    const narrowed: PermissionRequest = { ...request };
    if (request.read) narrowed.read = this.supportedTypes(request.read);
    if (request.write) {
      const writable = new Set(this.capabilities().write);
      narrowed.write = this.supportedTypes(request.write).filter((t) => writable.has(t));
    }
    return this.requestPermissions(narrowed);
  }

  /** Support for every spec type — for a capability screen or a startup log. */
  describe(): SupportReport {
    const caps = this.capabilities();
    const types = HEALTH_TYPES.map((t) => describeType(t, this.platform, caps));
    const supportedCount = types.filter((t) => t.supported).length;
    return { provider: this.id, platform: this.provider.platform ?? 'mock', types, supportedCount, unsupportedCount: types.length - supportedCount };
  }

  /** Platform whose mapping applies. Providers without a platform (mock) borrow whichever side declares more types. */
  private get platform(): PlatformId {
    const declared = this.provider.platform;
    if (declared && declared !== 'mock') return declared;
    const caps = this.capabilities();
    const ios = caps.types.filter((t) => TYPE_PLATFORMS[t].ios.supported).length;
    const android = caps.types.filter((t) => TYPE_PLATFORMS[t].android.supported).length;
    return android > ios ? 'android' : 'ios';
  }

  // ---- optional operations

  async getProfile(): Promise<HealthProfile> {
    if (!this.capabilities().profile || !this.provider.getProfile) throw notSupported(`provider "${this.id}" has no user profile`);
    return this.provider.getProfile();
  }

  async readRoute(sessionId: string): Promise<ExerciseRouteRecord | undefined> {
    if (!this.capabilities().routes || !this.provider.readRoute) throw notSupported(`provider "${this.id}" cannot read exercise routes`);
    if (!sessionId) throw invalidArgument('sessionId is required');
    return this.provider.readRoute(sessionId);
  }

  async readById<T extends HealthType>(type: T, id: string): Promise<HealthRecordOf<T> | undefined> {
    this.assertType(type);
    if (!this.capabilities().readById || !this.provider.readById) throw notSupported(`provider "${this.id}" cannot read by id`);
    if (!id) throw invalidArgument('id is required');
    return this.provider.readById(type, id);
  }

  async openSettings(): Promise<void> {
    if (!this.capabilities().openSettings || !this.provider.openSettings) throw notSupported(`provider "${this.id}" cannot open settings`);
    await this.provider.openSettings();
  }

  async revokePermissions(): Promise<void> {
    if (!this.capabilities().revokePermissions || !this.provider.revokePermissions) throw notSupported(`provider "${this.id}" cannot revoke permissions`);
    await this.provider.revokePermissions();
  }

  async preferredUnits(types: HealthType[]): Promise<Partial<Record<HealthType, string>>> {
    for (const t of types) this.assertType(t);
    if (!this.capabilities().preferredUnits || !this.provider.preferredUnits) throw notSupported(`provider "${this.id}" has no preferred units`);
    return this.provider.preferredUnits(types);
  }

  private assertType(type: HealthType): void {
    if (!(HEALTH_TYPES as readonly string[]).includes(type)) throw invalidArgument(`unknown health type "${String(type)}"`);
    if (!this.capabilities().types.includes(type)) throw notSupported(`provider "${this.id}" does not support "${type}"` + counterpartHint(type));
  }
}

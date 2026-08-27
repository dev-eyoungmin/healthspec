import type {
  AggregateFn,
  Availability,
  Capability,
  Cursor,
  ExerciseRouteRecord,
  HealthProfile,
  HealthRecord,
  HealthRecordOf,
  HealthSource,
  HealthType,
  PermissionStatus,
  PlatformId,
  TimeBucket,
} from '@healthspec/schema';

export type Instant = Date | string;

export interface SourceFilter {
  /** Omit records whose recordingMethod is `manual`. */
  excludeManual?: boolean;
  /** Only records written by these app ids (bundle identifier / package name). */
  apps?: string[];
}

/** SPEC §5.1 — the range is [start, end); interval records overlapping it are returned whole. */
export interface ReadQuery {
  start: Instant;
  end: Instant;
  sources?: SourceFilter;
  limit?: number;
  order?: 'asc' | 'desc';
}

/** SPEC §6 */
export interface AggregateQuery {
  start: Instant;
  end: Instant;
  fn: AggregateFn;
  bucket?: TimeBucket;
  /** IANA zone the buckets are evaluated in; defaults to the device zone. */
  zone?: string;
  sources?: SourceFilter;
  /** Value field for multi-field types; defaults to the type's first numeric field. */
  field?: string;
}

export interface AggregateResult {
  start: string;
  end: string;
  /** `null` when the bucket holds no data (SPEC §6.2). `duration` is in seconds. */
  value: number | null;
  /** Records that contributed to the bucket, when the platform reports it. */
  count?: number;
}

/** SPEC §3.2 */
export interface PermissionRequest {
  read?: HealthType[];
  write?: HealthType[];
  background?: boolean;
  history?: boolean;
  /** Read user characteristics (getProfile). HealthKit prompts for them; Health Connect has none. */
  profile?: boolean;
}

export interface PermissionResult {
  read: Partial<Record<HealthType, PermissionStatus>>;
  write: Partial<Record<HealthType, PermissionStatus>>;
  capabilities: Partial<Record<Capability, PermissionStatus>>;
}

/** SPEC §7 — both platforms need the type to delete, even by id. */
export type DeleteSelector = { type: HealthType; ids: string[] } | { type: HealthType; start: Instant; end: Instant };

export interface ChangesOptions {
  cursor?: Cursor;
  /** Providers MAY page; when they do, the returned cursor resumes after the last delivered change. */
  limit?: number;
}

/** SPEC §8.1 */
export interface ChangeSet<T extends HealthType = HealthType> {
  upserts: HealthRecordOf<T>[];
  deletes: string[];
  cursor: Cursor;
  /** true when produced without a cursor — a full snapshot, not a delta. */
  snapshot: boolean;
}

export interface ChangeEvent {
  types: HealthType[];
}
export type ChangeHandler = (event: ChangeEvent) => void;
export type Unsubscribe = () => void;

/** SPEC §9 — a provider's promise to the conformance suite. */
export interface Capabilities {
  types: HealthType[];
  write: HealthType[];
  aggregate: boolean;
  changes: boolean;
  subscribe: boolean;
  background: boolean;
  history: boolean;
  /** getProfile() */
  profile: boolean;
  /** readRoute() */
  routes: boolean;
  /** readById() */
  readById: boolean;
  /** openSettings() */
  openSettings: boolean;
  /** revokePermissions() */
  revokePermissions: boolean;
  /** preferredUnits() */
  preferredUnits: boolean;
}

/** A record about to be written: the store assigns `id`; the provider completes `source`. */
export type NewRecord<T extends HealthType = HealthType> = T extends HealthType
  ? Omit<HealthRecordOf<T>, 'id' | 'source'> & { id?: string; source?: Partial<HealthSource> }
  : never;

/** SPEC §9. Every rejection is a HealthError. */
export interface Provider {
  readonly id: string;
  /** Platform whose spec mapping applies; 'mock' when the provider simulates one. */
  readonly platform?: PlatformId | 'mock';
  capabilities(): Capabilities;
  availability(): Promise<Availability>;
  openInstaller?(): Promise<void>;
  requestPermissions(request: PermissionRequest): Promise<PermissionResult>;
  getPermissions(types: HealthType[]): Promise<PermissionResult>;
  read<T extends HealthType>(type: T, query: ReadQuery): Promise<HealthRecordOf<T>[]>;
  aggregate(type: HealthType, query: AggregateQuery): Promise<AggregateResult[]>;
  write(records: NewRecord[]): Promise<HealthRecord[]>;
  delete(selector: DeleteSelector): Promise<void>;
  changes<T extends HealthType>(type: T, options?: ChangesOptions): Promise<ChangeSet<T>>;
  subscribe(types: HealthType[], handler: ChangeHandler): Unsubscribe;

  // ---- optional operations; each is announced by the matching capabilities() flag (SPEC §9.1)

  /** User characteristics that are not records (biological sex, date of birth, …). */
  getProfile?(): Promise<HealthProfile>;
  /** GPS route of an exercise session. Health Connect asks the user per session. */
  readRoute?(sessionId: string): Promise<ExerciseRouteRecord | undefined>;
  /** One record by provider id. */
  readById?<T extends HealthType>(type: T, id: string): Promise<HealthRecordOf<T> | undefined>;
  /** Open the platform health settings (Health Connect settings / the Health app). */
  openSettings?(): Promise<void>;
  /** Revoke every permission this app holds (Health Connect only). */
  revokePermissions?(): Promise<void>;
  /** The user's preferred display unit per type, as a unit symbol (HealthKit only). */
  preferredUnits?(types: HealthType[]): Promise<Partial<Record<HealthType, string>>>;
}

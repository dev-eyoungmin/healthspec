import type {
  AppleHealthNative,
  HCAggregateOptions,
  HCChanges,
  HCInsertRecord,
  HCReadOptions,
  HCRecord,
  HCRoutePoint,
  HCSdkStatus,
  HealthConnectNative,
  HKActivitySummary,
  HKAnchoredOptions,
  HKAuthorizationStatus,
  HKCharacteristics,
  HKKind,
  HKMedication,
  HKQueryOptions,
  HKRoutePoint,
  HKSample,
  HKSaveSample,
  HKStatisticsOptions,
} from '../src/native.js';

/** In-memory HealthKit bridge: samples live per identifier; every call is recorded for assertions. */
export class FakeApple implements AppleHealthNative {
  available = true;
  samples = new Map<string, HKSample[]>();
  authorized = new Set<string>();
  denied = new Set<string>();
  calls: Array<{ fn: string; args: unknown[] }> = [];
  listeners: Array<(e: { identifier: string }) => void> = [];
  private nextUuid = 1;
  private observerSeq = 0;
  statsResponse: Array<{ start: string; end: string; value: number | null }> = [];
  anchoredResponse: { deleted?: string[] } = {};
  profile: HKCharacteristics = { biologicalSex: 2, bloodType: 7, fitzpatrickSkinType: 0, wheelchairUse: 1, activityMoveMode: 1, dateOfBirth: '1990-05-14' };
  routes = new Map<string, HKRoutePoint[]>();
  heartbeats = new Map<string, Array<{ offsetSeconds: number; precededByGap: boolean }>>();
  summaries: HKActivitySummary[] = [];
  meds: HKMedication[] = [];

  add(identifier: string, partial: Partial<HKSample> & { start: string; end: string }): HKSample {
    const s: HKSample = { uuid: partial.uuid ?? `uuid-${this.nextUuid++}`, identifier, metadata: {}, sourceBundleId: 'com.example.watch', wasUserEntered: false, ...partial };
    this.samples.set(identifier, [...(this.samples.get(identifier) ?? []), s]);
    return s;
  }

  private rec(fn: string, ...args: unknown[]) {
    this.calls.push({ fn, args });
  }

  isHealthDataAvailable() {
    return this.available;
  }
  bundleIdentifier() {
    return 'com.example.app';
  }
  async requestAuthorization(read: string[], write: string[]) {
    this.rec('requestAuthorization', read, write);
    for (const id of write) if (!this.denied.has(id)) this.authorized.add(id);
  }
  async authorizationStatus(identifiers: string[]) {
    this.rec('authorizationStatus', identifiers);
    const out: Record<string, HKAuthorizationStatus> = {};
    for (const id of identifiers) out[id] = this.denied.has(id) ? 'sharingDenied' : this.authorized.has(id) ? 'sharingAuthorized' : 'notDetermined';
    return out;
  }
  async querySamples(options: HKQueryOptions) {
    this.rec('querySamples', options);
    const start = Date.parse(options.start);
    const end = Date.parse(options.end);
    let list = (this.samples.get(options.identifier) ?? []).filter((s) => Date.parse(s.end) > start && Date.parse(s.start) < end || (s.start === s.end && Date.parse(s.start) >= start && Date.parse(s.start) < end));
    if (options.excludeUserEntered) list = list.filter((s) => !s.wasUserEntered);
    if (options.sourceBundleIds) list = list.filter((s) => options.sourceBundleIds!.includes(s.sourceBundleId));
    if (options.uuids) list = list.filter((s) => options.uuids!.includes(s.uuid));
    list.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    if (!options.ascending) list.reverse();
    return options.limit === undefined ? list : list.slice(0, options.limit);
  }
  async statistics(options: HKStatisticsOptions) {
    this.rec('statistics', options);
    return this.statsResponse;
  }
  async anchoredQuery(options: HKAnchoredOptions) {
    this.rec('anchoredQuery', options);
    if (options.anchor === 'bad') {
      const e = Object.assign(new Error('anchor could not be decoded'), { code: 'E_CURSOR_EXPIRED' });
      throw e;
    }
    const all = this.samples.get(options.identifier) ?? [];
    const from = options.anchor ? Number(options.anchor) : 0;
    return { samples: all.slice(from), deleted: this.anchoredResponse.deleted ?? [], anchor: String(all.length) };
  }
  async save(samples: HKSaveSample[]) {
    this.rec('save', samples);
    return samples.map(() => `saved-${this.nextUuid++}`);
  }
  async deleteObjects(identifier: string, kind: HKKind, uuids: string[]) {
    this.rec('deleteObjects', identifier, kind, uuids);
    return uuids.length;
  }
  async deleteByRange(identifier: string, kind: HKKind, start: string, end: string) {
    this.rec('deleteByRange', identifier, kind, start, end);
    return 0;
  }
  async enableBackgroundDelivery(identifier: string, kind: HKKind, frequency: string) {
    this.rec('enableBackgroundDelivery', identifier, kind, frequency);
    return true;
  }
  async disableBackgroundDelivery() {
    return true;
  }
  async startObserving(identifier: string, kind: HKKind) {
    this.rec('startObserving', identifier, kind);
    return `obs-${++this.observerSeq}`;
  }
  async stopObserving(id: string) {
    this.rec('stopObserving', id);
  }
  async characteristics() {
    this.rec('characteristics');
    return this.profile;
  }
  async preferredUnits(identifiers: string[]) {
    this.rec('preferredUnits', identifiers);
    return Object.fromEntries(identifiers.map((id) => [id, id.endsWith('BodyMass') ? 'lb' : 'count']));
  }
  async workoutRoute(uuid: string) {
    this.rec('workoutRoute', uuid);
    return this.routes.get(uuid) ?? null;
  }
  async heartbeatSeries(uuid: string) {
    this.rec('heartbeatSeries', uuid);
    return this.heartbeats.get(uuid) ?? [];
  }
  async ecgVoltages(uuid: string) {
    this.rec('ecgVoltages', uuid);
    return [{ offsetSeconds: 0, microvolts: 12 }];
  }
  async activitySummaries(start: string, end: string) {
    this.rec('activitySummaries', start, end);
    return this.summaries.filter((s) => Date.parse(s.date) >= Date.parse(start) - 86_400_000 && Date.parse(s.date) < Date.parse(end));
  }
  async requestMedicationsAuthorization() {
    this.rec('requestMedicationsAuthorization');
  }
  async medications() {
    this.rec('medications');
    return this.meds;
  }
  async openHealthApp() {
    this.rec('openHealthApp');
  }
  addListener(_event: 'onChange', listener: (e: { identifier: string }) => void) {
    this.listeners.push(listener);
    return { remove: () => this.listeners.splice(this.listeners.indexOf(listener), 1) };
  }
  emit(identifier: string) {
    for (const l of [...this.listeners]) l({ identifier });
  }
}

/** In-memory Health Connect bridge returning spec-shaped records. */
export class FakeHealthConnect implements HealthConnectNative {
  status: HCSdkStatus = 'available';
  granted = new Set<string>();
  records = new Map<string, HCRecord[]>();
  changeLog = new Map<string, Array<{ upsert?: HCRecord; delete?: string }>>();
  calls: Array<{ fn: string; args: unknown[] }> = [];
  expiredTokens = new Set<string>();
  routes = new Map<string, HCRoutePoint[]>();
  medical = new Map<string, HCRecord[]>();
  private nextId = 1;

  private rec(fn: string, ...args: unknown[]) {
    this.calls.push({ fn, args });
  }
  add(type: string, partial: Partial<HCRecord> & { start: string; end: string; value: Record<string, unknown> }): HCRecord {
    const r: HCRecord = { id: partial.id ?? `hc-${this.nextId++}`, source: { app: { id: 'com.example.other' }, recordingMethod: 'automatic' }, metadata: {}, ...partial };
    this.records.set(type, [...(this.records.get(type) ?? []), r]);
    this.changeLog.set(type, [...(this.changeLog.get(type) ?? []), { upsert: r }]);
    return r;
  }
  remove(type: string, id: string) {
    this.records.set(type, (this.records.get(type) ?? []).filter((r) => r.id !== id));
    this.changeLog.set(type, [...(this.changeLog.get(type) ?? []), { delete: id }]);
  }

  getSdkStatus() {
    return this.status;
  }
  packageName() {
    return 'com.example.app';
  }
  async openInstaller() {
    this.rec('openInstaller');
  }
  async requestPermissions(permissions: string[]) {
    this.rec('requestPermissions', permissions);
    for (const p of permissions) if (!p.includes('DENIED')) this.granted.add(p);
    return [...this.granted];
  }
  async getGrantedPermissions() {
    return [...this.granted];
  }
  async readRecords(type: string, options: HCReadOptions) {
    this.rec('readRecords', type, options);
    const start = Date.parse(options.start);
    const end = Date.parse(options.end);
    let list = (this.records.get(type) ?? []).filter((r) => Date.parse(r.end) > start && Date.parse(r.start) < end || (r.start === r.end && Date.parse(r.start) >= start && Date.parse(r.start) < end));
    if (options.excludeManual) list = list.filter((r) => r.source.recordingMethod !== 'manual');
    list.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    if (!options.ascending) list.reverse();
    return options.limit === undefined ? list : list.slice(0, options.limit);
  }
  async aggregate(type: string, options: HCAggregateOptions) {
    this.rec('aggregate', type, options);
    return [{ start: options.start, end: options.end, value: 42 }];
  }
  async insertRecords(type: string, records: HCInsertRecord[]) {
    this.rec('insertRecords', type, records);
    return records.map((r) => this.add(type, { start: r.start, end: r.end, value: r.value, source: { app: { id: 'com.example.app' }, recordingMethod: r.recordingMethod } }).id);
  }
  async deleteRecordsByIds(type: string, ids: string[]) {
    this.rec('deleteRecordsByIds', type, ids);
    for (const id of ids) this.remove(type, id);
  }
  async deleteRecordsByRange(type: string, start: string, end: string) {
    this.rec('deleteRecordsByRange', type, start, end);
  }
  async getChangesToken(type: string) {
    this.rec('getChangesToken', type);
    return `${type}:${(this.changeLog.get(type) ?? []).length}`;
  }
  async readRecord(type: string, id: string) {
    this.rec('readRecord', type, id);
    return (this.records.get(type) ?? []).find((r) => r.id === id) ?? null;
  }
  async readExerciseRoute(sessionId: string) {
    this.rec('readExerciseRoute', sessionId);
    return this.routes.get(sessionId) ?? null;
  }
  async readMedicalResources(medicalResourceType: string, options: HCReadOptions) {
    this.rec('readMedicalResources', medicalResourceType, options);
    return this.medical.get(medicalResourceType) ?? [];
  }
  async openSettings() {
    this.rec('openSettings');
  }
  async revokeAllPermissions() {
    this.rec('revokeAllPermissions');
    this.granted.clear();
  }
  async getChanges(type: string, token: string): Promise<HCChanges> {
    this.rec('getChanges', type, token);
    if (this.expiredTokens.has(token)) return { upserts: [], deletes: [], token, expired: true };
    const since = Number(token.split(':')[1] ?? 0);
    const log = this.changeLog.get(type) ?? [];
    const entries = log.slice(since);
    return {
      upserts: entries.flatMap((e) => (e.upsert ? [e.upsert] : [])),
      deletes: entries.flatMap((e) => (e.delete ? [e.delete] : [])),
      token: `${type}:${log.length}`,
      expired: false,
    };
  }
}

/**
 * Shapes of the two native modules. Providers take these as constructor arguments so they can be unit-tested
 * with fakes; `index.ts` wires the real modules via expo-modules-core.
 */

// ---------------------------------------------------------------- Apple HealthKit (thin bridge)

export type HKKind = 'quantity' | 'category' | 'correlation' | 'workout' | 'electrocardiogram' | 'heartbeatSeries' | 'stateOfMind' | 'clinical' | 'medicationDose';

export interface HKSample {
  uuid: string;
  identifier: string;
  start: string;
  end: string;
  /** quantity samples, in the unit requested */
  value?: number;
  /** category samples */
  category?: number;
  /** workouts: HKWorkoutActivityType raw value */
  workoutActivityType?: number;
  /** workouts: optional totals in canonical units */
  totals?: { distanceMeters?: number; energyKilocalories?: number };
  /** correlations: contained samples */
  objects?: HKSample[];
  /** electrocardiograms */
  ecg?: { classification: number; symptomsStatus: number; averageHeartRate?: number; samplingFrequency?: number; voltageCount: number };
  /** heartbeat series: number of beats (beats themselves come from heartbeatSeries(uuid)) */
  heartbeatCount?: number;
  /** state of mind (iOS 18) */
  stateOfMind?: { kind: number; valence: number; valenceClassification: number; labels: number[]; associations: number[] };
  /** clinical records: FHIR resource as a JSON string */
  clinical?: { resourceType: string; fhirVersion?: string; displayName: string; sourceUrl?: string; fhir: string };
  /** medication dose events (iOS 26) */
  medication?: { conceptIdentifier: string; displayText?: string; scheduleType: number; logStatus: number; scheduledDate?: string; scheduledDoseQuantity?: number; doseQuantity?: number; unit?: string };
  /** HK metadata, stringified */
  metadata: Record<string, string>;
  sourceBundleId: string;
  sourceName?: string;
  device?: { manufacturer?: string; model?: string; name?: string };
  wasUserEntered: boolean;
}

export interface HKQueryOptions {
  identifier: string;
  kind: HKKind;
  /** quantity: HKUnit string */
  unit?: string;
  /** correlation: identifier → HKUnit string for contained quantities */
  units?: Record<string, string>;
  start: string;
  end: string;
  limit?: number;
  ascending: boolean;
  excludeUserEntered?: boolean;
  sourceBundleIds?: string[];
  /** restrict to these object UUIDs (readById) */
  uuids?: string[];
}

export interface HKStatisticsOptions {
  identifier: string;
  unit: string;
  start: string;
  end: string;
  fn: 'sum' | 'avg' | 'min' | 'max';
  /** bucketed statistics (HKStatisticsCollectionQuery) */
  interval?: { unit: 'hour' | 'day' | 'week' | 'month'; count: number };
  /** first bucket start, ISO */
  anchor?: string;
  excludeUserEntered?: boolean;
}

export interface HKStatistic {
  start: string;
  end: string;
  value: number | null;
}

export interface HKAnchoredOptions {
  identifier: string;
  kind: HKKind;
  unit?: string;
  units?: Record<string, string>;
  /** serialised HKQueryAnchor (base64) */
  anchor?: string;
  limit?: number;
}

export interface HKAnchoredResult {
  samples: HKSample[];
  /** UUIDs of deleted objects */
  deleted: string[];
  anchor: string;
}

export interface HKSaveSample {
  kind: HKKind;
  identifier: string;
  unit?: string;
  value?: number;
  category?: number;
  start: string;
  end: string;
  metadata?: Record<string, string>;
  objects?: HKSaveSample[];
  workoutActivityType?: number;
  totals?: { distanceMeters?: number; energyKilocalories?: number };
  /** state of mind writes */
  stateOfMind?: { kind: number; valence: number; labels: number[]; associations: number[] };
}

export interface HKRoutePoint {
  time: string;
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  horizontalAccuracyMeters?: number;
  verticalAccuracyMeters?: number;
}

export interface HKActivitySummary {
  /** calendar date, YYYY-MM-DD */
  date: string;
  activeEnergyKilocalories: number;
  activeEnergyGoalKilocalories: number;
  exerciseMinutes: number;
  exerciseGoalMinutes: number;
  standHours: number;
  standGoalHours: number;
  moveMinutes?: number;
  moveGoalMinutes?: number;
  activityMoveMode?: number;
}

export interface HKCharacteristics {
  biologicalSex: number;
  bloodType: number;
  fitzpatrickSkinType: number;
  wheelchairUse: number;
  activityMoveMode: number;
  /** YYYY-MM-DD */
  dateOfBirth?: string;
}

export interface HKMedication {
  conceptIdentifier: string;
  displayText: string;
  generalForm: string;
  nickname?: string;
  isArchived: boolean;
  hasSchedule: boolean;
}

export type HKAuthorizationStatus = 'notDetermined' | 'sharingDenied' | 'sharingAuthorized';

export interface AppleHealthNative {
  isHealthDataAvailable(): boolean;
  bundleIdentifier(): string;
  requestAuthorization(read: string[], write: string[]): Promise<void>;
  authorizationStatus(identifiers: string[]): Promise<Record<string, HKAuthorizationStatus>>;
  querySamples(options: HKQueryOptions): Promise<HKSample[]>;
  statistics(options: HKStatisticsOptions): Promise<HKStatistic[]>;
  anchoredQuery(options: HKAnchoredOptions): Promise<HKAnchoredResult>;
  save(samples: HKSaveSample[]): Promise<string[]>;
  deleteObjects(identifier: string, kind: HKKind, uuids: string[]): Promise<number>;
  deleteByRange(identifier: string, kind: HKKind, start: string, end: string): Promise<number>;
  enableBackgroundDelivery(identifier: string, kind: HKKind, frequency: 'immediate' | 'hourly' | 'daily'): Promise<boolean>;
  disableBackgroundDelivery(identifier: string, kind: HKKind): Promise<boolean>;
  startObserving(identifier: string, kind: HKKind): Promise<string>;
  stopObserving(observerId: string): Promise<void>;
  // ---- non-sample data
  characteristics(): Promise<HKCharacteristics>;
  preferredUnits(identifiers: string[]): Promise<Record<string, string>>;
  workoutRoute(workoutUuid: string): Promise<HKRoutePoint[] | null>;
  heartbeatSeries(uuid: string): Promise<Array<{ offsetSeconds: number; precededByGap: boolean }>>;
  ecgVoltages(uuid: string): Promise<Array<{ offsetSeconds: number; microvolts: number }>>;
  activitySummaries(start: string, end: string): Promise<HKActivitySummary[]>;
  requestMedicationsAuthorization(): Promise<void>;
  medications(): Promise<HKMedication[]>;
  openHealthApp(): Promise<void>;
  addListener(event: 'onChange', listener: (event: { identifier: string }) => void): { remove(): void };
}

// ---------------------------------------------------------------- Android Health Connect (records arrive spec-shaped)

export type HCSdkStatus = 'available' | 'not_installed' | 'update_required' | 'not_supported';

export interface HCRecord {
  id: string;
  start: string;
  end: string;
  zoneOffset?: string;
  value: Record<string, unknown>;
  source: {
    app?: { id: string; name?: string };
    device?: { manufacturer?: string; model?: string; type?: string };
    recordingMethod: 'manual' | 'automatic' | 'active' | 'unknown';
  };
  metadata: Record<string, string>;
}

export interface HCReadOptions {
  start: string;
  end: string;
  limit?: number;
  ascending: boolean;
  excludeManual?: boolean;
  apps?: string[];
}

export interface HCAggregateOptions {
  start: string;
  end: string;
  fn: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'duration';
  field?: string;
  bucket?: 'hour' | 'day' | 'week' | 'month';
  zone: string;
  excludeManual?: boolean;
  apps?: string[];
}

export interface HCAggregateBucket {
  start: string;
  end: string;
  value: number | null;
}

export interface HCInsertRecord {
  start: string;
  end: string;
  zoneOffset?: string;
  value: Record<string, unknown>;
  recordingMethod: 'manual' | 'automatic' | 'active' | 'unknown';
  metadata?: Record<string, string>;
}

export interface HCChanges {
  upserts: HCRecord[];
  deletes: string[];
  token: string;
  /** the token could not be resumed — callers must resync */
  expired: boolean;
}

export interface HealthConnectNative {
  getSdkStatus(): HCSdkStatus;
  packageName(): string;
  openInstaller(): Promise<void>;
  requestPermissions(permissions: string[]): Promise<string[]>;
  getGrantedPermissions(): Promise<string[]>;
  readRecords(type: string, options: HCReadOptions): Promise<HCRecord[]>;
  aggregate(type: string, options: HCAggregateOptions): Promise<HCAggregateBucket[]>;
  insertRecords(type: string, records: HCInsertRecord[]): Promise<string[]>;
  deleteRecordsByIds(type: string, ids: string[]): Promise<void>;
  deleteRecordsByRange(type: string, start: string, end: string): Promise<void>;
  getChangesToken(type: string): Promise<string>;
  getChanges(type: string, token: string): Promise<HCChanges>;
  // ---- dedicated operations
  readRecord(type: string, id: string): Promise<HCRecord | null>;
  /** Asks the user for this session's route; null when the session has no route or consent was refused. */
  readExerciseRoute(sessionId: string): Promise<HCRoutePoint[] | null>;
  /** Personal Health Record (FHIR) resources of one medical resource type. */
  readMedicalResources(medicalResourceType: string, options: HCReadOptions): Promise<HCRecord[]>;
  openSettings(): Promise<void>;
  revokeAllPermissions(): Promise<void>;
}

export interface HCRoutePoint {
  time: string;
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  horizontalAccuracyMeters?: number;
  verticalAccuracyMeters?: number;
}

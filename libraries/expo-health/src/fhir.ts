/**
 * Health Connect keeps a Personal Health Record resource's timestamps and names only inside its FHIR payload, so
 * the envelope fields a clinical_* record needs are derived from the resource itself.
 */

type Json = Record<string, unknown>;

const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown): string | undefined => (typeof v === 'string' && v.length > 0 ? v : undefined);

/** Parse a FHIR JSON string; malformed payloads become an empty object rather than failing the whole read. */
export function parseFhir(data: string): Json {
  try {
    const parsed: unknown = JSON.parse(data);
    return isObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * The instant a resource describes, in order of clinical meaning: when it happened, then when it was recorded,
 * then when the resource last changed. FHIR dates may be partial (`2021`, `2021-04`); they resolve to the start.
 */
const DATE_PATHS: ReadonlyArray<ReadonlyArray<string>> = [
  ['effectiveDateTime'],
  ['effectivePeriod', 'start'],
  ['effectiveInstant'],
  ['occurrenceDateTime'],
  ['performedDateTime'],
  ['performedPeriod', 'start'],
  ['onsetDateTime'],
  ['period', 'start'],
  ['authoredOn'],
  ['recordedDate'],
  ['issued'],
  ['date'],
  ['meta', 'lastUpdated'],
];

const END_PATHS: ReadonlyArray<ReadonlyArray<string>> = [['effectivePeriod', 'end'], ['performedPeriod', 'end'], ['period', 'end']];

const at = (resource: Json, path: ReadonlyArray<string>): unknown => path.reduce<unknown>((node, key) => (isObject(node) ? node[key] : undefined), resource);

/** Epoch for resources that carry no date at all — they still appear in a query that starts at the epoch. */
export const UNDATED = '1970-01-01T00:00:00.000Z';

function toInstant(value: unknown): string | undefined {
  const s = str(value);
  if (!s) return undefined;
  const padded = /^\d{4}$/.test(s) ? `${s}-01-01` : /^\d{4}-\d{2}$/.test(s) ? `${s}-01` : s;
  const ms = Date.parse(padded);
  return Number.isNaN(ms) ? undefined : new Date(ms).toISOString();
}

export function fhirTimes(resource: Json): { start: string; end: string } {
  let start: string | undefined;
  for (const path of DATE_PATHS) {
    start = toInstant(at(resource, path));
    if (start) break;
  }
  start ??= UNDATED;
  let end: string | undefined;
  for (const path of END_PATHS) {
    end = toInstant(at(resource, path));
    if (end) break;
  }
  return { start, end: end !== undefined && Date.parse(end) >= Date.parse(start) ? end : start };
}

const codeText = (concept: unknown): string | undefined => {
  if (!isObject(concept)) return undefined;
  const text = str(concept['text']);
  if (text) return text;
  const coding = concept['coding'];
  if (Array.isArray(coding)) for (const c of coding) if (isObject(c) && str(c['display'])) return str(c['display']);
  return undefined;
};

/** A human-readable name, as HealthKit's HKClinicalRecord.displayName would give it. */
export function fhirDisplayName(resource: Json, fallback: string): string {
  for (const key of ['code', 'vaccineCode', 'medicationCodeableConcept', 'type']) {
    const name = codeText(resource[key]);
    if (name) return name;
  }
  const names = resource['name'];
  if (Array.isArray(names) && isObject(names[0])) {
    const n = names[0];
    const text = str(n['text']) ?? [...(Array.isArray(n['given']) ? n['given'] : []), n['family']].filter((p): p is string => typeof p === 'string').join(' ');
    if (text) return text;
  }
  return str(resource['id']) ?? fallback;
}

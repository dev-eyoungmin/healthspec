import { TYPE_PLATFORMS, counterpartsOf, unsupportedFields, type Counterpart, type HealthType, type PlatformId } from '@healthspec/schema';
import type { Capabilities } from './types.js';

/** What a provider can actually do with one type, and what to reach for when it cannot. */
export interface TypeSupport {
  type: HealthType;
  /** the provider declares this type */
  supported: boolean;
  read: boolean;
  write: boolean;
  aggregate: boolean;
  /** value fields this platform does not persist — present on the type, always absent in results */
  missingFields: string[];
  /** minimum OS version, when newer than the library baseline */
  since?: string;
  /** caveats from the spec's platform mapping */
  notes: string[];
  /** related types on the other platform; check `interchangeable` before substituting */
  counterparts: Counterpart[];
}

/** Per-type support for a whole provider — what a "what can I use here?" screen renders. */
export interface SupportReport {
  provider: string;
  platform: PlatformId | 'mock';
  types: TypeSupport[];
  supportedCount: number;
  unsupportedCount: number;
}

export function describeType(type: HealthType, platform: PlatformId, capabilities: Capabilities): TypeSupport {
  const p = TYPE_PLATFORMS[type][platform];
  const supported = capabilities.types.includes(type);
  const support: TypeSupport = {
    type,
    supported,
    read: supported && p.read,
    write: supported && capabilities.write.includes(type),
    aggregate: supported && capabilities.aggregate,
    missingFields: unsupportedFields(type, platform),
    notes: p.notes ?? [],
    counterparts: counterpartsOf(type),
  };
  if (p.since) support.since = p.since;
  return support;
}

/** Message appended to NOT_SUPPORTED so the error itself names the alternative. */
export function counterpartHint(type: HealthType): string {
  const counterparts = counterpartsOf(type);
  if (counterparts.length === 0) return '';
  const usable = counterparts.filter((c) => c.interchangeable);
  const distinct = counterparts.filter((c) => !c.interchangeable);
  const parts: string[] = [];
  if (usable.length) parts.push(`use ${usable.map((c) => `"${c.type}"`).join(' or ')} instead`);
  if (distinct.length) parts.push(`the nearest type is ${distinct.map((c) => `"${c.type}"`).join(' / ')}, but it measures something different — ${distinct[0]?.reason ?? ''}`);
  return ` (${parts.join('; ')})`;
}

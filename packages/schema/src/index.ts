export * from './generated/types.js';
export * from './generated/mapping.js';
export * from './platform.js';
export * from './identifiers.js';
export type { CrossPlatformType, IosOnlyType, AndroidOnlyType } from './generated/platform.js';
// The raw JSON Schemas (~0.5 MB) are not re-exported here, so apps importing this package do not bundle them.
// Tooling imports them from '@healthspec/schema/bundle'.
// Type examples are for tooling (the conformance suite writes them), not for apps: '@healthspec/schema/examples'.
export * from './validate.js';
export * from './semantics.js';
export * as units from './units.js';

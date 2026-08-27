/** Object type with every `undefined`-able property made optional — what `defined()` returns. */
export type Defined<T> = { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } & { [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined> };

/** Drop `undefined` values so records satisfy exactOptionalPropertyTypes and validate against the spec. */
export const defined = <T extends Record<string, unknown>>(obj: T): Defined<T> => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Defined<T>;

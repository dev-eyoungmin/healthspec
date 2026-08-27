import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

/** A JSON Schema file loaded from spec/schema. `json` is intentionally untyped: the schema is the type. */
export interface LoadedSchema {
  /** Repo-relative path, e.g. spec/schema/types/steps.json */
  file: string;
  /** Absolute `$id` */
  id: string;
  json: any;
}

export interface SpecBundle {
  common: LoadedSchema[];
  enums: LoadedSchema[];
  types: LoadedSchema[];
  /** common + enums + types */
  all: LoadedSchema[];
  /** basename (e.g. "sleep_stage.json") → schema, for resolving relative $ref */
  byBasename: Map<string, LoadedSchema>;
}

export const basename = (file: string): string => file.split('/').pop() ?? file;

async function loadDir(root: string, dir: string): Promise<LoadedSchema[]> {
  const full = path.join(root, 'spec/schema', dir);
  const files = (await readdir(full)).filter((f) => f.endsWith('.json')).sort();
  return Promise.all(
    files.map(async (f) => {
      const json = JSON.parse(await readFile(path.join(full, f), 'utf8'));
      if (typeof json.$id !== 'string') throw new Error(`spec/schema/${dir}/${f}: missing $id`);
      return { file: `spec/schema/${dir}/${f}`, id: json.$id, json };
    }),
  );
}

export async function loadSpec(root: string): Promise<SpecBundle> {
  const [common, enums, types] = await Promise.all([loadDir(root, 'common'), loadDir(root, 'enums'), loadDir(root, 'types')]);
  const all = [...common, ...enums, ...types];
  return { common, enums, types, all, byBasename: new Map(all.map((s) => [basename(s.file), s])) };
}

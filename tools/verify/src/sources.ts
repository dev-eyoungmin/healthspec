/**
 * External sources the spec's platform mappings are checked against. None of them is Apple's or Google's SDK
 * itself, so a confirmation means "an independently maintained library that compiles against the SDK agrees",
 * not "verified on a device" — see docs/NATIVE-VERIFICATION.md for what still needs a real build.
 */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export interface Source {
  id: string;
  /** how the file itself was produced — a generated file is stronger evidence than hand-written bindings */
  kind: 'header-generated' | 'hand-written';
  description: string;
  files: string[];
}

export interface LoadedSource extends Source {
  text: string;
}

export async function loadSources(root: string, sources: Source[]): Promise<LoadedSource[]> {
  const loaded: LoadedSource[] = [];
  for (const s of sources) {
    const parts: string[] = [];
    for (const rel of s.files) {
      const file = path.isAbsolute(rel) ? rel : path.join(root, rel);
      const exists = await stat(file).then(() => true, () => false);
      if (!exists) continue;
      parts.push(await readFile(file, 'utf8'));
    }
    if (parts.length === 0) {
      console.warn(`… source "${s.id}" not found — skipping (${s.files[0]})`);
      continue;
    }
    loaded.push({ ...s, text: parts.join('\n') });
  }
  return loaded;
}

/** Which sources contain each needle, in priority order. */
export function confirmedBy(sources: LoadedSource[], needle: string): LoadedSource[] {
  return sources.filter((s) => s.text.includes(needle));
}

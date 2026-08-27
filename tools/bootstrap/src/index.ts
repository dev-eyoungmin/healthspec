import { BATCH_A } from './batch-a.js';
import { BATCH_B1 } from './batch-b1.js';
import { BATCH_B2 } from './batch-b2.js';
import { BATCH_B3 } from './batch-b3.js';
import { BATCH_B4 } from './batch-b4.js';
import { writeEntries, type Entry } from './write.js';

const batches: Record<string, Entry[]> = { a: BATCH_A, b1: BATCH_B1, b2: BATCH_B2, b3: BATCH_B3, b4: BATCH_B4 };
const args = process.argv.slice(2);
const force = args.includes('--force');
const selected = args.filter((a) => !a.startsWith('--'));
const entries = (selected.length ? selected : Object.keys(batches)).flatMap((b) => {
  const list = batches[b];
  if (!list) throw new Error(`unknown batch "${b}" — have ${Object.keys(batches).join(', ')}`);
  return list;
});
const { written, skipped } = await writeEntries(entries, force);
console.log(`written: ${written.length} (${written.join(', ')})`);
if (skipped.length) console.log(`skipped (exists): ${skipped.join(', ')}`);

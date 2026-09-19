// The CommonJS build lives inside an ESM package ("type": "module"), so it needs its own package.json to say so.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) throw new Error('usage: mark-cjs.mjs <dir>');
mkdirSync(dir, { recursive: true });
writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');

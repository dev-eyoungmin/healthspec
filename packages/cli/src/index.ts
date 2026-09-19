#!/usr/bin/env node
import path from 'node:path';
import { diagnose, type Finding } from './doctor.js';
import { describeMapping } from './mapping.js';

const USAGE = `healthspec — HealthSpec tooling

  healthspec doctor [project] [--json]   check an Expo project's HealthKit and Health Connect setup
  healthspec mapping <type>              show one health type's mapping on both platforms
`;

const MARK: Record<Finding['level'], string> = { ok: '✔', warning: '!', error: '✖' };

function doctor(args: string[]): number {
  const json = args.includes('--json');
  const project = path.resolve(args.find((a) => !a.startsWith('--')) ?? '.');
  const report = diagnose(project);
  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`healthspec doctor — ${project}\n`);
    for (const area of ['config', 'ios', 'android'] as const) {
      const findings = report.findings.filter((f) => f.area === area);
      if (!findings.length) continue;
      console.log(area === 'config' ? 'Configuration' : area === 'ios' ? 'iOS' : 'Android');
      for (const f of findings) {
        console.log(`  ${MARK[f.level]} ${f.message}`);
        if (f.fix) console.log(`      → ${f.fix}`);
      }
      console.log('');
    }
    console.log('Before submitting (not checkable from files)');
    for (const item of [...report.checklist.ios.map((i) => `iOS: ${i}`), ...report.checklist.android.map((i) => `Android: ${i}`)]) console.log(`  □ ${item}`);
    const errors = report.findings.filter((f) => f.level === 'error').length;
    const warnings = report.findings.filter((f) => f.level === 'warning').length;
    console.log(`\n${errors} error(s), ${warnings} warning(s)`);
  }
  return report.findings.some((f) => f.level === 'error') ? 1 : 0;
}

function main(argv: string[]): number {
  const [command, ...rest] = argv;
  switch (command) {
    case 'doctor':
      return doctor(rest);
    case 'mapping':
      if (!rest[0]) {
        console.error('usage: healthspec mapping <type>');
        return 2;
      }
      try {
        console.log(describeMapping(rest[0]));
        return 0;
      } catch (e) {
        console.error((e as Error).message);
        return 1;
      }
    case undefined:
    case '-h':
    case '--help':
    case 'help':
      console.log(USAGE);
      return 0;
    default:
      console.error(`unknown command "${command}"\n\n${USAGE}`);
      return 2;
  }
}

process.exitCode = main(process.argv.slice(2));

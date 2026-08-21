#!/usr/bin/env node
// Builds the publishable JS launcher (`dist/bin.js`).
//
// The per-target Rust binaries are NOT built here. putitoutthere's bundled-cli
// recipe cross-compiles them (see `[package.bundle_cli]` in putitoutthere.toml),
// which is what stamps the crate version before `cargo build` runs — building
// them from this script baked a stale `CARGO_PKG_VERSION` into every published
// binary (#12). The engine stages each one flat at the platform-package root,
// where its npm-platform handler picks it up.
//
// The reusable workflow still runs this script on every npm row, per-triple
// ones included, so bail early rather than spend a tsc run on a macOS or
// Windows runner producing output nothing reads.

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const nodePkg = resolve(here, '..');

const target = process.env.TARGET ?? '';
if (target !== '' && target !== 'main' && target !== 'noarch') {
  console.log(`nothing to build for TARGET=${target}; the engine stages the binary`);
  process.exit(0);
}

// Use the locally-installed tsc, regardless of which package manager
// (`npm` at release-time, `pnpm` at PR-time) populated node_modules.
run('npx', ['--no-install', 'tsc', '-b', '--clean', 'tsconfig.json'], { cwd: nodePkg });
run('npx', ['--no-install', 'tsc', '-p', 'tsconfig.json'], { cwd: nodePkg });

function run(cmd, args, opts) {
  // shell: true so Windows resolves `.cmd` shims (npx.cmd, tsc.cmd, etc.)
  // without each call hard-coding extensions. Args are static — no injection.
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  if (res.status !== 0) {
    console.error(`failed: ${cmd} ${args.join(' ')} (exit ${res.status})`);
    process.exit(res.status ?? 1);
  }
}

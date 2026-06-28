#!/usr/bin/env node

import { existsSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VERSION_FILE = path.join(ROOT, 'VERSION');
const CACHE_FILE = path.join(os.homedir(), '.cache', 'folio', 'update-check.json');

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 120000,
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function safeVersion() {
  return existsSync(VERSION_FILE) ? readFileSync(VERSION_FILE, 'utf8').trim() : '(unknown version)';
}

function clearUpdateCache() {
  if (existsSync(CACHE_FILE)) rmSync(CACHE_FILE, { force: true });
}

function installDependencies() {
  if (!existsSync(path.join(ROOT, 'package.json'))) return;

  if (existsSync(path.join(ROOT, 'package-lock.json'))) {
    run('npm', ['install']);
    return;
  }

  run('npm', ['install']);
}

function main() {
  if (!existsSync(path.join(ROOT, '.git'))) {
    console.log('⚠️  This Folio installation is not a git clone.');
    console.log('Manual update required: replace this folder with a newer release or pull from the upstream repo in a git-based install.');
    process.exit(2);
  }

  const status = run('git', ['status', '--porcelain']);
  if (status) {
    console.log('⚠️  Refusing to update because the Folio working tree has uncommitted changes.');
    console.log('Commit, stash, or discard local changes first.');
    process.exit(3);
  }

  const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  console.log(`Updating Folio on branch: ${branch}`);
  run('git', ['pull', '--ff-only', 'origin', branch], { stdio: ['ignore', 'inherit', 'inherit'] });

  installDependencies();
  clearUpdateCache();

  console.log(`✅ Folio updated successfully. Current version: ${safeVersion()}`);
  process.exit(0);
}

try {
  main();
} catch (error) {
  console.error(`❌ Folio update failed: ${error.message}`);
  process.exit(1);
}

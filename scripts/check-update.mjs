#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MANIFEST_FILE = path.join(ROOT, 'manifest.json');
const VERSION_FILE = path.join(ROOT, 'VERSION');
const CACHE_DIR = path.join(os.homedir(), '.cache', 'folio');
const CACHE_FILE = path.join(CACHE_DIR, 'update-check.json');
const CACHE_TTL_MS = 30 * 60 * 1000;

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function safeReadVersion() {
  if (existsSync(VERSION_FILE)) return readFileSync(VERSION_FILE, 'utf8').trim();
  if (existsSync(MANIFEST_FILE)) return readJson(MANIFEST_FILE).version || '0.0.0';
  return '0.0.0';
}

function parseVersion(version) {
  return String(version || '0.0.0')
    .split('.')
    .map(part => Number.parseInt(part, 10) || 0);
}

function compareVersions(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i += 1) {
    const av = pa[i] || 0;
    const bv = pb[i] || 0;
    if (av > bv) return 1;
    if (av < bv) return -1;
  }

  return 0;
}

function readCache() {
  if (!existsSync(CACHE_FILE)) return null;
  try {
    return readJson(CACHE_FILE);
  } catch {
    return null;
  }
}

function writeCache(payload) {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(payload, null, 2));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: 8000, headers: { 'User-Agent': 'folio-update-check' } }, response => {
      if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
        reject(new Error(`HTTP ${response.statusCode || 'unknown'}`));
        response.resume();
        return;
      }

      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {
        body += chunk;
      });
      response.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on('timeout', () => {
      request.destroy(new Error('request timed out'));
    });
    request.on('error', reject);
  });
}

function getGitSha(args) {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

async function getRemoteManifest(localManifest) {
  const cache = readCache();
  if (cache && cache.remoteManifest && Date.now() - cache.checkedAt < CACHE_TTL_MS) {
    return { remoteManifest: cache.remoteManifest, cacheUsed: true };
  }

  if (!localManifest.raw_manifest_url) {
    throw new Error('raw_manifest_url missing from manifest.json');
  }

  const remoteManifest = await fetchJson(localManifest.raw_manifest_url);
  writeCache({ checkedAt: Date.now(), remoteManifest });
  return { remoteManifest, cacheUsed: false };
}

async function main() {
  const localManifest = existsSync(MANIFEST_FILE) ? readJson(MANIFEST_FILE) : {};
  const localVersion = safeReadVersion();
  const localSha = existsSync(path.join(ROOT, '.git')) ? getGitSha(['rev-parse', 'HEAD']) : null;

  let remoteManifest;
  let cacheUsed = false;

  try {
    ({ remoteManifest, cacheUsed } = await getRemoteManifest(localManifest));
  } catch (error) {
    const detail = error.message === 'HTTP 404'
      ? 'remote manifest not published yet or URL not reachable'
      : error.message;
    console.log(`⚠️  Folio ${localVersion} — unable to check updates (${detail}). Continue normally.`);
    process.exit(0);
  }

  const remoteVersion = String(remoteManifest.version || '0.0.0').trim();
  const versionDelta = compareVersions(remoteVersion, localVersion);
  let remoteSha = null;

  if (localSha && localManifest.repo) {
    remoteSha = getGitSha(['ls-remote', 'origin', 'HEAD']);
    if (remoteSha && remoteSha.includes('\t')) remoteSha = remoteSha.split('\t')[0].trim();
  }

  const hasUpdate = versionDelta > 0 || (versionDelta === 0 && localSha && remoteSha && localSha !== remoteSha);

  if (hasUpdate) {
    console.log(`🆕 Folio update available: ${localVersion} → ${remoteVersion}`);
    console.log(`Manifest source: ${remoteManifest.raw_manifest_url || localManifest.raw_manifest_url || 'remote manifest'}`);
    if (cacheUsed) console.log('Note: result came from recent cache.');
    if (remoteManifest.changelog_url) console.log(`Changelog: ${remoteManifest.changelog_url}`);
    console.log('Ask the user whether to upgrade. If they confirm, run:');
    console.log('node <SKILL_ROOT>/scripts/self-update.mjs');
    process.exit(10);
  }

  console.log(`✅ Folio ${localVersion} is up to date`);
  if (cacheUsed) console.log('Note: result came from recent cache.');
  process.exit(0);
}

main().catch(error => {
  console.error(`⚠️  Folio update check failed: ${error.message}`);
  process.exit(1);
});

#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import https from 'node:https';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MANIFEST_FILE = path.join(ROOT, 'manifest.json');
const VERSION_FILE = path.join(ROOT, 'VERSION');
const CACHE_DIR = process.env.FOLIO_CACHE_DIR || path.join(os.homedir(), '.cache', 'folio');
const CACHE_FILE = path.join(CACHE_DIR, 'update-check.json');
const CACHE_TTL_MS = 30 * 60 * 1000;
const FAILURE_TTL_MS = 5 * 60 * 1000;
const CHECK_BUDGET_MS = 3000;

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

function readCache(file = CACHE_FILE) {
  if (!existsSync(file)) return null;
  try {
    return readJson(file);
  } catch {
    return null;
  }
}

function writeCache(payload, file = CACHE_FILE) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(payload, null, 2));
}

export function fetchJson(url, timeoutMs = CHECK_BUDGET_MS, get = https.get) {
  return new Promise((resolve, reject) => {
    let request;
    const timer = setTimeout(() => request?.destroy(new Error('update check deadline exceeded')), timeoutMs);
    const finish = (fn, value) => { clearTimeout(timer); fn(value); };
    try {
    request = get(url, { headers: { 'User-Agent': 'folio-update-check' } }, response => {
      if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
        finish(reject, new Error(`HTTP ${response.statusCode || 'unknown'}`));
        response.resume();
        return;
      }

      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {
        body += chunk;
        if (body.length > 1024 * 1024) request.destroy(new Error('manifest exceeds size limit'));
      });
      response.on('error', error => finish(reject, error));
      response.on('aborted', () => finish(reject, new Error('manifest response aborted')));
      response.on('end', () => {
        try {
          finish(resolve, JSON.parse(body));
        } catch (error) {
          finish(reject, error);
        }
      });
    });

    request.on('error', error => finish(reject, error));
    } catch (error) {
      finish(reject, error);
    }
  });
}

function getGitSha(args, timeout = CHECK_BUDGET_MS) {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function normalizeHighlights(manifest) {
  if (!manifest || !Array.isArray(manifest.release_highlights)) return [];
  return manifest.release_highlights
    .map(item => String(item || '').trim())
    .filter(Boolean);
}

export async function getRemoteManifest(localManifest, options = {}) {
  const {cacheFile = CACHE_FILE, now = Date.now(), refresh = false,
    fetchManifest = fetchJson, lookupSha = () => null} = options;
  const url = localManifest.raw_manifest_url;
  const cache = refresh ? null : readCache(cacheFile);
  if (cache?.url === url && now >= cache.checkedAt) {
    if (cache.error && now - cache.checkedAt < FAILURE_TTL_MS) {
      throw new Error(`${cache.error}; retry deferred by 5-minute failure cache`);
    }
    if (cache.remoteManifest && now - cache.checkedAt < CACHE_TTL_MS) {
      return {remoteManifest:cache.remoteManifest,remoteSha:cache.remoteSha,cacheUsed:true};
    }
  }

  if (!localManifest.raw_manifest_url) {
    throw new Error('raw_manifest_url missing from manifest.json');
  }

  let remoteManifest, remoteSha;
  try {
    remoteManifest = await fetchManifest(url);
    if (!remoteManifest || typeof remoteManifest.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(remoteManifest.version)) {
      throw new Error('invalid remote manifest version');
    }
    remoteSha = await lookupSha();
  } catch (error) {
    try { writeCache({url,checkedAt:now,error:error.message},cacheFile); } catch {}
    throw error;
  }
  try {
    writeCache({ url, checkedAt: now, remoteManifest, remoteSha }, cacheFile);
  } catch {
    // A read-only skill or home directory must not turn a successful check into a failure.
  }
  return { remoteManifest, remoteSha, cacheUsed: false };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: check-update.mjs [--offline] [--refresh]\nSuccess cache: 30 minutes; failure backoff: 5 minutes; network budget: 3 seconds.');
    return;
  }
  if (args.some(arg => !['--offline','--refresh'].includes(arg))) throw new Error('Unknown update-check option');
  const localManifest = existsSync(MANIFEST_FILE) ? readJson(MANIFEST_FILE) : {};
  const localVersion = safeReadVersion();
  if (args.includes('--offline')) {
    console.log(`Folio ${localVersion}: update check skipped (offline); remote status unknown.`);
    return;
  }
  const localSha = existsSync(path.join(ROOT, '.git')) ? getGitSha(['rev-parse', 'HEAD']) : null;

  let remoteManifest;
  let cacheUsed = false;
  let remoteSha = null;
  const started = Date.now();

  try {
    ({ remoteManifest, remoteSha, cacheUsed } = await getRemoteManifest(localManifest, {
      refresh:args.includes('--refresh'),
      lookupSha:() => {
        const remaining = CHECK_BUDGET_MS - (Date.now()-started);
        if (!localSha || !localManifest.repo || remaining < 100) return null;
        return getGitSha(['ls-remote','origin','HEAD'],remaining)?.split(/\s/)[0] || null;
      },
    }));
  } catch (error) {
    const detail = error.message === 'HTTP 404'
      ? 'remote manifest not published yet or URL not reachable'
      : error.message;
    console.log(`⚠️  Folio ${localVersion} — unable to check updates (${detail}). Continue normally.`);
    process.exit(0);
  }

  const remoteVersion = String(remoteManifest.version || '0.0.0').trim();
  const versionDelta = compareVersions(remoteVersion, localVersion);

  const hasUpdate = versionDelta > 0 || (versionDelta === 0 && localSha && remoteSha && localSha !== remoteSha);

  if (hasUpdate) {
    console.log(`🆕 Folio update available: ${localVersion} → ${remoteVersion}`);
    console.log(`Manifest source: ${remoteManifest.raw_manifest_url || localManifest.raw_manifest_url || 'remote manifest'}`);
    if (cacheUsed) console.log('Note: result came from recent cache.');
    const highlights = normalizeHighlights(remoteManifest);
    if (highlights.length > 0) {
      console.log('What is included in this update:');
      for (const highlight of highlights) {
        console.log(`- ${highlight}`);
      }
    }
    if (remoteManifest.changelog_url) console.log(`Changelog: ${remoteManifest.changelog_url}`);
    console.log('Ask the user whether to upgrade. If they confirm, run:');
    console.log('node <SKILL_ROOT>/scripts/self-update.mjs');
    process.exit(10);
  }

  console.log(`✅ Folio ${localVersion}: no newer published version found${localSha && !remoteSha ? '; remote commit not verified' : ''}`);
  if (cacheUsed) console.log('Note: result came from recent cache.');
  process.exit(0);
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) main().catch(error => {
  console.error(`⚠️  Folio update check failed: ${error.message}`);
  process.exit(1);
});

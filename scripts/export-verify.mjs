#!/usr/bin/env node

import { chromium } from 'playwright';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SLIDE_W = 1280;
const SLIDE_H = 720;
const PASS = 'PASS';
const FAIL = 'FAIL';
const WARN = 'WARN';

let passed = 0;
let failed = 0;
let warnings = 0;
const results = [];

function report(status, check, detail = '') {
  results.push({ status, check, detail });
  if (status === PASS) passed++;
  else if (status === FAIL) failed++;
  else warnings++;
}

async function verifyHtml(htmlPath) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: SLIDE_W, height: SLIDE_H } });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(`file://${path.resolve(htmlPath).split(path.sep).join('/')}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('.slide', { timeout: 5000 });

  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  report(slideCount > 0 ? PASS : FAIL, 'Slide count', `${slideCount} slides found`);

  const layouts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.slide')).map(s => s.getAttribute('data-layout') || '(none)');
  });

  const knownLayouts = ['cover', 'split-4-8', 'overlap-right', 'bleed-quote', 'editorial', 'stats', 'gallery', 'closing', 'timeline', 'spread', 'compare', 'list'];
  const unknownLayouts = layouts.filter(l => l !== '(none)' && !knownLayouts.includes(l));
  if (unknownLayouts.length > 0) {
    report(WARN, 'Unknown layouts', unknownLayouts.join(', '));
  } else {
    report(PASS, 'Layout recognition', 'All layouts known');
  }

  const emptySlides = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.slide')).map((s, i) => {
      const text = (s.textContent || '').trim();
      return text.length < 10 ? i + 1 : null;
    }).filter(Boolean);
  });
  if (emptySlides.length > 0) {
    report(WARN, 'Near-empty slides', `Slides ${emptySlides.join(', ')} have very little text`);
  } else {
    report(PASS, 'Content check', 'All slides have content');
  }

  if (consoleErrors.length > 0) {
    report(WARN, 'Console errors', consoleErrors.slice(0, 5).join('; '));
  } else {
    report(PASS, 'Console errors', 'None');
  }

  const navElements = await page.evaluate(() => {
    const nav = document.getElementById('nav');
    if (!nav) return { hasNav: false };
    return {
      hasNav: true,
      hasPrev: !!nav.querySelector('#nav-prev'),
      hasNext: !!nav.querySelector('#nav-next'),
      hasDots: !!nav.querySelector('#nav-dots'),
      hasCount: !!nav.querySelector('#nav-count'),
      hasToggle: !!nav.querySelector('#nav-toggle'),
    };
  });
  if (navElements.hasNav && navElements.hasPrev && navElements.hasNext) {
    report(PASS, 'Navigation', 'All nav elements present');
  } else {
    report(WARN, 'Navigation', JSON.stringify(navElements));
  }

  await browser.close();
  return { slideCount, layouts };
}

async function runExport(htmlPath) {
  const outputPptx = htmlPath.replace(/\.html?$/i, '.pptx');

  try {
    const exportScript = path.resolve(__dirname, 'export-native-pptx.mjs');
    execSync(`node "${exportScript}" "${path.resolve(htmlPath)}"`, {
      cwd: path.resolve(__dirname, '..'),
      timeout: 120000,
      stdio: 'pipe',
    });
    report(PASS, 'PPTX export', `Output: ${outputPptx}`);
    return outputPptx;
  } catch (err) {
    report(FAIL, 'PPTX export', (err.stderr || '').toString().slice(0, 500) || err.message);
    return null;
  }
}

async function verifyPptx(pptxPath) {
  if (!pptxPath || !existsSync(pptxPath)) {
    report(FAIL, 'PPTX file', 'File not found');
    return;
  }

  const stats = execSync(`ls -lh "${pptxPath}"`).toString().trim();
  const sizeStr = stats.split(/\s+/)[4] || 'unknown';
  report(PASS, 'PPTX file size', sizeStr);

  try {
    const zipContents = execSync(`unzip -l "${pptxPath}" 2>/dev/null | grep -E 'slides/slide[0-9]+\\.xml'`).toString();
    const slideFiles = zipContents.trim().split('\n').filter(Boolean);
    report(slideFiles.length > 0 ? PASS : FAIL, 'PPTX slide structure', `${slideFiles.length} slide XML files`);
  } catch {
    report(WARN, 'PPTX structure', 'Could not read PPTX ZIP contents');
  }

  const sizeBytes = execSync(`stat -f%z "${pptxPath}"`).toString().trim();
  const sizeMB = parseInt(sizeBytes) / (1024 * 1024);
  if (sizeMB < 0.01) {
    report(WARN, 'PPTX size', `Only ${sizeMB.toFixed(2)}MB — may be too small`);
  } else {
    report(PASS, 'PPTX size', `${sizeMB.toFixed(1)}MB`);
  }
}

async function verifyTextContent(htmlPath) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: SLIDE_W, height: SLIDE_H } });

  page.on('console', () => {});
  await page.goto(`file://${path.resolve(htmlPath).split(path.sep).join('/')}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('.slide', { timeout: 5000 });

  const textStats = await page.evaluate(() => {
    const selectors = 'h1, h2, h3, h4, h5, h6, p, blockquote, li, .display-hero, .display-1, .display-2, .lead, .body, .caption, .meta, .pull-quote, .subtitle, .kicker, .attribution, .stat-nb, .stat-label, .closing-quote';
    return Array.from(document.querySelectorAll('.slide')).map((slide, i) => {
      const elements = slide.querySelectorAll(selectors);
      const validTexts = Array.from(elements)
        .map(el => (el.textContent || '').trim())
        .filter(t => t.length > 0);
      return {
        slide: i + 1,
        layout: slide.getAttribute('data-layout') || 'unknown',
        textCount: validTexts.length,
        sampleText: validTexts.slice(0, 3).join(' | '),
      };
    });
  });

  const totalTexts = textStats.reduce((sum, s) => sum + s.textCount, 0);
  const avgTexts = (totalTexts / textStats.length).toFixed(1);
  report(totalTexts > 0 ? PASS : FAIL, 'Text extraction', `${totalTexts} text boxes across ${textStats.length} slides (avg ${avgTexts}/slide)`);

  const slidesWithFewTexts = textStats.filter(s => s.textCount < 2);
  if (slidesWithFewTexts.length > 0) {
    report(WARN, 'Slides with <2 text elements', slidesWithFewTexts.map(s => `#${s.slide} (${s.layout})`).join(', '));
  } else {
    report(PASS, 'Slide text density', 'All slides have 2+ text elements');
  }

  await browser.close();
  return textStats;
}

function printReport(htmlPath, textStats) {
  const divider = '-------------------';

  console.log('');
  console.log('  Folio · Export Verification Report');
  console.log(`  ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`);
  console.log(`  Source: ${path.basename(htmlPath)}`);
  console.log(`  ${divider}`);
  console.log('');

  for (const r of results) {
    const icon = r.status === PASS ? '✓' : r.status === FAIL ? 'X' : '!';
    console.log(`  ${icon} ${r.check}`);
    if (r.detail) console.log(`    -> ${r.detail}`);
  }

  console.log('');
  console.log(`  ${divider}`);
  console.log(`  Summary: ${passed} passed, ${failed} failed, ${warnings} warnings`);
  console.log('');

  console.log('  Slide-by-slide summary:');
  const hdr = `  ${'#'.padStart(2)}  ${'Layout'.padEnd(16)}  Texts  Content preview`;
  const sep = `  ${'--'.repeat(2)}  ${'--'.repeat(16)}  -----  ${'--'.repeat(15)}`;
  console.log(hdr);
  console.log(sep);
  for (const s of textStats) {
    const preview = s.sampleText.slice(0, 28).padEnd(28);
    console.log(`  ${String(s.slide).padStart(2)}  ${s.layout.padEnd(16)}  ${String(s.textCount).padStart(3)}   ${preview}`);
  }
  console.log('');
}

async function main() {
  const htmlPath = process.argv[2];
  if (!htmlPath || !existsSync(htmlPath)) {
    console.error('Usage: node scripts/export-verify.mjs <path/to/index.html>');
    process.exit(1);
  }

  const absPath = path.resolve(htmlPath);
  console.log('Verifying Folio export...');
  console.log('');

  console.log('[1/4] Verifying HTML structure...');
  const htmlResult = await verifyHtml(absPath);

  console.log('[2/4] Running PPTX export...');
  const pptxPath = await runExport(absPath);

  console.log('[3/4] Verifying PPTX output...');
  if (pptxPath) await verifyPptx(pptxPath);

  console.log('[4/4] Verifying text content...');
  const textStats = await verifyTextContent(absPath);

  printReport(absPath, textStats);

  if (failed > 0) {
    console.log(`X ${failed} check(s) failed`);
    process.exit(1);
  }
  if (warnings > 0) {
    console.log(`! ${warnings} warning(s) — review recommended`);
  }
  console.log('All critical checks passed');
}

main().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});

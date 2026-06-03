#!/usr/bin/env node
/**
 * Folio — HTML Magazine → PDF Export
 *
 * Exports each slide as a separate PDF page using Playwright.
 * Slides are stacked vertically with page breaks for clean PDF output.
 *
 * Usage:
 *   node scripts/export-pdf.mjs path/to/index.html
 *
 * Dependencies:
 *   npm install playwright
 *   npx playwright install chromium
 */

import { chromium } from 'playwright';
import { existsSync } from 'fs';
import { resolve } from 'path';

const SLIDE_W = 1280;
const SLIDE_H = 720;

async function main() {
  const htmlPath = process.argv[2];
  if (!htmlPath || !existsSync(htmlPath)) {
    console.error('Usage: node scripts/export-pdf.mjs <path/to/index.html>');
    process.exit(1);
  }

  const absPath = resolve(htmlPath);
  const fileUrl = `file://${absPath}`;
  const outputPath = absPath.replace(/\.html?$/, '.pdf');

  console.log(`[1/3] Launching browser...`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`[2/3] Loading slides...`);
  await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('.slide', { timeout: 10000 });

  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log(`  Found ${slideCount} slides`);

  // Stack slides vertically, each as a full page
  await page.evaluate(() => {
    const deck = document.getElementById('deck');
    const slides = document.querySelectorAll('.slide');

    // Disable the horizontal deck layout
    deck.style.display = 'block';
    deck.style.transform = 'none';
    deck.style.width = '100%';
    deck.style.height = 'auto';

    slides.forEach((s, i) => {
      s.style.flex = 'none';
      s.style.width = '100%';
      s.style.height = '100vh';
      s.style.opacity = '1';
      s.style.overflow = 'hidden';
      s.style.pageBreakAfter = 'always';
      s.style.transform = 'none';

      // Activate all animations
      s.classList.add('active');
      s.querySelectorAll('[data-anim]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });

    // Hide navigation
    const nav = document.getElementById('nav');
    if (nav) nav.style.display = 'none';

    const progress = document.getElementById('progress');
    if (progress) progress.style.display = 'none';

    // Hide overview and shortcuts
    const overview = document.getElementById('overview');
    if (overview) overview.style.display = 'none';
    const shortcuts = document.getElementById('shortcuts');
    if (shortcuts) shortcuts.style.display = 'none';

    // Hide overflow on body
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  });

  console.log(`[3/3] Generating PDF...`);
  await page.pdf({
    path: outputPath,
    width: `${SLIDE_W / 96}in`,
    height: `${SLIDE_H / 96}in`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

  console.log(`  ✅ PDF saved to: ${outputPath} (${slideCount} pages)`);
  await browser.close();
  console.log(`Done.`);
}

main().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});

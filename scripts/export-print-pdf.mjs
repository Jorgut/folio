#!/usr/bin/env node
import { chromium } from 'playwright';
import { PDFDocument, rgb } from 'pdf-lib';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve, basename } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { collectPublicationPageDescriptors, validatePublicationPages, isPublicationDocument, requireDecodedImages } from './publication-pages.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const TRIM_W = 1280, TRIM_H = 720;
const BLEED_MM = 3;
const MM_PT = 72 / 25.4;
const BLEED_PX = Math.round(BLEED_MM * 96 / 25.4);
const BLEED_PT = BLEED_MM * MM_PT;
const FULL_W_PX = TRIM_W + BLEED_PX * 2;
const FULL_H_PX = TRIM_H + BLEED_PX * 2;
const BLEED_W_PT = TRIM_W * (72 / 96) + BLEED_PT * 2;
const BLEED_H_PT = TRIM_H * (72 / 96) + BLEED_PT * 2;
const BLEED_W_IN = BLEED_W_PT / 72;
const BLEED_H_IN = BLEED_H_PT / 72;
const CROP_EXT_PT = 14.17;

function toFileUrl(p) { return pathToFileURL(p).href; }
function toPrintOutputPath(htmlPath) {
  const name = basename(htmlPath, '.html');
  return join(resolve(htmlPath, '..'), `${name}.print.pdf`);
}

function createExportStyles() {
  return `
    @page { size: ${BLEED_W_IN}in ${BLEED_H_IN}in; margin: 0; }
    html, body { margin: 0 !important; padding: 0 !important; overflow: visible !important; background: #fff !important;
      -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    :root {
      --text-hero: 72px; --text-display: 48px; --text-title: 28px; --text-lead: 18px;
      --text-body: 14px; --text-caption: 12px; --text-meta: 10px;
      --safe-x: 80px; --safe-y: 64px;
      --font-zh: 'Noto Serif SC', 'PingFang SC', 'Microsoft YaHei', serif;
    }
    #print-export-root { display: block; width: ${FULL_W_PX}px; }
    .print-page {
      position: relative; width: ${FULL_W_PX}px; height: ${FULL_H_PX}px;
      padding: ${BLEED_PX}px; box-sizing: border-box; overflow: hidden;
      background: #fff; break-after: page; page-break-after: always;
    }
    .print-page:last-child { break-after: auto; page-break-after: auto; }
    .print-slide {
      position: relative; width: ${TRIM_W}px; height: ${TRIM_H}px;
      min-width: ${TRIM_W}px; max-width: ${TRIM_W}px;
      min-height: ${TRIM_H}px; max-height: ${TRIM_H}px;
      opacity: 1; transform: none; overflow: visible;
    }
    .print-slide, .print-slide * { animation: none !important; transition: none !important; }
    .print-slide [data-anim] { opacity: 1 !important; transform: none !important; filter: none !important; }
    .print-slide .full-bleed {
      position: absolute; inset: 0; width: 100%; height: 100%;
      max-width: none; max-height: none; overflow: hidden;
    }
    .print-slide .full-bleed img, .print-slide .img-full img,
    .print-slide .img-backdrop img, .print-slide .spread-image img,
    .print-slide .img img { transform: scale(1.04); transform-origin: center; }
    .print-slide .img { overflow: visible; }
    .print-slide .img.r-4x3 { height: 100%; aspect-ratio: unset; }
    .print-slide .h-full { height: 100%; }
    .print-slide .h-full img { height: 100%; object-fit: cover; }
  `;
}

async function preparePrintableDeck(page) {
  await page.addStyleTag({ content: createExportStyles() });
  await page.evaluate(({ bleedPx, slideWidth, slideHeight }) => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const root = document.createElement('div');
    root.id = 'print-export-root';
    for (const slide of slides) {
      const wrapper = document.createElement('section');
      wrapper.className = 'print-page';
      slide.classList.add('print-slide', 'active');
      wrapper.appendChild(slide);
      root.appendChild(wrapper);
    }
    document.body.replaceChildren(root);
    document.documentElement.style.overflow = 'visible';
    document.body.style.overflow = 'visible';
  }, { bleedPx: BLEED_PX, slideWidth: TRIM_W, slideHeight: TRIM_H });
}

export async function renderPrintPdf(fileUrl, tempPdfPath, browserType = chromium) {
  const browser = await browserType.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: FULL_W_PX, height: FULL_H_PX } });
    await page.emulateMedia({ media: 'screen' });
    await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });
    if (await page.evaluate(isPublicationDocument)) return await renderPublicationPdf(page, tempPdfPath);
    await page.waitForSelector('.slide', { timeout: 10000 });

    await page.evaluate(async () => {
      await document.fonts.ready;
      const test = document.createElement('div');
      test.style.fontFamily = "'Noto Serif SC', 'PingFang SC', 'Microsoft YaHei', serif";
      test.style.position = 'absolute'; test.style.left = '-9999px';
      test.textContent = '测试字体加载';
      document.body.appendChild(test);
      await document.fonts.ready;
      document.body.removeChild(test);
    });

    await preparePrintableDeck(page);
    await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());

    await page.evaluate(requireDecodedImages);

    const slideCount = await page.evaluate(() => document.querySelectorAll('.print-page').length);

    await page.pdf({
      path: tempPdfPath, width: `${BLEED_W_IN}in`, height: `${BLEED_H_IN}in`,
      printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true, scale: 1,
    });

    const tempDir = join(tmpdir(), 'folio-print-shots');
    mkdirSync(tempDir, { recursive: true });
    const shots = [];
    for (let i = 0; i < slideCount; i++) {
      await page.evaluate(idx => document.querySelectorAll('.print-page')[idx]?.scrollIntoView(), i);
      await page.waitForTimeout(200);
      const p = join(tempDir, `s${i}.png`);
      await page.screenshot({ path: p, fullPage: false });
      shots.push(p);
    }

    const pdfDoc = await PDFDocument.load(readFileSync(tempPdfPath));
    const pages = pdfDoc.getPages();
    for (let i = 0; i < slideCount; i++) {
      const hasImgs = await page.evaluate(idx => {
        const pg = document.querySelectorAll('.print-page')[idx];
        return pg ? pg.querySelectorAll('img').length > 0 : false;
      }, i);
      if (hasImgs) {
        const img = await pdfDoc.embedPng(readFileSync(shots[i]));
        const pg = pages[i];
        pg.drawImage(img, { x: 0, y: 0, width: pg.getWidth(), height: pg.getHeight() });
      }
    }
    writeFileSync(tempPdfPath, await pdfDoc.save());
    return slideCount;
  } finally { await browser.close(); }
}

async function renderPublicationPdf(page, tempPdfPath) {
    const contract = validatePublicationPages(await page.evaluate(collectPublicationPageDescriptors));
    const fullWidthMm = contract.widthMm + contract.bleedMm * 2;
    const fullHeightMm = contract.heightMm + contract.bleedMm * 2;
    await page.addStyleTag({ content: publicationPrintStyles(contract) });
    await page.evaluate((sourcePages) => {
      const root = document.querySelector('[data-document-format="publication"]');
      const elements = Array.from(root.children).flatMap(child => {
        if (child.classList.contains('page')) return [child];
        if (child.classList.contains('spread')) return Array.from(child.children).filter(el => el.classList.contains('page'));
        return [];
      });
      if (elements.length !== sourcePages.length) throw new Error('Publication page count changed during PDF preparation');
      const exportRoot = document.createElement('div');
      for (const [index, element] of elements.entries()) {
        const wrapper = document.createElement('section');
        wrapper.className = 'publication-print-page';
        wrapper.dataset.publicationSide = sourcePages[index].side;
        wrapper.appendChild(element);
        exportRoot.appendChild(wrapper);
      }
      document.body.replaceChildren(exportRoot);
    }, contract.pages);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(requireDecodedImages);
    await page.pdf({ path: tempPdfPath, width: `${fullWidthMm}mm`, height: `${fullHeightMm}mm`,
      printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
    return contract;
}

export function publicationPrintStyles(contract) {
  const fullWidthMm = contract.widthMm + contract.bleedMm * 2;
  const fullHeightMm = contract.heightMm + contract.bleedMm * 2;
  return `
      @page { size: ${fullWidthMm}mm ${fullHeightMm}mm; margin: 0; }
      html, body { width: ${fullWidthMm}mm !important; margin: 0 !important; padding: 0 !important;
        background: white !important; print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
      .publication-print-page { width: ${fullWidthMm}mm; height: ${fullHeightMm}mm;
        padding: ${contract.bleedMm}mm; box-sizing: border-box; background: white;
        break-after: page; page-break-after: always; overflow: hidden; }
      .publication-print-page:last-child { break-after: auto; page-break-after: auto; }
      .publication-print-page > .page { width: ${contract.widthMm}mm !important;
        height: ${contract.heightMm}mm !important; min-height: 0 !important;
        aspect-ratio: auto !important; margin: 0 !important; box-shadow: none !important; }
      .publication-print-page .folio { display: flex !important; }
      .publication-print-page > .page[data-bleed-mode="edge-bleed"] { overflow: visible !important; }
      .publication-print-page > .page[data-bleed-mode="edge-bleed"] > img:first-child {
        margin-top: -${contract.bleedMm}mm; }
      .publication-print-page[data-publication-side="left"] > .page[data-bleed-mode="edge-bleed"] > img:first-child {
        margin-left: -${contract.bleedMm}mm; width: calc(100% + ${contract.bleedMm}mm); }
      .publication-print-page[data-publication-side="right"] > .page[data-bleed-mode="edge-bleed"] > img:first-child {
        margin-right: -${contract.bleedMm}mm; width: calc(100% + ${contract.bleedMm}mm); }
      .publication-print-page[data-publication-side="single"] > .page[data-bleed-mode="edge-bleed"] > img:first-child {
        margin-left: -${contract.bleedMm}mm; margin-right: -${contract.bleedMm}mm;
        width: calc(100% + ${contract.bleedMm * 2}mm); }
    `;
}

export function applyPublicationPageBoxes(pdfDoc, contract) {
  const pages = pdfDoc.getPages();
  if (pages.length !== contract.pages.length) {
    throw new Error(`Expected ${contract.pages.length} A4 pages, got ${pages.length}`);
  }
  const bleed = contract.bleedMm * MM_PT;
  const trimWidth = contract.widthMm * MM_PT;
  const trimHeight = contract.heightMm * MM_PT;
  const fullWidth = trimWidth + bleed * 2;
  const fullHeight = trimHeight + bleed * 2;
  const black = rgb(0, 0, 0);
  for (const page of pages) {
    const { width, height } = page.getSize();
    if (Math.abs(width - fullWidth) > 0.5 || Math.abs(height - fullHeight) > 0.5) {
      throw new Error(`Unexpected publication PDF page size: ${width} x ${height} pt`);
    }
    page.scale(fullWidth / width, fullHeight / height);
    const markLength = Math.min(bleed * 0.7, 6);
    page.setCropBox(0, 0, fullWidth, fullHeight);
    page.setBleedBox(0, 0, fullWidth, fullHeight);
    page.setTrimBox(bleed, bleed, trimWidth, trimHeight);
    for (const x of [bleed, bleed + trimWidth]) {
      for (const y of [bleed, bleed + trimHeight]) {
        const dx = x === bleed ? -markLength : markLength;
        const dy = y === bleed ? -markLength : markLength;
        page.drawLine({ start: { x, y }, end: { x: x + dx, y }, thickness: 0.5, color: black });
        page.drawLine({ start: { x, y }, end: { x, y: y + dy }, thickness: 0.5, color: black });
      }
    }
  }
}

async function main() {
  const htmlPath = process.argv[2];
  if (!htmlPath || !existsSync(htmlPath)) {
    console.error('Usage: node scripts/export-print-pdf.mjs <path/to/index.html>');
    process.exit(1);
  }
  const absPath = resolve(htmlPath);
  const outputPath = toPrintOutputPath(absPath);
  const tempDir = mkdtempSync(join(tmpdir(), 'folio-print-pdf-'));
  const tempPdfPath = join(tempDir, 'bleed.pdf');
  // Keep the original base URL; load and validate assets in the rendering session.
  console.log('[1/4] Loading source and rendering PDF...');
  const slideCount = await renderPrintPdf(toFileUrl(absPath), tempPdfPath);
  if (typeof slideCount === 'object') {
    const pdfDoc = await PDFDocument.load(readFileSync(tempPdfPath));
    applyPublicationPageBoxes(pdfDoc, slideCount);
    writeFileSync(outputPath, await pdfDoc.save());
    console.log(`${slideCount.pages.length} publication pages saved to ${outputPath}`);
    return;
  }
  console.log(`  ${slideCount} slides`);

  console.log('[3/4] Adding crop marks...');
  const pdfDoc = await PDFDocument.load(readFileSync(tempPdfPath));
  const pages = pdfDoc.getPages();
  const black = rgb(0, 0, 0);
  for (const pg of pages) {
    const { width: pw, height: ph } = pg.getSize();
    const g = BLEED_PT, l = CROP_EXT_PT;
    const corners = [
      { x: g, y: ph - g, dx: 1, dy: 0, dx2: 0, dy2: -1 },
      { x: pw - g, y: ph - g, dx: -1, dy: 0, dx2: 0, dy2: -1 },
      { x: g, y: g, dx: 1, dy: 0, dx2: 0, dy2: 1 },
      { x: pw - g, y: g, dx: -1, dy: 0, dx2: 0, dy2: 1 },
    ];
    for (const c of corners) {
      pg.drawLine({ start: { x: c.x, y: c.y }, end: { x: c.x + c.dx * l, y: c.y + c.dy * l }, thickness: 0.5, color: black });
      pg.drawLine({ start: { x: c.x, y: c.y }, end: { x: c.x + c.dx2 * l, y: c.y + c.dy2 * l }, thickness: 0.5, color: black });
    }
    const cropX = BLEED_PT, cropY = BLEED_PT;
    pg.setBleedBox(0, 0, pw, ph);
    pg.setCropBox(cropX, cropY, TRIM_W * (72 / 96), TRIM_H * (72 / 96));
    pg.setTrimBox(cropX, cropY, TRIM_W * (72 / 96), TRIM_H * (72 / 96));
  }

  writeFileSync(outputPath, await pdfDoc.save());
  console.log(`[4/4] Done → ${outputPath}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(err => { console.error('Export failed:', err); process.exitCode = 1; });
}

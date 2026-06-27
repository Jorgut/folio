#!/usr/bin/env node
/**
 * Export Folio deck to Figma via JSON + companion Figma plugin.
 *
 * Generates:
 *   index.figma.json        — layout data (texts, images, positions, styles)
 *   index.figma-images/     — downloaded images referenced by the JSON
 *   figma-plugin/           — Figma plugin (install once, import any JSON)
 *
 * Usage:
 *   node scripts/export-figma.mjs path/to/index.html
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'fs';
import { resolve, join, basename, dirname } from 'path';

// ─── Constants ───────────────────────────────────────────────────
const SLIDE_W = 1280;
const SLIDE_H = 720;
const TEXT_SELECTOR = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'li',
  '.display-hero', '.display-1', '.display-2', '.title-zh',
  '.lead', '.body', '.caption', '.meta',
  '.pull-quote', '.subtitle', '.kicker', '.attribution',
  '.stat-nb', '.stat-label', '.closing-quote',
  '.overlay-panel h2', '.overlay-panel .lead', '.overlay-panel .caption',
  '.quote-block .pull-quote', '.quote-block .attribution',
  '.text-panel h2', '.text-panel .lead', '.text-panel .body', '.text-panel .caption',
  '.article-header h2', '.article-body p',
  '.table-label', '.table-value', '.quote-text',
].join(', ');

function toFileUrl(p) { return `file://${p}`; }

function toHexColor(colorValue, fallback = 'CCCCCC') {
  if (!colorValue || typeof colorValue !== 'string') return fallback;
  const n = colorValue.trim();
  const r = n.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (r) return r.slice(1, 4).map(v => Number.parseInt(v, 10).toString(16).padStart(2, '0')).join('').toUpperCase();
  const h = n.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (h) {
    const hex = h[1];
    return hex.length === 3 ? hex.split('').map(c => c + c).join('').toUpperCase() : hex.toUpperCase();
  }
  return fallback;
}

function mapFont(fontFamily = '') {
  const first = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
  if (first.toLowerCase().includes('playfair')) return 'Playfair Display';
  if (first.toLowerCase().includes('inter')) return 'Inter';
  if (first.toLowerCase().includes('jetbrains') || first.toLowerCase().includes('courier')) return 'Courier New';
  if (first.toLowerCase().includes('noto') || first.toLowerCase().includes('source han')) return 'Noto Serif SC';
  return first || 'Inter';
}

function mapAlign(align = 'left') {
  if (align === 'center' || align === 'centre') return 'CENTER';
  if (align === 'right') return 'RIGHT';
  if (align === 'justify') return 'JUSTIFIED';
  return 'LEFT';
}

// ─── Download a single image as base64 ────────────────────────────
async function downloadImageAsBase64(page, url) {
  try {
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 15000 });
    if (!resp || !resp.ok()) return null;
    const buffer = await resp.body();
    const ext = url.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${buffer.toString('base64')}`;
  } catch {
    return null;
  }
}

// ─── Extract slides with texts and images ────────────────────────
async function extractSlides(page) {
  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  const slides = [];
  for (let slideIndex = 0; slideIndex < slideCount; slideIndex++) {
    await page.evaluate((index) => {
      const deck = document.getElementById('deck');
      if (deck) deck.style.transform = `translateX(-${index * 100}%)`;
      document.querySelectorAll('.slide').forEach((s, i) => s.classList.toggle('active', i === index));
    }, slideIndex);
    await page.waitForTimeout(100);

    const slideData = await page.evaluate(({ index, textSelector }) => {
      const slides = Array.from(document.querySelectorAll('.slide'));
      const slide = slides[index];
      if (!slide) return null;

      const deck = document.getElementById('deck');
      if (deck) deck.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, i) => s.classList.toggle('active', i === index));

      const normalizeText = (v) => v.replace(/\r/g, '').replace(/[\t ]+\n/g, '\n').replace(/\n[\t ]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
      const isWithinIgnored = (el) => Boolean(el.closest('#overview, #shortcuts, #nav'));
      const isImgContainer = (el) => Boolean(el.closest('.img, .img-backdrop, .img-full, .img-gallery-item'));

      // Extract text elements
      const texts = Array.from(slide.querySelectorAll(textSelector))
        .filter(el => !isWithinIgnored(el) && !isImgContainer(el))
        .filter(el => el.querySelectorAll(textSelector).length === 0)
        .map(el => {
          const raw = normalizeText(el.innerText || el.textContent || '');
          if (!raw) return null;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return null;
          const cs = getComputedStyle(el);
          const lh = parseFloat(cs.lineHeight);
          return {
            text: raw,
            rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
            style: {
              fontFamily: cs.fontFamily,
              fontSize: parseFloat(cs.fontSize),
              fontWeight: cs.fontWeight,
              color: cs.color,
              textAlign: cs.textAlign,
              lineHeight: isFinite(lh) ? lh : parseFloat(cs.fontSize) * 1.4,
              letterSpacing: cs.letterSpacing,
            },
            isItalic: el.closest('.pull-quote') !== null || cs.fontStyle === 'italic',
          };
        })
        .filter(Boolean);

      // Extract images (img tags)
      const images = Array.from(slide.querySelectorAll('img'))
        .filter(el => !isWithinIgnored(el))
        .filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 10 && r.height > 10;
        })
        .map(el => {
          const rect = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            src: el.currentSrc || el.src || '',
            rect: {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            },
            alt: el.alt || '',
            objectFit: cs.objectFit || 'cover',
          };
        })
        .filter(img => img.src && !img.src.startsWith('data:'));

      // Extract background images from CSS
      const bgEls = Array.from(slide.querySelectorAll('.img-full, .img-backdrop, .img'));
      for (const el of bgEls) {
        const cs = getComputedStyle(el);
        const bgImage = cs.backgroundImage || '';
        const m = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (m && m[1] && !m[1].startsWith('data:')) {
          const rect = el.getBoundingClientRect();
          // Avoid duplicates
          const exists = images.some(img =>
            Math.abs(img.rect.x - rect.x) < 5 &&
            Math.abs(img.rect.y - rect.y) < 5
          );
          if (!exists && rect.width > 10 && rect.height > 10) {
            images.push({
              src: m[1],
              rect: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              },
              alt: '',
              objectFit: cs.backgroundSize || 'cover',
            });
          }
        }
      }

      const bgColor = getComputedStyle(slide).backgroundColor;

      return { index, bgColor, texts, images };
    }, { index: slideIndex, textSelector: TEXT_SELECTOR });

    if (slideData) slides.push(slideData);
  }
  return slides;
}

// ─── Normalize slide data for JSON serialization ─────────────────
function normalizeSlideData(slide) {
  return {
    index: slide.index,
    bgColor: toHexColor(slide.bgColor, 'F7F4EF'),
    texts: slide.texts.map(t => ({
      text: t.text,
      rect: t.rect,
      style: {
        fontFamily: mapFont(t.style.fontFamily),
        fontSize: t.style.fontSize,
        fontWeight: t.style.fontWeight,
        color: toHexColor(t.style.color, '1A1814'),
        textAlign: mapAlign(t.style.textAlign),
        lineHeight: t.style.lineHeight,
        letterSpacing: t.style.letterSpacing,
      },
      isItalic: t.isItalic,
    })),
    images: slide.images.map(img => ({
      src: img.src,
      rect: img.rect,
      objectFit: img.objectFit,
    })),
  };
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  const htmlPath = process.argv[2];
  if (!htmlPath || !existsSync(htmlPath)) {
    console.error('Usage: node scripts/export-figma.mjs <path/to/index.html>');
    process.exit(1);
  }
  const absPath = resolve(htmlPath);
  const html = readFileSync(absPath, 'utf-8');
  const outputDir = dirname(absPath);
  const baseName = basename(absPath, '.html');

  // Output paths
  const jsonPath = join(outputDir, `${baseName}.figma.json`);
  const imagesDir = join(outputDir, `${baseName}.figma-images`);

  console.log('[1/3] Rendering deck with Playwright...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: SLIDE_W, height: SLIDE_H } });
  await page.goto(toFileUrl(absPath), { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('.slide', { timeout: 10000 });
  await page.addStyleTag({ content: `
    #deck, .slide, .slide [data-anim], .anim-scale {
      transition: none !important; animation: none !important;
    }
    .slide, .slide [data-anim] {
      opacity: 1 !important; transform: none !important;
    }` });

  const slides = await extractSlides(page);
  console.log(`  ${slides.length} slides, ${slides.reduce((s, sd) => s + sd.texts.length, 0)} text elements`);

  // Normalize data
  const data = {
    version: 1,
    slideWidth: SLIDE_W,
    slideHeight: SLIDE_H,
    slides: slides.map(normalizeSlideData),
  };

  // Collect all unique image URLs
  const allUrls = new Set();
  for (const slide of data.slides) {
    for (const img of slide.images) {
      allUrls.add(img.src);
    }
  }
  const uniqueUrls = [...allUrls];
  console.log(`  ${uniqueUrls.length} unique images found`);

  // Download images as base64
  if (uniqueUrls.length > 0) {
    console.log('[2/3] Downloading images...');
    const imageMap = {};
    for (const url of uniqueUrls) {
      const b64 = await downloadImageAsBase64(page, url);
      if (b64) imageMap[url] = b64;
    }
    console.log(`  ${Object.keys(imageMap).length} images downloaded`);

    // Replace image src with base64 data in slide data
    for (const slide of data.slides) {
      for (const img of slide.images) {
        if (imageMap[img.src]) {
          img.data = imageMap[img.src];
        }
      }
    }
  }

  await browser.close();

  // Write JSON
  console.log('[3/3] Writing files...');
  writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✅ JSON: ${jsonPath} (${(Buffer.byteLength(JSON.stringify(data), 'utf-8') / 1024).toFixed(0)} KB)`);

  // Write plugin alongside (create if not exists)
  const pluginDir = join(outputDir, 'figma-plugin');
  mkdirSync(pluginDir, { recursive: true });

  // Copy plugin files from the skill's scripts directory
  const skillPluginDir = join(dirname(import.meta.url.replace('file://', '')), 'figma-plugin');
  const pluginManifest = join(skillPluginDir, 'manifest.json');
  const pluginCode = join(skillPluginDir, 'code.js');
  const pluginUI = join(skillPluginDir, 'ui.html');

  if (existsSync(pluginManifest)) {
    cpSync(pluginManifest, join(pluginDir, 'manifest.json'));
    cpSync(pluginCode, join(pluginDir, 'code.js'));
    cpSync(pluginUI, join(pluginDir, 'ui.html'));
    console.log(`  ✅ Plugin: ${pluginDir}/`);
  } else {
    // Plugin files will be created separately
    console.log(`  ℹ️  Plugin directory: ${pluginDir}/ (create plugin files manually)`);
  }
}

main().catch((err) => { console.error('Export failed:', err); process.exit(1); });

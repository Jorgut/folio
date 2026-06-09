#!/usr/bin/env node

import { chromium } from 'playwright';
import PptxGenJS from 'pptxgenjs';
import {
  existsSync,
  mkdtempSync,
  rmSync,
} from 'fs';
import path from 'path';
import os from 'os';
import { applyLayoutMapping } from './layout-mapping.mjs';

const SLIDE_W = 1280;
const SLIDE_H = 720;
const DPI = 96;
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
].join(', ');

function pxToInches(px) {
  return px / DPI;
}

function pxToPoints(px) {
  return px * 0.75;
}

function toHexColor(colorValue, fallback = 'CCCCCC') {
  if (!colorValue || typeof colorValue !== 'string') {
    return fallback;
  }

  const normalized = colorValue.trim();
  const rgbMatch = normalized.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    return rgbMatch
      .slice(1, 4)
      .map((value) => Number.parseInt(value, 10).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }

  const hexMatch = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return hex
        .split('')
        .map((char) => char + char)
        .join('')
        .toUpperCase();
    }
    return hex.toUpperCase();
  }

  return fallback;
}

function mapFont(fontFamily = '', isMono = false) {
  if (isMono || fontFamily.includes('JetBrains Mono') || fontFamily.includes('SF Mono')) {
    return 'Courier New';
  }
  if (fontFamily.includes('Playfair')) {
    return 'Playfair Display';
  }
  if (fontFamily.includes('Inter')) {
    return 'Inter';
  }
  if (fontFamily.includes('Noto Serif SC') || fontFamily.includes('Source Han')) {
    return 'Microsoft YaHei';
  }
  return 'Arial';
}

function mapAlign(align = 'left') {
  if (align === 'center') return 'center';
  if (align === 'right') return 'right';
  if (align === 'justify') return 'justify';
  return 'left';
}

function normalizeLineHeight(lineHeightPx, fontSizePx) {
  if (!lineHeightPx || !fontSizePx) {
    return 1.4;
  }

  const multiple = lineHeightPx / fontSizePx;
  if (!Number.isFinite(multiple) || multiple <= 0) {
    return 1.4;
  }

  return Number(multiple.toFixed(3));
}

function toFileUrl(filePath) {
  return `file://${filePath.split(path.sep).join('/')}`;
}

function outputPathFromHtml(htmlPath) {
  return htmlPath.replace(/\.html?$/i, '.pptx');
}

async function activateSlide(page, slideIndex) {
  await page.evaluate((index) => {
    const deck = document.getElementById('deck');
    if (deck) {
      deck.style.transform = `translateX(-${index * 100}%)`;
    }

    document.querySelectorAll('.slide').forEach((slide, currentIndex) => {
      slide.classList.toggle('active', currentIndex === index);
    });
  }, slideIndex);

  await page.waitForTimeout(100);
}

async function preparePage(page, fileUrl) {
  await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('.slide', { timeout: 10000 });
  await page.addStyleTag({
    content: `
      #nav, #progress, #shortcuts, #overview { display: none !important; }
      #deck, .slide, .slide [data-anim], .anim-scale {
        transition: none !important;
        animation: none !important;
      }
      .slide, .slide [data-anim] {
        opacity: 1 !important;
        transform: none !important;
      }
    `,
  });
  await page.evaluate(() => {
    document.body.classList.add('low-power');
  });
}

async function extractSlides(page) {
  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  const slides = [];

  for (let slideIndex = 0; slideIndex < slideCount; slideIndex += 1) {
    await activateSlide(page, slideIndex);

    const slideData = await page.evaluate(({ index, textSelector }) => {
      const normalizeText = (value) => value
        .replace(/\r/g, '')
        .replace(/[\t ]+\n/g, '\n')
        .replace(/\n[\t ]+/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      const rectToObject = (rect) => ({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      });

      const slidesInDom = Array.from(document.querySelectorAll('.slide'));
      const slide = slidesInDom[index];
      if (!slide) {
        return null;
      }

      const deck = document.getElementById('deck');
      if (deck) {
        deck.style.transform = `translateX(-${index * 100}%)`;
      }
      slidesInDom.forEach((item, itemIndex) => {
        item.classList.toggle('active', itemIndex === index);
      });

      const isWithinIgnoredContainer = (element) => Boolean(
        element.closest('#overview, #shortcuts, #nav'),
      );

      const isImageContainerText = (element) => Boolean(
        element.closest('.img, .img-backdrop, .img-full, .img-gallery-item'),
      );

      const readTextElement = (element) => {
        const rawText = normalizeText(element.innerText || element.textContent || '');
        if (!rawText) {
          return null;
        }

        const computed = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          return null;
        }

        const exportId = element.getAttribute('data-export-text-id') || `text-${index}-${Math.random().toString(36).slice(2, 10)}`;
        element.setAttribute('data-export-text-id', exportId);

        const fontSize = Number.parseFloat(computed.fontSize);
        const lineHeightValue = Number.parseFloat(computed.lineHeight);

        return {
          exportId,
          text: rawText,
          rect: rectToObject(rect),
          style: {
            fontFamily: computed.fontFamily,
            fontSize,
            fontWeight: computed.fontWeight,
            color: computed.color,
            textAlign: computed.textAlign,
            lineHeight: Number.isFinite(lineHeightValue) ? lineHeightValue : fontSize * 1.4,
            letterSpacing: computed.letterSpacing,
            textTransform: computed.textTransform,
            fontStyle: computed.fontStyle,
          },
          isItalic: element.closest('.pull-quote') !== null || computed.fontStyle === 'italic',
          isDropcap: element.classList.contains('dropcap') || element.matches('.dropcap'),
          isMono: element.classList.contains('meta') || element.closest('.meta') !== null,
        };
      };

      const textElements = Array.from(slide.querySelectorAll(textSelector))
        .filter((element) => !isWithinIgnoredContainer(element))
        .filter((element) => !isImageContainerText(element))
        .map(readTextElement)
        .filter(Boolean);

      const imageCaptionElements = Array.from(slide.querySelectorAll('.img-cap'))
        .filter((element) => !isWithinIgnoredContainer(element))
        .map(readTextElement)
        .filter(Boolean)
        .map((entry) => ({
          ...entry,
          isCaptionOverlay: true,
        }));

      const images = Array.from(
        slide.querySelectorAll('.img img, .img-backdrop img, .img-full img, .img-gallery-item img'),
      )
        .map((image, imageIndex) => {
          const rect = image.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            return null;
          }

          const exportId = image.getAttribute('data-export-image-id') || `image-${index}-${imageIndex}`;
          image.setAttribute('data-export-image-id', exportId);

          return {
            exportId,
            src: image.currentSrc || image.getAttribute('src') || '',
            rect: rectToObject(rect),
            kind: image.closest('.img-backdrop, .img-full') ? 'background' : 'regular',
          };
        })
        .filter(Boolean);

      const visuals = [];
      const overlayPanel = slide.querySelector('.overlay-panel');
      if (overlayPanel) {
        const exportId = overlayPanel.getAttribute('data-export-visual-id') || `visual-overlay-${index}`;
        overlayPanel.setAttribute('data-export-visual-id', exportId);
        visuals.push({
          exportId,
          kind: 'overlay-panel',
          rect: rectToObject(overlayPanel.getBoundingClientRect()),
          hideTextWithin: true,
        });
      }

      const coverBleed = slide.matches('.layout-cover') ? slide.querySelector('.full-bleed') : null;
      if (coverBleed) {
        const exportId = coverBleed.getAttribute('data-export-visual-id') || `visual-cover-${index}`;
        coverBleed.setAttribute('data-export-visual-id', exportId);
        visuals.push({
          exportId,
          kind: 'cover-background',
          rect: rectToObject(coverBleed.getBoundingClientRect()),
          hideTextWithin: false,
        });
      }

      const slideComputed = getComputedStyle(slide);
      const backgroundImage = slideComputed.backgroundImage;
      if (backgroundImage && backgroundImage !== 'none') {
        slide.setAttribute('data-export-slide-bg-id', `slide-bg-${index}`);
        visuals.push({
          exportId: `slide-bg-${index}`,
          kind: 'slide-background',
          rect: rectToObject(slide.getBoundingClientRect()),
          hideTextWithin: true,
          target: 'slide',
        });
      }

      return {
        index,
        layout: slide.getAttribute('data-layout') || '',
        className: slide.className,
        slideBgColor: slideComputed.backgroundColor,
        accentColor: slideComputed.getPropertyValue('--accent').trim() || '#94352b',
        texts: [...textElements, ...imageCaptionElements],
        images,
        visuals,
      };
    }, { index: slideIndex, textSelector: TEXT_SELECTOR });

    if (slideData) {
      slides.push(slideData);
    }
  }

  return slides;
}

async function setTextVisibility(page, rootSelector, visible) {
  await page.evaluate(({ selector, shouldShow }) => {
    const root = document.querySelector(selector);
    if (!root) {
      return;
    }

    root.querySelectorAll('[data-export-text-id]').forEach((node) => {
      if (shouldShow) {
        const previousVisibility = node.getAttribute('data-export-prev-visibility');
        if (previousVisibility !== null) {
          node.style.visibility = previousVisibility;
          node.removeAttribute('data-export-prev-visibility');
        } else {
          node.style.removeProperty('visibility');
        }
      } else {
        node.setAttribute('data-export-prev-visibility', node.style.visibility || '');
        node.style.visibility = 'hidden';
      }
    });
  }, { selector: rootSelector, shouldShow: visible });
}

async function captureVisualAssets(page, slides, tempDir) {
  for (const slideData of slides) {
    await activateSlide(page, slideData.index);

    for (let visualIndex = 0; visualIndex < slideData.visuals.length; visualIndex += 1) {
      const visual = slideData.visuals[visualIndex];
      const output = path.resolve(tempDir, `slide-${slideData.index + 1}-visual-${visualIndex + 1}.png`);
      const selector = visual.target === 'slide'
        ? `.slide[data-export-slide-bg-id="${visual.exportId}"]`
        : `[data-export-visual-id="${visual.exportId}"]`;

      if (visual.hideTextWithin) {
        await setTextVisibility(page, selector, false);
      }

      try {
        const locator = page.locator(selector).first();
        await locator.screenshot({ path: output });
        visual.assetPath = output;
      } finally {
        if (visual.hideTextWithin) {
          await setTextVisibility(page, selector, true);
        }
      }
    }

    for (let imageIndex = 0; imageIndex < slideData.images.length; imageIndex += 1) {
      const image = slideData.images[imageIndex];
      const output = path.resolve(tempDir, `slide-${slideData.index + 1}-image-${imageIndex + 1}.png`);
      const locator = page.locator(`[data-export-image-id="${image.exportId}"]`).first();
      await locator.screenshot({ path: output });
      image.assetPath = output;
    }
  }
}

function addTextBox(slide, textElement, accentColor) {
  const fontSizePx = textElement.style.fontSize;
  const fontSize = Number(pxToPoints(fontSizePx).toFixed(2));
  const lineSpacingMultiple = normalizeLineHeight(textElement.style.lineHeight, fontSizePx);
  const color = toHexColor(textElement.style.color, '1A1814');
  const text = textElement.style.textTransform === 'uppercase'
    ? textElement.text.toUpperCase()
    : textElement.text;

  if (textElement.isDropcap && text.length > 1) {
    const firstCharacter = text.slice(0, 1);
    const remainingText = text.slice(1);
    const dropcapWidthPx = Math.min(textElement.rect.width * 0.16, fontSizePx * 2.4);
    const dropcapHeightPx = Math.min(textElement.rect.height, fontSizePx * 2.9);

    slide.addText(firstCharacter, {
      x: pxToInches(textElement.rect.x),
      y: pxToInches(textElement.rect.y),
      w: pxToInches(dropcapWidthPx),
      h: pxToInches(dropcapHeightPx),
      fontFace: 'Playfair Display',
      fontSize: Number((fontSize * 2.1).toFixed(2)),
      color: toHexColor(accentColor, '94352B'),
      bold: true,
      italic: false,
      margin: 0,
      valign: 'top',
      fit: 'shrink',
    });

    slide.addText(remainingText, {
      x: pxToInches(textElement.rect.x + dropcapWidthPx),
      y: pxToInches(textElement.rect.y),
      w: pxToInches(Math.max(textElement.rect.width - dropcapWidthPx, fontSizePx * 2)),
      h: pxToInches(textElement.rect.height),
      fontSize,
      fontFace: mapFont(textElement.style.fontFamily, textElement.isMono),
      color,
      align: mapAlign(textElement.style.textAlign),
      valign: 'top',
      lineSpacingMultiple,
      bold: Number.parseInt(textElement.style.fontWeight, 10) >= 700,
      italic: textElement.isItalic,
      breakLine: false,
      margin: 0,
      fit: 'shrink',
    });
    return;
  }

  slide.addText(text, {
    x: pxToInches(textElement.rect.x),
    y: pxToInches(textElement.rect.y),
    w: pxToInches(textElement.rect.width),
    h: pxToInches(textElement.rect.height),
    fontSize,
    fontFace: mapFont(textElement.style.fontFamily, textElement.isMono),
    color,
    align: mapAlign(textElement.style.textAlign),
    valign: 'top',
    lineSpacingMultiple,
    bold: Number.parseInt(textElement.style.fontWeight, 10) >= 700,
    italic: textElement.isItalic,
    breakLine: false,
    margin: 0,
    fit: 'shrink',
  });
}

function buildPresentation(slides, outputPath) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({
    name: 'CUSTOM_16x9',
    width: pxToInches(SLIDE_W),
    height: pxToInches(SLIDE_H),
  });
  pptx.layout = 'CUSTOM_16x9';

  const helpers = {
    pxToInches,
    pxToPoints,
    toHexColor,
    mapFont,
    mapAlign,
    addTextBox,
    SLIDE_W,
    SLIDE_H,
    SAFE_X: 64,
    SAFE_Y: 48,
    DPI,
  };

  for (const slideData of slides) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };
    applyLayoutMapping(pptx, slide, slideData, helpers);
  }

  return pptx.writeFile({ fileName: outputPath });
}

async function main() {
  const htmlPath = process.argv[2];
  if (!htmlPath || !existsSync(htmlPath)) {
    console.error('Usage: node scripts/export-native-pptx.mjs <path/to/index.html>');
    process.exit(1);
  }

  const absoluteHtmlPath = path.resolve(htmlPath);
  const outputPath = outputPathFromHtml(absoluteHtmlPath);
  const fileUrl = toFileUrl(absoluteHtmlPath);
  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'folio-native-pptx-'));

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: SLIDE_W, height: SLIDE_H },
    });

    console.log('[1/4] Loading Folio deck...');
    await preparePage(page, fileUrl);

    console.log('[2/4] Extracting slide text and visual geometry...');
    const slides = await extractSlides(page);
    console.log(`  Found ${slides.length} slides`);

    console.log('[3/4] Capturing image and non-text visual assets...');
    await captureVisualAssets(page, slides, tempDir);

    console.log('[4/4] Building PPTX with native editable text...');
    await buildPresentation(slides, outputPath);
    console.log(`✅ PPTX saved to: ${outputPath}`);
  } finally {
    await browser.close();
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error('Export failed:', error);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Export Folio deck to IDML (InDesign Markup Language).
 *
 * IDML is a ZIP of XML files. InDesign opens it preserving text
 * as editable frames with correct positions, sizes and styling.
 *
 * Usage:
 *   node scripts/export-idml.mjs path/to/index.html
 */
import { chromium } from 'playwright';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve, basename, dirname } from 'path';
import { createWriteStream } from 'fs';
import { createDeflateRaw } from 'zlib';

// ─── Constants ───────────────────────────────────────────────────
const SLIDE_W = 1280;
const SLIDE_H = 720;
const DPI = 96;
const PT_FACTOR = 72 / DPI; // 0.75
const PAGE_W_PT = SLIDE_W * PT_FACTOR; // 960pt
const PAGE_H_PT = SLIDE_H * PT_FACTOR; // 540pt
const SAFE_PX = 64;
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

function pxToPt(px) { return Math.round(px * PT_FACTOR * 100) / 100; }
function pxToPtInt(px) { return Math.round(px * PT_FACTOR); }
function toFileUrl(p) { return `file://${p}`; }

function toIdmlPath(htmlPath) {
  const name = basename(htmlPath, '.html');
  return join(resolve(htmlPath, '..'), `${name}.idml`);
}

function collectImageUrls(html) {
  const urls = new Set();
  let m;
  const re = /src="(https?:\/\/[^"]+)"/g;
  while ((m = re.exec(html)) !== null) urls.add(m[1]);
  return [...urls];
}

async function downloadImages(imageUrls, imagesDir) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const map = {};
  for (const url of imageUrls) {
    try {
      const resp = await page.goto(url, { waitUntil: 'load', timeout: 15000 });
      if (resp && resp.ok()) {
        const id = url.split('?')[0].split('/').pop() || `img-${Math.random().toString(36).slice(2, 8)}`;
        const ext = url.includes('.png') ? '.png' : '.jpg';
        const name = `${id}${ext}`;
        const local = join(imagesDir, name);
        writeFileSync(local, await resp.body());
        map[url] = { name, path: local };
      }
    } catch { /* skip */ }
  }
  await browser.close();
  return map;
}

// ─── XML helpers ──────────────────────────────────────────────────
function escXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function makeId(prefix, n) {
  return `${prefix}${String(n).padStart(4, '0')}`;
}

// ─── Map helpers ──────────────────────────────────────────────────
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

function toRgb(colorValue, fallback = '#ccc') {
  const hex = toHexColor(colorValue, fallback);
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

function mapFont(fontFamily = '') {
  const f = fontFamily.toLowerCase();
  // Remove CSS font stack — take only the first named font
  const first = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
  if (first.toLowerCase().includes('playfair')) return 'Playfair Display';
  if (first.toLowerCase().includes('inter')) return 'Inter';
  if (first.toLowerCase().includes('jetbrains') || first.toLowerCase().includes('sf mono') || first.toLowerCase().includes('courier')) return 'Courier New';
  if (first.toLowerCase().includes('noto') || first.toLowerCase().includes('source han') || first.toLowerCase().includes('pingfang') || first.toLowerCase().includes('microsoft yahei')) return 'Noto Serif SC';
  return first || 'Arial';
}

function mapAlign(align = 'left') {
  if (align === 'center' || align === 'centre') return 'centerAlign';
  if (align === 'right') return 'rightAlign';
  if (align === 'justify') return 'justifyWithLastLineLeft';
  return 'leftAlign';
}

// ─── IDML Generator ──────────────────────────────────────────────
class IdmlBuilder {
  constructor() {
    this.files = {};        // path → content (string or Buffer)
    this.imageCount = 0;
    this.images = [];       // { name, origUrl, localPath }
    this.usedColors = new Set();
    this.usedFonts = new Set();
  }

  addFile(path, content) { this.files[path] = content; }

  addImage(origUrl, localPath, name) {
    this.imageCount++;
    this.images.push({ name, origUrl, localPath, id: `image${this.imageCount}` });
    return this.imageCount;
  }

  addColor(hex) {
    if (!hex || hex === '000000') return 'Black';
    this.usedColors.add(hex.toUpperCase());
    return `Color_${hex.toUpperCase()}`;
  }

  addFont(family) {
    const f = mapFont(family || 'Arial');
    this.usedFonts.add(f);
    return f;
  }

  // ─── Build all IDML files from slide data ───
  build(slides, imageDir, outputDir) {
    const storyXmls = [];
    const spreadXmls = [];

    for (let si = 0; si < slides.length; si++) {
      const sd = slides[si];
      const storyId = makeId('Story', si);
      const storySelf = makeId('u', si * 10 + 1);
      const tfSelf = makeId('u', si * 10 + 2);
      const spreadSelf = makeId('u', si * 10 + 3);
      const pageSelf = makeId('u', si * 10 + 4);
      const bgRectSelf = makeId('u', si * 10 + 5);

      // Background color
      const [r, g, b] = toRgb(sd.bgColor, 'F7F4EF');
      const colorSwatch = this.addColor(toHexColor(sd.bgColor, 'F7F4EF'));

      // Build story XML for this slide's texts
      const paras = [];
      for (let ti = 0; ti < sd.texts.length; ti++) {
        const t = sd.texts[ti];
        const family = this.addFont(t.style.fontFamily);
        const colorHex = toHexColor(t.style.color, '1A1814');
        this.addColor(colorHex);

        const fontSizePt = pxToPt(t.style.fontSize);
        const leading = t.style.lineHeight ? pxToPt(t.style.lineHeight) : fontSizePt * 1.4;
        const align = mapAlign(t.style.textAlign);
        const isBold = Number.parseInt(t.style.fontWeight, 10) >= 700;

        paras.push({
          text: t.text,
          font: family,
          size: fontSizePt,
          leading,
          align,
          color: colorHex,
          bold: isBold,
          italic: t.isItalic,
          letterSpacing: t.style.letterSpacing ? pxToPt(parseFloat(t.style.letterSpacing)) : 0,
        });
      }

      storyXmls.push(this._buildStory(storySelf, paras));

      // Build spread XML for this slide
      const textFrames = sd.texts.map((t, ti) => ({
        id: makeId('u', si * 100 + 100 + ti),
        x: pxToPt(t.rect.x),
        y: pxToPt(t.rect.y),
        w: Math.max(pxToPt(t.rect.width), 10),
        h: Math.max(pxToPt(t.rect.height), 10),
        storyId: storySelf,
        index: ti,
      }));

      spreadXmls.push(this._buildSpread(
        spreadSelf, pageSelf, bgRectSelf, textFrames, si, colorSwatch, r, g, b,
      ));
    }

    // Image resources
    const graphicXml = this._buildGraphicXml();

    // Add resource files first
    this.addFile('designmap.xml', this._buildDesignMap());
    this.addFile('BackingStory.xml', this._buildBackingStory());
    this.addFile('Resources/Swatches.xml', this._buildSwatches());
    this.addFile('Resources/Fonts.xml', this._buildFonts());
    this.addFile('Resources/ParagraphStyles.xml', this._buildParagraphStyles());
    this.addFile('Resources/CharacterStyles.xml', this._buildCharacterStyles());
    this.addFile('Resources/Graphic.xml', this._buildGraphicXml());
    this.addFile('Resources/Preferences.xml', this._buildPreferences());
    this.addFile('MasterSpreads/MasterSpread.xml', this._buildMasterSpread());

    // Add stories and spreads (zero-padded filenames for correct alphabetical order)
    for (let i = 0; i < storyXmls.length; i++) {
      this.addFile(`Stories/Story_${String(i).padStart(3, '0')}.xml`, storyXmls[i]);
    }
    for (let i = 0; i < spreadXmls.length; i++) {
      this.addFile(`Spreads/Spread_${String(i).padStart(3, '0')}.xml`, spreadXmls[i]);
    }

    // Manifest LAST — after all files are in this.files
    this.addFile('META-INF/manifest.xml', this._buildManifest());
  }

  _buildStory(storySelf, paras) {
    const paraRanges = paras.map((p, i) => {
      const align = p.align;
      const colorSw = this.addColor(p.color);
      return `      <ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/[$NORMAL]" Justification="${align}">
        <CharacterStyleRange AppliedCharacterStyle="CharacterStyle/[$NORMAL]"
          PointSize="${p.size}" Leading="${p.leading}"
          FontStyle="${p.bold ? 'Bold' : 'Regular'}"
          ${p.italic ? 'Italic="true"' : ''}
          ${p.letterSpacing ? `Tracking="${(p.letterSpacing / 1000).toFixed(4)}"` : ''}
          FillColor="Swatch/${colorSw}"
          AppliedFont="Font/${p.font}">
          <Content>${escXml(p.text)}</Content>
        </CharacterStyleRange>
      </ParagraphStyleRange>`;
    });

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Story xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <Story Self="${storySelf}" AppliedRootParagraphStyle="ParagraphStyle/[$NORMAL]">
    <StoryPreference OpticalMarginAlignment="false" StoryDirection="LeftToRight"/>
${paraRanges.join('\n')}
  </Story>
</idPkg:Story>`;
  }

  _buildSpread(spreadSelf, pageSelf, bgRectSelf, textFrames, slideIndex, colorSwatch, r, g, b) {
    const bgRectId = bgRectSelf;
    const tfXml = textFrames.map((tf, i) => {
      const storyRef = tf.storyId;
      const tfId = tf.id;
      // Prefer OVAL over path geometry for simplicity, or use a simple rect path
      return `    <TextFrame Self="${tfId}" PreviousTextFrame="" NextTextFrame=""
        ItemTransform="1 0 0 1 ${tf.x} ${tf.y}"
        StoryReference="Story/${storyRef}">
      <InCopyExportOption IncludeGraphicProxies="true"/>
      <Properties>
        <PathGeometry>
          <GeometryPathType PathOpen="false">
            <PathPointArray>
              <PathPointType Anchor="0 0" LeftSegment="0 0" RightSegment="0 0" />
              <PathPointType Anchor="${tf.w} 0" LeftSegment="${tf.w} 0" RightSegment="${tf.w} 0" />
              <PathPointType Anchor="${tf.w} ${tf.h}" LeftSegment="${tf.w} ${tf.h}" RightSegment="${tf.w} ${tf.h}" />
              <PathPointType Anchor="0 ${tf.h}" LeftSegment="0 ${tf.h}" RightSegment="0 ${tf.h}" />
            </PathPointArray>
          </GeometryPathType>
        </PathGeometry>
      </Properties>
    </TextFrame>`;
    }).join('\n');

    // Background rectangle
    const bgColor = `M${r},C=${g},Y=${b}`; // IDML CMYK-ish, but we'll use RGB swatch
    const bgFill = `Swatch/${colorSwatch}`;

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Spread xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <Spread Self="${spreadSelf}" PageCount="1">
    <Page Self="${pageSelf}" Name="${slideIndex + 1}" AppliedMaster="MasterSpread/um" 
      ItemTransform="1 0 0 1 0 0" 
      GeometricBounds="0 0 ${PAGE_H_PT} ${PAGE_W_PT}">
      <Properties>
        <PageMargins ColumnCount="1" ColumnGutter="12"
          Top="0" Bottom="0" Left="0" Right="0"/>
      </Properties>
    </Page>
    <Rectangle Self="${bgRectId}" ItemTransform="1 0 0 1 0 0"
      FillColor="${bgFill}" FillTint="-1" StrokeWeight="0">
      <Properties>
        <PathGeometry>
          <GeometryPathType PathOpen="false">
            <PathPointArray>
              <PathPointType Anchor="0 0" LeftSegment="0 0" RightSegment="0 0" />
              <PathPointType Anchor="${PAGE_W_PT} 0" LeftSegment="${PAGE_W_PT} 0" RightSegment="${PAGE_W_PT} 0" />
              <PathPointType Anchor="${PAGE_W_PT} ${PAGE_H_PT}" LeftSegment="${PAGE_W_PT} ${PAGE_H_PT}" RightSegment="${PAGE_W_PT} ${PAGE_H_PT}" />
              <PathPointType Anchor="0 ${PAGE_H_PT}" LeftSegment="0 ${PAGE_H_PT}" RightSegment="0 ${PAGE_H_PT}" />
            </PathPointArray>
          </GeometryPathType>
        </PathGeometry>
      </Properties>
    </Rectangle>
${tfXml}
  </Spread>
</idPkg:Spread>`;
  }

  // ─── Resource XML builders ─────────────────────────────────────

  _buildManifest() {
    const pkg = 'http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging';
    const entries = Object.keys(this.files)
      .filter(f => f !== 'META-INF/manifest.xml') // don't self-reference
      .sort();
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest xmlns="${pkg}">
${entries.map(p => `  <fileEntry path="${p}" />`).join('\n')}
</manifest>`;
  }

  _buildDesignMap() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:DesignMap xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <DesignMap>
    <BookmarkListItemSelf />
    <GraphicSelf />
    <GuideSelf />
    <HiddenDocumentStyleSheetPath />
    <PageSelf />
    <PreferenceSelf />
    <SpreadSelf />
    <StoryListSelf />
  </DesignMap>
</idPkg:DesignMap>`;
  }

  _buildBackingStory() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Story xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <Story Self="ub" AppliedRootParagraphStyle="ParagraphStyle/[$NORMAL]" TrackChanges="false">
    <StoryPreference OpticalMarginAlignment="false" StoryDirection="LeftToRight"/>
  </Story>
</idPkg:Story>`;
  }

  _buildSwatches() {
    const swatches = [];
    // Default InDesign swatches
    swatches.push(`    <Swatch Self="Swatch/Black" Name="Black" ColorValue="#000000" Model="Process" Space="CMYK" ColorEditable="true" />
    <Swatch Self="Swatch/Paper" Name="Paper" ColorValue="#FFFFFF" Model="Process" Space="CMYK" ColorEditable="true" />
    <Swatch Self="Swatch/Registration" Name="Registration" ColorValue="#000000" Model="Process" Space="CMYK" ColorEditable="true" />
    <Swatch Self="Swatch/None" Name="None" ColorValue="#FFFFFF" Model="Process" Space="CMYK" ColorEditable="true" />`);
    // Text color black
    swatches.push(`    <Swatch Self="Swatch/Color_1A1814" Name="ink" Model="RGB" Space="RGB" ColorValue="#1A1814" />
    <Swatch Self="Swatch/Color_F7F4EF" Name="paper" Model="RGB" Space="RGB" ColorValue="#F7F4EF" />
    <Swatch Self="Swatch/Color_94352B" Name="accent" Model="RGB" Space="RGB" ColorValue="#94352B" />`);

    for (const hex of this.usedColors) {
      if (['1A1814', 'F7F4EF', '94352B', '000000', 'FFFFFF'].includes(hex)) continue;
      swatches.push(`    <Swatch Self="Swatch/Color_${hex}" Name="Color_${hex}" Model="RGB" Space="RGB" ColorValue="#${hex}" />`);
    }

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Swatches xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <Swatches>
${swatches.join('\n')}
  </Swatches>
</idPkg:Swatches>`;
  }

  _buildFonts() {
    const fonts = [];
    for (const f of this.usedFonts) {
      fonts.push(`    <Font Self="Font/${escXml(f)}" Name="${escXml(f)}" DisplayName="${escXml(f)}" FontFamily="${escXml(f)}" FontStyleName="Regular" />`);
    }
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Fonts xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <Fonts>
${fonts.join('\n')}
  </Fonts>
</idPkg:Fonts>`;
  }

  _buildParagraphStyles() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:ParagraphStyles xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <ParagraphStyles>
    <ParagraphStyle Self="ParagraphStyle/[$NORMAL]" Name="$NORMAL" />
    <ParagraphStyle Self="ParagraphStyle/[$ROOT]" Name="$ROOT" />
  </ParagraphStyles>
</idPkg:ParagraphStyles>`;
  }

  _buildCharacterStyles() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:CharacterStyles xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <CharacterStyles>
    <CharacterStyle Self="CharacterStyle/[$NORMAL]" Name="$NORMAL" />
  </CharacterStyles>
</idPkg:CharacterStyles>`;
  }

  _buildGraphicXml() {
    // Minimal graphic resource
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Graphic xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <Graphic />
</idPkg:Graphic>`;
  }

  _buildPreferences() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Preferences xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <Preference />
</idPkg:Preferences>`;
  }

  _buildMasterSpread() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:MasterSpread xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="8.0">
  <MasterSpread Self="um" Name="um" PageCount="1">
    <Page Self="ump" Name="um" ItemTransform="1 0 0 1 0 0" 
      GeometricBounds="0 0 ${PAGE_H_PT} ${PAGE_W_PT}">
      <Properties>
        <PageMargins ColumnCount="1" ColumnGutter="12"
          Top="0" Bottom="0" Left="0" Right="0"/>
      </Properties>
    </Page>
  </MasterSpread>
</idPkg:MasterSpread>`;
  }

  // ─── Write ZIP ────────────────────────────────────────────────
  async write(outputPath) {
    // Write as a simple ZIP using the zip library
    // Since we're in Node, use a child process approach with system zip
    const { execSync } = await import('child_process');
    const tempDir = mkdtempSync(join(tmpdir(), 'idml-build-'));
    // Write all files to temp directory
    for (const [filePath, content] of Object.entries(this.files)) {
      const fullPath = join(tempDir, filePath);
      mkdirSync(dirname(fullPath), { recursive: true });
      writeFileSync(fullPath, content, 'utf-8');
    }
    // Copy images
    // (images are already handled elsewhere)
    // Zip it
    const zipPath = resolve(outputPath);
    // Remove existing file
    try { execSync(`rm -f "${zipPath}"`); } catch {}
    execSync(`cd "${tempDir}" && zip -rX "${zipPath}" . 2>/dev/null`);
    // Cleanup
    execSync(`rm -rf "${tempDir}"`);
    return zipPath;
  }
}

// ─── Extraction (adapted from export-native-pptx.mjs) ────────────
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

      // Apply active state again inside evaluate for accurate getBoundingClientRect
      const deck = document.getElementById('deck');
      if (deck) deck.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, i) => s.classList.toggle('active', i === index));

      const normalizeText = (v) => v.replace(/\r/g, '').replace(/[\t ]+\n/g, '\n').replace(/\n[\t ]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
      const isWithinIgnored = (el) => Boolean(el.closest('#overview, #shortcuts, #nav'));
      const isImgContainer = (el) => Boolean(el.closest('.img, .img-backdrop, .img-full, .img-gallery-item'));

      const texts = Array.from(slide.querySelectorAll(textSelector))
        .filter(el => !isWithinIgnored(el) && !isImgContainer(el))
        .filter(el => el.querySelectorAll(textSelector).length === 0) // leaf only
        .map(el => {
          const raw = normalizeText(el.innerText || el.textContent || '');
          if (!raw) return null;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return null;
          const cs = getComputedStyle(el);
          const lh = parseFloat(cs.lineHeight);
          return {
            text: raw,
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
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

      const bgColor = getComputedStyle(slide).backgroundColor;

      return { index, layout: slide.getAttribute('data-layout'), bgColor, texts };
    }, { index: slideIndex, textSelector: TEXT_SELECTOR });

    if (slideData) slides.push(slideData);
  }
  return slides;
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  const htmlPath = process.argv[2];
  if (!htmlPath || !existsSync(htmlPath)) {
    console.error('Usage: node scripts/export-idml.mjs <path/to/index.html>');
    process.exit(1);
  }
  const absPath = resolve(htmlPath);
  const html = readFileSync(absPath, 'utf-8');
  const outputPath = toIdmlPath(absPath);
  const outputDir = dirname(outputPath);

  console.log('[1/4] Rendering deck with Playwright...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: SLIDE_W, height: SLIDE_H } });
  await page.goto(toFileUrl(absPath), { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('.slide', { timeout: 10000 });
  // Disable animations
  await page.addStyleTag({ content: `
    #deck, .slide, .slide [data-anim], .anim-scale {
      transition: none !important; animation: none !important;
    }
    .slide, .slide [data-anim] {
      opacity: 1 !important; transform: none !important;
    }` });

  const slides = await extractSlides(page);
  await browser.close();
  console.log(`  ${slides.length} slides, ${slides.reduce((s, sd) => s + sd.texts.length, 0)} text elements`);

  // Download images
  console.log('[2/4] Downloading images...');
  const imagesDir = mkdtempSync(join(tmpdir(), 'idml-images-'));
  const imageMap = await downloadImages(collectImageUrls(html), imagesDir);
  console.log(`  ${Object.keys(imageMap).length} images downloaded`);

  // Build IDML
  console.log('[3/4] Building IDML structure...');
  const idml = new IdmlBuilder();
  idml.build(slides, imageMap, outputDir);

  // Also copy images next to the IDML file
  const idmlImagesDir = join(outputDir, `${basename(outputPath, '.idml')}_images`);
  mkdirSync(idmlImagesDir, { recursive: true });
  for (const [url, info] of Object.entries(imageMap)) {
    if (existsSync(info.path)) {
      cpSync(info.path, join(idmlImagesDir, info.name));
    }
  }

  // Write IDML
  console.log('[4/4] Writing IDML...');
  const finalPath = await idml.write(outputPath);
  console.log(`✅ IDML saved to: ${finalPath}`);
  console.log(`   Images: ${idmlImagesDir}/`);
}

main().catch((err) => { console.error('Export failed:', err); process.exit(1); });

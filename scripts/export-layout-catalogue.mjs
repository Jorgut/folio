import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'assets/screenshots');
const groups = [
  ['essay', 'Essay / four-page reading sequence', '.essay-family article'],
  ['longform', 'Longform / three structural variants', '.editorial-family article'],
  ['format-adaptation', 'Format adaptation / page format and image role', '.social-family article'],
  ['magazine', 'Magazine / facing-page editorial system', '.magazine-family article'],
  ['boards', 'Portfolio / presentation and review boards', 'main > article'],
];
const escape = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const browser = await chromium.launch(process.env.FOLIO_BROWSER_CHANNEL ? { channel: process.env.FOLIO_BROWSER_CHANNEL } : {});
try {
  await mkdir(output, { recursive: true });
  const source = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const errors = [];
  source.on('pageerror', (error) => errors.push(error.message));
  await source.goto(pathToFileURL(path.join(root, 'reference-layouts/previews/index.html')).href);
  await source.evaluate(async () => { await document.fonts.ready; fillVerticalPreviews(); });
  const catalogue = [];
  for (const [id, title, selector] of groups) {
    const items = [];
    for (const article of await source.locator(selector).all()) {
      const name = await article.locator(':scope > h2').evaluate((heading) => {
        const clone = heading.cloneNode(true);
        clone.querySelectorAll('.mode-label').forEach((label) => label.remove());
        return clone.textContent.trim();
      });
      const slides = [];
      for (const slide of await article.locator(':scope > .slide').all()) {
        const clip = await slide.evaluate((canvas) => {
          const box = canvas.getBoundingClientRect();
          return { x: box.left + window.scrollX - 8, y: box.top + window.scrollY - 8, width: box.width + 16, height: box.height + 16 };
        });
        slides.push((await source.screenshot({ fullPage: true, clip })).toString('base64'));
      }
      if (!slides.length) throw new Error(`No canvas found: ${name}`);
      items.push({ name, slides });
    }
    if (!items.length) throw new Error(`Empty catalogue group: ${title}`);
    catalogue.push({ id, title, items });
  }
  if (errors.length) throw new Error(errors.join('\n'));
  const sheet = await browser.newPage({ viewport: { width: 1800, height: 1100 }, deviceScaleFactor: 1 });
  await sheet.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><title>Folio layout catalogue</title><style>
    *{box-sizing:border-box}body{margin:0;padding:40px;background:#f2f2ef;color:#222;font-family:Arial,sans-serif;letter-spacing:0}
    h1{margin:0 0 8px;font-size:32px}p{margin:0 0 28px;color:#62625d;font-size:16px}section{margin-bottom:28px}h2{font-size:21px;margin:0 0 14px}
    .grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.item{padding:16px;background:#fffdf8;border:1px solid #c7c7c1}
    h3{font-size:14px;line-height:1.35;margin:0 0 12px;min-height:38px}.canvases{display:flex;gap:8px;justify-content:center;align-items:center;height:310px}
    img{max-width:100%;max-height:310px;object-fit:contain;min-width:0}.canvases:has(img+img) img{max-width:calc(50% - 4px)}
    footer{color:#62625d;font-size:13px}
  </style><h1>Folio Reference Layouts</h1><p>Current wireframe catalogue / 2026-10-08 / placeholders show structure and reading density</p>
  ${catalogue.map((group) => `<section id="${group.id}"><h2>${escape(group.title)}</h2><div class="grid">${group.items.map((item) => `<div class="item"><h3>${escape(item.name)}</h3><div class="canvases">${item.slides.map((data) => `<img src="data:image/png;base64,${data}" alt="${escape(item.name)}">`).join('')}</div></div>`).join('')}</div></section>`).join('')}
  <footer>Black outline: trim / green dashed: safe text limit / blue dotted: content alignment / red dashed: bleed outside trim</footer></html>`);
  await sheet.locator('img').evaluateAll(async (images) => Promise.all(images.map((image) => image.decode())));
  await sheet.screenshot({ path: path.join(output, 'reference-layouts-current.png'), fullPage: true });
  await sheet.setViewportSize({ width: 1440, height: 1100 });
  await sheet.addStyleTag({ content: '.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.canvases{height:480px}img{max-height:480px}h3{font-size:18px;min-height:48px}' });
  for (const { id } of catalogue) {
    await sheet.locator(`#${id}`).screenshot({ path: path.join(output, `reference-layouts-${id}.png`) });
  }
  console.log(`Exported ${catalogue.reduce((count, group) => count + group.items.length, 0)} layouts in ${catalogue.length} groups.`);
} finally {
  await browser.close();
}

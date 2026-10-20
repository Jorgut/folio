function positiveNumber(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) throw new Error(`Invalid ${name}: ${value}`);
  return number;
}

export function isPublicationDocument(document = globalThis.document) {
  return Boolean(document.querySelector('[data-document-format="publication"]'));
}

export async function requireDecodedImages(document = globalThis.document, timeoutMs = 10000) {
  await Promise.all(Array.from(document.images).map(async image => {
    image.loading = 'eager';
    const source = image.currentSrc || image.src || '(missing source)';
    let timer;
    try {
      await Promise.race([
        image.decode(),
        new Promise((_,reject) => { timer=setTimeout(()=>reject(new Error('decode deadline exceeded')),timeoutMs); }),
      ]);
      if (!(image.naturalWidth > 0 && image.naturalHeight > 0)) throw new Error('empty image dimensions');
    } catch(error) {
      throw new Error(`Image unavailable: ${source}: ${error.message}`);
    } finally {
      clearTimeout(timer);
    }
  }));
}

export function validatePublicationPages({ widthMm, heightMm, bleedMm, pages }) {
  const width = positiveNumber(widthMm, 'page width');
  const height = positiveNumber(heightMm, 'page height');
  if (bleedMm === undefined || bleedMm === null || bleedMm === '') throw new Error('Missing bleed');
  const bleed = Number(bleedMm);
  if (!Number.isFinite(bleed) || bleed < 0) throw new Error(`Invalid bleed: ${bleedMm}`);
  if (!Array.isArray(pages) || pages.length === 0) throw new Error('Publication has no pages');

  const seen = new Set();
  const normalized = pages.map((page, index) => {
    if (!page.id || seen.has(page.id)) throw new Error(`Missing or duplicate page ID: ${page.id}`);
    seen.add(page.id);
    if (page.side !== 'left' && page.side !== 'right' && page.side !== 'single') {
      throw new Error(`Invalid page side for ${page.id}: ${page.side}`);
    }
    if (page.bleedMode !== 'no-bleed' && page.bleedMode !== 'edge-bleed') {
      throw new Error(`Invalid bleed mode for ${page.id}: ${page.bleedMode}`);
    }
    if (page.side !== 'single' && !page.spreadId) throw new Error(`Missing spread ID for ${page.id}`);
    return { ...page, number: index + 1 };
  });

  for (let i = 0; i < normalized.length; i++) {
    const page = normalized[i];
    if (page.side === 'single') continue;
    const neighbor = normalized[i + (page.side === 'left' ? 1 : -1)];
    if (!neighbor || neighbor.spreadId !== page.spreadId ||
        neighbor.side !== (page.side === 'left' ? 'right' : 'left')) {
      throw new Error(`Incomplete or out-of-order facing pair: ${page.spreadId}`);
    }
  }

  return { widthMm: width, heightMm: height, bleedMm: bleed, pages: normalized };
}

export function collectPublicationPageDescriptors(document = globalThis.document) {
  const root = document.querySelector('[data-document-format="publication"]');
  if (!root) throw new Error('Missing publication document root');
  const pages = [];
  for (const child of root.children) {
    if (child.classList.contains('page')) {
      pages.push({ id: child.id, side: 'single', bleedMode: child.dataset.bleedMode });
      continue;
    }
    if (!child.classList.contains('spread')) continue;
    if (!child.id) throw new Error('Publication spread is missing an ID');
    const pair = Array.from(child.children).filter(element => element.classList.contains('page'));
    if (pair.length !== 2) throw new Error(`Spread ${child.id || 'unnamed'} must contain two pages`);
    for (const [index, element] of pair.entries()) {
      pages.push({
        id: element.id || `${child.id}-${index + 1}`,
        spreadId: child.id,
        side: index === 0 ? 'left' : 'right',
        bleedMode: element.dataset.bleedMode,
      });
    }
  }
  return {
    widthMm: root.dataset.pageWidthMm,
    heightMm: root.dataset.pageHeightMm,
    bleedMm: root.dataset.bleedMm,
    pages,
  };
}

export function collectPublicationPages(document) {
  return validatePublicationPages(collectPublicationPageDescriptors(document));
}

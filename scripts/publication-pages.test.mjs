import assert from 'node:assert/strict';
import { test } from 'node:test';
import { collectPublicationPages, validatePublicationPages, isPublicationDocument, requireDecodedImages } from './publication-pages.mjs';

test('document routing uses DOM selector rather than serialized attribute spelling', () => {
  const doc={querySelector(selector){assert.equal(selector,'[data-document-format="publication"]');return {};}};
  assert.equal(isPublicationDocument(doc),true);
  assert.equal(isPublicationDocument({querySelector:()=>null}),false);
});

test('image readiness accepts decoded images and rejects unavailable or empty assets', async () => {
  const valid={src:'local.png',naturalWidth:100,naturalHeight:80,decode:async()=>{}};
  await requireDecodedImages({images:[valid]},50);
  assert.equal(valid.loading,'eager');
  await assert.rejects(requireDecodedImages({images:[{...valid,src:'missing.png',decode:async()=>{throw new Error('broken');}}]},50),/missing.png.*broken/);
  await assert.rejects(requireDecodedImages({images:[{...valid,naturalWidth:0}]},50),/empty image dimensions/);
});

test('stalled image decoding has a deadline instead of silently exporting', async () => {
  await assert.rejects(requireDecodedImages({images:[{src:'slow.png',decode:()=>new Promise(()=>{})}]},20),/slow.png.*deadline/);
});

const pair = [
  { id: 'opening-1', spreadId: 'opening', side: 'left', bleedMode: 'no-bleed' },
  { id: 'opening-2', spreadId: 'opening', side: 'right', bleedMode: 'edge-bleed' },
];

test('preserves two A4 pages and facing order', () => {
  const result = validatePublicationPages({ widthMm: 210, heightMm: 297, bleedMm: 3, pages: pair });
  assert.deepEqual(result.pages.map(page => [page.number, page.side]), [[1, 'left'], [2, 'right']]);
  assert.equal(result.widthMm, 210);
  assert.equal(result.heightMm, 297);
});

test('rejects incomplete pairs and missing page dimensions', () => {
  assert.throws(() => validatePublicationPages({ widthMm: 210, heightMm: 297, bleedMm: 3, pages: pair.slice(0, 1) }), /Incomplete/);
  assert.throws(() => validatePublicationPages({ heightMm: 297, bleedMm: 3, pages: pair }), /Invalid page width/);
  assert.throws(() => validatePublicationPages({ widthMm: 210, heightMm: 297, pages: pair }), /Missing bleed/);
});

test('rejects duplicate IDs and invalid bleed modes', () => {
  assert.throws(() => validatePublicationPages({ widthMm: 210, heightMm: 297, bleedMm: 3, pages: [pair[0], { ...pair[1], id: pair[0].id }] }), /duplicate/);
  assert.throws(() => validatePublicationPages({ widthMm: 210, heightMm: 297, bleedMm: 3, pages: [{ ...pair[0], bleedMode: 'unknown' }, pair[1]] }), /bleed mode/);
});

test('collects a standalone page followed by a facing pair', () => {
  const element = (classes, id, children = [], bleedMode) => ({
    id, children, dataset: { bleedMode }, classList: { contains: name => classes.includes(name) },
  });
  const root = element([], '', [
    element(['page'], 'cover', [], 'no-bleed'),
    element(['spread'], 'opening', [
      element(['page'], 'left', [], 'no-bleed'),
      element(['page'], 'right', [], 'edge-bleed'),
    ]),
  ]);
  root.dataset = { pageWidthMm: '210', pageHeightMm: '297', bleedMm: '3' };
  const document = { querySelector: () => root };
  const result = collectPublicationPages(document);
  assert.deepEqual(result.pages.map(page => page.id), ['cover', 'left', 'right']);
  assert.deepEqual(result.pages.map(page => page.side), ['single', 'left', 'right']);
});

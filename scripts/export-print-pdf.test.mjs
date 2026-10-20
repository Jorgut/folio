import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PDFDocument } from 'pdf-lib';
import { applyPublicationPageBoxes, publicationPrintStyles, renderPrintPdf } from './export-print-pdf.mjs';

test('publication dispatch shares the loaded page and waits before closing the browser', async () => {
  let loads=0,closed=false,rendered=false;
  const page={
    emulateMedia:async()=>{},goto:async()=>{loads++;},addStyleTag:async()=>{},
    evaluate:async fn=>{
      if(fn.name==='isPublicationDocument') return true;
      if(fn.name==='collectPublicationPageDescriptors') return {widthMm:210,heightMm:297,bleedMm:3,pages:[{id:'cover',side:'single',bleedMode:'no-bleed'}]};
    },
    pdf:async()=>{await new Promise(resolve=>setTimeout(resolve,5));assert.equal(closed,false);rendered=true;},
  };
  const browserType={launch:async()=>({newPage:async()=>page,close:async()=>{closed=true;}})};
  const contract=await renderPrintPdf('file:///fixture.html','unused.pdf',browserType);
  assert.equal(contract.pages.length,1);assert.equal(loads,1);assert.equal(rendered,true);assert.equal(closed,true);
});

test('publication image failure prevents PDF generation and closes the browser',async()=>{
  let closed=false,rendered=false;
  const page={emulateMedia:async()=>{},goto:async()=>{},addStyleTag:async()=>{},evaluate:async fn=>{
    if(fn.name==='isPublicationDocument') return true;
    if(fn.name==='collectPublicationPageDescriptors') return {widthMm:210,heightMm:297,bleedMm:3,pages:[{id:'cover',side:'single',bleedMode:'no-bleed'}]};
    if(fn.name==='requireDecodedImages') throw new Error('Image unavailable: missing.png');
  },pdf:async()=>{rendered=true;}};
  await assert.rejects(renderPrintPdf('file:///fixture.html','unused.pdf',{launch:async()=>({newPage:async()=>page,close:async()=>{closed=true;}})}),/Image unavailable/);
  assert.equal(rendered,false);assert.equal(closed,true);
});

test('facing-page bleed extends only the top and outer image edge', () => {
  const css = publicationPrintStyles({ widthMm: 210, heightMm: 297, bleedMm: 3 });
  assert.match(css, /@page \{ size: 216mm 303mm/);
  assert.match(css, /data-publication-side="left"[^\n]*edge-bleed[^\n]*img:first-child/);
  assert.match(css, /margin-left: -3mm; width: calc\(100% \+ 3mm\)/);
  assert.match(css, /data-publication-side="right"[^\n]*edge-bleed[^\n]*img:first-child/);
  assert.match(css, /margin-right: -3mm; width: calc\(100% \+ 3mm\)/);
  assert.match(css, /margin-top: -3mm/);
});

test('A4 publication PDF keeps one trim box per source page', async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage([612.28, 858.89]);
  pdf.addPage([612.28, 858.89]);
  const contract = { widthMm: 210, heightMm: 297, bleedMm: 3, pages: [{}, {}] };
  applyPublicationPageBoxes(pdf, contract);
  const trim = pdf.getPage(0).getTrimBox();
  assert.ok(Math.abs(trim.width - 210 * 72 / 25.4) < 0.01);
  assert.ok(Math.abs(trim.height - 297 * 72 / 25.4) < 0.01);
  assert.ok(Math.abs(trim.x - 3 * 72 / 25.4) < 0.01);
  assert.ok(Math.abs(pdf.getPage(0).getWidth() - 216 * 72 / 25.4) < 0.01);
});

test('publication PDF rejects a missing page', async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage([612.28, 858.89]);
  assert.throws(() => applyPublicationPageBoxes(pdf, {
    widthMm: 210, heightMm: 297, bleedMm: 3, pages: [{}, {}],
  }), /Expected 2 A4 pages, got 1/);
});

test('publication PDF rejects the wrong physical canvas', async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage([960, 540]);
  assert.throws(() => applyPublicationPageBoxes(pdf, {
    widthMm: 210, heightMm: 297, bleedMm: 3, pages: [{}],
  }), /Unexpected publication PDF page size/);
});

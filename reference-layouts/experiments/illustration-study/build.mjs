import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,size=26,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${escape(s)}</text>`;
const lines=(x,y,copy)=>copy.map((s,i)=>text(x,y+i*29,s,22)).join('');
const image=(x,y,w,h,label)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#hatch)" stroke="#9f998f"/>${text(x+w/2,y+h/2,label,25,'text-anchor="middle"')}`;
const subject=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#9f998f" stroke-width="2" stroke-dasharray="8 6"/>${text(x+w/2,y+h/2-12,'ISOLATED IMAGE',23,'text-anchor="middle"')}${text(x+w/2,y+h/2+22,'TRANSPARENT BACKGROUND',20,'text-anchor="middle"')}`;
const defs=`<defs><pattern id="hatch" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="24" height="24" fill="#d8d3c9"/><rect width="12" height="24" fill="#c8c2b7"/></pattern></defs>`;
const pages=[
 {id:'L46',name:'Central subject and sideways statement',kind:'New structure',body:text(64,88,'PROJECT / AUTHOR',22)+subject(395,155,460,365)+text(625,615,'PROJECT TITLE',54,'text-anchor="middle" font-weight="700"')+lines(64,420,['Short introduction.','Scope and context.','Date / edition.'])+text(1115,160,'A CLEAR EDITORIAL STATEMENT',30,'transform="rotate(90 1115 160)" font-weight="700"')},
 {id:'L09-A',name:'Image-led chapter opener',kind:'Variant of L09',body:image(0,0,535,615,'IMAGE / COLLAGE')+text(625,170,'01',112,'font-weight="700"')+text(625,235,'CHAPTER TITLE',36,'font-weight="700"')+lines(625,305,['Introduce the chapter.','Keep the image group related.','Use a short supporting paragraph.'])+text(625,510,'AUTHOR / PROJECT / DATE',20)},
 {id:'L01-A',name:'Sideways title and isolated subject',kind:'Variant of L01 / L33',body:text(72,150,'PROJECT TITLE',30,'transform="rotate(90 72 150)" font-weight="700"')+text(165,220,'SUBJECT NOTES',28,'font-weight="700"')+lines(165,280,['Subject and context.','One supporting observation.','Credit / date / medium.'])+subject(715,135,420,445)},
 {id:'L47',name:'Central subject and paired annotations',kind:'New structure',body:subject(465,165,350,360)+text(70,255,'OBSERVATION',27,'font-weight="700"')+lines(70,310,['Describe one aspect.','Connect it to the subject.','Keep the note concise.'])+text(905,255,'INTERPRETATION',27,'font-weight="700"')+lines(905,310,['Explain another aspect.','State the conditions.','Separate fact and opinion.'])+text(640,596,'SUBJECT / MEDIUM / SOURCE',22,'text-anchor="middle"')},
 {id:'L09-B',name:'Chapter rail and edge-cropped image',kind:'Variant of L09 / L26 / L32',body:image(480,0,800,635,'DETAIL CROP / FOCAL SUBJECT')+text(64,175,'02',112,'font-weight="700"')+text(64,245,'CHAPTER TITLE',32,'font-weight="700"')+lines(64,310,['Introduce the detail.','Identify its relation to the whole.','Preserve the subject focal point.'])+text(64,525,'FIGURE / SOURCE / DATE',20)}
];
await fs.mkdir(root,{recursive:true});
for(const p of pages){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-labelledby="title"><title id="title">${p.id} ${escape(p.name)}</title>${defs}<rect width="1280" height="720" fill="#fffdf8"/><g font-family="Arial, sans-serif" fill="#4e4941">${p.body}<path d="M64 656H1216" stroke="#c9c2b8"/>${text(64,692,`${p.id} / ${p.kind}`,19)}${text(1216,692,'FOLIO / ORIGINAL WIREFRAME',19,'text-anchor="end"')}</g></svg>`;
 await fs.writeFile(path.join(root,`${p.id}.svg`),svg);
}
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Folio / Illustration layout studies</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f1ec;color:#4e4941;font:16px Arial,sans-serif}header,main{max-width:1440px;margin:auto;padding:24px}h1{font-size:26px}main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}figure{margin:0;min-width:0}figcaption{font-weight:bold;margin-bottom:12px;line-height:1.4}img{display:block;width:100%;aspect-ratio:16/9;border:1px solid #c9c2b8;background:#fffdf8}a{color:inherit}footer{padding:24px}@media(max-width:800px){main{grid-template-columns:1fr}}</style><header><h1>Illustration / Editorial Portfolio</h1></header><main>${pages.map(p=>`<figure><figcaption>${p.id} / ${p.name}</figcaption><a href="${p.id}.svg"><img src="${p.id}.svg" alt="${p.name}"></a></figure>`).join('')}</main><footer>Folio</footer></html>`;
await fs.writeFile(path.join(root,'index.html'),html);
await fs.writeFile(path.join(root,'layouts.json'),JSON.stringify(pages.map(({body,...p})=>p),null,2));
console.log('Created 2 new structures and 3 variants; existing 45 unchanged.');

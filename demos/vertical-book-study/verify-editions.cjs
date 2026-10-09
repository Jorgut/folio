const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{const browser=await chromium.launch({channel:process.env.FOLIO_BROWSER_CHANNEL||'chrome'});try{
const p=await browser.newPage({viewport:{width:1400,height:1000}});
const root=__dirname;
for(const width of [1400,800,390]){
 await p.setViewportSize({width,height:1000});
 for(const mode of ['', '?mode=slides']){
  await p.goto('file://'+path.join(root,'index.html')+mode);await p.waitForSelector('body[data-ready]');await p.waitForTimeout(100);
  const failures=await p.locator('.sheet').evaluateAll(es=>es.filter(e=>!e.hidden).flatMap(e=>{const a=e.getBoundingClientRect(),b=e.querySelector('.page').getBoundingClientRect();return Math.abs(a.left-b.left)>1||Math.abs(a.top-b.top)>1||Math.abs(a.width-b.width)>1||Math.abs(a.height-b.height)>1?[{sheet:a.toJSON(),page:b.toJSON()}]:[]}));
  if(failures.length)throw Error('Page outside its sheet: '+JSON.stringify({width,mode,failures}));
  if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Chinese horizontal overflow');
 }
}
await p.setViewportSize({width:1400,height:1000});
await p.goto('file://'+path.join(root,'index.html'));await p.waitForSelector('body[data-ready]');
const positions=await p.locator('.sheet').evaluateAll(es=>es.slice(0,2).map(e=>e.getBoundingClientRect().x));if(positions[0]<=positions[1])throw Error('Chinese gallery not RTL');
await p.goto('file://'+path.join(root,'index.html?mode=slides'));await p.waitForSelector('body[data-ready]');await p.keyboard.press('ArrowLeft');if(!await p.locator('.sheet').nth(1).isVisible())throw Error('Chinese next direction');
await p.locator('.sheet').evaluateAll(es=>es.forEach(e=>e.hidden=false));await p.addStyleTag({content:'@page{size:1600px 900px;margin:0}'});await p.pdf({path:path.join(root,'slides.pdf'),preferCSSPageSize:true,printBackground:true,pageRanges:'1-8'});
await p.goto('file://'+path.join(root,'index.html'));await p.waitForSelector('body[data-ready]');await p.pdf({path:path.join(root,'social.pdf'),preferCSSPageSize:true,printBackground:true,pageRanges:'1-8'});
await p.goto('file://'+path.join(root,'mongolian/index.html'));await p.waitForSelector('body[data-ready]');
const qa=await p.evaluate(()=>({pages:document.querySelectorAll('.page').length,font:document.fonts.check('28px Mongolian'),images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),empty:[...document.querySelectorAll('.copy')].filter(e=>!e.textContent).length,overflow:[...document.querySelectorAll('.copy,h1,.content')].filter(e=>e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1).map(e=>e.className)}));console.log(JSON.stringify({chineseRTL:positions, mongolian:qa}));if(qa.empty||qa.overflow.length||!qa.images||!qa.font)throw Error('Mongolian QA failed');
await p.pdf({path:path.join(root,'mongolian/social.pdf'),preferCSSPageSize:true,printBackground:true,pageRanges:'1-8'});
await p.setViewportSize({width:1080,height:1350});await p.addStyleTag({content:'header{display:none}main{display:block;padding:0;max-width:none}'});await p.waitForTimeout(200);for(let i=0;i<8;i++)await p.locator('.page').nth(i).screenshot({path:path.join(root,`mongolian/images/${String(i+1).padStart(2,'0')}.png`)});
await p.goto('file://'+path.join(root,'mongolian/index.html?mode=slides'));await p.waitForSelector('body[data-ready]');
await p.keyboard.press('ArrowRight');if(!await p.locator('.sheet').nth(1).isVisible())throw Error('Mongolian slides next direction');
await p.locator('.sheet').evaluateAll(es=>es.forEach(e=>e.hidden=false));await p.setViewportSize({width:1600,height:900});
await p.addStyleTag({content:'header{display:none}.slides main{padding:0} @page{size:1600px 900px;margin:0}'});await p.waitForTimeout(200);
const slideOverflow=await p.locator('.copy,h1,.content').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1).map(e=>e.className));if(slideOverflow.length)throw Error('Mongolian slide overflow: '+JSON.stringify(slideOverflow));
await p.pdf({path:path.join(root,'mongolian/slides.pdf'),preferCSSPageSize:true,printBackground:true,pageRanges:'1-8'});
for(let i=0;i<8;i++)await p.locator('.page').nth(i).screenshot({path:path.join(root,`mongolian/images/slide-${String(i+1).padStart(2,'0')}.png`)});
for(const mode of ['single','slides']){
await p.goto('file://'+path.join(root,'mongolian/index.html?mode='+mode));await p.waitForSelector('body[data-ready]');await p.keyboard.press('ArrowRight');if(!await p.locator('.sheet').nth(1).isVisible())throw Error('Mongolian next direction');await p.setViewportSize({width:390,height:844});await p.waitForTimeout(200);if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile horizontal overflow');
const aligned=await p.locator('.sheet:not([hidden])').evaluate(e=>{const a=e.getBoundingClientRect(),b=e.querySelector('.page').getBoundingClientRect();return Math.abs(a.left-b.left)<1&&Math.abs(a.width-b.width)<1});if(!aligned)throw Error('Mongolian canvas alignment');
}console.log('Navigation, mobile, portrait and landscape exports passed');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});

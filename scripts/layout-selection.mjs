import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {performance} from 'node:perf_hooks';

// Planning profiles, not assertions of rendered text capacity or exporter support.
export const profiles = [
  {id:'portrait-magazine-essay',jobs:['opening','reading'],orientation:'portrait',images:[0,1]},
  {id:'editorial-opener',jobs:['opening'],orientation:'portrait',images:[1,1]},
  {id:'editorial-image-break',jobs:['section'],orientation:'portrait',images:[1,1]},
  {id:'editorial-modular-rail',jobs:['reading'],orientation:'portrait',images:[0,3]},
  {id:'portrait-image-cover-pair',jobs:['opening'],orientation:'portrait',images:[1,1],sequence:true},
  {id:'L12',jobs:['reading'],orientation:'landscape',images:[0,0]},
  {id:'L09-B',jobs:['section'],orientation:'landscape',images:[1,1],frameRatio:6/5},
  {id:'caption-rail-gallery',jobs:['gallery'],orientation:'landscape',images:[2,4]},
  {id:'controlled-masonry-gallery',jobs:['gallery'],orientation:'landscape',images:[3,6]},
  {id:'strip-narrative-process',jobs:['process'],orientation:'landscape',images:[3,6]},
];

export function selectLayouts(brief) {
  if (!brief || !['opening','reading','section','gallery','process','comparison'].includes(brief.job)) throw new Error('Invalid page job');
  if (!brief.canvas || ![brief.canvas.width,brief.canvas.height].every(n=>Number.isFinite(n)&&n>0)) throw new Error('Positive canvas dimensions required');
  if (!['horizontal-ltr','vertical-rl','vertical-lr'].includes(brief.direction)) throw new Error('Explicit reading direction required');
  if (!Array.isArray(brief.blocks) || !brief.blocks.length) throw new Error('Source blocks required');
  const ids=new Set();
  for(const block of brief.blocks) {
    if(!block.id || ids.has(block.id) || typeof block.text!=='string') throw new Error('Unique block IDs and text required');
    ids.add(block.id);
  }
  const images=brief.images ?? [];
  if(!Array.isArray(images)) throw new Error('Images must be an array');
  const imageIds=new Set();
  for(const image of images) {
    if(!image.id || imageIds.has(image.id) || ![image.width,image.height].every(n=>Number.isFinite(n)&&n>0) || !['contain','crop'].includes(image.fit)) throw new Error('Images require unique IDs, dimensions and explicit contain/crop treatment');
    imageIds.add(image.id);
  }
  if(brief.requiredFeatures!==undefined && (!Array.isArray(brief.requiredFeatures)||brief.requiredFeatures.some(f=>typeof f!=='string'))) throw new Error('requiredFeatures must be strings');
  const orientation=brief.canvas.width>brief.canvas.height?'landscape':'portrait';
  const rejected=[],candidates=[];
  for(const profile of profiles) {
    const reasons=[];
    if(profile.orientation!==orientation) reasons.push('orientation mismatch');
    if(!profile.jobs.includes(brief.job)) reasons.push('page job mismatch');
    if(brief.direction!=='horizontal-ltr') reasons.push('vertical composition not reviewed in this profile');
    if(images.length<profile.images[0] || images.length>profile.images[1]) reasons.push('required image count outside profile');
    if(profile.sequence && brief.allowContinuation!==true) reasons.push('requires cover plus continuation');
    if(brief.requiredFeatures?.length) reasons.push(`unreviewed required features: ${brief.requiredFeatures.join(', ')}`);
    if(reasons.length) {rejected.push({id:profile.id,reasons});continue;}
    const adaptations=[];
    let score=100;
    if(profile.frameRatio && images[0]?.fit==='contain') {
      const ratio=images[0].width/images[0].height;
      const occupancy=Math.min(ratio/profile.frameRatio,profile.frameRatio/ratio);
      if(occupancy<0.8) {score-=25;adaptations.push('Use a ratio-matched image frame; preserve the complete image rather than stretching/cropping it.');}
    }
    if(profile.sequence) {score-=10;adaptations.push('Keep full article on continuation pages.');}
    candidates.push({id:profile.id,score,reasons:['page job, orientation and image count fit planning profile'],adaptations});
  }
  candidates.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  return {schemaVersion:1,status:candidates.length?'candidate-review-required':'original-required',
    scope:`${profiles.length} planning profiles; not the complete visual library`,
    candidates:candidates.slice(0,3),rejected,
    sourceCoverage:{blockIds:brief.blocks.map(b=>b.id),imageIds:images.map(i=>i.id),characters:brief.blocks.reduce((n,b)=>n+[...b.text].length,0)},
    next:candidates.length?'Render a difficult page with full source text, then verify fit and image treatment.':'Create a project-local composition preserving source IDs, reading order, image constraints and shared guide geometry.',
    validation:{rendered:false,textFit:'unverified',formatCompatibility:'unverified'}};
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {
    if(process.argv.length!==3) throw new Error('Usage: node scripts/layout-selection.mjs BRIEF.json');
    const start=performance.now();
    const brief=JSON.parse(readFileSync(process.argv[2],'utf8'));
    const readMs=performance.now()-start;
    const matchingStart=performance.now();
    const result=selectLayouts(brief);
    result.timingsMs={intake:readMs,matching:performance.now()-matchingStart};
    console.log(JSON.stringify(result,null,2));
  } catch(error) {console.error(error.message);process.exitCode=1;}
}

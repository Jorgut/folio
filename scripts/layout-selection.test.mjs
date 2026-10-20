import test from 'node:test';
import assert from 'node:assert/strict';
import {selectLayouts} from './layout-selection.mjs';
const brief={job:'reading',direction:'horizontal-ltr',canvas:{width:1280,height:720},blocks:[{id:'p1',text:'Full article. '.repeat(2000)}],images:[]};
test('article is preserved and matching does not claim rendered fit',()=>{
  const before=structuredClone(brief),result=selectLayouts(brief);
  assert.equal(result.candidates[0].id,'L12');assert.deepEqual(brief,before);
  assert.equal(result.sourceCoverage.characters,[...brief.blocks[0].text].length);
  assert.equal(result.validation.textFit,'unverified');
});
test('unsupported vertical direction and required features demand original composition',()=>{
  for(const patch of [{direction:'vertical-lr'},{requiredFeatures:['synchronized bilingual notes']}]) {
    const result=selectLayouts({...brief,...patch});
    assert.equal(result.status,'original-required');assert.equal(result.candidates.length,0);
    assert.ok(result.rejected.every(r=>r.reasons.length));
  }
});
test('uncropped panorama requires frame adaptation, not destructive crop',()=>{
  const result=selectLayouts({...brief,job:'section',images:[{id:'i1',width:9000,height:1000,fit:'contain'}]});
  assert.equal(result.candidates[0].id,'L09-B');assert.ok(result.candidates[0].adaptations.length);
});
test('invalid material is rejected rather than silently ignored',()=>{
  for(const patch of [{canvas:{width:0,height:720}},{blocks:[{id:'x',text:'a'},{id:'x',text:'b'}]},{images:[{id:'i',width:1,height:1}]}]) assert.throws(()=>selectLayouts({...brief,...patch}));
});

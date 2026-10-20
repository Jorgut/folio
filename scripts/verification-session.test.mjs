import test from 'node:test';
import assert from 'node:assert/strict';
import {withVerificationPage} from './verification-session.mjs';
function fixture(failNavigation=false) {
  const calls={launch:0,goto:0,close:0};
  const page={on(){},async goto(url){calls.goto++;assert.match(url,/file:/);if(failNavigation) throw new Error('navigation failed');},async waitForSelector(){}};
  const chromium={async launch(){calls.launch++;return {async newPage(){return page;},async close(){calls.close++;}};}};
  return {calls,page,chromium};
}
test('structure and text checks share a single navigation/session',async()=>{
  const f=fixture();let checks=0;
  await withVerificationPage(f.chromium,'example.html',async page=>{assert.equal(page,f.page);checks++;checks++;});
  assert.equal(checks,2);assert.deepEqual(f.calls,{launch:1,goto:1,close:1});
});
test('closes browser when navigation or validation fails',async()=>{
  for(const failNavigation of [true,false]) {
    const f=fixture(failNavigation);
    await assert.rejects(withVerificationPage(f.chromium,'example.html',()=>{throw new Error('validation failed');}),/failed/);
    assert.equal(f.calls.close,1);
  }
});

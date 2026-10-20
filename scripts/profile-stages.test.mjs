import test from 'node:test';
import assert from 'node:assert/strict';
import {profileStages} from './profile-stages.mjs';
const stage=(name,code)=>({name,command:[process.execPath,'-e',code],timeoutMs:2000});
test('records actual stage duration and exit status',()=>{
  const result=profileStages({stages:[stage('match','console.log("done")')]},process.cwd());
  assert.equal(result.status,'passed');assert.ok(result.stages[0].durationMs>0);assert.match(result.stages[0].stdout,/done/);
});
test('failure stops downstream stages',()=>{
  const result=profileStages({stages:[stage('bad','process.exit(2)'),stage('later','process.exit(0)')]},process.cwd());
  assert.equal(result.status,'failed');assert.equal(result.stages[1].status,'skipped');
});
test('deadline and missing outputs fail explicitly',()=>{
  const timeout=profileStages({stages:[{...stage('slow','setInterval(()=>{},100)'),timeoutMs:30}]},process.cwd());
  assert.equal(timeout.status,'failed');assert.match(timeout.stages[0].error,/ETIMEDOUT/);
  const absent=profileStages({stages:[{...stage('output',''),outputs:['missing-folio-test-output.invalid']}]},process.cwd());
  assert.equal(absent.status,'failed');
});
test('validates all stages before executing anything',()=>{
  assert.throws(()=>profileStages({stages:[stage('x',''),stage('x','')]},process.cwd()));
});

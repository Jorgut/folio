import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {EventEmitter} from 'node:events';
import {getRemoteManifest,fetchJson} from './check-update.mjs';

test('deadline covers a stalled response, not only socket inactivity',async()=>{
  const get=(_url,_options,callback)=>{
    const request=new EventEmitter();
    request.destroy=error=>request.emit('error',error);
    queueMicrotask(()=>{
      const response=new EventEmitter();
      response.statusCode=200;response.setEncoding=()=>{};
      callback(response);
      response.emit('data','{');
    });
    return request;
  };
  await assert.rejects(fetchJson('https://example.invalid',20,get),/deadline/);
});
test('synchronous request errors reject without waiting for the deadline',async()=>{
  await assert.rejects(fetchJson('bad-url',3000,()=>{throw new Error('invalid URL');}),/invalid URL/);
});

function fixture(t) {
  const dir=mkdtempSync(path.join(os.tmpdir(),'folio-update-'));
  t.after(()=>rmSync(dir,{recursive:true,force:true}));
  return path.join(dir,'cache.json');
}
const local={raw_manifest_url:'https://example.invalid/manifest.json'};
test('successful cache skips both manifest and remote git lookup',async t=>{
  const cacheFile=fixture(t);let fetches=0,shas=0;
  const options={cacheFile,now:1000,fetchManifest:async()=>{fetches++;return {version:'1.0.17'};},lookupSha:()=>{shas++;return 'abc';}};
  const first=await getRemoteManifest(local,options);
  const cached=await getRemoteManifest(local,{...options,now:2000});
  assert.equal(first.cacheUsed,false);assert.equal(cached.cacheUsed,true);
  assert.equal(cached.remoteSha,'abc');assert.equal(fetches,1);assert.equal(shas,1);
});
test('failure cache suppresses repeated requests, expires and refresh bypasses it',async t=>{
  const cacheFile=fixture(t);let calls=0;
  const options={cacheFile,now:1000,fetchManifest:async()=>{calls++;throw new Error('DNS unavailable');}};
  await assert.rejects(getRemoteManifest(local,options),/DNS/);
  await assert.rejects(getRemoteManifest(local,{...options,now:2000}),/retry deferred/);
  assert.equal(calls,1);
  await assert.rejects(getRemoteManifest(local,{...options,now:3000,refresh:true}),/DNS/);
  await assert.rejects(getRemoteManifest(local,{...options,now:304000}),/DNS/);
  assert.equal(calls,3);
});
test('cache is scoped to manifest URL and invalid versions are not accepted',async t=>{
  const cacheFile=fixture(t);
  writeFileSync(cacheFile,JSON.stringify({url:'https://other.invalid/',checkedAt:1000,remoteManifest:{version:'9.0.0'}}));
  await assert.rejects(getRemoteManifest(local,{cacheFile,now:2000,fetchManifest:async()=>({})}),/invalid remote/);
});
test('success expires and read-only cache does not fail the check',async t=>{
  const cacheFile=fixture(t);let calls=0;
  const options={cacheFile,now:1000,fetchManifest:async()=>{calls++;return {version:'1.0.17'};}};
  await getRemoteManifest(local,options);
  await getRemoteManifest(local,{...options,now:1801001});assert.equal(calls,2);
  await getRemoteManifest(local,{...options,cacheFile:path.join(cacheFile,'impossible.json')});
});
test('offline CLI explicitly leaves remote status unknown',()=>{
  const cli=fileURLToPath(new URL('./check-update.mjs',import.meta.url));
  const result=spawnSync(process.execPath,[cli,'--offline'],{encoding:'utf8',timeout:1500});
  assert.equal(result.status,0);assert.match(result.stdout,/remote status unknown/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {parseVerificationArgs} from './verification-options.mjs';
test('default verifies existing output without regeneration',()=>{
 const args=parseVerificationArgs(['example.html']);assert.equal(args.regenerate,false);assert.equal(args.htmlOnly,false);assert(args.pptx.endsWith('example.pptx'));
});
test('HTML-only avoids PPTX, explicit export requests regeneration',()=>{
 assert.equal(parseVerificationArgs(['example.html','--html-only']).htmlOnly,true);
 assert.equal(parseVerificationArgs(['example.html','--export']).regenerate,true);
 assert(parseVerificationArgs(['example.html','--pptx','custom.pptx']).pptx.endsWith('custom.pptx'));
});
test('ambiguous modes and invalid arguments fail early',()=>{
 for(const args of [['example.html','--html-only','--export'],['example.html','--pptx'],['example.html','--pptx','custom.pptx','--export'],['--other'],['input.pdf']])assert.throws(()=>parseVerificationArgs(args));
});

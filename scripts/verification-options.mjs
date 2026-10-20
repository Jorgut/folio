import path from 'node:path';

export function parseVerificationArgs(args) {
  let input, pptx, regenerate=false, htmlOnly=false;
  for(let i=0;i<args.length;i++) {
    const arg=args[i];
    if(arg==='--export') regenerate=true;
    else if(arg==='--html-only') htmlOnly=true;
    else if(arg==='--pptx') {
      pptx=args[++i];
      if(!pptx || pptx.startsWith('--')) throw new Error('--pptx requires an existing file path');
    } else if(arg.startsWith('--') || input) throw new Error(`Unknown argument: ${arg}`);
    else input=arg;
  }
  if(!input || !/\.html?$/i.test(input)) throw new Error('Expected an HTML input path');
  if(htmlOnly && (regenerate || pptx)) throw new Error('--html-only cannot be combined with PPTX options');
  if(regenerate && pptx) throw new Error('--export cannot be combined with --pptx');
  return {input:path.resolve(input),pptx:path.resolve(pptx || input.replace(/\.html?$/i,'.pptx')),regenerate,htmlOnly};
}

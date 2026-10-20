import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {performance} from 'node:perf_hooks';

// Runs only explicitly supplied commands, sequentially, with no shell expansion.
export function profileStages(plan,baseDir) {
  if(!Array.isArray(plan.stages)||!plan.stages.length) throw new Error('Nonempty stages required');
  const names=new Set();
  for(const stage of plan.stages) {
    if(!stage.name || names.has(stage.name) || !Array.isArray(stage.command) || !stage.command.length || stage.command.some(s=>typeof s!=='string') || !Number.isInteger(stage.timeoutMs) || stage.timeoutMs<1) throw new Error('Each stage needs a unique name, command array and positive integer timeoutMs');
    if(stage.outputs!==undefined && (!Array.isArray(stage.outputs)||stage.outputs.some(s=>typeof s!=='string'))) throw new Error('outputs must be paths');
    names.add(stage.name);
  }
  const started=performance.now(),stages=[];
  let failed=false;
  for(const stage of plan.stages) {
    if(failed) {stages.push({name:stage.name,status:'skipped',reason:'previous stage failed'});continue;}
    const start=performance.now();
    const result=spawnSync(stage.command[0],stage.command.slice(1),{cwd:baseDir,timeout:stage.timeoutMs,encoding:'utf8',maxBuffer:1024*1024});
    const missingOutputs=(stage.outputs??[]).filter(file=>!existsSync(path.resolve(baseDir,file)));
    failed=Boolean(result.error || result.status!==0 || missingOutputs.length);
    stages.push({name:stage.name,status:failed?'failed':'passed',durationMs:performance.now()-start,exitCode:result.status,signal:result.signal,error:result.error?.message,missingOutputs,
      stdout:result.stdout??'',stderr:result.stderr??''});
  }
  return {schemaVersion:1,status:failed?'failed':'passed',durationMs:performance.now()-started,stages,
    limitation:'Measures these commands only, not agent thinking, interactive authoring, visual quality or target-app compatibility. Existing output presence is not proof of regeneration.'};
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {
    if(process.argv.length!==4) throw new Error('Usage: node scripts/profile-stages.mjs PLAN.json REPORT.json');
    const planPath=path.resolve(process.argv[2]),output=path.resolve(process.argv[3]);
    if(planPath===output) throw new Error('Report must not overwrite the plan');
    if(existsSync(output)) throw new Error('Preserve existing report; choose a new report path');
    const report=profileStages(JSON.parse(readFileSync(planPath,'utf8')),path.dirname(planPath));
    writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
    console.log(`${report.status}: ${report.stages.length} stages, ${report.durationMs.toFixed(1)} ms`);
    if(report.status==='failed') process.exitCode=1;
  } catch(error) {console.error(error.message);process.exitCode=1;}
}

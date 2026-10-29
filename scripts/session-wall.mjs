import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
const statePath='context-vault/session-state.json';
const state=JSON.parse(await readFile(statePath,'utf8'));
if(state.formatVersion!==1||typeof state.activeFeature!=='string'||!state.activeFeature||typeof state.sessionId!=='string'||!state.sessionId||!state.objective)throw new Error('Invalid session state: one named feature and objective are required');
if(!Array.isArray(state.acceptance)||!state.acceptance.length||!Array.isArray(state.nextActions)||!state.nextActions.length)throw new Error('Acceptance criteria and ordered next actions are required');
for(const item of state.acceptance)if(!['pending','passed','failed','blocked'].includes(item.status)||!item.evidence)throw new Error(`Invalid acceptance record ${item.id}`);
const run=(cmd,args,options={})=>spawnSync(cmd,args,{encoding:'utf8',...options});
if(process.argv.includes('--verify')){
 const sync=run(process.execPath,['scripts/sync-context-vault.mjs']);if(sync.status!==0)throw new Error('Context inventory failed');
 const folder=await mkdtemp(path.join(os.tmpdir(),'proconsulting-session-checks-'));state.checks=[];
 for(const name of ['typecheck','test','build']){
  console.log(`Checking ${name}…`);const result=run('npm',['run',name]);const log=path.join(folder,`${name}.log`);await writeFile(log,(result.stdout??'')+(result.stderr??''),{mode:0o600});
  state.checks.push({command:`npm run ${name}`,status:result.status===0?'passed':'failed',exitCode:result.status,checkedAt:new Date().toISOString(),log});
  console.log(`${name}: ${result.status===0?'passed':'FAILED'}; log ${log}`);
 }
 const inventory=await readFile('context-vault/source-inventory.json');state.verifiedSourceFingerprint=createHash('sha256').update(inventory).digest('hex');
 if(state.checks.some(c=>c.status==='failed'))process.exitCode=1;
}
let currentFingerprint;try{currentFingerprint=createHash('sha256').update(await readFile('context-vault/source-inventory.json')).digest('hex');}catch{}
const stale=!currentFingerprint||!state.verifiedSourceFingerprint||state.verifiedSourceFingerprint!==currentFingerprint;
if(state.sessionStatus==='completed'&&(state.acceptance.some(a=>a.status!=='passed')||stale||!state.checks.length||state.checks.some(c=>c.status!=='passed')))throw new Error('Cannot complete session: acceptance or current-source verification is incomplete');
state.updatedAt=new Date().toISOString();await writeFile(statePath,JSON.stringify(state,null,2)+'\n');
const acceptance=state.acceptance.map(a=>`| ${a.id} | ${a.description} | ${a.status} | ${a.evidence.replaceAll('|','/')} |`).join('\n');
const actions=[...state.nextActions].sort((a,b)=>a.order-b.order).map(a=>`${a.order}. ${a.action}\n   Files: ${a.files.map(f=>'`'+f+'`').join(', ')}`).join('\n\n');
const checks=state.checks.length?state.checks.map(c=>`- **${c.status}**: \`${c.command}\` (${c.checkedAt}); local log: \`${c.log}\``).join('\n'):'No checks recorded for this checkpoint.';
const wall=`---\ntags: [session, continuation, active]\n---\n# Session wall\n\nGenerated from \`session-state.json\` by \`npm run session:status\`. Edit that structured record, then regenerate this note. Human decisions and detailed history belong in [[Sessions/${state.sessionId}]].\n\n## Resume here\n\n**Session:** ${state.sessionId}\n\n**Active feature:** ${state.activeFeature}\n\n**State:** ${state.sessionStatus}\n\n**Objective:** ${state.objective}\n\n${state.sessionStatus === "completed" ? "This feature is complete. On **continue**, start the next bounded session named in Exact next actions; preserve this feature's evidence and do not redo completed checks without a reason." : "A user saying **continue** means resume this feature's next unfinished acceptance check. Do not start unrelated modules or repeat completed infrastructure work."} Verify current files and drift before trusting the checkpoint.\n\n## In scope\n\n${state.scope.map(s=>'- '+s).join('\n')}\n\n## Out of scope\n\n${state.outOfScope.map(s=>'- '+s).join('\n')}\n\n## Acceptance checks\n\n| ID | Check | Status | Evidence or exact gap |\n| --- | --- | --- | --- |\n${acceptance}\n\n## Exact next actions\n\n${actions}\n\n## Known risks and unfinished work\n\n${state.knownRisks.map(s=>'- '+s).join('\n')}\n\n## Verification\n\n${checks}\n\nSource inventory matches verified checkpoint: **${stale?'NO / not yet verified':'yes'}**. Passing general checks does not automatically complete feature acceptance.\n\n## External state\n\n${Object.entries(state.externalState).map(([k,v])=>'- **'+k+'**: '+v).join('\n')}\n\n[[Feature Ledger]] · [[03 Implementation Status]] · [[05 Maintenance]]\n`;
await writeFile('context-vault/Session Wall.md',wall);
console.log(`Session ${state.sessionId}: ${state.activeFeature}; ${state.acceptance.filter(a=>a.status==='passed').length}/${state.acceptance.length} acceptance checks passed. Resume context-vault/Session Wall.md.`);

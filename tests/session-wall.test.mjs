import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const script=fileURLToPath(new URL('../scripts/session-wall.mjs',import.meta.url));
const sample=()=>({formatVersion:1,activeFeature:'TEST-01',sessionId:'synthetic-session',objective:'Verify checkpoint integrity',sessionStatus:'checkpointed',acceptance:[{id:'A',description:'Specific check',status:'pending',evidence:'Not tested'}],scope:['One feature'],outOfScope:['Other work'],nextActions:[{order:1,action:'Run the specific acceptance test',files:['synthetic.ts']}],knownRisks:[],checks:[],externalState:{deployment:'not performed'}});
async function fixture(work){const root=await mkdtemp(path.join(os.tmpdir(),'pc-session-test-'));await mkdir(path.join(root,'context-vault'));try{await work(root);}finally{await rm(root,{recursive:true,force:true});}}
test('session wall preserves pending work and renders exact continuation',async()=>fixture(async root=>{await writeFile(path.join(root,'context-vault/session-state.json'),JSON.stringify(sample()));const result=spawnSync(process.execPath,[script],{cwd:root,encoding:'utf8'});assert.equal(result.status,0,result.stderr);const wall=await readFile(path.join(root,'context-vault/Session Wall.md'),'utf8');assert.ok(wall.includes('TEST-01'));assert.ok(wall.includes('Run the specific acceptance test'));assert.ok(wall.includes('NO / not yet verified'));}));
test('session wall refuses completion without acceptance and source verification',async()=>fixture(async root=>{const state=sample();state.sessionStatus='completed';const file=path.join(root,'context-vault/session-state.json');await writeFile(file,JSON.stringify(state));const result=spawnSync(process.execPath,[script],{cwd:root,encoding:'utf8'});assert.notEqual(result.status,0);assert.ok(result.stderr.includes('Cannot complete session'));assert.equal((JSON.parse(await readFile(file,'utf8'))).acceptance[0].status,'pending');}));

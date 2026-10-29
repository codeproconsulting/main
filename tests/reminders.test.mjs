import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {remindDueTasks,reminderId} from '../scripts/remind-tasks.mjs';
import {runReminderLoop} from '../scripts/reminder-runner.mjs';
const now='2030-01-01T12:00:00.000Z';
const hash=key=>createHash('sha256').update(key).digest('hex').slice(0,32);
const task=(id='task-one',changes={})=>({$id:id,leadId:'lead-one',owner:'counselor-one',status:'Open',title:'Synthetic follow-up',dueAt:'2030-01-01T11:00:00.000Z',version:1,...changes});
function fixture(tasks=[task()]){
 const stores={tasks:new Map(tasks.map(row=>[row.$id,row])),leads:new Map([['lead-one',{$id:'lead-one',owner:'counselor-one',stage:'New'}]]),staff:new Map([['counselor-one',{$id:'counselor-one',role:'counselor',active:true}]]),notifications:new Map(),locks:new Map(),worker_health:new Map()},calls=[],errors=[];
 let beforeNotification=false,afterNotification=false,afterList=null,failQuery=false,failHealth=false,releaseFailure=false,signal;
 const failure=status=>Object.assign(new Error('Synthetic failure'),{status});
 const api=async(path,method='GET',payload)=>{
  const [,collection,id]=path.match(/\/collections\/(\w+)\/documents(?:\/([^/]+))?$/)||[],store=stores[collection];if(!store)throw new Error('Unexpected collection');calls.push({collection,id,method});
  if(collection==='worker_health'&&failHealth)throw failure(503);
  if(method==='GET'){if(!store.has(id))throw failure(404);return structuredClone(store.get(id));}
  if(method==='POST'){
   assert.deepEqual(payload.permissions,[]);if(store.has(payload.documentId))throw failure(409);
   if(collection==='notifications'&&beforeNotification){beforeNotification=false;throw failure(503);}
   const row={$id:payload.documentId,...structuredClone(payload.data)};store.set(row.$id,row);
   if(collection==='notifications'&&afterNotification){afterNotification=false;throw failure(503);}return structuredClone(row);
  }
  if(method==='PATCH'){if(!store.has(id))throw failure(404);const row={...store.get(id),...structuredClone(payload.data)};store.set(id,row);return structuredClone(row);}
  if(method==='DELETE'){if(releaseFailure&&collection==='locks')throw failure(503);store.delete(id);return;}
 };
 const allDocuments=async(collection,queries)=>{
  assert.equal(collection,'tasks');if(failQuery)throw failure(503);assert.ok(queries.map(JSON.parse).some(q=>q.method==='equal'&&q.attribute==='status'&&q.values[0]==='Open'));
  const rows=[...stores.tasks.values()].filter(t=>t.status==='Open'&&t.dueAt<=now).map(t=>structuredClone(t));if(afterList){afterList(stores);afterList=null;}return rows;
 };
 return {stores,calls,errors,setSignal:value=>signal=value,run:()=>remindDueTasks({api,allDocuments,databaseId:'synthetic',now,clock:()=>now,onError:event=>errors.push(event),signal}),failBefore:()=>beforeNotification=true,loseAck:()=>afterNotification=true,afterList:fn=>afterList=fn,failQuery:()=>failQuery=true,failHealth:()=>failHealth=true,failRelease:()=>releaseFailure=true};
}
test('due task is delivered once with private metadata and remains read across retry/restart',async()=>{
 const f=fixture([task(),task('future',{dueAt:'2031-01-01T00:00:00.000Z'})]);let result=await f.run();assert.equal(result.created,1);assert.equal(f.stores.notifications.size,1);const notice=[...f.stores.notifications.values()][0];assert.equal(notice.read,false);assert.equal(notice.sourceId,'task-one');assert.equal(notice.sourceVersion,1);assert.equal(notice.recipient,'counselor-one');assert.equal(f.stores.worker_health.get('reminders').status,'healthy');notice.read=true;
 result=await f.run();assert.equal(result.created,0);assert.equal(result.duplicate,1);assert.equal(f.stores.notifications.get(notice.$id).read,true);assert.equal(f.stores.locks.size,0);
});
test('worker rechecks completion, cancellation, future rescheduling and deleted source after candidate query',async()=>{
 for(const change of [{status:'Completed'},{status:'Cancelled'},{dueAt:'2031-01-01T00:00:00.000Z',version:2},null]){const f=fixture();f.afterList(stores=>change?stores.tasks.set('task-one',{...stores.tasks.get('task-one'),...change}):stores.tasks.delete('task-one'));const result=await f.run();assert.equal(result.created,0);assert.equal(result.skipped,1);}
});
test('reassignment uses current lead and task owner; partial transfer does not expose a reminder',async()=>{
 for(const consistent of [true,false]){const f=fixture();f.afterList(stores=>{stores.staff.set('counselor-two',{$id:'counselor-two',role:'counselor',active:true});stores.leads.get('lead-one').owner='counselor-two';if(consistent)Object.assign(stores.tasks.get('task-one'),{owner:'counselor-two',version:2});});const result=await f.run();assert.equal(result.created,consistent?1:0);if(consistent)assert.equal([...f.stores.notifications.values()][0].recipient,'counselor-two');}
});
test('inactive/non-CRM assignees, closed/unassigned/deleted leads and invalid tasks are skipped',async()=>{
 const mutations=[s=>s.staff.get('counselor-one').active=false,s=>s.staff.get('counselor-one').role='editor',s=>s.staff.clear(),s=>s.leads.get('lead-one').stage='Archived',s=>s.leads.get('lead-one').owner='',s=>s.leads.clear(),s=>s.tasks.get('task-one').dueAt='',s=>s.tasks.get('task-one').version=0];
 for(const mutate of mutations){const f=fixture();f.afterList(mutate);assert.equal((await f.run()).created,0);assert.equal(f.stores.notifications.size,0);}
});
test('write failure retries on next cycle; lost acknowledgment does not duplicate the durable notice',async()=>{
 for(const mode of ['failBefore','loseAck']){const f=fixture();f[mode]();assert.equal((await f.run()).failed,1);assert.equal(f.stores.worker_health.get('reminders').status,'degraded');await f.run();assert.equal(f.stores.notifications.size,1);assert.equal(f.stores.worker_health.get('reminders').status,'healthy');assert.equal(f.stores.locks.size,0);}
});
test('failure on one task does not prevent another task from being delivered',async()=>{
 const f=fixture([task(),task('second')]);f.failBefore();const result=await f.run();assert.equal(result.failed,1);assert.equal(result.created,1);assert.equal(f.errors.length,1);assert.deepEqual(Object.keys(f.errors[0]).sort(),['id','status']);
});
test('concurrent cycles serialize through one private worker lock without flooding',async()=>{
 const f=fixture();const result=await Promise.all([f.run(),f.run()]);assert.equal(f.stores.notifications.size,1);assert.equal(result.filter(r=>r.contended).length,1);assert.equal(f.stores.locks.size,0);
});
test('crash-left global lock fails closed; controlled operator removal allows retry',async()=>{
 const f=fixture(),id=hash('worker:reminders');f.stores.locks.set(id,{$id:id,owner:'crashed',key:'worker:reminders',acquiredAt:'2020-01-01T00:00:00.000Z'});assert.equal((await f.run()).contended,true);assert.equal(f.stores.notifications.size,0);assert.equal(f.stores.locks.get(id).owner,'crashed');f.stores.locks.delete(id);assert.equal((await f.run()).created,1);
});
test('crash-left lead lock records a degraded cycle while unrelated leads can progress',async()=>{
 const f=fixture();f.stores.locks.set(hash('lead:lead-one'),{owner:'crashed'});const result=await f.run();assert.equal(result.failed,1);assert.equal(result.created,0);assert.equal(f.stores.worker_health.get('reminders').status,'degraded');assert.equal(f.errors[0].status,'lead_lock_busy');
});
test('query failure records failed health, while heartbeat failure prevents delivery',async()=>{
 const f=fixture();f.failQuery();await assert.rejects(()=>f.run());assert.equal(f.stores.worker_health.get('reminders').status,'failed');assert.equal(f.stores.locks.size,0);
 const other=fixture();other.failHealth();await assert.rejects(()=>other.run());assert.equal(other.stores.notifications.size,0);assert.equal(other.stores.locks.size,0);
});
test('dedup conflicts with mismatched recipients fail rather than suppressing an alert silently',async()=>{
 const f=fixture();f.stores.notifications.set(reminderId(task()),{$id:reminderId(task()),recipient:'other',sourceId:'task-one'});const result=await f.run();assert.equal(result.failed,1);assert.equal(result.duplicate,0);
});
test('rescheduled due tasks get a fresh key and the worker never visits publishing/cases/appointments',async()=>{
 const f=fixture();await f.run();Object.assign(f.stores.tasks.get('task-one'),{dueAt:'2030-01-01T11:30:00.000Z',version:2});await f.run();assert.equal(f.stores.notifications.size,2);assert.ok(f.calls.every(c=>!['posts','cases','appointments'].includes(c.collection)));
});
test('failed lock release preserves the lock; the next cycle cannot take it over',async()=>{
 const f=fixture();f.failRelease();await assert.rejects(()=>f.run());assert.equal((await f.run()).contended,true);assert.ok(f.stores.locks.size>0);
});
test('runner wakes immediately on shutdown and does not start another cycle',async()=>{
 const controller=new AbortController();let cycles=0;const running=runReminderLoop({cycle:async()=>{cycles++;},signal:controller.signal,interval:60000});await new Promise(resolve=>setTimeout(resolve,5));controller.abort();await running;assert.equal(cycles,1);
});
test('runner retries failures, waits for in-flight work on stop, and --once surfaces errors',async()=>{
 const controller=new AbortController();let attempts=0,errors=0;await runReminderLoop({cycle:async()=>{attempts++;if(attempts===1)throw new Error('synthetic');controller.abort();},signal:controller.signal,interval:1,onError:()=>errors++});assert.equal(attempts,2);assert.equal(errors,1);
 const stop=new AbortController();let release,finished=false;const gate=new Promise(resolve=>release=resolve),running=runReminderLoop({cycle:async()=>{await gate;finished=true;},signal:stop.signal});stop.abort();assert.equal(finished,false);release();await running;assert.equal(finished,true);
 await assert.rejects(()=>runReminderLoop({cycle:async()=>{throw new Error('synthetic');},once:true,signal:new AbortController().signal}));
});

test('worker stops between tasks and releases its cycle lock without claiming a successful full cycle',async()=>{
 const controller=new AbortController(),f=fixture();f.setSignal(controller.signal);f.afterList(()=>controller.abort());const result=await f.run();assert.equal(result.stopped,true);assert.equal(result.created,0);assert.equal(f.stores.locks.size,0);assert.equal(f.stores.worker_health.get('reminders').status,'stopped');assert.equal(f.stores.worker_health.get('reminders').lastSuccessAt,undefined);
});
test('already stopped worker performs no I/O',async()=>{const controller=new AbortController();controller.abort();const f=fixture();f.setSignal(controller.signal);assert.equal((await f.run()).stopped,true);assert.equal(f.calls.length,0);});

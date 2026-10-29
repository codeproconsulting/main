import {api,loadEnvironment,allDocuments} from './appwrite-client.mjs';
import {remindDueTasks} from './remind-tasks.mjs';
import {runReminderLoop} from './reminder-runner.mjs';
loadEnvironment();
const controller=new AbortController();
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>controller.abort());
async function tick(){
 const result=await remindDueTasks({api,allDocuments,databaseId:process.env.APPWRITE_DATABASE_ID,signal:controller.signal,onError:({id,status})=>console.error('Task reminder needs attention:',id,status)});
 console.log(JSON.stringify({at:new Date().toISOString(),...result}));
 return result;
}
try{const result=await runReminderLoop({cycle:tick,once:process.argv.includes('--once'),signal:controller.signal,onError:()=>console.error('Task reminder cycle unavailable; retrying in 60 seconds.')});if(result&&(result.failed||result.contended))process.exitCode=1;}
catch{console.error('Task reminder cycle failed; inspect worker health and locks.');process.exitCode=1;}

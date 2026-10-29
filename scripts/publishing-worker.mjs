import {api,allDocuments,loadEnvironment} from './appwrite-client.mjs';
import {publishScheduledPosts} from './publish-scheduled.mjs';
loadEnvironment();
async function cycle(){const result=await publishScheduledPosts({api,allDocuments,databaseId:process.env.APPWRITE_DATABASE_ID,onError:({id,status})=>console.error('Scheduled publication needs attention:',id,status)});console.log(JSON.stringify({at:new Date().toISOString(),...result}));}
if(process.argv.includes('--once'))await cycle();else{
 let stopped=false,wake;const stop=()=>{stopped=true;wake?.();};process.on('SIGTERM',stop);process.on('SIGINT',stop);
 while(!stopped){try{await cycle();}catch{console.error('Scheduled publishing cycle unavailable; will retry.');}if(!stopped)await new Promise(resolve=>{const timer=setTimeout(resolve,60000);wake=()=>{clearTimeout(timer);resolve();};});}
}

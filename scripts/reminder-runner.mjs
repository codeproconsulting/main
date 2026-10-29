// Injectable wait/stop handling makes worker shutdown independently verifiable.
export async function runReminderLoop({cycle,once=false,signal,interval=60000,onError=()=>{}}){
 if(once)return cycle();
 while(!signal.aborted){
  try{await cycle();}catch{onError();}
  if(signal.aborted)break;
  await new Promise(resolve=>{
   const wake=()=>{clearTimeout(timer);signal.removeEventListener('abort',wake);resolve();};
   const timer=setTimeout(wake,interval);signal.addEventListener('abort',wake,{once:true});
   if(signal.aborted)wake();
  });
 }
}

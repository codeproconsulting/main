import { createServer } from 'node:net';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';

// Short path for the Unix socket. This fixture never invokes or impersonates a deployed scanner.
export async function documentScanner(verdict) {
 const directory=await mkdtemp('/tmp/pro-doc-test-');
 const path=join(directory,'scan.sock');
 const command=Buffer.from('zINSTREAM\0');
 const headerLength=command.length+4;
 const server=createServer(socket=>{
  const chunks=[];
  let size=0;
  socket.on('error',()=>socket.destroy());
  socket.on('data',chunk=>{
   chunks.push(chunk);
   size+=chunk.length;
   if(size<headerLength)return;
   const first=Buffer.concat(chunks,headerLength);
   const length=first.readUInt32BE(command.length);
   if(size<headerLength+4+length)return;
   const input=Buffer.concat(chunks);
   if(!input.subarray(0,command.length).equals(command)||input.length!==headerLength+4+length||input.readUInt32BE(headerLength+length)!==0){
    return socket.end('stream: malformed ERROR\0');
   }
   const reply=verdict(input.subarray(headerLength,headerLength+length));
   socket.end(reply);
  });
 });
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(path,resolve);});
 }catch(error){await rm(directory,{recursive:true,force:true});throw error;}
 return {path,async close(){await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));await rm(directory,{recursive:true,force:true});}};
}

export async function boundedBody(request: Request, max: number, label: string) {
 if(Number(request.headers.get("Content-Length"))>max)throw new Response(`${label} request is too large`,{status:413});
 const reader=request.body?.getReader();if(!reader)return new Blob();
 const chunks:Uint8Array<ArrayBuffer>[]=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){void reader.cancel().catch(()=>undefined);throw new Response(`${label} request is too large`,{status:413});}chunks.push(new Uint8Array(value));}}
 finally{reader.releaseLock();}
 return new Blob(chunks);
}

import {createHash} from "node:crypto";
import {appwrite} from "~/lib/appwrite.server";
export const privateBucket=()=>process.env.APPWRITE_DOCUMENT_BUCKET||"crm-documents";
export const mediaBucket=()=>process.env.APPWRITE_MEDIA_BUCKET||"crm-media";
export async function storageRequest(path:string,method="GET",body?:FormData,extraHeaders:Record<string,string>={}){
 const response=await fetch(`${process.env.APPWRITE_ENDPOINT?.replace(/\/$/, "")}${path}`,{method,headers:{"X-Appwrite-Project":process.env.APPWRITE_PROJECT_ID!,"X-Appwrite-Key":process.env.APPWRITE_API_KEY!,...extraHeaders},body,redirect:"error",signal:AbortSignal.timeout(45000)});
 if(!response.ok)throw new Response("File storage is temporarily unavailable",{status:503});return response;
}
export function fileSignature(bytes:Uint8Array,type:string){
 const hex=Buffer.from(bytes.slice(0,12)).toString("hex");
 return type==="application/pdf"?Buffer.from(bytes.slice(0,5)).toString()==="%PDF-":type==="image/png"?hex.startsWith("89504e470d0a1a0a"):type==="image/jpeg"?hex.startsWith("ffd8ff"):type==="image/webp"?Buffer.from(bytes.slice(0,4)).toString()==="RIFF"&&Buffer.from(bytes.slice(8,12)).toString()==="WEBP":false;
}
export async function uploadFile(bucket:string,file:File,maxSize:number,fileId=crypto.randomUUID()){
 if(!file.size||file.size>maxSize)throw new Response("The selected file exceeds the allowed size.",{status:400});
 const bytes=new Uint8Array(await file.arrayBuffer());if(!fileSignature(bytes,file.type))throw new Response("Only valid PDF, JPEG, PNG, or WebP files are supported.",{status:400});
 const chunkSize=5*1024*1024;
 const name=file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(-180);
 for(let offset=0;offset<bytes.length;offset+=chunkSize){
  const end=Math.min(offset+chunkSize,bytes.length);
  const form=new FormData();
  form.set("fileId",fileId);
  form.set("file",new File([bytes.subarray(offset,end)],name,{type:file.type}));
  const headers:Record<string,string>={};
  if(bytes.length>chunkSize)headers["Content-Range"]=`bytes ${offset}-${end-1}/${bytes.length}`;
  if(offset)headers["X-Appwrite-ID"]=fileId;
  const response=await storageRequest(`/storage/buckets/${encodeURIComponent(bucket)}/files`,"POST",form,headers);
  const stored=await response.json();
  if(stored.$id!==fileId || (bytes.length>chunkSize && end===bytes.length &&
     (stored.chunksUploaded!==stored.chunksTotal || stored.sizeOriginal!==bytes.length))){
   throw new Response("File storage could not confirm the upload",{status:503});
  }
 }
 return {fileId,checksum:createHash("sha256").update(bytes).digest("hex")};
}
export const removeFile=(bucket:string,id:string)=>appwrite(`/storage/buckets/${bucket}/files/${encodeURIComponent(id)}`,{method:"DELETE"});
export async function downloadFile(bucket:string,id:string,name:string){const stored=await storageRequest(`/storage/buckets/${bucket}/files/${encodeURIComponent(id)}/download`);return new Response(stored.body,{headers:{"Content-Type":"application/octet-stream","Content-Disposition":`attachment; filename="${name.replace(/[^a-zA-Z0-9._-]/g,"_")}"`,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});}

// Bound multipart buffering even when a caller omits/spoofs Content-Length.
export async function boundedUploadForm(request:Request,max:number,label:string){
 if(Number(request.headers.get("Content-Length"))>max)throw new Response(`${label} request is too large`,{status:413});
 if(!request.headers.get("Content-Type")?.startsWith("multipart/form-data")&&!request.headers.get("Content-Type")?.startsWith("application/x-www-form-urlencoded"))throw new Response(`Invalid ${label.toLowerCase()} form`,{status:400});
 const reader=request.body?.getReader();if(!reader)throw new Response(`Empty ${label.toLowerCase()} form`,{status:400});
 const chunks:Uint8Array<ArrayBuffer>[]=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){void reader.cancel().catch(()=>undefined);throw new Response(`${label} request is too large`,{status:413});}chunks.push(new Uint8Array(value));}}
 finally{reader.releaseLock();}
 try{return await new Response(new Blob(chunks),{headers:{"Content-Type":request.headers.get("Content-Type")!}}).formData();}
 catch{throw new Response(`Invalid ${label.toLowerCase()} form`,{status:400});}
}

import {api,loadEnvironment} from './appwrite-client.mjs';
loadEnvironment();const apply=process.argv.includes('--apply');
for(const [id,name,extensions,max] of [[process.env.APPWRITE_DOCUMENT_BUCKET||'crm-documents','Private client documents',['pdf','jpg','jpeg','png','webp'],20*1024*1024],[process.env.APPWRITE_MEDIA_BUCKET||'crm-media','Editorial media',['jpg','jpeg','png','webp'],5*1024*1024]]){
 try{const bucket=await api(`/storage/buckets/${id}`);if(bucket.$permissions?.length)throw new Error(`${id} has public permissions; review manually`);console.log(`${id}: private bucket exists`);}
 catch(error){if(error.status!==404)throw error;if(apply){await api('/storage/buckets','POST',{bucketId:id,name,permissions:[],fileSecurity:true,enabled:true,maximumFileSize:max,allowedFileExtensions:extensions,encryption:true,antivirus:true});console.log(`${id}: private bucket created with antivirus enabled`);}else console.log(`${id}: would create private bucket`);}
}

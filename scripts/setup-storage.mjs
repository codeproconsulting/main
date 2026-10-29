import {api,loadEnvironment} from './appwrite-client.mjs';
loadEnvironment();const apply=process.argv.includes('--apply');
const only=process.argv.find(arg=>arg.startsWith('--only='))?.slice(7);
if(only&&!['media','documents'].includes(only))throw new Error('Use --only=media or --only=documents');
for(const [kind,id,name,extensions,max] of [['documents',process.env.APPWRITE_DOCUMENT_BUCKET||'crm-documents','Private client documents',['pdf','jpg','jpeg','png','webp'],20*1024*1024],['media',process.env.APPWRITE_MEDIA_BUCKET||'crm-media','Editorial media',['jpg','jpeg','png','webp'],5*1024*1024]]){
 if(only&&kind!==only)continue;
 try{
  const bucket=await api(`/storage/buckets/${id}`);
  if(bucket.$permissions?.length||!Array.isArray(bucket.$permissions)||!bucket.fileSecurity||!bucket.enabled||!bucket.encryption||!bucket.antivirus||bucket.maximumFileSize!==max||!Array.isArray(bucket.allowedFileExtensions)||bucket.allowedFileExtensions.length!==extensions.length||extensions.some(ext=>!bucket.allowedFileExtensions.includes(ext)))throw new Error(`${id}: bucket security/limits differ; review manually (no automatic replacement)`);
  console.log(`${id}: private bucket configuration verified; actual file operations require a separate check`);
 }catch(error){if(error.status!==404)throw error;if(apply){await api('/storage/buckets','POST',{bucketId:id,name,permissions:[],fileSecurity:true,enabled:true,maximumFileSize:max,allowedFileExtensions:extensions,encryption:true,antivirus:true});console.log(`${id}: private bucket created with antivirus enabled`);}else console.log(`${id}: would create private bucket`);}
}

import {createHash,randomUUID} from 'node:crypto';
import {safeArticle,hasArticleContent} from '../app/lib/article-html.ts';
const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,32);
const query=(method,attribute,values)=>JSON.stringify({method,attribute,values});
// Dependency injection keeps tests independent of production credentials and data.
export async function publishScheduledPosts({api,allDocuments,databaseId,now=new Date().toISOString(),onError=()=>{}}){
 const base=`/databases/${encodeURIComponent(databaseId)}/collections`;
 const candidates=await allDocuments('posts',[query('equal','status',['scheduled']),query('lessThanEqual','publishedAt',[now])]);
 const summary={checked:candidates.length,published:0,skipped:0,failed:0};
 for(const candidate of candidates){
  const key=`post:${candidate.$id}`,lockId=hash(key),owner=`publisher-${randomUUID()}`;let acquired=false;
  try{
   try{await api(`${base}/locks/documents`,'POST',{documentId:lockId,data:{key,owner,acquiredAt:now},permissions:[]});acquired=true;}catch(error){if(error.status===409){summary.skipped++;continue;}throw error;}
   const current=await api(`${base}/posts/documents/${candidate.$id}`);
   if(current.status!=='scheduled'||!current.publishedAt||Date.parse(current.publishedAt)>Date.parse(now)){summary.skipped++;continue;}
   const body=safeArticle(current.body||'');
   if(!Number.isFinite(Date.parse(current.publishedAt))||!hasArticleContent(body))throw new Error('Invalid scheduled content or timestamp');
   const snapshot={postId:current.$id,actor:'system',payload:JSON.stringify(current),version:current.version};
   if(snapshot.payload.length>1000000)throw new Error('Revision exceeds safe size');
   const revisionId=hash(`revision:${current.$id}:${current.version}`);
   try{await api(`${base}/revisions/documents`,'POST',{documentId:revisionId,data:snapshot,permissions:[]});}
   catch(error){if(error.status!==409)throw error;const saved=await api(`${base}/revisions/documents/${revisionId}`);if(saved.postId!==current.$id||saved.version!==current.version||saved.payload!==snapshot.payload)throw new Error('Revision conflict');}
   const eventId=hash(`scheduled-publication:${current.$id}:${current.version}`);
   const details={state:'pending',fromVersion:current.version,toVersion:current.version+1,publishedAt:current.publishedAt};
   try{await api(`${base}/activities/documents`,'POST',{documentId:eventId,data:{actor:'system',entityId:current.$id,entityType:'post',event:'Scheduled publication requested',details:JSON.stringify(details)},permissions:[]});}catch(error){if(error.status!==409)throw error;}
   await api(`${base}/posts/documents/${current.$id}`,'PATCH',{data:{status:'published',body,version:current.version+1}});
   summary.published++;
   await api(`${base}/activities/documents/${eventId}`,'PATCH',{data:{event:'Post published on schedule',details:JSON.stringify({...details,state:'completed'})}});
  }catch(error){summary.failed++;onError({id:candidate.$id,status:error.status??'operation_failed'});}
  finally{
   if(acquired){
    try{const lock=await api(`${base}/locks/documents/${lockId}`);if(lock.owner===owner)await api(`${base}/locks/documents/${lockId}`,'DELETE');}
    catch(error){if(error.status!==404){summary.failed++;onError({id:candidate.$id,status:'lock_release_failed'});}}
   }
  }
 }
 return summary;
}

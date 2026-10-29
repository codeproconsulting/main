import {writeFile,mkdir} from 'node:fs/promises';
import {api,allDocuments,loadEnvironment} from './appwrite-client.mjs';
import {createHash} from 'node:crypto';
import {safeArticle} from '../app/lib/article-html.ts';
loadEnvironment();
const sources=await allDocuments('content_sources'),posts=await allDocuments('posts');const byId=new Map(posts.map(p=>[p.legacyId,p])),problems=[];
let blogCount=0,pageCount=0;
for(const source of sources){const payload=JSON.parse(source.payload);if(createHash('sha256').update(source.payload).digest('hex')!==source.checksum)problems.push({id:source.$id,reason:'Source checksum mismatch'});
 if(source.kind==='page'){pageCount++;continue;}blogCount++;const post=byId.get(source.$id);if(!post){problems.push({id:source.$id,reason:'Post missing'});continue;}
 for(const [field,expected]of Object.entries({title:payload.title,slug:payload.slug,publishedAt:payload.published_at||'',author:payload.metadata.authors.map(a=>a.name).join(', ')||'ProConsulting'}))if(post[field]!==expected)problems.push({id:source.$id,reason:`${field} mismatch`});
 if(post.body!==safeArticle(post.body))problems.push({id:source.$id,reason:'Unsafe stored HTML'});
 if(post.version!==1)problems.push({id:source.$id,reason:'Staff edits exist; review before import reconciliation'});
}
const report={checkedAt:new Date().toISOString(),blogCount,pageCount,problems,importedStatuses:posts.reduce((r,p)=>{r[p.status]=(r[p.status]||0)+1;return r;},{}),productionCutoverPerformed:false,remainingGates:['Historical URL/redirect inventory','Remote image availability and rights review','Untagged post section decision','Local Appwrite-backed public rendering check','Approve intended published states before provider switch']};
await mkdir('migration-reports',{recursive:true});await writeFile('migration-reports/ghost-validation.json',JSON.stringify(report,null,2)+'\n',{mode:0o600});console.log(JSON.stringify(report));if(problems.length)process.exitCode=1;

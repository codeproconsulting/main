import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {api,loadEnvironment} from './appwrite-client.mjs';
import {safeArticle} from '../app/lib/article-html.ts';
loadEnvironment();
const args=process.argv.slice(2),source=args.find(a=>!a.startsWith('--'));
if(!source)throw new Error('Usage: node scripts/import-ghost.mjs EXPORT.json [--apply] [--publish]');
const apply=args.includes('--apply'),publish=args.includes('--publish');
const exported=JSON.parse(await readFile(source,'utf8')),data=exported.db?.[0]?.data;
if(!data?.posts)throw new Error('Not a supported Ghost export');
const origin=(process.env.GHOST_PUBLIC_URL||process.env.VITE_GHOST_API_URL||process.env.VITE_GHOST_URL||'').replace(/\/ghost\/?$/,'').replace(/\/$/,'');
const tags=new Map(data.tags.map(t=>[t.id,t])),authors=new Map(data.users.map(u=>[u.id,{name:u.name,slug:u.slug,bio:u.bio,profile_image:u.profile_image}]));
const metas=new Map((data.posts_meta??[]).map(m=>[m.post_id,m]));
const base=`/databases/${process.env.APPWRITE_DATABASE_ID}/collections`;
const report={mode:apply?'apply':'dry-run',sourceChecksum:createHash('sha256').update(await readFile(source)).digest('hex'),posts:[],pages:[],unresolved:[],images:[],counts:{posts:0,pages:0,created:0,skipped:0}};
const plans=[];
function resolve(value){if(!value)return '';const original=value.replaceAll('__GHOST_URL__',origin);if(original.startsWith('/')&&!origin){report.unresolved.push(original);return original;}try{return new URL(original,origin||undefined).href;}catch{report.unresolved.push(original);return original;}}
for(const p of data.posts){
 const postTags=(data.posts_tags??[]).filter(t=>t.post_id===p.id).sort((a,b)=>(a.sort_order??0)-(b.sort_order??0)).map(t=>tags.get(t.tag_id)).filter(Boolean);
 const postAuthors=(data.posts_authors??[]).filter(a=>a.post_id===p.id).sort((a,b)=>(a.sort_order??0)-(b.sort_order??0)).map(a=>authors.get(a.author_id)).filter(Boolean);
 const section=postTags.some(t=>t.slug==='education')?'education':postTags.some(t=>t.slug==='immigration')?'immigration':'general';
 const meta=metas.get(p.id)??{};
 const metadata={created_at:p.created_at,updated_at:p.updated_at,original_status:p.status,visibility:p.visibility,canonical_url:p.canonical_url,feature_image_alt:meta.feature_image_alt,feature_image_caption:meta.feature_image_caption,tags:postTags.map(t=>({name:t.name,slug:t.slug,visibility:t.visibility})),authors:postAuthors,meta_title:meta.meta_title,meta_description:meta.meta_description,og_title:meta.og_title,og_description:meta.og_description,og_image:meta.og_image,twitter_title:meta.twitter_title,twitter_description:meta.twitter_description,twitter_image:meta.twitter_image};
 // Only allowlisted content fields are retained. No Ghost users' credentials, settings, or code injections.
 const original={id:p.id,uuid:p.uuid,type:p.type,title:p.title,slug:p.slug,html:p.html,lexical:p.lexical,mobiledoc:p.mobiledoc,custom_excerpt:p.custom_excerpt,feature_image:p.feature_image,published_at:p.published_at,metadata};
 const payload=JSON.stringify(original),checksum=createHash('sha256').update(payload).digest('hex');
 if(payload.length>1000000)throw new Error(`Source ${p.slug} exceeds source-record limit; use private file storage before importing`);
 let html=(p.html??'').replace(/(src|href)=(['"])([^'"]+)\2/g,(match,attr,quote,url)=>/^(?:\/|__GHOST_URL__)/.test(url)?`${attr}=${quote}${resolve(url)}${quote}`:match);
 html=safeArticle(html);
 for(const match of html.matchAll(/<img[^>]+src=['"]([^'"]+)/g))report.images.push({slug:p.slug,url:match[1]});
 const entry={id:p.id,slug:p.slug,section,status:publish&&p.status==='published'&&p.visibility==='public'?'published':'draft',path:section==='general'?null:`/${section}/blog/${p.slug}`,checksum};
 if(p.type==='page'){report.pages.push({id:p.id,slug:p.slug,decision:'Preserved privately; existing company pages are not overwritten'});report.counts.pages++;}
 else{report.posts.push(entry);report.counts.posts++;}
 const post={title:p.title,slug:p.slug,section,status:entry.status,body:html,excerpt:p.custom_excerpt||p.plaintext?.slice(0,240)||'',image:resolve(p.feature_image),publishedAt:p.published_at||'',metaTitle:meta.meta_title||'',metaDescription:meta.meta_description||'',author:postAuthors.map(a=>a.name).join(', ')||'ProConsulting',legacyId:p.id,metadata:JSON.stringify(metadata),version:1};
 plans.push({id:p.id,kind:p.type,payload,checksum,post});
}
if(apply){
 for(const plan of plans){
  let existingSource=null;try{existingSource=await api(`${base}/content_sources/documents/${plan.id}`);}catch(e){if(e.status!==404)throw e;}
  if(existingSource&&existingSource.checksum!==plan.checksum)throw new Error(`Source changed for ${plan.id}; manual reconciliation required`);
  if(!existingSource)await api(`${base}/content_sources/documents`,'POST',{documentId:plan.id,data:{kind:plan.kind,checksum:plan.checksum,payload:plan.payload},permissions:[]});
  if(plan.kind==='page')continue;
  let existing=null;try{existing=await api(`${base}/posts/documents/${plan.id}`);}catch(e){if(e.status!==404)throw e;}
  if(existing){if(existing.legacyId!==plan.id)throw new Error('Import ID collision');report.counts.skipped++;continue;}
  await api(`${base}/posts/documents`,'POST',{documentId:plan.id,data:plan.post,permissions:[]});report.counts.created++;
 }
}
await mkdir('migration-reports',{recursive:true});
await writeFile('migration-reports/ghost-import.json',JSON.stringify(report,null,2)+'\n',{mode:0o600});
console.log(JSON.stringify({mode:report.mode,counts:report.counts,unresolvedReferences:report.unresolved.length,untagged:report.posts.filter(p=>p.section==='general').map(p=>p.slug),report:'migration-reports/ghost-import.json',publicProviderUnchanged:true}));

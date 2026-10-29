import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),originalFetch=globalThis.fetch,originalEnv={...process.env};
let vite,service,routes,renderer,failed=false;
const records=[...Array.from({length:105},(_,i)=>({$id:`edu-${i}`,title:`Study article ${i}`,slug:`study-${i}`,section:'education',status:'published',body:`<p>Article body ${i} available without JavaScript.</p>`,excerpt:'Study guidance',image:'',publishedAt:'2026-01-01T00:00:00.000Z',author:'Synthetic author',metaTitle:`SEO study ${i}`,metaDescription:'Synthetic description'})),...Array.from({length:2},(_,i)=>({$id:`imm-${i}`,title:`Immigration article ${i}`,slug:`visa-${i}`,section:'immigration',status:'published',body:`<p>Visa body ${i} available without JavaScript.</p>`,excerpt:'Visa guidance',image:'',publishedAt:'2026-01-01T00:00:00.000Z',author:'Synthetic author',metaTitle:`SEO visa ${i}`,metaDescription:'Synthetic visa description'})),{$id:'draft',title:'PRIVATE DRAFT',slug:'private-draft',section:'education',status:'draft',publishedAt:'2026-01-01T00:00:00.000Z'},{$id:'future',title:'FUTURE POST',slug:'future-post',section:'education',status:'published',publishedAt:'2099-01-01T00:00:00.000Z'}];
const response=body=>new Response(JSON.stringify(body),{headers:{'Content-Type':'application/json'}});
before(async()=>{
 Object.assign(process.env,{BLOG_PROVIDER:'appwrite',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'test-project',APPWRITE_API_KEY:'test-key',APPWRITE_DATABASE_ID:'test-db',NODE_ENV:'test',APP_SURFACE:'website'});delete process.env.DASHBOARD_URL;
 vite=await createServer({configFile:false,root,esbuild:{jsx:'automatic'},resolve:{alias:{'~':`${root}app`}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 service=await vite.ssrLoadModule('/app/lib/public-content.server.ts');
 renderer=await vite.ssrLoadModule('/tests/helpers/render-blog.tsx');
 routes={};for(const area of ['education','immigration'])for(const page of ['blog','blog.$slug'])routes[`${area}/${page}`]=await vite.ssrLoadModule(`/app/${area}/routes/${page}.tsx`);
 globalThis.fetch=async(input)=>{
  const url=new URL(input);if(failed)return new Response('Unavailable',{status:503});
  if(url.pathname==='/api/content'){const page=Number(url.searchParams.get('page')),limit=Number(url.searchParams.get('limit'));const result=await service.readPublicContent(url.searchParams.get('section')||'',url.searchParams.get('slug')||'',page,limit);return response({...result,page,totalPages:Math.ceil(result.totalDocs/limit),hasNextPage:page*limit<result.totalDocs,hasPrevPage:page>1});}
  if(!url.pathname.includes('/collections/posts/documents'))throw new Error('Unexpected test network request');
  const queries=url.searchParams.getAll('queries[]').map(JSON.parse);let docs=records.filter(r=>queries.every(q=>q.method==='equal'?q.values.includes(r[q.attribute]):q.method==='notEqual'?!q.values.includes(r[q.attribute]):q.method==='lessThanEqual'?r[q.attribute]<=q.values[0]:true));const total=docs.length;const offset=queries.find(q=>q.method==='offset')?.values[0]||0,limit=queries.find(q=>q.method==='limit')?.values[0]||100;return response({documents:docs.slice(offset,offset+limit),total});
 };
});
after(async()=>{globalThis.fetch=originalFetch;await vite.close();for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];Object.assign(process.env,originalEnv);});
async function render(area,page,path){return renderer.renderBlog(routes[`${area}/${page}`],area,page,path);}
for(const area of ['education','immigration']){
 test(`${area} listing includes article links in server HTML`,async()=>{const result=await render(area,'blog',`/${area}/blog`);assert.equal(result.status,200);assert.ok(result.html.includes(area==='education'?'Study article 0':'Immigration article 0'));assert.ok(!result.html.includes('PRIVATE DRAFT'));assert.ok(!result.html.includes('FUTURE POST'));});
 test(`${area} article renders its body without browser JavaScript`,async()=>{const slug=area==='education'?'study-0':'visa-0';const result=await render(area,'blog.$slug',`/${area}/blog/${slug}`);assert.equal(result.status,200);assert.ok(result.html.includes('available without JavaScript.'));const loaded=await routes[`${area}/blog.$slug`].loader({params:{slug},request:new Request('http://example.invalid')});const tags=routes[`${area}/blog.$slug`].meta({data:loaded});assert.ok(tags.some(t=>t.title?.includes(area==='education'?'SEO study 0':'SEO visa 0')));});
 test(`${area} missing article returns HTTP 404 with a useful page`,async()=>{const result=await render(area,'blog.$slug',`/${area}/blog/missing`);assert.equal(result.status,404);assert.ok(result.html.includes('Article not found'));});
 test(`${area} service failure returns 503 rather than a false 404`,async()=>{failed=true;try{const result=await render(area,'blog.$slug',`/${area}/blog/missing`);assert.equal(result.status,503);assert.ok(result.html.includes('temporarily unavailable'));const listing=await render(area,'blog',`/${area}/blog`);assert.equal(listing.status,503);}finally{failed=false;}});
}
test('sitemap includes public articles beyond the first 100 and excludes drafts/future posts',async()=>{const sitemap=await vite.ssrLoadModule('/app/routes/sitemap.xml.ts');const result=await sitemap.loader({request:new Request('https://proconsulting.uk/sitemap.xml')});const xml=await result.text();assert.ok(xml.includes('/education/blog/study-104'));assert.ok(xml.includes('/immigration/blog/visa-1'));assert.equal((xml.match(/\/education\/blog\/study-/g)||[]).length,105);assert.ok(!xml.includes('private-draft'));assert.ok(!xml.includes('future-post'));});
test('sitemap returns retryable failure instead of silently omitting published articles',async()=>{failed=true;try{const sitemap=await vite.ssrLoadModule('/app/routes/sitemap.xml.ts');await assert.rejects(()=>sitemap.loader({request:new Request('https://proconsulting.uk/sitemap.xml')}),e=>e instanceof Response&&e.status===503);}finally{failed=false;}});
test('unpublished and future article slugs are not exposed through article loaders',async()=>{for(const slug of ['private-draft','future-post'])await assert.rejects(()=>routes['education/blog.$slug'].loader({params:{slug}}),e=>e instanceof Response&&e.status===404);});
test('Ghost fallback preserves the education URL for an untagged legacy article',async()=>{
 const savedFetch=globalThis.fetch,provider=process.env.BLOG_PROVIDER,origin=process.env.VITE_GHOST_API_URL,key=process.env.VITE_GHOST_CONTENT_API_KEY;
 process.env.BLOG_PROVIDER='ghost';process.env.VITE_GHOST_API_URL='https://ghost.example.invalid';process.env.VITE_GHOST_CONTENT_API_KEY='synthetic-content-key';
 try{let requested;globalThis.fetch=async input=>{requested=new URL(input);return response({posts:[{id:'legacy',slug:'toefl-exam-fee-in-pakistan',title:'TOEFL fees',html:'<p>Legacy article</p>',published_at:'2026-01-01T00:00:00.000Z',updated_at:'2026-01-02T00:00:00.000Z',tags:[],authors:[{name:'Author'}]}],meta:{pagination:{total:1}}});};
 const result=await service.readPublicContent('education','toefl-exam-fee-in-pakistan',1,1);assert.equal(result.docs[0].slug,'toefl-exam-fee-in-pakistan');assert.equal(requested.searchParams.get('filter'),'slug:toefl-exam-fee-in-pakistan');
 const wrongSection=await service.readPublicContent('immigration','toefl-exam-fee-in-pakistan',1,1);assert.equal(wrongSection.docs.length,0);
 }finally{globalThis.fetch=savedFetch;for(const [name,value]of [['BLOG_PROVIDER',provider],['VITE_GHOST_API_URL',origin],['VITE_GHOST_CONTENT_API_KEY',key]])if(value===undefined)delete process.env[name];else process.env[name]=value;}
});

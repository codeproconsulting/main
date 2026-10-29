import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
let server,auth,crm,intake,content,domain,transport;
const originalFetch=globalThis.fetch;
const originalEnv={...process.env};
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
const staff={$id:'counselor-a',name:'Test Counselor',role:'counselor',active:true};
const lead={$id:'lead-one',owner:'counselor-a',stage:'New',priority:'Normal',nextFollowUp:'',version:1};
const request=(path='/admin/leads',options={})=>new Request(`http://localhost:5173${path}`,options);
const failStatus=(status)=>e=>e instanceof Response&&e.status===status;
before(async()=>{
 Object.assign(process.env,{APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'test-project',APPWRITE_DATABASE_ID:'test-db',APPWRITE_API_KEY:'test-key',SESSION_SECRET:'test-only-signing-secret-at-least-thirty-two-characters',NODE_ENV:'test',APP_SURFACE:'website'});delete process.env.DASHBOARD_URL;
 server=await createServer({configFile:false,root,resolve:{alias:{'~':`${root}app`}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 [auth,crm,intake,content,domain,transport]=await Promise.all(['auth.server','crm.server','../lib/intake.server','content.server','domain','../lib/appwrite.server'].map(n=>server.ssrLoadModule(`/app/admin/${n}.ts`)));
 globalThis.fetch=async()=>{throw new Error('Unexpected network request in test');};
});
after(async()=>{globalThis.fetch=originalFetch;await server?.close();for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];Object.assign(process.env,originalEnv);});
test('anonymous users are redirected before any record fetch',async()=>{
 let calls=0;globalThis.fetch=async()=>{calls++;throw new Error('Must not fetch');};
 await assert.rejects(()=>auth.requireStaff(request()),e=>e instanceof Response&&e.status===302&&e.headers.get('Location')==='/admin/login');assert.equal(calls,0);
});
test('dashboard origin prevents reads through the public hostname',async()=>{
 process.env.DASHBOARD_URL='https://crm.proconsulting.uk';let calls=0;globalThis.fetch=async()=>{calls++;throw new Error('Must not fetch');};
 await assert.rejects(()=>auth.requireStaff(new Request('https://proconsulting.uk/admin/leads')),e=>e instanceof Response&&e.status===302&&e.headers.get('Location')==='https://crm.proconsulting.uk/admin/leads');assert.equal(calls,0);delete process.env.DASHBOARD_URL;
});
test('cross-origin and missing-origin mutations are rejected',()=>{
 assert.throws(()=>auth.sameOrigin(request('/admin/leads',{method:'POST',headers:{Origin:'https://attacker.example'}})),failStatus(403));
 assert.throws(()=>auth.sameOrigin(request('/admin/leads',{method:'POST'})),failStatus(403));
 assert.doesNotThrow(()=>auth.sameOrigin(request('/admin/leads',{method:'POST',headers:{Origin:'http://localhost:5173'}})));
});
test('counselors cannot open a different counselor’s lead',async()=>{
 globalThis.fetch=async()=>reply({...lead,owner:'counselor-b'});
 await assert.rejects(()=>crm.leadFor(staff,'lead-one'),failStatus(403));
 assert.equal(domain.canUseCRM({...staff,role:'editor'}),false);
});
test('lead list scopes counselor queries at the backend',async()=>{
 let url;globalThis.fetch=async(input)=>{url=new URL(input);return reply({documents:[],total:0});};
 await crm.leadsFor(staff);const queries=url.searchParams.getAll('queries[]').map(JSON.parse);
 assert.ok(queries.some(q=>q.method==='equal'&&q.attribute==='owner'&&q.values[0]==='counselor-a'));
});
test('stale lead changes fail before a mutation',async()=>{
 let writes=0;globalThis.fetch=async(_url,options)=>{if(options.method!=='GET')writes++;return reply({...lead,version:2});};
 const form=new FormData();form.set('version','1');await assert.rejects(()=>crm.updateLead(staff,'lead-one',form),failStatus(409));assert.equal(writes,0);
});
test('parallel lead edits serialize and the second stale write is rejected',async()=>{
 let current={...lead};const writes=[];
 globalThis.fetch=async(url,options)=>{
  if(url.includes('/collections/leads/')&&options.method==='GET')return reply(current);
  if(url.includes('/collections/activities/')&&options.method==='POST')return reply({$id:'audit-one'});
  if(url.includes('/collections/activities/')&&options.method==='PATCH')return reply({$id:'audit-one'});
  if(url.includes('/collections/staff/'))return reply(staff);
  if(url.includes('/collections/leads/')&&options.method==='PATCH'){current={...current,...JSON.parse(options.body).data};writes.push(current);return reply(current);}
  throw new Error('Unexpected request');
 };
 const form=()=>{const f=new FormData();for(const [k,v]of Object.entries({version:'1',stage:'Contacted',priority:'Normal',owner:staff.$id,nextFollowUp:''}))f.set(k,v);return f;};
 const result=await Promise.allSettled([crm.updateLead(staff,'lead-one',form()),crm.updateLead(staff,'lead-one',form())]);
 assert.equal(result.filter(r=>r.status==='fulfilled').length,1);assert.equal(writes.length,1);assert.equal(current.version,2);assert.ok(result.some(r=>r.status==='rejected'&&r.reason.status===409));
});
test('intake validates contact fields before saving',async()=>{
 let calls=0;globalThis.fetch=async()=>{calls++;throw new Error('Must not fetch');};
 const req=request('/api/leads',{method:'POST',headers:{Origin:'http://localhost:5173'}});
 await assert.rejects(()=>intake.captureLead(req,{name:'Test',email:'bad',phone:'123'}),failStatus(400));assert.equal(calls,0);
});
test('intake reports Appwrite failures instead of false success',async()=>{
 globalThis.fetch=async()=>reply({},503);
 const req=request('/api/leads',{method:'POST',headers:{Origin:'http://localhost:5173'}});
 await assert.rejects(()=>intake.captureLead(req,{name:'Synthetic Contact',email:'synthetic@example.invalid',phone:'+441234567890',submissionId:'11111111-1111-4111-8111-111111111111',source:'main-contact'}),e=>e instanceof Error&&e.status===503);
});
test('retried intake uses one stable document ID',async()=>{
 let postId;globalThis.fetch=async(_url,options)=>{if(options.method==='POST'){postId=JSON.parse(options.body).documentId;return reply({},409);}return reply({$id:postId,name:'Synthetic Contact',email:'synthetic@example.invalid',phone:'+441234567890'});};
 const req=request('/api/leads',{method:'POST',headers:{Origin:'http://localhost:5173'}});
 const result=await intake.captureLead(req,{name:'Synthetic Contact',email:'synthetic@example.invalid',phone:'+441234567890',submissionId:'22222222-2222-4222-8222-222222222222',source:'main-contact'});assert.equal(result.$id,'22222222-2222-4222-8222-222222222222');
});
test('article sanitizer removes executable content and unsafe links',()=>{
 const html=content.safeArticle('<h2 id="safe">Hello</h2><script>alert(1)</script><img src="https://example.invalid/photo.jpg" onerror="alert(2)"><a href="javascript:alert(3)">link</a><iframe src="https://example.invalid"></iframe>');
 assert.ok(html.includes('<h2 id="safe">Hello</h2>'));assert.ok(html.includes('https://example.invalid/photo.jpg'));assert.ok(!html.includes('<script'));assert.ok(!html.includes('onerror'));assert.ok(!html.includes('javascript:'));assert.ok(!html.includes('<iframe'));
});
test('content roles cannot publish without a publishing capability',async()=>{
 const form=new FormData();for(const[k,v]of Object.entries({title:'Test',slug:'test',section:'education',status:'published',body:'<p>Article</p>'}))form.set(k,v);
 await assert.rejects(()=>content.savePost({...staff,role:'editor'},'new',form),failStatus(403));
});
test('staff sessions use host-only HttpOnly cookies and inactive profiles are rejected',async()=>{
 let active=true;
 globalThis.fetch=async(url)=>{
  if(url.endsWith('/account/sessions/email'))return reply({secret:'synthetic-session-secret',expire:'2030-01-01T00:00:00.000Z'});
  if(url.endsWith('/account'))return reply({$id:staff.$id});
  if(url.includes('/collections/staff/'))return reply({...staff,active});
  throw new Error('Unexpected request');
 };
 const req=request('/admin/login',{method:'POST',headers:{Origin:'http://localhost:5173'}});
 const result=await auth.signIn(req,'synthetic@example.invalid','synthetic-only-password');
 const cookie=result.headers.get('Set-Cookie');assert.ok(cookie.includes('HttpOnly'));assert.ok(cookie.includes('SameSite=Strict'));assert.ok(!cookie.includes('Domain='));
 const authenticated=request('/admin/leads',{headers:{Cookie:cookie.split(';')[0]}});
 assert.equal((await auth.requireStaff(authenticated)).$id,staff.$id);
 active=false;await assert.rejects(()=>auth.requireStaff(authenticated),failStatus(403));
});
test('reassigned lead tasks are hidden from the former counselor even if task metadata is stale',async()=>{
 globalThis.fetch=async(url)=>{
  if(url.includes('/collections/tasks/'))return reply({documents:[{$id:'task-one',leadId:'lead-one',owner:staff.$id,status:'Open'}],total:1});
  if(url.includes('/collections/leads/'))return reply({...lead,owner:'counselor-b'});
  throw new Error('Unexpected request');
 };
 assert.deepEqual(await crm.tasksFor(staff),[]);
});
test('public Appwrite content queries exclude drafts and future content and whitelist returned fields',async()=>{
 const previous=process.env.BLOG_PROVIDER;process.env.BLOG_PROVIDER='appwrite';
 try{const publicContent=await server.ssrLoadModule('/app/lib/public-content.server.ts');let captured;
 globalThis.fetch=async(url)=>{captured=new URL(url);return reply({documents:[{$id:'article-one',title:'Synthetic article',slug:'synthetic-article',section:'education',status:'published',body:'<p>Safe</p><script>bad()</script>',excerpt:'Summary',image:'',publishedAt:'2026-01-01T00:00:00.000Z',author:'Author',metaTitle:'Title',metaDescription:'Description',metadata:JSON.stringify({feature_image_alt:'Alt',private_notes:'must not escape'}),legacyId:'legacy',version:1}],total:1});};
 const result=await publicContent.readPublicContent('education','synthetic-article',1,12),queries=captured.searchParams.getAll('queries[]').map(JSON.parse);
 assert.ok(queries.some(q=>q.attribute==='status'&&q.values[0]==='published'));assert.ok(queries.some(q=>q.attribute==='publishedAt'&&q.method==='lessThanEqual'));assert.ok(queries.some(q=>q.attribute==='section'&&q.values[0]==='education'));
 assert.equal(result.docs[0].featureImageAlt,'Alt');assert.equal(result.docs[0].html,'<p>Safe</p>');assert.equal('metadata' in result.docs[0],false);assert.equal('private_notes' in result.docs[0],false);
 }finally{if(previous===undefined)delete process.env.BLOG_PROVIDER;else process.env.BLOG_PROVIDER=previous;}
});
test('private file uploads reject spoofed MIME content',async()=>{
 const storage=await server.ssrLoadModule('/app/admin/storage.server.ts');
 assert.equal(storage.fileSignature(new TextEncoder().encode('<script>bad</script>'),'application/pdf'),false);
 assert.equal(storage.fileSignature(new TextEncoder().encode('%PDF-1.7 synthetic'),'application/pdf'),true);
 assert.equal(storage.fileSignature(new Uint8Array([0xff,0xd8,0xff,0x00]),'image/png'),false);
});
test('CSV exports neutralize spreadsheet formulas and quote embedded text',async()=>{
 const reports=await server.ssrLoadModule('/app/admin/reports.server.ts');
 assert.equal(reports.csvCell('=HYPERLINK("https://example.invalid")'),'"\'=HYPERLINK(""https://example.invalid"")"');
 assert.equal(reports.csvCell('normal,"value"'),'"normal,""value"""');
});

test('upstream assessment attribution survives unified CRM intake',async()=>{
 let saved;globalThis.fetch=async(_url,options)=>{saved=JSON.parse(options.body).data;return reply({...saved,$id:'33333333-3333-4333-8333-333333333333'});};
 const req=request('/education/contact',{method:'POST',headers:{Origin:'http://localhost:5173'}});
 await intake.captureLead(req,{fullName:'Synthetic Contact',email:'synthetic@example.invalid',phone:'+441234567890',submissionId:'33333333-3333-4333-8333-333333333333',source:'/education/contact',service:'Education',enquiringAs:'Parent',destination:'denmark',originPath:'/education/destinations/study-in-denmark',serviceContext:'Denmark study assessment'});
 const details=JSON.parse(saved.details);assert.equal(details.enquiringAs,'Parent');assert.equal(details.destination,'denmark');assert.equal(details.originPath,'/education/destinations/study-in-denmark');assert.equal(details.serviceContext,'Denmark study assessment');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, createHmac } from 'node:crypto';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

test('Resend webhook verifies raw signatures and stores matched events once', async () => {
  const root=fileURLToPath(new URL('../',import.meta.url));
  const vite=await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
  const originalFetch=globalThis.fetch, originalEnv={...process.env};
  const key=randomBytes(32), events=new Map();
  const payload={type:'email.bounced',created_at:'2030-01-01T12:00:00.000Z',data:{email_id:'synthetic-provider-id',to:['staff@example.invalid']}};
  let calls=0, matches=true;
  try {
    Object.assign(process.env,{ENABLE_RESEND_WEBHOOK:'true',RESEND_WEBHOOK_SECRET:'whsec_'+key.toString('base64'),APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_DATABASE_ID:'synthetic',APPWRITE_API_KEY:'synthetic'});
    const {action}=await vite.ssrLoadModule('/app/routes/api.resend-webhook.ts');
    globalThis.fetch=async(input,options)=>{
      calls++;
      const path=new URL(input).pathname;
      if(path.endsWith('/email_outbox/documents'))return Response.json({documents:matches?[{payload:JSON.stringify({to:['staff@example.invalid']})}]:[]});
      if(options.method==='POST'){
        const {documentId,data,permissions}=JSON.parse(options.body);
        assert.deepEqual(permissions,[]);
        if(events.has(documentId))return Response.json({}, {status:409});
        events.set(documentId,data);
        return Response.json(data);
      }
      return Response.json(events.get(path.split('/').at(-1)));
    };
    async function send(event=payload, options={}){
      const body=JSON.stringify(event), id=options.id??'msg_synthetic', timestamp=String(Math.floor(Date.now()/1000)-(options.age??0));
      const signature=createHmac('sha256', key).update(id+'.'+timestamp+'.'+body).digest('base64');
      const request=new Request('http://localhost/api/webhooks/resend',{method:'POST',body:body+(options.tamper?' ':''),headers:{
        'svix-id':id,'svix-timestamp':timestamp,'svix-signature':'v1,'+signature,
      }});
      return (await action({request})).status;
    }
    assert.equal(await send(payload,{tamper:true}),401);
    assert.equal(await send(payload,{age:301}),401);
    assert.equal(calls,0);
    matches=false;
    assert.equal(await send(),503);
    matches=true;
    assert.equal(await send({...payload,data:{...payload.data,to:['outside@example.invalid']}}),400);
    assert.equal(await send(),200);
    assert.equal(await send(),200);
    assert.equal(events.size,1);
    assert.match([...events.values()][0].recipientKey,/^[a-f0-9]{64}$/);
    assert.doesNotMatch(JSON.stringify([...events.values()]),/staff@example/);
    assert.equal(await send({...payload,type:'email.delivered'},{id:'msg_delivered'}),200);
    assert.equal(events.size,2);
  } finally {
    globalThis.fetch=originalFetch;
    for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];
    Object.assign(process.env,originalEnv);
    await vite.close();
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

test('delivery operations deny non-admin staff and never serialize private email fields', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const vite = await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
  const originalFetch = globalThis.fetch, originalEnv = {...process.env};
  try {
    Object.assign(process.env,{APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_API_KEY:'synthetic',APPWRITE_DATABASE_ID:'synthetic'});
    const {emailDeliveryOverview} = await vite.ssrLoadModule('/app/admin/email-delivery.server.ts');
    let requests=0;
    globalThis.fetch=async input=>{
      requests++;
      const url=new URL(input);
      const filters=url.searchParams.getAll('queries[]').map(JSON.parse);
      const projection=filters.find(q=>q.method==='select').values;
      assert.ok(!projection.some(field=>['payload','recipientKey','noticeId'].includes(field)));
      const event=url.pathname.includes('/email_events/');
      return Response.json({total:2,documents:[{$id:'synthetic',providerId:'provider-ref',
        ...(event?{kind:'email.bounced',recipientKey:'private-fixture-key'}:{status:'queued',payload:'staff@example.invalid',noticeId:'private-notice'})}]});
    };
    for (const [role,active] of [['manager',true],['counselor',true],['admin',false]]) {
      await assert.rejects(emailDeliveryOverview({role,active}),error=>error.status===403);
    }
    assert.equal(requests,0);
    for (const role of ['owner','admin']) {
      const result=await emailDeliveryOverview({role,active:true});
      assert.equal(result.outbox[0].status,'queued');
      assert.equal(result.events[0].kind,'email.bounced');
      assert.ok(result.queueCounts.every(row=>row.total===2));
      assert.doesNotMatch(JSON.stringify(result),/example\.invalid|private-fixture|private-notice/);
    }
  } finally {
    globalThis.fetch=originalFetch;
    for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];
    Object.assign(process.env,originalEnv);
    await vite.close();
  }
});

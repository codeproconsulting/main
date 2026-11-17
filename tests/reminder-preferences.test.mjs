import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

test('email preferences default off and only change the current eligible staff profile', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const vite = await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
  const originalFetch = globalThis.fetch, originalEnv = {...process.env};
  try {
    const origin = 'https://crm.example.invalid';
    Object.assign(process.env,{NODE_ENV:'test',DASHBOARD_URL:origin,SESSION_SECRET:'synthetic'.repeat(4),APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_API_KEY:'synthetic',APPWRITE_DATABASE_ID:'synthetic'});
    const {signIn} = await vite.ssrLoadModule('/app/admin/auth.server.ts');
    const {action,loader} = await vite.ssrLoadModule('/app/admin/settings.tsx');
    const profile = {name:'Fixture',role:'counselor',active:true};
    let writes = 0, reads = 0, revokeAfterSession = false;
    globalThis.fetch = async (input, options) => {
      const path = new URL(input).pathname;
      if (path.endsWith('/account/sessions/email')) return Response.json({secret:'synthetic-session',expire:'2099-01-01T00:00:00Z'});
      if (path.endsWith('/account')) return Response.json({$id:'self'});
      assert.ok(path.endsWith('/staff/documents/self'));
      if (options.method === 'PATCH') {
        const {data} = JSON.parse(options.body);
        assert.deepEqual(Object.keys(data),['reminderEmail']);
        writes++;
        Object.assign(profile,data);
      } else if (revokeAfterSession && ++reads === 2) {
        return Response.json({...profile,revocationPending:'fixture'});
      }
      return Response.json(profile);
    };
    const url = origin+'/admin/settings';
    const signInResponse = await signIn(new Request(url,{method:'POST',headers:{origin}}),'fixture@example.invalid','synthetic-password');
    const cookie = signInResponse.headers.get('set-cookie').split(';')[0];
    const load = () => loader({request:new Request(url,{headers:{cookie}})});
    const save = (preference, requestOrigin = origin) => action({request:new Request(url,{
      method:'POST',headers:{cookie,origin:requestOrigin},
      body:new URLSearchParams({reminderEmail:preference,staffId:'someone-else'}),
    })});
    assert.equal((await load()).reminderEmail,false);
    await assert.rejects(save('enabled','https://other.example.invalid'), error=>error.status===403);
    await assert.rejects(save('unknown'), error=>error.status===400);
    assert.equal(writes,0);
    assert.equal((await save('enabled')).status,303);
    assert.equal((await load()).reminderEmail,true);
    assert.equal((await save('disabled')).status,303);
    assert.equal((await load()).reminderEmail,false);
    revokeAfterSession = true;
    await assert.rejects(save('enabled'), error=>error.status===403);
    assert.equal(writes,2);
  } finally {
    globalThis.fetch=originalFetch;
    for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
    Object.assign(process.env,originalEnv);
    await vite.close();
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { deliverEmailPage, enqueueEmail, sendResend } from '../scripts/email-outbox.mjs';

test('durable email retries reuse the same request and expire before the provider window', async () => {
  let time = Date.parse('2030-01-01T00:00:00Z'), loseAck = true;
  const clock = () => time;
  const stores = { email_outbox: new Map(), locks: new Map() };
  const api = async (path, method = 'GET', body) => {
    const [, name, id] = path.split('?')[0].match(/collections\/(\w+)\/documents(?:\/([^/]+))?/);
    const store = stores[name];
    if (method === 'POST') {
      if (store.has(body.documentId)) throw Object.assign(new Error(), { status: 409 });
      assert.deepEqual(body.permissions, []);
      store.set(body.documentId, { $id: body.documentId, $createdAt: new Date(time).toISOString(), ...body.data });
    } else if (method === 'PATCH') Object.assign(store.get(id), body.data);
    else if (method === 'DELETE') store.delete(id);
    else if (id) return store.get(id);
    else return { documents: [...store.values()].filter(row => row.status === 'queued' && Date.parse(row.nextAt) <= time) };
  };
  const args = { api, database: 'synthetic', eventKey: 'fixture', from: 'sender@example.invalid', to: 'staff@example.invalid',
    subject: 'Synthetic reminder', text: 'Open the workspace.', now: new Date(time).toISOString() };
  const id = await enqueueEmail(args);
  assert.equal(await enqueueEmail(args), id);
  await assert.rejects(enqueueEmail({ ...args, text: 'Different body' }), /payload changed/);
  const requests = [];
  const send = message => sendResend({ ...message, key: 'synthetic', request: async (_url, options) => {
    requests.push([options.headers['Idempotency-Key'], options.body]);
    if (loseAck) { loseAck = false; throw new Error('Synthetic timeout'); }
    return Response.json({ id: 'synthetic-provider-id' });
  } });
  const run = () => deliverEmailPage({ api, database: 'synthetic', clock, send });
  assert.equal((await run()).deferred, 1);
  assert.equal((await run()).accepted, 0);
  time += 120000;
  assert.equal((await run()).accepted, 1);
  assert.deepEqual(requests[0], requests[1]);
  const stale = await enqueueEmail({ ...args, eventKey: 'expired' });
  time += 23 * 3600000;
  assert.equal((await run()).review, 1);
  assert.equal(stores.email_outbox.get(stale).status, 'review');
  assert.equal(requests.length, 2);
  assert.equal(stores.locks.size, 0);
});

test('Resend retries concurrent attempts and rate limits, but not invalid idempotent requests', async () => {
  for (const [status, name, retry] of [[409,'concurrent_idempotent_requests',true],[409,'invalid_idempotent_request',false],[429,'rate_limit_exceeded',true],[400,'validation_error',false]]) {
    const result = await sendResend({ key:'synthetic', id:'synthetic', payload:'{}', request:async()=>Response.json({ name }, { status }) });
    assert.equal(result.retry, retry);
  }
});

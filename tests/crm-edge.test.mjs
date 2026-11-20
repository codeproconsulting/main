import test from 'node:test';
import assert from 'node:assert/strict';
import { checkCrmEdge } from '../scripts/check-crm-edge.mjs';

test('edge preflight checks optional Finance routes without sending credentials or reading bodies', async () => {
  let failure = '', calls = [];
  const request = async (url, options) => {
    calls.push(url);
    assert.equal(options.redirect, 'manual');
    assert.equal(options.headers, undefined);
    if (url.endsWith('/finance-year') && failure === 'network') throw new Error('private detail');
    const http = url.startsWith('http:'), login = url.endsWith('/login');
    let status = http ? 308 : login ? 200 : 401;
    const headers = new Headers({ location: 'https://crm.proconsulting.uk/admin/login', 'content-type': login ? 'text/html' : 'application/json', 'cache-control': 'private, no-store' });
    if (url.endsWith('/finance-year')) {
      if (failure === 'missing') status = 404;
      if (failure === 'exposed') status = 200;
      if (failure === 'html') headers.set('content-type', 'text/html');
      if (failure === 'cache') headers.set('cache-control', 'public');
    }
    return { status, headers, body: { cancel: async () => {} } };
  };
  assert.equal((await checkCrmEdge({ request })).length, 3);
  assert.ok(!calls.some(url => url.endsWith('/finance')));
  calls = [];
  const run = () => checkCrmEdge({ request, finance: true });
  assert.ok((await run()).every(result => !result.issue));
  assert.equal(calls.length, 5);
  for (failure of ['missing', 'exposed', 'html', 'cache', 'network']) {
    const results = await run();
    assert.equal(results.filter(result => result.issue).length, 1);
    assert.equal(results.at(-1).label, 'Anonymous finance-year API');
    assert.ok(!JSON.stringify(results).includes('private detail'));
  }
});

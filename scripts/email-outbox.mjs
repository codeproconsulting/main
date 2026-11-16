import { createHash, randomUUID } from 'node:crypto';
import { q } from './appwrite-client.mjs';

const retryWindow = 23 * 60 * 60 * 1000;
const hash = value => createHash('sha256').update(value).digest('hex').slice(0, 32);
const collection = (database, name) => '/databases/' + encodeURIComponent(database) + '/collections/' + name + '/documents';

export async function enqueueEmail({ api, database, eventKey, from, to, subject, text, now = new Date().toISOString() }) {
  if (!eventKey || typeof eventKey !== 'string' || ![from, to, subject, text].every(value => typeof value === 'string' && value.trim()) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || /[\r\n]/.test(from + subject) || !Number.isFinite(Date.parse(now))) {
    throw new Error('Invalid outbox message');
  }
  const payload = JSON.stringify({ from, to: [to], subject, text });
  if (payload.length > 8000) throw new Error('Outbox message exceeds its storage limit');
  const id = hash('email:' + eventKey);
  const path = collection(database, 'email_outbox');
  try {
    await api(path, 'POST', { documentId: id, permissions: [], data: { payload, status: 'queued', nextAt: now, attempts: 0 } });
  } catch (error) {
    if (error.status !== 409) throw error;
    if ((await api(path + '/' + id)).payload !== payload) throw new Error('Outbox event payload changed');
  }
  return id;
}

export async function sendResend({ key, id, payload, request = fetch }) {
  const response = await request('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'Idempotency-Key': 'crm/' + id },
    body: payload,
    signal: AbortSignal.timeout(10000),
  });
  const data = await response.json().catch(() => ({}));
  if (response.ok && typeof data.id === 'string' && data.id.length > 0 && data.id.length <= 100) return { id: data.id };
  const retry = response.ok || response.status === 429 || response.status >= 500 ||
    (response.status === 409 && data.name === 'concurrent_idempotent_requests');
  return { retry };
}

export async function deliverEmailPage({ api, database, send, clock = Date.now, signal }) {
  const result = { accepted: 0, deferred: 0, failed: 0, review: 0, contended: false };
  if (signal?.aborted) return result;
  const outbox = collection(database, 'email_outbox');
  const locks = collection(database, 'locks');
  const key = 'worker:email-outbox', lock = locks + '/' + hash(key), owner = randomUUID();
  const now = new Date(clock()).toISOString();
  try {
    await api(locks, 'POST', { documentId: hash(key), permissions: [], data: { key, owner, acquiredAt: now } });
  } catch (error) {
    if (error.status === 409) return { ...result, contended: true };
    throw error;
  }
  try {
    const params = new URLSearchParams();
    for (const item of [q('equal','status',['queued']),q('lessThanEqual','nextAt',[now]),q('orderAsc','nextAt'),q('limit',undefined,[25])]) {
      params.append('queries[]', item);
    }
    const { documents } = await api(outbox + '?' + params);
    for (const row of documents) {
      if (signal?.aborted) break;
      const path = outbox + '/' + encodeURIComponent(row.$id);
      const expires = Date.parse(row.$createdAt) + retryWindow;
      if (!Number.isFinite(expires) || clock() >= expires) {
        await api(path,'PATCH',{data:{status:'review'}});
        result.review++;
        continue;
      }
      const attempts = row.attempts + 1;
      const nextAt = new Date(clock() + Math.min(60, 2 ** Math.min(attempts, 6)) * 60000).toISOString();
      await api(path,'PATCH',{data:{attempts,nextAt}});
      if (signal?.aborted || clock() >= expires) break;
      const outcome = await send({id:row.$id,payload:row.payload}).catch(() => ({retry:true}));
      if (outcome.id) {
        await api(path,'PATCH',{data:{status:'accepted',providerId:outcome.id}});
        result.accepted++;
      } else if (outcome.retry) result.deferred++;
      else {
        const status = attempts > 1 ? 'review' : 'failed';
        await api(path,'PATCH',{data:{status}});
        result[status]++;
      }
    }
  } finally {
    if ((await api(lock)).owner !== owner) throw new Error('Outbox lock ownership changed');
    await api(lock,'DELETE');
  }
  return result;
}

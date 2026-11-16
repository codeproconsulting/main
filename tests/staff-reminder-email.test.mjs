import test from 'node:test';
import assert from 'node:assert/strict';
import { staffReminderConfig, staffReminderEmail } from '../scripts/staff-reminder-email.mjs';

test('staff reminder email is private, opted in, and revalidated under locks before delivery', async () => {
  const now = '2030-01-01T12:00:00.000Z', noticeId = 'a'.repeat(32);
  const notice = { $createdAt:now, recipient:'staff-one', entityId:'lead-one', kind:'task', sourceId:'task-one', sourceVersion:1, dueAt:now };
  const user = { $id:'staff-one', status:true, emailVerification:true, email:'staff@example.invalid' };
  const source = { $id:'task-one', leadId:'lead-one', owner:'staff-one', status:'Open', version:1, dueAt:now };
  const lead = { $id:'lead-one', owner:'staff-one', stage:'New' };
  const lock = new Map(), outbox = new Map();
  const records = { notifications:notice, leads:lead, tasks:source, staff:{active:true,role:'counselor'} };
  const api = async (path, method = 'GET', body) => {
    if (path === '/users/staff-one') return user;
    const [, name, id] = path.match(/collections\/(\w+)\/documents(?:\/([^/]+))?/);
    if (name === 'email_outbox') {
      if (method === 'POST') {
        if (outbox.has(body.documentId)) throw Object.assign(new Error(),{status:409});
        outbox.set(body.documentId,body.data);
      } else return outbox.get(id);
    } else if (name === 'locks') {
      if (method === 'POST') lock.set(body.documentId,body.data);
      else if (method === 'DELETE') lock.delete(id);
      else return lock.get(id);
    } else return records[name];
  };
  assert.equal(staffReminderConfig({}),null);
  const config=staffReminderConfig({ENABLE_STAFF_REMINDER_EMAIL:'true',STAFF_REMINDER_EMAIL_IDS:'staff-one',RESEND_FROM:'sender@example.invalid',DASHBOARD_URL:'https://crm.example.invalid'});
  const worker=staffReminderEmail({api,database:'synthetic',config,clock:()=>Date.parse(now)});
  await worker.enqueue({...notice,$createdAt:'2029-01-01T12:00:00Z'},noticeId);
  assert.equal(outbox.size,0);
  await worker.enqueue(notice,noticeId);
  await worker.enqueue(notice,noticeId);
  assert.equal(outbox.size,1);
  const message=[...outbox.values()][0];
  assert.doesNotMatch(message.payload,/lead-one|task-one/);
  let sent=0;
  const transport=async()=>{assert.equal(lock.size,2);sent++;return {id:'synthetic-message'};};
  assert.deepEqual(await worker.send(message,transport),{id:'synthetic-message'});
  notice.read=true;
  assert.deepEqual(await worker.send(message,transport),{suppressed:true});
  notice.read=false;
  user.email='changed@example.invalid';
  assert.deepEqual(await worker.send(message,transport),{suppressed:true});
  user.email='staff@example.invalid';
  source.version=2;
  assert.deepEqual(await worker.send(message,transport),{suppressed:true});
  source.version=1;
  lead.owner='other';
  assert.deepEqual(await worker.send(message,transport),{suppressed:true});
  assert.equal(sent,1);
  assert.equal(lock.size,0);
});

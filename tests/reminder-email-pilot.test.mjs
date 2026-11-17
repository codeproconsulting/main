import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, randomBytes } from 'node:crypto';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { api, allDocuments } from '../scripts/appwrite-client.mjs';
import { remindDueTasks } from '../scripts/remind-tasks.mjs';
import { staffReminderEmail, staffReminderConfig } from '../scripts/staff-reminder-email.mjs';
import { deliverEmailPage, sendResend } from '../scripts/email-outbox.mjs';

test('CRM reminder pilot queues once, retries safely, records callbacks and honors bounce suppression', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const vite = await createServer({
    configFile: false, root, resolve: { alias: { '~': root + 'app' } },
    server: { middlewareMode: true, hmr: false, ws: false }, logLevel: 'error',
  });
  const previousEnv = { ...process.env }, previousFetch = globalThis.fetch;
  const key = randomBytes(32);
  let time = Date.parse('2030-01-01T12:00:00Z');
  const clock = () => time;
  const now = () => new Date(time).toISOString();
  const recipient = 'staff@example.invalid';
  const staff = { $id: 'staff-one', active: true, role: 'counselor', reminderEmail: 'enabled' };
  const lead = { $id: 'lead-one', owner: staff.$id, stage: 'New' };
  const task = { $id: 'task-one', leadId: lead.$id, owner: staff.$id, title: 'Synthetic task', status: 'Open', dueAt: now(), version: 1 };
  const stores = new Map(['tasks', 'appointments', 'cases', 'leads', 'staff', 'notifications', 'worker_health', 'locks', 'email_outbox', 'email_events']
    .map(name => [name, new Map()]));
  for (const [name, row] of [['tasks', task], ['leads', lead], ['staff', staff]]) stores.get(name).set(row.$id, row);
  const reply = (body, status = 200) => Response.json(body, { status });

  try {
    Object.assign(process.env, {
      APPWRITE_ENDPOINT: 'http://127.0.0.1/v1', APPWRITE_DATABASE_ID: 'synthetic',
      APPWRITE_PROJECT_ID: 'synthetic', APPWRITE_API_KEY: 'synthetic', ENABLE_RESEND_WEBHOOK: 'true',
      RESEND_WEBHOOK_SECRET: 'whsec_' + key.toString('base64'),
    });
    const { action } = await vite.ssrLoadModule('/app/routes/api.resend-webhook.ts');
    const { emailDeliveryOverview } = await vite.ssrLoadModule('/app/admin/email-delivery.server.ts');
    globalThis.fetch = async (input, options) => {
      const url = new URL(input);
      assert.equal(url.origin, 'http://127.0.0.1');
      if (url.pathname === '/v1/users/' + staff.$id) {
        return reply({ $id: staff.$id, status: true, emailVerification: true, email: recipient });
      }
      const [, name, id] = url.pathname.match(/\/collections\/(\w+)\/documents(?:\/([^/]+))?$/);
      const store = stores.get(name);
      assert.ok(store);
      const body = options.body ? JSON.parse(options.body) : null;
      switch (options.method) {
        case 'POST': {
          assert.deepEqual(body.permissions, []);
          if (store.has(body.documentId)) return reply({}, 409);
          const row = { ...body.data, $id: body.documentId, $createdAt: now() };
          store.set(row.$id, row);
          return reply(row, 201);
        }
        case 'PATCH': {
          if (!store.has(id)) return reply({}, 404);
          const row = { ...store.get(id), ...body.data };
          store.set(id, row);
          return reply(row);
        }
        case 'DELETE':
          assert.ok(store.delete(id));
          return new Response(null, { status: 204 });
        case 'GET':
          break;
        default:
          assert.fail('Unexpected Appwrite method');
      }
      if (id) return store.has(id) ? reply(store.get(id)) : reply({}, 404);
      let rows = [...store.values()], limit = 100, fields;
      for (const { method, attribute, values } of url.searchParams.getAll('queries[]').map(JSON.parse)) {
        switch (method) {
          case 'equal': rows = rows.filter(row => values.includes(row[attribute])); break;
          case 'greaterThan': rows = rows.filter(row => row[attribute] > values[0]); break;
          case 'lessThanEqual': rows = rows.filter(row => row[attribute] <= values[0]); break;
          case 'orderAsc': rows.sort((a, b) => a[attribute].localeCompare(b[attribute])); break;
          case 'orderDesc': rows.sort((a, b) => b[attribute].localeCompare(a[attribute])); break;
          case 'limit': [limit] = values; break;
          case 'select': fields = values; break;
          default: assert.fail('Unexpected Appwrite query');
        }
      }
      const documents = rows.slice(0, limit).map(row => fields
        ? Object.fromEntries(fields.filter(field => Object.hasOwn(row, field)).map(field => [field, row[field]]))
        : row);
      return reply({ total: rows.length, documents });
    };

    const config = staffReminderConfig({
      ENABLE_STAFF_REMINDER_EMAIL: 'true', STAFF_REMINDER_EMAIL_IDS: staff.$id,
      DASHBOARD_URL: 'https://crm.example.invalid', RESEND_FROM: 'sender@example.invalid',
    });
    const database = 'synthetic';
    const reminder = staffReminderEmail({ api, database, config, clock });
    const produce = () => remindDueTasks({
      api, allDocuments, databaseId: database, now: now(), clock: now,
      includeAppointments: true, includeCases: true, enqueueStaffReminder: reminder.enqueue,
    });
    const requests = [];
    const providerId = 'synthetic-provider-id';
    const callback = async type => {
      const body = JSON.stringify({ type, created_at: now(), data: { email_id: providerId, to: [recipient] } });
      const id = 'msg_' + type.split('.')[1], timestamp = String(Math.floor(Date.now() / 1000));
      const signature = createHmac('sha256', key).update(id + '.' + timestamp + '.' + body).digest('base64');
      return (await action({ request: new Request('https://crm.example.invalid/api/webhooks/resend', {
        method: 'POST', body, headers: { 'svix-id': id, 'svix-timestamp': timestamp, 'svix-signature': 'v1,' + signature },
      }) })).status;
    };
    const send = message => reminder.send(message, delivery => sendResend({
      ...delivery, key: 'synthetic', request: async (url, options) => {
        assert.equal(url, 'https://api.resend.com/emails');
        requests.push({ key: options.headers['Idempotency-Key'], body: options.body });
        if (requests.length === 1) return reply({}, 429);
        assert.equal(await callback('email.delivered'), 503);
        return reply({ id: providerId });
      },
    }));
    const deliver = () => deliverEmailPage({ api, database, send, clock });

    assert.equal((await produce()).created, 1);
    assert.equal((await produce()).duplicate, 1);
    assert.equal(stores.get('email_outbox').size, 1);
    assert.equal((await deliver()).deferred, 1);
    assert.equal((await deliver()).accepted, 0);
    time += 120000;
    assert.equal((await deliver()).accepted, 1);
    assert.deepEqual(requests[0], requests[1]);
    assert.doesNotMatch(requests[0].body, /lead-one|task-one|Synthetic task/);
    assert.equal(await callback('email.delivered'), 200);
    assert.equal(await callback('email.delivered'), 200);

    const ownership = { owner: staff.$id, leadId: lead.$id, version: 1 };
    stores.get('appointments').set('booking-one', {
      ...ownership, $id: 'booking-one', status: 'Booked', title: 'Synthetic booking',
      startsAt: new Date(time + 1800000).toISOString(),
    });
    stores.get('cases').set('case-one', {
      ...ownership, $id: 'case-one', stage: 'Visa submitted',
      deadline: new Date(time + 3600000).toISOString(),
    });
    assert.equal((await produce()).created, 2);
    staff.reminderEmail = 'disabled';
    assert.equal((await deliver()).suppressed, 2);
    staff.reminderEmail = 'enabled';

    task.version++;
    assert.equal((await produce()).created, 1); // Queue another reminder before the bounce arrives.
    assert.equal(await callback('email.bounced'), 200);
    assert.equal((await deliver()).suppressed, 1);
    task.version++;
    assert.equal((await produce()).created, 1); // A later reminder still appears in-app.
    assert.equal(stores.get('notifications').size, 5);
    assert.equal(stores.get('email_outbox').size, 4);
    assert.equal(stores.get('locks').size, 0);
    assert.equal(requests.length, 2);

    const overview = await emailDeliveryOverview({ role: 'admin', active: true });
    const count = (rows, state) => rows.find(row => row.state === state).total;
    assert.equal(count(overview.queueCounts, 'accepted'), 1);
    assert.equal(count(overview.queueCounts, 'suppressed'), 3);
    assert.equal(count(overview.eventCounts, 'email.delivered'), 1);
    assert.equal(count(overview.eventCounts, 'email.bounced'), 1);
    assert.doesNotMatch(JSON.stringify(overview), /example\.invalid|recipientKey|noticeId|payload/);
  } finally {
    globalThis.fetch = previousFetch;
    for (const key of Object.keys(process.env)) if (!(key in previousEnv)) delete process.env[key];
    Object.assign(process.env, previousEnv);
    await vite.close();
  }
});

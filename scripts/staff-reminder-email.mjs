import { createHash, randomUUID } from 'node:crypto';
import { appointmentReminderDueAt, caseReminderDueAt, currentTaskNotice } from '../app/admin/reminder-policy.ts';
import { enqueueEmail } from './email-outbox.mjs';

const idPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/;
const sources = { task: 'tasks', appointment: 'appointments', case: 'cases' };

export function staffReminderConfig(env) {
  if (env.ENABLE_STAFF_REMINDER_EMAIL !== 'true') return null;
  const ids = (env.STAFF_REMINDER_EMAIL_IDS ?? '').split(',').map(value => value.trim()).filter(Boolean);
  const dashboard = new URL(env.DASHBOARD_URL ?? '');
  if (!ids.length || ids.some(id => !idPattern.test(id)) || dashboard.protocol !== 'https:' ||
      dashboard.username || dashboard.password || !env.RESEND_FROM?.trim()) throw new Error('Invalid staff reminder email configuration');
  return { recipients: new Set(ids), from: env.RESEND_FROM, inbox: new URL('/admin/notifications', dashboard).href };
}

export function staffReminderEmail({ api, database, config, clock = Date.now }) {
  const base = '/databases/' + encodeURIComponent(database) + '/collections/';
  const path = (name, id) => base + name + '/documents' + (id ? '/' + encodeURIComponent(id) : '');
  async function optional(address) {
    try { return await api(address); } catch (error) { if (error.status === 404) return null; throw error; }
  }
  async function recipient(id) {
    if (!idPattern.test(id) || !config.recipients.has(id)) return null;
    const staff = await optional(path('staff',id));
    if (!staff?.active || staff.revocationPending ||
        !['owner','admin','manager','counselor'].includes(staff.role) ||
        (staff.role === 'manager' && staff.managerScope && staff.managerScope !== 'global')) return null;
    const identity = await optional('/users/' + encodeURIComponent(id));
    return identity?.$id === id && identity.status === true && identity.emailVerification === true &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email ?? '') ? identity.email : null;
  }
  async function locked(key, work) {
    const id = createHash('sha256').update(key).digest('hex').slice(0,32);
    const owner = randomUUID();
    await api(path('locks'), 'POST', { documentId:id, permissions:[], data:{key,owner,acquiredAt:new Date(clock()).toISOString()} });
    try { return await work(); }
    finally {
      if ((await api(path('locks',id))).owner !== owner) throw new Error('Reminder email lock ownership changed');
      await api(path('locks',id),'DELETE');
    }
  }
  const content = { subject:'ProConsulting CRM reminder',text:'You have a reminder in the staff workspace. Open your inbox: '+config.inbox };
  return {
    async enqueue(notice, noticeId) {
      const created = Date.parse(notice.$createdAt);
      const age = clock() - created;
      if (!Number.isFinite(age) || age < 0 || age > 600000 || notice.read) return;
      const to = await recipient(notice.recipient);
      if (!to) return;
      await enqueueEmail({ api,database,eventKey:'staff-reminder/'+noticeId,noticeId,from:config.from,to,...content });
    },
    async send(message, transport) {
      const { noticeId, payload } = message;
      if (!/^[a-f0-9]{32}$/.test(noticeId ?? '')) return {suppressed:true};
      const initial = await optional(path('notifications',noticeId));
      if (!initial || !idPattern.test(initial.entityId)) return {suppressed:true};
      return locked('lead:'+initial.entityId, () => locked('staff:access', async () => {
        const notice = await optional(path('notifications',noticeId));
        if (!notice || notice.read || notice.entityId !== initial.entityId || !Object.hasOwn(sources,notice.kind) ||
            !idPattern.test(notice.sourceId)) return {suppressed:true};
        const [lead,source,to] = await Promise.all([
          optional(path('leads',notice.entityId)),optional(path(sources[notice.kind],notice.sourceId)),recipient(notice.recipient),
        ]);
        if (!lead || !source || !to || lead.owner !== notice.recipient ||
            source.version !== notice.sourceVersion || payload !== JSON.stringify({from:config.from,to:[to],...content})) return {suppressed:true};
        const now = new Date(clock()).toISOString();
        const current = notice.kind === 'task' ? currentTaskNotice(notice,source,lead,notice.recipient,now)
          : Boolean(notice.dueAt) && notice.dueAt === (notice.kind === 'appointment' ? appointmentReminderDueAt(source,lead,now) : caseReminderDueAt(source,lead,now));
        return current ? transport(message) : {suppressed:true};
      }));
    },
  };
}

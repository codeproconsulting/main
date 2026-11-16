import { api, loadEnvironment } from './appwrite-client.mjs';
import { deliverEmailPage, sendResend } from './email-outbox.mjs';
import { runReminderLoop } from './reminder-runner.mjs';

loadEnvironment();
const key = process.env.RESEND_API_KEY;
if (process.env.ENABLE_RESEND_OUTBOX !== 'true' || !key || !process.env.APPWRITE_DATABASE_ID) {
  console.error('Email worker requires explicit opt-in, a database and a Resend key.');
  process.exit(1);
}
const controller = new AbortController();
for (const signal of ['SIGTERM','SIGINT']) process.on(signal, () => controller.abort());
try {
  const result = await runReminderLoop({
    signal: controller.signal, once: process.argv.includes('--once'),
    onError: () => console.error('Email outbox cycle unavailable. Retrying in 60 seconds.'),
    cycle: async () => {
      const result = await deliverEmailPage({
        api, database: process.env.APPWRITE_DATABASE_ID, signal: controller.signal,
        send: message => sendResend({ ...message, key }),
      });
      console.log(JSON.stringify(result));
      return result;
    },
  });
  if (result && (result.failed || result.review || result.contended)) process.exitCode = 1;
} catch {
  console.error('Email outbox cycle failed. Check storage, configuration and locks.');
  process.exitCode = 1;
}

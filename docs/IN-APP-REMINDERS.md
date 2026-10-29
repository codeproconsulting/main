# Due-task in-app reminders

REMIND-01 covers follow-up tasks. The VPS worker remains disabled until an operator completes rollout checks. It sends **no email, WhatsApp, SMS or browser push**, does not publish articles, and does not scan appointments or application cases. Those modules retain their own acceptance gates.

## Delivery and scope

Every cycle queries paginated open tasks due at or before the cycle's UTC time. Under the same `lead:<id>` private lock used by assignment and task changes, it re-reads the task, lead and active staff assignee. Closed (`Archived`, `Lost`, `Not eligible`), unassigned, inconsistent task/lead ownership, deleted, future, canceled/completed, invalid-date and non-CRM staff records do not generate reminders.

The notification itself is the durable in-app delivery record. Its deterministic ID hashes task ID, version, owner and due timestamp. A repeated or concurrent cycle cannot create another notification for the same generation. An existing matching notification remains read if the user marked it read. Mismatched records fail visibly instead of silently treating an ID conflict as successful. Failed writes retry on the next cycle (60 seconds after the previous cycle finishes); there is no external-send queue or attempt-count backoff in this feature.

A notification stores `kind=task`, `sourceId`, `sourceVersion`, `dueAt` and recipient. Inbox loads and Mark read actions recheck the current task, current lead owner and recipient. Rescheduling, cancellation, completion, reassignment, closed lead or missing source hides stale notifications; records are retained rather than deleted. A current reminder can remain visible with a Read badge. Mark read does not complete the task. Unknown/legacy notification kinds are hidden pending their own verified adapters. A manager sees reminders for tasks assigned to that manager, not every counselor's inbox.

Inbox pages scan 25 stored rows with an older-page cursor, so a page containing only stale rows can still reach older entries. Tasks still display up to 100 open items. Recurrence, snooze, manager escalation, larger task-list pagination and provider delivery are follow-up features, not implied by this increment.

## Task lifecycle

My follow-ups supports Complete, Cancel and Reschedule. All require an outcome/change reason, current version and current scope, and serialize under the lead lock. Rescheduling accepts an ISO timestamp with a timezone, stores UTC and increments version; the list displays Asia/Karachi time. A stale form receives 409. An audit intent is stored before mutation and completed afterward. Lost acknowledgments can leave pending audit intents; refresh before retrying and reconcile through Appwrite Console.

New follow-ups inherit the current active CRM lead owner under the same lock. Creation's durable intent records the chosen task ID. Task creation is not a fully transactional/idempotent multi-record operation: if its response is lost, inspect the task ID and pending intent before creating another follow-up. Existing lead `nextFollowUp` metadata does not independently create notifications; create a task for an actionable reminder.

## Schema and verification

With an operator setup key, preview and apply only these additive changes:

```bash
node scripts/setup-appwrite.mjs --only=notifications
node scripts/setup-appwrite.mjs --only=notifications --apply
node scripts/setup-appwrite.mjs --only=worker_health
node scripts/setup-appwrite.mjs --only=worker_health --apply
node scripts/verify-reminders.mjs --apply
```

Notification setup adds source/version/due fields and sets the default for future `read` values to false; it does not rewrite existing records. `worker_health` has no public grants. Runtime requires document read/write (including locks/health) and the already configured staff session permissions. No new provider or user-administration access is needed.

The opt-in verification script creates only a synthetic notification and health record at random IDs; checks unread default, CRUD, recipient/order queries, due-task query compatibility and anonymous denial; then removes both in a finally block. It never invokes the production worker and never writes `worker_health/reminders`. Cleanup failures are explicit. This check passed against the configured Appwrite instance with both records removed.

Focused tests cover retries/lost acknowledgments, duplicate/conflict handling, lock contention/crashes, changed source records, role/inbox boundaries, stale task writes, pagination, heartbeat and stop behavior. `tests/manual/REMIND-01-browser.md` records actual built-app checks against an in-memory fixture. No real applicant task was changed.

## Start after VPS acceptance

Use Node 22.18+ or 24, the protected root `.env`, accepted build, private schema and one worker instance. Complete `deploy/CRM-DEPLOYMENT.md` first. In the intended release checkout:

```bash
# This DOES generate reminders for real due tasks. Run only during approved rollout.
node scripts/worker.mjs --once
# Start only the reminder process; leave public website/publishing processes alone.
ENABLE_BACKGROUND_WORKER=true pm2 startOrReload deploy/ecosystem.config.cjs --only proconsulting-worker --update-env
pm2 logs proconsulting-worker --lines 50 --nostream
pm2 save
```

The opt-in flag is read by the environment running PM2, not automatically from `.env` while the ecosystem is evaluated. Review the PM2 user/process list before saving. Keep `ENABLE_SCHEDULED_PUBLISHING` independent. Do not run the entire ecosystem just to start reminders.

Normal startup checks should use a controlled synthetic lead/task assigned to a verified staff account, confirm one reminder, mark it read, restart the worker and confirm no duplicate, then reschedule/complete and confirm it disappears. Do not make real tasks due merely to test. The default interval is 60 seconds after a cycle, so delivery can be later under load; it is not an exact-time SLA.

## Health and shutdown

Owners/admins/managers can inspect Reminder worker in Workspace setup. The private `worker_health/reminders` row records started/finished times, last full successful cycle, summary counters and error count. States are running, healthy, degraded, failed or stopped. The UI reports stale after three minutes without a recorded start/finish; not started and unavailable are distinct. Refresh the page for a current view. Long cycles or clock problems can also appear stale: inspect logs rather than assuming a particular failure.

Only one cycle claims `worker:reminders`. A competing worker returns a contended result; it must not overwrite another worker's health. Per-lead lock contention marks that cycle degraded and leaves unrelated tasks able to progress. Task failures are isolated and retried next cycle. Top-level query failure records failed health. A health-store outage prevents an unobservable cycle from delivering notifications. Logs contain counters and record IDs/status codes rather than task bodies, contact details or credentials.

SIGINT/SIGTERM wakes the idle loop immediately. During work, the current task is allowed to finish; the worker stops between tasks, records stopped health and releases locks. PM2's reminder definition has a six-minute `kill_timeout` to allow bounded network operations/release rather than immediately killing an in-flight write. A hung process, forced kill or exhausted timeout can still leave locks; never treat the graceful path as crash-proof. The runtime key's REST requests have 30-second timeouts. A worker lock release failure may leave the preceding healthy heartbeat until it becomes stale; inspect locks alongside logs.

`--once` exits nonzero for failed/contended cycles or fatal errors. Repeated mode keeps retrying and records health; supervise it with PM2 and monitor stale/degraded/failed status before admitting real workloads. No external alerting integration is configured.

## Crash recovery and rollback

Locks deliberately have no automatic expiry takeover. A paused process could resume after a guessed expiry; deleting its lock while it still runs would permit overlapping writes.

1. Stop the reminder process and any other writers that could own the affected lock; for a lead lock this includes the CRM and other workers. Confirm those processes have exited. Use PM2/log/process inspection, not merely an old timestamp.
2. Inspect the private lock: `worker:reminders` or `lead:<id>`, owner and acquired time. Record operational evidence privately. Inspect pending task/assignment audit intents and the current task/lead versions and owner before changing anything.
3. For an ambiguous notification write, inspect its deterministic ID and source metadata. If it matches, preserve it including its read state; the next cycle deduplicates it. Never delete notifications merely to force a retry. Resolve mismatched records explicitly.
4. Only after the owner is confirmed stopped, remove that specific abandoned lock via Appwrite Console. Never bulk-delete locks or remove locks owned by another active module.
5. Run one controlled cycle, inspect health/counts and restart the single worker. Reconcile pending audits without erasing history or inventing completed changes.

To pause delivery, `pm2 stop proconsulting-worker` and confirm it exits; save the intended process list if changing boot behavior. Existing reminders remain private and the inbox still revalidates scope. For rollback deploy the recorded previous accepted commit, rebuild the CRM, and keep the reminder process stopped unless that release's worker is explicitly accepted. Do not downgrade to the older combined worker: it could also publish content and scan unaccepted modules. Leave additive schema/data intact; do not restore an old database over new leads/tasks.

PM2 signal and timeout behavior is documented in its [graceful shutdown guide](https://pm2.keymetrics.io/docs/usage/signals-clean-restart/) and [ecosystem reference](https://pm2.keymetrics.io/docs/usage/application-declaration/).

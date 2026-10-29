# REMIND-01 browser acceptance — 29 October 2026

Build, then run `node tests/helpers/cms-preview.mjs --reminders`. It creates three synthetic due tasks, one synthetic manager and an in-memory API on 4175; the built app runs on 4173. The actual reminder engine produces the notifications against that fixture only. Sign in as `manager@example.invalid` with the fixture password `synthetic-preview-password`. No real Appwrite or applicant data is used.

Observed against the built application:

1. Overview showed three open/overdue synthetic follow-ups. Reminders showed three Unread notices for those tasks.
2. Marked Call to confirm documents read; it changed to Read and lost its Mark read button. The task remained open.
3. In My follow-ups, rescheduled Review course shortlist with a reason and `2030-01-02T10:00:00+05:00`. Success appeared, form reset to the new version, and the task became Upcoming at 02-Jan-2030 10:00 am (Asia/Karachi). Its old reminder disappeared when navigating to Reminders.
4. Canceled Confirm duplicate appointment with a reason. It disappeared from open tasks.
5. Completed Call to confirm documents with an outcome. It disappeared from open tasks.
6. Reminders now showed No current reminders on this page. The future rescheduled task remained in My follow-ups.
7. Workspace setup showed healthy reminder-worker status, last successful cycle and zero errors from the synthetic cycle.
8. Ran the actual `scripts/worker.mjs --once` CLI with every Appwrite connection variable overridden to the local synthetic API. It reported zero due tasks and exited successfully, without reviving stale notices.

Service/engine tests separately verify counselor/foreign-recipient boundaries, concurrent cycles, retry/lost acknowledgments, crash-left locks, task change versions and health failures. The synthetic preview must be stopped after checks; its in-memory records are discarded. Production worker activation and VPS smoke checks remain separate.

---
tags: [session, continuation, active]
---
# Session wall

Generated from `session-state.json` by `npm run session:status`. Edit that structured record, then regenerate this note. Human decisions and detailed history belong in [[Sessions/2026-11-03-01]].

## Resume here

**Session:** 2026-11-03-01

**Active feature:** CASE-01

**State:** completed

**Objective:** Verify application workflows, current lead scope, stale writes and assignment transfer.

This feature is complete. On **continue**, start the next bounded session named in Exact next actions; preserve this feature's evidence and do not redo completed checks without a reason. Verify current files and drift before trusting the checkpoint.

## In scope

- Application access and concurrency
- Application lifecycle and assignment transfer

## Out of scope

- Email/WhatsApp/SMS or other external delivery
- Appointment/application reminder activation before CAL-01/CASE-01 acceptance
- Production worker activation, VPS deployment or Ghost cutover

## Acceptance checks

| ID | Check | Status | Evidence or exact gap |
| --- | --- | --- | --- |
| CASE01-A | Application saves recheck lead ownership inside the shared lock | passed | Added queued reassignment regression test; final check results recorded below. |
| CASE01-B | Lifecycle, stale edits, assignment transfer and browser workflow verified | passed | Required fields/active assignee, service-stage rules, independent applications, stale edits, audit failure/lost acknowledgments, 102-record transfer and partial-transfer retry tests pass. Built-app browser verifies education/immigration creation, fixed service, saved-state navigation, deadline display, list independence and stale-tab rejection. Production rollout remains separate. Final session:verify passed 96 tests, typecheck/build; vault links, source credential-pattern and whitespace checks passed. |

## Exact next actions

1. Archive completed CASE-01 state and start bounded CAL-01 appointment verification: current ownership inside locks, conflict concurrency, timezones, cancellation/reschedule/no-show and browser workflow. Do not activate appointment reminders before acceptance.
   Files: `app/admin/operations.server.ts`, `app/admin/work.tsx`, `context-vault/Feature Ledger.md`

2. Keep case reminder adapter, private documents and production rollout separately gated. Follow application recovery and deployment runbooks; Resend remains the planned email provider.
   Files: `docs/APPLICATION-WORKFLOWS.md`, `deploy/CRM-DEPLOYMENT.md`

## Known risks and unfinished work

- Appointment/case reminders remain disabled until CAL-01/CASE-01 acceptance; external provider delivery is not configured.
- Crash-left cycle/lead locks fail closed; recovery requires stopping their owners before targeted operator removal. No expiry takeover.
- Task creation/change audit acknowledgments can be ambiguous; inspect recorded task ID/current version before retrying to avoid duplicate work.
- Reminder inbox scans 25 stored records per page; task lists still cap at 100. Recurrence/escalation/snooze and provider outbox remain follow-up features.
- Runtime health is stale after three minutes without a recorded cycle; a long cycle or delayed clock can also cause stale status. No external alerting provider is configured.
- VPS deployment, Nginx/TLS/PM2 reboot smoke checks and production worker activation remain unperformed.
- Development branch still contains unaccepted calendar/documents/team/reporting modules; whole-branch main merge is gated.
- Application ownership transfer is multi-record and not transactional; an interrupted handoff can leave metadata ahead of the lead owner. Existing current-lead scope checks hide records from the wrong counselor; retry/reconciliation still needs feature acceptance.

## Verification

- **passed**: `npm run typecheck` (2026-11-07T05:02:54.068Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-nQXt15/typecheck.log`
- **passed**: `npm run test` (2026-11-07T05:02:55.057Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-nQXt15/test.log`
- **passed**: `npm run build` (2026-11-07T05:02:59.997Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-nQXt15/build.log`

Source inventory matches verified checkpoint: **yes**. Passing general checks does not automatically complete feature acceptance.

## External state

- **database**: proconsulting
- **ghostImportedPosts**: 30
- **ghostImportedPages**: 1
- **postPublicationState**: draft
- **blogProvider**: Ghost unchanged
- **productionDeployment**: not performed
- **workerOnVPS**: not started
- **ownerPassword**: owner must set via Appwrite Console
- **gitBranch**: codex/crm-workspace
- **integratedUpstream**: origin/main through 0397d6d; TOEFL and service-location pages preserved
- **githubCheckpoint**: CASE-01 acceptance checkpoint on codex/crm-workspace; main unchanged; inspect branch Git log for exact commit
- **mainMergePolicy**: User authorizes feature-tested merges with rollback references. The current development branch still includes unaccepted modules, so no whole-branch main merge has been performed.
- **rollbackReference**: rollback/main-2026-10-29-407977c preserves the existing main baseline for release recovery
- **scheduleIndex**: posts schedule(status,publishedAt) available; live due query passed read-only with zero due posts
- **publishingWorker**: Dedicated opt-in runner added; not activated on VPS
- **browserTestData**: Synthetic built-app CASE-01 browser acceptance passed; preview stopped; production records untouched
- **mediaSchema**: Private media collection/attributes/index provisioned; published defaults false (live default check passed)
- **mediaStorage**: Private bucket config and real disposable file/metadata round trip verified; synthetic resources removed
- **nginx**: Bootstrap and HTTPS templates prepared; target-server validation not performed
- **reminderSchema**: Notification source/version/due fields, unread=false default and private worker_health collection provisioned
- **reminderStorageCheck**: Private synthetic notification/health CRUD, indexed queries and anonymous denial passed; both records removed
- **reminderWorker**: Due-task-only runner verified locally, including actual synthetic CLI and SIGTERM idle exit; never activated on VPS
- **caseSchema**: Read-only cases setup preview completed; no schema changes applied

[[Feature Ledger]] · [[03 Implementation Status]] · [[05 Maintenance]]

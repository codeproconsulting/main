---
tags: [session, continuation, active]
---
# Session wall

Generated from `session-state.json` by `npm run session:status`. Edit that structured record, then regenerate this note. Human decisions and detailed history belong in [[Sessions/2026-11-03-01]].

## Resume here

**Session:** 2026-11-03-01

**Active feature:** CASE-01

**State:** in_progress

**Objective:** Verify application workflows, current lead scope, stale writes and assignment transfer.

A user saying **continue** means resume this feature's next unfinished acceptance check. Do not start unrelated modules or repeat completed infrastructure work. Verify current files and drift before trusting the checkpoint.

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
| CASE01-B | Lifecycle, stale edits, assignment transfer and browser workflow verified | pending | Paginated application handoff, former/new counselor scope and stale edit regressions pass. Kind-specific policies, interrupted-transfer recovery and browser acceptance remain pending. |

## Exact next actions

1. Finish CASE-01 kind-specific stage/field policy, partial transfer failure/reconciliation tests and browser acceptance. Preserve paginated handoff and audit recovery checks.
   Files: `app/admin/operations.server.ts`, `app/admin/work.tsx`, `app/admin/crm.server.ts`

## Known risks and unfinished work

- Appointment/case reminders remain disabled until CAL-01/CASE-01 acceptance; external provider delivery is not configured.
- Crash-left cycle/lead locks fail closed; recovery requires stopping their owners before targeted operator removal. No expiry takeover.
- Task creation/change audit acknowledgments can be ambiguous; inspect recorded task ID/current version before retrying to avoid duplicate work.
- Reminder inbox scans 25 stored records per page; task lists still cap at 100. Recurrence/escalation/snooze and provider outbox remain follow-up features.
- Runtime health is stale after three minutes without a recorded cycle; a long cycle or delayed clock can also cause stale status. No external alerting provider is configured.
- VPS deployment, Nginx/TLS/PM2 reboot smoke checks and production worker activation remain unperformed.
- Development branch still contains unaccepted cases/calendar/documents/team/reporting modules; whole-branch main merge is gated.
- Application ownership transfer is multi-record and not transactional; an interrupted handoff can leave metadata ahead of the lead owner. Existing current-lead scope checks hide records from the wrong counselor; retry/reconciliation still needs feature acceptance.

## Verification

- **passed**: `npm run typecheck` (2026-11-07T04:52:48.143Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-jzIToI/typecheck.log`
- **passed**: `npm run test` (2026-11-07T04:52:49.123Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-jzIToI/test.log`
- **passed**: `npm run build` (2026-11-07T04:52:54.447Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-jzIToI/build.log`

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
- **githubCheckpoint**: Application audit-first save checkpoint prepared on codex/crm-workspace; CASE-01 remains incomplete
- **mainMergePolicy**: User authorizes feature-tested merges with rollback references. The current development branch still includes unaccepted modules, so no whole-branch main merge has been performed.
- **rollbackReference**: rollback/main-2026-10-29-407977c preserves the existing main baseline for release recovery
- **scheduleIndex**: posts schedule(status,publishedAt) available; live due query passed read-only with zero due posts
- **publishingWorker**: Dedicated opt-in runner added; not activated on VPS
- **browserTestData**: Synthetic in-memory reminders browser workflow and actual CLI --once passed; preview processes stopped
- **mediaSchema**: Private media collection/attributes/index provisioned; published defaults false (live default check passed)
- **mediaStorage**: Private bucket config and real disposable file/metadata round trip verified; synthetic resources removed
- **nginx**: Bootstrap and HTTPS templates prepared; target-server validation not performed
- **reminderSchema**: Notification source/version/due fields, unread=false default and private worker_health collection provisioned
- **reminderStorageCheck**: Private synthetic notification/health CRUD, indexed queries and anonymous denial passed; both records removed
- **reminderWorker**: Due-task-only runner verified locally, including actual synthetic CLI and SIGTERM idle exit; never activated on VPS

[[Feature Ledger]] · [[03 Implementation Status]] · [[05 Maintenance]]

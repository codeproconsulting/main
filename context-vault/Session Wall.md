---
tags: [session, continuation, active]
---
# Session wall

Generated from `session-state.json` by `npm run session:status`. Edit that structured record, then regenerate this note. Human decisions and detailed history belong in [[Sessions/2026-11-11-01]].

## Resume here

**Session:** 2026-11-11-01

**Active feature:** REPORT-01

**State:** completed

**Objective:** Verify operational lead counts and audited CSV export.

This feature is complete. On **continue**, start the next bounded session named in Exact next actions; preserve this feature's evidence and do not redo completed checks without a reason. Verify current files and drift before trusting the checkpoint.

## In scope

- Manager scope, report totals and bounded pagination
- Audited CSV download and formula handling

## Out of scope

- Team-specific manager scope, historic conversion rates and VPS rollout

## Acceptance checks

| ID | Check | Status | Evidence or exact gap |
| --- | --- | --- | --- |
| REPORT01-A | Authorized report totals and exact cap behavior | passed | Synthetic tests verified active management scope, aggregate-only projection, grouped totals across pages, repeated cursor rejection, and the exact cap with and without an overflow record. |
| REPORT01-B | Audited, private and spreadsheet-safe CSV | passed | Synthetic tests verified the field allowlist, fresh role check, audit-before-delivery, overflow and audit-failure denial, formula escaping, quoting and private attachment headers. The built CRM downloaded a synthetic CSV. |
| REPORT01-C | Full project checks and release evidence | passed | Typecheck, 127 tests and build passed. The built CRM displayed synthetic report breakdowns. Appwrite accepted the projection and ordering in a read-only empty query. Release smoke checks are documented. |

## Exact next actions

1. Archive REPORT-01 and start CRM-02 with manual lead creation and normalized contact search. Use the feature ledger to sequence the later CRM-02 work.
   Files: `app/admin/leads.tsx`, `app/admin/crm.server.ts`, `context-vault/Feature Ledger.md`

2. Review the complete accepted release candidate and prior-main rollback reference before main integration. Run the report smoke checks at deployment.
   Files: `docs/RELEASE-AND-ROLLBACK.md`, `docs/CRM-REPORTS.md`, `deploy/CRM-DEPLOYMENT.md`

## Known risks and unfinished work

- Appointment/case reminder adapters remain separately gated; external provider delivery is not configured.
- Crash-left cycle/lead locks fail closed; recovery requires stopping their owners before targeted operator removal. No expiry takeover.
- Task creation/change audit acknowledgments can be ambiguous; inspect recorded task ID/current version before retrying to avoid duplicate work.
- Reminder inbox scans 25 stored records per page; task lists still cap at 100. Recurrence/escalation/snooze and provider outbox remain follow-up features.
- Runtime health is stale after three minutes without a recorded cycle; a long cycle or delayed clock can also cause stale status. No external alerting provider is configured.
- VPS deployment, Nginx/TLS/PM2 reboot smoke checks and production worker activation remain unperformed.
- Application ownership transfer is multi-record and not transactional; an interrupted handoff can leave metadata ahead of the lead owner. Existing current-lead scope checks hide records from the wrong counselor; retry/reconciliation still needs feature acceptance.
- Scheduling writes share one calendar lock. Partial handoffs may need operator retry, and moved slots remain reserved on the target calendar while the lead remains with its prior owner.
- DOC-01 requires three additive Appwrite attributes and a trusted configured ClamAV daemon. Actual daemon acceptance and target-host smoke checks are pending.
- Legacy files have no scan marker and require a scanned replacement before download or review. Uncertain uploads require the targeted operator procedure.
- TEAM-01 release requires additive staff schema and actual Appwrite session revocation verification. Ambiguous profile or final lead assignment writes retain locks and require targeted recovery.
- REPORT-01 counts describe a bounded live scan rather than a database snapshot. Export above 10,000 records requires a future bounded export workflow.

## Verification

- **passed**: `npm run typecheck` (2026-11-11T04:54:53.141Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-eMNF87/typecheck.log`
- **passed**: `npm run test` (2026-11-11T04:54:54.438Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-eMNF87/test.log`
- **passed**: `npm run build` (2026-11-11T04:54:59.396Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-eMNF87/build.log`

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
- **githubCheckpoint**: REPORT-01 verified checkpoint on codex/crm-workspace. Exact commit in branch history.
- **mainMergePolicy**: Tested features may be merged after exact release candidate review and creation of a prior-main rollback reference. No integration was performed in REPORT-01.
- **rollbackReference**: rollback/main-2026-10-29-407977c preserves the existing main baseline for release recovery
- **scheduleIndex**: posts schedule(status,publishedAt) available; live due query passed read-only with zero due posts
- **publishingWorker**: Dedicated opt-in runner added; not activated on VPS
- **browserTestData**: Synthetic reports preview stopped after acceptance.
- **mediaSchema**: Private media collection/attributes/index provisioned; published defaults false (live default check passed)
- **mediaStorage**: Private bucket config and real disposable file/metadata round trip verified; synthetic resources removed
- **nginx**: Bootstrap and HTTPS templates prepared; target-server validation not performed
- **reminderSchema**: Notification source/version/due fields, unread=false default and private worker_health collection provisioned
- **reminderStorageCheck**: Private synthetic notification/health CRUD, indexed queries and anonymous denial passed; both records removed
- **reminderWorker**: Due-task-only runner verified locally, including actual synthetic CLI and SIGTERM idle exit; never activated on VPS
- **caseSchema**: Read-only cases setup preview completed; no schema changes applied
- **appointmentSchema**: Existing private collection and owner/lead query shapes verified read-only
- **appointmentWorkflow**: CAL-01 locally accepted including synthetic browser checks
- **documentSchema**: Private bucket configuration verified and three additive attributes identified by read-only preview. No schema changes applied.
- **documentStorage**: Disposable 20 MB Appwrite chunk upload, byte comparison and anonymous denial passed. Synthetic file removed.
- **documentScanner**: Synthetic Unix socket verdicts verified. Actual ClamAV daemon and target host smoke checks pending.
- **staffSchema**: Read-only Appwrite check found revocationPending and role_active absent. No schema changes applied.
- **staffAccess**: Synthetic role, handoff and revocation acceptance passed. Live Appwrite session revocation and VPS rollout pending.
- **reportQuery**: Read-only Appwrite report projection and ordering accepted with an empty synthetic owner filter.
- **reporting**: Synthetic report and CSV acceptance passed. VPS rollout pending.

[[Feature Ledger]] · [[03 Implementation Status]] · [[05 Maintenance]]

---
tags: [session, continuation, active]
---
# Session wall

Generated from `session-state.json` by `npm run session:status`. Edit that structured record, then regenerate this note. Human decisions and detailed history belong in [[Sessions/2026-11-11-02]].

## Resume here

**Session:** 2026-11-11-02

**Active feature:** CRM-02

**State:** completed

**Objective:** Add manual lead creation and normalized contact search.

This feature is complete. On **continue**, start the next bounded session named in Exact next actions; preserve this feature's evidence and do not redo completed checks without a reason. Verify current files and drift before trusting the checkpoint.

## In scope

- Manual entry, role-based assignment and idempotent audit
- Exact email and formatted phone search for existing and new records

## Out of scope

- Contact separation, duplicate merges, saved views and bulk actions
- Production provisioning and deployment

## Acceptance checks

| ID | Check | Status | Evidence or exact gap |
| --- | --- | --- | --- |
| CRM02-A | Authorized and retry-safe manual entry | passed | Focused tests verified input validation, content-role denial, current role recheck, counselor self-assignment, unassigned manager intake, audit-before-write, repeat submission and lost acknowledgment. The built CRM created a synthetic lead. |
| CRM02-B | Scoped name, email and phone search with legacy backfill | passed | Tests verified normalized contact queries, name search, stage and counselor filters, pagination parameters, and repeatable legacy backfill. Browser verified differently formatted phone and uppercase email lookup plus stage filtering with a clean page URL. |
| CRM02-C | Project verification and release steps | passed | Typecheck, 132 tests and build passed. Read-only Appwrite setup preview found the new fields absent. Additive schema, backfill and release order are documented. |

## Exact next actions

1. Archive the manual entry slice and continue CRM-02 with contact/enquiry separation and duplicate review. Keep merge, saved views and bulk actions as subsequent work.
   Files: `app/admin/domain.ts`, `app/admin/manual-leads.server.ts`, `scripts/appwrite-schema.mjs`, `context-vault/Feature Ledger.md`

2. Before release, provision the lead fields and indexes, backfill legacy keys, and smoke-test public and staff intake.
   Files: `docs/CRM-LEAD-ENTRY.md`, `deploy/CRM-DEPLOYMENT.md`

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
- CRM-02 manual entry and contact search require additive lead fields and indexes before rollout. Older phone values that cannot be normalized remain searchable by name or email.

## Verification

- **passed**: `npm run typecheck` (2026-11-11T05:22:18.665Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-hp4LLf/typecheck.log`
- **passed**: `npm run test` (2026-11-11T05:22:19.960Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-hp4LLf/test.log`
- **passed**: `npm run build` (2026-11-11T05:22:25.180Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-hp4LLf/build.log`

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
- **githubCheckpoint**: CRM-02 manual entry and contact search verified on codex/crm-workspace. Exact commit in branch history.
- **mainMergePolicy**: Tested features may be merged after exact release candidate review and creation of a prior-main rollback reference. No integration was performed in REPORT-01.
- **rollbackReference**: rollback/main-2026-10-29-407977c preserves the existing main baseline for release recovery
- **scheduleIndex**: posts schedule(status,publishedAt) available; live due query passed read-only with zero due posts
- **publishingWorker**: Dedicated opt-in runner added; not activated on VPS
- **browserTestData**: Synthetic manual lead preview stopped after acceptance.
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
- **leadContactSchema**: Read-only preview confirmed both additive lead fields are absent. Schema and backfill were not applied.
- **crm02ManualEntry**: Manual entry and contact search accepted locally. Broader CRM-02 work remains open.

[[Feature Ledger]] · [[03 Implementation Status]] · [[05 Maintenance]]

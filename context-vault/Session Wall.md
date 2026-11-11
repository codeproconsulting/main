---
tags: [session, continuation, active]
---
# Session wall

Generated from `session-state.json` by `npm run session:status`. Edit that structured record, then regenerate this note. Human decisions and detailed history belong in [[Sessions/2026-11-09-02]].

## Resume here

**Session:** 2026-11-09-02

**Active feature:** TEAM-01

**State:** completed

**Objective:** Verify staff linking, role changes, lead handoff, deactivation and session revocation.

This feature is complete. On **continue**, start the next bounded session named in Exact next actions; preserve this feature's evidence and do not redo completed checks without a reason. Verify current files and drift before trusting the checkpoint.

## In scope

- Owner/admin role boundaries and concurrent ownership protection
- Lead handoff safeguards, revocation and recovery
- Built dashboard and release checks

## Out of scope

- Branch permissions, invitations and multi-role staff
- VPS deployment and changes to real staff access

## Acceptance checks

| ID | Check | Status | Evidence or exact gap |
| --- | --- | --- | --- |
| TEAM01-A | Owner/admin and self/last-owner safeguards | passed | Service tests passed administrator restrictions, self-edit denial, stale actor permissions and concurrent cross-owner deactivations. The built roster hid the owner’s own edit action. |
| TEAM01-B | Lead handoff before access removal and assignment race protection | passed | Tests passed both orderings of concurrent assignment and deactivation, handoff of linked tasks, former owner scope denial and retained locks on an uncertain lead write. The browser blocked deactivation until reassignment. |
| TEAM01-C | Auth linking, profile persistence and retryable session revocation | passed | Tests passed enabled Auth linking, stale forms, immediate inactive-session denial, retry, reactivation, lost profile acknowledgments and retained locks on uncertain writes. The browser showed and resolved a synthetic provider failure. |
| TEAM01-D | Built dashboard and release prerequisites | passed | Built-app browser tests passed with synthetic accounts. Typecheck, all 120 tests and build passed. Read-only live Appwrite checks identified the pending field/index and verified a nonexistent Auth lookup. Live session revocation is a release gate. |

## Exact next actions

1. Archive TEAM-01 and start REPORT-01. Verify scoped totals, pagination and caps, audit and safe CSV export.
   Files: `app/admin/reports.tsx`, `app/admin/reports.server.ts`, `app/admin/export.ts`, `context-vault/Feature Ledger.md`

2. Before team rollout, provision the additive staff field and index, verify CRM key scopes and test actual Appwrite session revocation with synthetic staff.
   Files: `docs/STAFF-ACCESS.md`, `deploy/CRM-DEPLOYMENT.md`

## Known risks and unfinished work

- Appointment/case reminder adapters remain separately gated; external provider delivery is not configured.
- Crash-left cycle/lead locks fail closed; recovery requires stopping their owners before targeted operator removal. No expiry takeover.
- Task creation/change audit acknowledgments can be ambiguous; inspect recorded task ID/current version before retrying to avoid duplicate work.
- Reminder inbox scans 25 stored records per page; task lists still cap at 100. Recurrence/escalation/snooze and provider outbox remain follow-up features.
- Runtime health is stale after three minutes without a recorded cycle; a long cycle or delayed clock can also cause stale status. No external alerting provider is configured.
- VPS deployment, Nginx/TLS/PM2 reboot smoke checks and production worker activation remain unperformed.
- Development branch still contains an unaccepted reporting module; whole-branch main merge is gated.
- Application ownership transfer is multi-record and not transactional; an interrupted handoff can leave metadata ahead of the lead owner. Existing current-lead scope checks hide records from the wrong counselor; retry/reconciliation still needs feature acceptance.
- Scheduling writes share one calendar lock. Partial handoffs may need operator retry, and moved slots remain reserved on the target calendar while the lead remains with its prior owner.
- DOC-01 requires three additive Appwrite attributes and a trusted configured ClamAV daemon. Actual daemon acceptance and target-host smoke checks are pending.
- Legacy files have no scan marker and require a scanned replacement before download or review. Uncertain uploads require the targeted operator procedure.
- TEAM-01 release requires additive staff schema and actual Appwrite session revocation verification. Ambiguous profile or final lead assignment writes retain locks and require targeted recovery.

## Verification

- **passed**: `npm run typecheck` (2026-11-11T04:27:19.212Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-BDUff3/typecheck.log`
- **passed**: `npm run test` (2026-11-11T04:27:20.169Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-BDUff3/test.log`
- **passed**: `npm run build` (2026-11-11T04:27:25.028Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-BDUff3/build.log`

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
- **githubCheckpoint**: TEAM-01 verified checkpoint on codex/crm-workspace. Exact commit in branch history.
- **mainMergePolicy**: User authorizes feature-tested merges with rollback references. The current development branch still includes unaccepted modules, so no whole-branch main merge has been performed.
- **rollbackReference**: rollback/main-2026-10-29-407977c preserves the existing main baseline for release recovery
- **scheduleIndex**: posts schedule(status,publishedAt) available; live due query passed read-only with zero due posts
- **publishingWorker**: Dedicated opt-in runner added; not activated on VPS
- **browserTestData**: Synthetic team preview stopped after acceptance.
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

[[Feature Ledger]] · [[03 Implementation Status]] · [[05 Maintenance]]

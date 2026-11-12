---
tags: [session, continuation, active]
---
# Session wall

Generated from `session-state.json` by `npm run session:status`. Edit that structured record, then regenerate this note. Human decisions and detailed history belong in [[Sessions/2026-11-11-06]].

## Resume here

**Session:** 2026-11-11-06

**Active feature:** MOB-03

**State:** in_progress

**Objective:** Let staff edit lead stage and priority on mobile and web with shared conflict protection.

A user saying **continue** means resume this feature's next unfinished acceptance check. Do not start unrelated modules or repeat completed infrastructure work. Verify current files and drift before trusting the checkpoint.

## In scope

- Native lead editor and online saves
- Web priority column and reload action for stale edits
- Shared authorization, version and audit behavior

## Out of scope

- Offline writes, mobile assignment and changes to the production VPS

## Acceptance checks

| ID | Check | Status | Evidence or exact gap |
| --- | --- | --- | --- |
| MOB03-A | Shared lead update rules and web/mobile conflict protection | passed | Synthetic authenticated web form and mobile API update the same lead. Both reject stale versions; counselor scope, closure reason, audit, and preservation of assignment and next follow-up are tested. |
| MOB03-B | Release and test mobile and web on the CRM host | blocked | MOB-02 recorded CRM TLS hostname mismatch. Target deployment and physical-device acceptance are pending. |

## Exact next actions

1. Deploy the accepted CRM release behind valid TLS. Test staff sign-in, mobile editing, browser conflict recovery and airplane mode on a phone before publishing the compatible preview update.
   Files: `deploy/CRM-DEPLOYMENT.md`, `app/admin/mobile-api.ts`, `context-vault/Sessions/2026-11-11-06.md`

2. Continue native lead search and pagination and resume CRM-02 contact/enquiry separation in separately scoped sessions.
   Files: `app/admin/crm.server.ts`, `context-vault/Feature Ledger.md`

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
- Consultation release requires the private Appwrite collection and index smoke checks.
- Live mobile sign-in is blocked by a certificate hostname mismatch at the CRM origin. iOS physical-device distribution also needs Apple signing.
- Native snapshots expire after 15 minutes and stay in memory. Cold-start offline data and edits require an approved encrypted persistence and reconciliation design.

## Verification

- **passed**: `npm run typecheck` (2026-11-11T18:52:12.438Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-7ElmJ3/typecheck.log`
- **passed**: `npm run test` (2026-11-11T18:52:13.550Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-7ElmJ3/test.log`
- **passed**: `npm run build` (2026-11-11T18:52:19.347Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-7ElmJ3/build.log`

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
- **githubCheckpoint**: MOB-01 CRM responsive sign-out and vault checkpoint on codex/crm-workspace.
- **mainMergePolicy**: Tested features may be merged after exact release candidate review and creation of a prior-main rollback reference. No integration was performed in REPORT-01.
- **rollbackReference**: rollback/main-2026-10-29-407977c preserves the existing main baseline for release recovery
- **scheduleIndex**: posts schedule(status,publishedAt) available; live due query passed read-only with zero due posts
- **publishingWorker**: Dedicated opt-in runner added; not activated on VPS
- **browserTestData**: Synthetic phone-width CRM preview stopped after acceptance.
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
- **consultationSchema**: Read-only dry run found the private collection absent. Schema was not applied.
- **mobileBuilds**: EAS finished Android build 8d2da134-c48d-4f05-bc92-6062b132bd25 and iOS simulator build fa48dddc-d3e2-47ba-abad-2f4fd0b85b91. Local artifacts verified.
- **nativeMobile**: Native source and both bundles verified locally. CRM TLS hostname mismatch confirmed. VPS API rollout and OTA release pending.
- **nativeLeadEditing**: Implemented in both source trees. No VPS or OTA release.

[[Feature Ledger]] · [[03 Implementation Status]] · [[05 Maintenance]]

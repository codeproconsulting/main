---
tags: [session, continuation, active]
---
# Session wall

Generated from `session-state.json` by `npm run session:status`. Edit that structured record, then regenerate this note. Human decisions and detailed history belong in [[Sessions/2026-11-17-02]].

## Resume here

**Session:** 2026-11-17-02

**Active feature:** COMMS-01

**State:** completed

**Objective:** Verify the full staff reminder email workflow and document the live pilot.

This feature is complete. On **continue**, start the next bounded session named in Exact next actions; preserve this feature's evidence and do not redo completed checks without a reason. Verify current files and drift before trusting the checkpoint.

## In scope

- Task, appointment and case reminders through consent, retries, callbacks, suppression and admin visibility

## Out of scope

- Production provider activation and VPS changes

## Acceptance checks

| ID | Check | Status | Evidence or exact gap |
| --- | --- | --- | --- |
| COMMS01-PILOT-A | Reminder generation and retry through provider acceptance | passed | Integrated synthetic test uses the real producer and outbox, verifies duplicate prevention and an identical provider request after a rate limit. |
| COMMS01-PILOT-B | Callback reconciliation, opt-out, privacy and suppression | passed | Test verifies early callback retry, delivered replay, bounce blocking queued and future email, appointment and case opt-out, preserved in-app notices and projected admin counts. |

## Exact next actions

1. Complete the controlled live reminder pilot when the CRM and website runtimes, Appwrite preference attribute and verified Resend sender are ready. Follow the documented acceptance and rollback sequence.
   Files: `deploy/CRM-DEPLOYMENT.md`, `deploy/ecosystem.config.cjs`

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

- **passed**: `npm run typecheck` (2026-11-17T01:59:35.061Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-rxdr6r/typecheck.log`
- **passed**: `npm run test` (2026-11-17T01:59:36.682Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-rxdr6r/test.log`
- **passed**: `npm run build` (2026-11-17T01:59:42.384Z); local log: `/var/folders/ct/12b1tyv511q0_9fdpx56ssyw0000gn/T/proconsulting-session-checks-rxdr6r/build.log`

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
- **githubCheckpoint**: Integrated reminder pilot checkpoint on codex/crm-workspace; previous tip 5b893f7.
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
- **documentSchema**: All three optional document attributes verified on target. Actual production scanner and activation pending.
- **documentStorage**: Disposable 20 MB Appwrite chunk upload, byte comparison and anonymous denial passed. Synthetic file removed.
- **documentScanner**: Synthetic Unix socket verdicts verified. Actual ClamAV daemon and target host smoke checks pending.
- **staffSchema**: Read-only Appwrite check found revocationPending and role_active absent. No schema changes applied.
- **staffAccess**: Synthetic role, handoff and revocation acceptance passed. Live Appwrite session revocation and VPS rollout pending.
- **reportQuery**: Read-only Appwrite report projection and ordering accepted with an empty synthetic owner filter.
- **reporting**: Synthetic report and CSV acceptance passed. VPS rollout pending.
- **leadContactSchema**: Both additive fields and indexes applied and verified. Built candidate intake smoke passed with synthetic cleanup. Historical backfill not run.
- **crm02ManualEntry**: Manual entry and contact search accepted locally. Broader CRM-02 work remains open.
- **consultationSchema**: Private consultation collection and indexes provisioned. Lead dependency query accepted with setup key. Production consultation workflow remains pending.
- **mobileBuilds**: EAS finished Android build 8d2da134-c48d-4f05-bc92-6062b132bd25 and iOS simulator build fa48dddc-d3e2-47ba-abad-2f4fd0b85b91. Local artifacts verified.
- **nativeMobile**: Native source and both bundles verified locally. CRM TLS hostname mismatch confirmed. VPS API rollout and OTA release pending.
- **nativeLeadEditing**: Implemented in both source trees. No VPS or OTA release.
- **auditRollout**: Appwrite leads schema provisioned. No VPS app deployment or OTA publication.
- **vpsHandoff**: Operator chose self-install. First-install checklist prepared. Target CRM DNS/proxy and VPS release await operator setup.
- **contactGroupSchema**: Optional field and index provisioned and verified available on target Appwrite. Synthetic link/query/unlink passed and both rows were removed. VPS application rollout remains pending.
- **duplicateSchema**: Duplicate fields and index provisioned. Target Appwrite storage smoke and cleanup verified. VPS app and runtime key acceptance pending.
- **leadViewsSchema**: Private lead_views collection and leads priority index provisioned. Synthetic storage and query smoke passed. VPS runtime acceptance pending.
- **routingSchema**: Four optional routing fields and rotation index provisioned. No other staff schema changed. Runtime release pending.
- **intakeRouting**: Queue schema provisioned; isolated worker and target query accepted. Worker activation, audit actor configuration and VPS runtime key verification pending.
- **teamScopeSchema**: Private team directory, optional staff manager scope, and optional indexed leads team field available. Aggregate scan returned no active teams, visible lead rows, or active managers. No real staff scope or enquiry assignments changed.
- **teamDirectoryAdmin**: Local administration workflow verified with synthetic staff. Target directory verified read-only. No production team or staff changes.
- **teamQueueRelease**: Read-only target query compatibility verified. No schema or data changes and no VPS rollout.
- **teamTaskEdits**: Synthetic service and built-app Chrome acceptance passed. No production records or schema changed.
- **appointmentReminders**: Opt-in source verified. VPS worker activation remains pending.
- **caseReminders**: Verified opt-in source and target deadline query. Worker not activated on VPS.
- **resendOutbox**: Private schema available. Provider fake-tested only. No credentials configured or worker activation performed.
- **staffReminderEmail**: Source and optional outbox link ready. Both production flags remain disabled; no Resend delivery attempted.
- **resendEvents**: Private ledger and indexes available; callback not registered or enabled. No sends attempted.
- **staffEmailPreference**: Target staff collection confirmed private. Optional reminderEmail attribute absent. No production changes or sends.
- **resendPilot**: End-to-end local acceptance with simulated transport and Appwrite responses. Live delivery, callback registration and VPS rollout pending.

[[Feature Ledger]] · [[03 Implementation Status]] · [[05 Maintenance]]

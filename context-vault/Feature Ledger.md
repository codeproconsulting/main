---
tags: [features, delivery, continuation]
---
# Feature ledger

Only **one feature** is the active session focus. “Code staged” means implementation exists but acceptance checks are incomplete. Global build success does not prove a feature works end to end. Keep the original comprehensive plan as the scope reference.

| ID | Feature | State | Remaining acceptance / dependencies |
| --- | --- | --- | --- |
| CORE-01 | Staff authentication, lead intake, counselor scope, original dashboard | Verified foundation locally | Production login, proxy, runtime key, and regression checks after subsequent changes |
| BRAND-01 | Repository logo and pink/blue/navy branding | Verified locally | Preserve throughout all new screens |
| CMS-02 | Ghost draft import and public-read readiness | Verified locally | Five acceptance checks pass; 32 tests/build/typecheck pass; no public cutover |
| CMS-03 | Visual editor, revisions, scheduled publishing | Verified locally | Six acceptance checks passed; 48 tests/build/typecheck and isolated browser workflow pass; production runner disabled, recovery limits documented |
| CMS-04 | Public content migration cutover | Planned | Historical URLs/redirects, media review, untagged post decision, publication reconciliation, provider switch and rollback rehearsal |
| MEDIA-01 | Editorial image uploads/publication | Verified locally + isolated Appwrite | Upload/permission/failure tests and browser toggle flow pass; private schema/default and real disposable storage check verified. Public website route rollout and VPS checks remain separate |
| REMIND-01 | In-app background reminders | Verified locally + isolated Appwrite schema | Due-task-only delivery, retries/dedup, current-scope inbox, task lifecycle, health and fail-closed recovery tested. VPS activation pending; appointment/case/provider reminders gated |
| CASE-01 | Applications and immigration cases | Verified locally | Required fields/service stages, scoped lifecycle, handoff/recovery and built-app browser acceptance pass; VPS rollout and case reminder adapter pending |
| CAL-01 | Appointment booking | Verified locally | Conflict, timezone, outcome, scoped handoff and recovery tests plus built-app browser acceptance passed. Production rollout and reminder adapter pending |
| DOC-01 | Private client documents | Verified locally + isolated Appwrite storage | Synthetic scanner and built-app workflow passed. Real daemon acceptance, additive schema and VPS rollout pending |
| TEAM-01 | Team roles and deactivation | Verified locally | Role guards, handoff, revocation retry and retained locks passed. Staff schema and live Appwrite session acceptance pending |
| REPORT-01 | Operational counts and CSV export | Verified locally | Bounded totals, role gates, exact cap, audit and CSV safety passed. VPS smoke checks pending |
| CONSULT-01 | Counselor and destination consultation tracking | Verified locally | Browser recording and combined filters passed. Private collection provisioned; VPS smoke checks pending |
| MOB-01 | React Native staff app | Native preview builds verified | Android APK and iOS simulator archive available. CRM TLS and physical-device acceptance pending |
| MOB-02 | Native staff CRM | First slice implemented locally | Native lead/follow-up reads and warm offline snapshot. Requires device acceptance, valid CRM TLS and API rollout. Editing, durable offline and feature parity remain open |
| MOB-03 | Shared mobile and web lead editing | Synthetic cross-platform update checks passed | Stage/priority, closure reasons, stale edit rejection and audit. Live release and physical-device acceptance pending |
| MOB-04 | Native lead search and pagination | Implemented locally | Synthetic API scope and query checks passed. Device checks after VPS rollout |
| CRM-02 | Advanced lead operations | Manual entry and contact search verified locally | Matching queries accepted by target Appwrite. Confirmed contact links implemented and tested synthetically. Chrome contact workflow passed in the isolated preview. Target contact-group schema and synthetic storage smoke passed. Production app rollout pending. Duplicate archive and restore verified locally and in target storage. Contact profiles and dependency reconciliation remain open. Saved stage/priority views verified in Chrome and target storage. Bulk stage and priority verified in synthetic service tests and Chrome. Bulk counselor assignment and owner filtering verified locally, with target unassigned query accepted. Broader merge remains planned. New search fields and backfill are pending on the VPS |
| CRM-03 | Assignment and team scopes | Manager-triggered routing verified locally and in target storage | VPS runtime acceptance, automatic intake worker verified locally and in target queue storage; activation pending, team-scoped web lead access and classification tooling verified; team administration and manager scope configuration verified in Chrome; read-only team linked queues verified in Chrome and target queries; team follow-up edits verified in Chrome; scoped application edits verified in Chrome; scoped appointment edits verified; aggregate reports verified in Chrome and target queries; team CSV verified in Chrome and target query; team consultation reads verified in Chrome and target query; team recording verified in Chrome; team document metadata verified; scanned downloads verified in Chrome |
| OPS-02 | Audit remediation | Implemented locally | Schema and local candidate intake verified against Appwrite. Target proxy and native device acceptance pending |
| OPS-01 | Production operations | Planned | Deployment access, existing edge, DNS/TLS, backup/restore, monitoring, narrow runtime key, stale-lock recovery |
| COMMS-01 | Email/WhatsApp/SMS delivery | Planned | Resend selected for email; verify sender/domain, server API/webhook adapter, durable outbox, retries, suppression and delivery tests. WhatsApp/SMS undecided; no provider activated |
| EXT-01 | Calendar sync, payments, client portal | Planned | Separate requirements and provider setup after core acceptance |

## Completion rule

A feature closes only after its explicit acceptance checks pass, failures and permission boundaries are tested, deployment/configuration dependencies are documented, and the session wall records the evidence. Deployment is tracked separately. A blocked feature keeps its remaining work and can be deferred explicitly; it must not be silently marked complete.

See [[Sessions/2026-10-29-02]], [[03 Implementation Status]], and the full plan at `docs/CRM-CMS-APPWRITE-IMPLEMENTATION-PLAN.md`.

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
| REMIND-01 | In-app background reminders | Verified locally + isolated Appwrite schema | Due-task-only delivery, retries/dedup, current-scope inbox, task lifecycle, health and fail-closed recovery tested. VPS activation pending; appointment reminders verified in isolated worker and Chrome; case reminders verified in isolated worker and Chrome; provider reminders gated |
| CASE-01 | Applications and immigration cases | Verified locally | Required fields/service stages, scoped lifecycle, handoff/recovery and built-app browser acceptance pass; VPS rollout and case reminder adapter pending |
| CAL-01 | Appointment booking | Verified locally | Conflict, timezone, outcome, scoped handoff and recovery tests plus built-app browser acceptance passed. Production rollout and reminder adapter pending |
| DOC-01 | Private client documents | Verified locally + isolated Appwrite storage | Synthetic scanner and built-app workflow passed. Real daemon acceptance, additive schema and VPS rollout pending |
| TEAM-01 | Team roles and deactivation | Verified locally | Role guards, handoff, revocation retry and retained locks passed. Staff schema and live Appwrite session acceptance pending |
| REPORT-01 | Operational counts and CSV export | Verified locally | Bounded totals, role gates, exact cap, audit and CSV safety passed. VPS smoke checks pending |
| CONSULT-01 | Counselor and destination consultation tracking | Verified locally | Browser recording and combined filters passed. Private collection provisioned; VPS smoke checks pending |
| MOB-01 | React Native staff app | Native preview builds verified | Android APK and iOS simulator archive available. CRM TLS and physical-device acceptance pending |
| MOB-02 | Native staff CRM | First slice implemented locally | Native lead/follow-up reads, warm offline snapshot, and encrypted cold-start read-only cache in the mobile repository (native build acceptance pending). Requires device acceptance, valid CRM TLS and API rollout. Editing, durable offline and feature parity remain open |
| MOB-03 | Shared mobile and web lead editing | Synthetic cross-platform update checks passed | Stage/priority, closure reasons, stale edit rejection and audit. Live release and physical-device acceptance pending |
| MOB-04 | Native lead search and pagination | Implemented locally | Synthetic API scope and query checks passed. Device checks after VPS rollout |
| CRM-02 | Advanced lead operations | Manual entry and contact search verified locally | Matching queries accepted by target Appwrite. Confirmed contact links implemented and tested synthetically. Chrome contact workflow passed in the isolated preview. Target contact-group schema and synthetic storage smoke passed. Production app rollout pending. Duplicate archive and restore verified locally and in target storage. Read-only linked contact profiles are implemented and verified synthetically. Contact master editing and duplicate dependency reconciliation remain open. Saved stage/priority views verified in Chrome and target storage. Bulk stage and priority verified in synthetic service tests and Chrome. Bulk counselor assignment and owner filtering verified locally, with target unassigned query accepted. Duplicate archive review implemented and tested. Read-only comparison of merge dependencies implemented and tested. Merge execution remains planned. New search fields and backfill are pending on the VPS |
| CRM-03 | Assignment and team scopes | Manager-triggered routing verified locally and in target storage | VPS runtime acceptance, automatic intake worker verified locally and in target queue storage; activation pending, team-scoped web lead access and classification tooling verified; team administration and manager scope configuration verified in Chrome; read-only team linked queues verified in Chrome and target queries; team follow-up edits verified in Chrome; scoped application edits verified in Chrome; scoped appointment edits verified; aggregate reports verified in Chrome and target queries; team CSV verified in Chrome and target query; team consultation reads verified in Chrome and target query; team recording verified in Chrome; team document metadata verified; scanned downloads verified in Chrome; team reviews and opted-in uploads verified in Chrome; production scanner and activation pending |
| OPS-02 | Audit remediation | Implemented locally | Schema and local candidate intake verified against Appwrite. Target proxy and native device acceptance pending |
| OPS-01 | Production operations | Planned | Deployment access, existing edge, DNS/TLS, backup/restore, monitoring, narrow runtime key, stale-lock recovery |
| COMMS-01 | Email/WhatsApp/SMS delivery | Resend outbox and opt-in staff reminders and signed delivery events and suppression verified synthetically and against target query shapes; owner/admin email delivery dashboard and self-service staff consent implemented; local end-to-end pilot passed; consent attribute provisioned and Appwrite preflight passed; live pilot pending CRM TLS and Resend setup | Resend selected for email; verify sender/domain, server API/webhook adapter, durable outbox, retries, suppression and delivery tests. WhatsApp/SMS undecided; no provider activated |
| FIN-01 | Owner office expense register | Implemented on web and native mobile; Appwrite schema and synthetic storage verified | Browser/device acceptance and VPS rollout pending. GBP, monthly cap 1,000. Void corrections and optional payee/payment/reference and monthly search filters and copy-as-new entry implemented; one scanned receipt per expense implemented; production scanner and device checks pending |
| MOB-05 | Native per-lead consultations | Implemented and verified locally | Scoped history, paging and retry-safe completed-session recording share the web service. API tests, component browser check and mobile checks pass; server/OTA/device acceptance pending |
| MOB-06 | Native consultation reports | Implemented and verified locally | Counselor/destination/date filters, 25-row pagination and enquiry drill-down reuse web reports. Synthetic API, component browser and mobile checks passed; VPS/OTA/device acceptance pending |
| MOB-07 | Native follow-up lifecycle | Implemented and verified locally | Current detail, outcome, Complete/Cancel/Reschedule and stale/uncertain reload share web service. API and workspace component checks plus mobile checks passed; VPS/OTA/device acceptance pending |
| MOB-08 | Shared retry-safe follow-up creation | Implemented and verified locally | Stable task/audit IDs, retained web drafts and native lead form. Service/API, built web, native component and full checks passed; VPS/OTA/device acceptance pending |
| FIN-02 | Monthly office budgets | Implemented on web and native mobile; schema and synthetic storage verified | GBP budget versus active spend, versioned owner saves and yearly aggregate review/CSV. Deployment explicitly deferred by user on 21 November. Last probe: base edge passes; monthly/yearly Finance API routes return 404. VPS and device acceptance pending |
| EXT-01 | Calendar sync, payments, client portal | Planned | Separate requirements and provider setup after core acceptance |

## Completion rule

A feature closes only after its explicit acceptance checks pass, failures and permission boundaries are tested, deployment/configuration dependencies are documented, and the session wall records the evidence. Deployment is tracked separately. A blocked feature keeps its remaining work and can be deferred explicitly; it must not be silently marked complete.

See [[Sessions/2026-10-29-02]], [[03 Implementation Status]], and the full plan at `docs/CRM-CMS-APPWRITE-IMPLEMENTATION-PLAN.md`.

MOB-09 native applications: API and local component acceptance passed. Mobile checks and full main checks passed. Physical-device, VPS and OTA acceptance remain pending. Resume [[Session Wall]].

MOB-10 native appointments: scoped list/detail and versioned outcomes implemented locally. API/client/component checks passed; full-check evidence in [[Session Wall]]. Appointment creation/rescheduling, device and production acceptance remain separate.

## Native appointment rescheduling — 22 November

MOB-11 completed local acceptance for native appointment rescheduling. Release and physical-device checks remain pending. Evidence in [[Sessions/2026-11-22-03]].

## Blog Studio authoring — 22 November

CMS-05 Blog Studio rich authoring and private previews passed local acceptance. The feature reuses the existing Appwrite schema. Git release and production verification are separate. See [[Sessions/2026-11-22-04]].

## Native appointment booking — 23 November

MOB-12 native appointment creation is implemented and locally tested. Mobile checkpoint `6193625` is local to the mobile checkout. The matching API is included on the CRM feature branch. Release verification remains pending. See [[Sessions/2026-11-22-05]].

## Offline mobile agenda — 23 November

MOB-13 personal offline appointment agenda passed local service, storage and component acceptance. Mobile `aa25bfe` is local only. Release and handset checks are pending. [[Sessions/2026-11-23-01]]

## Native personal reminder inbox — 23 November

MOB-14 passed local acceptance for reminder paging, personal acknowledgements and native record links. Production release and physical-device verification are pending. Next planned feature is the native lead activity timeline. [[Sessions/2026-11-23-02]]

## Native lead activity — 23 November

MOB-15 is locally accepted. The next native timeline action is internal-note entry. Production and device acceptance remain pending. [[Sessions/2026-11-23-03]]

## Native internal notes

MOB-16 native internal notes passed local acceptance. [[Sessions/2026-11-23-04]]

## Native application creation

MOB-17 passed local acceptance. [[Sessions/2026-11-23-05]]

## Native application detail editing

MOB-18 native application detail editing passed local acceptance. [[Sessions/2026-11-23-06]]

## Application document checklist

MOB-19 document checklist passed local acceptance. [[Sessions/2026-11-23-07]]

## Native application search

MOB-20 native application search passed local acceptance. [[Sessions/2026-11-23-08]]

## Native application deadline filters

MOB-21 native deadline filters passed local acceptance. [[Sessions/2026-11-23-09]]

## Application-to-lead navigation

MOB-22 application-to-lead navigation passed local acceptance. [[Sessions/2026-11-24-01]]

## Lead applications

MOB-23 lead application navigation passed local acceptance. [[Sessions/2026-11-25-01]]

## Lead appointments

MOB-24 lead appointment navigation passed local acceptance. [[Sessions/2026-11-25-02]]

## Appointment lead navigation

MOB-25 uses the existing scoped lead API to open appointment enquiries and returns to the original meeting. Pending edits require saving or reloading before navigation. CRM typecheck, 193 tests and build passed. Mobile typecheck, lint, 13 tests and both exports passed. Simulated controls verified draft protection, linked lead open, return and retained list scope. Mobile commit `711863e` is local. Publication and physical-device verification remain pending. [[Sessions/2026-11-25-03]]

## Native customer contact workflow

MOB-26 adds an online contact profile and explicit call, email and share actions. The profile includes enquiry source, service, destination, received date and next follow-up. It stays outside offline storage. Code lives in the CRM mobile API and the mobile checkout’s `src/ContactProfile.tsx`. CRM typecheck, 193 tests and build passed. Mobile typecheck, lint, 13 tests and both exports passed. Simulated controls verified call and email URLs, shared contact text and background clearing. API checks verified profile allowlisting and exclusion from workspace snapshots. Mobile commit `e084307` is local. Release and handset checks remain pending. [[Sessions/2026-11-25-04]]

## Original enquiry on mobile

MOB-27 projects intake-supported scalar fields through `app/admin/enquiry-profile.ts` into the online contact profile. Staff expand selectable text in the mobile contact panel. The saved workspace excludes this profile. CRM typecheck, 193 tests and build passed. Mobile typecheck, lint, 13 tests and both exports passed. Synthetic checks covered malformed and nested legacy values, zero and false, unknown keys, text bounds, expand and collapse, contact actions and background clearing. Mobile `8fe84ef` is local. Deployment, publication and handset checks remain pending. [[Sessions/2026-11-25-05]]

## Native follow-up history

MOB-28 provides completed and cancelled follow-ups with outcomes, paging and current task detail. The API uses personal scoped tasks and current lead access. The native component is `src/FollowUpHistory.tsx`. CRM typecheck, 193 tests and build passed. Mobile typecheck, lint, 13 tests and both exports passed. API checks covered authentication, invalid status, outcomes and reassignment. Simulated controls verified empty-page continuation, pagination, status reset, detail navigation and background clearing. Mobile `d603368` is local. Rollout and handset checks remain pending. [[Sessions/2026-11-25-06]]

## Lead follow-ups

MOB-29 extends the online history endpoint and native component with a fixed lead scope and open status. Each list checks current access and returns its lead scope for client verification. CRM typecheck, 193 tests and build passed. Mobile typecheck, lint, 13 tests and both exports passed. API checks verified scoped open tasks and invalid or unauthorized lead IDs. Simulated controls verified lead navigation, status switching, paging and task detail return. Mobile `0a17043` is local. Deployment, publication and handset checks remain pending. [[Sessions/2026-11-25-07]]

## Follow-up history position

MOB-30 stores status and page in the mobile workspace and reloads history when returning from detail. Scope changes and sign-out reset this navigation state. CRM typecheck, 193 tests and build passed. Mobile typecheck, lint, 13 tests and both exports passed. Simulated controls verified return to page two with its status intact and reset to page one on status change. Mobile `23f2411` is local. Publication and handset checks remain pending. [[Sessions/2026-11-28-01]]

## Saved application deadlines

MOB-31 adds a bounded, personal deadline section to the encrypted workspace and saved agenda. Closed cases are excluded, and timestamps use Karachi time. CRM typecheck, 193 tests and build passed. Mobile typecheck, lint, 13 tests and both exports passed. API checks verified current scope, closed case exclusion and response fields. SecureStore checks verified deadline restore and malformed-section removal. Mobile `187fcab` is local. Workspace interaction and physical-phone checks remain pending. [[Sessions/2026-11-28-02]]

## Offline deadline lifecycle

MOB-32 adds overdue and upcoming saved views and optional-query compatibility. CRM typecheck, 193 tests and build passed. Mobile typecheck, lint, 13 tests and both exports passed. Simulated workspace controls verified offline restart, partial indicators, overdue and upcoming filters, background hiding and signout. API checks verified legacy optional-query fallback while access failures remain errors. Mobile `bd85c67` is local. Rollout and handset acceptance remain pending. [[Sessions/2026-11-28-03]]

## Offline application browsing

MOB-33 adds up to 12 personal application summaries to the encrypted workspace and renders them in `src/SavedApplications.tsx` when offline. Local search and stage filters operate on the saved list. Optional-query fallback supports older installations. CRM typecheck, 193 tests and build passed. Mobile typecheck, lint, 13 tests and both exports passed. API checks verified personal scope and projection. Storage checks verified restore and malformed data handling. Simulated controls verified offline restart, search, stage filters, background hiding and signout. Mobile `e3a9e50` is local. Release and handset checks remain pending. [[Sessions/2026-11-28-04]]

## Mobile redesign programme

The planned six-phase execution programme is recorded in `docs/MOBILE-CRM-REDESIGN-PLAN.md`. Rendered previews established the navigation and density problems. Phase 1 covers the complete navigation foundation. Design implementation and physical-device acceptance are pending. Compatible updates can target the generated Android 1.0.4 preview runtime.

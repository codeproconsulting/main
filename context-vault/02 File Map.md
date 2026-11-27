---
tags: [files, implementation]
updated: 2026-10-29
---
# File map

| Area | Repository files | Responsibility |
| --- | --- | --- |
| Routing and document | `app/routes.ts`, `app/root.tsx` | Admin routes, process surface guard, tracking boundary |
| Staff access | `app/admin/auth.server.ts` | Appwrite sessions, cookie, origin check, active staff authorization |
| Domain policy | `app/admin/domain.ts` | Roles, CRM/content capabilities, stages, data types |
| Appwrite transport | `app/lib/appwrite.server.ts` | Server-only authenticated REST calls and document helpers |
| Intake | `app/lib/intake.server.ts`, `app/routes/api.leads.ts` | Validate and persist public enquiries |
| Client intake helper | `app/lib/submit-lead.ts` | Same-origin requests and verified success handling |
| Rate limiting | `app/lib/rate-limit.server.ts` | Process-local login and intake limits |
| CRM operations | `app/admin/crm.server.ts` | Lead access, assignment, status, notes, tasks, audit intents |
| CMS operations | `app/admin/content.server.ts` | Sanitized HTML editing and publishing policy |
| Dashboard UI | `app/admin/layout.tsx`, `overview.tsx`, `leads.tsx`, `lead.tsx`, `tasks.tsx` | Staff workspace and daily operations |
| CMS UI | `app/admin/blogs.tsx`, `blog-edit.tsx` | Content library and initial HTML editor |
| Dashboard presentation | `app/admin/admin.css`, `ui.tsx` | Responsive styling and shared UI |
| Setup UI | `app/admin/login.tsx`, `logout.tsx`, `settings.tsx` | Sign-in, sign-out, configuration status |
| Legacy admin | `app/education/routes/admin.tsx` | Redirect and disable the old unprotected mutation handler |
| Website forms | `app/routes/contact.tsx`, education contact/blog detail, immigration contact | Route enquiries into common intake |
| Existing public content | Three `ghost-api.ts` adapters and blog route modules | Remain Ghost-backed until migration acceptance |
| Infrastructure schema | `scripts/appwrite-schema.mjs`, `setup-appwrite.mjs` | Additive private collection setup |
| Provisioning | `scripts/provision-staff.mjs`, `provision-owner.mjs` | Operator-controlled staff profiles and first owner |
| Integration verification | `scripts/verify-appwrite.mjs`, `tests/workspace.test.mjs` | Private schema readiness, disposable live verification, and access/workflow tests |
| CLI transport | `scripts/appwrite-client.mjs` | Environment loading and safe Appwrite error reporting |
| Process runtime | `scripts/start.mjs`, `deploy/ecosystem.config.cjs` | Runtime environment and two loopback Node processes |
| Proxy | `deploy/nginx/crm.proconsulting.uk.conf`, `deploy/nginx/snippets/proconsulting-crm-proxy.conf` | Additive CRM vhost and trusted forwarding |
| Runbook | `deploy/CRM-DEPLOYMENT.md`, `deploy/env.example` | VPS steps, non-secret config template, boundaries |
| Approved specification | `docs/CRM-CMS-APPWRITE-IMPLEMENTATION-PLAN.md` | Full CRM/CMS scope and delivery gates |
| Documentation maintenance | `scripts/sync-context-vault.mjs`, `AGENTS.md` | Inventory drift and completion-time note updates |

[[Source Inventory]] contains generated hashes and paths. [[File Updates]] records inventory changes. This human-authored map explains purpose rather than duplicating source code.

## Continuation and staged modules

- `scripts/session-wall.mjs`, `context-vault/session-state.json`, and `Session Wall.md`: one active feature, acceptance evidence, current-source verification and exact handoff.
- `tests/session-wall.test.mjs`: checkpoint rendering and refusal of unsupported completion.
- `app/lib/public-content.server.ts`, `content-client.ts`, and `app/routes/api.content.ts`: shared public content delivery with explicit provider choice.
- `scripts/import-ghost.mjs`, `validate-ghost-import.mjs`: private allowlisted import and read-only reconciliation; reports stay ignored.
- `scripts/worker.mjs`: staged in-app reminders and scheduled publishing; disabled by default.
- `app/admin/operations.server.ts`, `work.tsx`: staged cases and appointments.
- `documents.tsx`, `document-domain.ts`, `documents.server.ts`, `document-scan.server.ts`, `document-download.ts` and `storage.server.ts`: private document checklist, workflow, scanner, storage and attachment routes. See `docs/PRIVATE-DOCUMENTS.md` and `tests/manual/DOC-01-browser.md`.
- `media.tsx`, `media-download.ts`, `app/routes/media.ts`: staged editorial media and explicit public visibility.
- `rich-editor.tsx`, `preview.ts`, `history.tsx`: staged visual authoring, sanitized preview and revisions.
- `team.tsx`, `reports.tsx`, `reports.server.ts`, `export.ts`: staged staff controls, counts, and CSV.

Use [[Feature Ledger]] for actual acceptance state; this file map describes code location, not completion.

## CMS-03 verification additions

- `scripts/publish-scheduled.mjs`: isolated/testable due-publication engine with post locks, deterministic snapshots, and durable audit intents.
- `scripts/publishing-worker.mjs`: independent opt-in publishing runner; does not send reminders/messages.
- `tests/cms-workflow.test.mjs` and `tests/scheduled-publishing.test.mjs`: focused role/revision/publication failure tests.
- `tests/helpers/cms-preview.mjs`: disposable in-memory CMS browser fixture.
- `tests/manual/CMS-03-browser.md`: actual browser acceptance steps and observed regressions.
- `docs/SCHEDULED-PUBLISHING.md`: activation and fail-closed recovery runbook.

## MEDIA-01 and first-day deployment additions

- `app/admin/media.server.ts`: editorial policy, private uploads, visibility locking/audits, public image responses and bounded multipart parsing.
- `scripts/setup-storage.mjs`: scoped bucket verification; does not silently replace mismatched security settings.
- `scripts/verify-media-storage.mjs`: opt-in synthetic real storage/metadata exercise and cleanup.
- `tests/media.test.mjs`, `tests/fixtures/synthetic-media.png`, `tests/manual/MEDIA-01-browser.md`: boundary/failure checks and actual browser evidence.
- `docs/EDITORIAL-MEDIA.md`: visibility and interrupted-upload recovery limits.
- `deploy/nginx/crm.proconsulting.uk.bootstrap.conf`: ACME-only HTTP; final `.conf` serves HTTPS after certificate issuance.
- `deploy/CRM-DEPLOYMENT.md`: complete first-day CRM-only installation, DNS/TLS, process persistence, acceptance and rollback.

## REMIND-01 additions

- `app/admin/reminder-policy.ts`: shared due-task/current-notice rules without I/O.
- `scripts/remind-tasks.mjs`: injected due-task engine, deterministic IDs, cycle/lead locks, health and failure isolation.
- `scripts/reminder-runner.mjs`, `scripts/worker.mjs`: abort-aware loop and due-task-only CLI; publishing remains separate.
- `app/admin/notifications.server.ts`, `notifications.tsx`: recipient/current-source inbox, cursor paging, Mark read and manager-visible health.
- `app/admin/crm.server.ts`, `tasks.tsx`: versioned Complete/Cancel/Reschedule and locked task creation.
- `scripts/verify-reminders.mjs`: opt-in disposable real schema/query/privacy check without invoking production worker.
- `tests/reminders.test.mjs`, `reminder-workflow.test.mjs`, `manual/REMIND-01-browser.md`: engine, lifecycle, access, recovery and browser evidence.
- `docs/IN-APP-REMINDERS.md`: activation, scope, consistency limits, health, shutdown and operator recovery.

CASE-01 audit changes: `app/admin/operations.server.ts` records application intents before mutation; `tests/reminder-workflow.test.mjs` includes application lifecycle/access/failure regressions.

Application handoff: `app/admin/crm.server.ts` paginates linked cases on owner change; `tests/reminder-workflow.test.mjs` verifies access/version transfer beyond 100 records.

`app/admin/domain.ts` exports `caseStagesFor`; `operations.server.ts` enforces service-stage compatibility and immutable service; `work.tsx` uses the same stage choices and refreshes selected service when navigating records.

CASE-01 accepted workflow/recovery: `docs/APPLICATION-WORKFLOWS.md`; browser evidence: `tests/manual/CASE-01-browser.md`; fixture: `tests/helpers/cms-preview.mjs --cases`.

## CAL-01 appointment acceptance

`app/admin/calendar.server.ts` handles strict timezone input, paged conflict checks and handoff preflight. `operations.server.ts` saves appointment versions and audit intents. `crm.server.ts` transfers linked appointments under the calendar lock. See `docs/APPOINTMENT-WORKFLOWS.md` and `tests/manual/CAL-01-browser.md`.

## TEAM-01 staff access

`app/admin/team.tsx` provides the paged staff list and edit form. `app/admin/team.server.ts` owns role boundaries, profile persistence, session revocation and retries. `app/admin/crm.server.ts` coordinates the staff and assignment locks. `scripts/provision-staff.mjs` links new profiles for bootstrap. See `docs/STAFF-ACCESS.md` and `tests/manual/TEAM-01-browser.md`.

## REPORT-01 operational reports

`app/admin/reports.server.ts` handles permissions, projections, pagination, totals and audited CSV. `app/admin/reports.tsx` renders aggregate counts and `app/admin/export.ts` is the download route. See `docs/CRM-REPORTS.md` and `tests/reports.test.mjs`.

## CRM-02 manual entry and contact search

`app/admin/leads.tsx` adds the manual form and scoped search controls. `app/admin/manual-leads.server.ts` handles role checks, audit and idempotent creation. `app/lib/lead-contact.ts` shares normalization with public intake and `scripts/backfill-lead-contact.mjs`. See `docs/CRM-LEAD-ENTRY.md` and `tests/manual-leads.test.mjs`.

## Consultation tracking

`app/admin/consultations.tsx` records and lists enquiry consultations. `app/admin/consultation-report.tsx` shows management totals and filters. `app/admin/consultations.server.ts` implements scope, attribution and retry handling. See [[Sessions/2026-11-11-03]].

## Mobile staff workspace

The sibling app's `src/StaffWorkspace.tsx` hosts the workspace, `src/workspace.ts` validates navigation, and `app.json` and `eas.json` hold mobile configuration. In this repository, `app/admin/admin.css` controls responsive CRM sign-out visibility. See [[Sessions/2026-11-11-04]].

- `app/admin/mobile-api.ts` provides native sign-in, sign-out and scoped lead/task snapshots. `tests/mobile-api.test.mjs` exercises the synthetic Appwrite boundary.
- `../Proconsulting-App/src/NativeWorkspace.tsx` and `../Proconsulting-App/src/mobile-api.ts` implement the React Native UI and its API client in the sibling repository.

- `app/admin/lead.tsx` presents the browser conflict reload action. `app/admin/leads.tsx` shows priority in the browser list. `app/admin/crm.server.ts` applies shared lead-edit rules for both clients.

- `app/lib/request-body.server.ts` provides the bounded reader shared by public intake and CRM uploads. `scripts/verify-appwrite.mjs` can exercise staged public intake and verify cleanup.

- `deploy/CRM-FIRST-INSTALL.md` lists the first-install steps for the current VPS and the tested feature-branch release.

## Matching enquiry review — 2026-11-15

`app/admin/crm.server.ts`: relatedEnquiries scoped match query. `app/admin/lead.tsx`: matching contact selector, results and pagination. `tests/manual-leads.test.mjs`: permission and query regression coverage.

## Confirmed contact links

Lead detail contains the confirmed contact workflow. CRM server handles versioned group changes and paginated reads. The leads schema declares the group field and index.

Lead detail offers direct confirmation from matching enquiries. Run the synthetic browser preview with the contacts flag in tests/helpers/cms-preview.mjs.

## Duplicate enquiry decisions

Lead detail renders the manager decision and restore forms. CRM server checks membership, versions and dependencies. Cases, appointments, documents and consultations share the duplicate write guard.

## Saved lead views

The saved view UI lives in app/admin/leads.tsx and persistence lives in app/admin/lead-views.server.ts.

## Bulk lead changes

The lead list renders bulk controls and results. app/admin/bulk-leads.server.ts validates and executes up to ten changes.

## Bulk counselor handoff

The lead list offers counselor filters and a bulk assignment control. The bulk action validates the intended counselor and reason before dispatching individual changes.

## Counselor routing

Routing policy and settings writes live in app/admin/lead-routing.server.ts. The leads page renders controls. The scoped schema declares routing metadata.

## Automatic intake routing

app/admin/intake-routing.server.ts processes a five-row queue page. scripts/intake-routing-worker.mjs runs the bundled service every minute.

See [[Sessions/2026-11-16-02]] for the branch and team authorization call-path inventory.

## Team-scoped lead workspace

app/admin/team-scope.server.ts validates active teams. app/admin/auth.server.ts gates web routes and validates current profile scope. app/admin/crm.server.ts applies team scope before pagination and during edits.

## Team classification tooling

scripts/classify-lead-teams.mjs implements inventory, manifest preview and guarded apply. tests/team-migration.test.mjs verifies write behavior and lock recovery.

## Team directory administration

Team directory forms are in app/admin/team.tsx. app/admin/team.server.ts validates, audits and applies directory and staff changes.

## Team linked work queues

app/admin/team-queues.server.ts serves read-only pages. app/admin/tasks.tsx and app/admin/work.tsx opt in only for loaders.

## Team follow-up edits

app/admin/tasks.tsx enables the existing task controls for team-scoped sessions. app/admin/crm.server.ts guards the mutation.

## Team application edits

app/admin/work.tsx renders the restricted form. app/admin/operations.server.ts implements the narrow mutation.

## Team appointment edits

Team appointment form is in app/admin/work.tsx. The shared saveAppointment service applies scope and patches only allowed fields.

## Team aggregate reports

app/admin/reports.server.ts implements team scans. app/admin/reports.tsx shows aggregate totals and restricts export controls.

## Team CSV export

app/admin/export.ts accepts team sessions. app/admin/reports.server.ts scopes and audits the export.

## Team consultation reads

Consultations service builds date and contact filters; report and history routes accept team sessions for reads.

## Team consultation recording

The consultation history route renders the team counselor selector and the service validates team access during writes.

## Team document checklist

documents.server.ts projects metadata and denies protected operations. documents.tsx renders the scoped checklist.

## Team private downloads

app/admin/document-download.ts supplies the auth refresh, and app/admin/documents.server.ts enforces scope and scan eligibility.

## Team document reviews

documents.tsx enables the restricted review form; documents.server.ts checks scan, ownership scope and version.

## Team document uploads

documents.tsx exposes the opted-in upload form. documents.server.ts enforces team scope and scanner checks.

## Appointment reminders

The worker candidate scan is in scripts/remind-tasks.mjs. app/admin/reminder-policy.ts supplies current appointment logic.

## Case deadline reminders

Case candidate lookup and notification revalidation share scripts/remind-tasks.mjs and app/admin/reminder-policy.ts.

## Resend outbox

scripts/email-outbox.mjs stores and delivers durable requests; scripts/email-worker.mjs runs them under PM2.

## Staff reminder email

scripts/staff-reminder-email.mjs implements producer and send authorization; scripts/worker.mjs and scripts/email-worker.mjs wire both sides.

## Resend delivery events

app/routes/api.resend-webhook.ts verifies and records provider events. scripts/staff-reminder-email.mjs checks suppression.

## Email delivery operations

app/admin/email-delivery.tsx renders operations; app/admin/email-delivery.server.ts gates and projects the data.

## Staff email preferences

`app/admin/settings.tsx`: self-service email preference loader and action. `tests/reminder-preferences.test.mjs` and `tests/staff-reminder-email.test.mjs`: synthetic route and worker acceptance.

## Staff email pilot

`tests/reminder-email-pilot.test.mjs` exercises the full workflow using the real reminder and email modules and a simulated provider.

## Staff email release preflight

`scripts/check-email-pilot.mjs` checks six Appwrite collections using metadata reads and reports incompatible attributes or indexes.

## CRM edge smoke check

`scripts/check-crm-edge.mjs` checks the public redirect, HTTPS login and anonymous mobile endpoint without signing in.

## Linked contact profiles

`app/admin/contact-profile.tsx` renders the linked enquiry profile. `app/admin/crm.server.ts` scopes and projects its data.

## VPS operator handoff

`deploy/HAMY-CRM-HANDOFF.md` maps implemented CRM workflows, feature gates and the pinned first-install release to the exact VPS runbook sections.

## Duplicate enquiry review

`app/admin/duplicate-review.tsx` displays the source, retained enquiry and archive blockers. `app/admin/crm.server.ts` supplies the read-only preview and the shared archive gate.

## Duplicate merge planning

`app/admin/duplicate-review.tsx` exposes Compare linked work. `app/admin/crm.server.ts` gathers projected dependency counts for each side. `tests/manual-leads.test.mjs` verifies count separation and private-field boundaries.

## Duplicate follow-up transfer

The duplicate-review action calls moveDuplicateTask in crm.server.ts. Tests cover transfer, stale forms, blockers and uncertain audit completion.

## Office expenses

`app/admin/finance.server.ts` validates and records expenses and computes bounded monthly totals. `app/admin/finance.tsx` renders the web workflow. `app/admin/mobile-api.ts` exposes finance reads/writes. The separate mobile checkout contains `src/Finance.tsx`.

## Expense void corrections

`voidExpense` in `app/admin/finance.server.ts` is shared by the web action and native finance API. The native screen collects a reason and preserves uncertain retries.

## Monthly expense export

`app/admin/finance-export.ts` serves the owner-only month CSV. `exportExpenses` in `finance.server.ts` uses `csvCell` from the existing report service.

## Monthly office budget

Budget read/write and remaining calculation live in `app/admin/finance.server.ts`. The web Finance form and native Finance screen use the same service through their existing actions.

## Expense payment details

Payment fields span finance.server.ts, finance.tsx, mobile-api.ts and the native Finance screen. No separate payee directory or payment provider is introduced.

## Expense search and filtering

`app/lib/expense-search.ts` contains the pure expense filter. Its matching native copy is `src/expense-search.ts` in Proconsulting-App. Keep the two copies synchronized when changing filter semantics.

## Expense receipts

`app/admin/expense-receipts.server.ts` validates, scans, uploads and downloads owner-only receipts. `app/admin/expense-receipt.tsx` serves the private browser workflow. The native Finance screen opens that page in the system browser.

Receipt attachment downloads use the dedicated resource route `app/admin/expense-receipt-download.ts`, separate from the rendered receipt page.

## Finance readiness command

`scripts/check-finance.mjs` reads finance schema and receipt bucket metadata. Optional `--scanner` sends a synthetic clean PDF to the configured scanner without saving a file.

## Repeated office expenses

`copyExpenseDraft` in `app/lib/expense-search.ts` and its matching native copy whitelist reusable fields. Web/native Finance show the draft in the standard entry form.

## Yearly office spending

`expenseYear` and `exportExpenseYear` in finance.server.ts supply `finance-year.tsx`, the `finance-year-export.ts` resource and native finance-year API. Native Finance renders the same aggregate response.

## Finance release preflight

`scripts/check-crm-edge.mjs --finance` checks anonymous monthly/yearly API denial and private caching; `tests/crm-edge.test.mjs` covers missing/exposed routes, content type, caching and connection failure.

## Native consultations — 21 November

`app/admin/mobile-api.ts` exposes consultation history and recording; `tests/mobile-api.test.mjs` verifies the adapter with synthetic storage. Separate mobile checkout: `src/Consultations.tsx` is the native lead panel, `src/mobile-api.ts` contains typed calls, and `tests/consultations-api.test.mjs` verifies request encoding/retries.

## Native consultation reports — 21 November

`app/admin/mobile-api.ts` projects consultation reports for the native client. `tests/mobile-api.test.mjs` exercises combined filters, dates, role denial, paging and projection. In the separate mobile checkout, `src/ConsultationReport.tsx` is the report tab and `src/mobile-api.ts` holds typed filter/page calls; the consultation API test also checks query encoding.

## Native follow-up lifecycle — 21 November

`app/admin/crm.server.ts` exports `followUpFor` for scoped detail reads; `app/admin/mobile-api.ts` adds detail and PATCH routes without changing older snapshot payloads. `tests/mobile-api.test.mjs` verifies shared web/mobile behavior. In the separate mobile checkout, `src/FollowUpEditor.tsx`, `src/NativeWorkspace.tsx`, typed API calls and `tests/follow-ups-api.test.mjs` implement the native workflow.

## Retry-safe follow-up creation — 21 November

`app/admin/crm.server.ts` implements retry-safe creation; `app/admin/lead.tsx` emits and preserves submission IDs/drafts; `app/admin/mobile-api.ts` adds POST follow-ups and lead form context. `tests/task-creation.test.mjs` covers interrupted writes and original-request identity; mobile API tests cover web-to-native recovery. Separate mobile checkout adds `src/FollowUpCreate.tsx` and typed creation calls.

## Native applications — 22 November

operations.server.ts adds caseFor/updateCaseProgress; mobile-api.ts exposes applications/application. Separate mobile checkout adds src/Applications.tsx.

## Native appointments — 22 November

operations.server.ts adds appointmentFor and the outcome-only save path; mobile-api.ts exposes appointments/appointment. tests/mobile-api.test.mjs covers scope/status/timing/version and lost acknowledgements. Separate mobile checkout adds src/Appointments.tsx and tests/appointments-api.test.mjs.

## Native appointment rescheduling — 22 November

The appointment handler in `app/admin/mobile-api.ts` selects the mutation mode in `app/admin/operations.server.ts`. Calendar and access regressions run in `tests/mobile-api.test.mjs`. The separate mobile checkout implements the form in `src/Appointments.tsx` and its transport in `src/mobile-api.ts`.

## Blog Studio authoring — 22 November

`app/admin/blog-edit.tsx` owns publication fields and search previews. `rich-editor.tsx` handles visual blocks and reader mode. `article-media-picker.tsx` selects recent public images through `media.tsx`. `content.server.ts` merges feature image descriptions into existing metadata and restores them from revisions.

## Native appointment booking — 23 November

`app/admin/mobile-api.ts` issues the form token and accepts booking requests. `app/admin/appointment-booking.server.ts` handles access, conflict checking and creation recovery. `tests/mobile-api.test.mjs` covers the API. In the separate mobile checkout, `src/AppointmentCreate.tsx` owns the form, `src/booking-time.ts` converts the office date and time, and `src/Appointments.tsx` opens the confirmed appointment.

## Offline mobile agenda — 23 November

`app/admin/mobile-api.ts` handles the optional agenda query. The personal mode of `scopedQueue` in `app/admin/crm.server.ts` checks owner and lead scope. Mobile `src/SavedAgenda.tsx` renders titles and times, `src/NativeWorkspace.tsx` handles refresh and invalidation, and `src/offline-cache.ts` owns persistence and expiry.

## Native personal reminder inbox — 23 November

`app/admin/notifications.server.ts` resolves current reminders and their source times. `app/admin/mobile-api.ts` serves the mobile inbox and read action. `tests/mobile-api.test.mjs` exercises recipient and source checks. The mobile checkout contains the inbox in `src/Reminders.tsx` and record navigation in `src/NativeWorkspace.tsx`.

## Native lead activity — 23 November

`app/admin/crm.server.ts` scopes and projects events in `activityFor`. `app/admin/lead.tsx` renders these fields and `app/admin/mobile-api.ts` serves them with mobile-safe author labels. The mobile lead editor is in `src/NativeWorkspace.tsx` in the mobile checkout.

## Native internal notes

The note writer is in `app/admin/crm.server.ts`, the native action in `app/admin/mobile-api.ts` and the editor in the mobile checkout’s `src/NativeWorkspace.tsx`.

## Native application creation

The CRM action is in `app/admin/mobile-api.ts`, creation is in `app/admin/operations.server.ts` and the mobile form is in `src/ApplicationCreate.tsx`.

## Native application detail editing

`app/admin/operations.server.ts` shares field validation with the web form. The mobile editor lives in `src/Applications.tsx`.

## Application document checklist

Rules live in `app/admin/document-domain.ts`. The metadata query is in `app/admin/documents.server.ts`. The native component is in the mobile checkout’s `src/Applications.tsx`.

## Native application search

The filter action lives in `app/admin/mobile-api.ts`. Mobile controls and applied pagination state live in `src/Applications.tsx`.

## Native application deadline filters

Deadline matching lives in `app/admin/operations.server.ts`, API negotiation in `app/admin/mobile-api.ts` and the native controls in `src/Applications.tsx`.

## Application-to-lead navigation

The mobile controls are in `src/Applications.tsx` and `src/NativeWorkspace.tsx`.

## Lead applications

`app/admin/mobile-api.ts` applies lead scope. Mobile navigation and paging live in `src/NativeWorkspace.tsx` and `src/Applications.tsx`.

## Lead appointments

`app/admin/mobile-api.ts` handles the scoped appointment list. The mobile controls live in `src/NativeWorkspace.tsx` and `src/Appointments.tsx`.

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

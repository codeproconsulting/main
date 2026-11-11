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

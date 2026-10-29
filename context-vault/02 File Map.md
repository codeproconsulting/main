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
- `storage.server.ts`, `documents.tsx`, `document-download.ts`: staged private client documents.
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

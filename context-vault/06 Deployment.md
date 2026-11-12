---
tags: [deployment, vps, nginx]
updated: 2026-10-29
---
# Deployment

Full runbook: `deploy/CRM-DEPLOYMENT.md`.

| Surface | Host | Upstream |
| --- | --- | --- |
| Website | proconsulting.uk and existing www alias | 127.0.0.1:3000 |
| CRM | crm.proconsulting.uk | 127.0.0.1:3001 |
| Appwrite | appwrite.proconsulting.uk | Existing Appwrite installation/proxy |

The CRM root redirects to `/admin`. Staff login is `/admin/login`. Static build assets use `/assets/`. The CRM Nginx vhost rejects unrelated public routes and blocks indexing. Preserve the existing Appwrite edge configuration, especially if Traefik already owns ports 80/443.

## Server-only configuration names

`APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_DATABASE_ID`, `APPWRITE_API_KEY`, `SESSION_SECRET`, `DASHBOARD_URL`, `APP_SURFACE`, `HOST`, and `PORT`. Existing public Ghost configuration stays in place until cutover. Do not prefix server secrets with `VITE_`.

## Production gates

DNS → existing edge inspection → TLS → schema readiness → runtime key → owner account/password setup → typecheck/tests/build → PM2 deployment → anonymous/authenticated checks → form persistence → monitoring/backup verification.

No production deployment is currently evidenced. See [[03 Implementation Status]].

## First-day runbook revision

Install the `crm.proconsulting.uk.bootstrap.conf` vhost first (ACME challenges only, other paths 503); obtain the named certificate using Certbot webroot; replace that single active vhost with `crm.proconsulting.uk.conf`; run target-server `nginx -t` and reload. Final HTTPS includes `/admin.data` and `/__manifest` as well as staff paths, logo and assets.

The complete guide now covers port ownership/Traefik, DNS A/AAAA/CDN, protected environment, Appwrite setup/runtime scopes, owner password, build, `--only proconsulting-crm` PM2 startup, renewal hook, boot persistence, smoke checks, updates and rollback. Command-block shell syntax was checked locally; actual Nginx/VPS validation is pending. No service was deployed.

Media metadata/default and a private synthetic storage round trip are verified, but public-host media URLs require the accepted website build. Keep Ghost delivery until CMS-04.

## Reminder runner readiness

REMIND-01 is verified locally and its private source/health schema is provisioned. `scripts/worker.mjs` now handles due tasks only; the separate publishing worker remains independent, and appointment/case reminders are deliberately gated. `docs/IN-APP-REMINDERS.md` covers opt-in PM2 activation using `--only proconsulting-worker`, health, graceful stop, abandoned locks and rollback. PM2 grants six minutes before forcing this worker to exit. No process on the VPS was started.

A disposable private notification and health record passed actual Appwrite CRUD, unread default, recipient/order/due-task queries and direct anonymous denial, then were removed. The production `worker_health/reminders` row was not written. Production health and staff workflow still require the controlled VPS rollout.

## Resend email provider decision

Application email provider: Resend. Activation requires verified sender DNS/domain, sender/reply-to addresses, server-only API/webhook secrets, durable retry/deduplication and delivery/bounce tests. Proposed RESEND_* settings are documented in the deployment guide and are not implemented runtime settings. No provider has been activated.

## CASE-01 acceptance — 7 November 2026

CASE-01 locally accepted: both service forms require appropriate identifying fields/destination and an active CRM assignee; stage choices match service and existing service is fixed. Keyed forms refresh saved values on navigation/version change; missing records return 404. Focused tests cover permissions, stale forms, independent records, audit failures, ambiguous writes, paginated handoff and interrupted-transfer retry. Actual built-app browser exercised both service creations, deadline normalization/display, independent list states, fixed service and second-tab stale rejection. Existing private cases schema checked read-only. Production rollout and case-reminder adapter remain separate gates. See `docs/APPLICATION-WORKFLOWS.md` and `tests/manual/CASE-01-browser.md`.

## CAL-01 appointment acceptance

The existing private appointments collection accepted owner and lead query shapes in a read-only check. CAL-01 code and local tests are ready for the OPS-01 production smoke checklist. Appointment reminder delivery, external calendar sync and availability features have separate gates.

## DOC-01 private document release

The existing private bucket configuration and disposable large-file probe passed. Apply the additive document attributes and configure the CRM service's local ClamAV socket before enabling the release. Verify the real daemon, signature updates, effective encryption, permissions and proxy path using `docs/PRIVATE-DOCUMENTS.md`. No document schema changes or VPS activation were performed in this session.

## TEAM-01 staff release

Provision the additive staff marker and owner/active index. Check CRM server scope for Auth identity lookup and session revocation. Run the isolated Appwrite session check in `docs/STAFF-ACCESS.md` before rollout. The existing project was checked read-only and no staff roles or sessions were changed.

## REPORT-01 reports release

The report requires the existing private leads and activities collections. The query projection and ordering were checked read-only against Appwrite with an empty synthetic filter. Verify report permissions, CSV attachment and the audit record in the release environment. See `docs/CRM-REPORTS.md`.

## CRM-02 lead entry and search release

Provision the two additive lead fields and indexes before starting either updated app process. Both public and manual intake write these fields. Backfill existing search keys and repeat after both processes are updated. The live schema check was read-only. See `docs/CRM-LEAD-ENTRY.md`.

## Consultation tracking release

Run `node scripts/setup-appwrite.mjs --only=consultations` to preview, then apply with the setup key before enabling the routes in production. Confirm the private collection, available attributes and five indexes. Smoke-test logging and counselor/destination filters with synthetic enquiries. See [[Sessions/2026-11-11-03]].

## Mobile app access

The Expo app targets the same CRM hostname as the browser. A live connection check returned a certificate hostname mismatch. Install the matching certificate and verify HTTPS at the CRM origin before device acceptance. The mobile build and the CRM deployment have separate release steps.

## Native API release

The CRM host needs valid TLS and the release containing `/admin/mobile/v1/`. Apply and validate the Nginx template that includes the native session endpoint in the login rate limit. Verify online sign-in, scope and airplane-mode behavior on a device before distributing the native update. The initial native workspace uses the existing Expo runtime, so it can be distributed as an OTA update to compatible preview installs. See [[Sessions/2026-11-11-05]].

Before distributing the native editor, test a mobile lead edit on the deployed CRM, reload the web lead, and confirm an older web or mobile form receives a conflict. See [[Sessions/2026-11-11-06]].

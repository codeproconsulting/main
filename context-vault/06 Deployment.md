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

Verify the target leads schema and exercise one disposable enquiry on the staged website before switching public traffic. Apply the intake-specific request limit at the active edge. See [[Sessions/2026-11-12-01]] and `deploy/CRM-DEPLOYMENT.md`.

The operator will configure the CRM hostname and release on the existing VPS. Use `deploy/CRM-FIRST-INSTALL.md` for the first install and `deploy/CRM-DEPLOYMENT.md` for the full runbook. The target Appwrite owner identity and active staff profile passed read-only verification. The live CRM certificate still does not cover the CRM hostname.

The mobile lead search ships through the existing Android preview runtime after the matching CRM API is deployed and tested on a phone. See [[Sessions/2026-11-15-01]].

## Matching enquiry review — 2026-11-15

Matching-enquiry review uses existing emailKey/phoneKey fields/indexes; historical backfill remains needed for complete matching coverage. No new collection or provisioning performed. Target query smoke required before release.

## Confirmed contact links

Before enabling release use, provision optional leads contactGroup and its index using the scoped leads setup. Verify create, link, query and unlink in the release environment.

Contact workflow browser acceptance used the isolated built-app preview. Apply the additive schema and verify against target Appwrite before release.

The contactGroup field and contact_group index are available on target Appwrite. A synthetic smoke check verified empty defaults, linking, exclusion of the current enquiry, unlink and verified cleanup. Treat this as schema acceptance. Deploy and smoke-test the application separately.

## Duplicate enquiry decisions

Duplicate resolution requires the additive leads fields duplicateOf and duplicatePriorStage, the duplicate_of index, and readable dependency collections. See the deployment runbook.

Target Appwrite now has the duplicate fields, index, and private consultations schema. Dependency reads passed with the setup key. Repeat runtime checks after app deployment.

## Saved lead views

Provision the private lead_views collection and leads priority index before release. Verify reads and writes with the runtime key.

The private lead_views collection and leads priority index are available on target Appwrite. Release runtime verification remains pending.

## Bulk lead changes

Bulk changes reuse the existing lead and lock schema. Verify stage and priority edits through the deployed proxy before release.

## Bulk counselor handoff

Existing owner, lock and linked-work schemas cover bulk handoffs. Verify the deployed proxy and runtime permissions before enabling the workflow for staff.

## Counselor routing

Apply scoped staff and leads schema changes for counselor routing fields and the routed_at index. Verify workload and rotation queries with the release runtime key.

The routing-only staff and leads fields and rotation index are available on target Appwrite. Tests used the setup key; runtime acceptance is separate.

## Automatic intake routing

Enable automatic routing only after the queue schema, worker actor and runtime key are verified. See deploy/CRM-DEPLOYMENT.md.

Target intakeRouting and intake_routing are available. Production website opt-in and worker remain disabled pending VPS configuration and runtime acceptance.

Team scope is design only. Do not enable restricted managers until additive schema, backfill and surface-specific acceptance pass. See [[Sessions/2026-11-16-02]].

## Team-scoped lead workspace

Preview private crm_teams and additive staff and leads scope fields. Do not configure team manager profiles in the release environment until migration and target acceptance are recorded.

Read-only target preview confirmed the new team directory and scope fields are absent. Apply only after migration review. Keep existing staff profiles unchanged until a reviewed classification and runtime checks pass.

## Team classification tooling

The deployment runbook documents aggregate inventory, reviewed manifests, operator role checks and recovery. Never commit classification manifests.

The target aggregate inventory completed before synthetic testing. It returned zero active teams, lead rows and active managers in the configured database. Verify intended release database before using a reviewed manifest or activating managers.

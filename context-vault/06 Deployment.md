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

The operator reports the base CRM is live; public edge checks pass as of 20 November. Exact deployed revision and authenticated feature acceptance remain unverified. See [[03 Implementation Status]].

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

## Team directory administration

Team administration uses the existing target scope schema. Verify the release runtime key can read and write the private directory and audit collections.

Directory and dependency query compatibility verified with the configured Appwrite key. Runtime rollout remains pending.

## Team linked work queues

Read-only team queue release uses current lead team and linked leadId indexes. Verify query shapes and two-team access on the release runtime key.

## Team follow-up edits

No schema change. Verify the runtime key can read parent and staff scope and write tasks, audit and locks. Follow existing targeted lock recovery procedures after an ambiguous write.

## Team application edits

No new schema is required. Verify restricted application edits with the deployment runtime key.

## Team appointment edits

Scoped appointment edits require no schema change. Trial runtime checks must cover calendar conflicts and audit writes.

## Team aggregate reports

Reports use the existing lead team index. Verify scoped report and export denial with the release key and runtime.

## Team CSV export

No schema change. Verify target team index, staff refresh and audit write permissions with the release key.

## Team consultation reads

No schema change. Verify combined date, counselor and destination filters after release.

## Team consultation recording

No new schema. Verify consultation write and scope against the release runtime before staff rollout.

## Team document checklist

No schema change for team checklist. Verify private projection and closed download gate with the release runtime.

Target optional scannedAt now exists. Team checklist projection passed. The remaining review attributes and trusted scanner acceptance are still outstanding for the document write rollout.

## Team private downloads

No schema change. Verify document scanner acceptance and release storage read permissions before staff use.

## Team document reviews

Team review requires the optional reviewVersion attribute. The private reviewNotes attribute and production scanner remain separate rollout checks.

Target scannedAt and reviewVersion are available. Private reviewNotes and production ClamAV validation remain separate checks.

## Team document uploads

See docs/PRIVATE-DOCUMENTS.md for the ENABLE_TEAM_DOCUMENT_UPLOADS flag and release checks.

All optional document attributes are now available on target storage. Team uploads are opt-in and production activation remains pending.

## Appointment reminders

The optional ENABLE_APPOINTMENT_REMINDERS flag belongs on the existing reminder worker. See deploy/CRM-DEPLOYMENT.md.

## Case deadline reminders

Set ENABLE_CASE_REMINDERS only after runtime acceptance. See deploy/CRM-DEPLOYMENT.md.

## Resend outbox

Keep ENABLE_RESEND_OUTBOX disabled pending sender, producer and release acceptance. See deploy/CRM-DEPLOYMENT.md.

Target outbox schema and due index are available. Worker activation and sender acceptance are pending.

## Staff reminder email

See deploy/CRM-DEPLOYMENT.md for flags, sender, allowlist and runtime user access.

## Resend delivery events

See deploy/CRM-DEPLOYMENT.md for event settings, private schema and webhook opt-in.

## Email delivery operations

Workspace setup links to Email delivery for owners and admins. Runtime needs read access to email_outbox and email_events.

## Staff email preferences

Add the optional `staff.reminderEmail` string attribute before rollout (see deployment guide). The read-only target check found it absent; no schema writes were made. Keep delivery disabled until the pilot passes.

## Staff email pilot

The deployment guide lists the pilot sequence, website callback dependency, evidence to check and rollback order. CRM-only routing does not expose the website callback.

## Staff email release preflight

Run the Appwrite preflight with setup metadata access before the live pilot. The target passed. VPS TLS, scoped runtime access and verified Resend delivery still need live acceptance.

## CRM edge smoke check

Run `node scripts/check-crm-edge.mjs` after installing the final Nginx configuration. Signed-in staff and provider checks remain separate.

## Linked contact profiles

The contact profile uses the existing lead contact-group field and index. Verify the profile and scope with synthetic enquiries after deployment.

## Existing VPS checkout

The operator reports that the repository is already pulled into a VPS folder named `main` and is working through Nginx. Hermes should confirm the absolute path, deployed revision, processes, active upstreams and CRM hostname before changing routing. A working public site and an accepted CRM rollout are separate checks.

## Duplicate enquiry review

The preview uses existing lead and linked-work collections and needs no schema change. On the VPS, verify a clear pair and a blocked pair with synthetic enquiries before staff use.

## Duplicate merge planning

The comparison depends on read access to the existing linked-work and activity collections. It requires no additional schema. Verify counts and scope on synthetic VPS records after rollout.

## Duplicate follow-up transfer

No new schema is required. For an uncertain transfer, stop competing writers and inspect the pending activity, task parent and version before using the existing retained-lock recovery procedure.

## Office expenses

Deploy the finance-enabled server before the mobile update. Verify private expenses schema and date index with scoped setup. The runtime key needs expense document read/write. Native owners must sign in again to receive the role field used to show Finance. The mobile finance screen is online-only and excludes finance data from the offline workspace cache.

## Expense void corrections

Provision optional voidedAt, voidedBy and voidReason expense attributes before deploying corrections. Existing records default to active. Verify create/void/total in synthetic target acceptance before mobile delivery.

## Monthly expense export

The expense CSV route uses existing expenses and activities permissions. No schema changes. Verify an owner download and counselor denial after server rollout.

## Finance release handoff update

On 18 November the public CRM HTTPS probe passed TLS validation. The unauthenticated mobile finance path returned JSON 404 Unknown resource, which indicates the served API does not include Finance. The Hermes and first-install handoffs now pin the tested finance release 4633bf5 and include an existing-install update sequence. Runtime directory and exact deployed commit remain unconfirmed.

## CRM live confirmation

The operator confirmed that the CRM is live following the deployment guide. On 18 November, the public login returned HTTPS 200 with certificate validation enabled. The separate mobile finance endpoint still returned 404 Unknown resource. Treat the CRM as deployed, with the finance API rollout tracked separately. The exact running revision and authenticated workflows were not checked.

## Monthly office budget

Provision `expense_budgets` using scoped schema setup before enabling budget saves. Runtime needs budget document read/write and activity writes. Deploy server before publishing the native budget UI. No real budgets were configured during implementation.

The current Hermes handoff pins budget-inclusive release 870c3cd. The live anonymous Finance endpoint still returned JSON 404 Unknown resource. The operator should verify both expense and budget collections before updating the existing CRM process.

## Expense payment details

Apply scoped expenses setup for optional payee, paymentMethod and reference fields before deploying. Older clients can keep recording expenses without these fields. Deploy the updated API before native Finance delivery.

## Expense search and filtering

On 19 November scoped expenses setup and verification passed, including payment fields. This verifies storage readiness and does not establish that the live application has been updated.

## Expense receipts

Scoped expenses setup adds receiptFileId, receiptName, receiptMime, receiptChecksum and receiptScannedAt. Reuse the private document bucket and runtime file permissions. A real configured ClamAV socket is required for upload. Native receipt access opens the web page and requires a browser staff session.

## Finance readiness command

Run `node scripts/check-finance.mjs` with setup metadata access, then `node scripts/check-finance.mjs --scanner` on the VPS with the configured scanner socket. This checks readiness without creating expense records or storing receipts. The clean-file probe does not prove infected-file rejection.

## Repeated office expenses

Expense copying uses the existing Finance API and schema. Verify an original and copied entry remain separate after saving. Native source requires compatible OTA delivery after server acceptance.

## Yearly office spending

Annual Finance needs existing expense, budget, staff and audit permissions. No new schema. Deploy annual report and CSV routes before publishing the native annual screen. Native annual CSV opens the authenticated browser workflow.

## Finance rollout check — 20 November

`node scripts/check-crm-edge.mjs --finance` adds anonymous monthly/yearly Finance checks to the existing edge probe. Base edge passed; both Finance endpoints returned 404 on 20 November. Hermes handoff pins tested yearly-inclusive `e424fee`. Target scanner, authenticated owner/non-owner checks and mobile delivery remain pending. No VPS changes performed.

## Native consultations — 21 November

MOB-05 requires the consultations GET/POST mobile resource and existing private consultations schema/runtime document access. No schema changes were applied. Accept anonymous 401, counselor current-lead isolation, owner counselor credit selection, web/native history parity, future-date rejection and retry deduplication before mobile publication. Finance deployment remains deferred; no VPS or OTA change was performed.

## Native consultation reports — 21 November

Native consultation reports require the matching `consultation-report` API resource and existing consultation indexes/private document read access. No schema changes or provisioning performed. Verify owner/admin/unrestricted-manager reports, counselor/editor/restricted-manager denial, combined filter parity with web and enquiry drill-down before OTA. No rollout attempted.

## Native follow-up lifecycle — 21 November

MOB-07 requires the new follow-up detail/PATCH API and existing private tasks/activities/locks access. No schema changes or provisioning performed. Accept counselor current-lead/task-owner checks, manager access, stale versions, complete/cancel/reschedule parity and pending audit reconciliation before native delivery. Old mobile snapshot responses are unchanged. No VPS or OTA release performed.

## Retry-safe follow-up creation — 21 November

MOB-08 needs updated web lead forms, lead API form context and POST follow-ups. Existing tasks/activities/locks read/write access is used; no provisioning performed. Existing open web forms must reload for a submission ID. Accept web/native repeated-save deduplication and audit recovery before mobile publication. An unconfirmed remote task write retains lead/staff locks; stop owning processes and reconcile task/audit/request before targeted lock removal. No blind expiry takeover.

## Native applications — 22 November

Application API uses existing cases/activities/locks. No schema provisioned or VPS/OTA release performed. Accept scope/conflicts and native interaction before delivery.

## Application acceptance follow-up

Native application updates require current staff/case/lead authorization plus optimistic versions. Unconfirmed writes retain lead/staff-access locks; reconcile after stopping owning processes before targeted removal. Existing cases/activities/locks suffice. No deployment performed.

## Native appointments — 22 November

MOB-10 needs GET appointments/appointment and PATCH appointment plus existing private appointment/lead/staff/activities/locks access. No schema provisioning. Verify all status/timing/scope boundaries before OTA. Unconfirmed outcome writes retain lead/staff-access/calendar locks; stop owning processes and reconcile before targeted lock removal. No VPS changes performed.

## Native appointment rescheduling — 22 November

Deploy the appointment PATCH handler before releasing the compatible mobile JS update. Verify a scoped move, a conflicting slot and the recorded reason on the release candidate. This feature reuses the existing private collections and routes. VPS rollout, OTA publication and handset acceptance are pending.

## Blog Studio authoring — 22 November

CMS-05 ships with the existing dashboard build on crm.proconsulting.uk. It reuses the current media, post, revision, audit and authentication configuration. On the release candidate, open Blog Studio, use a public library image in a draft, preview, save for review and reopen. Local acceptance is complete. VPS rollout and Ghost cutover remain separate.

## Native appointment booking — 23 November

The native booking form requires the lead response with bookingSubmissionId and authenticated POST to `/admin/mobile/v1/appointments?id=<lead-id>`. The form uses existing Appwrite collections and locks. Deploy and verify the matching API before releasing the mobile bundle. No production or signed-device evidence was recorded in this review.

## Offline mobile agenda — 23 November

The workspace resource accepts the optional agenda=1 query flag. The implementation reuses the existing appointment owner/start index and the mobile runtime’s SecureStore. Verify chronological results, current assignment, an offline restart and a refresh after a calendar write on the release candidate before OTA. No production change was performed.

## Native personal reminder inbox — 23 November

Release the CRM mobile reminder endpoints before publishing the mobile update. Existing reminder storage and generator configuration are reused. Verify list, read and linked-record access with a test staff account on a physical phone after rollout. Mobile commit `59a0399` is local to `codex/mobile-staff`, which has no configured remote. The CRM API must reach the VPS before publishing a compatible mobile update. Physical-phone verification, VPS rollout and OTA publication are pending.

## Native lead activity — 23 November

Release the CRM first. Its online lead response enables the timeline control in a compatible mobile update. Existing activity storage and indexes are reused. Check an assigned lead and a permission change on a test phone after rollout. Mobile commit `7914a0a` is local to `codex/mobile-staff`, which has no remote. VPS rollout, OTA publication and physical-phone checks remain pending.

## Native internal notes

Roll out the CRM API first. Its online lead response enables note entry in the matching mobile update. Existing activity storage is reused. Mobile commit 29add60 is local. VPS deployment, OTA publication and physical-phone testing remain pending.

## Native application creation

Deploy the CRM first to advertise application creation in online lead details. The existing case and activity collections are reused. Mobile commit d740660 is local and the checkout has no remote. VPS rollout, OTA publication and physical-phone acceptance remain pending.

## Native application detail editing

Mobile commit 7b5d315 is local. Roll out the CRM before publishing the compatible update. Physical-phone verification is pending.

## Application document checklist

Release the CRM API before publishing the mobile update. The feature reuses existing document storage, metadata and indexes. Mobile commit 94100b2 is local. VPS deployment, OTA publication and physical-phone testing remain pending.

---
tags: [status, verification]
updated: 2026-10-29
---
# Implementation status

This note distinguishes **code written**, **checks passed**, **remote resources provisioned**, and **production deployed**. A screenshot or successful build does not prove a live deployment.

## Current session and continuation

**Read [[Session Wall]] and [[Feature Ledger]] first.** CMS-02 public-readiness work is complete. CMS-03 visual editor/revisions/scheduling acceptance is complete locally. The next bounded feature is MEDIA-01; read the Session Wall for exact actions. All later modules written during this session are staged and require their own acceptance work. Historical foundation verification below applies to its recorded checkpoint, not automatically to all subsequent changes.

## Implemented in the working tree

- Server-side staff login and active-role checks; same-origin mutation checks; host-only sessions.
- Lead lists/details, assignment, stage/priority changes, internal notes, and activity history.
- Follow-up task creation, ordering, overdue display, and outcome/completion.
- Initial sanitized HTML blog editor and role-separated publication capability.
- Common intake path for main contact, education assessment, immigration contact, and education blog sidebar.
- Two-process PM2 configuration and additive CRM Nginx example.
- Obsidian context vault and recurring documentation maintenance.

## Appwrite provisioned

An additive setup run created the `proconsulting` database and private `staff`, `leads`, `tasks`, `activities`, and `posts` collections with attributes/index definitions. The initial setup encountered a database row-size limit; long details fields were adjusted to a text-capable size and the setup resumed successfully. Index readiness and functional queries require the verification steps recorded below.

The requested first owner identity and private owner profile for `admin@proconsulting.uk` were created. Its initial random password was not printed or emailed; its owner must choose a password in Appwrite Console before sign-in.

## Verification

All five collections have available attributes/indexes and no broad permissions. A live synthetic exercise passed SSR session creation, private CRUD, indexed CRM queries, and rejection of direct client-session access. All synthetic test resources were removed.

Fourteen local authorization/workflow tests passed after the security updates. Typechecking and the production build passed. npm reported zero known vulnerabilities after compatible React Router 7 and transitive updates.

The local login page was inspected in the in-app browser. Production-mode smoke checks with exact Nginx-style Host/forwarded-protocol headers passed: login 200, CRM root redirects to `/admin`, anonymous lead access redirects to login, cross-origin logout is rejected with 403, private cache headers are present, and public Google/Meta tracking is absent from staff HTML. Temporary preview servers were stopped afterward. These checks do not establish DNS, TLS, or deployment on the actual VPS.

## Not deployed

No SSH connection or VPS filesystem change has been performed. The DNS record, active proxy technology/listeners, TLS certificate, PM2 processes on the VPS, and first successful production sign-in remain unverified. Nginx files in Git are deployment artifacts, not evidence of installation.

## New staged work, not accepted as complete

Unified Ghost/Appwrite public content API, private Ghost source preservation/draft import, visual editor/revisions/scheduling, background reminders, cases, appointments, private documents, media, staff access, and operational reports/export now have implementation code. The draft import reconciles 30 posts and one page with zero source/identity/date/authorship/sanitization problems. Imported posts remain drafts and the public provider remains Ghost.

Feature-level verification gaps, unprovisioned media metadata, stale-lock recovery, production cutover, and deployment dependencies are recorded in [[Feature Ledger]] and [[Session Wall]]. Private document/editorial buckets were provisioned but actual storage/scan/download behavior still needs validation. No new module is declared production-ready merely because a build passes.

## Remaining planned work

Email/WhatsApp reminder delivery; durable outbox and scheduler; visual rich-text editor; revisions/review scheduling; full Ghost import and public adapter cutover; application and private-document modules; team-scoped manager access; robust distributed transactions; exports and reporting beyond the initial overview.

See [[08 Roadmap]] and [[Changes/2026-10-29]].

## Latest CMS-02 verification

All five readiness criteria passed with 32 tests, typechecking, and a production build. Both blog sections render on the server; missing posts return 404, outages 503, and the sitemap includes all published pages beyond the first 100. A compiled-loader read-only Appwrite check returned zero exposed drafts in both sections. The public provider remains Ghost. Main merges are authorized after feature acceptance, with rollback references and release isolation; the current staged branch is not yet a wholesale release candidate.

## CMS-03 verification work

Hardened publisher/editor boundaries, scheduled dates, nonempty content, deterministic revisions, stale-safe restore, pre-mutation audit intents, and an independent scheduled-publication runner. Browser checks found and fixed visible editor clearing and stale form values after save. The isolated browser workflow and focused scheduler/service tests passed; final command results are recorded in [[Session Wall]]. The schedule index is provisioned and its live query passed read-only. Publishing and reminder workers remain disabled on the VPS. See [[Sessions/2026-10-29-03]].

Final CMS-03 verification: six acceptance criteria passed, with 48 automated tests, typecheck, production build, isolated browser checks, vault-link validation, and source credential scan. The preview processes were stopped. No production worker, provider switch, real content publication, or main merge occurred.

## MEDIA-01 and deployment instructions (supersedes earlier media gaps)

Editorial uploads now enforce media capabilities, supported MIME/basic signatures, 5 MiB file and 6 MiB multipart limits, required alternative text, publisher-only stale-safe visibility changes and private/no-store boundaries. Failed metadata writes preserve acknowledged records and compensate confirmed orphans; uncertain outcomes retain an identifiable audit intent. Focused tests and the isolated browser upload/publish/unpublish workflow pass.

The private media metadata collection is provisioned, with new records defaulting to unpublished. The existing media bucket's private/encrypted/antivirus/extension/size configuration was verified. A real synthetic image and private metadata record passed byte-identical download and anonymous denial, then were deleted. Scanner internals and the client-document workflow remain unverified. Final command evidence is in [[Session Wall]] and [[Sessions/2026-10-29-04]].

The subdomain runbook was rewritten with ACME-only bootstrap, final HTTPS routing, environment/scopes, first owner, CRM-only PM2 startup/reboot persistence, smoke checks and rollback. All shell blocks pass syntax checks. Nginx is unavailable on this local machine; target-server syntax, existing edge discovery, certificates, DNS and reboot checks remain required. This is not production deployment or Ghost cutover.

## REMIND-01 verification (supersedes reminder staging status)

Due-task in-app delivery is isolated from publishing/cases/appointments. Deterministic generation/assignee IDs preserve read state and suppress duplicates across retries/lost acknowledgments/concurrency. Each candidate is re-read under the assignment/task lead lock. Inbox and Mark read recheck the current recipient, source version/due date and lead ownership.

Complete/Cancel/Reschedule now require current task version and reason/outcome, record audit intent first and invalidate old notices. Private cycle health, manager setup status and graceful stop handling are implemented, with explicit fail-closed crash recovery. 29 focused engine/runner/workflow tests and actual built-app browser checks passed; the actual CLI was also run against the isolated in-memory API only. Final global verification is recorded in [[Session Wall]].

Notification source fields/unread=false default and private worker_health schema were provisioned. A real disposable private notification/health CRUD, query and anonymous-denial exercise passed, with both records removed. No production health/reminder cycle was run. VPS worker activation, external messaging and case/calendar reminders remain separate gates.

## CASE-01 started — 3 November

Application authorization now runs inside the shared lead lock; a queued reassignment regression passes. CASE-01 remains incomplete. Newly fetched upstream main through 0397d6d still requires review/integration before more feature work. See [[Sessions/2026-11-03-01]].

Upstream 0397d6d is now integrated with a merge commit, preserving TOEFL and service-location pages plus CRM routes. Post-merge checks are recorded in the Session Wall. CASE-01 remains in progress.

## CASE-01 audit recovery — 6 November 2026

Application saves now record a pending intent with case ID and versions before the mutation, then mark it completed. Failed intent prevents the write; lost acknowledgment preserves the committed version and pending recovery evidence. Four added focused regressions cover independent records, validation/access, audit failure and ambiguous writes. Global tests/typecheck/build pass. CASE-01 remains incomplete: ownership transfer/listing, kind-specific policy and browser checks remain. No production deployment or provider activation.

## CASE-01 handoff — 7 November 2026

Lead reassignment now transfers every linked application, including terminal records, in pages of 100 under the lead lock and increments application versions. Regression tests verify old-owner listing/edit revocation, new-owner listing/edit access, stale forms and 102-record pagination. The first verification found a TypeScript inference error; an explicit page type corrected it. Final checks are recorded in Session Wall. CASE-01 remains incomplete: kind-specific policy, interrupted transfer recovery and browser acceptance remain. No production changes.

## CASE-01 service policy and recovery continuation

Added service-specific stage choices to server validation and the application form: immigration excludes education offer/deposit/enrolment stages; Shortlisted remains for legacy intake compatibility. Existing application service cannot be changed; create a separate application instead. Added an interrupted multi-record handoff test: pending audit and old lead owner remain after failure, new counselor access stays blocked, and an intentional retry reconciles application owners. Browser acceptance and required-field completeness review remain open; CASE-01 is not complete.

## CASE-01 acceptance — 7 November 2026

CASE-01 locally accepted: both service forms require appropriate identifying fields/destination and an active CRM assignee; stage choices match service and existing service is fixed. Keyed forms refresh saved values on navigation/version change; missing records return 404. Focused tests cover permissions, stale forms, independent records, audit failures, ambiguous writes, paginated handoff and interrupted-transfer retry. Actual built-app browser exercised both service creations, deadline normalization/display, independent list states, fixed service and second-tab stale rejection. Existing private cases schema checked read-only. Production rollout and case-reminder adapter remain separate gates. See `docs/APPLICATION-WORKFLOWS.md` and `tests/manual/CASE-01-browser.md`.

## CAL-01 appointment acceptance

CAL-01 passed local acceptance for booking, overlap handling, reschedule and outcome reasons, timezones, stale edits, lead handoff and recovery. Built-app browser acceptance and 104 automated tests passed. Production deployment remains a separate gate.

## DOC-01 private document acceptance

Locally verified with a synthetic scanner and Appwrite fixtures. The built CRM passed upload, review, expiry, checklist, rejected upload and download. The existing private Appwrite bucket also passed a disposable 20 MB chunked upload, byte comparison and anonymous denial. The test file was removed. Schema changes were previewed only. Live ClamAV acceptance, additive metadata provisioning and VPS rollout remain release gates.

## TEAM-01 staff access

Verified locally with a built-app browser workflow and synthetic Appwrite tests. The owner and admin guards, concurrent owner changes, handoff requirement, immediate CRM denial, retryable revocation and ambiguous writes passed. The existing project was inspected read-only. Staff schema provisioning, live session revocation and rollout remain release steps.

## REPORT-01 operational reports and CSV export

Locally verified. Operational reports aggregate current leads from bounded cursor pages and use a separate field projection from CSV. Exactly 10,000 records can be exported. A further record marks counts partial and prevents CSV delivery. The built CRM displayed synthetic report breakdowns and downloaded an attachment. Live verification was limited to read-only query syntax. VPS smoke checks remain pending.

## CRM-02 manual entry and contact search

This slice is locally verified. Browser checks covered manual creation, formatted phone search, case-insensitive email search and stage filtering. The Appwrite dry run found the two new lead attributes absent. Schema provisioning, legacy backfill and production rollout remain pending. Duplicate handling, saved views and bulk actions remain part of CRM-02.

## CONSULT-01 consultation tracking

Locally verified. Staff can record completed consultations on enquiries, and managers can filter consultation history and counts by counselor and destination. Attribution remains stable after reassignment. The live Appwrite dry run found the private collection absent. Provisioning and production smoke checks remain pending.

## MOB-01 React Native staff app

The sibling mobile project builds the existing CRM workspace into a React Native app. Expo finished the Android preview APK and the iOS simulator archive. Both artifacts were downloaded and inspected. Phone-width sign-out was verified against the synthetic CRM. Live device acceptance awaits the CRM certificate correction and deployment.

### MOB-02 native staff workspace

The native sign-in, lead and follow-up screens and shared CRM API are implemented locally. A loaded snapshot stays readable during connection loss for up to 15 minutes in the running app. First sign-in, a cold-start data load and all writes require connectivity. Native editing, durable offline storage and full feature parity remain planned. Production release and physical-device verification are pending. See [[Sessions/2026-11-11-05]].

### MOB-03 shared lead editing

Mobile stage and priority editing and the web priority column and conflict reload action are implemented. Synthetic integration verified both directions of the shared edit and conflict flow. Device and deployed dashboard checks are pending. See [[Sessions/2026-11-11-06]].

### OPS-02 audit remediation

Intake byte limits, candidate schema/intake verification, handoff retry behavior and work-queue pagination are implemented locally. Follow-up paging is also implemented in the sibling mobile app. Appwrite leads fields and indexes were provisioned. Candidate intake against Appwrite passed. Deployment and device checks are open. See [[Sessions/2026-11-12-01]].

MOB-04 native lead search is implemented locally. Device acceptance and preview release await the CRM VPS rollout. See [[Sessions/2026-11-15-01]].

## Matching enquiry review — 2026-11-15

CRM-02 matching-enquiry review implemented locally. Synthetic access and query checks pass; browser and target Appwrite acceptance remain pending. Canonical contact separation and merge remain planned.

## Confirmed contact links

Confirmed contact group creation, linking and unlinking are implemented with focused synthetic checks. Browser and provisioned-schema acceptance remain pending. Profile editing and duplicate merging remain open.

Chrome verified the confirmed contact workflow against the synthetic preview. Target schema and release smoke checks are still pending.

Confirmed contact linking passed all four session checks, including isolated Chrome and target Appwrite. Application rollout is pending. The broader duplicate resolution workflow remains planned.

## Duplicate enquiry decisions

Duplicate archive and restore implemented. Synthetic regression coverage passes. Target fields, dependency collections and live acceptance remain pending.

Duplicate archive and restore passed service, Chrome, and target storage acceptance. Production app rollout and checks with the VPS runtime key remain pending.

## Saved lead views

Saved lead views are implemented and covered by synthetic service tests. Release checks are tracked on the Session Wall.

Saved views passed the isolated Chrome and target storage checks. Production rollout remains pending.

## Bulk lead changes

Bulk stage and priority changes implemented. See the session wall for verified checks.

## Bulk counselor handoff

Bulk assignment and counselor filters are implemented. Synthetic transfer, conflict and unconfirmed-outcome checks passed.

## Counselor routing

Counselor availability, capacity and manager-triggered round robin are implemented. Automatic intake and team-scoped assignment remain planned.

Manager-triggered routing passed service, Chrome and target storage checks. VPS runtime and automatic intake routing remain pending.

## Automatic intake routing

Automatic intake routing implemented behind explicit opt-in. VPS activation remains pending.

The built CLI and target queue acceptance passed. Production activation remains pending.

The branch/team authorization map and migration design are documented in [[Sessions/2026-11-16-02]]. Runtime enforcement remains planned.

## Team-scoped lead workspace

Restricted manager web leads, matches and stage/priority edits implemented. Schema provisioning, classification and activation remain pending.

## Team classification tooling

Aggregate inventory and reviewed classification tools are implemented. Real staff and enquiry classification still requires reviewed mappings.

Team directory, optional manager scope and indexed lead field now exist in target storage. Synthetic preview and two-team index checks passed. Production profile configuration and activation remain pending.

## Team directory administration

Team directory administration and manager scope controls implemented. Linked workflow and mobile access remain gated.

Team administration passed isolated Chrome and service acceptance. Target directory and guard query shapes passed read-only checks.

## Team linked work queues

Team manager read-only tasks, cases and appointments implemented. Linked writes and other restricted surfaces remain denied.

Team linked queues passed synthetic service and Chrome acceptance. Target query compatibility passed read-only.

## Team follow-up edits

Team follow-up completion, reschedule and cancellation implemented. Other linked mutations remain gated.

Team follow-up edits passed synthetic service and Chrome acceptance. Runtime release remains pending.

## Team application edits

Team application stage and deadline edits implemented. Appointment writes remain gated.

## Team appointment edits

Team appointment reschedule and outcome updates implemented. Booking creation stays outside team scope.

## Team aggregate reports

Team aggregate reports implemented. CSV and consultation reports remain gated.

## Team CSV export

Team CSV export implemented; consultation report scope remains separate.

## Team consultation reads

Scoped consultation history and reporting implemented. Recording remains gated for team managers.

## Team consultation recording

Team consultation recording implemented.

## Team document checklist

A read-only team document checklist is implemented.

## Team private downloads

Team scanned document downloads implemented. Upload and review remain gated.

## Team document reviews

Team document status and expiry edits are implemented. Uploads remain gated.

## Team document uploads

Team uploads implemented behind opt-in. Scanner acceptance and rollout remain pending.

Opted-in team uploads passed synthetic service and isolated Chrome acceptance. Production scanner verification remains pending.

## Appointment reminders

Opt-in in-app appointment reminders implemented.

## Case deadline reminders

Case deadline reminders implemented behind opt-in.

## Resend outbox

Resend transport and outbox implemented. Producer, webhook and delivery acceptance remain pending.

Resend outbox storage and fake-provider delivery verified. No CRM producer or live email configured.

## Staff reminder email

Opt-in staff email integration implemented. Provider delivery and webhook acceptance remain pending.

## Resend delivery events

Signed event handling and suppression implemented. Live webhook and sender setup remain pending.

## Email delivery operations

Email delivery dashboard implemented for owner and admin accounts.

## Staff email preferences

Staff email preferences are implemented and verified with synthetic route and worker tests. A read-only target Appwrite check confirmed the staff collection is private and the new optional attribute is absent. No production release or live send.

## Staff email pilot

Local end-to-end acceptance passed for task email delivery, appointment and case opt-out, bounce suppression, callback replay and private admin counts. Live sender, callback and VPS worker acceptance remain pending.

## Staff email release preflight

The optional preference attribute is provisioned on the target and all six Appwrite preflight checks passed. The public CRM HTTPS request failed certificate hostname validation, and the local checkout lacks the Resend pilot configuration.

## CRM edge smoke check

The edge checker passed against simulated expected responses. The public edge returned 301 instead of the template’s 308 and served a certificate that does not cover the CRM hostname.

## Linked contact profiles

Linked contact profiles are implemented and checked with synthetic records. Contact master records, edits and duplicate dependency reconciliation remain open.

## Duplicate enquiry review

Global managers, admins and owners can preview duplicate archive blockers. Synthetic tests cover all blocker categories, private field projection and a new dependency appearing before submit. Actual record merge remains planned.

## Duplicate merge planning

Implemented and verified a read-only duplicate merge planning view. It compares both enquiries and separates open work from historical tasks and activity. Merge execution remains planned.

## Duplicate follow-up transfer

Open follow-up transfer is implemented for a confirmed pair with the same counselor and team. Archive remains a separate reviewed action. Browser and VPS acceptance pending.

## Office expenses

Owner-only expense entry and monthly category totals implemented on web and native mobile. Private Appwrite collection provisioned. Synthetic storage, month ordering and anonymous denial passed, with cleanup. Browser and physical-device acceptance and VPS application rollout remain pending.

## Expense void corrections

Expense void correction implemented on web and native mobile. Service tests verify role denial, required reason, lost-ack retry, conflicting retry and revised monthly totals. Three optional fields provisioned on private expenses.

## Monthly expense export

Monthly expense CSV export implemented with active/voided status, preserved amounts and void reasons. Synthetic tests verify formula escaping, refreshed authorization and audit failure handling.

## Monthly office budget

Monthly GBP budget entry and remaining/over-budget review implemented for web and native mobile. Synthetic service and built Chrome checks passed. Private schema provisioned and disposable storage/anonymous denial passed.

## Expense payment details

Optional expense payment details implemented for web/native entry, monthly review and CSV. Synthetic tests cover legacy missing fields, enum validation, retry identity and CSV formula safety.

## Expense search and filtering

Finance payment fields are now provisioned and verified on Appwrite after connectivity recovered. Search and multi-field filters are implemented on web and native with filtered active totals. Full-month totals and CSV retain their original scope.

## Expense receipts

One receipt per expense implemented with PDF/PNG/JPEG validation and a 5 MB cap. Synthetic owner, scanner, interrupted upload and download tests passed. Optional schema verified. Actual production scanner and device acceptance remain pending.

## Finance readiness command

Finance readiness command passed against the configured Appwrite project. Tests verify failure on missing receipt fields, unsafe bucket antivirus settings and scanner errors. Real VPS scanner and authenticated rollout acceptance remain pending.

## Repeated office expenses

Manual repeated-expense entry implemented on web and native. The owner chooses the new payment date, reviews the amount and saves an independent expense. Reference, receipt, source identity and void state are not copied.

## Yearly office spending

Yearly spending and monthly budget comparison implemented on web and native, with audited annual summary CSV. Service tests cover totals, void exclusions, unset budgets, over-budget balances and export denial/failure.

## Finance rollout evidence — 20 November

The public base edge passes. Both monthly and yearly Finance API probes return 404, so Finance rollout is still pending. The release checker now has an optional Finance gate and synthetic failure tests. Authenticated production acceptance and native Finance OTA remain unperformed. See [[Sessions/2026-11-20-01]].

## Native consultations — 21 November

MOB-05 consultation history and recording implemented locally. API scope, pagination, input limits, credit spoofing and lost-ack retry passed synthetically. Native component browser checks use DOM shims, not a real phone. Mobile typecheck/lint/nine tests/Android export passed. Server rollout and mobile OTA/device acceptance remain pending. Finance deployment explicitly deferred by user.

## Native consultation reports — 21 November

MOB-06 implements native consultation reporting with combined filters, applied-filter paging, reset, empty/error states and enquiry drill-down. Shared API checks and native component Chrome checks with DOM shims passed. Mobile typecheck/lint/nine tests/Android bundle passed. Actual device, VPS and OTA checks remain separate and unperformed. Finance rollout stays explicitly deferred.

## Native follow-up lifecycle — 21 November

MOB-07 implements native Complete, Cancel and Reschedule with required outcome/reason, current-version validation and reload after conflict or uncertain save. API tests, native request tests, and full workspace Chrome interaction with DOM shims passed. Mobile typecheck/lint/ten tests/Android bundle passed. Physical device, VPS and OTA acceptance remain unperformed; Finance deployment is deferred.

## Retry-safe follow-up creation — 21 November

MOB-08 shared creation and native panel implemented locally. Service tests passed repeated/lost replies, pending audit completion, later task changes, changed payloads, current permissions and interrupted assignment. Web action errors preserve draft identity; cross-platform recovery passed. Native typecheck/lint/ten tests/Android export and component Chrome check with DOM shims passed. Built web browser acceptance and final main checks are recorded in the session journal; device/VPS/OTA remain separate.

## Native applications — 22 November

MOB-09 API synthetic acceptance passed; native panel is implemented but interaction/device acceptance remains pending. No deployment.

## Application acceptance follow-up

MOB-09 local component acceptance passed paging, no-op guard, uncertain reload, deadline clearing, clear-before-write, denial cleanup and late-denial suppression after unmount. Background now hides rather than unmounts the panel. Real-device, VPS and OTA acceptance remain pending.

## Native appointments — 22 November

MOB-10 native appointment list/detail and Completed/Cancelled/No show are implemented locally. Synthetic API and client checks pass; component Chrome interaction with DOM shims passes paging, required reason, cache invalidation, uncertain reload, closed guard and unmounted denial suppression. Mobile typecheck/lint/eleven tests/Android export pass. Production, OTA and device checks remain unperformed.

## Native appointment rescheduling — 22 November

MOB-11 passed local API, component and Android export checks. Counsellors can change the time of a booked meeting and record a reason. Staff still create bookings on the web. See [[Sessions/2026-11-22-03]].

## Blog Studio authoring — 22 November

CMS-05 passed local editor and save/restore acceptance. Staff can add inline links, captioned images, comparison tables and quotes, then inspect the article and search snippet before review or publication. See [[Sessions/2026-11-22-04]].

## Native appointment booking — 23 November

MOB-12 is implemented and tested in the two local worktrees. Assigned staff can book in Karachi office time, choose a duration and location, and open the confirmed meeting natively. The mobile source is committed locally as `6193625` and this CRM checkpoint includes its matching API. VPS rollout, OTA publication and handset verification remain pending. Evidence in [[Sessions/2026-11-22-05]].

## Offline mobile agenda — 23 November

MOB-13 passed local acceptance. Staff can read up to 12 upcoming personal bookings in Karachi time, with the last-sync time and partial results identified. Mobile checkpoint `aa25bfe` is local. Live API, OTA and handset acceptance remain pending. [[Sessions/2026-11-23-01]]

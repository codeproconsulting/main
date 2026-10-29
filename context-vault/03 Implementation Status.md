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

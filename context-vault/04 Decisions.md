---
tags: [architecture, decisions]
updated: 2026-10-29
---
# Decisions

## ADR-001: Same codebase, separate website and CRM processes

**Accepted:** 2026-10-29. Use one React Router build with loopback ports 3000 and 3001 and hostname routing at the VPS edge. This preserves the public site and allows independent process restarts. Shared build, VPS, and backend still create shared failure domains.

## ADR-002: CRM hostname

**Accepted by user:** `crm.proconsulting.uk`. Appwrite remains `appwrite.proconsulting.uk`; its API endpoint ends in `/v1`. The React Router dashboard path is `/admin`, with a redirect from the CRM hostname root. No Nginx path rewrite is needed.

## ADR-003: Server authorization for all staff data

The previous shared-password/client-state gate did not secure the server handlers. Replace it with real Appwrite sessions and active staff profiles checked on every loader and action. Privileged REST calls require explicit policy checks. Role edits cannot come from ordinary account preferences.

## ADR-004: Keep Ghost readers until migration validation

Preserve current public URLs and public Ghost delivery while building the Appwrite CMS. Dashboard posts do not automatically become public website posts in this initial increment. Resolve tags, historical routes, assets, source conversion, metadata, and redirects before cutover.

## ADR-005: Conservative initial authoring

Use a sanitized HTML editor first. Clearly label the last-saved preview and do not call this a complete rich-text editor. Existing slugs/sections are locked until redirect management exists.

## ADR-006: Single CRM instance for initial concurrency control

Use a keyed in-process queue and record versions for interactive edits. This does not provide distributed transactions, worker coordination, or atomic multi-record audit/assignment changes. Keep `instances: 1` and document those limits until version-specific Appwrite transactions are integrated.

## ADR-007: Documentation is an Obsidian vault in the repository

Use ordinary Markdown, relative wiki links, minimal core Obsidian configuration, and an automated source inventory. Keep secrets and personal data out. Maintain notes alongside substantial code changes and through a daily documentation-only heartbeat.

## ADR-008: Explicitly trusted reverse proxy in the runtime

Use a small Express/React Router server instead of relying on the default serve CLI. Trust forwarded scheme/host only from loopback, matching the local Nginx edge. This preserves the HTTPS request origin used by both staff cookies and CSRF checks after the React Router security update.

## ADR-009: Use only this project's existing brand

User correction, 29 October 2026: ProConsulting is independent of all other Codex projects. Use this repository's actual `public/Logo_main.png`, public CSS pink `#E91E8C` and blue `#2B4EAE`, with navy `#0B1B3A` from the existing constants. The initial green dashboard palette and recreated wordmark were incorrect and have been replaced. Dashboard accent colors reference the public CSS variables. No other project's design context should be used here.

## ADR-010: One bounded feature per session with explicit handoff

User requirement, 29 October 2026: comprehensive delivery may span many sessions, but each session must focus on a specific feature and resume remaining work accurately. The canonical structured checkpoint is `session-state.json`; `Session Wall.md` is its generated Obsidian view. [[Feature Ledger]] retains the full scope and staged work. Repository instructions require reading these on "continue". Verification records actual commands and source fingerprints, and completion is refused while acceptance or verification remains incomplete. The documentation heartbeat cannot silently advance feature status.

## ADR-011: Separate scheduled publishing from reminder activation

The dedicated publishing runner can be enabled independently, after rollout checks, without enabling staged reminder workflows. Both publishing and dashboard edits use the same private post lock. Revision snapshots are deterministic and audit intents precede mutation. Crash-left locks deliberately block rather than expire automatically; operational recovery and pending-intent reconciliation are explicit in the publishing runbook. Production activation remains a separate gate.

## 29 October — first-day CRM isolation and private media

Use a certificate-only HTTP bootstrap, then the final HTTPS vhost; never forward staff login over HTTP while requesting a certificate. Start only `proconsulting-crm` during trial to preserve the existing website and Appwrite edge. Include framework root-data and manifest paths in proxy routing. No second edge may bind occupied VPS ports.

Media starts private at both application and schema-default levels. Server routes mediate public image streaming; bucket grants remain private. Durable pre-upload IDs allow operator reconciliation after ambiguous network failures. No automatic orphan sweep or full image decoder is claimed. Next bounded feature is REMIND-01; public cutover remains separately gated.

## 29 October — due-task reminder boundary

Use a deterministic private notification as the durable in-app event, retry at the next 60-second cycle and revalidate state at read time. Do not add an external message provider or claim transactional exactly-once external delivery. Keep publishing independent and leave appointment/case adapters disabled until their parent modules pass. Managers do not implicitly gain access to other staff inboxes.

Preserve abandoned locks instead of guessed expiry takeover; document stop-owner-first recovery. A six-minute PM2 stop grace allows bounded in-flight work to release locks. Expose stale/failed/degraded health to managers, while logging IDs/counts only. Full provider outbox, recurrence/snooze/escalation and task pagination beyond 100 remain separately planned.

## Resend email provider decision

User selected Resend (resend.com) for application email delivery on 3 November 2026. COMMS-01 will use a server-side adapter, durable outbox and verified webhooks; integration remains planned. Appwrite-managed authentication mail needs separate configuration.

## CASE-01 audit recovery — 6 November 2026

Application saves now record a pending intent with case ID and versions before the mutation, then mark it completed. Failed intent prevents the write; lost acknowledgment preserves the committed version and pending recovery evidence. Four added focused regressions cover independent records, validation/access, audit failure and ambiguous writes. Global tests/typecheck/build pass. CASE-01 remains incomplete: ownership transfer/listing, kind-specific policy and browser checks remain. No production deployment or provider activation.

## CASE-01 service policy and recovery continuation

Added service-specific stage choices to server validation and the application form: immigration excludes education offer/deposit/enrolment stages; Shortlisted remains for legacy intake compatibility. Existing application service cannot be changed; create a separate application instead. Added an interrupted multi-record handoff test: pending audit and old lead owner remain after failure, new counselor access stays blocked, and an intentional retry reconciles application owners. Browser acceptance and required-field completeness review remain open; CASE-01 is not complete.

## CASE-01 acceptance — 7 November 2026

CASE-01 locally accepted: both service forms require appropriate identifying fields/destination and an active CRM assignee; stage choices match service and existing service is fixed. Keyed forms refresh saved values on navigation/version change; missing records return 404. Focused tests cover permissions, stale forms, independent records, audit failures, ambiguous writes, paginated handoff and interrupted-transfer retry. Actual built-app browser exercised both service creations, deadline normalization/display, independent list states, fixed service and second-tab stale rejection. Existing private cases schema checked read-only. Production rollout and case-reminder adapter remain separate gates. See `docs/APPLICATION-WORKFLOWS.md` and `tests/manual/CASE-01-browser.md`.

## CAL-01 appointment acceptance

Use one shared calendar lock to coordinate booking and lead transfers on the existing Appwrite deployment. Require reasons for reschedules, cancellations and no-shows. Keep terminal appointment times and outcomes fixed, and book a new record when a closed session needs another time.

## DOC-01 scanning and recovery

Require an explicit clean verdict from a trusted Unix socket before writing any new applicant file. The bucket antivirus setting provides a separate control. Older records with a blank scan marker need a scanned replacement. Use a decimal 20 MB cap and Appwrite's chunk protocol. Preserve pending audit intents when a write may still have committed and compensate only after a definite rejection and confirmed missing metadata. Keep expired scanned files available to authorized staff for investigation.

## TEAM-01 offboarding and uncertain writes

Persist inactive access before attempting session revocation. Retain a marker for retry and require a successful revocation before reactivation. Apply owner safeguards and lead ownership checks under the shared staff access lock. Unconfirmed writes that could change staff access or final lead ownership retain their locks for operator reconciliation.

## REPORT-01 bounded current counts

Scan at most 10,000 leads and use one extra record to detect partial results. Keep exact-cap export available. Refuse oversized export and duplicate cursor results. Use a separate data projection for counts and escape spreadsheet formula prefixes in CSV cells.

## CRM-02 contact keys and manual ownership

Keep display contact values and store separate normalized keys for exact lookup. Preserve explicit country codes. Use the authenticated counselor as their own manual lead assignee and leave manager-created leads unassigned. Use one stable lead ID and audit intent for a retried form submission.

## Consultation attribution

Store the actual counselor separately from the recorder and current enquiry owner. Count completed sessions. Preserve historical credit after lead handoff. A retried form reuses its consultation record ID.

## Mobile workflow delivery

Use the existing CRM routes and staff permission checks inside the native app so deployed features are shared across platforms. Release builds require a valid HTTPS workspace origin. Hand off attachments to the system browser, which can establish its own staff session.

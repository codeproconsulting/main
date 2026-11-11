---
tags: [data, permissions, appwrite]
updated: 2026-10-29
---
# Data and permissions

The current implementation uses Appwrite's collection/document REST API. Collections have no public grants and are accessed through authorized server code. Setup is additive and repeatable; there are no destructive drop/recreate operations.

| Collection | Responsibility |
| --- | --- |
| staff | Auth-user ID linkage, name, active state, role, future team scope |
| leads | Contact details, enquiry source/profile, stage, owner, priority, next follow-up, version |
| tasks | Lead reference, assignee, due date, open/completed state, outcome |
| activities | Restricted timeline, notes, change intents and change results |
| posts | Sanitized article HTML, metadata, section, publication state, legacy reference |

## Current policy

Owners/admins/managers access CRM records organization-wide. Counselors access assigned leads. Editors/publishers access content; publication is restricted to owners/admins/publishers. Editors cannot modify an already published article. Staff with no active profile cannot sign in to the workspace.

Managers' team-only scope is planned, not enforced in this increment. Multi-role staff, private case documents, and client accounts are also future modules. API keys bypass Appwrite permissions; therefore every data handler must retain policy checks even though collections are private.

## Consistency limits

Record versions plus a single-process keyed queue handle basic stale edits. Multi-record assignment, task ownership transfer, audit state, and future reminders need transactional/reconciliation work. The current `activities` stream records intent before lead mutation; failures can leave an intent awaiting review. Do not describe this as an immutable transactional audit system.

## Migration sources

The supplied Ghost export contains 30 posts, one page, one author, three tags, and 29 post-tag links. 27 posts are education, two immigration, and one untagged. The export includes private configuration not used by the migration. Public routing/assets and the untagged post require explicit treatment before cutover.

## MEDIA-01 verified boundary

Private `media` records reference private `crm-media` files, carry alt/caption/MIME/SHA256 and default `published=false`. Editors upload/download; only owner/admin/publisher can change visibility. Counselor/manager editorial access is denied. The public route checks metadata on each new request and returns no-store image responses; unpublishing returns 404 subsequently. Previously downloaded or in-flight bytes cannot be recalled.

Upload IDs are recorded before storage calls. Confirmed missing metadata triggers cleanup; ambiguous writes and cleanup failures require manual reconciliation using the pending activity ID, without deleting referenced files. Private media metadata/file permission and anonymous-denial checks passed against actual Appwrite with disposable data. Private client document workflow/scanner internals remain a separate DOC-01 acceptance gate.

## REMIND-01 records and consistency

`notifications` adds task source ID, version and due timestamp; future records default unread. `worker_health` is private and records only operational state/counts/timestamps. The reminder engine checks active CRM assignees; both inbox and read action revalidate exact recipient/current lead ownership and current task generation. Legacy/unknown kinds stay hidden pending verified adapters.

Cycle/lead locks and deterministic notification IDs handle repeated writes and lost acknowledgments without resetting read state. Complete/Cancel/Reschedule and assignment share lead locks. Audit intents can remain pending after an ambiguous task mutation/creation; reconcile before retry. Locked task creation is not a fully idempotent multi-record transaction. Crashed locks require stopping their owner before targeted removal. See the reminder runbook; no automatic sweeping or TTL takeover is claimed.

## CASE-01 audit recovery — 6 November 2026

Application saves now record a pending intent with case ID and versions before the mutation, then mark it completed. Failed intent prevents the write; lost acknowledgment preserves the committed version and pending recovery evidence. Four added focused regressions cover independent records, validation/access, audit failure and ambiguous writes. Global tests/typecheck/build pass. CASE-01 remains incomplete: ownership transfer/listing, kind-specific policy and browser checks remain. No production deployment or provider activation.

## CASE-01 handoff — 7 November 2026

Lead reassignment now transfers every linked application, including terminal records, in pages of 100 under the lead lock and increments application versions. Regression tests verify old-owner listing/edit revocation, new-owner listing/edit access, stale forms and 102-record pagination. The first verification found a TypeScript inference error; an explicit page type corrected it. Final checks are recorded in Session Wall. CASE-01 remains incomplete: kind-specific policy, interrupted transfer recovery and browser acceptance remain. No production changes.

## CASE-01 acceptance — 7 November 2026

CASE-01 locally accepted: both service forms require appropriate identifying fields/destination and an active CRM assignee; stage choices match service and existing service is fixed. Keyed forms refresh saved values on navigation/version change; missing records return 404. Focused tests cover permissions, stale forms, independent records, audit failures, ambiguous writes, paginated handoff and interrupted-transfer retry. Actual built-app browser exercised both service creations, deadline normalization/display, independent list states, fixed service and second-tab stale rejection. Existing private cases schema checked read-only. Production rollout and case-reminder adapter remain separate gates. See `docs/APPLICATION-WORKFLOWS.md` and `tests/manual/CASE-01-browser.md`.

## CAL-01 appointment acceptance

Lead authorization remains authoritative during partial appointment transfers. Already moved records reserve the target slot, but the receiving counselor cannot read them until the lead transfers. Pending audit intents identify ambiguous saves. Retrying a handoff skips version bumps for appointments already moved.

## DOC-01 document permissions

The document collection stores private metadata and review notes. Only authorized CRM staff with current lead access can list, upload, review or download. Review writes use the lead lock and a version check. Legacy metadata without a scan marker has no download or review action. Checklist readiness requires a clean scan, accepted review and unexpired record. Audit details omit file names, notes and file bytes.

## TEAM-01 role safeguards

Owners and admins manage staff, and only owners can grant or edit the owner role. Self edits are blocked. At least one active owner profile remains. A profile with assigned leads cannot be deactivated or changed to a role without CRM access. The optional team reference remains descriptive.

## REPORT-01 report and export scope

Active owners, admins and managers have current organization-wide report access. Aggregate output omits contact fields. CSV includes only allowlisted fields and requires a fresh session check plus an audit event. The audit event contains the actor and count without exported contact details.

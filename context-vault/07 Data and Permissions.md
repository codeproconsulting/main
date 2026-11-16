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

## CRM-02 manual entry and search permissions

Active CRM staff may add leads. Counselors create and search their assigned leads. Managers retain organization-wide scope and create unassigned leads. Content-only profiles cannot use these routes. Search responses omit notes and detailed intake payloads.

## Consultation records

Counselors log their own consultations on currently assigned enquiries. Owners, admins and managers can record a session for an active counselor and access the organization-wide report. The collection stores staff attribution, destination and date without a duplicate customer profile.

The mobile client uses CRM sessions and role checks. Appwrite keys remain on the server. The mobile app does not maintain its own customer record store.

## Matching enquiry review — 2026-11-15

Related enquiry totals and rows are filtered by current counselor owner before pagination. Managers retain existing organization-wide scope. The source enquiry must also be accessible. Contact values are resolved server-side, not placed in match pagination URLs.

## Confirmed contact links

Confirmed groups and their audit details are visible to CRM managers. Counselors retain access to their assigned enquiries and scoped match suggestions.

## Duplicate enquiry decisions

Managers alone can archive or restore duplicate decisions and see retained links. Counselors retain their existing lead access. Linked-work writes are blocked while marked duplicate.

## Saved lead views

Saved views are listed and changed only for the signed-in staff account. They never change the scope of lead results.

## Bulk lead changes

Bulk changes are manager-only. The server validates each selected lead and version and rechecks current staff access before writing.

## Bulk counselor handoff

Managers can filter by counselor or unassigned and transfer selected leads to an active CRM staff account. Counselors always keep their own assignment scope.

## Counselor routing

CRM managers configure routing and run batches. Only active counselors can be opted in. Lead assignments preserve existing record and audit protections.

## Automatic intake routing

The worker acts under an explicitly configured active manager profile and the shared staff-access lock. It only processes pending, unassigned New enquiries.

The proposed restricted manager policy and legacy defaults are detailed in [[Sessions/2026-11-16-02]]. Existing manager authorization has not changed.

## Team-scoped lead workspace

Team managers have scoped web lead list, match, read and stage/priority edit access. Linked workflows, audit history, reports, exports, cross-team writes and mobile are denied. Writes recheck current team membership under existing locks.

## Team classification tooling

Migration apply requires an active owner or administrator profile and writes per-enquiry audit intent. Inventory outputs aggregate counts only.

## Team directory administration

Owners and admins manage directory entries and staff scope. Manager team access validates live membership on each request. Existing legacy managers retain their scope until edited.

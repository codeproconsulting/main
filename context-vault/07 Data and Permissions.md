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

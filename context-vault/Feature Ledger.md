---
tags: [features, delivery, continuation]
---
# Feature ledger

Only **one feature** is the active session focus. “Code staged” means implementation exists but acceptance checks are incomplete. Global build success does not prove a feature works end to end. Keep the original comprehensive plan as the scope reference.

| ID | Feature | State | Remaining acceptance / dependencies |
| --- | --- | --- | --- |
| CORE-01 | Staff authentication, lead intake, counselor scope, original dashboard | Verified foundation locally | Production login, proxy, runtime key, and regression checks after subsequent changes |
| BRAND-01 | Repository logo and pink/blue/navy branding | Verified locally | Preserve throughout all new screens |
| CMS-02 | Ghost draft import and public-read readiness | Verified locally | Five acceptance checks pass; 32 tests/build/typecheck pass; no public cutover |
| CMS-03 | Visual editor, reviews, revisions, scheduled publishing | **Next session; code staged** | Browser editing/paste/selection, revision permissions/restore, scheduled-date and concurrency tests |
| CMS-04 | Public content migration cutover | Planned | Historical URLs/redirects, media review, untagged post decision, publication reconciliation, provider switch and rollback rehearsal |
| MEDIA-01 | Editorial image uploads/publication | Code staged | Provision metadata schema, verify bucket and upload, private/public boundary, URL use |
| REMIND-01 | In-app background reminders | Code staged | Delivery deduplication, restart/crash handling, cancellation/reschedule/reassignment, operational heartbeat |
| CASE-01 | Applications and immigration cases | Code staged | Multi-application workflow, stage validation, access and ownership transfer tests |
| CAL-01 | Appointment booking | Code staged | Conflict/concurrency, rescheduling, timezones, cancellation and no-show tests |
| DOC-01 | Private client documents | Code staged | Upload limits/signatures, antivirus behavior, authorized streaming, review/expiry/checklists, orphan reconciliation |
| TEAM-01 | Team roles and deactivation | Code staged | Self/last-owner protections, lead transfer, session revocation, profile persistence failure tests |
| REPORT-01 | Operational counts and CSV export | Code staged | Scope, pagination/caps, totals, export audit and formula handling |
| CRM-02 | Advanced lead operations | Planned | Contact/enquiry separation, duplicate review/merge, manual creation, saved views, bulk actions, phone/email search |
| CRM-03 | Assignment and team scopes | Planned | Capacity/availability rules, round robin, branches, genuinely team-scoped managers |
| OPS-01 | Production operations | Planned | Deployment access, existing edge, DNS/TLS, backup/restore, monitoring, narrow runtime key, stale-lock recovery |
| COMMS-01 | Email/WhatsApp/SMS delivery | Planned | Provider configuration, consent, templates, quiet hours, retries and opt-out; no provider activated |
| EXT-01 | Calendar sync, payments, client portal | Planned | Separate requirements and provider setup after core acceptance |

## Completion rule

A feature closes only after its explicit acceptance checks pass, failures and permission boundaries are tested, deployment/configuration dependencies are documented, and the session wall records the evidence. Deployment is tracked separately. A blocked feature keeps its remaining work and can be deferred explicitly; it must not be silently marked complete.

See [[Sessions/2026-10-29-02]], [[03 Implementation Status]], and the full plan at `docs/CRM-CMS-APPWRITE-IMPLEMENTATION-PLAN.md`.

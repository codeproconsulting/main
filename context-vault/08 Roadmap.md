---
tags: [roadmap, implementation]
updated: 2026-10-29
---
# Roadmap

## Current increment

CMS-02, CMS-03, MEDIA-01 and REMIND-01 are verified locally (media/reminders also passed isolated real Appwrite checks). Start the next bounded **CASE-01** session, as specified in [[Session Wall]]. Keep one feature active, finish its acceptance checks, and record evidence before selecting another feature. [[Feature Ledger]] distinguishes staged modules from verified and planned work. General typecheck/tests/build checks do not close a feature automatically.

## Next increments

1. Appwrite-backed public content adapters, Ghost migration tooling, source preservation, media/URL reconciliation, and staged cutover.
2. Durable reminder outbox, scheduler, delivery retries, quiet hours, first-contact escalation, and provider email configuration.
3. Rich-text editing, revisions, review approval, previews, scheduled publishing, and redirect management.
4. Applications/cases, appointments, private documents, destination checklists, and deadlines.
5. Team-scoped managers, invitations/deactivation, assignment reconciliation, advanced reporting, exports, and distributed transactions.
6. WhatsApp/SMS/calendar/mailbox integrations, financial workflows, and a future client portal as separately configured features.

The detailed requirements and acceptance gates remain in `docs/CRM-CMS-APPWRITE-IMPLEMENTATION-PLAN.md`. Progress is recorded in [[03 Implementation Status]] and [[Changes/2026-10-29]].

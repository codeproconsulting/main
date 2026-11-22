---
tags: [roadmap, implementation]
updated: 2026-10-29
---
# Roadmap

## Current increment

CMS-02, CMS-03, MEDIA-01 and REMIND-01 are verified locally (media/reminders also passed isolated real Appwrite checks). Start the next bounded **DOC-01** session, as specified in [[Session Wall]]. Keep one feature active, finish its acceptance checks, and record evidence before selecting another feature. [[Feature Ledger]] distinguishes staged modules from verified and planned work. General typecheck/tests/build checks do not close a feature automatically.

## Next increments

1. Appwrite-backed public content adapters, Ghost migration tooling, source preservation, media/URL reconciliation, and staged cutover.
2. Durable reminder outbox, scheduler, delivery retries, quiet hours, first-contact escalation, and provider email configuration.
3. Rich-text editing, revisions, review approval, previews, scheduled publishing, and redirect management.
4. Applications/cases, appointments, private documents, destination checklists, and deadlines.
5. Team-scoped managers, invitations/deactivation, assignment reconciliation, advanced reporting, exports, and distributed transactions.
6. WhatsApp/SMS/calendar/mailbox integrations, financial workflows, and a future client portal as separately configured features.

The detailed requirements and acceptance gates remain in `docs/CRM-CMS-APPWRITE-IMPLEMENTATION-PLAN.md`. Progress is recorded in [[03 Implementation Status]] and [[Changes/2026-10-29]].

CAL-01 appointments and DOC-01 private documents are accepted locally. TEAM-01 staff access is verified locally. REPORT-01 operational reporting and CSV export is verified locally. CRM-02 advanced lead operations is the next planned feature. DOC-01 production gates are tracked in [[06 Deployment]].

CRM-02 manual entry and normalized search passed local acceptance. The next CRM-02 slice is contact/enquiry separation and duplicate review.

CONSULT-01 consultation tracking passed local acceptance. Resume CRM-02 with contact/enquiry separation and duplicate review.

MOB-01 mobile builds are available for Android and iOS simulator testing. Live mobile sign-in requires the CRM HTTPS certificate and release. Resume CRM-02 as recorded in [[Session Wall]].

## Native follow-up lifecycle — 21 November

MOB-05 consultations, MOB-06 consultation reporting and MOB-07 follow-up actions are now implemented and accepted locally. Production/server/OTA/device gates remain separate. Finance rollout was explicitly deferred. Resume the exact next bounded build recorded in [[Session Wall]] rather than the historical next-feature notes above.

## Retry-safe follow-up creation — 21 November

MOB-08 adds follow-up creation on native and makes the shared web path retry-safe. Existing lifecycle editing and consultation reporting remain locally accepted. Production and device delivery remain deferred; continue from the exact next build in [[Session Wall]].

## Native appointments — 22 November

MOB-10 adds native appointment tracking/outcomes. Creation and rescheduling still use web. Device/server delivery is separate from local acceptance; resume the next bounded action in [[Session Wall]].

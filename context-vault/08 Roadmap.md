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

## Native appointment rescheduling — 22 November

MOB-11 completed local acceptance for native rescheduling. Next is online native booking creation from an assigned enquiry with duplicate prevention on retry. See [[Session Wall]].

## Blog Studio authoring — 22 November

The comprehensive web authoring pass is locally verified. Ghost migration acceptance and a native publishing interface remain separate work. The session wall retains the previously queued native appointment booking work.

## Native appointment booking — 23 November

The native booking workflow is feature-tested. The next planned mobile calendar feature is a read-only offline agenda within the existing encrypted workspace. Physical-device testing, the server release and the mobile update have separate acceptance steps.

## Offline mobile agenda — 23 November

MOB-13 completed the read-only native agenda. The next planned native workflow is the staff reminder inbox, reusing the existing web reminder permissions. VPS, mobile release and device verification are tracked separately.

## Native personal reminder inbox — 23 November

The native inbox is locally accepted. Next planned work is a scoped activity timeline in native lead details with the same restricted-manager visibility rules as the web CRM. [[Sessions/2026-11-23-02]]

## Native lead activity — 23 November

The native read-only timeline passed local acceptance. The next planned feature is adding an internal note from the native timeline with ownership checks and safe retry handling. [[Sessions/2026-11-23-03]]

## Native internal notes

Native internal notes passed local acceptance. Native application creation is the next planned feature.

## Native application creation

Native application creation passed local acceptance. The next feature extends the native application detail editor.

## Native application detail editing

The next planned mobile feature is application document status.

## Application document checklist

Application search and stage filtering are the next planned native feature.

## Native application search

The next planned application-list feature is a deadline view.

## Native application deadline filters

Next work is a native link from an application to its assigned lead.

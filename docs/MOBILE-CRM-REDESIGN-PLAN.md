# ProConsulting mobile CRM implementation plan

Prepared 28 November 2026. This is planned work. Existing features remain implemented to their recorded acceptance levels. This plan supersedes the small navigation slices as the primary mobile delivery sequence.

## Outcome and evidence

Deliver a native staff CRM that supports a counsellor’s daily work with clear navigation, readable records and predictable editing. Preserve the website logo and pink, blue and navy branding.

A 390 by 844 preview of the actual React Native workspace through React Native Web exposed a navigation block consuming most of the first screen, filters pushing lead records below the fold, equally weighted actions, a persistent browser button taking bottom space, and long lead forms mixing several workflows. This preview used synthetic data. Android keyboard, system back, safe areas and gestures require actual device verification.

## Product structure

Primary destinations are Today, Leads, Tasks and More. Applications and appointments remain directly reachable from Today and More, and from their associated lead. More contains reminders, saved agenda, reports, finance when authorized, account settings and update controls.

Today shows useful work first, including overdue and upcoming follow-ups, upcoming meetings, application deadlines and refresh status. Counts describe the records actually loaded. Global totals require a separately verified aggregate API.

Lead details use Overview, Activity and Tasks sections. Overview includes contact actions, original enquiry and linked applications and appointments. Changes to stage and priority use a focused edit surface. Activity provides notes and history. Tasks provides scheduling and open/closed task review.

Record detail has a consistent back action, heading, status, contextual actions and save feedback. Navigation preserves list filters and pagination. Dirty forms require a deliberate save or discard choice before leaving. Native back behavior follows the same rules.

## Visual direction

ProConsulting supports education and immigration counselling. The interface should feel calm, practical and attentive. Keep the actual logo, navy text, restrained blue selection and pink brand accents. Use neutral surfaces, consistent spacing and legible system typography.

Use persistent bottom navigation with comfortable touch targets. Reserve prominent colour for the main action. Move dense filters into a dedicated sheet or screen with apply and reset controls. Keep administrative actions and account controls in More. Place loading, offline, empty and error states beside the content they affect.

## Phase 1 — Rendered baseline and navigation foundation

Read the current route entry and workspace state before changing structure. Inventory every role-specific destination and entry point. Capture baseline screenshots for sign-in, Today/lead list, detail, task, appointment, application, offline state and owner Finance.

Introduce the primary navigation using the installed Expo Router and existing dependencies where compatible. Move refresh, saved-data removal, sign-out and browser access into appropriate account or contextual surfaces. Preserve all current role guards and online/offline gates.

Acceptance requires direct access to every existing destination, predictable Android back behavior, visible active destination, preserved list state, safe dirty-form navigation, and content visible on a compact phone without a navigation wall. Capture before and after screenshots using identical fixtures.

Deliver the navigation and account structure as a connected checkpoint.

## Phase 2 — Daily work and lead discovery

Build Today around the existing scoped task, meeting and deadline data. Provide useful empty and partial-data states. Redesign lead cards with name, service, destination, status and the next useful action. Consolidate search and filters into a deliberate apply/reset interaction. Provide a visible filter summary.

Acceptance includes loading, empty, partial, failed and offline states, keyboard-safe search, pagination retaining filters, readable long names, large text, and role-appropriate cards. Verify that permissions and counts remain accurate.

## Phase 3 — Complete lead workspace

Reorganize contact information, enquiry, activity, notes, tasks, applications and appointments into the lead structure above. Avoid rendering creation forms until requested. Present stage and priority changes in a focused editor with confirmation and stale-version recovery.

Preserve note submission IDs through uncertain responses. Keep phone/email actions explicit. Ensure unrelated enquiry data and internal audit payloads remain outside mobile projections.

Acceptance includes contacting a lead, reading an enquiry, writing and retrying a note, changing classification, creating a follow-up, opening related applications and appointments, handling reassignment and returning to the original filtered list. Verify unsaved changes, late responses and background/resume behavior.

## Phase 4 — Tasks, appointments and applications

Apply shared screen hierarchy and controls to these operational flows. Use practical date/time entry with visible office timezone and validation. Distinguish task work queues from history. Improve list filters, selection states, deadlines and recorded outcomes.

Appointment booking, rescheduling and outcomes must preserve conflict handling and repeat-submission semantics. Application creation and editing must preserve type-specific requirements, versions and safe retries. Document checklist explains enquiry-level sharing.

Acceptance covers complete, cancel and reschedule tasks; book, conflict, reschedule and record appointment outcomes; create education and immigration applications; edit progress and details; inspect document readiness; and recover after uncertain writes. Verify return paths and list state across all flows.

## Phase 5 — Offline, account and update experience

Review saved data expiry, account isolation, capacity behavior and invalidation after every supported write. Provide a coherent offline badge, last-sync information, reconnect action and read-only record presentation. Verify application summaries and deadlines alongside existing saved leads/tasks/meetings.

Add an About/Updates screen using the installed expo-updates package. Show installed version and update state, offer an explicit update check, download progress where supported, and a restart prompt after the update is ready. Block restart while a form has unsaved work or a submission is uncertain. Recover gracefully when checks fail.

Acceptance includes cold offline restart, expired session/cache, account switch, clearing saved data, malformed cache, full storage, network loss/recovery and outdated-server responses. Update acceptance requires a real device receiving a compatible test update and reopening successfully. Record the update group and rollback target.

## Phase 6 — Role workflows and release acceptance

Apply the common interface to owner Finance, consultation reports and reminders while preserving role visibility. Verify access denial with real server-side guards. Keep owner-only records outside counsellor data.

Complete Android device checks for installation over the previous signed build, keyboard avoidance, safe areas, hardware back, scrolling, large text, network transitions and update delivery. Test representative compact and larger screens. Use an emulator or physical device for native acceptance. React Native Web screenshots remain a complementary visual check.

Deploy matching CRM endpoints before mobile publication. Compare deployed API capabilities with mobile requirements. Record accepted production behavior separately from local tests.

## Working method across sessions

Each session resumes the active phase from the structured state. A session delivers a connected workflow and can include multiple related screens, fixes and checks. Checkpoints support continuation during longer work. They do not require ending a session.

Record acceptance criteria before implementation. At handoff record changed files, passed and failed checks, screenshots, known limitations and the exact next action. Update the feature ledger and vault. Keep secrets and customer data out of fixtures and notes.

Commit verified checkpoints on the existing codex branches. The mobile checkout currently has no Git remote, so its commits are local. Configure a mobile remote when its destination is known. CRM pushes, mobile commits, server deployments, OTA publication and device acceptance are distinct events.

## Update compatibility and release policy

The latest generated APK is Android 1.0.4, version code 5, runtime 1.0.4, channel preview, with expo-updates configured to check on launch. Installation on the user’s phone has not been independently verified.

Compatible JavaScript screens, styles, navigation logic and bundled assets can be published through EAS Update. Channel, platform and runtime must match the installed build. With the existing launch policy, a download may become active on a later restart. The planned update screen will make this visible and explicit.

Native module changes, native configuration/permission changes and SDK upgrades require assessing a new binary and runtime. Preserve runtime 1.0.4 only while native compatibility holds. Review every dependency change before promising OTA delivery.

A new APK signed with the same key and package and a higher version code can normally install over the existing application. Uninstalling is generally unnecessary. Verify the signing identity and device installation behavior at release.

Before each OTA release record source commit, runtime, channel, platform, API prerequisites, test evidence, update group and previous known-good update. Publish a compatible pilot, verify it on a device, then distribute further. Roll back using an appropriate compatible known-good update if necessary. Avoid restarting during active edits.

## Completion standard

The redesign is complete only when the core counsellor journeys and authorized owner journeys work through their normal entry points, rendered layouts have been inspected, native behavior has been verified on Android, offline and failure states pass, and compatible updates have been demonstrated on the installed runtime.

## Documentation sources

- https://docs.expo.dev/eas-update/runtime-versions/
- https://docs.expo.dev/eas-update/how-it-works/

## Phase 1 checkpoint — 28 November 2026

Implemented primary navigation, grouped role-aware More rows, secondary destination selection and shared draft protection. Parent lead navigation includes nested creation/note drafts, and application/appointment edits protect tab changes, reloads and return to paged lists. Four role menus and connected synthetic interactions passed. Mobile typecheck/lint, 17 tests and both platform exports passed. Acceptance details and retained previews live in the mobile checkout’s `docs/NAVIGATION-ACCEPTANCE.md`.

Phase 1 is still in progress: the existing Expo Router entry hosts the stateful workspace. Extracting destinations with preserved authenticated data/draft owners, and actual Android keyboard/back/device verification, remain required. No OTA publication or native binary change occurred.

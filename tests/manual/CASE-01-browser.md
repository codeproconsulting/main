# CASE-01 browser acceptance — 7 November 2026

Build then run `node tests/helpers/cms-preview.mjs --cases`. Ports 4173/4175 use a synthetic manager and in-memory Appwrite fixture only. Sign in with manager@example.invalid / synthetic-preview-password. Stop preview after testing.

Observed:

1. Application list initially empty. Created education application for synthetic-lead with institution, course, UK destination and a timezone deadline.
2. Saved detail retained fields, normalized 10:00 +05:00 to 05:00 UTC, and disabled service changes.
3. Opened the saved record in a second tab. Updated the first tab to Submitted, then attempted Documents pending from the older second tab. It returned “Application changed. Refresh before saving.”
4. Created an immigration case for the same lead. Selecting Immigration changed institution/course labels to Visa category/optional description and removed offer, deposit and enrolment stages.
5. Saved Visa preparation with visa category and Canada destination, leaving description blank; save succeeded with immutable Immigration service.
6. List displayed both independent records: education Submitted with deadline in Asia/Karachi, and immigration Visa preparation without a deadline.
7. Navigated back from immigration to education; saved service, labels, stage and course were restored correctly.

Focused automated tests separately cover authorization, assignment handoff, pagination and recovery; no production behavior or actual applicant data is asserted by this synthetic browser run. Initial connection failed because the preview had not yet started; reopening after startup succeeded. No site security warning was bypassed.

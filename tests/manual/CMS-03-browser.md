# CMS-03 isolated browser acceptance

Run `npm run build`, then `node tests/helpers/cms-preview.mjs`. This starts the actual built application on 127.0.0.1:4173 and an in-memory synthetic Appwrite-compatible API on 127.0.0.1:4175. It overrides endpoint/project/key settings and does not connect to the user's real Appwrite project. Stop it with Ctrl+C; all synthetic records are discarded.

Sign in at `/admin/login` using `publisher@example.invalid` / `synthetic-preview-password`. These credentials authenticate only this disposable local fixture, not a real account. The fixture supports the CMS acceptance flow, not every CRM module.

## Steps verified on 29 October 2026

1. Create a draft, enter a title/slug, and type `Hello world.` into the visual editor.
2. Move the cursor to the beginning and type `Start `. Confirm the visible body remains `Start Hello world.` across React renders and shows Unsaved changes.
3. Select the body and click Bold. Confirm `<b>Start Hello world.</b>` is retained, then save and confirm Article saved.
4. Switch to HTML source and enter safe paragraph content plus a script and an image event handler. Return to visual mode. Confirm script/event attributes are removed before the HTML enters the live editor DOM.
5. Paste text containing literal `<b>` markup. Confirm it remains escaped text, not executable markup. Save, open Revision history, and restore Version 1. Confirm the original bold body is restored with the same URL and draft state.
6. Schedule a synthetic article for `2099-01-01T09:00:00+05:00`. Save and verify the form shows the normalized stored UTC time `2099-01-01T04:00:00.000Z`.
7. Change status to published and save. Verify the form displays the actual current saved publication timestamp rather than the previous future schedule.
8. Type additional text, Undo it, then Redo it. Confirm both visible text and unsaved state remain coherent.

## Bugs found and fixed during these checks

- A fresh dangerouslySetInnerHTML object on every input could clear the visible editor even while form state changed. Memoizing the markup used to initialize the live editor fixed the clearing/cursor problem.
- Uncontrolled form fields could retain a stale scheduled date after a save. Keying the form by record ID/version refreshes fields from the canonical saved record.

This manual browser evidence complements service/scheduler tests. It does not establish production deployment, actual staff login configuration, external messaging, or Ghost cutover.

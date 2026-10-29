# MEDIA-01 isolated browser acceptance — 29 October 2026

Run `npm run build`, then `node tests/helpers/cms-preview.mjs`. The fixture uses local ports 4173/4175, synthetic credentials and in-memory data only. It must never target real Appwrite. Use the fixture's publisher identity (`publisher@example.invalid`, password `synthetic-preview-password`). Stop both processes after checking; data is discarded.

Observed against the actual built application:

1. Signed in at `/admin/login` and opened `/admin/media`; empty state and repository branding rendered.
2. Selected `tests/fixtures/synthetic-media.png` with the browser file chooser, filled alternative text and caption, submitted Upload image.
3. Library displayed the filename, alternative text, **Private editorial asset**, and an authorized private download link.
4. Clicked Publish image. Library changed to **Public**, displayed the configured public-host `/media/:id` URL, and offered Make private. Did not navigate to the real public website; it is still on its existing release.
5. Clicked Make private. Library returned to private label/download link and Publish image control.
6. Stopped preview processes; no real records or publication settings were touched.

Byte-identical download, anonymous direct-storage denial, public route no-store/404 behavior, role boundaries and failure cases are covered by the live disposable storage check and focused automated tests. This browser workflow does not establish production DNS/TLS or the scanner's internal behavior.

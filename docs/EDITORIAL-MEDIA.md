# Editorial media: operation and recovery

Editors, publishers, owners and admins can upload JPEG/PNG/WebP images and download staff previews. Counselors and managers have no editorial media access. Only publishers, owners and admins can publish or unpublish images. The library currently shows the newest 100 items; pagination/search and editing metadata are follow-up enhancements.

Uploads require nonblank alternative text (up to 300 characters), caption up to 1000 characters, supported MIME and matching basic file signature, and a nonempty file up to 5 MiB. Multipart parsing is bounded to 6 MiB even without Content-Length. These checks are not a full image decoder or a guarantee of harmless content. The configured private Appwrite bucket also restricts extensions, size, encryption and antivirus. Do not disable those controls to bypass an upload error.

All metadata and file permissions stay private. The schema defaults new media visibility to false, including operator-created records that omit it. A publisher explicitly exposes the application's `/media/:id` URL, not an Appwrite bucket URL. Public streaming checks current metadata, sends only allowed image MIME with nosniff/no-store, and uses no public API credentials. Unpublishing makes subsequent route reads return 404. Already downloaded files or an in-flight response cannot be recalled; configure a CDN to honor no-store and never cache this route. The public website must run the accepted code containing `/media/:id`; starting the dashboard process alone does not update the existing public website. Keep Ghost unchanged until CMS-04 passes.

Visibility mutations acquire the shared per-media lock, check the submitted previous visibility, and write an audit intent before updating. Audit completion follows the metadata write. This is not a multi-record transaction. A failed completion may show an error even though visibility changed; refresh before retrying. Locks left after a crash fail closed; see `docs/SCHEDULED-PUBLISHING.md` for stop-writers-first lock recovery principles.

## Interrupted uploads

Before uploading, the service chooses a UUID used for both metadata and file, and records a pending activity intent identifying it. If metadata creation fails, it checks for an acknowledged or unacknowledged committed record before deleting any file. Confirmed missing metadata triggers file cleanup. If lookup or cleanup fails, it returns an explicit reconciliation error. No operator cleanup is silently claimed as successful. Failed validation/storage writes can also leave pending intents with no file.

For a pending **media** activity:

1. Stop concurrent upload/visibility writers if the outcome is uncertain. Record the activity ID and its `entityId`/`fileId` privately. Do not copy applicant data or API keys into the vault.
2. In Appwrite Console, inspect the private `media` record and `crm-media` file with that ID. Verify file reference, MIME, byte checksum and publication state. Never delete a file referenced by valid metadata or an active article.
3. If metadata/file both exist and match, retain them and mark the activity reconciled using approved operator tooling. If neither exists, record the failed upload as reconciled. If only a file exists and no metadata/article references it, remove it after confirming no upload is in flight. Restore or replace missing files through an explicit operator decision; do not silently expose incomplete records.
4. Review the actual visibility before resolving a failed visibility intent. Preserve the audit history and outcome; never invent a completed operation.

No automatic orphan sweeping, image transforms, or direct browser bucket access is implemented. Operator reconciliation currently uses Appwrite Console; a dedicated recovery UI is planned.

## Verification

`tests/media.test.mjs` covers service permissions, private/public revocation, size/type/signature/text limits, multipart byte limits, stale/concurrent visibility changes, failed audits, failed metadata compensation, lost acknowledgments and failed cleanup. It also checks shared storage document signature behavior.

`node scripts/setup-storage.mjs --only=media` verifies the private bucket's configured flags/limits without changing it. `node scripts/verify-media-storage.mjs --apply` performs an opt-in disposable real Appwrite upload, private metadata write, byte-identical download and anonymous denial, then deletes both records. It reports cleanup failures and returns failure. This was run successfully for this increment; it verifies real basic file operations and configuration, not scanner internals.

Browser acceptance against the isolated built-app fixture is recorded in `tests/manual/MEDIA-01-browser.md`. Production routing, staff credentials and HTTPS still require the VPS smoke checks in `deploy/CRM-DEPLOYMENT.md`.

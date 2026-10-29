# Scheduled publishing operations

CMS-03 verifies article authoring, revisions and the scheduled-publication transition. Production workers and the public Appwrite provider remain disabled until their rollout gates pass. This runner never sends email or client messages.

## Setup and activation

Use Node 22.18+ or Node 24 for the TypeScript content-sanitizer import used by the CLI. Set the server-only Appwrite variables in the ignored `.env`. The project requires private posts, revisions, activities, and locks collections plus the posts `schedule` index over status/publication date. Additive setup can be scoped with `node scripts/setup-appwrite.mjs --apply --only=posts`.

`node scripts/publishing-worker.mjs --once` performs a real due-publication cycle against the configured project; test against an isolated project first. Running without --once polls once per minute, catches up due schedules after downtime, and retries transient failures on later cycles. Shutdown stops polling and allows the in-flight cycle to finish.

The PM2 publishing process is independent of the broader reminder worker. To enable it when ready, set `ENABLE_SCHEDULED_PUBLISHING=true` in the environment invoking PM2 and reload the ecosystem file. Do not enable `ENABLE_BACKGROUND_WORKER` merely to get publishing: reminder workflows have their own acceptance work. Neither process is enabled by default.

## Behavior and safety

- Editors may create/edit drafts and submit review. Publishing, scheduling, or changing a live/scheduled article requires a publishing role.
- Publishing/scheduling requires nonempty sanitized content. Schedules require a future timestamp including timezone.
- Publish-now replaces a future scheduled date with the current timestamp; edits to an already published article preserve its original date.
- A worker re-reads each candidate under the same post lock used by dashboard edits. Cancelled/rescheduled candidates are skipped. Concurrent workers do not publish the same version twice.
- A deterministic revision snapshot and durable pending audit intent precede mutation. Failed writes retry without duplicate snapshots. A lost write acknowledgment does not trigger a second publication after restart because the persisted state is already published.
- Publication records remain private to the CMS until the public provider is switched. The default Ghost site does not automatically show Appwrite posts.

## Failure review

A crash can leave a post lock behind. Locks deliberately fail closed; there is no automatic age-based takeover that could overlap an old writer. Stop all dashboard/publishing/reminder processes that might write the post, inspect the exact lock ID/key/owner and post state, take a backup of the relevant records, and release only that confirmed abandoned lock through the Appwrite Console. Restart processes and recheck the post. Never clear all locks while writers are running.

If a write succeeded but its acknowledgment or final audit update was lost, the post can be published with an audit intent still marked pending. Review the actual post status/version against the intent's from/to versions and the revision snapshot. Record reconciliation as an operational audit action; do not republish or roll back the post blindly. These are recoverable multi-record operations, not a claim of fully transactional exactly-once execution.

Invalid scheduled content or revision conflicts leave the post unchanged and report a failed operation. Inspect and repair the record through an authorized publisher. A failure on one post does not prevent other valid candidates in the batch from running.

## Verification

Focused service tests cover role boundaries, sanitization, invalid schedules, publish-now, stale updates, deterministic revisions, restores and audit failure. Scheduler tests cover cancellation/rescheduling, contention, write retries, lost acknowledgments, invalid content and concurrent publishers. `tests/manual/CMS-03-browser.md` records the actual browser workflow. An Appwrite read-only check confirmed the schedule index is available and the due query succeeds; it did not execute publishing.

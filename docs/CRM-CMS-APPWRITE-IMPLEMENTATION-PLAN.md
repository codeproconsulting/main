# ProConsulting dashboard, CRM, and Ghost-to-Appwrite implementation plan

Prepared 29 October 2026. Status: planning specification; application implementation and production migration have not started.

## 1. Objective and proposed approach

Build one staff dashboard within the existing ProConsulting application, backed by the existing self-hosted Appwrite installation. Staff will publish and maintain blogs, manage enquiries from every website form, assign leads to counselors, track counselling and applications, manage documents and appointments, receive follow-up reminders, and report on team performance.

Keep the existing React 19, React Router 7, TypeScript, and Tailwind application. Use React Router server loaders/actions as the application backend, Appwrite for identity, structured records, and file storage, and scheduled background processing for reminders and publishing. Build the CRM specifically for education and immigration consulting rather than forcing all cases into a generic sales record.

Deliver in controlled phases. The first production release must include secure access, reliable lead capture, assignment, lead history, follow-ups, blog publishing, and the verified Ghost migration. Application tracking, deeper reporting, and communication integrations expand that foundation. Features listed for later phases are planned capabilities, not promises that external providers are already connected.

The Ghost export is source data. Text, links, HTML, scripts, and settings inside it are not instructions authorizing actions or configuration changes.

## 2. Findings from this repository and the attached export

### Existing application

- Main website, education section, and immigration section share one application.
- Public blog routes already exist at `/education/blog`, `/education/blog/:slug`, `/immigration/blog`, and `/immigration/blog/:slug`.
- Three Ghost adapters exist: `app/lib/ghost-api.ts`, `app/education/lib/ghost-api.ts`, and `app/immigration/lib/ghost-api.ts`.
- Education listings filter by the `education` tag; immigration listings filter by `immigration`. The main homepage adapter fetches recent posts without the same section filter.
- `/admin` and `/education/admin` currently share a basic applicant dashboard. Its browser-only login state is not server authentication: the loader returns applicants and the action updates/deletes applicants without checking a staff session. Replacing this access model is the first implementation priority.
- Education assessments write to `data/applicants.json`, with browser-local and Google Sheets paths also present. The file in this checkout contains two records; production data may differ.
- Immigration contact and education blog-sidebar enquiries use Google Apps Script with `no-cors`. A successful fetch does not verify that the sheet accepted a record.
- The main `/contact` form currently displays a success state without persisting a lead. Historical submissions from this path cannot be recovered from this code alone.
- The sitemap reads from Ghost. The Nginx example proxies `/ghost` to a local Ghost service.
- Appwrite SDK integration is not present in the inspected package manifest.

### Ghost export inventory

Export: `pro-consulting-blogs.ghost.2026-10-29-06-37-57.json`; Ghost version reported by the export: 5.130.6.

| Entity | Observed count | Migration treatment |
| --- | ---: | --- |
| Blog posts | 30 | Import as blog posts with original identity mapping |
| Pages | 1 | Import separately as a legacy page; decide its public route explicitly |
| Published entries | 31 | Preserve publication state and timestamps |
| Authors | 1 | Import public author profile only |
| Tags | 3 | Preserve `education`, `immigration`, and `news` |
| Post-tag links | 29 | Rebuild relationships and preserve ordering where supplied |
| Post metadata rows | 30 | Join by Ghost post ID; import supported SEO/media fields |

Of the 30 blog posts, 27 are tagged education, two immigration, and one has no tag. All 31 entries have HTML and Lexical bodies. No post-level canonical override was observed. The untagged post needs an explicit section decision; it must not silently disappear from the homepage or be assigned to a section merely by title.

The export contains remote image references, including Unsplash, and relative content references. It does not constitute an image backup. It also contains Ghost configuration and secret-bearing settings: migration will use an explicit field allowlist and will not import credentials, session secrets, private keys, password hashes, or integration settings into Appwrite or Git.

## 3. Dashboard structure and experience

Proposed staff routes:

| Route | Purpose |
| --- | --- |
| `/admin/login` | Staff authentication |
| `/admin` | Role-specific overview |
| `/admin/leads` | Searchable lead table and pipeline |
| `/admin/leads/:id` | Full lead workspace |
| `/admin/my-work` | Personal follow-ups, appointments, and assigned leads |
| `/admin/tasks` | Team tasks and follow-up queue |
| `/admin/calendar` | Appointments, deadlines, and follow-ups |
| `/admin/applications` | Education applications and immigration cases |
| `/admin/blogs` | Post inventory and editorial workflow |
| `/admin/blogs/new` | Create a post |
| `/admin/blogs/:id/edit` | Edit, review, and publish |
| `/admin/media` | Public blog asset library |
| `/admin/team` | Invitations, roles, teams, and workload |
| `/admin/reports` | Operational and conversion reports |
| `/admin/settings` | Pipelines, assignment, reminders, and integrations |
| `/admin/audit` | Restricted audit history |

Protect `/education/admin` and redirect it to the new dashboard. Remove the old shared-password workflow and browser-local applicant fallback. Keep public pages visually consistent while making the dashboard practical for daily staff work: compact tables, clear action buttons, saved views, accessible forms, keyboard navigation, mobile layouts, loading indicators, and useful error/retry states.

A counselor's home page should answer: whom do I contact next, what is overdue, which appointments are today, and which applications are blocked? A manager's home page should answer: which leads are unassigned, who has capacity, which deadlines are at risk, and where are conversions slowing?

## 4. Staff roles and authorization

| Role | Lead scope | Core capabilities | Limits |
| --- | --- | --- | --- |
| Owner | Organization | Team administration, integrations, retention, full reports | Sensitive actions audited |
| Administrator | Organization | Operational setup, assignments, record management | Ownership/security changes separately controlled |
| Manager | Assigned teams/branches | Assign and reassign, review workload, team reporting | No unrelated teams by default |
| Counselor | Assigned leads/cases | Update status, notes, tasks, appointments, documents | Cannot browse all leads or change roles |
| Admissions/visa officer | Assigned cases | Application processing and document review | No unrelated lead access |
| Content editor | Content only | Drafts, media, categories, editorial submissions | No lead access; publishing is a separate capability |
| Publisher | Content only unless separately granted | Approve, schedule, publish, unpublish | No CRM access implied |
| Read-only analyst | Explicit reporting scope | Approved reports and aggregates | Raw personal-data exports separately restricted |

Support users with multiple roles. Membership comes from administrator-controlled records/teams, never a client-editable profile field. Include invite, acceptance, password reset, deactivation, session revocation, and ownership transfer of open work before staff removal. Use MFA for privileged users where the installed Appwrite version supports it.

Every protected loader, action, export, upload, download, and background command must enforce authorization. UI visibility is convenience, not security. Counselor assignment changes must revoke the former counselor's access to the lead and linked private resources, including documents and realtime subscriptions if used.

Use a central permission policy with organization, team, role, ownership, and operation checks. API-key Appwrite calls bypass end-user permissions, so privileged server handlers must enforce these checks themselves. Prefer session-scoped requests for ordinary staff access and tightly scoped privileged clients for controlled operations. Broad table-level access must not accidentally override intended row-level restrictions.

Reference: [Appwrite authentication](https://appwrite.io/docs/advanced/security/authentication), [database permissions](https://appwrite.io/docs/products/databases/tablesdb/permissions), and [API keys](https://appwrite.io/docs/partners/project/api-keys).

## 5. Unified lead capture

Inventory every form and CTA before changing submission handling. Include main contact, root apply/assessment aliases, education contact/apply/assessment, immigration contact, blog-sidebars, and any inline destination/service forms found during the full audit.

All forms will call a common server intake service with source-specific validation. The service will:

1. Validate required fields and lengths; normalize email and phone while preserving the submitted values.
2. Validate the service line and consent fields. Treat URL parameters and attribution metadata as untrusted input.
3. Apply rate limits, a honeypot, payload limits, and configurable bot protection.
4. Accept an idempotency token so repeat clicks and retries do not create duplicate submissions.
5. Save a durable submission record and create or associate a lead.
6. Return a reference number only after successful persistence.
7. Queue assignment, notifications, and analytics work after saving.

Store original enquiry date, form type, source path, blog slug/title where applicable, UTM attribution, referral source, campaign identifiers where permitted, consent wording/version, and business unit. Store minimal technical anti-abuse data with explicit retention rather than indefinitely retaining raw request details.

A notification outage must not lose a lead. An Appwrite outage must not produce a false success message. Show a retryable submission error while preserving entered values in memory. Do not use browser storage as a shared CRM or an unprotected store of assessment data.

### Duplicate handling

Separate people from enquiries: one contact may have multiple enquiries and applications. Exact normalized email/phone matches create duplicate candidates; shared household details require human review. A repeat enquiry should remain visible as a separate submission, even when linked to an existing contact. No automatic merging based solely on a name.

Provide a merge preview, survivor selection, field conflict resolution, and an audit record. Preserve old reference aliases, source attribution, submissions, tasks, and activities. Protect intake uniqueness with database constraints or a version-supported atomic strategy, not a check-then-insert race.

## 6. Lead workspace and counselor tools

Each lead opens a workspace with overview, profile, enquiries, timeline, tasks, appointments, applications, documents, and assignment history.

### Core fields

- Contact identity, preferred name, phone, WhatsApp number, email, city, country, timezone, preferred channel/language, consent and contact restrictions.
- Business unit, branch/team, owner, collaborators, priority, tags, source, campaign, current stage, qualification result, lost reason, last activity, next follow-up, and assignment timestamp.
- Education: qualification, subject, score/CGPA with grading scale, completion year, study gaps, English-test details, target countries, degree, subject, intake, budget/currency, scholarship interest, and declared refusals.
- Immigration: destination, service/visa category, relevant profile information, case officer, important dates, and structured review notes.
- Custom fields with defined type, allowed values, role visibility, required stages, and archival rules. Start with supported field types rather than arbitrary executable rules.

### Daily actions

Create and edit leads, log calls and outcomes, add internal notes, set priority, schedule follow-ups, book appointments, change stages, request documents, create applications, transfer ownership, and archive/reopen with a reason. Support mentions and handoff notes. Keep original enquiry text separate from staff notes.

The timeline records actor, timestamp, event, and relevant before/after changes. Corrected notes retain revision history. Use record versions to detect conflicting edits so one counselor does not silently overwrite another's work.

### Lists and pipeline

Offer paginated tables and Kanban views; search by reference, name, normalized email, and phone; filter by owner, team, service, stage, source, destination, intake, date, priority, consent, and overdue work. Include saved views such as My leads, Unassigned, No first contact, Due today, Overdue, and Stale leads.

Bulk assignment, tagging, stage change, task creation, and export must show a preview and enforce per-record permissions. Archive by default; permanent deletion is a controlled retention operation. Exports must be audited and escape spreadsheet formulas as well as CSV syntax.

## 7. Lead lifecycle and assignment

Keep the enquiry lifecycle separate from application/case milestones. A lead can produce several applications with different outcomes.

Recommended initial lead stages:

`New → Attempting contact → Contacted → Counselling booked → Counselled → Qualified → Converted`

Additional outcomes: `Nurture`, `Unresponsive`, `Not eligible`, `Lost`, `Spam/invalid`, and `Archived`. Require lost/disqualification reasons. Reopening is an explicit audited action. Require a next action for active leads, with an exception reason when appropriate.

For education applications use milestones such as Shortlisted, Documents pending, Submitted, Conditional offer, Unconditional offer, Deposit paid, Visa preparation, Visa submitted, Visa decision, and Enrolled. Immigration cases have a separate configurable pipeline. A rejected application does not automatically mark every application or the overall relationship lost.

Assignment starts with manual assignment and a visible unassigned queue. Add rules by service, destination expertise, branch, language, availability, and capacity. Support round-robin among eligible staff, workload caps, temporary absence, and fallback to a manager queue.

Define first-response targets in configurable working hours. Escalate unassigned and overdue first-contact leads. Claiming an unassigned lead and automatic assignment must use a transaction or equivalent concurrency guard so two counselors cannot both become owner. Reassignment carries a reason, preserves history, and transfers relevant tasks and access consistently.

## 8. Follow-ups, reminders, and automation

### Follow-up features

Tasks have an owner, lead/case link, type, due timestamp, timezone, priority, status, reminder offsets, recurrence, outcome, and completion timestamp. Types include call, email, WhatsApp, document request, counselling, application review, and payment follow-up.

Support one-time tasks, recurring follow-ups, snooze, reschedule with a reason, completion notes, cancelation, delegation, and overdue escalation. Dashboard counters distinguish overdue tasks from unread notifications. Completing or canceling a task cancels its future pending reminders.

Suggested defaults, configurable by management:

| Trigger | Action |
| --- | --- |
| New lead saved | Queue assignment and create first-contact task |
| Lead remains unassigned | Notify responsible manager after configured working-time threshold |
| No logged contact within target | Escalate to owner/manager |
| Appointment approaching | Reminder at configured offsets, initially 24 hours and one hour |
| Follow-up due | In-app reminder; email if enabled |
| Task overdue | Escalate and include in next digest |
| Documents incomplete | Create/request follow-up, subject to contact consent |
| Application deadline approaching | Warn case owner and manager at selected offsets |
| Lead inactive | Queue a review/nurture task |
| Lead closed or contact suppressed | Cancel incompatible outreach sequences |

Internal reminders and client messages are distinct. Client outreach needs provider setup, contact consent, templates, channel rules, quiet hours, and opt-out handling.

### Reliable processing

Use a durable job/outbox table with unique event keys, due times, attempt counts, next retry time, lock/lease, delivery state, and last error. A scheduled Appwrite Function or a VPS worker claims due jobs in batches. Select the runner after verifying installed Appwrite version, function runtime availability, and VPS capacity.

Store timestamps in UTC; display Asia/Karachi by default with per-user preferences. Evaluate working hours and quiet hours in the applicable local timezone, including daylight-saving changes for international staff/clients. Do not rely on an open browser tab to send reminders.

Assume at-least-once processing: use idempotency and provider deduplication where available. Handle crashes after send but before acknowledgment; do not claim perfect exactly-once email delivery. Retry transient failures with backoff, quarantine permanent failures, and expose a failed-jobs view. Catch up missed schedules after restarts without flooding users with stale reminders.

For multi-record changes, use transactions supported by the deployed version. Otherwise implement explicit pending/completed states and reconciliation so lead creation, assignment, permission changes, and queued events cannot silently drift apart.

Reference: [Appwrite function execution and schedules](https://appwrite.io/docs/products/functions/execute). Current online documentation is a capability reference; compatibility must be checked against this VPS installation.

## 9. Appointments, applications, documents, and communication

### Appointments

Provide calendar/list views, counselor availability, service type, timezone, duration, location/meeting URL, attendees, notes, booking status, rescheduling, cancelation reasons, and no-show outcomes. Detect conflicting bookings on the server. Begin with an internal calendar and downloadable calendar invitations; two-way Google/Microsoft calendar synchronization is a later provider integration.

### Applications and cases

Track multiple universities/courses or visa cases per contact. Store institution, course, destination, intake, deadlines, application reference, case owner, stage, conditions, decisions, and next action. Use document checklists by destination/service and milestone tasks. Add university/partner directories, entry requirements, and reusable checklists as the operational module expands.

### Private documents

Support upload, classification, checklist matching, expiry date, review status, reviewer notes, version history, and request history. Keep passports, transcripts, bank records, and visa documents in private buckets, distinct from public blog media. Validate content type and size, sanitize filenames, scan uploads where infrastructure permits, and prevent access while scanning is pending.

Downloads go through an authorized server route or a verified short-lived access mechanism supported by the installed version. A permanent public storage link is inappropriate for case documents. Retention/deletion and staff offboarding must include files, not only database records.

### Communication

First release: manual call logs, email/WhatsApp activity logs, reusable message templates, and click-to-contact actions. Opening WhatsApp does not prove that a message was delivered; manual activity must be labeled accordingly.

Later: provider-backed transactional email, WhatsApp Business, SMS, delivery events, inbound association, consent controls, template approval, unsubscribe/suppression lists, and signed webhook verification. Gmail/Outlook mailbox sync, telephony recording, ad-platform leads, and campaign automation require explicit account setup and provider-specific work. Never place provider credentials in the client bundle.

Optional commercial tools include fee quotations, invoices, payment schedules, outstanding balances, commission tracking, and accounting exports. Begin with payment references/status; payment collection and accounting integration are separate projects requiring business rules and providers.

## 10. Blog CMS

### Authoring and editorial workflow

- Create, edit, duplicate, archive, and restore posts.
- Rich-text editor with headings, lists, links, quotes, tables, images, captions, alt text, and approved embeds.
- Title, slug, excerpt, feature image, author, tags, business section, featured flag, and publication dates.
- Draft, In review, Scheduled, Published, and Archived states.
- Autosave, saved-state indicator, revision history, editor identity, and conflict detection.
- Permission-protected previews with no indexing and no public draft API exposure.
- Publishing permission separate from editing; scheduling handled on the server.
- Slug collision checks, permanent redirects for approved changes, and publication audit events.
- Search, status/author/section filters, pagination, and bulk archival where authorized.

Store both editor source and sanitized rendered HTML. Imported Lexical content may use Ghost-specific nodes that a new editor cannot round-trip safely. Preserve the original source, render sanitized legacy HTML initially, and convert with a tested importer before enabling full rich-text editing for a migrated post. Unsupported cards should be flagged and retained safely, not silently discarded or flattened without review.

### SEO and public delivery

Store meta title/description, Open Graph/Twitter metadata, feature-image alt/caption, canonical override, publish/modified dates, and author profile. Generate canonical tags, social metadata, BlogPosting schema, and sitemap entries from the same content service.

Public loaders return only published, currently visible records. Render post content and metadata server-side for crawlers, return a true 404 for unknown posts, and provide stable pagination and section filters. Scheduled posts remain private until their due publish transition succeeds. Clear relevant caches on publication, update, unpublish, and redirect changes.

Maintain the existing two public blog sections. A post can be relevant to both sections, but canonical policy must be explicit: preserve existing indexed URLs first, and choose a primary canonical when the same content appears under multiple paths. Do not create a new generic `/blog/:slug` as a replacement without a URL migration decision.

Public blog media uses its own bucket and documented access policy. Private editorial sources, unpublished attachments, and revisions remain protected even when published HTML is public.

## 11. Ghost migration process

### Step A: inventory and backup

Create a checksum manifest of the export and retain an access-restricted original outside Git. Capture all content IDs, slugs, tags, authors, metadata, media references, source checksums, and proposed destinations. Obtain the actual production domain(s), Ghost public URL, existing redirects, and `routes.yaml`/theme routing if available. The JSON export does not establish every historical public URL.

Back up the live site, Ghost database/assets, current lead stores, and relevant VPS configuration before cutover. Reconcile the supplied export with live Ghost if posts changed after export.

### Step B: transform by allowlist

| Ghost data | Destination |
| --- | --- |
| `posts.id`, `uuid` | Legacy identity mapping and repeatable import key |
| `title`, `slug`, `type`, `status` | Content identity and workflow |
| `html`, `lexical`, optional `mobiledoc` | Sanitized rendering plus protected original source |
| `custom_excerpt`, `plaintext` | Excerpt, search text, reading-time input |
| `feature_image`, `featured` | Media mapping and featured state |
| `created_at`, `updated_at`, `published_at` | Explicit original timestamps, not only Appwrite system dates |
| `posts_meta` | Allowlisted SEO, social, image metadata joined by post ID |
| `tags`, `posts_tags` | Tags, ordered links, section mapping |
| `users`, `posts_authors` | Public author profiles and ordered authorship only |
| `visibility` | Visibility policy; never make restricted content public accidentally |
| `canonical_url` | Preserve valid explicit overrides if encountered |

Do not migrate Ghost accounts as Appwrite logins. Invite staff separately. Newsletter, paid membership, theme configuration, Ghost admin settings, snippets, and arbitrary injected scripts are outside the blog migration. Audit code injections and embeds; recreate only deliberately selected functionality through application code/configuration.

### Step C: media and link handling

Extract images, `srcset`, links, relative `/content/...` references, captions, and embeds. Resolve relative and Ghost placeholder references using the verified source origin. Keep external references where appropriate; copy assets to Appwrite only when access and reuse rights permit. Record origin, target file ID/URL, checksum, and errors. Use an allowlisted downloader with network, file-size, timeout, and content-type restrictions.

Preserve image alt text, captions, figure markup, headings/anchors, tables, and internal links. Keep old media paths working through redirects/proxying or migrate all references before removing Ghost. A JSON import alone is insufficient to decommission the image host. Review representative long posts, tables, special cards, and mobile rendering.

### Step D: URLs and redirects

Preserve existing education and immigration article paths and slugs. Produce an explicit old-URL → new-URL manifest from verified live routing, not guessed title patterns. Include alternate hosts, Ghost article paths, changed slugs, trailing slashes, and any existing category/author routes that actually receive traffic.

Avoid redirect loops/chains and redirecting unrelated missing posts to a homepage. Keep the exported About page in the content inventory; do not replace the existing company `/about` page automatically. Resolve the one untagged post explicitly and record the decision.

### Step E: import and verify

Build a CLI with dry-run, resume, validate, and scoped rollback modes. It should upsert by legacy ID, checkpoint progress, import dependencies before posts, handle pagination and rate limits, and emit a redacted report. Rerunning the same import must not create duplicates. Rollback can remove only unchanged records/assets belonging to the selected migration run; it must not delete subsequent staff edits.

Acceptance gates:

- All 30 blog posts, one page, author mapping, and 29 original post-tag links are accounted for.
- Every post has an explicit section/visibility decision, including the untagged post.
- Slugs, original publication dates, title/body, author links, and supported metadata reconcile against the source manifest.
- Every verified former public URL resolves or redirects to its intended destination.
- Media references are validated; any unresolved reference is visible in the report and resolved or deliberately retained before decommissioning Ghost.
- Sanitization strips unsafe behavior while retaining legitimate article structure.
- Draft and scheduled content cannot be accessed through public loaders or storage paths.
- Sitemap, canonical URLs, social cards, structured data, related posts, and homepage previews use Appwrite-backed content.

### Step F: cutover

Rehearse in staging. Freeze Ghost editorial writes briefly or import a final delta. Take final backups, import/validate, switch the public content adapter, deploy redirects, and monitor content failures. Keep the old Ghost service available during the agreed rollback window. Remove `/ghost` proxying and old client configuration only after validating that neither public routes nor assets depend on them.

## 12. Appwrite data and storage design

Names below are logical entities. Choose collections/documents or tables/rows only after checking the installed Appwrite version. Pin SDK versions to that installation and verify supported indexes, transactions, storage limits, schedules, and runtime features.

| Entity | Main responsibility |
| --- | --- |
| Staff profiles and memberships | Identity linkage, roles, teams, branch, availability |
| Contacts | Person identity and preferred contact methods |
| Leads | Enquiry lifecycle, owner, stage, source, next action |
| Submissions | Immutable intake payload/provenance and idempotency reference |
| Education/immigration profiles | Service-specific qualification data |
| Activities and note revisions | Timeline and counselor work history |
| Assignments | Ownership/handoff history |
| Tasks and reminders | Action items, recurrence, due/overdue state |
| Appointments | Bookings, attendees, availability references |
| Applications/cases | Independent application milestones and outcomes |
| Document records | File linkage, checklist, classification, review, expiry |
| Consent records | Channel permission, wording/version, withdrawal |
| Posts and revisions | Editorial source, rendering, publication, SEO |
| Tags/authors and junctions | Ordered content relationships |
| Media assets | Public content assets and origin mapping |
| Redirects | Verified former path to destination mapping |
| Pipeline stages/custom fields | Versioned workflow configuration |
| Notifications | Recipient, read state, event references |
| Jobs/outbox and deliveries | Durable scheduling, retries, provider results |
| Audit events | Restricted security and operational changes |
| Import runs and mappings | Source IDs, checksums, checkpoints, reconciliation |
| Report aggregates | Scoped summaries for larger datasets |

All business records have a stable ID, organization scope, timestamps, creator/updater where relevant, and a version for concurrency. Store long post source/HTML in private files if record-size limits make inline content unsuitable. Use explicit IDs and controlled joins instead of assuming arbitrary relational queries are available.

Define query-driven indexes: organization/team + owner/stage/date; task owner + status + due time; lead/activity timestamp; case owner + stage + deadline; post section + visibility + publication time; normalized contact search; legacy source ID uniqueness; URL uniqueness; job deduplication and due-job indexes. Validate actual query/index combinations against the deployed API. Paginate all lists, exports, import scans, and sitemap reads.

Use separate storage buckets for public published media, private editorial assets/import originals, and private client documents. Backups must cover both database records and storage objects.

## 13. Application code organization

Introduce server-only Appwrite session and privileged clients; shared validation schemas; a central authorization policy; CRM services; a content service; job handlers; and repository adapters. Keep credentials out of modules that can reach the browser bundle.

Suggested areas:

- `app/lib/appwrite.server.ts`, `auth.server.ts`, and `permissions.server.ts`.
- `app/features/crm/` for intake, contacts, leads, assignment, activities, tasks, appointments, and cases.
- `app/features/cms/` for content querying, editorial workflow, revisions, media, and redirects.
- `app/admin/` for protected route modules, shell, forms, and views.
- `scripts/migrations/` for schema setup, Ghost import, lead import, reconciliation, and rollback tooling.
- A dedicated worker/function area for reminder dispatch, publishing, and reconciliation.

Replace the three Ghost adapters with one normalized content service used by main, education, immigration, homepage previews, related articles, and the sitemap. Remove JSON-file writes once production lead data is migrated and every intake path is confirmed.

Prefer repeatable schema/bootstrap scripts with a dry-run/diff report to manual console-only setup. Keep development, staging, and production projects isolated. Do not copy real applicant data into shared development environments.

## 14. Reporting and management

First release dashboards: new leads by period/source, unassigned count, first-contact backlog, due/overdue follow-ups, appointments, stale leads, leads by stage, counselor workload, and application deadlines.

Expanded reports: stage conversions, time in stage, first-response time, source-to-qualified/application/enrollment conversion, intake/destination demand, counselor outcomes, lost reasons, document completion, application decisions, and campaign attribution. Define conversion denominators and date semantics explicitly: a cohort conversion report differs from a count of stage changes this month.

Apply scope rules to both raw rows and totals. Manager reports cover their teams; content roles cannot infer CRM data through analytics endpoints. Support permission-controlled CSV exports and later scheduled report delivery. Historical workload/assignment reporting must use ownership at the event time, not only today's owner.

## 15. Security, privacy, operations, and recovery

Replace the existing unprotected admin handlers before connecting additional live data. Use secure HttpOnly session cookies, appropriate SameSite/CSRF defenses, server validation, login rate limiting, and restricted staff registration. Make admin pages non-indexable, but do not treat robots rules as access control.

Use HTTPS, origin restrictions, minimal Appwrite key scopes, secret rotation, signed provider webhooks, sanitized article HTML, safe structured-data output, safe exports, private file permissions, and redacted logs. Keep credentials and original Ghost export out of source control. The export's secret-bearing settings are a reason for restricted handling even though they are not needed by the importer.

Audit assignment, stage changes, merges, exports, role changes, publication, file access where appropriate, and deletion. Ordinary staff cannot edit audit records. Retention balances accountable history with deletion/minimization requirements; avoid storing full sensitive payloads in audit logs.

Define retention by enquiry, client case, document, communication, job, and backup type with the business before automatic deletion is enabled. Support consent withdrawal and controlled personal-data export/correction/deletion workflows. Determine applicable policies with the business rather than assuming a universal retention period.

For the VPS, verify RAM/CPU/disk, HTTPS/reverse proxy, Appwrite/worker health, SMTP, storage configuration, backups, firewall, and dependency versions. If Appwrite and the website share a VPS, account for a shared failure domain and resource contention.

Set backup frequency and recovery objectives explicitly; proposed starting targets are daily backups, recovery point within 24 hours, and recovery within four hours, subject to a measured restore rehearsal. Maintain off-host encrypted copies, test restoration of database plus files, and document a recovery runbook. Monitor failed intake, elevated application errors, storage capacity, failed jobs, scheduler heartbeat, email failures, and backup age. Alerts must go to an agreed operational recipient.

## 16. Implementation phases and completion gates

| Phase | Implementation | Completion gate |
| --- | --- | --- |
| 0. Discovery and design | Production inventory, Appwrite capability check, URL/media manifests, schema, role rules, screen specification | Requirements, compatibility, and migration decisions documented |
| 1. Foundation | Server auth, invitations, role enforcement, Appwrite schema/storage, audit, deployment configuration | Direct unauthorized reads/writes and cross-counselor access denied |
| 2. Lead intake and CRM | Connect all forms, import existing leads, lists/details, assignment, stages, notes/history, search | Every form persists once; counselor assignment and status workflow work end-to-end |
| 3. Follow-up operations | Tasks, calendar, first-response targets, scheduler, retries, reminders, manager views | Reminders work with browsers closed and recover after worker restart |
| 4. CMS and migration | Editor, media, revisions, publishing, Ghost dry run, redirects, sitemap/content adapter | All migration acceptance gates pass in staging |
| 5. Cases and reporting | Applications, private documents, checklists, case deadlines, operational reports | Counselor can move a sample lead through a full application workflow |
| 6. Production rollout | Final reconciliation, backups, lead/content cutover, monitoring, restore/runbook, staff training | Production smoke checks and controlled first-week monitoring pass |
| 7. Extensions | Provider email/WhatsApp/SMS, calendars, external lead sources, financial tools, client portal | Each integration passes its own permission, delivery, and recovery checks |

Phases can be delivered as usable increments; the essential production scope is phases 1–4 plus rollout controls. Private document workflows cannot ship before their authorization and recovery checks pass.

Indicative effort for one experienced engineer: discovery 2–4 working days; foundation 4–7; lead CRM 6–10; follow-ups/calendar 4–7; CMS/migration 5–9; applications/documents/reports 6–10; rollout and training 3–5. These are planning ranges, not a delivery commitment. A robust core release is likely several weeks; the full operational scope is approximately 6–11 engineering weeks before extensive external integrations, depending on infrastructure and review turnaround.

## 17. Verification plan

Run repository typechecking and production builds as implementation progresses. Add focused tests for business rules and access boundaries, with staging end-to-end checks for critical workflows.

Required scenarios:

1. Anonymous users cannot fetch applicant data, mutate leads, export records, view private files, or open draft previews.
2. Counselors see only their permitted work; content staff see no CRM data; manager scope is enforced on reports and exports.
3. Reassignment and staff deactivation revoke access to linked resources.
4. Every public form creates a durable enquiry; main contact no longer reports unsaved success; invalid submissions receive usable errors.
5. Double-clicks/retries create one submission; separate repeat enquiries remain in history; concurrent matching does not corrupt contact identity.
6. Assignment collisions, invalid stage changes, and stale edits are handled explicitly.
7. A due task produces the correct reminder; completing/rescheduling prevents stale reminders; retry and worker restart do not flood recipients.
8. Provider failure does not fail lead persistence; Appwrite failure does not report success.
9. Uploaded documents cannot be guessed/downloaded by another counselor or anonymous user.
10. Draft/scheduled publication restrictions, editor conflicts, slug collisions, and redirect changes behave correctly.
11. Ghost import is repeatable and resumable; counts, fields, links, metadata, assets, and URLs reconcile.
12. Public article HTML/metadata render server-side; a missing slug returns 404; sitemap includes all published records beyond a single API page.
13. Backups restore a usable database, file set, and scheduled-work state.
14. Permission-aware pagination, search, and reports perform acceptably on representative synthetic datasets. Establish numeric response-time targets after measuring the VPS.

Use synthetic contacts/files for automated tests. Review actual imported articles for visual fidelity without exposing applicant data or export settings in reports.

## 18. Existing lead migration and rollout continuity

Inventory the production `applicants.json`, all relevant Google Sheets, and any staff-maintained spreadsheets. The two local records are not evidence of the full production lead count. Browser-local records exist only in the browsers that stored them and need an explicit recovery/export process if they matter.

Import with source IDs, original timestamps, original statuses, provenance, and deduplication candidates. Map current New/Contacted/In Review/Enrolled/Archived statuses explicitly; retain the original values when a direct new-stage mapping would lose meaning. Label unknown dates and ownership rather than inventing history.

Choose a single authoritative intake path during cutover. Back up legacy stores, stop legacy writes at the agreed transition, import final changes, switch all forms, and reconcile counts. If temporary dual writing is necessary, use a durable secondary delivery job and reconciliation, never two independent writes presented as equally authoritative.

Prepare separate rollback procedures for website rendering and lead intake. Reverting blog reads to Ghost must not drop CRM records already received. Restoring an old database must not overwrite post-cutover leads; preserve and replay the delta or keep intake on the new service while reverting the UI.

## 19. Inputs needed before environment connection

Planning and local implementation can proceed without production credentials. Before Appwrite integration and staging deployment, provide:

- Appwrite HTTPS endpoint and installed self-hosted version.
- Intended project ID, or permission to create an isolated project; whether it already holds production data.
- Server-side secret configuration through a secure local/environment mechanism; use a narrowly scoped temporary setup key if needed. Do not commit keys or paste VPS/root credentials into repository files.
- Website production/staging domains, application deployment method, reverse proxy arrangement, VPS capacity, and backup ownership.
- Current Ghost public origin, historical blog URLs, asset backup/access, routing configuration, and whether editorial content has changed since export.
- Production lead sources and an authorized export/access path for each, including Google Sheets.
- Initial owner/admin email, staff roster, roles, branch/team structure, and counselor visibility preference.
- Preferred first-response targets, working hours, default timezone, reassignment rules, and reminder channels.
- Email provider/SMTP configuration and sender domain when email reminders are enabled; WhatsApp/SMS/calendar details only when those integrations begin.
- The untagged post's section, the legacy Ghost About page treatment, and any content that must remain restricted.
- Business retention rules, operational alert recipient, and recovery priorities before launch.

The proposed default is that counselors see assigned leads, managers see their teams, content staff see only CMS tools, Asia/Karachi is the default display timezone, and internal in-app reminders launch before provider-based client messaging. These defaults can be adjusted during configuration.

## 20. Deliverables

The implementation will produce the protected dashboard; unified and verified lead intake; counselor workflows and assignment; tasks, appointments, and reliable reminders; blog CMS and public Appwrite content service; schema/bootstrap scripts; Ghost and lead migration tools with reconciliation reports; access tests and critical workflow tests; deployment/backup/rollback documentation; and staff handover guidance.

Begin implementation with the server authentication boundary and Appwrite capability check. That establishes a secure foundation for every later CRM and publishing feature.

## 21. Accepted subdomain architecture and implementation update

The user selected **crm.proconsulting.uk** for the staff workspace. Appwrite remains on **appwrite.proconsulting.uk**. Use the existing repository/build with two independent Node processes: the website on loopback port 3000 and the CRM on loopback port 3001. Nginx, or the VPS's existing edge proxy, routes by hostname. The CRM hostname root redirects to `/admin`; dashboard URLs retain their `/admin` prefix, so no path rewriting is necessary.

The application independently enforces the configured dashboard origin, staff sessions, and operation/record permissions. A proxy rule alone cannot protect applicant data. Use host-only, signed, HttpOnly staff cookies with Secure enabled in production, never a shared parent-domain cookie. Preserve forwarded host/protocol only through the trusted loopback edge. Keep application ports closed to external traffic. Omit public analytics from staff pages.

Deployment requires DNS, TLS, inspection of the current edge (Appwrite/Traefik may already own ports 80/443), schema/runtime configuration, and authenticated smoke checks. The additive Nginx example must not replace Appwrite's active vhost or bind conflicting listeners. Details are in `deploy/CRM-DEPLOYMENT.md`.

Implementation has started with the protected dashboard, common lead intake, assignment, activity notes, follow-up tasks, sanitized HTML content editing, additive schema scripts, and VPS configuration. The initial Appwrite database/private collections and the requested owner profile have been provisioned. This is a foundation increment, not completion of every feature in the specification. Automated reminders, full Ghost migration/public content cutover, rich-text authoring, applications/documents, and advanced operational modules remain planned. The working implementation and actual verification/deployment state are maintained in `context-vault/`.

The user also requested an Obsidian-compatible context vault with architecture and file updates. `context-vault/00 Home.md` is its entry point. Repository guidance requires updates alongside substantial changes, and a daily documentation-only maintenance heartbeat reviews source drift. The vault excludes environment values, credentials, original Ghost settings, and applicant data.

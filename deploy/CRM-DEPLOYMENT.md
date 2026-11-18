# First-day CRM deployment: crm.proconsulting.uk

This runbook adds the CRM subdomain to the existing VPS. Start with a controlled staff trial: this development branch contains modules still awaiting acceptance. Read `context-vault/Session Wall.md` and `Feature Ledger.md` for current gates. No VPS deployment has been performed by these instructions.

For a first install alongside the existing public website, start with the [first-install checklist](CRM-FIRST-INSTALL.md).

## 1. Topology and prerequisites

| Host | Destination | Purpose |
| --- | --- | --- |
| `crm.proconsulting.uk` | Nginx → `127.0.0.1:3001` | CRM; `/` redirects to `/admin` |
| `proconsulting.uk` | Existing website; optional future process `127.0.0.1:3000` | Keep its current release during the CRM trial |
| `appwrite.proconsulting.uk` | Existing Appwrite proxy | Keep its existing service and TLS |

The same React Router build supports both website and CRM; no separate frontend repository is required. `APP_SURFACE=dashboard` selects the staff surface. Nginx passes paths unchanged. Auth uses host-only Secure/HttpOnly/SameSite=Strict signed cookies and checks `DASHBOARD_URL`. Appwrite calls run on the server; API keys must never have a `VITE_` prefix. No browser Appwrite CORS entry is needed for the current server-mediated login flow.

Commands below target Debian/Ubuntu with systemd and **host Nginx owning public ports 80/443**. First inspect the VPS:

```bash
sudo ss -ltnp
sudo systemctl status nginx --no-pager
# If Docker is installed:
docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

If Appwrite's Traefik, Nginx Proxy Manager, a container, or another edge already owns these ports, **do not install/start a competing Nginx or stop Appwrite**. Add host routing and certificates to that existing edge instead. The supplied vhost assumes Nginx and Node run on the host; container loopback addresses refer to that container, so container routing requires its actual reachable upstream address. Preserve the forwarded Host/protocol and restrict direct Node access. This alternate topology needs the VPS's existing edge configuration before exact commands can be supplied.

Have SSH/sudo access, a non-root deployment user, GitHub read access, Node **22.18+ or 24 LTS** and npm, PM2, a DNS control panel, and an Appwrite operator account. Install Node from its official distribution using your VPS's existing Node installation method, then check `node --version` and `npm --version`. Worker scripts import TypeScript and require the stated Node floor.

Back up existing Nginx configs, PM2 process definitions, the current website release, Appwrite database/storage volumes and configuration using your existing backup procedure. Verify a restore before public intake rollout. Keep backups outside the checkout and never put `.env` in Git. Record the current website and CRM commit IDs privately for rollback.

For a host-Nginx installation, after confirming port ownership:

```bash
sudo apt-get update
sudo apt-get install nginx certbot git ca-certificates
# Install PM2 using the deployment user's Node installation (avoid root-owned app processes).
npm install -g pm2
```

Allow inbound TCP 80/443 in your provider firewall. Preserve SSH access before editing UFW; do not enable/reset a firewall blindly. Never open 3000/3001 to the internet. Node binds loopback. If another trusted local process can reach Node, it can supply forwarded headers; keep the host restricted to trusted operators.

## 2. DNS

Create an A record named `crm` pointing to the VPS public IPv4 address. Add AAAA only when this same vhost is reachable over IPv6; the supplied files listen on IPv4. If enabling IPv6, add corresponding `[::]:80` and `[::]:443 ssl` listeners and test both stacks. Remove stale AAAA records that point elsewhere.

```bash
dig +short A crm.proconsulting.uk
dig +short AAAA crm.proconsulting.uk
```

For initial certificate issuance use DNS-only mode if a CDN interferes with ACME. Afterward use strict HTTPS from CDN to origin; disable caching for the CRM. The basic login throttle uses the edge-visible client address. Behind a CDN, configure trusted real-IP ranges from that provider before relying on per-user limits; never trust arbitrary internet `X-Forwarded-For`.

## 3. Checkout and environment

Use a dedicated checkout so testing cannot overwrite the existing public website. Commands run as the non-root deployment user unless `sudo` is shown:

```bash
sudo install -d -o "$USER" -g "$(id -gn)" /srv/proconsulting-crm
git clone --branch codex/crm-workspace git@github.com:codeproconsulting/main.git /srv/proconsulting-crm
cd /srv/proconsulting-crm
git status --short
git rev-parse HEAD
npm ci
cp -n deploy/env.example .env
chmod 600 .env
${EDITOR:-nano} .env
```

For later updates use `git fetch origin`, review the intended tested commit, and fast-forward or check out that approved release with a clean worktree. Do not reset a dirty checkout. For a formal production release, deploy the accepted main/release commit instead of assuming the latest development branch is accepted.

Set these values in the protected `.env`:

| Variable | Value / action |
| --- | --- |
| `DASHBOARD_URL` | `https://crm.proconsulting.uk` exactly; no `/admin` suffix |
| `VITE_APP_URL` | `https://proconsulting.uk` |
| `APPWRITE_ENDPOINT` | `https://appwrite.proconsulting.uk/v1` |
| `APPWRITE_PROJECT_ID` | Your existing ProConsulting project ID |
| `APPWRITE_DATABASE_ID` | `proconsulting` |
| `APPWRITE_API_KEY` | Temporary setup key initially; replace with runtime key before startup |
| `SESSION_SECRET` | Generate once with `openssl rand -hex 32`; paste privately into the file |
| `APPWRITE_DOCUMENT_BUCKET` / `APPWRITE_MEDIA_BUCKET` | `crm-documents` / `crm-media` |
| `BLOG_PROVIDER` | `ghost` until CMS-04 cutover is accepted |
| Ghost `VITE_*` settings | Preserve working production Ghost URL and Content API key |

`VITE_*` variables are public build inputs; never place secrets there. Rebuild after changing them. Runtime server variables are read at startup; restart the CRM after changes. Changing `SESSION_SECRET` signs staff out. Do not print `.env`, use shell tracing around credentials, or paste keys into command arguments/logs. Root and the deployment user must be trusted because they can access process/configuration secrets.

## 4. Appwrite readiness and first owner

Use a temporary setup key for the installed Appwrite API's database, collection, attribute, index and document read/write scopes; storage setup also needs bucket read/write. Staff linking needs `users.read` plus private staff document read/write. Keep these operator permissions out of the final runtime key.

The scripts create missing schema and never replace existing records. Media setup also corrects the default for future `published` values to false; existing records are unchanged. Preview first, apply only intended missing schema, then verify:

```bash
node scripts/setup-appwrite.mjs
node scripts/setup-appwrite.mjs --apply
node scripts/setup-appwrite.mjs
node scripts/setup-storage.mjs
node scripts/setup-storage.mjs --apply
```

For a narrowly scoped media increment use `node scripts/setup-appwrite.mjs --only=media --apply` and `node scripts/setup-storage.mjs --only=media`. Existing schema and bucket security must match; script success is not a full data backup or permission audit. Storage verification requires file read/write access and actual upload/download testing. An optional disposable check is `node scripts/verify-media-storage.mjs --apply`: it creates one private synthetic PNG/metadata record, checks byte integrity and anonymous denial, and removes both in a finally block. Review any cleanup failure before retrying. Bucket antivirus enabled is configuration evidence, not proof of every scanner deployment condition.

Create or locate the Auth user `admin@proconsulting.uk` in Appwrite Console. Its identity/private owner profile was already provisioned during development; verify it in the actual target project. The owner must choose a password securely through the Console before first login; no permanent password is in this repository. If linking an existing Auth user is necessary, substitute its actual ID:

```bash
node scripts/provision-staff.mjs AUTH_USER_ID "ProConsulting administrator" owner
```

This command links a new profile and protects existing staff profiles; use it only for the intended owner. CRM roles live in the private staff collection, not browser-supplied claims. Counselor assignment requires a separate active counselor profile linked to an Auth identity.

Replace the setup key in `.env` with a runtime key: private document read/write, file read/write, and `sessions.write` for SSR email/password login. Check exact scope names in your installed Appwrite Console. Revoke the temporary key after setup checks. Team & access additionally needs `users.read` for Auth identity lookup and uses `sessions.write` to revoke sessions. Database and bucket schema scopes stay with the setup key. Appwrite server keys bypass record permissions, so application role enforcement remains essential. Keep collection/bucket and uploaded file permissions private; public article images are streamed by an application route only after publisher approval.

## 5. Build and start only the CRM

```bash
npm run typecheck
npm test
npm run build
pm2 startOrReload deploy/ecosystem.config.cjs --only proconsulting-crm --update-env
pm2 status
pm2 logs proconsulting-crm --lines 50 --nostream
```

Run from `/srv/proconsulting-crm`; build and PM2 share this checkout. Do not run the ecosystem without `--only` during this trial: that would also start the new public website process and potentially collide with the live website. Keep exactly one CRM instance. Distributed locks protect selected mutations but crash-left locks and pending audits require operator recovery; read `docs/SCHEDULED-PUBLISHING.md`.

Check local routing before opening the domain:

```bash
curl -I http://127.0.0.1:3001/admin/login \
  -H 'Host: crm.proconsulting.uk' \
  -H 'X-Forwarded-Host: crm.proconsulting.uk' \
  -H 'X-Forwarded-Proto: https'
```

Expected: 200 login page, private/no-store headers. Do not log in over loopback HTTP from a remote browser. Keep `ENABLE_BACKGROUND_WORKER` and `ENABLE_SCHEDULED_PUBLISHING` unset during the initial CRM trial. Due-task reminder activation, health and crash recovery are documented separately in `docs/IN-APP-REMINDERS.md`. Worker opt-ins are environment variables on the **PM2 invocation**, not automatically taken from `.env` when the ecosystem file is evaluated. Scheduling a post stores it but will not publish automatically until the dedicated publisher is deliberately enabled after rollout gates.

## 6. TLS bootstrap: HTTP serves only certificate challenges

Install **only** the bootstrap vhost first. It returns 503 for login and all other application paths. Inspect any existing `crm` vhost first; do not enable duplicate server names. Back up the active target before replacing it on an existing installation.

```bash
sudo install -d -m 755 /var/www/letsencrypt/.well-known/acme-challenge
sudo install -d -m 755 /etc/nginx/snippets /etc/nginx/sites-available /etc/nginx/sites-enabled
sudo install -m 644 deploy/nginx/snippets/proconsulting-crm-proxy.conf /etc/nginx/snippets/proconsulting-crm-proxy.conf
sudo install -m 644 deploy/nginx/crm.proconsulting.uk.bootstrap.conf /etc/nginx/sites-available/crm.proconsulting.uk.conf
# First installation only; if the link exists, inspect it instead of overwriting it.
sudo ln -s /etc/nginx/sites-available/crm.proconsulting.uk.conf /etc/nginx/sites-enabled/crm.proconsulting.uk.conf
sudo nginx -t
sudo systemctl reload nginx
```

Confirm `/etc/nginx/nginx.conf` includes `sites-enabled/*` inside its `http` block. On systems using `conf.d` instead, install one active `.conf` there; never enable a second copy. Test a challenge from outside the VPS:

```bash
printf 'crm-acme-check\n' | sudo tee /var/www/letsencrypt/.well-known/acme-challenge/crm-check >/dev/null
curl --fail http://crm.proconsulting.uk/.well-known/acme-challenge/crm-check
sudo rm /var/www/letsencrypt/.well-known/acme-challenge/crm-check
sudo certbot certonly --webroot -w /var/www/letsencrypt \
  --cert-name crm.proconsulting.uk -d crm.proconsulting.uk
```

Answer Certbot's registration/contact prompts. If CAA, DNS, CDN, firewall, IPv6, or port ownership prevents issuance, fix that first; login stays unavailable during bootstrap. No credentials are forwarded over HTTP.

## 7. Enable final HTTPS routing and renewals

Only after the certificate files exist:

```bash
sudo install -m 644 deploy/nginx/crm.proconsulting.uk.conf /etc/nginx/sites-available/crm.proconsulting.uk.conf
sudo nginx -t
sudo systemctl reload nginx
curl -I http://crm.proconsulting.uk/admin/login
curl -I https://crm.proconsulting.uk/admin/login
```

Expected: HTTP 308 to the fixed CRM HTTPS host; HTTPS 200 login, correct trusted certificate, noindex/nosniff/frame headers. The final vhost proxies `/admin`, `/admin/*` (including React Router `.data` requests), `/admin.data`, `/__manifest` for lazy route discovery, the repository logo and build assets, rejects other routes, allows 25 MB multipart requests, and rate-limits login POST and `.data` actions. App-level image/document limits remain 5/20 MB. Do not strip `/admin` with a trailing-URI `proxy_pass` rewrite.

Webroot renewal leaves routing intact. Install a root-owned deploy hook and test renewal:

```bash
sudo install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
printf '#!/bin/sh\n/usr/sbin/nginx -t && /bin/systemctl reload nginx\n' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/proconsulting-nginx >/dev/null
sudo chmod 755 /etc/letsencrypt/renewal-hooks/deploy/proconsulting-nginx
sudo certbot renew --cert-name crm.proconsulting.uk --dry-run
sudo systemctl enable --now certbot.timer
sudo systemctl list-timers certbot.timer
```

For a different Certbot package/snap, use its installed renewal scheduler instead of adding a duplicate. Confirm the hook's executable paths with `command -v nginx` and `command -v systemctl` on that VPS. Reload Nginx after a successful certificate renewal. Monitor renewal errors and expiry.

## 8. Reboot persistence and first-day acceptance

As the same deployment user:

```bash
pm2 startup systemd
# Execute the exact sudo command PM2 prints, with this user's home and Node PATH.
pm2 save
```

`pm2 save` saves all processes owned by this PM2 user; inspect `pm2 status` first. Keep existing public website processes intact. After a controlled reboot verify the generated `pm2-USER` systemd service, `pm2 status`, loopback bindings and HTTPS. When upgrading Node, regenerate the startup unit to use the new binary.

Before admitting staff, verify in a browser:

- `/` redirects to `/admin`, anonymous `/admin/leads` redirects to login, unrelated CRM public URLs return 404, `/robots.txt` disallows indexing.
- Owner can sign in and sign out; cookie is Secure, HttpOnly, host-only, SameSite=Strict. Bad credentials fail without exposing secrets; invalid cross-origin mutation is rejected.
- A counselor can access assigned synthetic leads only, record a status/note/follow-up, and cannot publish content or promote staff. Owner can assign those synthetic leads. Remove synthetic data through approved operator tools after checks.
- Media starts private; editor can upload/preview; publisher explicitly changes visibility. A public image URL needs the accepted app build on the **public website process** too. Starting the CRM alone cannot add `/media/:id` to the old public release. Do not rewrite public-host URLs to the CRM or expose a private bucket to bypass that gate.
- Check existing `proconsulting.uk` and `appwrite.proconsulting.uk` still work. Before any later public website update, verify public intake persists a synthetic submission to Appwrite and existing Ghost article routes/media remain intact.

Record the exact commit, checks and remaining gaps in the context vault. Reminder source fields and private worker health are provisioned and feature-tested; the VPS reminder runner is still disabled. Current development code includes authoring/revisions, verified local cases, calendar, private documents and staff access, staged reporting and opt-in reminders; inspect the feature ledger for acceptance, not just build success. Managers currently have organization-wide CRM scope. Email/WhatsApp/SMS providers and Ghost cutover remain separate work. Keep `BLOG_PROVIDER=ghost` and real imported drafts private.

## 9. Updates, rollback and troubleshooting

For an accepted CRM update: record the current commit, fetch/review the next commit in a clean checkout, run `npm ci`, typecheck/tests/build, then `pm2 restart proconsulting-crm --update-env`. Test HTTPS and staff workflows again. A shared in-place build can briefly mismatch assets during deployment; use versioned release directories and an atomic current symlink for a later zero-downtime rollout. Do not promise zero downtime from this first-day process.

For immediate containment use `pm2 stop proconsulting-crm` or the certificate-only bootstrap (503). To revert code in a clean dedicated checkout, check out the **recorded previous working CRM commit**, `npm ci`, rebuild, and restart that CRM process. The tag `rollback/main-2026-10-29-407977c` preserves the old website baseline; it predates this CRM and is not a working CRM rollback release. Preserve current Appwrite leads/files: do not restore an old database over new submissions. Restore only the CRM vhost backup, test `nginx -t`, and reload; do not replace other hosts. Keep Ghost and its assets until CMS-04 is accepted.

| Symptom | Check |
| --- | --- |
| Port 80/443 already in use | Existing edge/container owns listeners; integrate routing there |
| ACME 404/time-out | DNS A/AAAA, CDN rules, firewall, challenge webroot, active vhost |
| `nginx -t` certificate error | Final file enabled before issuance, wrong cert name/path; restore bootstrap |
| 502 | `pm2 logs`, build exists, cwd, port 3001 listening on host loopback |
| Redirect loop or mutation 403 | Exact DASHBOARD_URL; Host, X-Forwarded-Host and X-Forwarded-Proto preserved; HTTPS at edge |
| Login fails/503 | Runtime `sessions.write`, private staff profile, active role, owner password, endpoint/project and API key |
| Upload 413 | Nginx 25M request limit; app 5/20 MB limit and supported signature/type |
| Upload 503 | File read/write scopes, private bucket readiness, Appwrite storage/scanner logs; never disable antivirus to hide a failure |
| Image 404 | Private visibility, missing metadata, or public website still on its old build |
| Record remains locked | Stop competing writers and follow documented lock/audit reconciliation; do not blindly delete locks |
| Server works until reboot | PM2 startup unit/user/PATH and saved process list |

Review application and proxy logs without storing credentials/applicant content. Set log rotation/retention and backup monitoring before real applicant use. No actual `nginx -t`, certificate issuance, VPS smoke test or reboot has been run on the target server as part of writing this guide.

## References

Routing and headers follow the [Nginx proxy module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) and [core request-size/location directives](https://nginx.org/en/docs/http/ngx_http_core_module.html). Certificate issuance/renewal follows the [Certbot webroot and renewal guide](https://eff-certbot.readthedocs.io/en/stable/using.html). Process persistence follows [PM2 startup documentation](https://pm2.keymetrics.io/docs/usage/startup/).

## Planned email delivery: Resend

Resend is the selected application email provider. Before COMMS-01 activation, verify the sender domain/DNS in Resend, confirm sender/reply-to addresses, configure server-only API and webhook secrets, and test the durable outbox, retries and signed delivery/bounce/complaint webhooks. Proposed configuration names: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO_EMAIL`, `RESEND_WEBHOOK_SECRET`; runtime does not consume these yet. Do not enable email merely by adding environment variables. Appwrite authentication email setup remains a separate operator configuration. See the email-provider decision in the implementation plan.

## Private client documents

Follow `docs/PRIVATE-DOCUMENTS.md` before accepting document uploads on the VPS. Provision the three additive metadata attributes, make the trusted ClamAV Unix socket available to the CRM service, and run the actual scanner, private storage and proxy acceptance checks. The runtime variable is `CRM_CLAMD_SOCKET`. The existing Nginx 25 MiB body limit allows the app's 20 MB file limit and multipart overhead.

## Team access

Follow `docs/STAFF-ACCESS.md` for handoff, session revocation and lock recovery. Provision the additive staff marker and role/active index, then verify the runtime key and perform live session checks with synthetic users in the release environment.

## Lead contact search

Follow `docs/CRM-LEAD-ENTRY.md` before releasing CRM-02 manual entry and contact search. Provision the two additive lead fields and indexes before either new app process writes leads. Backfill legacy search keys and verify public intake and staff search with synthetic records.

### Native staff workspace release

Install the matching CRM TLS certificate and use the current `deploy/nginx/crm.proconsulting.uk.conf` template. Its login limit covers `/admin/mobile/v1/session`. After `nginx -t` and release startup, check that an unauthenticated HTTPS GET to `/admin/mobile/v1/workspace` returns JSON HTTP 401 with `Cache-Control: private, no-store`. Use a test staff account on the preview device to verify scoped leads and follow-ups, then turn on airplane mode and check that the loaded snapshot remains visible during a failed refresh. Verify local sign-out clears it and restarting offline still renders native sign-in. Confirm the browser dashboard login and lead views still work before publishing the mobile preview.

### Public enquiry release gate

Before moving public traffic to this build, preview and apply the additive leads schema with a setup key. Start the candidate website on a staging origin against the target Appwrite database. Run the verifier with the setup key and document read/write permissions. Replace the loopback origin with the candidate site's origin.

```sh
node scripts/setup-appwrite.mjs --only=leads
node scripts/setup-appwrite.mjs --only=leads --apply
node scripts/verify-appwrite.mjs --only=leads --intake-origin=http://127.0.0.1:3000
```

The verifier checks the schema, submits one synthetic enquiry through the real website route, confirms the normalized fields and attempts cleanup by its generated ID. Use a controlled candidate origin with no outbound workflows enabled. Do not switch public traffic if the check fails. If an acknowledgement times out, verify the generated synthetic record was removed before retrying. Run the existing contact backfill separately for historical records. Apply the 32,000-byte `/api/leads` proxy limit to the active public vhost and validate with `nginx -t`.

### Confirmed contact groups

Use the scoped leads setup above to provision the optional `contactGroup` attribute and index before staff use this workflow. Check create, link, pagination, unlink and counselor denial with synthetic enquiries. Existing enquiries start without a group and retain their original assignments and history. For an uncertain write, inspect the enquiry version, group and audit intent before clearing the affected lead and staff-access locks under the existing operator recovery procedure.

### Duplicate enquiry decisions

Apply the scoped leads setup for the optional duplicateOf and duplicatePriorStage attributes and duplicate_of index. Provision and verify runtime reads on tasks, cases, appointments, documents and consultations before accepting duplicate decisions. Dependency checks fail closed. Verify mark, restored stage, audit and access with synthetic enquiries. For an ambiguous decision, inspect the enquiry version and duplicate fields before recovering the relevant lead and staff-access locks.

From a confirmed contact group, open **Review duplicate** and check both enquiry summaries and any blockers before submitting. The archive action rechecks the pair and dependencies under lock. The preview uses the existing schema. **Compare linked work** compares dependency counts and flags assignment differences without changing either enquiry.

### Saved lead views

Apply scoped schema setup for leads and lead_views before rollout to create the priority index and private preset collection. Confirm combined stage and priority filters, staff isolation, save and remove in the release environment. Presets store only stage and priority.

### Counselor routing

Review and apply the scoped staff and leads schema setup before rollout. Routing requires routingAvailability and routingCapacity on staff and routedAt, routedCounselor and the routed_at index on leads. Existing counselor profiles remain paused until configured. Verify settings writes, rotation lookup, scoped workload counts and normal handoff permissions with the runtime key.

### Automatic website intake routing

Use scoped leads setup to apply the optional intakeRouting attribute and intake_routing index. Build the app with npm run build to produce the worker bundle. Set INTAKE_ROUTING_ACTOR_ID to the staff profile ID of an active manager authorized to own the audit trail. This ID is not a login credential. Confirm the runtime key can read staff and dependent records and write leads, activities and locks.

After accepting the worker with synthetic data, set ENABLE_INTAKE_ROUTING=true for the website process and export it before loading the PM2 ecosystem. Start only proconsulting-intake-routing with --only and --update-env. Restart the website process in its own deployment procedure when ready to mark new enquiries. The worker checks up to five pending rows per cycle, keeps unassigned work in the manager queue when capacity is unavailable, and reports counts without applicant details. To disable, remove the website flag and reload the website, then stop the worker. Existing pending entries stay visible to managers. Preview with isolated configuration before running --once because it processes real pending rows against its configured database.

### Team migration and classification

Apply the optional staff managerScope attribute, lead teamId attribute and team index, and private crm_teams collection before running the inventory. Create active teams only after reviewing the directory and their branch labels. Existing managers stay global until an administrator assigns a reviewed team and changes their scope.

Run `node scripts/classify-lead-teams.mjs` for aggregate counts of classifiable records, invalid team references, known owner/team mismatches and active manager scopes. Inventory can run while the app is live; counts are a bounded-page scan and can change during the run.

Keep the reviewed classification manifest outside Git with permissions limited to the operator. Use a JSON array of up to 100 entries, each containing exactly `leadId`, `teamId` and the reviewed numeric `version`. Use `node scripts/classify-lead-teams.mjs --manifest=/path/to/private.json` to preview. To apply, supply the administrator profile ID via `TEAM_MIGRATION_ACTOR_ID` and append `--apply`. A blocked preflight prevents every write. Apply rechecks each row under the lead and staff-access locks, advances its version and writes an audit intent. It preserves current assignments and will only fill an empty team. A rerun skips already applied rows. A batch stops on a blocked or uncertain write; earlier successes stay applied. Reconcile uncertain lead and staff-access locks before retrying.

Repeat the aggregate inventory after each batch. Review mismatches and intentionally leave ambiguous enquiries unclassified for global administrators. Do not change a manager to team scope before its team membership and target web access checks pass.

### Appointment reminders

Set `ENABLE_APPOINTMENT_REMINDERS=true` on the existing reminder worker after runtime acceptance. The worker creates one in-app reminder during the hour before a booked appointment starts, for its current assignee. Repeat cycles reuse the same notification. Cancelled, changed, reassigned or started appointments disappear from the inbox. The flag defaults off, and regular task reminders continue even if the appointment query fails.

### Case deadline reminders

Set `ENABLE_CASE_REMINDERS=true` on the existing reminder worker after runtime acceptance. The worker creates one in-app reminder per case version during the 24 hours before a deadline. Approved, refused, enrolled, and withdrawn cases are excluded. Reminders disappear once the deadline passes or the source changes. The flag defaults off and runs independently of appointment reminders.

### Resend email outbox

Use scoped `email_outbox` Appwrite setup and verify document permissions and the due index. The outbox stores private message payloads. Keep the worker disabled until a CRM producer, recipient rules, verified sender, and release acceptance are in place. Put `RESEND_API_KEY` in the worker environment and export `ENABLE_RESEND_OUTBOX=true` before loading the PM2 ecosystem when ready.

The worker retries with the original payload and idempotency key within 23 hours of the queue record's creation. Resend documents a 24-hour key lifetime. Expired or uncertain terminal items go to review. Reconcile in Resend before taking manual action. An accepted provider response indicates acceptance, not inbox delivery. Logs contain counts only. Stop the worker before recovering a stale worker lock.

Staff reminder email requires `ENABLE_STAFF_REMINDER_EMAIL=true` on both workers, comma-separated approved pilot Auth user IDs in `STAFF_REMINDER_EMAIL_IDS`, a verified sender in `RESEND_FROM`, and the HTTPS `DASHBOARD_URL`. The runtime Appwrite key needs user read access to check the verified address. The email worker additionally requires `ENABLE_RESEND_OUTBOX` and `RESEND_API_KEY`. Before rollout, verify the optional outbox `noticeId` attribute and add the optional Appwrite `staff.reminderEmail` string attribute (size 12, empty default). Wait for it to become available. Staff must turn email reminders on for themselves in Workspace setup; allowlist membership alone will never send mail. A confirmed opt-out prevents later sends of queued notices while disabled. An email already accepted by Resend cannot be recalled. If an update reports an unconfirmed result, follow the retained lock recovery procedure before retrying. Configure both workers consistently. To stop delivery, stop the email worker and remove the flags. Keep sending disabled until the verified sender, recipient opt-in and release acceptance are ready.

### Resend delivery events

Provision private email_events and the email_outbox provider index using scoped Appwrite setup. Keep ENABLE_RESEND_WEBHOOK off until release acceptance. Register the website HTTPS path /api/webhooks/resend for only email.delivered, email.bounced and email.complained, and configure RESEND_WEBHOOK_SECRET in the website runtime. Use a dedicated Resend project or account for CRM mail so unrelated provider IDs do not retry against this endpoint. A callback can arrive before the outbox records the provider ID; a 503 asks the provider to retry. The webhook stores matched events without copying raw webhook payloads. The email worker needs read access to email_events. Any matched bounce or complaint suppresses future staff reminder emails to that address. Operator reconciliation of suppression and a staff-visible delivery history remain separate work.

### Staff email pilot acceptance

Run `node --test tests/reminder-email-pilot.test.mjs` from the release checkout. It exercises reminder generation, the outbox, simulated Resend responses, signed callbacks and the admin dashboard with synthetic data.

1. Run `node scripts/check-email-pilot.mjs` with the Appwrite setup configuration for the release target. It checks collection privacy, attributes and indexes with metadata reads. Verify the scoped runtime keys separately. Use an isolated pilot staff account with a verified mailbox you control, enable email in Workspace setup and allowlist only that account.
2. Configure the provider sender and install the Resend webhook signing secret in the website runtime. Route the webhook on the website HTTPS host to the current website build. The CRM subdomain template serves the staff workspace and does not route this callback. A CRM-only deployment therefore needs a compatible website rollout before provider events can be verified.
3. Start only the intended workers from the ecosystem. The reminder producer is `proconsulting-worker` and the sender is `proconsulting-email`. Enable email delivery only after both agree on the sender, HTTPS CRM URL and pilot allowlist. Leave appointment and case reminder flags off for the initial task pilot.
4. Create a due follow-up on a synthetic enquiry assigned to the pilot account. Verify one in-app reminder, one email with a working inbox link, an accepted outbox item and a delivered event in Workspace setup → Email delivery. Verify a second worker cycle does not send the same reminder again. Turn the pilot account preference off and verify a fresh in-app reminder produces no email. Repeat with synthetic appointment and case records before enabling those producers more broadly.
5. If acceptance fails, stop `proconsulting-email` first, remove the email flags from the saved worker configuration and restart the reminder producer with email disabled. Leave the outbox and event ledger available for reconciliation. Check accepted or review items against Resend before restarting, especially if a send timed out. Keep the webhook active while reconciling in-flight events, or disable it when abandoning the pilot.

### Office expense register

Owner access only. Apply and verify the private collection before deploying the server.

```sh
node scripts/setup-appwrite.mjs --only=expenses
node scripts/setup-appwrite.mjs --only=expenses --apply
node scripts/verify-appwrite.mjs --only=expenses
```

Runtime access must allow expense document read/write. Test an owner recording a synthetic GBP expense, retry the same submission, verify monthly totals and deny an ordinary admin/counselor. Verify both website and mobile access after the server rollout. The native owner must sign in again for the updated role claim used to display Finance. Server authorization always reads current staff access. Finance data is online-only on mobile. To correct an entry, void it with a reason and record a replacement. Provision optional voidedAt, voidedBy and voidReason fields using scoped expenses setup first. Voided entries stay visible and are excluded from totals. If the void outcome is uncertain, reconcile the expense fields before releasing the retained expense/staff-access locks. Preserve the same form after an uncertain save to avoid duplicate entry.

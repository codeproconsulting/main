# First-day CRM deployment: crm.proconsulting.uk

This runbook adds the CRM subdomain to the existing VPS. Start with a controlled staff trial: this development branch contains modules still awaiting acceptance. Read `context-vault/Session Wall.md` and `Feature Ledger.md` for current gates. No VPS deployment has been performed by these instructions.

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

This command creates/updates that user's role; use it only for the intended owner. CRM roles live in the private staff collection, not browser-supplied claims. Counselor assignment requires a separate active counselor profile linked to an Auth identity.

Replace the setup key in `.env` with a runtime key: private document read/write, file read/write, and `sessions.write` for SSR email/password login. Check exact scope names in your installed Appwrite Console. Revoke the temporary key after setup checks. No database/bucket schema or user administration scopes are needed by normal page requests. Appwrite server keys bypass record permissions, so application role enforcement remains essential. Keep collection/bucket and uploaded file permissions private; public article images are streamed by an application route only after publisher approval.

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

Expected: 200 login page, private/no-store headers. Do not log in over loopback HTTP from a remote browser. Keep `ENABLE_BACKGROUND_WORKER` and `ENABLE_SCHEDULED_PUBLISHING` unset. Worker opt-ins are environment variables on the **PM2 invocation**, not automatically taken from `.env` when the ecosystem file is evaluated. Scheduling a post stores it but will not publish automatically until the dedicated publisher is deliberately enabled after rollout gates.

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

Record the exact commit, checks and remaining gaps in the context vault. Current development code includes authoring/revisions, staged cases/calendar/documents/team/reporting and opt-in reminders; inspect the feature ledger for acceptance, not just build success. Managers currently have organization-wide CRM scope. Email/WhatsApp/SMS providers and Ghost cutover remain separate work. Keep `BLOG_PROVIDER=ghost` and real imported drafts private.

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

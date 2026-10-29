# Deploy the CRM on crm.proconsulting.uk

## Architecture

One repository/build, two Node processes bound to loopback: public website on 3000, staff workspace on 3001. Nginx routes hostnames, without rewriting React Router URLs. The workspace lives at `https://crm.proconsulting.uk/admin`; the subdomain root redirects there. Appwrite remains at `https://appwrite.proconsulting.uk/v1` with its existing proxy configuration.

Staff cookies are host-only, HttpOnly, Secure in production, SameSite=Strict, and signed. Do not set a parent-domain cookie. Dashboard mutations reject cross-origin requests. The application checks the configured DASHBOARD_URL independently of Nginx; public-host admin visits redirect without fetching records. Server API keys never enter the browser, so the dashboard currently requires no direct browser-to-Appwrite CORS connection.

Nginx preserves the Host and forwarded protocol; The custom Express runtime trusts only loopback proxies, and React Router's adapter uses their forwarded headers to construct the external request URL. Only the trusted loopback proxy may reach Node. Keep ports 3000/3001 closed externally. Existing Appwrite deployments using Traefik may already own ports 80/443: in that case route the CRM through that existing edge, or explicitly integrate Nginx behind it. Do not start a second listener on occupied ports.

## Before deployment

1. Create the `crm` DNS A record pointing to the VPS. Add AAAA only if IPv6 routing actually works. If using a DNS/CDN proxy, configure TLS through to the origin.
2. Use Node 22+ and configure the ignored root `.env` from `deploy/env.example`. Preserve existing Ghost variables during migration. Set the exact HTTPS DASHBOARD_URL.
3. Create the Appwrite schema with a temporary setup key, then replace it with a runtime key. Setup needs the database/collection/attribute/index/document read/write scopes applicable to the installed Appwrite API. Runtime needs document read/write and sessions.write; staff provisioning also needs users.read and is an operator-only command. Never run destructive schema replacement on existing projects.
4. `node scripts/setup-appwrite.mjs` previews additive changes. `node scripts/setup-appwrite.mjs --apply` creates them. Run it again to verify readiness.
5. Create the first staff identity through Appwrite Auth with a password chosen securely by its owner; verify its email. Link it with `node scripts/provision-staff.mjs AUTH_USER_ID "Staff name" owner`. Do not pass a password on the command line. Profiles have no public permissions and cannot be self-promoted.
6. Run `npm ci`, `npm run typecheck`, `npm run build`, and the test command in package.json.

## Nginx and HTTPS

Inspect the existing proxy configuration and back it up first. The provided CRM vhost is an additive example, not a replacement for the Appwrite or public website vhosts.

```bash
sudo install -m 644 deploy/nginx/snippets/proconsulting-crm-proxy.conf /etc/nginx/snippets/proconsulting-crm-proxy.conf
sudo install -m 644 deploy/nginx/crm.proconsulting.uk.conf /etc/nginx/sites-available/crm.proconsulting.uk.conf
sudo ln -s /etc/nginx/sites-available/crm.proconsulting.uk.conf /etc/nginx/sites-enabled/crm.proconsulting.uk.conf
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d crm.proconsulting.uk
```

Enable TLS and confirm the HTTP-to-HTTPS redirect before testing login. Do not reuse these commands if another reverse proxy owns the public listeners; translate the host routing into that proxy instead.

Start both processes from the checkout root:

```bash
pm2 startOrReload deploy/ecosystem.config.cjs --update-env
pm2 save
```

Check `pm2 status`, TLS, `/admin/login`, anonymous redirects, cross-origin rejection, an authorized lead workflow, and public form persistence. `npm run start` also loads `.env` through the runtime launcher. Rebuild for code changes; restart both processes when runtime settings change. Never print `.env` or API keys in diagnostic logs.

## Verification recorded for this increment

Local typechecking, 14 focused tests, and the production build passed after compatible dependency patches. npm reported zero known vulnerabilities. A disposable live Appwrite exercise passed session creation, private document operations, indexed queries, and denied direct client access; all synthetic records were removed. Local production-mode tests with exact Nginx forwarding headers confirmed HTTPS origin handling, anonymous redirects, cross-origin rejection, private cache headers, and absence of public tracking in staff HTML. These are not a substitute for smoke checks on the actual VPS.

The first owner identity/profile for admin@proconsulting.uk is provisioned. Its generated initial password was not printed or sent. Its owner must choose a password through the Appwrite Console before first sign-in.

## Current release boundaries

This is the foundation implementation. It includes login/role checks, lead intake/list/detail, assignment, notes, task creation/completion, and sanitized HTML blog editing. It does not yet include email/WhatsApp reminder delivery, visual rich-text authoring, application/documents modules, team-restricted managers, or an automated public Ghost cutover. Managers currently see all CRM leads in this single organization. Follow-up lists display up to 100 open tasks; lead tables paginate 25 rows. Blog/staff views cap at 100. Expand these before larger deployments.

Run exactly one CRM process instance. Its keyed mutation queue plus version check protects interactive edits within that process; distributed atomic writes and task-transfer reconciliation still require the installed Appwrite transaction API. Audit intent records can remain pending after a failed write and need review. Do not claim fully transactional CRM changes in this release.

Existing Ghost publishing and the main website's blog readers remain unchanged. Newly authored dashboard posts are stored in Appwrite but will not appear on public blog routes until the content adapter and migration cutover are enabled in a subsequent increment. Intake code in this checkout now expects the Appwrite schema; do not deploy form changes before the schema and runtime credentials are working.

## Recovery

Back up the website, Appwrite database, storage, and existing leads before deploying. Revert UI code independently of saved Appwrite leads; never restore an old database over new submissions. Keep the Ghost service and assets until the URL/media migration report is accepted. Replace setup credentials with narrowly scoped runtime credentials and rotate keys shared during setup.

## Session 2026-10-29-02 staging note

Do not treat the newly staged CMS, worker, cases, calendar, document, media, team, and reporting routes as an accepted production release. Read `context-vault/Session Wall.md` and `Feature Ledger.md` for their outstanding checks. The private Ghost import contains 30 drafts and one preserved legacy page; the website still defaults to Ghost. Never set `BLOG_PROVIDER=appwrite` until route, asset, publication and rendering gates pass.

The worker is opt-in: the PM2 configuration includes it only when `ENABLE_BACKGROUND_WORKER=true` is present in the environment running PM2. Leave it disabled until reminder/retry/crash tests pass. Two private antivirus-enabled buckets exist; actual file operations remain to be verified. Media metadata was added to the local schema after the last remote setup and must be provisioned before using that page. `PUBLIC_CONTENT_ORIGIN` optionally sets the SSR loopback content origin; its default uses the current Node PORT.

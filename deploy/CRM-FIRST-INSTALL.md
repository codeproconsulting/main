# First install on the existing ProConsulting VPS

Install the CRM beside the live public website and Appwrite. The first install uses a separate checkout, a separate PM2 process, and a new HTTPS hostname. Keep the existing website and Ghost services running during the trial.

## How the two hostnames share one application

The public website, CRM pages under `/admin`, and CRM mobile API are in one React Router project. The repository's PM2 configuration can start both web surfaces from the same checkout and the same `npm run build` output. Each process gets its own `APP_SURFACE` and port.

| Hostname | Proxy upstream | PM2 process | Runtime mode |
| --- | --- | --- | --- |
| `proconsulting.uk` | Existing upstream, normally `127.0.0.1:3000` | `proconsulting-main` when managed by this ecosystem | `website` |
| `crm.proconsulting.uk` | `127.0.0.1:3001` for host Nginx | `proconsulting-crm` | `dashboard` |

The CRM proxy sends the original path to Node. It sends `/admin/login` and `/admin/mobile/v1/workspace` to port 3001, and the CRM's root redirects to `/admin`. The Android app uses the HTTPS CRM API and has no separate VPS process.

The dedicated checkout below isolates the first CRM trial from the current public release. After public acceptance, you can run both processes from one deployed checkout. First inspect `pm2 ls` and `pm2 describe <existing-website-process>` to confirm the website's directory, start command and port. Keep its existing listener during the trial. When promoting the shared build, update the existing website process or replace it during a planned cutover, with only one listener on its port. Pulling code alone does not update a running PM2 process or add DNS, HTTPS routing, or the CRM listener.

## 1. Identify the existing proxy and set DNS

On the VPS, run:

```sh
sudo ss -ltnp '( sport = :80 or sport = :443 or sport = :3001 )'
sudo systemctl status nginx --no-pager
```

If Docker is installed, also run `docker ps --format 'table {{.Names}}\t{{.Ports}}'`. The commands in step 5 apply when host Nginx owns ports 80 and 443. If a container or another proxy owns them, create the CRM hostname and certificate at that proxy. The CRM upstream must be reachable from the proxy. A container's `127.0.0.1` points inside that container. Keep the Node upstream private and verify the Host and HTTPS scheme forwarded to it. Preserve the current public and Appwrite virtual hosts.

In the DNS zone for `proconsulting.uk`, add an **A** record named `crm` pointing to the VPS public IPv4 address. Remove an outdated `crm` AAAA record if the new host will serve IPv4 only. Verify from a machine outside the VPS:

```sh
dig +short A crm.proconsulting.uk
dig +short AAAA crm.proconsulting.uk
```

## 2. Pull the tested release in a dedicated checkout

Use an SSH-enabled GitHub deploy key or the deployment user's existing GitHub access. Use Node 24 LTS (or the documented supported Node version), npm, and PM2 as the non-root deployment user. Back up the active edge configuration and Appwrite before the trial.

```sh
sudo install -d -o "$USER" -g "$(id -gn)" /srv/proconsulting-crm
git clone --branch codex/crm-workspace git@github.com:codeproconsulting/main.git /srv/proconsulting-crm
cd /srv/proconsulting-crm
git checkout --detach b63d0c9
npm ci
cp -n deploy/env.example .env
chmod 600 .env
${EDITOR:-nano} .env
```

In `.env`, set `DASHBOARD_URL=https://crm.proconsulting.uk`, `VITE_APP_URL=https://proconsulting.uk`, `APPWRITE_ENDPOINT=https://appwrite.proconsulting.uk/v1`, and `APPWRITE_DATABASE_ID=proconsulting`. Use the existing Appwrite project ID and a temporary setup key from that project. Generate a new `SESSION_SECRET` using `openssl rand -hex 32` and enter it privately. Keep `BLOG_PROVIDER=ghost` and preserve the current public Ghost settings if supplying them to this checkout. See the [full environment table](CRM-DEPLOYMENT.md#3-checkout-and-environment).

## 3. Prepare Appwrite and the first login

From the CRM checkout, preview the full schema and storage requirements:

```sh
node scripts/setup-appwrite.mjs
node scripts/setup-storage.mjs
```

Review the preview and, once satisfied, run the setup commands with `--apply`. Then run `node scripts/verify-appwrite.mjs`. The additive lead contact fields and indexes have already passed verification on the configured Appwrite project. Other CRM modules should still pass their own setup checks before use.

The administrator email is **admin@proconsulting.uk**. Its Appwrite identity and active owner profile were verified. Use your existing password if you have one. For first use, open the Appwrite Console for the ProConsulting project, select **Auth → Users**, locate this account, and set a strong password privately using the account controls available in your installed version. If the Console lacks that control, use the [Appwrite Users password API](https://appwrite.io/docs/references/cloud/server-rest/users) with a temporary `users.write` key, or create a separate test Auth user with a password you choose. To link a separate test Auth user to the CRM, copy its user ID and run:

```sh
node scripts/provision-staff.mjs AUTH_USER_ID "CRM test counselor" counselor
```

A counselor sees assigned leads. Use the owner for the initial dashboard and assignment checks. Enter the Appwrite password for the corresponding user on both web and mobile. Replace the setup key in `.env` with the [runtime-scoped key](CRM-DEPLOYMENT.md#4-appwrite-readiness-and-first-owner) before startup.

## 4. Build and start the CRM process

```sh
cd /srv/proconsulting-crm
npm run typecheck
npm test
npm run build
pm2 startOrReload deploy/ecosystem.config.cjs --only proconsulting-crm --update-env
pm2 status
curl -I http://127.0.0.1:3001/admin/login \
  -H 'Host: crm.proconsulting.uk' \
  -H 'X-Forwarded-Host: crm.proconsulting.uk' \
  -H 'X-Forwarded-Proto: https'
```

Expect HTTP 200 from the local login page. Keep background workers off for the first trial. The `--only proconsulting-crm` option keeps the existing public website process separate.

## 5. Enable the hostname and issue its certificate

For a Debian/Ubuntu host with Nginx owning 80/443, run the exact [bootstrap and Certbot commands](CRM-DEPLOYMENT.md#6-tls-bootstrap-http-serves-only-certificate-challenges) from the checkout. They install the CRM-only HTTP challenge host and request a certificate for `crm.proconsulting.uk`. After certificate issuance, run the [final HTTPS commands](CRM-DEPLOYMENT.md#7-enable-final-https-routing-and-renewals). Run `sudo nginx -t` before each reload.

For any other edge, create an HTTPS host for `crm.proconsulting.uk` with its own valid certificate, route it to the CRM upstream, and apply the route, body size, and login rate-limit rules described in the [Nginx template](nginx/crm.proconsulting.uk.conf). At first install, the existing TLS certificate served at the CRM address may cover another hostname.

## 6. Verify from outside the VPS

```sh
curl -I http://crm.proconsulting.uk/admin/login
curl -I https://crm.proconsulting.uk/admin/login
curl -i https://crm.proconsulting.uk/admin/mobile/v1/workspace
```

Expect HTTP 308 to HTTPS, HTTPS 200 for login, and JSON HTTP 401 with `Cache-Control: private, no-store` for the unauthenticated mobile API. Open [CRM login](https://crm.proconsulting.uk/admin/login), sign in, and try a synthetic lead and follow-up before real staff use. Then sign in with the same account on the Android app. Check the public website and Appwrite from outside the VPS as well.

After acceptance, follow the [full runbook](CRM-DEPLOYMENT.md) for certificate renewal, PM2 persistence, recovery and rollback. Public website promotion and historical lead backfill are separate release steps.

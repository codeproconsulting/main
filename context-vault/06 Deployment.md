---
tags: [deployment, vps, nginx]
updated: 2026-10-29
---
# Deployment

Full runbook: `deploy/CRM-DEPLOYMENT.md`.

| Surface | Host | Upstream |
| --- | --- | --- |
| Website | proconsulting.uk and existing www alias | 127.0.0.1:3000 |
| CRM | crm.proconsulting.uk | 127.0.0.1:3001 |
| Appwrite | appwrite.proconsulting.uk | Existing Appwrite installation/proxy |

The CRM root redirects to `/admin`. Staff login is `/admin/login`. Static build assets use `/assets/`. The CRM Nginx vhost rejects unrelated public routes and blocks indexing. Preserve the existing Appwrite edge configuration, especially if Traefik already owns ports 80/443.

## Server-only configuration names

`APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_DATABASE_ID`, `APPWRITE_API_KEY`, `SESSION_SECRET`, `DASHBOARD_URL`, `APP_SURFACE`, `HOST`, and `PORT`. Existing public Ghost configuration stays in place until cutover. Do not prefix server secrets with `VITE_`.

## Production gates

DNS → existing edge inspection → TLS → schema readiness → runtime key → owner account/password setup → typecheck/tests/build → PM2 deployment → anonymous/authenticated checks → form persistence → monitoring/backup verification.

No production deployment is currently evidenced. See [[03 Implementation Status]].

## First-day runbook revision

Install the `crm.proconsulting.uk.bootstrap.conf` vhost first (ACME challenges only, other paths 503); obtain the named certificate using Certbot webroot; replace that single active vhost with `crm.proconsulting.uk.conf`; run target-server `nginx -t` and reload. Final HTTPS includes `/admin.data` and `/__manifest` as well as staff paths, logo and assets.

The complete guide now covers port ownership/Traefik, DNS A/AAAA/CDN, protected environment, Appwrite setup/runtime scopes, owner password, build, `--only proconsulting-crm` PM2 startup, renewal hook, boot persistence, smoke checks, updates and rollback. Command-block shell syntax was checked locally; actual Nginx/VPS validation is pending. No service was deployed.

Media metadata/default and a private synthetic storage round trip are verified, but public-host media URLs require the accepted website build. Keep Ghost delivery until CMS-04.

## Reminder runner readiness

REMIND-01 is verified locally and its private source/health schema is provisioned. `scripts/worker.mjs` now handles due tasks only; the separate publishing worker remains independent, and appointment/case reminders are deliberately gated. `docs/IN-APP-REMINDERS.md` covers opt-in PM2 activation using `--only proconsulting-worker`, health, graceful stop, abandoned locks and rollback. PM2 grants six minutes before forcing this worker to exit. No process on the VPS was started.

A disposable private notification and health record passed actual Appwrite CRUD, unread default, recipient/order/due-task queries and direct anonymous denial, then were removed. The production `worker_health/reminders` row was not written. Production health and staff workflow still require the controlled VPS rollout.

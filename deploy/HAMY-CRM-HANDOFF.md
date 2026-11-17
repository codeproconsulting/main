# ProConsulting CRM handoff for Hermes

The VPS operator reports that the ProConsulting repository is already pulled into a folder named `main` and that the application is working through Nginx. Start with the existing checkout and active service. The absolute path, deployed commit, PM2 process layout and hostnames currently served still need to be confirmed on the VPS. The folder name `main` does not identify its Git branch.

The tested CRM application baseline for this handoff is commit `8af70cb65657eb125cf96800787540c5229eaaaf` on [codex/crm-workspace](https://github.com/codeproconsulting/main/tree/codex/crm-workspace). Typecheck, tests and the production build passed for that commit. The deployed revision may differ. A previous external probe reported a CRM certificate mismatch. Check the current public edge before treating that result as a current failure.

## What has been built

| Area | Available workflow | Release status |
| --- | --- | --- |
| Leads and enquiries | Website intake adapter, manual entry, normalized search, filters, saved views, notes, stages, priorities, ownership, bulk editing and assignment, counselor routing | Implemented and tested locally. Public intake, optional routing worker and historical backfill require separate acceptance |
| Contacts and duplicates | Confirm matching enquiries belong to one contact, open a linked contact profile, and archive or restore eligible duplicates | Implemented locally. Full record merge, dependency reconciliation and editable master contacts remain open |
| Staff and teams | Owner/admin access management, counselor assignment, team-scoped manager queues, offboarding and session revocation workflow | Tested locally. Check the exact runtime key, team classification and real Appwrite session revocation before staff rollout |
| Counselor work | Follow-up tasks, appointment booking and outcomes, application/case stages and deadlines, consultation records by counselor and destination | Tested locally. Accept with synthetic records on the VPS before staff use |
| Documents | Private uploads, scanner gate, review, expiry, download and team access rules | Storage and synthetic scanner tested. A real ClamAV daemon and target workflow verification are still required |
| Reporting | Operational counts, scoped reports, audited CSV export, and consultation filters by counselor and destination | Tested locally. Check role boundaries on the deployed instance |
| Reminders | In-app task, appointment and case reminders. Optional staff email consent, Resend outbox, signed callbacks, bounce suppression and admin delivery status | Local email pilot passed with simulated delivery. Appwrite preflight passed on the development target. Live sender, callback and workers remain pending |
| Blog CMS | Draft authoring, visual editor, revisions, scheduled publishing, private editorial media and Ghost draft import | Implemented and tested locally. Keep public blogs on Ghost until the migration acceptance and rollback checks pass |
| Mobile | Native Android staff client and iOS simulator preview, workspace API, scoped lead search and selected edits | Requires valid CRM HTTPS and physical-device acceptance. Feature parity and durable offline support remain open |

See the [feature ledger](../context-vault/Feature%20Ledger.md) for detailed acceptance evidence and the [implementation plan](../docs/CRM-CMS-APPWRITE-IMPLEMENTATION-PLAN.md) for original scope.

## Instructions to give Hermes

> Start in the existing ProConsulting checkout named `main`. Confirm its absolute path, Git revision, the PM2 working directories and the active Nginx upstreams. Check the public site and the CRM hostname separately. Reuse the working configuration. If the correct CRM release is already running, verify it in place. If the checkout serves the live public website and the CRM still needs a different revision, leave that checkout in place and stage a separate CRM release. Report what is live, what passed and any remaining blocker. Keep credentials and applicant data out of the report.

## Existing VPS discovery and verification

Run the Git and PM2 commands as the deployment user. Replace the placeholder with the actual path found on the VPS.

```sh
cd /actual/path/to/main
pwd -P
git status --short --branch
git rev-parse --show-toplevel
git rev-parse HEAD
git fetch origin
git log -1 --oneline origin/codex/crm-workspace
pm2 ls
sudo ss -ltnp '( sport = :80 or sport = :443 or sport = :3000 or sport = :3001 )'
sudo nginx -t
```

- Use `pm2 describe <process-name>` locally to match the running process to its working directory and entry point. Inspect the active Nginx host and upstream for each hostname. Report only routing facts and status rather than full config or process dumps.
- Verify the public website, its Ghost blog and Appwrite independently. From a checkout containing the CRM smoke script, run `node scripts/check-crm-edge.mjs` externally for the redirect, TLS login and anonymous mobile endpoint. A healthy website alone does not establish that the CRM hostname is serving the expected release.
- If the CRM is already running, compare its release and run the signed-in checks in step 6 below. Reissue a certificate or change a vhost only if the current checks show that layer needs repair.
- If an update is needed, record the current working release and the affected vhost first. Use the [update and rollback runbook](CRM-DEPLOYMENT.md#9-updates-rollback-and-troubleshooting). Avoid switching branches or rebuilding the active `main` directory while it serves the public site unless that website update is part of the release.

## First install or repair when required

Use the steps below only for missing pieces of the CRM deployment. The separate checkout is an option when a different CRM revision needs to run beside the existing public release.

1. **Inventory and backup.** Identify what owns ports 80 and 443, confirm loopback port 3001 is free, and identify the existing PM2 user and website process. Check DNS A and AAAA, any CDN or container proxy, and existing CRM vhosts. Save the active CRM edge config if present and confirm a recoverable Appwrite backup. Use the [first-install discovery commands](CRM-FIRST-INSTALL.md#1-identify-the-existing-proxy-and-set-dns).
2. **Prepare the release.** Clone the feature branch into `/srv/proconsulting-crm` under the deployment user, detach at the pinned commit, run `npm ci`, and populate the ignored `.env` from [env.example](env.example). Use existing project and database settings and a fresh stable session secret. The [environment table](CRM-DEPLOYMENT.md#3-checkout-and-environment) explains build-time versus runtime values.
3. **Verify Appwrite.** Preview the target schema and bucket setup. Apply only missing, reviewed changes. Verify the private owner profile and have the owner set the Auth password privately. Run `node scripts/verify-appwrite.mjs` with the proper setup access, then replace that key with the runtime key before starting PM2. Reserve elevated metadata access for setup and preflight. [Schema, owner and runtime scopes](CRM-DEPLOYMENT.md#4-appwrite-readiness-and-first-owner).
4. **Build and start.** Run `npm run typecheck`, `npm test` and `npm run build`. Start `pm2 startOrReload deploy/ecosystem.config.cjs --only proconsulting-crm --update-env` from the dedicated checkout. Confirm a login response on loopback with the forwarded CRM host and HTTPS scheme. [Exact process and curl commands](CRM-DEPLOYMENT.md#5-build-and-start-only-the-crm).
5. **Configure the edge.** Point `crm.proconsulting.uk` at the chosen edge. For host Nginx, install the proxy snippet and certificate-only bootstrap vhost, verify the public ACME challenge and issue the certificate. Install the final HTTPS vhost only once the certificate exists. Run `nginx -t` before each reload. For a container or managed edge, configure the equivalent at the actual TLS terminator and use an upstream reachable from that proxy. Preserve `/admin`, the original host and HTTPS scheme. [Bootstrap commands](CRM-DEPLOYMENT.md#6-tls-bootstrap-http-serves-only-certificate-challenges) and [HTTPS and renewal commands](CRM-DEPLOYMENT.md#7-enable-final-https-routing-and-renewals).
6. **Accept the release.** Run `node scripts/check-crm-edge.mjs` externally. Then check owner sign-in/out, counselor isolation, a synthetic enquiry assignment and follow-up, and the CRM API on Android. Check that the public site, Ghost blog routes and Appwrite still work. Record the release commit, proxy ownership, hostname validation, PM2 status and checks without including credentials or applicant data. Verify certificate renewal and PM2 startup persistence after the first checks pass. [First-day acceptance and persistence](CRM-DEPLOYMENT.md#8-reboot-persistence-and-first-day-acceptance).

## Enable additional services in stages

- **Private documents:** configure the trusted ClamAV socket, verify quarantine and permissions with synthetic files, then enable the intended workflow. [Document setup](../docs/PRIVATE-DOCUMENTS.md).
- **Background reminders:** accept the in-app worker first. Enable appointment and case reminders separately. [In-app worker runbook](../docs/IN-APP-REMINDERS.md).
- **Email:** run `node scripts/check-email-pilot.mjs` with setup metadata access. Confirm the verified Resend sender, the private pilot mailbox and the public website runtime for `/api/webhooks/resend`. The CRM-only vhost does not serve that route. Check one accepted and delivered synthetic message and opt-out before expanding the allowlist. [Email pilot and rollback](CRM-DEPLOYMENT.md#staff-email-pilot-acceptance).
- **Website and Ghost:** public intake, public editorial media, the Resend callback and eventual Ghost cutover each have public-host checks. Promote the public application separately. [Release and rollback](../docs/RELEASE-AND-ROLLBACK.md).

## Rollback

If first install fails, stop `proconsulting-crm` and restore the CRM-specific edge config or leave the certificate bootstrap serving only ACME challenges. Verify the public website and Appwrite immediately. For later CRM updates record the previous working CRM SHA before building. To roll back, rebuild that release and restart only the CRM process. Preserve incoming Appwrite records and files. A failed app deploy does not justify restoring an older database. [Rollback commands and troubleshooting](CRM-DEPLOYMENT.md#9-updates-rollback-and-troubleshooting).

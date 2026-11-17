# ProConsulting CRM handoff for Hamy

Use this file to install the CRM beside the existing ProConsulting site. The tested application baseline is commit `8af70cb65657eb125cf96800787540c5229eaaaf` on [codex/crm-workspace](https://github.com/codeproconsulting/main/tree/codex/crm-workspace). Typecheck, the full test suite and the production build passed for that application commit. GitHub `main` is a separate release line. The last public probe found a certificate hostname mismatch on `crm.proconsulting.uk`. Recheck the target before making changes.

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

## Instructions to give Hamy

> Install only the ProConsulting CRM from the pinned application commit in this handoff. Start with discovery of the current edge, listeners, PM2 user, DNS and rollback files. Follow the first-install guide and the linked commands for the actual proxy topology. Preserve the existing website, Appwrite and Ghost services. Record the commit and test outcomes. If any check fails, stop promotion, preserve existing data and report the exact failing layer and rollback status. Keep credentials in the protected runtime configuration.

## Install and verify

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

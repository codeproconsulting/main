# ProConsulting repository guidance

Maintain the Obsidian-compatible `context-vault/` alongside substantial application changes. Start with `context-vault/00 Home.md` and `context-vault/05 Maintenance.md`. Update affected architecture, file map, decisions, deployment, and implementation-status notes before finishing; append concrete changes and verification evidence to the dated journal. Run `npm run context:sync` after source edits to refresh the allowlisted file inventory. Preserve human-written notes.

Distinguish planned, implemented, tested, provisioned, and production-deployed behavior. Never put `.env` values, credentials, sessions, raw Ghost export settings, or applicant information in documentation, tests, fixtures, or command output. Existing Ghost blog delivery stays active until the explicit migration acceptance checks pass. The CRM is configured for `crm.proconsulting.uk`; consult `deploy/CRM-DEPLOYMENT.md` for topology and current release limits.

## Project isolation and branding

This repository is an independent ProConsulting project. Use only its own source, assets, requirements, and context-vault for project decisions. Do not import another Codex project's branding, assumptions, or architecture. Preserve the public website's brand: use `public/Logo_main.png`, the pink/blue variables in `app/app.css`, and navy from `app/lib/constants.ts`. New dashboard screens must follow these existing assets and tokens; do not invent a separate palette or substitute a recreated wordmark.

## Session focus and continuation (required)

At the start of work, read `context-vault/Session Wall.md`, `context-vault/session-state.json`, and `context-vault/Feature Ledger.md`. A request to "continue" resumes the active feature's next unfinished action. Keep one named feature in focus per session. Do not broaden into unrelated modules; record discovered work in the ledger. Existing staged code is not proof of completion.

Before handoff, update the structured session state with acceptance evidence, failed checks, exact next actions/files, dependencies, and verified external state. Run `npm run session:verify` when code changed, assess feature-specific tests separately, then regenerate with `npm run session:status`. Mark a feature complete only after all its acceptance criteria pass; keep deployment separate. Preserve unfinished changes. Never store credentials or client data in checkpoints.

## Git checkpoints and upstream integration

The user authorizes periodic commits and pushes for this project. At verified feature/session checkpoints, commit source plus the session wall on a `codex/` branch and push it to GitHub. Label staged/incomplete work honestly. Fetch upstream before substantial feature work, inspect changes, and integrate new public pages without discarding either side. Never force push, commit secrets or applicant records, merge unfinished work into main, or treat a push as a production deployment. Rerun appropriate checks after integration; keep checkpoint evidence current.

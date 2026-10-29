---
tags: [maintenance, documentation]
updated: 2026-10-29
---
# Maintenance

## During implementation

Before completing substantial work, inspect the actual diff and update [[01 Architecture]], [[02 File Map]], [[03 Implementation Status]], [[04 Decisions]], [[06 Deployment]], [[07 Data and Permissions]], and [[08 Roadmap]] where affected. Append concrete changes and check evidence to the dated note in `Changes/`. Avoid rewriting historical statements as though later work had already happened.

Run `npm run context:sync` after edits. It inventories allowlisted source/config/documentation paths and updates [[Source Inventory]] and [[File Updates]] only when their hashes change. It does not infer architecture, prove deployment, or replace human review of these notes. Generated notes are clearly marked; preserve human-authored notes and additions.

## Recurring review

A Codex thread heartbeat named **Keep ProConsulting context vault current** was created on 29 October 2026, daily at 09:00 Asia/Karachi. Automation ID: `keep-proconsulting-context-vault-current`.

It reviews repository drift and maintains documentation only. It must not deploy, provision infrastructure, change application code, commit, push, or send messages. Stay quiet for unchanged/non-actionable state. Surface meaningful architectural changes, failures, or decisions requiring input. Local-file review requires this machine and the app to be available.

## Truth and safety rules

- Read source and check output; never label planned behavior as implemented or local code as production deployment.
- Never copy `.env`, API keys, passwords, session secrets, raw Ghost settings, private applicant files, or contact data.
- Do not scan arbitrary user directories. Inventory is restricted to project source/config paths.
- Note public endpoint names and environment variable names, never values of secrets.
- Check every wiki link, keep note titles stable, and create links for new architecture areas.
- Preserve user edits; use focused updates and append-only dated history where practical.
- `.obsidian/workspace*.json` and local Obsidian cache/state stay ignored.

## Feature-by-feature sessions

Start with [[Session Wall]], `session-state.json`, and [[Feature Ledger]]. Keep one active feature. `npm run session:status` validates structured state and regenerates the wall. `npm run session:verify` refreshes the source inventory, runs typecheck/tests/build, and records actual outcomes plus local log paths. It refuses a completed session if acceptance or current-source verification is incomplete. General checks never mark feature criteria complete automatically.

On a user request to continue, inspect repository drift and execute the wall's next incomplete action. Record blocked dependencies precisely; do not skip them or substitute unrelated features. The daily documentation heartbeat may report drift and stale checkpoints but must not silently pick another feature or change acceptance results without evidence.

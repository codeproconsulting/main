---
tags: [git, scheduling, operations]
updated: 2026-10-29
---
# Git and background work

## User-authorized workflow

The user requested pulling new GitHub work and periodic commit/push checkpoints. Fetch before substantial implementation, inspect upstream changes, preserve local work in a commit, integrate with focused conflict review, rerun checks, and push the development branch. Keep source and the session wall together.

The branch is `codex/crm-workspace`. The initial implementation checkpoint is `46baa46`. Integration includes the 16 main commits through `407977c`, preserving public destination, service, location, and assessment changes. Main remains the public-site baseline; staged CRM modules should not be merged or deployed just because they compile.

Never commit `.env`, API keys, private original exports/settings, applicant records, or ignored migration reports. Do not force push. Keep the current feature and unfinished acceptance criteria in [[Session Wall]].

## Current scheduled work

The daily 09:00 Asia/Karachi heartbeat is **documentation maintenance only**. It is local and requires this computer and the app to be running with the repository available. It does not build features and cannot work against this folder while the computer is off. The user does not need to be present during an eligible unattended run; limits, missing information, or approvals can still interrupt progress.

## Laptop-off development

A published Codex Cloud environment can provide its own repository workspace; local files, `.env`, browser logins, and VPN access do not transfer automatically. A separately configured always-on VPS runner or GitHub Actions workflow is another possible execution location. No cloud feature-building environment, VPS coding runner, or GitHub Actions coding schedule has been configured here.

Before scheduled implementation, configure its execution location, repository branch, secure access, cadence/timezone, usage budget, and review boundaries. Each run should read the session wall, work on one bounded feature, run acceptance checks, update the handoff, commit and push a development branch, and report blockers. Deployment and public content cutover remain separate actions.

Sources checked 29 October 2026: [Scheduled tasks](https://learn.chatgpt.com/docs/automations), [Codex environments](https://learn.chatgpt.com/docs/environments/modes), [Codex GitHub Action](https://learn.chatgpt.com/docs/github-action).

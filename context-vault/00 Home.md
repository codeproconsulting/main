---
title: ProConsulting Context Vault
tags: [proconsulting, context, index]
updated: 2026-10-29
---
# ProConsulting context vault

Open this **context-vault** folder as a vault in Obsidian. All project notes use Markdown and local wiki links; no community plugin is required.

This is the working memory for the public website, the CRM at **crm.proconsulting.uk**, the blog CMS, and the migration from Ghost to self-hosted Appwrite. Source code and verified infrastructure state take precedence over notes.

## Resume implementation

Open [[Session Wall]] first when continuing work. It tracks one feature, acceptance evidence, failures, and exact next actions. [[Feature Ledger]] tracks the complete scope across sessions.

## Start here

- [[01 Architecture]] — systems, request flow, boundaries, and hostnames.
- [[02 File Map]] — important files and the generated implementation inventory.
- [[03 Implementation Status]] — implemented, verified, planned, and blocked work.
- [[04 Decisions]] — architectural decisions and their consequences.
- [[05 Maintenance]] — how to keep this vault current and safe.
- [[06 Deployment]] — VPS topology, environment variable names, and deployment gates.
- [[07 Data and Permissions]] — collections, roles, and current access rules.
- [[08 Roadmap]] — delivery phases and next work.
- [[Changes/2026-10-29]] — the initial implementation journal.
- [[File Updates]] — generated file changes since the previous inventory.
- [[Source Inventory]] — source-file hashes and paths for documentation drift checks.

## Canonical documents

The detailed approved plan lives at `docs/CRM-CMS-APPWRITE-IMPLEMENTATION-PLAN.md` in the repository root. Operational instructions live at `deploy/CRM-DEPLOYMENT.md`. Paths in notes are relative to the repository root unless specified otherwise. This vault supplements those documents rather than copying the full specification.

## Privacy boundary

No API keys, passwords, session tokens, `.env` contents, applicant information, or raw Ghost export settings belong here. Store names and purposes of configuration variables only. Record public hostnames and infrastructure verification results without secret-bearing output.

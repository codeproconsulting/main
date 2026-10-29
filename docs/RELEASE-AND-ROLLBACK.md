# Tested releases and rollback

The user authorizes merging tested features into `main`. A development branch preserves history and supports review; rollback requires a known previous commit/tag and a repeatable deployment procedure.

## Feature acceptance before merge

1. Fetch `origin/main`, inspect incoming changes, and integrate them without discarding either side.
2. Read the Session Wall and complete every acceptance check for the intended feature. General typecheck/tests/build success alone does not accept a whole staged CRM module.
3. If the working branch also contains unfinished modules, assemble a release branch from current main containing only the accepted feature and required dependencies, or finish those modules' acceptance checks first. Do not merge the whole staged branch as a shortcut.
4. Verify the exact release candidate: feature tests, access/error paths, typecheck, production build, source/credential scan, and relevant manual checks. Update the vault with the tested revision.
5. Preserve the current main SHA in a named `rollback/...` tag or branch before merging. Push that reference so recovery is available from another machine.
6. Merge using a non-fast-forward merge commit with a clear feature description, push main, and retain the development branch. No force pushes or history rewrites.

## Test locally before deployment

The development branch can be tested locally with the ignored `.env` configured. To preview the CRM on a local origin, run from the checkout root:

```bash
DASHBOARD_URL=http://127.0.0.1:5173 APP_SURFACE=dashboard PORT=5173 npm run dev -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173/admin/login`. The administrator must have an active staff profile and choose their password in Appwrite. This preview uses the configured Appwrite project; edits to records persist there. Public blog switching and destructive testing should use isolated test data/project instead. Do not publish imported drafts merely to test rendering.

For public pages, use `APP_SURFACE=website` on another local port with `PORT` set to that port. Ghost remains the default blog provider. Appwrite content mode requires `BLOG_PROVIDER=appwrite`, schema/key configuration, and published test records in an isolated project.

## Rollback after merge or deployment

- If the accepted merge causes a regression, prefer `git revert -m 1 MERGE_COMMIT` on main, test, and push the revert; it preserves subsequent history.
- A VPS code rollback can deploy the previous verified tag/build, then restart the relevant process and run smoke checks. A Git revert alone does not roll back a running deployment.
- Preserve all newly received leads, uploads, tasks, and staff changes. Never restore an old Appwrite database over new submissions as a code rollback.
- Database/schema changes should be additive and backward compatible. Revert destructive data migrations only through a separately verified recovery procedure.
- Reverting a public content provider is independent of CRM data. Keep Ghost/assets available through the migration rollback window.

No production deployment or new main merge is implied by saving a feature checkpoint. Record the actual remote refs, deployment version, and verification results after each action.

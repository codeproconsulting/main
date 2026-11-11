# Staff access and offboarding

Open **Team & access** as an owner or admin. Create the Auth identity through Appwrite first, then link its user ID to a CRM profile. The CRM stores the display name, role, optional team reference and access status. Team references are descriptive until branch permissions are implemented. A saved edit takes effect on the next authorized request. A request already in progress may finish under its original authorization.

An owner can manage other owners. An admin can manage non-owner profiles and cannot grant the owner role. Staff cannot edit their own access here. At least one active owner profile must remain. Coordinate Appwrite Console changes with CRM operators so the remaining owner also retains a usable Auth identity.

## Hand off work and deactivate

1. In **Leads & enquiries**, find leads assigned to the departing staff member. Reassign each through the lead form with a reason and an eligible recipient. Resolve appointment conflicts before the handoff. Linked open follow-ups, cases and appointments move with the lead.
2. Open **Team & access**, choose **Edit access**, select **Deactivated** and save. A profile that still owns leads cannot lose CRM access, including through a change to a content-only role.
3. The CRM deactivates the profile before deleting all of the user's Appwrite sessions in this project. If session deletion cannot be confirmed, the profile stays inactive and shows **Revocation pending**. After restoring the Appwrite connection or scopes, reopen the profile and use **Retry session revocation**. Reactivation requires successful revocation and a fresh login.
4. The Auth account remains in Appwrite. If an operator must block authentication to the Appwrite project itself, apply that separately through the Console under the organization’s offboarding procedure.

## Release checks and recovery

- Preview `node scripts/setup-appwrite.mjs --only=staff`. With the setup key, run the same command with `--apply` and confirm `revocationPending` and the `role_active` index are available before rollout. The marker is blank on existing profiles.
- For Team & access, grant the CRM server key `users.read` to verify existing identities and `sessions.write` for session deletion. The public website key does not need staff administration capabilities. Confirm the installed version and key scopes in Appwrite Console.
- In an isolated Appwrite project or approved synthetic trial, test an owner, an admin, and a counselor with two signed-in sessions. Verify the role boundaries, handoff prerequisite, denied CRM access after deactivation, invalidated sessions after provider confirmation, and a fresh login after reactivation.
- If a profile or final lead handoff write has an uncertain outcome, its persistent lock stays in place. Stop the dashboard process and confirm any in-flight Appwrite request has finished. Compare the intended transition in private activity records with current staff or lead records and the linked task, case and appointment records. Resolve the state first, then remove only the abandoned locks for that operation. A handoff may have retained the lead, staff access and calendar locks. Verify which records the operation owns before clearing them.
- Keep `scripts/provision-staff.mjs` for initial linking. It checks for an enabled Auth user and refuses to alter an existing profile. Perform normal edits and reactivation through the dashboard.

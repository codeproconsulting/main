# TEAM-01 browser acceptance

The built CRM ran on loopback with an in-memory Appwrite fixture and synthetic accounts.

- The owner could link an existing synthetic Auth identity and edit a counselor. The owner's own row had no edit action.
- Deactivating the counselor while the fixture returned a revocation error showed **Revocation pending** and a retry button. The retry changed the status to **Deactivated**. Reactivation then restored the **Active** state.
- Assigning a synthetic enquiry to that counselor blocked deactivation and showed a handoff instruction. Moving the enquiry to the newly linked counselor allowed deactivation.
- Service tests separately exercised admin boundaries, stale versions, concurrent owner changes, assignment races, existing session access, ambiguous writes and retained locks.

The browser and service checks use synthetic Appwrite responses. A read-only check against the existing Appwrite project confirmed the pending schema changes and reached the expected 404 on a nonexistent Auth user. Live session revocation remains a release check.

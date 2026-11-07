# Applications and immigration cases — CASE-01

Each lead can have multiple independent applications. Each record has a fixed Education or Immigration service, its own stage, deadline, notes and version. Service cannot be converted after creation; create another record for a different service. These are manually maintained operational records; the application does not decide visa or education eligibility.

Education requires institution, course and destination. Immigration requires visa category and destination; description is optional. Both require a lead assigned to an active staff member with CRM capability. Intake, notes and deadline are optional. Deadlines supplied must include a timezone and are normalized to UTC; lists display Asia/Karachi time. Existing incomplete records need their required fields filled before the next save.

Education stages cover shortlisting, documents, submission, offers, deposit, visa preparation/submission, approval/refusal, enrolment and withdrawal. Immigration excludes education offer/deposit/enrolment stages. Shortlisted is retained for legacy immigration intake compatibility. This catalog validates allowed values; it does not enforce a mandatory linear progression. Staff can correct a stage without fabricating intermediate events. Detailed service checklists and custom stage configuration remain later enhancements.

Owners/admins/managers have organization-wide CRM scope. Counselors access only their current assigned leads and linked applications. Editors/publishers do not have application access. Detail loaders and saves recheck lead scope; saves do so inside the shared lead lock. Lists filter stored owner and recheck current lead ownership. Lists currently show up to 100 records. Applications never grant direct public Appwrite access.

## Changes, handoffs and recovery

Saves require the current record version and immutable lead link. A stale edit receives 409. The form refreshes from the saved version and keeps service fixed. Missing records return 404. Every save writes a pending audit with the chosen case ID and versions before mutating, then records completion. If the audit store is unavailable, the application is not changed.

Lead reassignment transfers all linked applications, including terminal records, in pages of 100 under the lead lock. Each application version increments so open forms from before handoff are rejected. The lead owner changes after linked records have transferred. This is not a database transaction: failure midway can leave application owner metadata ahead of the lead owner. Current-lead authorization prevents new staff seeing those records prematurely; some old-owner list entries can temporarily disappear until reconciliation.

For an interrupted handoff, stop competing writers and inspect the lead update's pending audit, current lead owner/version and linked application owners/versions. If the lead still has the expected original version, an intentional retry of the same handoff reconciles all applications; some versions may increment again. If lead mutation committed but acknowledgment was lost, refresh and reconcile the audit instead of blindly resubmitting the old form. Keep audit history. Do not guess lock expiry or bulk-delete locks; prove the owner process stopped before targeted removal.

A lost application-save acknowledgment can leave a committed record and pending audit. Inspect the audit's case ID/current version before retry. For a new application, inspect that chosen ID before creating another record to avoid duplicate applications. Creation is not fully idempotent across user resubmissions. A dedicated reconciliation UI remains planned; operators currently use Appwrite Console with approved access.

## Verification and rollout

Focused service tests cover current assignment under lock, multiple applications, versions, invalid service/stage/date, foreign binding and role denial, unavailable audit store, lost acknowledgments, counselor handoff/listing access, stale forms, 102-record transfer and interrupted-handoff retry. Completeness checks cover both services, unassigned leads and inactive assignees.

The actual built-app browser workflow is recorded in `tests/manual/CASE-01-browser.md`: education and immigration creation, service-specific fields/stages, fixed service after save, deadline normalization, list/record navigation and stale second-tab rejection. Role and handoff failure cases are verified by focused service tests; they are not claimed as production browser acceptance.

No production application records were changed. Production login/proxy, real staff workflow, Appwrite backup/recovery and rollout remain OPS-01 gates. Case-deadline reminders remain disabled pending a separately verified adapter; the existing reminder worker handles due tasks only. Documents, appointment scheduling, reports and team administration retain separate feature acceptance. Resend is the chosen future email provider and is not activated by CASE-01.

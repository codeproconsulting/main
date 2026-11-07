# Appointment scheduling

Create an appointment from a lead or from Appointments using its lead reference. The lead needs an active CRM assignee. Enter a title and start/end with a timezone, such as `2030-02-01T10:00:00+05:00`. The server rejects invalid calendar dates and stores UTC. The list shows start and end in Asia/Karachi and displays up to 100 records. Location and notes are optional.

A new appointment starts Booked. Adjacent slots can share a boundary. Any overlap with another Booked appointment for that counselor is rejected, including across leads. The conflict check reads all pages of the counselor’s appointments. Rescheduling requires a reason and is saved separately from recording an outcome. Completed and No show are available after the start time. Cancellation and no-show require a reason. Closed appointments release the slot and retain their time and status. Create a new appointment to book another session. Authorized staff can update descriptive fields on closed records while the lead remains assigned.

Counselors see only appointments linked to leads currently assigned to them. Managers, admins and owners have organization-wide access. Edits require the current record version and the original lead link. Booking and reassignment take the lead lock first, then the shared appointment calendar lock. A single calendar lock serializes scheduling across counselors to keep conflict checks and transfers consistent on the current Appwrite deployment. This can reduce scheduling throughput under contention. Retry a transient lock conflict after the other edit finishes.

## Handoff and recovery

Before moving a lead, check the receiving counselor’s calendar for each Booked appointment. Conflicts stop the transfer before any records change. Resolve them by rescheduling or cancelling the relevant booking, then retry. Finish or cancel booked appointments before unassigning a lead. Handoffs update linked appointment owners and versions, including closed records, before changing the lead owner. Prior ownership remains recorded in the lead’s audit.

An appointment save records intent before writing. Its audit includes appointment ID, previous and proposed version, times, status and reason. If a write may have committed without an acknowledgment, refresh and compare the appointment ID and version in the pending audit before retrying. For an uncertain creation, check the recorded appointment ID before booking again.

A handoff writes multiple records. An interruption can leave some appointments assigned to the intended counselor while the lead still belongs to its previous counselor. Current-lead checks prevent early access. Slots already moved remain reserved on the target calendar. Edits to a record with mismatched ownership return a reconciliation error. Stop competing writers and inspect the pending lead audit, lead version and linked owners. If the lead still has its original version, retry the same handoff after clearing any conflicts. The retry skips already moved appointment versions. If the lead change committed, reconcile the audit against the stored state. Follow the existing operator recovery procedure for abandoned locks and preserve audit history.

## Acceptance and rollout

Local service tests cover conflicts, adjacent slots, pagination, timezones, reasons, terminal outcomes, stale edits, scope, audit failures, lost acknowledgments and interrupted handoff retry. Built-app browser acceptance covers creation, conflict feedback, reschedule, cancellation, no-show and local start/end display. The existing private appointments collection accepted the owner and lead query shapes in a read-only check. See `tests/manual/CAL-01-browser.md` for the fixture procedure.

Production smoke checks remain part of OPS-01. Appointment reminders, staff availability rules, calendar invitations and external calendar sync remain future work. Resend is the selected provider for future email delivery.

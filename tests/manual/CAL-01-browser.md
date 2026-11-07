# CAL-01 browser acceptance

Build the app and run `node tests/helpers/cms-preview.mjs --calendar`. This fixture uses an in-memory API on port 4175 and a built app on port 4173. Sign in using the synthetic manager fixture. Stop the preview after testing.

Observed on 7 November 2026:

1. Opened the empty Appointments list and booked a synthetic lead at 10:00–11:00 with a +05:00 offset. Saved detail displayed 05:00–06:00 UTC.
2. Attempted a second booking at 05:30–06:30 UTC. The form showed the counselor conflict and retained the entered values.
3. Rescheduling without a reason displayed validation. With a reason, the booking saved at 07:00–08:00 UTC and the form showed the new values.
4. Cancelled the rescheduled booking with a reason and verified the saved status.
5. Booked a past synthetic appointment and recorded No show with a reason.
6. The list displayed both outcomes and correct Asia/Karachi start/end times. The rejected overlap had no row.

Service tests separately verify counselor permissions, stale writes, handoff and failure recovery. Browser data was synthetic and discarded when the preview stopped.

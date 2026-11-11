# Manual lead entry and contact search

Open **Leads & enquiries**, then select **Add enquiry**. Enter the contact name, email, phone and service. Destination and enquiry notes are optional. A counselor's new lead is assigned to that counselor. An owner, admin or manager creates an unassigned lead and can assign it from the lead page. The CRM creates one lead and one audit intent per form submission, including when the request is retried.

Search by name, full email, or phone number. Email matching ignores case. Phone matching ignores spaces, parentheses, periods, dashes and the international dialing prefix. Search using the stored country code or the stored local format. The CRM does not infer a country code. Stage filtering and access scope still apply. New searches submit terms in the request body.

## Release order

1. Run `node scripts/setup-appwrite.mjs --only=leads` to preview the additive schema. Use `--apply` with the setup key and confirm `emailKey`, `phoneKey`, `email_key` and `phone_key` are available before starting the new website or dashboard processes. Both public and manual intake write the fields.
2. Preview the legacy migration with `node scripts/backfill-lead-contact.mjs`. Run it with `--apply` to populate the new fields. It patches only the two search keys. It reports totals and counts of unsearchable phone values without displaying contact data. After both new processes are running, repeat the preview and backfill to catch any leads created by the old processes during rollout.
3. Verify public intake, manual entry, counselor scope, stage filters and legacy contact lookup with synthetic leads. Original phone and email values remain available on the lead record.

If an Appwrite timeout leaves manual creation uncertain, inspect the pending activity and its referenced lead. Use the abandoned lock recovery procedure before removing the staff access lock. A subsequent retry from the same form uses the same record ID.

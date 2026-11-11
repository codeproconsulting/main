# Operational reports and CSV export

Active owners, admins and managers can open **Reports**. Managers currently have organization-wide CRM scope. The report counts current lead records by stage, source and destination. Converted counts reflect the current stage. The breakdowns show up to 20 groups and combine the remainder. Missing labels appear as Unknown.

Reports scan up to 10,000 records in record ID order. At exactly 10,000 leads the CSV is available. A further record marks the report as partial and blocks export. Counts reflect records observed during the scan and can change when the workspace receives or updates leads.

The CSV contains the lead register fields shown in the source allowlist. It includes contact details and excludes notes and intake payloads. The server rechecks the current staff session and role and writes an audit record containing the requester and row count before returning the attachment. Audit failures stop the download. Spreadsheet formula-like values are escaped, quotes are doubled, and the file uses UTF-8. Import contact columns as text when exact phone formatting matters.

The feature uses the existing private leads and activities collections. Before releasing it on the VPS, check report counts and download with synthetic leads. Verify that a counselor cannot open either route directly and that an unavailable audit store prevents CSV delivery.

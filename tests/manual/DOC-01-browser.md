# DOC-01 browser acceptance

On 9 November 2026, the built dashboard ran on loopback with the in-memory Appwrite fixture and a synthetic Unix socket scanner. No applicant data was used.

- Signed in as a synthetic manager and opened Documents from a lead.
- Uploaded a synthetic PDF. The document appeared with a download link and the Passport checklist showed **Awaiting review**.
- Accepted the document and added a review note. The checklist showed **Ready** and retained the note.
- Submitted a synthetic fixture that the socket mock flagged. The UI reported rejection and the existing accepted record stayed intact.
- Set a past expiry date on the accepted document. The row showed **Expired**, the Pakistan date remained correct, and the checklist showed **Needs attention**.
- Downloaded the expired file as an attachment through the authorized route. The service tests separately compare bytes, enforce audit and verify counselor handoff and content-role denial.

The socket mock verifies app behavior for scanner responses. It does not verify the VPS daemon or its signature database. A separate disposable 20,000,000 byte Appwrite storage probe passed chunked upload, byte comparison and anonymous denial. The file was removed. No client document metadata was written to Appwrite.

import { documentCategories, documentLimit, documentStatuses, type ClientDocument } from "./document-domain";
import { randomUUID } from "node:crypto";
import { AppwriteError, createDocument, getDocument, listDocuments, query, updateDocument } from "~/lib/appwrite.server";
import { allow, audit, leadFor, serialized } from "./crm.server";
import { canUseCRM, type Staff } from "./domain";
import { scanDocument } from "./document-scan.server";
import { downloadFile, fileSignature, privateBucket, removeFile, uploadFile } from "./storage.server";

const extensions: Record<string, readonly string[]> = {
  "application/pdf": ["pdf"], "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"],
};

export function documentExpiry(value: string) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const day = new Date(value);
    if (Number.isFinite(+day) && day.toISOString().slice(0, 10) === value) {
      return new Date(value + "T23:59:59.999+05:00").toISOString();
    }
  }
  throw new Response("Enter a valid expiry date.", { status: 400 });
}

export async function documentsFor(staff: Staff, leadId: string) {
  const lead = await leadFor(staff, leadId);
  const documents: ClientDocument[] = [];
  let cursor: string | undefined;
  while (true) {
    const filters = [query("equal", "leadId", [lead.$id]), query("orderDesc", "$createdAt"), query("limit", undefined, [100])];
    if (cursor) filters.push(query("cursorAfter", undefined, [cursor]));
    const page = (await listDocuments<ClientDocument>("documents", filters)).documents;
    documents.push(...page);
    if (page.length < 100) return { lead, documents };
    cursor = page.at(-1)!.$id;
  }
}

async function documentFor(id: string) {
  if (!/^[\w][\w.-]{0,35}$/.test(id)) throw new Response("Document not found", { status: 404 });
  try {
    return await getDocument<ClientDocument>("documents", id);
  } catch (error) {
    if (error instanceof AppwriteError && error.status === 404) throw new Response("Document not found", { status: 404 });
    throw error;
  }
}

async function recordOutcome(eventId: string, event: string, details: object) {
  try {
    await updateDocument("activities", eventId, { event, details: JSON.stringify(details) });
  } catch {
    // The durable intent remains available for reconciliation. Never report a committed mutation as failed.
  }
}

export async function uploadClientDocument(staff: Staff, leadId: string, file: File, category: string, expiry: string) {
  await leadFor(staff, leadId);
  if (!documentCategories.some(item => item === category)) {
    throw new Response("Select a document category.", { status: 400 });
  }
  const expiresAt = documentExpiry(expiry);
  if (!file.size || file.size > documentLimit) {
    throw new Response("Choose a non-empty file up to 20 MB.", { status: 400 });
  }
  const suffix = file.name.split(".").at(-1)?.toLowerCase();
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!file.name.includes(".") || !suffix || !extensions[file.type]?.includes(suffix) || !fileSignature(bytes, file.type)) {
    throw new Response("The extension and file contents must match PDF, JPEG, PNG, or WebP.", { status: 400 });
  }
  await scanDocument(bytes);
  const scannedAt = new Date().toISOString();
  return serialized(`lead:${leadId}`, async () => {
    await leadFor(staff, leadId);
    const id = randomUUID();
    const bucket = privateBucket();
    const event = await audit(staff, leadId, "lead", "Document upload requested", { state: "pending", documentId: id, fileId: id });
    let stored;
    try {
      stored = await uploadFile(bucket, new File([bytes], `${id}.${suffix}`, { type: file.type }), documentLimit, id);
    } catch {
      throw new Response("Storage could not confirm the upload. Ask an administrator to check the pending upload before retrying.", { status: 503 });
    }
    const record = {
      leadId, fileId: id, name: file.name.replace(/[\u0000-\u001f\u007f]/g, "_").slice(-200),
      mime: file.type, category, status: "Pending review", expiresAt, checksum: stored.checksum,
      uploadedBy: staff.$id, scannedAt, reviewVersion: 0, reviewNotes: "",
    };
    try {
      await createDocument("documents", record, id);
    } catch (writeError) {
      let existing;
      try {
        existing = await documentFor(id);
      } catch (error) {
        if (!(error instanceof Response && error.status === 404)) {
          throw new Response("Upload outcome is uncertain. Ask an administrator to reconcile the pending upload.", { status: 503 });
        }
      }
      if (existing && (existing.fileId !== id || existing.leadId !== leadId || existing.checksum !== stored.checksum)) {
        throw new Response("Upload metadata needs administrator reconciliation.", { status: 503 });
      }
      if (!existing) {
        // A failed response alone does not prove a timed-out or interrupted write stopped.
        if (!(writeError instanceof AppwriteError && [400, 401, 403, 404, 422].includes(writeError.status))) {
          throw new Response("Upload outcome is uncertain. Ask an administrator to reconcile the pending upload.", { status: 503 });
        }
        try {
          await removeFile(bucket, id);
        } catch (error) {
          if (!(error instanceof AppwriteError && error.status === 404)) {
            throw new Response("File cleanup needs an administrator. The pending upload identifies the file.", { status: 503 });
          }
        }
        await recordOutcome(event.$id, "Document upload rolled back", { state: "rolledBack", documentId: id, fileId: id });
        throw new Response("Metadata could not be saved. The file was removed. You can retry.", { status: 503 });
      }
    }
    await recordOutcome(event.$id, "Document uploaded", { state: "completed", documentId: id, fileId: id });
  });
}

export async function reviewClientDocument(
  staff: Staff, leadId: string, id: string, status: string, expiry: string, notes: string, expected: string,
) {
  if (!documentStatuses.some(item => item === status)) throw new Response("Invalid review status.", { status: 400 });
  const expiresAt = documentExpiry(expiry);
  return serialized(`lead:${leadId}`, async () => {
    await leadFor(staff, leadId);
    const doc = await documentFor(id);
    allow(doc.leadId === leadId);
    if (!doc.scannedAt) throw new Response("Re-upload this document to scan it before review.", { status: 409 });
    const version = doc.reviewVersion ?? 0;
    if (String(version) !== expected) throw new Response("This review changed. Refresh before saving.", { status: 409 });
    if (status === doc.status && expiresAt === doc.expiresAt && notes === (doc.reviewNotes ?? "")) return;
    const changes = { status, expiresAt, reviewNotes: notes, reviewVersion: version + 1 };
    const details = { documentId: id, reviewVersion: changes.reviewVersion, status };
    const event = await audit(staff, leadId, "lead", "Document review requested", { ...details, state: "pending" });
    try {
      await updateDocument("documents", id, changes);
    } catch {
      const current = await documentFor(id).catch(() => null);
      if (!current || current.reviewVersion !== changes.reviewVersion || current.status !== status ||
          current.expiresAt !== expiresAt || current.reviewNotes !== notes) {
        throw new Response("Could not confirm the review. Refresh and check the saved record before retrying.", { status: 503 });
      }
    }
    await recordOutcome(event.$id, "Document reviewed", { ...details, state: "completed" });
  });
}

export async function downloadClientDocument(staff: Staff, id: string) {
  allow(canUseCRM(staff));
  const doc = await documentFor(id);
  await leadFor(staff, doc.leadId);
  if (!doc.scannedAt) throw new Response("This document must be re-uploaded and scanned before download.", { status: 409 });
  await audit(staff, doc.leadId, "lead", "Document download requested", { documentId: doc.$id });
  // Re-check scope after recording the audit, immediately before opening the storage stream.
  await leadFor(staff, doc.leadId);
  return downloadFile(privateBucket(), doc.fileId, doc.name);
}

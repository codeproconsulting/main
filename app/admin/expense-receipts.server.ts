import { randomUUID } from "node:crypto";
import { getDocument, updateDocument } from "~/lib/appwrite.server";
import { allow, audit, serialized, staffAccessLock, UnconfirmedMutation } from "./crm.server";
import { canUseFinance } from "./finance.server";
import type { Staff } from "./domain";
import { scanDocument } from "./document-scan.server";
import { downloadFile, fileSignature, privateBucket, uploadFile } from "./storage.server";

export const receiptLimit = 5 * 1024 * 1024;
type ReceiptExpense = {
  $id: string; description: string; receiptFileId?: string; receiptName?: string;
  receiptMime?: string; receiptChecksum?: string; receiptScannedAt?: string;
};
const formats: Record<string, string[]> = { "application/pdf":["pdf"], "image/png":["png"], "image/jpeg":["jpg","jpeg"] };
function expenseId(id: string) {
  if (!/^[a-f0-9]{32}$/.test(id)) throw new Response("Expense not found.", { status:404 });
}
async function currentOwner(staff: Staff) {
  allow(canUseFinance(staff));
  allow(canUseFinance(await getDocument<Staff>("staff", staff.$id)));
}
export async function expenseReceipt(staff: Staff, id: string) {
  expenseId(id);
  await currentOwner(staff);
  const row = await getDocument<ReceiptExpense>("expenses", id);
  return { id: row.$id, description: row.description, receiptName: row.receiptFileId && row.receiptScannedAt ? row.receiptName : "" };
}
export async function attachExpenseReceipt(staff: Staff, id: string, file: File) {
  expenseId(id);
  await currentOwner(staff);
  if (!file.size || file.size > receiptLimit) throw new Response("Choose a receipt up to 5 MB.", { status:400 });
  const extension = file.name.split(".").at(-1)?.toLowerCase() ?? "";
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!formats[file.type]?.includes(extension) || !fileSignature(bytes, file.type)) {
    throw new Response("Choose a PDF, PNG or JPEG whose contents match its extension.", { status:400 });
  }
  await scanDocument(bytes);
  return serialized(`expense:${id}`, () => serialized(staffAccessLock, async () => {
    await currentOwner(staff);
    const expense = await getDocument<ReceiptExpense>("expenses", id);
    if (expense.receiptFileId) throw new Response("This expense already has a receipt.", { status:409 });
    const fileId = randomUUID();
    const event = await audit(staff, id, "expense", "Receipt attachment requested", { state:"pending", fileId });
    try {
      const stored = await uploadFile(privateBucket(), new File([bytes], fileId + "." + extension, { type:file.type }), receiptLimit, fileId);
      await updateDocument("expenses", id, {
        receiptFileId:fileId, receiptName:file.name.replace(/[\u0000-\u001f\u007f]/g,"_").slice(-200),
        receiptMime:file.type, receiptChecksum:stored.checksum, receiptScannedAt:new Date().toISOString(),
      });
      await updateDocument("activities", event.$id, { event:"Receipt attached", details:JSON.stringify({state:"completed",fileId}) });
    } catch {
      throw new UnconfirmedMutation("Receipt storage or attachment could not be confirmed. Ask an administrator to reconcile the pending receipt and its locks before retrying.");
    }
  }));
}
export async function downloadExpenseReceipt(staff: Staff, id: string) {
  expenseId(id);
  await currentOwner(staff);
  return serialized(`expense:${id}`, () => serialized(staffAccessLock, async () => {
    await currentOwner(staff);
    const row = await getDocument<ReceiptExpense>("expenses", id);
    if (!row.receiptFileId || !row.receiptName || !row.receiptScannedAt ||
        !Number.isFinite(Date.parse(row.receiptScannedAt)) || !formats[row.receiptMime ?? ""] ||
        !/^[a-f0-9]{64}$/.test(row.receiptChecksum ?? "")) {
      throw new Response("No verified receipt is attached.", {status:404});
    }
    await audit(staff,id,"expense","Receipt download requested",{fileId:row.receiptFileId});
    return downloadFile(privateBucket(),row.receiptFileId,row.receiptName);
  }));
}

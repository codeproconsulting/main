import { createHash } from "node:crypto";
import { AppwriteError, createDocument, getDocument, listDocuments, query, updateDocument } from "~/lib/appwrite.server";
import { csvCell } from "./reports.server";
import { audit, allow, definitiveWriteRejection, field, serialized, staffAccessLock, UnconfirmedMutation } from "./crm.server";
import type { Staff } from "./domain";

export const expenseCategories = ["Rent", "Utilities", "Salaries", "Travel", "Supplies", "Marketing", "Other"];
export type Expense = { $id: string; description: string; category: string; spentOn: string; amountMinor: string; currency: string; recordedBy: string; voidedAt?: string; voidedBy?: string; voidReason?: string };
export const canUseFinance = (staff: Staff) => staff.active && staff.role === "owner" && !staff.revocationPending;

export async function recordExpense(staff: Staff, form: FormData) {
  allow(canUseFinance(staff));
  const submissionId = field(form, "submissionId", 36);
  const description = field(form, "description", 500);
  const category = field(form, "category", 40);
  const spentOn = field(form, "spentOn", 10);
  const amount = field(form, "amount", 20);
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(submissionId) || !description || !expenseCategories.includes(category) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(spentOn) || (!Number.isFinite(Date.parse(spentOn)) || new Date(spentOn).toISOString().slice(0, 10) !== spentOn) ||
      !/^(?:0|[1-9]\d{0,6})(?:\.\d{1,2})?$/.test(amount)) {
    throw new Response("Enter a description, category, valid date and amount with up to two decimal places.", { status: 400 });
  }
  const [whole, fraction = ""] = amount.split(".");
  const amountMinor = String(Number(whole) * 100 + Number(fraction.padEnd(2, "0")));
  if (Number(amountMinor) <= 0) throw new Response("The amount must be greater than zero.", { status: 400 });
  const id = createHash("sha256").update(staff.$id + ":" + submissionId).digest("hex").slice(0, 32);
  const values = { description, category, spentOn, amountMinor, currency: "GBP", recordedBy: staff.$id };
  return serialized(staffAccessLock, async () => {
    allow(canUseFinance(await getDocument<Staff>("staff", staff.$id)));
    try { await createDocument("expenses", values, id); }
    catch (error) {
      if (!(error instanceof AppwriteError && error.status === 409)) throw error;
      const saved = await getDocument<Expense>("expenses", id);
      if (Object.entries(values).some(([key, value]) => saved[key as keyof Expense] !== value)) {
        throw new Response("This submission was already saved with different values. Refresh before entering another expense.", { status: 409 });
      }
    }
    return id;
  });
}

export async function voidExpense(staff: Staff, id: string, reason: string) {
  allow(canUseFinance(staff));
  if (!/^[a-f0-9]{32}$/.test(id) || !reason.trim() || reason.length > 500) {
    throw new Response("Select an expense and enter a reason of up to 500 characters.", { status: 400 });
  }
  return serialized(`expense:${id}`, () => serialized(staffAccessLock, async () => {
    allow(canUseFinance(await getDocument<Staff>("staff", staff.$id)));
    const expense = await getDocument<Expense>("expenses", id);
    if (expense.voidedAt) {
      if (expense.voidedBy === staff.$id && expense.voidReason === reason.trim()) return;
      throw new Response("This expense has already been voided. Refresh to review it.", { status: 409 });
    }
    try {
      await updateDocument("expenses", id, { voidedAt: new Date().toISOString(), voidedBy: staff.$id, voidReason: reason.trim() });
    } catch (error) {
      if (definitiveWriteRejection(error)) throw error;
      throw new UnconfirmedMutation("The void outcome is uncertain. Ask an administrator to verify the expense before releasing its locks.");
    }
  }));
}

export async function expenseMonth(staff: Staff, month: string) {
  allow(canUseFinance(staff));
  allow(canUseFinance(await getDocument<Staff>("staff", staff.$id)));
  if (!/^\d{4}-(?:0[1-9]|1[0-2])$/.test(month)) throw new Response("Choose a valid month.", { status: 400 });
  const start = month + "-01";
  const next = month.slice(5) === "12" ? String(Number(month.slice(0, 4)) + 1) + "-01-01"
    : month.slice(0, 5) + String(Number(month.slice(5)) + 1).padStart(2, "0") + "-01";
  const { documents } = await listDocuments<Expense>("expenses", [
    query("greaterThanEqual", "spentOn", [start]), query("lessThan", "spentOn", [next]),
    query("orderDesc", "spentOn"), query("orderDesc", "$id"), query("limit", undefined, [1001]),
    query("select", undefined, ["$id", "description", "category", "spentOn", "amountMinor", "currency", "voidedAt", "voidReason"]),
  ]);
  if (documents.length > 1000) throw new Response("This month exceeds the 1,000 expense view limit.", { status: 400 });
  if (documents.some(row => row.currency !== "GBP" || !/^[1-9]\d{0,8}$/.test(row.amountMinor) || !expenseCategories.includes(row.category))) {
    throw new Response("An expense needs administrator review before totals can be shown.", { status: 409 });
  }
  const totals = expenseCategories.map(category => ({ category, amountMinor: documents
    .filter(row => !row.voidedAt && row.category === category).reduce((sum, row) => sum + Number(row.amountMinor), 0) }));
  return { month, currency: "GBP", expenses: documents.map(({ $id, description, category, spentOn, amountMinor, currency, voidedAt, voidReason }) =>
    ({ id: $id, description, category, spentOn, amountMinor, currency, voidedAt, voidReason })), totals,
    totalMinor: totals.reduce((sum, row) => sum + row.amountMinor, 0) };
}


export async function exportExpenses(staff: Staff, month: string, refreshStaff: () => Promise<Staff>) {
  const report = await expenseMonth(staff, month);
  const columns = ["Date", "Description", "Category", "Currency", "Amount", "Status", "Voided at", "Void reason"];
  const rows = [columns.map(csvCell).join(","), ...report.expenses.map(expense => [
    expense.spentOn, expense.description, expense.category, expense.currency,
    (Number(expense.amountMinor) / 100).toFixed(2),
    expense.voidedAt ? "Voided" : "Active", expense.voidedAt || "", expense.voidReason || "",
  ].map(csvCell).join(","))];
  const current = await refreshStaff();
  allow(canUseFinance(current) && current.$id === staff.$id);
  allow(canUseFinance(await getDocument<Staff>("staff", current.$id)));
  await audit(current, current.$id, "export", "Expense export requested", {
    month, count: report.expenses.length,
  });
  return new Response("\uFEFF" + rows.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="proconsulting-expenses-${month}.csv"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

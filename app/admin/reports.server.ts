import { listDocuments, query } from "~/lib/appwrite.server";
import { allow, audit } from "./crm.server";
import { canManage, type Lead, type Staff } from "./domain";

export const reportLimit = 10_000;
const pageSize = 100;
const displayGroups = 20;
const reportFields = ["stage", "source", "country", "owner"] as const;
const exportFields = ["$id", "$createdAt", "name", "email", "phone", "service", "source", "country", "stage", "owner", "priority", "nextFollowUp"] as const;

export function requireReportAccess(staff: Staff) {
  allow(staff.active === true && canManage(staff));
}

async function scanLeads<K extends keyof Lead>(
  fields: readonly K[],
  visit: (lead: Pick<Lead, K>) => void,
) {
  let cursor: string | undefined;
  let count = 0;
  const seen = new Set<string>();

  while (true) {
    // Read one extra record to distinguish exactly 10,000 from an incomplete report.
    const limit = Math.min(pageSize, reportLimit + 1 - count);
    const { documents } = await listDocuments<Pick<Lead, K>>("leads", [
      query("select", undefined, [...fields]),
      query("orderAsc", "$id"),
      query("limit", undefined, [limit]),
      ...(cursor ? [query("cursorAfter", undefined, [cursor])] : []),
    ]);
    if (documents.length > limit) throw new Response("Reporting data could not be paged safely.", { status: 503 });
    for (const lead of documents) {
      if (!lead.$id || seen.has(lead.$id)) throw new Response("Reporting data could not be paged safely.", { status: 503 });
      if (count === reportLimit) return { count, truncated: true };
      seen.add(lead.$id);
      visit(lead);
      count++;
    }
    if (documents.length < limit) return { count, truncated: false };
    cursor = documents.at(-1)!.$id;
  }
}

function groups(counts: Map<string, number>) {
  const sorted = [...counts].sort(([a, left], [b, right]) => right - left || a.localeCompare(b));
  return {
    rows: sorted.slice(0, displayGroups),
    remainder: sorted.slice(displayGroups).reduce((sum, [, count]) => sum + count, 0),
  };
}

export async function operationalReport(staff: Staff) {
  requireReportAccess(staff);
  const stages = new Map<string, number>();
  const sources = new Map<string, number>();
  const countries = new Map<string, number>();
  let unassigned = 0;
  let converted = 0;

  function add(counts: Map<string, number>, value: string | undefined) {
    const label = value?.trim() || "Unknown";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  const { count, truncated } = await scanLeads(["$id", ...reportFields], lead => {
    add(stages, lead.stage);
    add(sources, lead.source);
    add(countries, lead.country);
    if (!lead.owner?.trim()) unassigned++;
    if (lead.stage === "Converted") converted++;
  });
  return { total: count, truncated, unassigned, converted, stages: groups(stages), sources: groups(sources), countries: groups(countries) };
}

export function csvCell(value: unknown) {
  let text = String(value ?? "").replaceAll("\0", "");
  if (/^[\t\r\n]|^[\s\p{Cf}\p{Cc}]*[=+@\-＝＋＠－]/u.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}

export async function exportLeads(staff: Staff, refreshStaff: () => Promise<Staff>) {
  requireReportAccess(staff);
  const rows = [exportFields.map(csvCell).join(",")];
  const { count, truncated } = await scanLeads(exportFields, lead => {
    rows.push(exportFields.map(field => csvCell(lead[field])).join(","));
  });
  if (truncated) throw new Response("Export exceeds 10,000 leads.", { status: 413 });
  const current = await refreshStaff();
  requireReportAccess(current);
  allow(current.$id === staff.$id);
  await audit(current, current.$id, "export", "Lead export requested", { count });
  return new Response("\uFEFF" + rows.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="proconsulting-leads.csv"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

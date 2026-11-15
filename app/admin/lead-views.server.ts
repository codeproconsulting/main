import { createHash } from "node:crypto";
import { AppwriteError, appwrite, createDocument, listDocuments, query } from "~/lib/appwrite.server";
import { allow } from "./crm.server";
import { canUseCRM, priorities, stages, type Staff } from "./domain";

type LeadView = { $id: string; staffId: string; stage: string; priority: string };

export async function leadViews(staff: Staff) {
  allow(staff.active && canUseCRM(staff));
  try {
    const { documents } = await listDocuments<LeadView>("lead_views", [
      query("equal", "staffId", [staff.$id]),
      query("limit", undefined, [(stages.length + 1) * (priorities.length + 1) - 1]),
    ]);
    return documents;
  } catch (error) {
    if (error instanceof AppwriteError && error.status === 404) return null;
    throw error;
  }
}

export async function changeLeadView(staff: Staff, operation: "save" | "remove", stage: string, priority: string) {
  allow(staff.active && canUseCRM(staff));
  if ((!stage && !priority) || (stage && !stages.some(value => value === stage)) ||
      (priority && !priorities.some(value => value === priority))) {
    throw new Response("Choose a valid stage or priority to save.", { status: 400 });
  }
  const id = createHash("sha256").update(JSON.stringify([staff.$id, stage, priority])).digest("hex").slice(0, 36);
  try {
    if (operation === "save") {
      await createDocument("lead_views", { staffId: staff.$id, stage, priority }, id);
    } else {
      const database = encodeURIComponent(process.env.APPWRITE_DATABASE_ID!);
      await appwrite(`/databases/${database}/collections/lead_views/documents/${id}`, { method: "DELETE" });
    }
  } catch (error) {
    if (error instanceof AppwriteError &&
        ((operation === "save" && error.status === 409) || (operation === "remove" && error.status === 404))) return;
    throw error;
  }
}

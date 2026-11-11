import { createHash } from "node:crypto";
import { AppwriteError, createDocument, getDocument, updateDocument } from "~/lib/appwrite.server";
import { emailKey, leadServices, phoneKey } from "~/lib/lead-contact";
import { allow, definitiveWriteRejection, field, serialized, staffAccessLock, UnconfirmedMutation } from "./crm.server";
import { canAccessLead, canManage, canUseCRM, type Activity, type Lead, type Staff } from "./domain";

async function optionalLead(id: string) {
  try {
    return await getDocument<Lead>("leads", id);
  } catch (error) {
    if (error instanceof AppwriteError && error.status === 404) return null;
    throw error;
  }
}

export async function createManualLead(staff: Staff, form: FormData) {
  allow(staff.active && canUseCRM(staff));
  const token = field(form, "submissionId", 36);
  const name = field(form, "name", 200);
  const email = emailKey(field(form, "email", 254));
  const phone = field(form, "phone", 80);
  const normalizedPhone = phoneKey(phone);
  const service = field(form, "service", 100);
  const country = field(form, "country", 150);
  const notes = field(form, "notes", 4000);
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(token)) {
    throw new Response("Refresh the lead form before submitting.", { status: 400 });
  }
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !normalizedPhone || !leadServices.includes(service)) {
    throw new Response("Enter a name, valid email and phone number, and choose a service.", { status: 400 });
  }
  const id = createHash("sha256").update(`manual-lead:${staff.$id}:${token.toLowerCase()}`).digest("hex").slice(0, 36);
  return serialized(staffAccessLock, async () => {
    const actor = await getDocument<Staff>("staff", staff.$id);
    allow(actor.active && canUseCRM(actor));
    const complete = () => updateDocument("activities", id, {
      event: "Manual lead created", details: JSON.stringify({ state: "completed" }),
    }).catch(() => undefined);
    const existing = await optionalLead(id);
    if (existing) {
      allow(canAccessLead(actor, existing));
      if (existing.name !== name || existing.email !== email || existing.phone !== phone ||
          existing.service !== service || existing.country !== country || existing.details !== JSON.stringify(notes ? { notes } : {})) {
        throw new Response("This form was already used. Open a new form to add another lead.", { status: 409 });
      }
      await complete();
      return existing;
    }

    const owner = canManage(actor) ? "" : actor.$id;
    try {
      await createDocument("activities", {
        actor: actor.$id, entityId: id, entityType: "lead", event: "Manual lead creation requested",
        details: JSON.stringify({ state: "pending" }),
      }, id);
    } catch (error) {
      if (!(error instanceof AppwriteError && error.status === 409)) throw error;
      const pending = await getDocument<Activity>("activities", id);
      allow(pending.actor === actor.$id && pending.entityId === id && pending.entityType === "lead" &&
        pending.event === "Manual lead creation requested");
    }
    const payload = {
      name, email, phone, phoneKey: normalizedPhone, emailKey: email, service, country,
      source: "Manual entry", stage: "New", owner, priority: "Normal", nextFollowUp: "",
      details: JSON.stringify(notes ? { notes } : {}), version: 1,
    };
    let lead;
    try {
      lead = await createDocument("leads", payload, id);
    } catch (error) {
      const current = await optionalLead(id).catch(() => null);
      if (current && Object.entries(payload).every(([key, value]) => current[key as keyof typeof payload] === value)) {
        lead = current;
      } else {
        if (definitiveWriteRejection(error)) throw error;
        throw new UnconfirmedMutation("The lead creation outcome is uncertain. Ask an administrator to reconcile it before retrying.");
      }
    }
    await complete();
    return lead;
  });
}

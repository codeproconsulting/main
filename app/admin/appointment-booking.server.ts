import { createHash } from "node:crypto";
import { AppwriteError, createDocument, getDocument, updateDocument } from "~/lib/appwrite.server";
import { appointmentCalendarLock, appointmentTime, assertCalendarAvailable, type Appointment } from "./calendar.server";
import { allow, definitiveWriteRejection, field, serialized, staffAccessLock, UnconfirmedMutation, writableEnquiry } from "./crm.server";
import { canUseCRM, isRestrictedManager, type Activity, type Staff } from "./domain";

async function readIfPresent<T>(collection:string,id:string) {
  try { return await getDocument<T>(collection,id); }
  catch (error) { if (error instanceof AppwriteError && error.status===404) return null; throw error; }
}

export async function bookAppointment(staff:Staff,leadId:string,form:FormData) {
  const submissionId = field(form,"submissionId",36).toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(submissionId)) {
    throw new Response("Reload the enquiry to start a new booking.",{status:400});
  }
  const title = field(form,"title",300), location = field(form,"location",1000);
  const startsAt = appointmentTime(field(form,"startsAt",40)), endsAt = appointmentTime(field(form,"endsAt",40));
  if (!title || endsAt <= startsAt) throw new Response("Enter a title and an end time after the start.",{status:400});
  const appointmentId = createHash("sha256").update(`booking:${staff.$id}:${leadId}:${submissionId}`).digest("hex").slice(0,36);
  const fingerprint = createHash("sha256").update(JSON.stringify([title,startsAt,endsAt,location])).digest("hex");

  const book = async () => {
    const actor = await getDocument<Staff>("staff",staff.$id);
    allow(actor.active && canUseCRM(actor) && !isRestrictedManager(actor) && !actor.revocationPending);
    const lead = await writableEnquiry(actor,leadId);
    if (!lead.owner) throw new Response("Assign the enquiry before booking an appointment.",{status:400});
    const owner = await getDocument<Staff>("staff",lead.owner);
    allow(owner.active && canUseCRM(owner) && !owner.revocationPending);

    const intent = await readIfPresent<Activity>("activities",appointmentId);
    let record = await readIfPresent<Appointment>("appointments",appointmentId);
    const details = {appointmentId,owner:lead.owner,fingerprint,startsAt,endsAt};
    if (intent) {
      const original = JSON.parse(intent.details);
      if (intent.actor !== actor.$id || intent.entityId !== leadId || original.appointmentId !== appointmentId || original.fingerprint !== fingerprint) {
        throw new Response("This booking form was already used for different details.",{status:409});
      }
      if (record && (record.leadId !== leadId || record.owner !== lead.owner)) throw new Response("Reconcile the appointment assignment first.",{status:409});
      if (original.state === "completed") {
        if (record) return record;
        throw new Response("The original booking is missing. Ask an administrator to check the history.",{status:409});
      }
      if (original.owner !== lead.owner) throw new Response("The enquiry assignment changed during booking.",{status:409});
    } else if (record) {
      throw new Response("The booking history needs reconciliation.",{status:409});
    }
    if (!record) {
      await assertCalendarAvailable(lead.owner,[{startsAt,endsAt}],new Set());
      if (!intent) {
        await createDocument("activities",{actor:actor.$id,entityId:leadId,entityType:"lead",event:"Appointment booking requested",
          details:JSON.stringify({...details,state:"pending"})},appointmentId);
      }
      try {
        record = await createDocument("appointments",{leadId,owner:lead.owner,title,startsAt,endsAt,location,notes:"",status:"Booked",version:1},appointmentId);
      } catch (error) {
        if (definitiveWriteRejection(error)) throw error;
        record = await readIfPresent<Appointment>("appointments",appointmentId).catch(()=>null);
        if (!record || record.leadId !== leadId || record.owner !== lead.owner) {
          throw new UnconfirmedMutation("Booking was not confirmed. Reconcile the appointment before releasing the calendar lock.");
        }
      }
    }
    await updateDocument("activities",appointmentId,{event:"Appointment booked",details:JSON.stringify({...details,state:"completed"})});
    return record;
  };
  return serialized(`lead:${leadId}`,()=>serialized(staffAccessLock,()=>serialized(appointmentCalendarLock,book)));
}

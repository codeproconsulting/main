import {randomUUID} from "node:crypto";
import {AppwriteError,createDocument,getDocument,listDocuments,query,updateDocument} from "~/lib/appwrite.server";
import {caseStagesFor,canManage,canUseCRM,isRestrictedManager,type Staff} from "./domain";
import {allow,audit,dateField,definitiveWriteRejection,field,writableEnquiry,scopedQueue,serialized,UnconfirmedMutation,withCurrentTeamManager} from "./crm.server";
export type CaseRecord={$id:string;leadId:string;owner:string;kind:string;institution:string;course:string;country:string;intake:string;stage:string;deadline:string;notes:string;version:number};
import {appointmentCalendarLock,appointmentTime,assertCalendarAvailable,type Appointment} from "./calendar.server";
export type {Appointment} from "./calendar.server";

export function scopedRecords<T extends {leadId:string}>(staff: Staff, collection: "cases" | "appointments", page = 1) {
  return scopedQueue<T>(staff, collection, [query("orderDesc", "$createdAt")], page);
}
export async function saveCase(staff:Staff,form:FormData){const id=field(form,"id",36),leadId=field(form,"leadId",36);return serialized(`lead:${leadId}`,async()=>{
 const lead=await writableEnquiry(staff,leadId);
 const current=id?await getDocument<CaseRecord>("cases",id):null;if(current){allow(current.leadId===leadId);if(current.version!==Number(field(form,"version")))throw new Response("Application changed. Refresh before saving.",{status:409});}
 const kind=field(form,"kind",30),stage=field(form,"stage",80);if(!["Education","Immigration"].includes(kind)||!caseStagesFor(kind).includes(stage))throw new Response("Invalid application type or stage",{status:400});
 if(current&&current.kind!==kind)throw new Response("Application service cannot be changed. Create a separate application for the other service.",{status:400});
 const payload={leadId,owner:lead.owner,kind,institution:field(form,"institution",300),course:field(form,"course",300),country:field(form,"country",150),intake:field(form,"intake",100),stage,deadline:dateField(field(form,"deadline",40)),notes:field(form,"notes",10000),version:(current?.version??0)+1};
 if(!lead.owner)throw new Response("Assign the lead before creating or updating an application.",{status:400});
 const assignee=await getDocument<Staff>("staff",lead.owner);allow(assignee.active&&canUseCRM(assignee));
 if(!payload.institution||!payload.country||(kind==="Education"&&!payload.course))throw new Response(kind==="Education"?"Enter an institution, course and destination.":"Enter a visa category and destination.",{status:400});
 const caseId=current?.$id||randomUUID();
 const event=await audit(staff,leadId,"lead","Application save requested",{state:"pending",caseId,fromVersion:current?.version??0,toVersion:payload.version,stage});
 const record=current?await updateDocument<CaseRecord>("cases",caseId,payload):await createDocument("cases",payload,caseId);
 await updateDocument("activities",event.$id,{event:current?"Application updated":"Application created",details:JSON.stringify({state:"completed",caseId,stage,version:payload.version})});return record;
 });}
export async function updateTeamCase(staff: Staff, id: string, form: FormData) {
  allow(staff.active && isRestrictedManager(staff) && !!id);
  const readCase = () => getDocument<CaseRecord>("cases", id).catch(error => {
    if (error instanceof AppwriteError && error.status === 404) throw new Response("Application not found", {status:404});
    throw error;
  });
  const readLead = (leadId: string) => writableEnquiry(staff, leadId).catch(error => {
    if (error instanceof Response && error.status === 404) throw new Response("Application not found", {status:404});
    throw error;
  });
  const initial = await readCase();
  await readLead(initial.leadId);
  return serialized(`lead:${initial.leadId}`, () => withCurrentTeamManager(staff, async () => {
    const current = await readCase();
    if (current.leadId !== initial.leadId) throw new Response("Application changed. Refresh before saving.", {status:409});
    const lead = await readLead(current.leadId);
    if (!lead.owner || current.owner !== lead.owner || Number(field(form, "version")) !== current.version) {
      throw new Response("The application changed or its assignment needs reconciliation. Refresh before saving.", {status:409});
    }
    const stage = field(form, "stage", 80);
    if (!caseStagesFor(current.kind).includes(stage)) throw new Response("Choose a valid application stage.", {status:400});
    const deadline = form.has("deadline") ? dateField(field(form, "deadline", 40)) : current.deadline;
    const changes = { stage, deadline, version: current.version + 1 };
    const event = await audit(staff, current.leadId, "lead", "Application save requested", {
      state:"pending", caseId:id, before:{stage:current.stage,deadline:current.deadline,version:current.version}, after:changes,
    });
    try {
      await updateDocument("cases", id, changes);
    } catch (error) {
      if (definitiveWriteRejection(error)) throw error;
      throw new UnconfirmedMutation("The application change may have saved. Ask an administrator to reconcile it before retrying.");
    }
    await updateDocument("activities", event.$id, {event:"Application updated",
      details:JSON.stringify({state:"completed",caseId:id,...changes})}).catch(() => undefined);
    return id;
  }));
}
export async function saveAppointment(staff: Staff, form: FormData, teamRecordId?: string) {
  const teamManager = isRestrictedManager(staff);
  allow(staff.active && canUseCRM(staff) && (!teamManager || Boolean(teamRecordId)));
  const id = teamManager ? teamRecordId! : field(form, "id", 36);
  const readAppointment = () => getDocument<Appointment>("appointments", id).catch(error => {
    if (error instanceof AppwriteError && error.status === 404) throw new Response("Appointment not found", { status: 404 });
    throw error;
  });
  const leadId = teamManager ? (await readAppointment()).leadId : field(form, "leadId", 36);
  const readLead = () => writableEnquiry(staff, leadId).catch(error => {
    if (teamManager && error instanceof Response && error.status === 404) throw new Response("Appointment not found", { status: 404 });
    throw error;
  });
  if (teamManager) await readLead();
  const save = () => serialized(appointmentCalendarLock, async () => {
    const lead = await readLead();
    if (!lead.owner) throw new Response("Assign the lead before booking an appointment.", { status: 400 });
    const assignee = await getDocument<Staff>("staff", lead.owner);
    allow(assignee.active && canUseCRM(assignee));

    let current: Appointment | null = null;
    if (id) {
      current = await readAppointment();
      if (teamManager && current.leadId !== leadId) throw new Response("Appointment changed. Refresh before saving.", { status: 409 });
      allow(current.leadId === leadId);
      if (current.owner !== lead.owner) throw new Response("Reconcile the lead handoff before editing this appointment.", { status: 409 });
      if (current.version !== Number(field(form, "version"))) throw new Response("Appointment changed. Refresh before saving.", { status: 409 });
    }

    const startsAt = appointmentTime(field(form, "startsAt", 40));
    const endsAt = appointmentTime(field(form, "endsAt", 40));
    const status = field(form, "status", 30);
    const title = teamManager ? current!.title : field(form, "title", 300);
    const reason = field(form, "reason", 2000);
    if (!title || endsAt <= startsAt || !["Booked", "Completed", "Cancelled", "No show"].includes(status)) {
      throw new Response("Enter a title, a valid time range and a booking status.", { status: 400 });
    }
    const moved = !!current && (Date.parse(current.startsAt) !== Date.parse(startsAt) || Date.parse(current.endsAt) !== Date.parse(endsAt));
    const changedStatus = current?.status !== status;
    if (!current && status !== "Booked") throw new Response("New appointments must start as Booked.", { status: 400 });
    if (current && current.status !== "Booked" && (teamManager || moved || changedStatus)) {
      throw new Response("This appointment is closed. Create a new booking to schedule another meeting.", { status: 400 });
    }
    if (moved && status !== "Booked") throw new Response("Save a reschedule separately from an outcome.", { status: 400 });
    if (changedStatus && ["Completed", "No show"].includes(status) && Date.parse(startsAt) > Date.now()) {
      throw new Response("Record the outcome after the appointment starts.", { status: 400 });
    }
    if ((moved || (changedStatus && ["Cancelled", "No show"].includes(status))) && !reason) {
      throw new Response("Enter a reason for rescheduling, cancellation or no-show.", { status: 400 });
    }
    if (status === "Booked") await assertCalendarAvailable(lead.owner, [{ startsAt, endsAt }], new Set(id ? [id] : []));

    const payload = { leadId, owner: lead.owner, title, startsAt, endsAt, status, location: teamManager ? "" : field(form, "location", 1000), notes: teamManager ? "" : field(form, "notes", 10000), version: (current?.version ?? 0) + 1 };
    const appointmentId = current?.$id ?? randomUUID();
    const details = { appointmentId, fromVersion: current?.version ?? 0, toVersion: payload.version, status, startsAt, endsAt, reason };
    const event = await audit(staff, leadId, "lead", "Appointment save requested", { ...details, state: "pending" });
    let record;
    try {
      record = current
        ? await updateDocument<Appointment>("appointments", appointmentId, teamManager
          ? { startsAt, endsAt, status, version: payload.version }
          : payload)
        : await createDocument("appointments", payload, appointmentId);
    } catch (error) {
      if (teamManager && !definitiveWriteRejection(error)) {
        throw new UnconfirmedMutation("The appointment change may have saved. Ask an administrator to reconcile it before retrying.");
      }
      throw error;
    }
    const complete = updateDocument("activities", event.$id, { event: "Appointment saved", details: JSON.stringify({ ...details, state: "completed" }) });
    if (teamManager) await complete.catch(() => undefined);
    else await complete;
    return record;
  });
  return serialized(`lead:${leadId}`, () => teamManager ? withCurrentTeamManager(staff, save) : save());
}

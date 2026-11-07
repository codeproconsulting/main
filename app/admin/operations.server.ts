import {randomUUID} from "node:crypto";
import {AppwriteError,createDocument,getDocument,listDocuments,query,updateDocument} from "~/lib/appwrite.server";
import {caseStagesFor,canManage,canUseCRM,type Staff} from "./domain";
import {allow,audit,dateField,field,leadFor,serialized} from "./crm.server";
export type CaseRecord={$id:string;leadId:string;owner:string;kind:string;institution:string;course:string;country:string;intake:string;stage:string;deadline:string;notes:string;version:number};
import {appointmentCalendarLock,appointmentTime,assertCalendarAvailable,type Appointment} from "./calendar.server";
export type {Appointment} from "./calendar.server";

export async function scopedRecords<T extends {leadId:string}>(staff:Staff,collection:string){allow(canUseCRM(staff));const filters=[query("orderDesc","$createdAt"),query("limit",undefined,[100])];if(!canManage(staff))filters.push(query("equal","owner",[staff.$id]));const result=await listDocuments<T>(collection,filters);const records=[];for(const record of result.documents){try{await leadFor(staff,record.leadId);records.push(record);}catch(error){if(error instanceof Response&&[403,404].includes(error.status))continue;throw error;}}return records;}
export async function saveCase(staff:Staff,form:FormData){const id=field(form,"id",36),leadId=field(form,"leadId",36);return serialized(`lead:${leadId}`,async()=>{
 const lead=await leadFor(staff,leadId);
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
export async function saveAppointment(staff: Staff, form: FormData) {
  const id = field(form, "id", 36);
  const leadId = field(form, "leadId", 36);
  allow(canUseCRM(staff));
  return serialized(`lead:${leadId}`, () => serialized(appointmentCalendarLock, async () => {
    const lead = await leadFor(staff, leadId);
    if (!lead.owner) throw new Response("Assign the lead before booking an appointment.", { status: 400 });
    const assignee = await getDocument<Staff>("staff", lead.owner);
    allow(assignee.active && canUseCRM(assignee));

    let current: Appointment | null = null;
    if (id) {
      try { current = await getDocument<Appointment>("appointments", id); }
      catch (error) {
        if (error instanceof AppwriteError && error.status === 404) throw new Response("Appointment not found", { status: 404 });
        throw error;
      }
      allow(current.leadId === leadId);
      if (current.owner !== lead.owner) throw new Response("Reconcile the lead handoff before editing this appointment.", { status: 409 });
      if (current.version !== Number(field(form, "version"))) throw new Response("Appointment changed. Refresh before saving.", { status: 409 });
    }

    const startsAt = appointmentTime(field(form, "startsAt", 40));
    const endsAt = appointmentTime(field(form, "endsAt", 40));
    const status = field(form, "status", 30);
    const title = field(form, "title", 300);
    const reason = field(form, "reason", 2000);
    if (!title || endsAt <= startsAt || !["Booked", "Completed", "Cancelled", "No show"].includes(status)) {
      throw new Response("Enter a title, a valid time range and a booking status.", { status: 400 });
    }
    const moved = !!current && (Date.parse(current.startsAt) !== Date.parse(startsAt) || Date.parse(current.endsAt) !== Date.parse(endsAt));
    const changedStatus = current?.status !== status;
    if (!current && status !== "Booked") throw new Response("New appointments must start as Booked.", { status: 400 });
    if (current && current.status !== "Booked" && (moved || changedStatus)) {
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

    const payload = { leadId, owner: lead.owner, title, startsAt, endsAt, status, location: field(form, "location", 1000), notes: field(form, "notes", 10000), version: (current?.version ?? 0) + 1 };
    const appointmentId = current?.$id ?? randomUUID();
    const details = { appointmentId, fromVersion: current?.version ?? 0, toVersion: payload.version, status, startsAt, endsAt, reason };
    const event = await audit(staff, leadId, "lead", "Appointment save requested", { ...details, state: "pending" });
    const record = current ? await updateDocument<Appointment>("appointments", appointmentId, payload) : await createDocument("appointments", payload, appointmentId);
    await updateDocument("activities", event.$id, { event: "Appointment saved", details: JSON.stringify({ ...details, state: "completed" }) });
    return record;
  }));
}

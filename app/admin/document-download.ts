import type {LoaderFunctionArgs} from "react-router";
import {requireStaff} from "./auth.server";
import {leadFor,audit} from "./crm.server";
import {getDocument} from "~/lib/appwrite.server";
import {downloadFile,privateBucket} from "./storage.server";
import type {ClientDocument} from "./documents";
export async function loader({request,params}:LoaderFunctionArgs){const staff=await requireStaff(request),doc=await getDocument<ClientDocument>("documents",params.id!);await leadFor(staff,doc.leadId);await audit(staff,doc.leadId,"lead","Document downloaded",{documentId:doc.$id});return downloadFile(privateBucket(),doc.fileId,doc.name);}

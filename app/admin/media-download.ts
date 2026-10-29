import type {LoaderFunctionArgs} from "react-router";
import {requireStaff} from "./auth.server";
import {allow} from "./crm.server";
import {canEditContent} from "./domain";
import {getDocument} from "~/lib/appwrite.server";
import {downloadFile,mediaBucket} from "./storage.server";
import type {Media} from "./media";
export async function loader({request,params}:LoaderFunctionArgs){const staff=await requireStaff(request);allow(canEditContent(staff));const file=await getDocument<Media>("media",params.id!);return downloadFile(mediaBucket(),file.fileId,file.name);}

import type {LoaderFunctionArgs} from "react-router";
import {requireStaff} from "./auth.server";
import {allow} from "./crm.server";
import {canEditContent} from "./domain";

import {downloadFile,mediaBucket} from "./storage.server";
import {mediaFor} from "./media.server";
export async function loader({request,params}:LoaderFunctionArgs){const staff=await requireStaff(request);allow(canEditContent(staff));const file=await mediaFor(params.id!);return downloadFile(mediaBucket(),file.fileId,file.name);}

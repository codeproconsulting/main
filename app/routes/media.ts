import type {LoaderFunctionArgs} from "react-router";
import {getDocument,AppwriteError} from "~/lib/appwrite.server";
import {storageRequest,mediaBucket} from "~/admin/storage.server";
import type {Media} from "~/admin/media";
export async function loader({params}:LoaderFunctionArgs){let media;try{media=await getDocument<Media>("media",params.id!);}catch(error){if(error instanceof AppwriteError&&error.status===404)throw new Response("Not found",{status:404});throw error;}if(!media.published)throw new Response("Not found",{status:404});const response=await storageRequest(`/storage/buckets/${mediaBucket()}/files/${media.fileId}/view`);return new Response(response.body,{headers:{"Content-Type":media.mime,"X-Content-Type-Options":"nosniff","Cache-Control":"no-store"}});}

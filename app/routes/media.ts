import type {LoaderFunctionArgs} from "react-router";
import {publicMedia} from "~/admin/media.server";
export const loader=({params}:LoaderFunctionArgs)=>publicMedia(params.id!);

import type { ActionFunctionArgs } from "react-router";
import { signOut } from "./auth.server";
export const action = ({ request }: ActionFunctionArgs) => signOut(request);
export const loader = () => new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });

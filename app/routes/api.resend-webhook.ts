import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { ActionFunctionArgs } from "react-router";
import { AppwriteError, createDocument, getDocument, listDocuments, query } from "~/lib/appwrite.server";
import { boundedBody } from "~/lib/request-body.server";

const supported = ["email.delivered", "email.bounced", "email.complained"];
const digest = (value: string) => createHash("sha256").update(value).digest("hex");

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  const secret = process.env.RESEND_WEBHOOK_SECRET ?? "";
  if (process.env.ENABLE_RESEND_WEBHOOK !== "true" || !/^whsec_[A-Za-z0-9+/]+={0,2}$/.test(secret)) {
    return new Response(null, { status: 404 });
  }
  const key = Buffer.from(secret.slice(6), "base64");
  if (key.length < 16) return new Response(null, { status: 404 });
  const id = request.headers.get("svix-id") ?? "";
  const timestamp = request.headers.get("svix-timestamp") ?? "";
  const signatures = request.headers.get("svix-signature") ?? "";
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id) || !/^\d{1,12}$/.test(timestamp) ||
      Math.abs(Date.now() / 1000 - Number(timestamp)) > 300 || signatures.length > 2048) {
    return new Response(null, { status: 401 });
  }

  try {
    const raw = Buffer.from(await (await boundedBody(request, 32 * 1024, "Webhook")).arrayBuffer());
    const expected = createHmac("sha256", key).update(`${id}.${timestamp}.`).update(raw).digest();
    const valid = signatures.split(/\s+/).some(value => {
      if (!/^v1,[A-Za-z0-9+/]{43}=$/.test(value)) return false;
      return timingSafeEqual(expected, Buffer.from(value.slice(3), "base64"));
    });
    if (!valid) return new Response(null, { status: 401 });

    let event;
    try { event = JSON.parse(raw.toString("utf8")); } catch { return new Response(null, { status: 400 }); }
    const kind = event?.type;
    if (!supported.includes(kind)) return new Response(null, { status: 200 });
    const providerId = event.data?.email_id;
    const recipients = event.data?.to;
    const recipient = Array.isArray(recipients) && recipients.length === 1 && typeof recipients[0] === "string"
      ? recipients[0].trim().toLowerCase() : "";
    const time = typeof event.created_at === "string" ? Date.parse(event.created_at) : NaN;
    if (typeof providerId !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(providerId) ||
        !recipient || recipient.length > 254 || !Number.isFinite(time)) return new Response(null, { status: 400 });

    const { documents } = await listDocuments<{ payload: string }>("email_outbox", [
      query("equal", "providerId", [providerId]), query("select", undefined, ["payload"]), query("limit", undefined, [2]),
    ]);
    // Resend may deliver its event before the worker has saved the accepted provider ID.
    if (documents.length !== 1) return new Response(null, { status: 503 });
    const to = JSON.parse(documents[0].payload).to;
    if (!Array.isArray(to) || to.length !== 1 || typeof to[0] !== "string" ||
        to[0].trim().toLowerCase() !== recipient) return new Response(null, { status: 400 });

    const eventId = digest("resend:" + id).slice(0, 32);
    const data = { providerId, kind, occurredAt: new Date(time).toISOString(), recipientKey: digest(recipient) };
    try { await createDocument("email_events", data, eventId); }
    catch (error) {
      if (!(error instanceof AppwriteError && error.status === 409)) throw error;
      const existing = await getDocument<typeof data>("email_events", eventId);
      if (Object.entries(data).some(([field, value]) => existing[field as keyof typeof data] !== value)) {
        return new Response(null, { status: 409 });
      }
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof Response) return error;
    return new Response(null, { status: 503 });
  }
}

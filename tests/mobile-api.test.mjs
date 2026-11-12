import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("mobile sign-in, shared lead edits, scoped snapshot and revocation", async () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const vite = await createServer({
    configFile: false, root, resolve: { alias: { "~": root + "app" } },
    server: { middlewareMode: true, hmr: false, ws: false }, logLevel: "error",
  });
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, {
    NODE_ENV: "test", APPWRITE_ENDPOINT: "http://127.0.0.1/v1", APPWRITE_PROJECT_ID: "fixture",
    APPWRITE_DATABASE_ID: "fixture", APPWRITE_API_KEY: "fixture",
    SESSION_SECRET: "synthetic-session-key-for-mobile-test", DASHBOARD_URL: "https://crm.example.invalid",
  });
  let revoked = false;
  let active = true;
  const events = [];
  const leads = [
    { $id: "owned", owner: "staff", name: "Synthetic lead", email: "fixture@example.invalid", stage: "New", priority: "Normal", nextFollowUp: "2027-01-01T10:00:00.000Z", version: 1 },
    { $id: "foreign", owner: "other", name: "Other lead" },
  ];
  const tasks = [
    { $id: "task", owner: "staff", leadId: "owned", title: "Follow up" },
    { $id: "transferred", owner: "staff", leadId: "foreign", title: "Private task" },
  ];
  globalThis.fetch = async (input, options) => {
    const url = new URL(input);
    if (url.pathname.endsWith("/sessions/email")) {
      return Response.json({ secret: "synthetic-appwrite-session", expire: new Date(Date.now() + 3600000).toISOString() });
    }
    if (url.pathname.endsWith("/sessions/current")) {
      assert.equal(options.headers["X-Appwrite-Session"], "synthetic-appwrite-session");
      revoked = true;
      return new Response(null, { status: 204 });
    }
    if (url.pathname.endsWith("/account")) {
      assert.equal(options.headers["X-Appwrite-Session"], "synthetic-appwrite-session");
      return Response.json({ $id: "staff" }, { status: revoked ? 401 : 200 });
    }
    if (url.pathname.endsWith("/staff/documents/staff")) {
      return Response.json({ role: "counselor", name: "Synthetic counselor", active });
    }
    if (url.pathname.includes("/activities/documents")) {
      const { data } = JSON.parse(options.body);
      if (options.method === "POST") events.push(data);
      return Response.json({ $id: "audit" });
    }
    const match = url.pathname.match(/\/(leads|tasks)\/documents(?:\/([^/]+))?$/);
    assert.ok(match);
    const rows = match[1] === "leads" ? leads : tasks;
    if (match[2]) {
      const row = rows.find(row => row.$id === match[2]);
      if (!row) return Response.json({}, { status: 404 });
      if (options.method === "PATCH") Object.assign(row, JSON.parse(options.body).data);
      return Response.json(row);
    }
    const filters = url.searchParams.getAll("queries[]").map(JSON.parse);
    assert.ok(filters.some(filter => filter.attribute === "owner" && filter.values[0] === "staff"));
    const documents = rows.filter(row => row.owner === "staff");
    return Response.json({ documents, total: documents.length });
  };
  try {
    const { loader, action } = await vite.ssrLoadModule("/app/admin/mobile-api.ts");
    function send(resource, init, host = "https://crm.example.invalid") {
      const request = new Request(`${host}/admin/mobile/v1/${resource}`, init);
      return (init?.method ? action : loader)({ request, params: { resource: resource.split("?")[0] } });
    }
    const credentials = {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "fixture@example.invalid", password: "synthetic" }),
    };
    assert.equal((await send("session", credentials, "https://other.example.invalid")).status, 403);
    assert.equal((await send("session", { ...credentials, headers: { ...credentials.headers, Origin: "https://crm.example.invalid" } })).status, 403);
    assert.equal((await send("workspace")).status, 401);
    const login = await send("session", credentials);
    assert.equal(login.status, 200);
    assert.match(login.headers.get("Cache-Control"), /no-store/);
    const { token } = await login.json();
    assert.ok(!Buffer.from(token, "base64url").includes(Buffer.from("synthetic-appwrite-session")));
    const auth = { headers: { Authorization: `Bearer ${token}` } };
    const snapshot = await send("workspace", auth);
    assert.equal(snapshot.status, 200);
    const data = await snapshot.json();
    assert.deepEqual(data.leads.map(lead => lead.id), ["owned"]);
    assert.equal(data.leads[0].email, undefined);
    assert.deepEqual(data.tasks.map(task => task.id), ["task"]);
    const tampered = (token[0] === "a" ? "b" : "a") + token.slice(1);
    assert.equal((await send("workspace", { headers: { Authorization: `Bearer ${tampered}` } })).status, 401);
    const { action: webAction } = await vite.ssrLoadModule("/app/admin/lead.tsx");
    const { signIn: webSignIn } = await vite.ssrLoadModule("/app/admin/auth.server.ts");
    const browserHeaders = { Origin: "https://crm.example.invalid" };
    const browserLogin = await webSignIn(new Request("https://crm.example.invalid/admin/login", { headers: browserHeaders }), "fixture@example.invalid", "synthetic");
    const cookie = browserLogin.headers.get("Set-Cookie").split(";")[0];
    const edit = (id, changes) => send(`lead?id=${id}`, {
      method: "PATCH", headers: { ...auth.headers, "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    assert.equal((await send("lead?id=foreign", auth)).status, 403);
    assert.equal((await send("lead?id=missing", auth)).status, 404);
    assert.equal((await edit("foreign", { version: 1, stage: "Contacted", priority: "High" })).status, 403);
    assert.equal((await edit("owned", { version: 1, stage: "Lost", priority: "High" })).status, 400);
    assert.equal(events.length, 0);
    const saved = await edit("owned", { version: 1, stage: "Contacted", priority: "High", owner: "other", nextFollowUp: "" });
    assert.equal(saved.status, 200);
    assert.equal((await saved.json()).version, 2);
    assert.equal(leads[0].owner, "staff");
    assert.equal(leads[0].nextFollowUp, "2027-01-01T10:00:00.000Z");
    assert.equal(events.length, 1);
    const webForm = new FormData();
    for (const [key, value] of Object.entries({ intent: "update", version: "1", stage: "Qualified", priority: "Normal" })) webForm.set(key, value);
    const updateInBrowser = () => webAction({
      request: new Request("https://crm.example.invalid/admin/leads/owned", {
        method: "POST", headers: { ...browserHeaders, Cookie: cookie }, body: webForm,
      }),
      params: { id: "owned" },
    });
    const conflict = await updateInBrowser();
    assert.equal(conflict.init.status, 409);
    assert.equal(conflict.data.conflict, true);
    webForm.set("version", "2");
    assert.equal((await updateInBrowser()).success, true);
    const current = await send("lead?id=owned", auth);
    assert.equal((await current.json()).stage, "Qualified");
    assert.equal((await edit("owned", { version: 2, stage: "Contacted", priority: "Urgent" })).status, 409);
    assert.equal(events.length, 2);
    active = false;
    assert.equal((await send("workspace", auth)).status, 403);
    assert.equal((await send("session", { ...auth, method: "DELETE" })).status, 204);
    assert.equal((await send("workspace", auth)).status, 401);
  } finally {
    globalThis.fetch = originalFetch;
    await vite.close();
  }
});

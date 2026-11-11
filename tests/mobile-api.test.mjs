import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("mobile sign-in, scoped snapshot, tampering and session revocation", async () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const vite = await createServer({
    configFile: false, root, resolve: { alias: { "~": root + "app" } },
    server: { middlewareMode: true, hmr: false, ws: false }, logLevel: "error",
  });
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, {
    APPWRITE_ENDPOINT: "http://127.0.0.1/v1", APPWRITE_PROJECT_ID: "fixture",
    APPWRITE_DATABASE_ID: "fixture", APPWRITE_API_KEY: "fixture",
    SESSION_SECRET: "synthetic-session-key-for-mobile-test", DASHBOARD_URL: "https://crm.example.invalid",
  });
  let revoked = false;
  let active = true;
  const leads = [
    { $id: "owned", owner: "staff", name: "Synthetic lead", email: "fixture@example.invalid" },
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
    const match = url.pathname.match(/\/(leads|tasks)\/documents(?:\/([^/]+))?$/);
    assert.ok(match);
    const rows = match[1] === "leads" ? leads : tasks;
    if (match[2]) return Response.json(rows.find(row => row.$id === match[2]));
    const filters = url.searchParams.getAll("queries[]").map(JSON.parse);
    assert.ok(filters.some(filter => filter.attribute === "owner" && filter.values[0] === "staff"));
    const documents = rows.filter(row => row.owner === "staff");
    return Response.json({ documents, total: documents.length });
  };
  try {
    const { loader, action } = await vite.ssrLoadModule("/app/admin/mobile-api.ts");
    function send(resource, init, host = "https://crm.example.invalid") {
      const request = new Request(`${host}/admin/mobile/v1/${resource}`, init);
      return (init?.method ? action : loader)({ request, params: { resource } });
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
    active = false;
    assert.equal((await send("workspace", auth)).status, 403);
    assert.equal((await send("session", { ...auth, method: "DELETE" })).status, 204);
    assert.equal((await send("workspace", auth)).status, 401);
  } finally {
    globalThis.fetch = originalFetch;
    await vite.close();
  }
});

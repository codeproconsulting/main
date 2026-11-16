import assert from "node:assert/strict";
import test from "node:test";
import { teamMigration } from "../scripts/classify-lead-teams.mjs";

function fixture() {
  const stores = {
    crm_teams: new Map([["alpha", { $id: "alpha", status: "active" }]]),
    leads: new Map([["one", { $id: "one", owner: "counselor", stage: "New", version: 1 }]]),
    staff: new Map([
      ["admin", { $id: "admin", active: true, role: "admin" }],
      ["manager", { $id: "manager", active: true, role: "manager" }],
    ]),
    activities: new Map(),
    locks: new Map(),
  };
  const options = {};
  const base = {
    database: "synthetic",
    actor: "admin",
    request: async (input, method = "GET", body) => {
      const url = new URL(input, "http://synthetic.invalid");
      const [, name, id] = url.pathname.match(/\/collections\/([\w]+)\/documents(?:\/([^/]+))?$/);
      const store = stores[name];
      if (method === "GET" && id) return store.get(id);
      if (method === "GET") {
        const query = url.searchParams.getAll("queries[]").map(JSON.parse);
        const cursor = query.find(item => item.method === "cursorAfter")?.values[0] ?? "";
        return { documents: [...store.values()].filter(row => row.$id > cursor).sort((a, b) => a.$id.localeCompare(b.$id)).slice(0, 100) };
      }
      if (method === "POST") store.set(body.documentId, body.data);
      if (method === "PATCH") {
        Object.assign(store.get(id), body.data);
        if (options.loseAck) throw new Error("Synthetic ambiguous acknowledgment");
      }
      if (method === "DELETE") store.delete(id);
    },
  };
  return { base, stores, options };
}

const manifest = [{ leadId: "one", teamId: "alpha", version: 1 }];

test("inventory reports aggregates across pages and preview leaves records unchanged", async () => {
  const { base, stores } = fixture();
  for (let i = 0; i < 100; i++) {
    const id = "lead-" + String(i).padStart(3, "0");
    stores.leads.set(id, { $id: id, teamId: "missing" });
  }
  const totals = await teamMigration(base);
  assert.deepEqual(totals.leads, { classified: 0, unclassified: 1, invalidTeam: 100, ownerTeamMismatch: 0 });
  assert.equal(totals.managers.legacyGlobal, 1);
  assert.equal((await teamMigration({ ...base, manifest })).ready, 1);
  assert.equal(stores.leads.get("one").teamId, undefined);
  assert.equal(stores.activities.size, 0);
});

test("classification validates the entire batch, audits and preserves assignment, and can be rerun", async () => {
  const { base, stores } = fixture();
  await assert.rejects(teamMigration({ ...base, manifest: [...manifest, ...manifest] }), /Invalid manifest/);
  const blocked = await teamMigration({ ...base, manifest: [{ ...manifest[0], version: 2 }], apply: true });
  assert.equal(blocked.blocked, 1);
  assert.equal(stores.activities.size, 0);
  assert.equal((await teamMigration({ ...base, manifest, actor: "manager", apply: true })).blocked, 1);
  assert.equal((await teamMigration({ ...base, manifest, apply: true })).applied, 1);
  assert.deepEqual(stores.leads.get("one"), { $id: "one", owner: "counselor", stage: "New", teamId: "alpha", version: 2 });
  assert.equal(stores.activities.size, 1);
  assert.equal(stores.locks.size, 0);
  assert.equal((await teamMigration({ ...base, manifest, apply: true })).unchanged, 1);
});

test("uncertain classification retains both locks and stops the batch", async () => {
  const { base, stores, options } = fixture();
  options.loseAck = true;
  const result = await teamMigration({ ...base, manifest, apply: true });
  assert.equal(result.unconfirmed, 1);
  assert.equal(stores.leads.get("one").teamId, "alpha");
  assert.equal(stores.locks.size, 2);
});

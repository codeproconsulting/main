import { createHash, randomUUID } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { api, loadEnvironment, q } from "./appwrite-client.mjs";

const validId = value => typeof value === "string" && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(value);

async function* rows(request, path, fields) {
  let cursor;
  while (true) {
    const params = new URLSearchParams();
    for (const item of [q("select", undefined, ["$id", ...fields]), q("orderAsc", "$id"),
      q("limit", undefined, [100]), ...(cursor ? [q("cursorAfter", undefined, [cursor])] : [])]) {
      params.append("queries[]", item);
    }
    const { documents } = await request(path + "?" + params);
    yield* documents;
    if (documents.length < 100) return;
    const next = documents.at(-1).$id;
    if (!next || next === cursor) throw new Error("Inventory cursor did not advance");
    cursor = next;
  }
}

export async function teamMigration({ database, request = api, manifest, apply = false, actor }) {
  if (!database) throw new Error("Missing database");
  const collection = name => "/databases/" + encodeURIComponent(database) + "/collections/" + name + "/documents";
  const leads = collection("leads"), teams = collection("crm_teams"), staff = collection("staff");
  if (manifest === undefined && !apply) {
    const activeTeams = new Set();
    const result = { activeTeams: 0, leads: { classified: 0, unclassified: 0, invalidTeam: 0, ownerTeamMismatch: 0 }, managers: { legacyGlobal: 0, explicitGlobal: 0, restricted: 0, invalidScope: 0 } };
    for await (const team of rows(request, teams, ["status"])) if (team.status === "active") activeTeams.add(team.$id);
    result.activeTeams = activeTeams.size;
    const ownerTeams = new Map();
    for await (const member of rows(request, staff, ["role", "active", "managerScope", "teamId"])) {
      if (member.teamId && (member.role === "counselor" || member.managerScope === "team")) {
        ownerTeams.set(member.$id, member.teamId);
      }
      if (member.role !== "manager" || !member.active) continue;
      const key = !member.managerScope ? "legacyGlobal" : member.managerScope === "global" ? "explicitGlobal" :
        member.managerScope === "team" && activeTeams.has(member.teamId) ? "restricted" : "invalidScope";
      result.managers[key]++;
    }
    for await (const lead of rows(request, leads, ["teamId", "owner"])) {
      result.leads[!lead.teamId ? "unclassified" : activeTeams.has(lead.teamId) ? "classified" : "invalidTeam"]++;
      const ownerTeam = ownerTeams.get(lead.owner);
      if (lead.teamId && ownerTeam && ownerTeam !== lead.teamId) result.leads.ownerTeamMismatch++;
    }
    return result;
  }

  if (!Array.isArray(manifest) || manifest.length < 1 || manifest.length > 100 ||
      manifest.some(row => !row || !validId(row.leadId) || !validId(row.teamId) ||
        !Number.isSafeInteger(row.version) || row.version < 1 || Object.keys(row).length !== 3) ||
      new Set(manifest.map(row => row.leadId)).size !== manifest.length) throw new Error("Invalid manifest");
  if (apply && !validId(actor)) throw new Error("Apply requires an administrator profile ID");

  async function check(row) {
    const lead = await request(leads + "/" + row.leadId);
    const team = await request(teams + "/" + row.teamId);
    if (team.status !== "active") return "blocked";
    if (lead.teamId === row.teamId) return "unchanged";
    if (lead.teamId || lead.version !== row.version) return "blocked";
    return "ready";
  }

  const result = { ready: 0, unchanged: 0, blocked: 0, applied: 0, unconfirmed: 0 };
  const planned = [];
  for (const row of manifest) {
    const status = await check(row);
    result[status]++;
    if (status === "ready") planned.push(row);
  }
  if (!apply || result.blocked) return result;

  const locks = collection("locks");
  const lockOwner = randomUUID();
  async function locked(key, operation) {
    const id = createHash("sha256").update(key).digest("hex").slice(0, 32);
    try {
      await request(locks, "POST", { documentId: id, permissions: [], data: { key, owner: lockOwner, acquiredAt: new Date().toISOString() } });
    } catch (error) {
      if (error.status === 409) return "blocked";
      throw error;
    }
    let status;
    try {
      status = await operation();
      return status;
    } finally {
      if (status !== "unconfirmed") await request(locks + "/" + id, "DELETE");
    }
  }
  for (const row of planned) {
    let status;
    try {
      status = await locked("lead:" + row.leadId, () => locked("staff:access", async () => {
        const currentActor = await request(staff + "/" + actor);
        if (!currentActor.active || !["owner", "admin"].includes(currentActor.role)) return "blocked";
        const current = await check(row);
        if (current !== "ready") return current;
        const data = { teamId: row.teamId, version: row.version + 1 };
        await request(collection("activities"), "POST", {
          documentId: randomUUID(), permissions: [], data: {
            actor, entityId: row.leadId, entityType: "lead", event: "Enquiry team classification requested",
            details: JSON.stringify(data),
          },
        });
        try {
          await request(leads + "/" + row.leadId, "PATCH", { data });
          return "applied";
        } catch (error) {
          return [400, 401, 403, 404, 422].includes(error.status) ? "blocked" : "unconfirmed";
        }
      }));
    } catch {
      // Includes ambiguous lock acquisition or release. Inspect the batch before continuing.
      status = "unconfirmed";
    }
    result.ready--;
    result[status]++;
    if (status === "unconfirmed" || status === "blocked") break;
  }
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    loadEnvironment();
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== "--apply" && !arg.startsWith("--manifest="))) throw new Error("Unknown option");
    const file = args.find(arg => arg.startsWith("--manifest="))?.slice(11);
    if (file && ((await stat(file)).size > 65536)) throw new Error("Manifest exceeded 64 KiB");
    const manifest = file ? JSON.parse(await readFile(file, "utf8")) : undefined;
    const result = await teamMigration({
      database: process.env.APPWRITE_DATABASE_ID, manifest, apply: args.includes("--apply"), actor: process.env.TEAM_MIGRATION_ACTOR_ID,
    });
    console.log(JSON.stringify(result));
    if (result.blocked || result.unconfirmed) process.exitCode = 1;
  } catch (error) {
    console.error("Team migration stopped (HTTP " + (error.status ?? "configuration or validation") + "). Review the schema, manifest and locks.");
    process.exitCode = 1;
  }
}

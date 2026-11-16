import { loadEnvironment } from "./appwrite-client.mjs";
import { runReminderLoop } from "./reminder-runner.mjs";

loadEnvironment();
const actor = process.env.INTAKE_ROUTING_ACTOR_ID ?? "";
if (process.env.ENABLE_INTAKE_ROUTING !== "true" || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(actor)) {
  console.error("Set ENABLE_INTAKE_ROUTING and an active manager audit actor before starting intake routing.");
  process.exit(1);
}
const { routeIntakePage } = await import("../build/routing/intake-routing.mjs");
const controller = new AbortController();
for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => controller.abort());
let cursor;
async function cycle() {
  try {
    const { assigned, deferred, failed, cursor: next } = await routeIntakePage(actor, cursor, controller.signal);
    cursor = next;
    console.log(JSON.stringify({ assigned, deferred, failed }));
    return { failed };
  } catch {
    cursor = undefined;
    throw new Error("Intake routing cycle failed");
  }
}
try {
  const result = await runReminderLoop({
    cycle, signal: controller.signal, once: process.argv.includes("--once"),
    onError: () => console.error("Intake routing cycle unavailable. Retrying in 60 seconds."),
  });
  if (result?.failed) process.exitCode = 1;
} catch {
  console.error("Intake routing cycle failed. Check actor access, schema, and locks.");
  process.exitCode = 1;
}

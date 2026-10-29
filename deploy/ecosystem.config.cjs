// Run from the repository root. Both processes use one build and the ignored .env.
module.exports = {
  apps: [
    ...(process.env.ENABLE_SCHEDULED_PUBLISHING === "true" ? [{ name: "proconsulting-publishing", script: "scripts/publishing-worker.mjs", instances: 1, env: { NODE_ENV: "production" } }] : []),
    ...(process.env.ENABLE_BACKGROUND_WORKER === "true" ? [{ name: "proconsulting-worker", script: "scripts/worker.mjs", instances: 1, env: { NODE_ENV: "production" } }] : []),
    { name: "proconsulting-main", script: "scripts/start.mjs", instances: 1,
      env: { NODE_ENV: "production", HOST: "127.0.0.1", PORT: 3000, APP_SURFACE: "website" } },
    { name: "proconsulting-crm", script: "scripts/start.mjs", instances: 1,
      env: { NODE_ENV: "production", HOST: "127.0.0.1", PORT: 3001, APP_SURFACE: "dashboard" } },
  ],
};

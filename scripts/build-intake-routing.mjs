import { resolve } from "node:path";
import { build } from "vite";

await build({
  configFile: false,
  resolve: { alias: { "~": resolve("app") } },
  build: {
    ssr: "app/admin/intake-routing.server.ts",
    outDir: "build/routing",
    rollupOptions: { output: { entryFileNames: "intake-routing.mjs" } },
  },
});

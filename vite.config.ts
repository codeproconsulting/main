import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, createLogger } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const logger = createLogger();
const originalWarn = logger.warn;
const originalWarnOnce = logger.warnOnce;

logger.warn = (msg, options) => {
  if (msg.includes("Error when using sourcemap for reporting an error")) return;
  originalWarn(msg, options);
};
logger.warnOnce = (msg, options) => {
  if (msg.includes("Error when using sourcemap for reporting an error")) return;
  originalWarnOnce(msg, options);
};

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  customLogger: logger,
});

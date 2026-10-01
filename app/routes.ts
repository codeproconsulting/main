import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

// Import education routes
import educationRoutes from "./education/routes";
// Import immigration routes
import immigrationRoutes from "./immigration/routes";

export default [
  // Main app routes
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("apply", "education/routes/contact.tsx", { id: "root-apply" }),
  route("assessment", "education/routes/contact.tsx", { id: "root-assessment" }),
  route("admin", "education/routes/admin.tsx", { id: "root-admin" }),

  // Root level sitemap, robots, and llms.txt for AI crawlers
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("robots.txt", "routes/robots.txt.ts"),
  route("llms.txt", "routes/llms[.]txt.ts"),

  // Prefixed sub-apps
  ...prefix("education", educationRoutes),
  ...prefix("immigration", immigrationRoutes),
] satisfies RouteConfig;

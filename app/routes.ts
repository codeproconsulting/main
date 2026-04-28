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

  // Root level sitemap and robots
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("robots.txt", "routes/robots.txt.ts"),

  // Prefixed sub-apps
  ...prefix("education", educationRoutes),
  ...prefix("immigration", immigrationRoutes),
] satisfies RouteConfig;

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
  route("service-locations", "routes/service-locations.tsx"),
  route("service-locations/islamabad/ielts-preparation-in-islamabad", "routes/service-locations-islamabad.tsx"),
  route("service-locations/ielts-preparation-in-islamabad", "routes/service-locations-islamabad.tsx", { id: "service-locations-ielts-alias" }),
  route("ielts-preparation-in-islamabad", "routes/service-locations-islamabad.tsx", { id: "ielts-prep-in-islamabad-alias" }),
  route("ielts-preparation-islamabad", "routes/service-locations-islamabad.tsx", { id: "ielts-prep-islamabad-alias" }),
  route("service-locations/islamabad/toefl-preparation-in-islamabad", "routes/service-locations-toefl-islamabad.tsx"),
  route("service-locations/toefl-preparation-in-islamabad", "routes/service-locations-toefl-islamabad.tsx", { id: "service-locations-toefl-alias" }),
  route("toefl-preparation-in-islamabad", "routes/service-locations-toefl-islamabad.tsx", { id: "toefl-prep-in-islamabad-alias" }),
  route("toefl-preparation-islamabad", "routes/service-locations-toefl-islamabad.tsx", { id: "toefl-prep-islamabad-alias" }),
  route("service-locations/islamabad", "routes/service-locations-hub-islamabad.tsx"),
  route("islamabad", "routes/service-locations-hub-islamabad.tsx", { id: "islamabad-alias" }),
  route("locations", "routes/service-locations.tsx", { id: "locations-alias" }),
  route("locations/islamabad", "routes/service-locations-hub-islamabad.tsx", { id: "locations-islamabad-alias" }),
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

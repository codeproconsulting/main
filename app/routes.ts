import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

// Import education routes
import educationRoutes from "./education/routes";
// Import immigration routes
import immigrationRoutes from "./immigration/routes";

export default [
  route("media/:id", "routes/media.ts"),
  route("api/content", "routes/api.content.ts"),
  route("api/leads", "routes/api.leads.ts"),
  // Main app routes
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("apply", "education/routes/contact.tsx", { id: "root-apply" }),
  route("assessment", "education/routes/contact.tsx", { id: "root-assessment" }),
  route("admin/login", "admin/login.tsx"),
  route("admin/logout", "admin/logout.tsx"),
  route("admin", "admin/layout.tsx", [
    index("admin/overview.tsx"),
    route("leads", "admin/leads.tsx"),
    route("leads/:id/documents", "admin/documents.tsx"),
    route("documents/:id/download", "admin/document-download.ts"),
    route("blog-preview", "admin/preview.ts"),
    route("leads/:id", "admin/lead.tsx"),
    route("tasks", "admin/tasks.tsx"),
    route("blogs", "admin/blogs.tsx"),
    route("blogs/new", "admin/blog-edit.tsx", { id: "admin-blog-new" }),
    route("blogs/:id/history", "admin/history.tsx"),
    route("blogs/:id/edit", "admin/blog-edit.tsx"),
    route("media", "admin/media.tsx"),
    route("media/:id/download", "admin/media-download.ts"),
    route("reports", "admin/reports.tsx"),
    route("leads.csv", "admin/export.ts"),
    route("notifications", "admin/notifications.tsx"),
    route("applications", "admin/work.tsx", {id:"applications-list"}),
    route("applications/:id", "admin/work.tsx", {id:"application-detail"}),
    route("appointments", "admin/work.tsx", {id:"appointments-list"}),
    route("appointments/:id", "admin/work.tsx", {id:"appointment-detail"}),
    route("team", "admin/team.tsx"),
    route("settings", "admin/settings.tsx"),
  ]),

  // Root level sitemap, robots, and llms.txt for AI crawlers
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("robots.txt", "routes/robots.txt.ts"),
  route("llms.txt", "routes/llms[.]txt.ts"),

  // Prefixed sub-apps
  ...prefix("education", educationRoutes),
  ...prefix("immigration", immigrationRoutes),
] satisfies RouteConfig;

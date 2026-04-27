import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("immigration/routes/home.tsx"),
  route("contact", "immigration/routes/contact.tsx"),
  route("about", "immigration/routes/about.tsx"),
  route("services", "immigration/routes/services.tsx"),
  route("services/:slug", "immigration/routes/services-slug.tsx"),
  route("destinations", "immigration/routes/destinations.tsx"),
  route("destinations/:slug", "immigration/routes/destinations-slug.tsx"),
  route("things-to-do", "immigration/routes/things-to-do.tsx"),
  route("blog", "immigration/routes/blog.tsx"),
  route("blog/:slug", "immigration/routes/blog.$slug.tsx"),
] satisfies RouteConfig;

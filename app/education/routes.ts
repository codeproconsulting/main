import { type RouteConfig, index, route } from "@react-router/dev/routes"



export default [
  index("education/routes/home.tsx"),
  route("destinations", "education/routes/destinations.tsx"),
  route("destinations/:slug", "education/routes/destinations.$slug.tsx"),
  route("contact", "education/routes/contact.tsx"),
  route("apply", "education/routes/contact.tsx", { id: "education/routes/apply" }),
  route("courses", "education/routes/courses.tsx"),
  route("courses/:slug", "education/routes/courses.$slug.tsx"),
  route("about", "education/routes/about.tsx"),
  route("blog", "education/routes/blog.tsx"),
  route("blog/:slug", "education/routes/blog.$slug.tsx"),
  route("universities", "education/routes/universities.tsx"),
  route("services", "education/routes/services.tsx"),
  route("services/:slug", "education/routes/services.$slug.tsx"),
  route("privacy-policy", "education/routes/privacy-policy.tsx"),
  route("terms", "education/routes/terms.tsx"),
  route("cookie-policy", "education/routes/cookie-policy.tsx"),
  route("sitemap.xml", "education/routes/sitemap.xml.ts"),
  route("robots.txt", "education/routes/robots.txt.ts"),
] satisfies RouteConfig;
    

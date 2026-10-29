import { Link, isRouteErrorResponse, useRouteError } from "react-router";
export function BlogRouteError({ section }: { section: "education" | "immigration" }) {
  const error = useRouteError();
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return <main className="min-h-[70vh] flex flex-col justify-center items-center px-6 text-center bg-white">
    <Link to="/"><img src="/Logo_main.png" alt="Pro Consulting" width={200} height={40} className="mb-10"/></Link>
    <h1 className="text-3xl font-bold text-[#0B1B3A] mb-4">{missing ? "Article not found" : "The blog is temporarily unavailable"}</h1>
    <p className="text-slate-600 mb-6">{missing ? "This article may have moved or is no longer published." : "Please try again shortly. Your other services are still available."}</p>
    <Link className="font-semibold text-[#E91E8C]" to={`/${section}/blog`}>Back to {section} blog →</Link>
  </main>;
}

import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
export async function renderBlog(module: any, area: string, page: string, path: string) {
  const definitions = [{ path: page === "blog" ? `/${area}/blog` : `/${area}/blog/:slug`, loader: module.loader, Component: module.default, ErrorBoundary: module.ErrorBoundary }];
  const handler = createStaticHandler(definitions);
  const context = await handler.query(new Request(`http://example.invalid${path}`));
  if (context instanceof Response) return { status: context.status, html: await context.text() };
  return { status: context.statusCode, html: renderToString(createElement(StaticRouterProvider, { router: createStaticRouter(definitions, context), context, hydrate: false })) };
}

/**
 * Renders Ghost CMS HTML content with optional table-of-contents headings.
 * Injects id attributes into headings so TOC links work.
 */

import React from "react";

export interface HeadingItem {
  id: string;
  text: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() || "section";
}

/** Extract headings from HTML and generate ids. */
export function getHeadingsFromHtml(html: string | null | undefined): HeadingItem[] {
  if (!html || typeof html !== "string") return [];
  const items: HeadingItem[] = [];
  const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const tagContent = match[2];
    const text = tagContent.replace(/<[^>]+>/g, "").trim();
    if (text) {
      items.push({ id: `${slugify(text)}-${index}`, text });
      index += 1;
    }
  }
  return items;
}

/** Inject id attributes into heading tags so in-page links work. */
function injectHeadingIds(html: string, headings: HeadingItem[]): string {
  if (headings.length === 0) return html;
  let idx = 0;
  return html.replace(/<h([1-6])([^>]*)>/gi, (_, level: string, rest: string) => {
    const heading = headings[idx];
    idx += 1;
    if (!heading) return `<h${level}${rest}>`;
    if (/id\s*=/i.test(rest)) return `<h${level}${rest}>`;
    return `<h${level} id="${heading.id}"${rest}>`;
  });
}

interface GhostHtmlBodyProps {
  html: string | null | undefined;
  className?: string;
}

export function GhostHtmlBody({ html, className }: GhostHtmlBodyProps) {
  if (!html || typeof html !== "string") return null;
  const headings = getHeadingsFromHtml(html);
  const processedHtml = injectHeadingIds(html, headings);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}

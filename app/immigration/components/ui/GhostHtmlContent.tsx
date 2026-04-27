/**
 * Renders Ghost CMS post HTML content.
 * Ghost returns content as HTML; we render it in a constrained prose container.
 */

import React from "react";

interface GhostHtmlContentProps {
  html: string | null | undefined;
  className?: string;
}

export function GhostHtmlContent({ html, className }: GhostHtmlContentProps) {
  if (!html || typeof html !== "string") return null;
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

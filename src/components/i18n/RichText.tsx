/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */


import type { ReactNode } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { LinkPreview } from "@/components/ui/link-preview";

type InterpolationValues = Record<string, string | number>;

export type RichTextProps = {
  text: string;
  values?: InterpolationValues;
  className?: string;
  linkClassName?: string;
  previewExternal?: boolean;
};

/**
 * Interpolates {tokens} in the given string with provided values.
 * Only string/number replacements are supported to keep the parser simple and safe.
 */
function interpolate(input: string, values?: InterpolationValues): string {
  if (!values) return input;
  return input.replace(/\{(\w+)\}/g, (_match, key) => {
    const value = values[key];
    return value === undefined || value === null ? `{${key}}` : String(value);
  });
}

function isExternalHref(href: string): boolean {
  return /^(?:https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("ftp:");
}

/**
 * Parses a string and returns an array of strings and link elements.
 * Supported link syntax: [label](url)
 * - If url starts with '/' it is treated as an internal route and rendered with <Link to>.
 * - Otherwise, rendered as <a href>. http(s) links open in new tabs with rel security defaults.
 */
function renderWithLinks(
  text: string,
  linkClassName?: string,
  options?: { previewExternal?: boolean }
): ReactNode[] {
  const nodes: ReactNode[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g; // [label](url)
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    const [full, label, href] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    if (href.startsWith("/")) {
      nodes.push(
        <Link key={`${start}-link`} to={href} className={linkClassName}>
          {label}
        </Link>
      );
    } else if (isExternalHref(href)) {
      const openNewTab = /^https?:\/\//i.test(href);
      if (options?.previewExternal && openNewTab) {
        nodes.push(
          <LinkPreview key={`${start}-extp`} href={href} className={linkClassName}>
            {label}
          </LinkPreview>
        );
      } else {
        nodes.push(
          <a
            key={`${start}-ext`}
            href={href}
            className={linkClassName}
            {...(openNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </a>
        );
      }
    } else {
      // Fallback: treat as internal path if it looks like a relative path
      nodes.push(
        <a key={`${start}-raw`} href={href} className={linkClassName}>
          {label}
        </a>
      );
    }

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export const RichText: React.FC<RichTextProps> = ({
  text,
  values,
  className,
  linkClassName = "text-primary hover:text-primary/80 underline underline-offset-2 transition-colors",
  previewExternal = false,
}) => {
  const interpolated = interpolate(text, values);
  const content = renderWithLinks(interpolated, linkClassName, { previewExternal });
  return <span className={className}>{content}</span>;
};

export default RichText;



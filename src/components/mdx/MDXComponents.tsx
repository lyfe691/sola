/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * MDX element map for deep-dive articles.
 */

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { MDXComponents as MDXComponentsType } from "mdx/types";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import { CodeBlock, type CodeBlockLanguage } from "@/components/ui/code-block";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { ExpandableImage } from "./ExpandableImage";
import { FigureCaption, ProjectGallery, ProjectImage } from "./figures";
import { MDXHeading } from "./Heading";
import { TechStack } from "./TechStack";

/** Props MDX actually passes — avoid full HTML* bags. */
type MdxProps = {
  children?: ReactNode;
  className?: string;
  id?: string;
};

type MdxAnchorProps = MdxProps & {
  href?: string;
};

type MdxImgProps = {
  src?: string;
  alt?: string;
  className?: string;
};

function extractFencedCode(children: ReactNode): {
  language: string;
  code: string;
} | null {
  const child = Children.toArray(children)[0];
  if (!isValidElement(child)) return null;

  const el = child as ReactElement<{
    className?: string;
    children?: ReactNode;
  }>;
  const className = el.props.className;
  if (!className?.startsWith("language-")) return null;

  const language = className.slice("language-".length);
  const raw = el.props.children;
  const code = typeof raw === "string" ? raw : String(raw ?? "");
  return { language, code };
}

function isExternalHref(href: string | undefined): href is string {
  return typeof href === "string" && /^https?:\/\//i.test(href);
}

const html = {
  wrapper: ({ children }: MdxProps) => (
    <div className="mdx min-w-0">{children}</div>
  ),

  // the deep-dive hero already owns the page's single <h1>; an article's
  // leading `#` keeps the h1 display scale but lands as an <h2> in the outline
  h1: ({ children, className, id }: MdxProps) => (
    <MDXHeading level="h1" as="h2" id={id} className={className}>
      {children}
    </MDXHeading>
  ),

  h2: ({ children, className, id }: MdxProps) => (
    <MDXHeading level="h2" toc id={id} className={className}>
      {children}
    </MDXHeading>
  ),

  h3: ({ children, className, id }: MdxProps) => (
    <MDXHeading level="h3" id={id} className={className}>
      {children}
    </MDXHeading>
  ),

  p: ({ children, className }: MdxProps) => (
    <p
      className={cn(
        "mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  ),

  ul: ({ children, className }: MdxProps) => (
    <ul
      className={cn(
        "mb-4 ml-5 list-disc space-y-2 marker:text-primary",
        className,
      )}
    >
      {children}
    </ul>
  ),

  ol: ({ children, className }: MdxProps) => (
    <ol
      className={cn(
        "mb-4 ml-5 list-decimal space-y-2 marker:text-primary",
        className,
      )}
    >
      {children}
    </ol>
  ),

  li: ({ children, className }: MdxProps) => (
    <li
      className={cn(
        "pl-1.5 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </li>
  ),

  blockquote: ({ children, className }: MdxProps) => (
    <blockquote
      className={cn(
        "mb-4 border-l-4 border-primary/30 pl-4 text-sm italic text-muted-foreground",
        className,
      )}
    >
      {children}
    </blockquote>
  ),

  pre: ({ children, className }: MdxProps) => {
    const fenced = extractFencedCode(children);
    if (fenced) {
      return (
        <CodeBlock
          code={fenced.code}
          lang={fenced.language as CodeBlockLanguage}
        />
      );
    }

    return (
      <pre
        className={cn(
          "mb-4 overflow-x-auto rounded-xl border border-border bg-muted/50 p-4 text-xs",
          className,
        )}
      >
        {children}
      </pre>
    );
  },

  code: ({ children, className }: MdxProps) => {
    const fenced = className?.includes("language-");
    return (
      <code
        className={cn(
          !fenced &&
            "rounded bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-foreground",
          className,
        )}
      >
        {children}
      </code>
    );
  },

  img: ({ src, alt }: MdxImgProps) => (
    <figure className="my-8">
      <ExpandableImage src={src || ""} alt={alt || ""} />
      {alt ? <FigureCaption>{alt}</FigureCaption> : null}
    </figure>
  ),

  a: ({ href, className, children }: MdxAnchorProps) => {
    // site-internal links ride the router — a plain <a> would hard-reload
    // the whole document (mirrors RichText's treatment)
    if (typeof href === "string" && href.startsWith("/")) {
      return (
        <Link to={href} className={cn("link", className)}>
          {children}
        </Link>
      );
    }

    if (isExternalHref(href)) {
      return (
        <LinkPreview
          href={href}
          previewType="auto"
          compact={false}
          className={cn("link", className)}
        >
          {children}
        </LinkPreview>
      );
    }

    return (
      <a href={href} className={cn("link", className)}>
        {children}
      </a>
    );
  },

  hr: ({ className }: MdxProps) => (
    <hr className={cn("my-8 border-border", className)} />
  ),

  strong: ({ children, className }: MdxProps) => (
    <strong className={cn("font-semibold text-foreground", className)}>
      {children}
    </strong>
  ),

  em: ({ children, className }: MdxProps) => (
    <em className={cn("italic", className)}>{children}</em>
  ),

  table: ({ children, className }: MdxProps) => (
    <div className="my-6">
      <Table className={cn("text-xs", className)}>{children}</Table>
    </div>
  ),

  thead: ({ children, className }: MdxProps) => (
    <TableHeader className={className}>{children}</TableHeader>
  ),
  tbody: ({ children, className }: MdxProps) => (
    <TableBody className={className}>{children}</TableBody>
  ),
  tr: ({ children, className }: MdxProps) => (
    <TableRow className={className}>{children}</TableRow>
  ),

  th: ({ children, className }: MdxProps) => (
    <TableHead className={cn("h-10 text-xs font-medium", className)}>
      {children}
    </TableHead>
  ),

  td: ({ children, className }: MdxProps) => (
    <TableCell
      className={cn(
        "whitespace-normal text-xs text-muted-foreground",
        className,
      )}
    >
      {children}
    </TableCell>
  ),
} satisfies MDXComponentsType;

const shortcodes = {
  CodeBlock,
  ProjectImage,
  ProjectGallery,
  TechStack,
};

export const MDXComponents = {
  ...html,
  ...shortcodes,
} as MDXComponentsType & typeof shortcodes;

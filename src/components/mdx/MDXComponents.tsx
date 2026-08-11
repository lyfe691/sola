/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Element map handed to MDXProvider — design-system components for every
 * markdown construct the deep-dive articles use.
 */

import {
  Children,
  isValidElement,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
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
import { cn } from "@/lib/utils";
import { ExpandableImage } from "./ExpandableImage";
import { MDXHeading } from "./Heading";
import { blockReveal } from "./reveal";

interface MDXComponentProps {
  children?: ReactNode;
  className?: string;
  id?: string;
}

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

export const MDXComponents = {
  h1: ({ children, className, id, ...props }: MDXComponentProps) => (
    <MDXHeading level="h1" id={id} className={className} {...props}>
      {children}
    </MDXHeading>
  ),

  // h2s are the article's nav landmarks: data-toc lets the section rail
  // pick them up; scroll-mt clears the sticky bar
  h2: ({ children, className, id, ...props }: MDXComponentProps) => (
    <MDXHeading level="h2" toc id={id} className={className} {...props}>
      {children}
    </MDXHeading>
  ),

  h3: ({ children, className, id, ...props }: MDXComponentProps) => (
    <MDXHeading level="h3" id={id} className={className} {...props}>
      {children}
    </MDXHeading>
  ),

  p: ({ children, className, ...props }: MDXComponentProps) => (
    <motion.p
      {...blockReveal}
      className={cn(
        "mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </motion.p>
  ),

  // native markers so ordered lists keep their numbers
  ul: ({ children, className, ...props }: MDXComponentProps) => (
    <motion.ul
      {...blockReveal}
      className={cn(
        "mb-4 ml-5 list-disc space-y-2 marker:text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </motion.ul>
  ),

  ol: ({ children, className, ...props }: MDXComponentProps) => (
    <motion.ol
      {...blockReveal}
      className={cn(
        "mb-4 ml-5 list-decimal space-y-2 marker:text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </motion.ol>
  ),

  li: ({ children, className, ...props }: HTMLAttributes<HTMLLIElement>) => (
    <li
      className={cn(
        "pl-1.5 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </li>
  ),

  blockquote: ({ children, className, ...props }: MDXComponentProps) => (
    <motion.blockquote
      {...blockReveal}
      className={cn(
        "mb-4 border-l-4 border-primary/30 pl-4 text-sm italic text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </motion.blockquote>
  ),

  pre: ({ children, className, ...props }: MDXComponentProps) => {
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
      <motion.pre
        {...blockReveal}
        className={cn(
          "mb-4 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-xs",
          className,
        )}
        {...props}
      >
        {children}
      </motion.pre>
    );
  },

  code: ({
    children,
    className,
    ...props
  }: HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        // fenced blocks are handled by `pre` → CodeBlock; this styles inline
        // `code` only (language-* class is present on fenced code, so skip)
        !className?.includes("language-") &&
          "rounded bg-muted/50 px-1.5 py-0.5 font-mono text-xs",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  ),

  img: ({ src, alt }: ImgHTMLAttributes<HTMLImageElement>) => (
    <motion.figure {...blockReveal} className="my-8">
      <ExpandableImage src={src || ""} alt={alt || ""} />
      {alt ? (
        <figcaption className="mt-2.5 text-center text-2xs leading-relaxed text-muted-foreground">
          {alt}
        </figcaption>
      ) : null}
    </motion.figure>
  ),

  a: ({
    children,
    href,
    className,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
    // MDX may pass icon/ext/data-icon as freeform attrs
    const ext = props as Record<string, unknown>;
    const iconProp = ext.icon ?? ext.ext ?? ext["data-icon"];
    const showIcon =
      iconProp !== undefined && iconProp !== false && iconProp !== "false";

    if (isExternal && href) {
      return (
        <LinkPreview
          href={href}
          previewType="auto"
          compact={false}
          className={cn("link inline-flex items-center gap-1", className)}
        >
          <span>{children}</span>
          {showIcon ? (
            <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
          ) : null}
        </LinkPreview>
      );
    }

    return (
      <a
        href={href}
        className={cn("link inline-flex items-center gap-1", className)}
        {...props}
      >
        <span>{children}</span>
      </a>
    );
  },

  hr: ({ className, ...props }: MDXComponentProps) => (
    <motion.hr
      {...blockReveal}
      className={cn("my-8 border-border", className)}
      {...props}
    />
  ),

  // GFM tables → shadcn Table (container already scrolls horizontally)
  table: ({
    children,
    className,
    ...props
  }: HTMLAttributes<HTMLTableElement>) => (
    <motion.div {...blockReveal} className="my-6">
      <Table className={cn("text-xs", className)} {...props}>
        {children}
      </Table>
    </motion.div>
  ),

  thead: ({
    children,
    className,
    ...props
  }: HTMLAttributes<HTMLTableSectionElement>) => (
    <TableHeader className={className} {...props}>
      {children}
    </TableHeader>
  ),

  tbody: ({
    children,
    className,
    ...props
  }: HTMLAttributes<HTMLTableSectionElement>) => (
    <TableBody className={className} {...props}>
      {children}
    </TableBody>
  ),

  tr: ({
    children,
    className,
    ...props
  }: HTMLAttributes<HTMLTableRowElement>) => (
    <TableRow className={className} {...props}>
      {children}
    </TableRow>
  ),

  th: ({
    children,
    className,
    ...props
  }: HTMLAttributes<HTMLTableCellElement>) => (
    <TableHead
      className={cn("h-10 text-xs font-medium", className)}
      {...props}
    >
      {children}
    </TableHead>
  ),

  td: ({
    children,
    className,
    ...props
  }: HTMLAttributes<HTMLTableCellElement>) => (
    <TableCell
      className={cn(
        "whitespace-normal text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </TableCell>
  ),

  strong: ({
    children,
    className,
    ...props
  }: HTMLAttributes<HTMLElement>) => (
    <strong
      className={cn("font-semibold text-foreground", className)}
      {...props}
    >
      {children}
    </strong>
  ),
};

/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from "react";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import { AdvancedCodeBlock } from "@/components/ui/code/advanced-code-block";
import type { CodeBlockLanguage } from "@/components/ui/code/advanced-code-block";
import { ExpandableImage } from "./ExpandableImage";
import { blockReveal } from "./reveal";

interface MDXComponentProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

// element map handed to MDXProvider — matches the design system
export const MDXComponents = {
  // Headings
  h1: ({ children, ...props }: MDXComponentProps) => (
    <motion.h1
      {...blockReveal}
      className="text-2xl font-bold text-foreground mb-6 mt-8 first:mt-0"
      {...props}
    >
      {children}
    </motion.h1>
  ),

  h2: ({ children, ...props }: MDXComponentProps) => (
    <motion.h2
      {...blockReveal}
      className="text-lg font-semibold text-foreground mb-4 mt-8 first:mt-0"
      {...props}
    >
      {children}
    </motion.h2>
  ),

  h3: ({ children, ...props }: MDXComponentProps) => (
    <motion.h3
      {...blockReveal}
      className="text-base font-medium text-foreground mb-3 mt-6"
      {...props}
    >
      {children}
    </motion.h3>
  ),

  // Paragraphs
  p: ({ children, ...props }: MDXComponentProps) => (
    <motion.p
      {...blockReveal}
      className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-3xl"
      {...props}
    >
      {children}
    </motion.p>
  ),

  // Lists — native markers so ordered lists keep their numbers
  ul: ({ children, ...props }: MDXComponentProps) => (
    <motion.ul
      {...blockReveal}
      className="list-disc marker:text-primary space-y-2 mb-4 ml-5"
      {...props}
    >
      {children}
    </motion.ul>
  ),

  ol: ({ children, ...props }: MDXComponentProps) => (
    <motion.ol
      {...blockReveal}
      className="list-decimal marker:text-primary space-y-2 mb-4 ml-5"
      {...props}
    >
      {children}
    </motion.ol>
  ),

  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className="text-sm text-muted-foreground leading-relaxed pl-1.5"
      {...props}
    >
      {children}
    </li>
  ),

  // Blockquotes
  blockquote: ({ children, ...props }: MDXComponentProps) => (
    <motion.blockquote
      {...blockReveal}
      className="border-l-4 border-primary/30 pl-4 italic text-sm text-muted-foreground mb-4"
      {...props}
    >
      {children}
    </motion.blockquote>
  ),

  // Code blocks
  pre: ({ children, ...props }: MDXComponentProps) => {
    // fenced code blocks carry the language on their inner <code>
    const codeElement = React.Children.toArray(
      children,
    )[0] as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;
    if (codeElement?.props?.className?.startsWith("language-")) {
      const language = codeElement.props.className.replace("language-", "");
      const code = codeElement.props.children;

      return (
        <AdvancedCodeBlock
          code={typeof code === "string" ? code : String(code)}
          lang={language as CodeBlockLanguage}
          {...props}
        />
      );
    }

    // Fallback for regular pre blocks
    return (
      <motion.pre
        {...blockReveal}
        className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto text-xs mb-4"
        {...props}
      >
        {children}
      </motion.pre>
    );
  },

  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono"
      {...props}
    >
      {children}
    </code>
  ),

  // Images - expandable on click
  img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <motion.div {...blockReveal} className="mb-6">
      <ExpandableImage
        src={src || ""}
        alt={alt || ""}
        className="w-full rounded-lg border border-border mb-2"
      />
      {alt && (
        <p className="text-xs text-muted-foreground italic text-center">
          {alt}
        </p>
      )}
    </motion.div>
  ),

  // Links
  a: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
    const extProps = props as Record<string, unknown>;
    const iconProp = extProps?.icon ?? extProps?.ext ?? extProps?.["data-icon"];
    const showIcon =
      iconProp === undefined
        ? false
        : iconProp !== false && iconProp !== "false";
    if (isExternal && href) {
      return (
        <LinkPreview
          href={href}
          previewType="auto"
          compact={false}
          className="link inline-flex items-center gap-1"
        >
          <span>{children}</span>
          {showIcon ? <ExternalLink className="w-3 h-3 opacity-60" /> : null}
        </LinkPreview>
      );
    }
    return (
      <a href={href} className="link inline-flex items-center gap-1" {...props}>
        <span>{children}</span>
      </a>
    );
  },

  // Horizontal rule
  hr: ({ ...props }: MDXComponentProps) => (
    <motion.hr {...blockReveal} className="border-border my-8" {...props} />
  ),

  // Tables
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <motion.div {...blockReveal} className="overflow-x-auto mb-6">
      <table
        className="w-full border-collapse border border-border text-xs"
        {...props}
      >
        {children}
      </table>
    </motion.div>
  ),

  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-border px-3 py-2 bg-muted/30 text-left font-medium"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border border-border px-3 py-2 text-muted-foreground"
      {...props}
    >
      {children}
    </td>
  ),
};

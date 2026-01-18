/**
 * TempMDXComponents - minimal MDX components without motion for temporary pages
 *
 * (c) 2025 Yanis Sebastian Zürcher
 */
import React from "react";
import { ExternalLink } from "lucide-react";
import { LinkPreview } from "@/components/ui/custom/link-preview";

interface MDXComponentProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export const TempMDXComponents = {
  h1: ({ children, ...props }: MDXComponentProps) => (
    <h1
      className="text-2xl font-bold text-foreground mb-6 mt-8 first:mt-0"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: MDXComponentProps) => (
    <h2
      className="text-lg font-semibold text-foreground mb-4 mt-8 first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: MDXComponentProps) => (
    <h3 className="text-base font-medium text-foreground mb-3 mt-6" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: MDXComponentProps) => (
    <p
      className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-3xl"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: MDXComponentProps) => (
    <ul className="space-y-2 mb-4 ml-4 list-disc" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: MDXComponentProps) => (
    <ol className="space-y-2 mb-4 ml-4 list-decimal" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-sm text-muted-foreground" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: MDXComponentProps) => (
    <blockquote
      className="border-l-4 border-primary/30 pl-4 italic text-sm text-muted-foreground mb-4"
      {...props}
    >
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }: MDXComponentProps) => (
    <pre
      className="bg-muted/50 border border-border/50 rounded-lg p-4 overflow-x-auto text-xs mb-4"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono"
      {...props}
    >
      {children}
    </code>
  ),
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <div className="mb-6">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg border border-border/50 mb-2"
        loading="lazy"
        {...props}
      />
      {alt && (
        <p className="text-xs text-muted-foreground italic text-center">
          {alt}
        </p>
      )}
    </div>
  ),
  a: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
    const anyProps = props as any;
    const iconProp = anyProps?.icon ?? anyProps?.ext ?? anyProps?.["data-icon"];
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
  hr: ({ ...props }: MDXComponentProps) => (
    <hr className="border-border/30 my-8" {...props} />
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-6">
      <table
        className="w-full border-collapse border border-border/50 text-xs"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-border/50 px-3 py-2 bg-muted/30 text-left font-medium"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border border-border/50 px-3 py-2 text-muted-foreground"
      {...props}
    >
      {children}
    </td>
  ),
};

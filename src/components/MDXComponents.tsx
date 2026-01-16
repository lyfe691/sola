/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React, { useState, useCallback } from "react";
import { ExternalLink, X } from "lucide-react";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import { motion, AnimatePresence } from "motion/react";
import { AdvancedCodeBlock } from "@/components/ui/code/advanced-code-block/advanced-code-block";

// image lightbox component for expandable images
const ImageLightbox: React.FC<{
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ src, alt, isOpen, onClose }) => {
  // close on escape key and lock scroll
  React.useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center bg-black/90 p-6 cursor-zoom-out overflow-hidden"
          onClick={onClose}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg cursor-zoom-out"
          />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-background hover:bg-muted text-foreground transition-colors shadow-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// reusable expandable image component
const ExpandableImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <motion.img
        src={src}
        alt={alt}
        className={`cursor-zoom-in ${className}`}
        loading="lazy"
        onClick={handleOpen}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <ImageLightbox src={src} alt={alt} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

// Custom components for MDX content that match the design system

interface MDXComponentProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export const MDXComponents = {
  // Headings
  h1: ({ children, ...props }: MDXComponentProps) => (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-2xl font-bold text-foreground mb-6 mt-8 first:mt-0"
      {...props}
    >
      {children}
    </motion.h1>
  ),

  h2: ({ children, ...props }: MDXComponentProps) => (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-lg font-semibold text-foreground mb-4 mt-8 first:mt-0"
      {...props}
    >
      {children}
    </motion.h2>
  ),

  h3: ({ children, ...props }: MDXComponentProps) => (
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-base font-medium text-foreground mb-3 mt-6"
      {...props}
    >
      {children}
    </motion.h3>
  ),

  // Paragraphs
  p: ({ children, ...props }: MDXComponentProps) => (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-3xl"
      {...props}
    >
      {children}
    </motion.p>
  ),

  // Lists
  ul: ({ children, ...props }: MDXComponentProps) => (
    <motion.ul
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-2 mb-4 ml-4"
      {...props}
    >
      {children}
    </motion.ul>
  ),

  ol: ({ children, ...props }: MDXComponentProps) => (
    <motion.ol
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-2 mb-4 ml-4 list-decimal"
      {...props}
    >
      {children}
    </motion.ol>
  ),

  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className="text-sm text-muted-foreground flex items-start gap-2"
      {...props}
    >
      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-2" />
      <span>{children}</span>
    </li>
  ),

  // Blockquotes
  blockquote: ({ children, ...props }: MDXComponentProps) => (
    <motion.blockquote
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-l-4 border-primary/30 pl-4 italic text-sm text-muted-foreground mb-4"
      {...props}
    >
      {children}
    </motion.blockquote>
  ),

  // Code blocks
  pre: ({ children, ...props }: MDXComponentProps) => {
    // Check if this is a code block with language info
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
          lang={
            language as
              | "typescript"
              | "javascript"
              | "html"
              | "css"
              | "json"
              | "bash"
          }
          {...props}
        />
      );
    }

    // Fallback for regular pre blocks
    return (
      <motion.pre
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-muted/50 border border-border/50 rounded-lg p-4 overflow-x-auto text-xs mb-4"
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6"
    >
      <ExpandableImage
        src={src || ""}
        alt={alt || ""}
        className="w-full rounded-lg border border-border/50 mb-2"
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

  // Horizontal rule
  hr: ({ ...props }: MDXComponentProps) => (
    <motion.hr
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.6 }}
      className="border-border/30 my-8"
      {...props}
    />
  ),

  // Tables
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="overflow-x-auto mb-6"
    >
      <table
        className="w-full border-collapse border border-border/50 text-xs"
        {...props}
      >
        {children}
      </table>
    </motion.div>
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

// Custom components for special project content
export const ProjectImage: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  size?: "normal" | "large" | "full";
}> = ({ src, alt, caption, className = "", size = "normal" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`mb-6 ${className} ${
      size === "large"
        ? "max-w-4xl mx-auto"
        : size === "full"
          ? "w-full"
          : "max-w-2xl mx-auto"
    }`}
  >
    <ExpandableImage
      src={src}
      alt={alt}
      className="w-full rounded-lg border border-border/50"
    />
    {caption && (
      <p className="text-xs text-muted-foreground italic text-center mt-2">
        {caption}
      </p>
    )}
  </motion.div>
);

export const ProjectGallery: React.FC<{
  images: Array<{ src: string; alt: string; caption?: string }>;
  columns?: 2 | 3 | 4;
  size?: "normal" | "large";
}> = ({ images, columns = 2, size = "normal" }) => {
  // For single image with large size, use special layout
  if (images.length === 1 && size === "large") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 max-w-4xl mx-auto"
      >
        <ExpandableImage
          src={images[0].src}
          alt={images[0].alt}
          className="w-full rounded-lg border border-border/50"
        />
        {images[0].caption && (
          <p className="text-xs text-muted-foreground italic text-center mt-2">
            {images[0].caption}
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`grid gap-4 mb-6 items-start ${
        columns === 2
          ? "sm:grid-cols-2"
          : columns === 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {images.map((image, index) => (
        <div key={index} className="space-y-2">
          <ExpandableImage
            src={image.src}
            alt={image.alt}
            className="w-full rounded-lg border border-border/50"
          />
          {image.caption && (
            <p className="text-xs text-muted-foreground italic">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export const TechStack: React.FC<{
  technologies: string[];
}> = ({ technologies }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex flex-wrap gap-2.5 mb-6"
  >
    {technologies.map((tech) => (
      <span
        key={tech}
        className="px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 
                 text-xs rounded-lg font-medium transition-all duration-200
                 hover:bg-primary/10 hover:border-primary/30"
      >
        {tech}
      </span>
    ))}
  </motion.div>
);

export const CodeBlock: React.FC<{
  code: string;
  fileName?: string;
  lang?: string;
  theme?: string;
}> = ({ code, fileName, lang = "typescript", theme }) => (
  <AdvancedCodeBlock
    code={code}
    fileName={fileName}
    lang={
      lang as "typescript" | "javascript" | "html" | "css" | "json" | "bash"
    }
    theme={theme as "github-light" | "github-dark"}
  />
);

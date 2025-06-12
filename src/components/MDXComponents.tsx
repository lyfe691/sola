/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import React from 'react';
import { motion } from 'motion/react';
import { AdvancedCodeBlock } from '@/components/ui/code/advanced-code-block/advanced-code-block';

// Custom components for MDX content that match the design system

export const MDXComponents = {
  // Headings
  h1: ({ children, ...props }: any) => (
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
  
  h2: ({ children, ...props }: any) => (
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
  
  h3: ({ children, ...props }: any) => (
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
  p: ({ children, ...props }: any) => (
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
  ul: ({ children, ...props }: any) => (
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
  
  ol: ({ children, ...props }: any) => (
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
    <li className="text-sm text-muted-foreground flex items-start gap-2" {...props}>
      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-2" />
      <span>{children}</span>
    </li>
  ),
  
  // Blockquotes
  blockquote: ({ children, ...props }: any) => (
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
  pre: ({ children, ...props }: any) => {
    // Check if this is a code block with language info
    const codeElement = React.Children.toArray(children)[0] as any;
    if (codeElement?.props?.className?.startsWith('language-')) {
      const language = codeElement.props.className.replace('language-', '');
      const code = codeElement.props.children;
      
      return (
        <AdvancedCodeBlock
          code={typeof code === 'string' ? code : String(code)}
          lang={language as any}
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
  
  // Images
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6"
    >
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
    </motion.div>
  ),
  
  // Links
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a 
      href={href}
      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  
  // Horizontal rule
  hr: ({ ...props }: any) => (
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
      <table className="w-full border-collapse border border-border/50 text-xs" {...props}>
        {children}
      </table>
    </motion.div>
  ),
  
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border border-border/50 px-3 py-2 bg-muted/30 text-left font-medium" {...props}>
      {children}
    </th>
  ),
  
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-border/50 px-3 py-2 text-muted-foreground" {...props}>
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
  size?: 'normal' | 'large' | 'full';
}> = ({ src, alt, caption, className = "", size = 'normal' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`mb-6 ${className} ${
      size === 'large' ? 'max-w-4xl mx-auto' : 
      size === 'full' ? 'w-full' : 
      'max-w-2xl mx-auto'
    }`}
  >
    <img 
      src={src} 
      alt={alt}
      className="w-full rounded-lg border border-border/50"
      loading="lazy"
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
  size?: 'normal' | 'large';
}> = ({ images, columns = 2, size = 'normal' }) => {
  // For single image with large size, use special layout
  if (images.length === 1 && size === 'large') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 max-w-4xl mx-auto"
      >
        <img 
          src={images[0].src} 
          alt={images[0].alt}
          className="w-full rounded-lg border border-border/50"
          loading="lazy"
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
      className={`grid gap-4 mb-6 ${
        columns === 2 ? 'sm:grid-cols-2' : 
        columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 
        'sm:grid-cols-2 lg:grid-cols-4'
      }`}
    >
      {images.map((image, index) => (
        <div key={index} className="space-y-2">
          <img 
            src={image.src} 
            alt={image.alt}
            className="w-full rounded-lg border border-border/50"
            loading="lazy"
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
    lang={lang as any}
    theme={theme as any}
  />
); 
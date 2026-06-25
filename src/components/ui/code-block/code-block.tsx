/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { motion } from "motion/react";
import { useTheme } from "@/components/theme-provider";
import { getThemeType } from "@/config/themes";
import { scrollSubtleVariants } from "@/utils/transitions";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { useShikiHighlight, type CodeBlockLanguage } from "./use-shiki";

interface CodeBlockProps {
  code: string;
  lang?: CodeBlockLanguage;
  /** Optional filename label rendered as a quiet header above the code. */
  fileName?: string;
  className?: string;
}

/**
 * Plain-text fallback that mirrors Shiki's `pre.shiki > code > span.line` markup,
 * so line numbers and layout stay identical before highlighting resolves.
 */
const FallbackCode = ({ code }: { code: string }) => (
  <pre className="shiki">
    <code>
      {code.split("\n").map((line, i) => (
        <span key={i} className="line">
          {line}
        </span>
      ))}
    </code>
  </pre>
);

/**
 * Syntax-highlighted code block: line-numbered, themed via design tokens, with a
 * copy button that appears top-right on hover. Highlighting is theme-independent
 * (dual light/dark); the resolved light/dark type only flips a CSS variable set.
 */
export const CodeBlock = ({
  code,
  lang = "typescript",
  fileName,
  className,
}: CodeBlockProps) => {
  const { theme } = useTheme();
  const codeTheme = getThemeType(theme);
  const value = code.replace(/\n+$/, "");
  const html = useShikiHighlight(value, lang);

  return (
    <motion.figure
      data-code-theme={codeTheme}
      variants={scrollSubtleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn(
        "code-block group relative my-6 overflow-hidden rounded-xl bg-muted/40 text-sm ring-1 ring-border",
        className,
      )}
    >
      {fileName ? (
        // filename present → header row with the copy button laid out inside it
        <figcaption className="flex items-center justify-between gap-2 border-b border-border py-1.5 pl-4 pr-2 font-mono text-xs text-muted-foreground">
          <span className="truncate">{fileName}</span>
          <CopyButton value={value} />
        </figcaption>
      ) : (
        // no header → quiet copy button floats in the corner
        <CopyButton value={value} className="absolute right-2.5 top-2.5" />
      )}

      <div className="overflow-x-auto py-4">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <FallbackCode code={value} />
        )}
      </div>
    </motion.figure>
  );
};

export default CodeBlock;

/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { ComponentType, SVGProps } from "react";
import { FileCode2, Terminal } from "lucide-react";
import {
  SiDocker,
  SiJavascript,
  SiJson,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import { useTheme } from "@/components/theme-provider";
import { getThemeType } from "@/config/themes";
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

/* The shadcn-docs header touch: a small language mark next to the filename.
   Only the languages the articles actually speak get a brand icon; shells
   share the terminal glyph and everything else falls back to a file mark. */
const LANGUAGE_ICONS: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  typescript: SiTypescript,
  ts: SiTypescript,
  tsx: SiReact,
  jsx: SiReact,
  javascript: SiJavascript,
  js: SiJavascript,
  json: SiJson,
  docker: SiDocker,
  dockerfile: SiDocker,
  bash: Terminal,
  sh: Terminal,
  shell: Terminal,
  zsh: Terminal,
  console: Terminal,
  powershell: Terminal,
};

const LanguageIcon = ({ lang }: { lang: string }) => {
  const Icon = LANGUAGE_ICONS[lang] ?? FileCode2;
  return <Icon aria-hidden className="size-3.5 shrink-0 opacity-70" />;
};

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
 * Syntax-highlighted code block in the shadcn-docs grammar: --code surface,
 * filename header with a language mark, sticky line numbers, scrollbarless
 * horizontal scroll, and a copy button that appears top-right on hover.
 * Highlighting is theme-independent (dual light/dark); the resolved
 * light/dark type only flips a CSS variable set.
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
    <figure
      data-code-theme={codeTheme}
      className={cn(
        "code-block group relative my-6 overflow-hidden rounded-xl bg-(--code) text-sm ring-1 ring-border",
        className,
      )}
    >
      {fileName ? (
        // filename present → header row with the copy button laid out inside it
        <figcaption className="flex items-center gap-2 border-b border-border py-1.5 pl-4 pr-2 font-mono text-xs text-(--code-foreground)">
          <LanguageIcon lang={lang} />
          <span className="truncate">{fileName}</span>
          <CopyButton value={value} className="ml-auto" />
        </figcaption>
      ) : (
        // no header → quiet copy button floats in the corner
        <CopyButton value={value} className="absolute right-2.5 top-2.5" />
      )}

      <div className="overflow-x-auto overscroll-x-contain py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <FallbackCode code={value} />
        )}
      </div>
    </figure>
  );
};

export default CodeBlock;

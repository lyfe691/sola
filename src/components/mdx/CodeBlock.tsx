/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  TextWrapIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  CodeBlock as CodeBlockRoot,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import { TechFileMark } from "@/components/ui/custom/tech-file-mark";
import { toast } from "@/components/ui/toast";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { useTranslation } from "@/lib/language-provider";
import { linesIn } from "./code-lines";

const COPIED_MS = 2000;

/** shadcn's CodeBlockCopyButton, in the reader's language */
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      toast.add({ type: "error", title: t.common.copyFailed });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={copied ? t.common.copied : t.common.copyCode}
        onClick={onCopy}
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          strokeWidth={2}
        />
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? t.common.copied : ""}
      </span>
    </>
  );
}

/**
 * A deep dive's code: shadcn's code block, highlighted once shiki has
 * loaded (plain lines until then, laid out the same), with the file's
 * language mark in its header. Without a file name the actions float in
 * the corner. A block whose lines run past its edge offers to wrap them.
 */
export function CodeBlock({
  code,
  lang = "typescript",
  fileName,
  highlight,
}: {
  code: string;
  lang?: string;
  fileName?: string;
  /** the lines the prose beside it is about: "11,15,29", "8-10" */
  highlight?: string;
}) {
  const t = useTranslation();
  const value = code.replace(/\n+$/, "");
  const lines = useHighlightedCode(value, lang);
  const highlighted = linesIn(highlight);
  const [wrap, setWrap] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const content = useRef<HTMLPreElement>(null);

  // measured unwrapped only: wrapped, nothing overflows, and the toggle
  // has to stay to unwrap
  useEffect(() => {
    const pre = content.current;
    if (!pre) return;
    const measure = () => {
      if (pre.dataset.wrap !== undefined) return;
      setOverflows(pre.scrollWidth > pre.clientWidth + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pre);
    if (pre.firstElementChild) observer.observe(pre.firstElementChild);
    return () => observer.disconnect();
  }, []);

  const actions = (
    <CodeBlockActions>
      {overflows ? (
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={t.common.wrapLines}
          aria-pressed={wrap}
          // eslint-disable-next-line shadcn/no-restyle -- pressed, the toggle takes the title's colour, as in shadcn's actions example
          className="aria-pressed:text-foreground"
          onClick={() => setWrap(!wrap)}
        >
          <HugeiconsIcon icon={TextWrapIcon} strokeWidth={2} />
        </Button>
      ) : null}
      <CopyButton value={value} />
    </CodeBlockActions>
  );

  return (
    <CodeBlockRoot className="my-6">
      {fileName ? (
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TechFileMark filename={fileName} lang={lang} size={16} />
            {fileName}
          </CodeBlockTitle>
          {actions}
        </CodeBlockHeader>
      ) : (
        actions
      )}
      <CodeBlockContent ref={content} lineNumbers wrap={wrap}>
        {lines.map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={highlighted.has(index + 1) ? "highlighted" : "default"}
          >
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlockRoot>
  );
}

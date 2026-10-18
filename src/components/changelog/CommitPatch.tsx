/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import type { ThemedTokenWithVariants } from "shiki";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Morph } from "@/components/Morph";
import { Button } from "@/components/ui/button";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import { TechFileMark } from "@/components/ui/custom/tech-file-mark";
import type { DiffLine } from "@/components/deploy-diff/parse-patch";
import { useCappedDiff } from "@/components/deploy-diff/use-diff-highlight";
import type { ChangelogFile } from "@/lib/github-commits";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";

const VARIANT = {
  add: "added",
  del: "removed",
  context: "default",
  meta: "default",
} as const;

/** a line's tokens in both themes' colours, as the deep dives' blocks
 *  paint theirs */
function Tokens({
  line,
  tokens,
}: {
  line: DiffLine;
  tokens?: ThemedTokenWithVariants[];
}) {
  if (line.type === "meta") {
    return <span className="text-muted-foreground italic">{line.text}</span>;
  }
  if (!tokens) return line.text;
  return tokens.map((token, i) => (
    <span
      key={i}
      className="text-(--shiki-light) dark:text-(--shiki-dark)"
      style={
        {
          "--shiki-light": token.variants.light?.color,
          "--shiki-dark": token.variants.dark?.color,
        } as CSSProperties
      }
    >
      {token.content}
    </span>
  ));
}

/** One file's patch: shadcn's code block, its lines marked added and
 *  removed and wrapping. A long one opens on a preview with Show more
 *  (shadcn's pattern with a max height): opened, it scrolls inside its cap. */
export function CommitPatch({ file }: { file: ChangelogFile }) {
  const t = useTranslation().changelog;
  const { rows, lineTokens, truncated } = useCappedDiff(
    file.patch,
    file.filename,
  );
  const [expanded, setExpanded] = useState(false);
  const [long, setLong] = useState(false);
  const content = useRef<HTMLPreElement>(null);
  const contentId = useId();

  // measured collapsed only: opened, it may fit its taller cap
  useEffect(() => {
    const pre = content.current;
    if (!pre) return;
    const measure = () => {
      if (pre.dataset.expanded !== undefined) return;
      setLong(pre.scrollHeight > pre.clientHeight + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pre);
    if (pre.firstElementChild) observer.observe(pre.firstElementChild);
    return () => observer.disconnect();
  }, []);

  if (rows.length === 0) {
    return (
      <p className="font-mono text-xs text-muted-foreground">
        {file.filename} — {t.unavailable}
      </p>
    );
  }

  const toggle = () => {
    // closed, the preview starts at the top again
    if (expanded && content.current) content.current.scrollTop = 0;
    setExpanded(!expanded);
  };

  return (
    <CodeBlock
      size="sm"
      // eslint-disable-next-line shadcn/no-restyle -- the block's own focus ring, for content its Morph has taken out of the direct children it looks at
      className="has-[[data-slot=code-block-content]:focus-visible]:ring-3 has-[[data-slot=code-block-content]:focus-visible]:ring-ring/30"
    >
      <CodeBlockHeader>
        <CodeBlockTitle>
          <TechFileMark filename={file.filename} size={14} />
          {file.filename}
        </CodeBlockTitle>
      </CodeBlockHeader>
      <Morph>
        <CodeBlockContent
          ref={content}
          id={contentId}
          wrap
          data-expanded={expanded || undefined}
          className={cn(
            // eslint-disable-next-line shadcn/no-restyle -- shadcn's show-more pattern: a preview, then a cap the patch scrolls inside, its edges fading
            "scroll-fade-y",
            expanded ? "max-h-[min(32rem,70vh)]" : "max-h-64 overflow-y-hidden",
          )}
        >
          {rows.map((row) =>
            row.kind === "hunk" ? (
              <CodeBlockLine key={row.key}>
                <span className="text-muted-foreground">{row.text}</span>
              </CodeBlockLine>
            ) : (
              <CodeBlockLine key={row.key} variant={VARIANT[row.line.type]}>
                <Tokens line={row.line} tokens={lineTokens?.get(row.line)} />
              </CodeBlockLine>
            ),
          )}
          {truncated ? (
            <CodeBlockLine>
              <span className="text-muted-foreground italic">
                {t.truncated}
              </span>
            </CodeBlockLine>
          ) : null}
        </CodeBlockContent>
      </Morph>
      {long ? (
        <CodeBlockFooter className="justify-center">
          <Button
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={contentId}
            onClick={toggle}
          >
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="transition-transform in-aria-expanded:rotate-180"
            />
            {expanded ? t.showLess : t.showMore}
          </Button>
        </CodeBlockFooter>
      ) : null}
    </CodeBlock>
  );
}

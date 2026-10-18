/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { CSSProperties } from "react";
import type { ThemedTokenWithVariants } from "shiki";
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
 *  removed, wrapping inside a capped height that scrolls. */
export function CommitPatch({ file }: { file: ChangelogFile }) {
  const t = useTranslation().changelog;
  const { rows, lineTokens, truncated } = useCappedDiff(
    file.patch,
    file.filename,
  );

  if (rows.length === 0) {
    return (
      <p className="font-mono text-xs text-muted-foreground">
        {file.filename} — {t.unavailable}
      </p>
    );
  }

  return (
    <CodeBlock size="sm">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <TechFileMark filename={file.filename} size={14} />
          {file.filename}
        </CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent
        wrap
        // eslint-disable-next-line shadcn/no-restyle -- shadcn's height pattern: a long patch scrolls inside the block, its edges fading
        className="max-h-[min(32rem,70vh)] scroll-fade-y"
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
      </CodeBlockContent>
      {truncated ? (
        <CodeBlockFooter>
          <span className="italic">{t.truncated}</span>
        </CodeBlockFooter>
      ) : null}
    </CodeBlock>
  );
}

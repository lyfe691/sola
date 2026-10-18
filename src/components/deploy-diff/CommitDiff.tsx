/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The diff renderer: a file rail beside per-file sections with sticky
 * headers that open and close, hunk rows and numbered +/- lines in the
 * line language of the site's code blocks. The current page's files are
 * open; the rest of the commit waits behind its headers.
 */

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { ThemedTokenWithVariants } from "shiki";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileTree } from "@/components/changelog/FileTree";
import { Morph } from "@/components/Morph";
import { fileTree } from "@/lib/github-commits";
import { cn } from "@/lib/utils";
import type { Translation } from "@/lib/translations";
import { scrollToTarget, snapScrollTo } from "@/utils/scroll";
import type { DiffLine } from "./parse-patch";
import { useCappedDiff } from "./use-diff-highlight";
import {
  matchesScope,
  type PageCommit,
  type PageCommitFile,
} from "./use-page-diff";

export type DiffStrings = Translation["common"]["diff"];

// caps keep a giant commit from stalling the render; the page's GitHub link
// always offers the full diff
const MAX_FILES = 40;
const MAX_ROWS_PER_FILE = 400;

// a file is the one being read once its header has reached this far down
// the viewport
const READING_LINE = 96;

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  added: { label: "A", className: "text-(--diff-add-fg)" },
  removed: { label: "D", className: "text-(--diff-del-fg)" },
  modified: { label: "M", className: "text-(--diff-mod-fg)" },
  renamed: { label: "R", className: "text-(--diff-ren-fg)" },
  copied: { label: "C", className: "text-(--diff-ren-fg)" },
};

function DiffLineRow({
  line,
  tokens,
}: {
  line: DiffLine;
  tokens?: ThemedTokenWithVariants[];
}) {
  if (line.type === "meta") {
    return (
      <tr>
        <td className="hidden w-10 min-w-10 select-none sm:table-cell" />
        <td className="w-10 min-w-10 select-none" />
        <td className="w-full -indent-4 pr-4 pl-4 whitespace-pre-wrap text-muted-foreground italic">
          <span className="inline-block w-4 select-none" />
          {line.text}
        </td>
      </tr>
    );
  }

  const number =
    "w-10 min-w-10 px-2 text-right align-top tabular-nums text-muted-foreground/60 select-none";

  return (
    <tr
      className={cn(
        line.type === "add" && "bg-foreground/5",
        line.type === "del" && "bg-destructive/10",
      )}
    >
      <td className={cn(number, "hidden sm:table-cell")}>{line.oldNo}</td>
      <td className={number}>{line.newNo}</td>
      <td className="w-full -indent-4 pr-4 pl-4 align-top wrap-break-word whitespace-pre-wrap">
        <span
          className={cn(
            "inline-block w-4 select-none",
            line.type === "add" && "text-muted-foreground",
            line.type === "del" && "text-destructive",
          )}
        >
          {line.type === "add" ? "+" : line.type === "del" ? "−" : ""}
        </span>
        {tokens
          ? tokens.map((token, i) => (
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
            ))
          : line.text}
      </td>
    </tr>
  );
}

/** an open file's lines: tokenized only once the file is opened */
function FileBody({ file, t }: { file: PageCommitFile; t: DiffStrings }) {
  const { rows, lineTokens, truncated } = useCappedDiff(
    file.patch,
    file.filename,
    MAX_ROWS_PER_FILE,
  );
  const hasChanges = file.additions > 0 || file.deletions > 0;

  if (rows.length === 0) {
    // binary or oversized diff: GitHub omits the patch (pure renames
    // legitimately have none, so stay quiet for those)
    return hasChanges ? (
      <p className="px-4 py-2.5 font-mono text-xs text-muted-foreground/70 italic">
        {t.unavailable}
      </p>
    ) : null;
  }

  return (
    <table className="w-full border-separate border-spacing-0 font-mono text-xs leading-5">
      <caption className="sr-only">{file.filename}</caption>
      <tbody>
        {rows.map((row) =>
          row.kind === "hunk" ? (
            <tr key={row.key}>
              <td
                colSpan={3}
                className="bg-muted/40 px-4 py-1.5 text-2xs wrap-break-word whitespace-pre-wrap text-muted-foreground/70 select-none"
              >
                {row.text}
              </td>
            </tr>
          ) : (
            <DiffLineRow
              key={row.key}
              line={row.line}
              tokens={lineTokens?.get(row.line)}
            />
          ),
        )}
        {truncated && (
          <tr>
            <td
              colSpan={3}
              className="px-4 py-2 text-2xs text-muted-foreground/70 italic"
            >
              {t.truncated}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function FileSection({
  file,
  open,
  onToggle,
  t,
  sectionRef,
}: {
  file: PageCommitFile;
  open: boolean;
  onToggle: () => void;
  t: DiffStrings;
  sectionRef: (el: HTMLElement | null) => void;
}) {
  const bodyId = useId();
  const badge = STATUS_BADGE[file.status] ?? STATUS_BADGE.modified;

  return (
    <section
      ref={sectionRef}
      className="border-t border-border/60 first:border-t-0"
    >
      {/* right padding clears the exit bubble, so the +/- counts never
          sit under it while the header is stuck */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={onToggle}
        className={cn(
          "sticky top-0 z-10 flex w-full items-center gap-2 bg-background/95 py-2 pl-5 pr-20 text-left font-mono text-xs backdrop-blur-sm transition-colors duration-150 sm:pl-8 sm:pr-24",
          "can-hover:hover:bg-muted/70",
          open && "border-b border-border/60",
        )}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-90",
          )}
        />
        <span className={cn("w-3 shrink-0 font-semibold", badge.className)}>
          {badge.label}
        </span>
        <span className="min-w-0 flex-1 truncate" title={file.filename}>
          {file.previousFilename
            ? `${file.previousFilename} → ${file.filename}`
            : file.filename}
        </span>
        {file.additions > 0 && (
          <span className="shrink-0 text-(--diff-add-fg)">
            +{file.additions}
          </span>
        )}
        {file.deletions > 0 && (
          <span className="shrink-0 text-(--diff-del-fg)">
            −{file.deletions}
          </span>
        )}
      </button>

      <Morph face={open ? "open" : "closed"}>
        {open ? (
          <div id={bodyId}>
            <FileBody file={file} t={t} />
          </div>
        ) : null}
      </Morph>
    </section>
  );
}

export function CommitDiff({
  commit,
  pagePath,
  t,
}: {
  commit: PageCommit;
  pagePath: string | null;
  t: DiffStrings;
}) {
  const files = useMemo(() => commit.files.slice(0, MAX_FILES), [commit]);
  const hiddenCount = commit.files.length - files.length;
  const tree = useMemo(() => fileTree(files), [files]);

  // this page's files are open; a commit with none of them (a site-wide
  // one) opens its first
  const [open, setOpen] = useState(() => {
    const own = pagePath
      ? files.filter((file) => matchesScope(file, pagePath))
      : [];
    return new Set(
      (own.length ? own : files.slice(0, 1)).map((f) => f.filename),
    );
  });

  const sections = useRef(new Map<string, HTMLElement>());
  const [reading, setReading] = useState(files[0]?.filename ?? null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let at = files[0]?.filename ?? null;
      for (const file of files) {
        const section = sections.current.get(file.filename);
        if (section && section.getBoundingClientRect().top <= READING_LINE) {
          at = file.filename;
        }
      }
      setReading(at);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [files]);

  const toggle = (filename: string) => {
    const section = sections.current.get(filename);
    if (open.has(filename) && section) {
      // closing a file read from inside: its header comes back to the top
      // first, so what follows it slides up under the reader instead of
      // the page jumping on past it
      const top = section.getBoundingClientRect().top;
      if (top < 0) snapScrollTo(window.scrollY + top);
    }
    setOpen((now) => {
      const next = new Set(now);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });
  };

  const jump = (filename: string) => {
    setOpen((now) => (now.has(filename) ? now : new Set(now).add(filename)));
    const section = sections.current.get(filename);
    if (section) scrollToTarget(section);
  };

  return (
    <div className="flex">
      <aside className="hidden w-72 shrink-0 border-r border-border/60 lg:block">
        <nav
          aria-label={t.filesNav}
          data-lenis-prevent
          className="sticky top-0 max-h-svh overflow-y-auto overscroll-contain px-4 py-4"
        >
          <FileTree nodes={tree} selected={reading} onSelect={jump} />
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        {files.map((file) => (
          <FileSection
            key={file.filename}
            file={file}
            open={open.has(file.filename)}
            onToggle={() => toggle(file.filename)}
            t={t}
            sectionRef={(el) => {
              if (el) sections.current.set(file.filename, el);
              else sections.current.delete(file.filename);
            }}
          />
        ))}
        {hiddenCount > 0 && (
          <p className="border-t border-border/60 px-4 py-2.5 font-mono text-xs text-muted-foreground/70 italic">
            {t.truncated}
          </p>
        )}
      </div>
    </div>
  );
}

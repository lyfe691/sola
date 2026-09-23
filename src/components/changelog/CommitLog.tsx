/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommitDetail } from "@/components/changelog/CommitDetail";
import { CommitRail, railWidth } from "@/components/changelog/CommitRail";
import {
  CommitStats,
  ScopeChip,
  TypeChip,
} from "@/components/changelog/CommitMeta";
import { Reveal } from "@/components/Reveal";
import { DIFF_TOKENS } from "@/components/deploy-diff/diff-tokens";
import { DEPLOY_LABEL } from "@/components/deploy-diff/use-page-diff";
import { useIsDarkScheme } from "@/components/deploy-diff/use-scheme";
import { commitGraph, type GraphRow } from "@/lib/commit-graph";
import {
  commitDetailQuery,
  commitHeadline,
  detailStats,
  type ChangelogCommit,
} from "@/lib/github-commits";
import { INTL_LOCALE } from "@/lib/dates";
import { useLanguage, useTranslation } from "@/lib/language-provider";
import type { Translation } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { scrollToTarget } from "@/utils/scroll";

type Copy = Translation["changelog"];

const SKELETON_SUBJECTS = [
  "w-[68%]",
  "w-[52%]",
  "w-[77%]",
  "w-[61%]",
  "w-[44%]",
  "w-[73%]",
  "w-[57%]",
  "w-[65%]",
];

function matchesDeploy(sha: string): boolean {
  return DEPLOY_LABEL !== "main" && sha.startsWith(DEPLOY_LABEL);
}

function shaFromHash(commits: ChangelogCommit[], hash: string): string | null {
  const needle = hash.replace(/^#/, "").toLowerCase();
  if (!needle) return null;
  return (
    commits.find((c) => c.sha.startsWith(needle) || c.shortSha === needle)
      ?.sha ?? null
  );
}

/** Update the fragment without asking the router — hash navigations scroll. */
function writeHash(shortSha: string | null) {
  const { pathname, search, hash } = window.location;
  const next = shortSha
    ? `${pathname}${search}#${shortSha}`
    : `${pathname}${search}`;
  if (`${pathname}${search}${hash}` === next) return;
  window.history.replaceState(window.history.state, "", next);
}

export function CommitLogSkeleton() {
  return (
    <ol aria-hidden="true" className="relative">
      <span className="absolute inset-y-0 left-[6.25px] w-[1.5px] bg-foreground/10 mask-b-from-50%" />
      {SKELETON_SUBJECTS.map((width, i) => (
        <li key={i} className="relative pl-[18px]">
          <span className="absolute top-[18.5px] left-[3.5px] size-[7px] animate-pulse rounded-full bg-foreground/15" />
          <div className="space-y-2 px-3 py-3.5">
            <span
              className={cn(
                "block h-3 animate-pulse rounded-sm bg-foreground/8",
                width,
              )}
            />
            <span className="block h-2.5 w-28 animate-pulse rounded-sm bg-foreground/6" />
          </div>
        </li>
      ))}
    </ol>
  );
}

function CommitRow({
  commit,
  graph,
  lanes,
  isLast,
  isOpen,
  isPending,
  mounted,
  live,
  date,
  t,
  onToggle,
  onPrefetch,
}: {
  commit: ChangelogCommit;
  graph: GraphRow;
  lanes: number;
  isLast: boolean;
  isOpen: boolean;
  isPending: boolean;
  mounted: boolean;
  live: boolean;
  date: string;
  t: Copy;
  onToggle: (sha: string) => void;
  onPrefetch: (sha: string) => void;
}) {
  const panelId = `commit-${commit.shortSha}`;
  const headline = commitHeadline(commit);

  return (
    <li
      className="group/row relative min-w-0"
      style={{ paddingLeft: railWidth(lanes) + 2 }}
    >
      {/* the rail stays out of the reveal and only fades with it: rows rise
          a beat apart, and a rail that rose with them would tear at every
          row boundary */}
      <CommitRail
        row={graph}
        lanes={lanes}
        merge={headline.pr !== undefined}
        live={live}
        pending={isPending}
        fadeOut={isLast && graph.outgoing}
        className="transition-opacity duration-(--reveal-duration) ease-smooth group-has-[[data-reveal]:not([data-revealed])]/row:opacity-0"
      />
      <Reveal className="min-w-0">
        <button
          type="button"
          onClick={() => onToggle(commit.sha)}
          onPointerEnter={() => onPrefetch(commit.sha)}
          onFocus={() => onPrefetch(commit.sha)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-busy={isPending || undefined}
          className={cn(
            "flex w-full min-w-0 cursor-pointer flex-col gap-1.5 rounded-xl px-3 py-2.5 text-left touch-manipulation select-none",
            "transition-[background-color,scale] duration-200 ease-out active:scale-[0.99]",
            "can-hover:hover:bg-muted/50",
            isOpen && "bg-muted/40",
          )}
        >
          <span className="sr-only">{isOpen ? t.collapse : t.expand}</span>
          <span className="flex min-w-0 items-baseline gap-3">
            <span className="min-w-0 flex-1 text-[15px] leading-6 text-foreground">
              {headline.pr !== undefined ? (
                <span className="mr-2 font-mono text-xs text-primary">
                  {t.pr.replace("{number}", String(headline.pr))}
                </span>
              ) : null}
              {headline.text}
            </span>
            <span className="hidden shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground sm:inline">
              {date}
            </span>
          </span>
          <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
            {headline.type ? <TypeChip type={headline.type} /> : null}
            {headline.scope ? <ScopeChip scope={headline.scope} /> : null}
            <span className="font-mono text-[11px] text-muted-foreground">
              {commit.shortSha}
              <span className="sm:hidden"> · {date}</span>
            </span>
            {live ? (
              <span className="font-mono text-[11px] text-primary">
                {t.thisDeploy}
              </span>
            ) : null}
            {commit.stats ? (
              <CommitStats stats={commit.stats} className="sm:ml-auto" />
            ) : null}
          </span>
        </button>
        <div
          className={cn(
            "grid min-w-0 transition-[grid-template-rows,opacity] duration-500 ease-out-quart motion-reduce:transition-none",
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0 min-w-0 overflow-hidden">
            <div
              id={panelId}
              role="region"
              aria-label={headline.text}
              aria-hidden={!isOpen}
              inert={!isOpen}
              className="min-w-0 pt-2 pb-6 pl-3"
            >
              {mounted ? (
                <CommitDetail
                  sha={commit.sha}
                  lead={headline.pr !== undefined ? headline.text : undefined}
                />
              ) : null}
            </div>
          </div>
        </div>
      </Reveal>
    </li>
  );
}

export function CommitLog({ commits }: { commits: ChangelogCommit[] }) {
  const { language } = useLanguage();
  const t = useTranslation().changelog;
  const isDark = useIsDarkScheme();
  const queryClient = useQueryClient();
  const gen = useRef(0);
  const scrolledHash = useRef<string | null>(null);
  const [picked, setPicked] = useState<string | null | "hash">("hash");
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const [pending, setPending] = useState<string | null>(null);

  const needle = window.location.hash.replace(/^#/, "").toLowerCase();
  const fromList = shaFromHash(commits, needle);
  const pin = useQuery({
    ...commitDetailQuery(needle),
    enabled: picked === "hash" && /^[0-9a-f]{7,40}$/.test(needle) && !fromList,
  });
  const pinned =
    pin.data &&
    (pin.data.sha.startsWith(needle) || pin.data.shortSha === needle)
      ? pin.data
      : null;
  const fromHash = fromList ?? pinned?.sha ?? null;
  const open = picked === "hash" ? fromHash : picked;
  const rows =
    pinned && !fromList
      ? [
          { ...pinned, stats: detailStats(pinned) },
          ...commits.filter((commit) => commit.sha !== pinned.sha),
        ]
      : commits;

  useEffect(() => {
    if (!fromHash || picked !== "hash" || scrolledHash.current === fromHash) {
      return;
    }
    const el = document.getElementById(`commit-${fromHash.slice(0, 7)}`);
    if (!el) return;
    scrolledHash.current = fromHash;
    requestAnimationFrame(() => scrollToTarget(el, { offset: -96 }));
  }, [fromHash, picked]);

  const prefetch = (sha: string) => {
    void queryClient.prefetchQuery(commitDetailQuery(sha));
  };

  const reveal = (sha: string) => {
    const short = rows.find((c) => c.sha === sha)?.shortSha ?? sha.slice(0, 7);
    setOpened((prev) => new Set(prev).add(sha));
    setPicked(sha);
    writeHash(short);
  };

  const toggle = (sha: string) => {
    if (open === sha) {
      gen.current += 1;
      setPending(null);
      setPicked(null);
      writeHash(null);
      return;
    }
    if (pending === sha) return;

    if (queryClient.getQueryData(commitDetailQuery(sha).queryKey)) {
      gen.current += 1;
      setPending(null);
      reveal(sha);
      return;
    }

    const id = ++gen.current;
    setPending(sha);
    void queryClient
      .ensureQueryData(commitDetailQuery(sha))
      .catch(() => undefined)
      .then(() => {
        if (id !== gen.current) return;
        setPending(null);
        reveal(sha);
      });
  };

  const formatDate = (iso: string) =>
    iso
      ? new Intl.DateTimeFormat(INTL_LOCALE[language], {
          month: "short",
          day: "numeric",
        }).format(new Date(iso))
      : "";

  // a commit pinned from the URL sits outside the loaded history, so it
  // stands alone instead of drawing a lane down the whole list
  const graph = commitGraph(
    rows.map((commit) =>
      commit.sha === pinned?.sha && !fromList
        ? { sha: commit.sha, parents: [] }
        : commit,
    ),
  );

  return (
    <ol className="min-w-0" style={DIFF_TOKENS[isDark ? "dark" : "light"]}>
      {rows.map((commit, i) => (
        <CommitRow
          key={commit.sha}
          commit={commit}
          graph={graph.rows[i]}
          lanes={graph.lanes}
          isLast={i === rows.length - 1}
          isOpen={open === commit.sha}
          isPending={pending === commit.sha}
          mounted={opened.has(commit.sha) || open === commit.sha}
          live={matchesDeploy(commit.sha)}
          date={formatDate(commit.date)}
          t={t}
          onToggle={toggle}
          onPrefetch={prefetch}
        />
      ))}
    </ol>
  );
}

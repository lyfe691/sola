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
import { ScrollReveal } from "@/components/ScrollReveal";
import { DEPLOY_LABEL } from "@/components/deploy-diff/use-page-diff";
import { commitDetailQuery, type ChangelogCommit } from "@/lib/github-commits";
import { INTL_LOCALE } from "@/lib/dates";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { scrollToTarget } from "@/utils/scroll";
import {
  HEADER_LEAD,
  staggerDelay,
  useEntranceWindow,
} from "@/utils/transitions";

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
    <ol aria-hidden="true">
      {SKELETON_SUBJECTS.map((width, i) => (
        <li key={i} className="border-b border-foreground/8">
          <div className="flex items-baseline gap-3 py-2.5">
            <span className="h-3 w-14 animate-pulse rounded-sm bg-primary/15" />
            <span
              className={cn(
                "h-3 animate-pulse rounded-sm bg-foreground/8",
                width,
              )}
            />
            <span className="ml-auto h-3 w-10 animate-pulse rounded-sm bg-foreground/6" />
          </div>
        </li>
      ))}
    </ol>
  );
}

function CommitRow({
  commit,
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

  return (
    <>
      <button
        type="button"
        onClick={() => onToggle(commit.sha)}
        onPointerEnter={() => onPrefetch(commit.sha)}
        onFocus={() => onPrefetch(commit.sha)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-busy={isPending || undefined}
        className={cn(
          "group -mx-3 flex w-[calc(100%+1.5rem)] cursor-pointer rounded-xl px-3 py-2.5 text-left touch-manipulation select-none",
          "transition-[color,background-color] duration-200 ease-out",
          "can-hover:hover:bg-muted/50",
          isOpen && "bg-muted/40",
        )}
      >
        <span className="flex min-w-0 flex-1 origin-left items-baseline gap-3 transition-[scale] duration-150 ease-out group-active:scale-[0.99] motion-reduce:transition-none">
          <span
            className={cn(
              "w-16 shrink-0 font-mono text-xs text-primary",
              isPending && "animate-pulse",
            )}
          >
            {commit.shortSha}
          </span>
          <span className="sr-only">{isOpen ? t.collapse : t.expand}</span>
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">
            {commit.subject}
            {live ? (
              <span className="ml-2 font-mono text-[10px] font-normal text-primary/70">
                {t.thisDeploy}
              </span>
            ) : null}
          </span>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
            {date}
          </span>
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-out-quart motion-reduce:transition-none",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            id={panelId}
            role="region"
            aria-label={commit.subject}
            aria-hidden={!isOpen}
            inert={!isOpen}
            className="px-3 pb-5 pt-1 sm:px-0 sm:pl-[4.75rem]"
          >
            {mounted ? <CommitDetail sha={commit.sha} /> : null}
          </div>
        </div>
      </div>
    </>
  );
}

export function CommitLog({
  commits,
  revealFrom = 0,
}: {
  commits: ChangelogCommit[];
  /** Index of the first row in the latest page — those rise in after load. */
  revealFrom?: number;
}) {
  const { language } = useLanguage();
  const t = translations[language].changelog;
  const queryClient = useQueryClient();
  const entering = useEntranceWindow();
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
      ? [pinned, ...commits.filter((commit) => commit.sha !== pinned.sha)]
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

  return (
    <ol>
      {rows.map((commit, index) => (
        <ScrollReveal
          key={commit.sha}
          as="li"
          variant="subtle"
          delay={
            entering
              ? HEADER_LEAD + staggerDelay(index)
              : index >= revealFrom
                ? staggerDelay(index - revealFrom)
                : 0
          }
          className="border-b border-foreground/8"
        >
          <CommitRow
            commit={commit}
            isOpen={open === commit.sha}
            isPending={pending === commit.sha}
            mounted={opened.has(commit.sha) || open === commit.sha}
            live={matchesDeploy(commit.sha)}
            date={formatDate(commit.date)}
            t={t}
            onToggle={toggle}
            onPrefetch={prefetch}
          />
        </ScrollReveal>
      ))}
    </ol>
  );
}

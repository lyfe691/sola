/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { CommitLog, CommitLogSkeleton } from "@/components/changelog/CommitLog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CHANGELOG_GITHUB, commitLogQuery } from "@/lib/github-commits";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import {
  HEADER_LEAD,
  scrollPageTitleVariants,
  scrollSubtleVariants,
} from "@/utils/transitions";

export default function Changelog() {
  const { language } = useLanguage();
  const t = translations[language];
  const copy = t.changelog;
  const [pages, setPages] = useState(1);
  const [revealFrom, setRevealFrom] = useState(0);

  const first = useQuery(commitLogQuery(1));
  const rest = useQueries({
    queries: Array.from({ length: Math.max(0, pages - 1) }, (_, i) =>
      commitLogQuery(i + 2),
    ),
  });

  const queries = [first, ...rest];
  const loading = queries.some((q) => q.isPending);
  const failed = queries.some((q) => q.isError);
  const last = queries.at(-1);

  const seen = new Set<string>();
  const commits = queries
    .flatMap((query) => query.data?.commits ?? [])
    .filter((commit) => {
      if (seen.has(commit.sha)) return false;
      seen.add(commit.sha);
      return true;
    });

  const lastReady = [...queries].reverse().find((query) => query.data);
  const loadingMore =
    commits.length > 0 && queries.some((query) => query.isFetching);
  const olderFailed = Boolean(last?.isError && commits.length > 0);
  const hasMore =
    loadingMore || olderFailed || (lastReady?.data?.hasMore ?? false);

  return (
    <div className="flex w-full max-w-3xl flex-col">
      <meta name="description" content={t.seo.changelog.description} />

      <ScrollReveal variant="header">
        <motion.h1
          variants={scrollPageTitleVariants}
          className="mb-4 text-4xl font-bold"
        >
          {copy.title}
        </motion.h1>
        <motion.p
          variants={scrollSubtleVariants}
          className="mb-10 max-w-2xl text-foreground/60"
        >
          {copy.subtitle}
        </motion.p>
      </ScrollReveal>

      {failed && commits.length === 0 ? (
        <ScrollReveal variant="subtle" delay={HEADER_LEAD}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{copy.error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => queries.forEach((q) => void q.refetch())}
            >
              {copy.retry}
            </Button>
          </div>
        </ScrollReveal>
      ) : loading && commits.length === 0 ? (
        <ScrollReveal variant="default" delay={HEADER_LEAD}>
          <CommitLogSkeleton />
        </ScrollReveal>
      ) : commits.length === 0 ? (
        <ScrollReveal variant="subtle" delay={HEADER_LEAD}>
          <p className="text-sm text-muted-foreground">{copy.empty}</p>
        </ScrollReveal>
      ) : (
        <>
          <CommitLog commits={commits} revealFrom={revealFrom} />
          <ScrollReveal variant="subtle" delay={HEADER_LEAD + 240}>
            <div className="mt-4 flex flex-col items-start gap-3">
              {olderFailed ? (
                <p className="text-sm text-muted-foreground">{copy.error}</p>
              ) : null}
              <div className="flex flex-wrap items-center gap-3">
                {hasMore ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={loadingMore}
                    aria-busy={loadingMore || undefined}
                    onClick={() => {
                      setRevealFrom(commits.length);
                      if (last?.isError) {
                        void last.refetch();
                        return;
                      }
                      setPages((n) => n + 1);
                    }}
                  >
                    {loadingMore ? (
                      <Spinner className="size-3.5" aria-hidden />
                    ) : null}
                    {olderFailed ? copy.retry : copy.older}
                  </Button>
                ) : null}
                <a
                  href={CHANGELOG_GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-foreground/60 underline decoration-foreground/20 underline-offset-4 hover:text-foreground"
                >
                  {copy.viewOnGitHub}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </>
      )}
    </div>
  );
}

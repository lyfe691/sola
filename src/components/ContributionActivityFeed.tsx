/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-provider";
import { translations, type TranslationAny } from "@/lib/translations";
import { motion } from "motion/react";
import type { ProcessedActivity } from "@/lib/github";
import { userActivityQuery } from "@/lib/github-activity";
import {
  GitCommit,
  GitPullRequest,
  GitBranch,
  GitMerge,
  Plus,
  Trash2,
  Star,
  GitFork,
  AlertCircle,
  CheckCircle2,
  Tag,
  Users,
  Eye,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { IconButton } from "./ui/custom/icon-button";
import { EASE_OUT } from "@/utils/transitions";

const USERNAME = "lyfe691";
const VISIBLE_EVENTS = 6;

const INTL_LOCALE: Record<string, string> = {
  en: "en",
  de: "de",
  es: "es",
  ja: "ja",
  zh: "zh-CN",
};

const ActivityIcon = ({ activity }: { activity: ProcessedActivity }) => {
  const iconClass = "w-3.5 h-3.5 shrink-0";

  switch (activity.type) {
    case "push":
      return <GitCommit className={`${iconClass} text-foreground/60`} />;

    case "pull_request":
      if (activity.action === "opened") {
        return <GitPullRequest className={`${iconClass} text-primary`} />;
      } else if (activity.action === "closed") {
        return <GitMerge className={`${iconClass} text-primary`} />;
      }
      return <GitPullRequest className={`${iconClass} text-foreground/60`} />;

    case "issues":
      if (activity.action === "opened") {
        return <AlertCircle className={`${iconClass} text-destructive`} />;
      } else if (activity.action === "closed") {
        return <CheckCircle2 className={`${iconClass} text-primary`} />;
      }
      return <AlertCircle className={`${iconClass} text-foreground/60`} />;

    case "create":
      if (activity.metadata?.branch) {
        return <GitBranch className={`${iconClass} text-primary`} />;
      } else if (activity.metadata?.tag) {
        return <Tag className={`${iconClass} text-primary`} />;
      }
      return <Plus className={`${iconClass} text-primary`} />;

    case "delete":
      return <Trash2 className={`${iconClass} text-destructive`} />;

    case "fork":
      return <GitFork className={`${iconClass} text-primary`} />;

    case "star":
      return <Star className={`${iconClass} text-primary`} />;

    case "release":
      return <Tag className={`${iconClass} text-primary`} />;

    case "member":
      return <Users className={`${iconClass} text-foreground/60`} />;

    case "watch":
      return <Eye className={`${iconClass} text-foreground/60`} />;

    default:
      return <GitCommit className={`${iconClass} text-foreground/60`} />;
  }
};

const ActivityMetadata = ({
  activity,
  t,
}: {
  activity: ProcessedActivity;
  t: TranslationAny;
}) => {
  if (!activity.metadata) return null;

  const items: string[] = [];

  if (activity.metadata.commits) {
    items.push(
      `${activity.metadata.commits} commit${activity.metadata.commits !== 1 ? "s" : ""}`,
    );
  }

  if (activity.metadata.branch) {
    items.push(activity.metadata.branch);
  }

  if (activity.metadata.tag) {
    items.push(activity.metadata.tag);
  }

  if (activity.metadata.additions || activity.metadata.deletions) {
    const changes: string[] = [];
    if (activity.metadata.additions) {
      changes.push(`+${activity.metadata.additions}`);
    }
    if (activity.metadata.deletions) {
      changes.push(`-${activity.metadata.deletions}`);
    }
    items.push(changes.join(" "));
  }

  if (items.length === 0) return null;

  return (
    <div className="mt-2 flex items-center gap-2">
      {items.slice(0, 2).map((item) => (
        <span
          key={item}
          className="rounded-md bg-foreground/5 px-2 py-0.5 text-[11px] font-medium text-foreground/50"
        >
          {item}
        </span>
      ))}
      {items.length > 2 && (
        <span className="text-[11px] text-foreground/40">
          +{items.length - 2} {t.feed.moreSuffix}
        </span>
      )}
    </div>
  );
};

const formatDate = (timestamp: string, locale: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      -1,
      "hour",
    );
  }
  if (diffInHours < 24) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      -diffInHours,
      "hour",
    );
  }
  if (diffInHours < 48) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      -1,
      "day",
    );
  }

  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const ActivityItem = ({
  activity,
  index,
  locale,
  t,
  play,
}: {
  activity: ProcessedActivity;
  index: number;
  locale: string;
  t: TranslationAny;
  play: boolean;
}) => {
  const repoName = activity.repo.split("/")[1];

  return (
    <motion.div
      initial={play ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={
        play
          ? { delay: index * 0.02, duration: 0.25, ease: EASE_OUT }
          : { duration: 0 }
      }
      className="group px-4 py-3 transition-colors duration-150 can-hover:hover:bg-foreground/2"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-lg bg-foreground/4 p-1.5 transition-colors duration-200 can-hover:group-hover:bg-foreground/8">
          <ActivityIcon activity={activity} />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium leading-snug text-foreground">
            {activity.title}
          </p>

          <p className="line-clamp-2 text-sm leading-relaxed text-foreground/70">
            {activity.description}
          </p>

          <ActivityMetadata activity={activity} t={t} />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-foreground/50">
              <Clock className="h-3 w-3" />
              <time dateTime={activity.timestamp}>
                {formatDate(activity.timestamp, locale)}
              </time>
              <span aria-hidden>•</span>
              <a
                href={activity.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-foreground/70"
              >
                {repoName}
                <ArrowUpRight className="h-2.5 w-2.5" />
              </a>
            </div>

            {activity.url ? (
              <a
                href={activity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary transition-colors opacity-100 can-hover:opacity-0 can-hover:group-hover:opacity-100 hover:text-primary/80"
              >
                {t.common.view}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityFeedSkeleton = () => (
  <div
    className="divide-y divide-foreground/6 overflow-hidden rounded-2xl border border-foreground/8 bg-linear-to-b from-foreground/2 to-foreground/1 backdrop-blur-xs"
    aria-hidden
  >
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-start gap-3 px-4 py-3">
        <Skeleton className="mt-1 size-7 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5 max-w-44" />
          <Skeleton className="h-3.5 w-full max-w-md" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    ))}
  </div>
);

const ContributionActivityFeed = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const locale = INTL_LOCALE[language] ?? "en";

  const { data, isPending: loading } = useQuery(userActivityQuery(USERNAME));
  const events: ProcessedActivity[] = data ?? [];

  const eventsToShow = events.slice(0, VISIBLE_EVENTS);

  // entrance stagger only when items are already there on first paint (query
  // cache hit); after a skeleton phase they appear in place instead of
  // replaying the entrance on a later render
  const [play] = React.useState(() => !loading);

  return (
    <div className="mt-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {t.feed.recentActivity}
        </h3>
        <span className="rounded-full bg-foreground/4 px-2.5 py-1 text-xs text-foreground/40">
          {t.feed.lastEvents}
        </span>
      </div>

      <div className="relative min-h-[18rem]">
        {loading ? (
          <ActivityFeedSkeleton />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-foreground/8 bg-linear-to-b from-foreground/2 to-foreground/1 backdrop-blur-xs">
            {eventsToShow.length > 0 ? (
              <div className="divide-y divide-foreground/6">
                {eventsToShow.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    index={index}
                    locale={locale}
                    t={t}
                    play={play}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/4">
                  <GitCommit className="h-6 w-6 text-foreground/30" />
                </div>
                <p className="mb-1 text-sm text-foreground/70">
                  {t.feed.noActivity}
                </p>
                <p className="text-xs text-foreground/50">{t.feed.checkBack}</p>
              </div>
            )}
          </div>
        )}

        {!loading && events.length > VISIBLE_EVENTS ? (
          <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-full rounded-b-2xl bg-linear-to-t from-background/30 to-transparent" />
        ) : null}
      </div>

      {!loading && events.length > 0 ? (
        <div className="mt-6 flex justify-center">
          <IconButton
            variant="default"
            icon={<ArrowUpRight className="h-3.5 w-3.5" />}
            size="lg"
            className="rounded-full border-foreground/20 transition-colors duration-200"
            label={t.common.moreOnGithub}
            onClick={() =>
              window.open("https://github.com/lyfe691?tab=events", "_blank")
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export default ContributionActivityFeed;

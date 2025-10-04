/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from "react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { motion } from "motion/react";
import type { ProcessedActivity } from "@/lib/github";
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
  MoveRight,
} from "lucide-react";
import { IconButton } from "@/components/ui/custom/icon-button";

interface ContributionActivityFeedProps {
  events: ProcessedActivity[];
}

// refined mapping with subtle colors
const ActivityIcon = ({ activity }: { activity: ProcessedActivity }) => {
  const iconClass = "w-3.5 h-3.5 flex-shrink-0";

  switch (activity.type) {
    case "push":
      return <GitCommit className={`${iconClass} text-foreground/60`} />;

    case "pull_request":
      if (activity.action === "opened") {
        return (
          <GitPullRequest
            className={`${iconClass} text-emerald-600 dark:text-emerald-400`}
          />
        );
      } else if (activity.action === "closed") {
        return (
          <GitMerge
            className={`${iconClass} text-violet-600 dark:text-violet-400`}
          />
        );
      }
      return <GitPullRequest className={`${iconClass} text-foreground/60`} />;

    case "issues":
      if (activity.action === "opened") {
        return (
          <AlertCircle
            className={`${iconClass} text-red-600 dark:text-red-400`}
          />
        );
      } else if (activity.action === "closed") {
        return (
          <CheckCircle2
            className={`${iconClass} text-emerald-600 dark:text-emerald-400`}
          />
        );
      }
      return <AlertCircle className={`${iconClass} text-foreground/60`} />;

    case "create":
      if (activity.metadata?.branch) {
        return (
          <GitBranch
            className={`${iconClass} text-emerald-600 dark:text-emerald-400`}
          />
        );
      } else if (activity.metadata?.tag) {
        return (
          <Tag className={`${iconClass} text-blue-600 dark:text-blue-400`} />
        );
      }
      return (
        <Plus
          className={`${iconClass} text-emerald-600 dark:text-emerald-400`}
        />
      );

    case "delete":
      return (
        <Trash2 className={`${iconClass} text-red-600 dark:text-red-400`} />
      );

    case "fork":
      return (
        <GitFork
          className={`${iconClass} text-amber-600 dark:text-amber-400`}
        />
      );

    case "star":
      return (
        <Star className={`${iconClass} text-amber-600 dark:text-amber-400`} />
      );

    case "release":
      return (
        <Tag className={`${iconClass} text-blue-600 dark:text-blue-400`} />
      );

    case "member":
      return (
        <Users
          className={`${iconClass} text-violet-600 dark:text-violet-400`}
        />
      );

    case "watch":
      return <Eye className={`${iconClass} text-foreground/60`} />;

    default:
      return <GitCommit className={`${iconClass} text-foreground/60`} />;
  }
};

// cleaner, more subtle metadata display
const ActivityMetadata = ({
  activity,
  t,
}: {
  activity: ProcessedActivity;
  t: any;
}) => {
  if (!activity.metadata) return null;

  const items = [];

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
    const changes = [];
    if (activity.metadata.additions)
      changes.push(`+${activity.metadata.additions}`);
    if (activity.metadata.deletions)
      changes.push(`-${activity.metadata.deletions}`);
    items.push(changes.join(" "));
  }

  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      {items.slice(0, 2).map((item, index) => (
        <span
          key={index}
          className="text-[11px] text-foreground/50 bg-foreground/[0.05] px-2 py-0.5 rounded-md font-medium"
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

// clean, refined activity item
const ActivityItem = ({
  activity,
  index,
  locale,
  t,
}: {
  activity: ProcessedActivity;
  index: number;
  locale: string;
  t: any;
}) => {
  const formatDate = (timestamp: string, locale: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1)
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        -1,
        "hour",
      );
    if (diffInHours < 24)
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        -diffInHours,
        "hour",
      );
    if (diffInHours < 48)
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        -1,
        "day",
      );

    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const repoName = activity.repo.split("/")[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4, ease: "easeOut" }}
      className="group px-4 py-3 hover:bg-foreground/[0.02] transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 p-1.5 rounded-lg bg-foreground/[0.04] group-hover:bg-foreground/[0.08] transition-colors duration-300">
          <ActivityIcon activity={activity} />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          {/* Title */}
          <p className="text-sm font-medium text-foreground leading-snug">
            {activity.title}
          </p>

          {/* Description */}
          <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2">
            {activity.description}
          </p>

          {/* Metadata */}
          <ActivityMetadata activity={activity} t={t} />

          {/* Footer with time and repo */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-foreground/50">
              <Clock className="w-3 h-3" />
              <span>{formatDate(activity.timestamp, locale)}</span>
              <span>•</span>
              <a
                href={activity.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground/70 transition-colors"
              >
                {repoName}
                <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
            </div>

            {activity.url && (
              <a
                href={activity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primary/80 transition-colors opacity-0 group-hover:opacity-100"
              >
                {t.common.view}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ContributionActivityFeed: React.FC<ContributionActivityFeedProps> = ({
  events,
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const localeMap: Record<string, string> = {
    en: "en",
    de: "de",
    es: "es",
    ja: "ja",
    zh: "zh-CN",
  };
  const locale = localeMap[language] || "en";
  const eventsToShow = events.slice(0, 6);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {t.feed.recentActivity}
        </h3>
        <span className="text-xs text-foreground/40 bg-foreground/[0.04] px-2.5 py-1 rounded-full">
          {t.feed.lastEvents}
        </span>
      </div>

      <div className="relative">
        <div className="border border-foreground/[0.08] rounded-2xl bg-gradient-to-b from-foreground/[0.02] to-foreground/[0.01] backdrop-blur-sm overflow-hidden">
          {eventsToShow.length > 0 ? (
            <div className="divide-y divide-foreground/[0.06]">
              {eventsToShow.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  index={index}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-foreground/[0.04] flex items-center justify-center mx-auto mb-4">
                <GitCommit className="w-6 h-6 text-foreground/30" />
              </div>
              <p className="text-sm text-foreground/70 mb-1">
                {t.feed.noActivity}
              </p>
              <p className="text-xs text-foreground/50">{t.feed.checkBack}</p>
            </div>
          )}
        </div>

        {/* Subtle fade effect */}
        {events.length > 6 && (
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background/30 to-transparent pointer-events-none rounded-b-2xl" />
        )}
      </div>

      {/* refined view all link */}
      {events.length > 0 && (
        <div className="mt-6 flex justify-center">
          <IconButton
            variant="default"
            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
            size="lg"
            className="transition-all duration-300 group border-foreground/20 rounded-full"
            label={t.common.moreOnGithub}
            onClick={() =>
              window.open(
                "https://github.com/lyfe691?tab=repositories",
                "_blank",
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default ContributionActivityFeed;

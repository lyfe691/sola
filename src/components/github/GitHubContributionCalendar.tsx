/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { getThemeType } from "@/config/themes";
import {
  fetchGitHubContributions,
  getContributionTotal,
  peekGitHubContributions,
  type ContributionActivity,
  type ContributionYear,
} from "@/lib/github-contributions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const USERNAME = "lyfe691";

const INTL_LOCALE: Record<string, string> = {
  en: "en",
  de: "de",
  es: "es",
  ja: "ja",
  zh: "zh-CN",
};

const heatmapTheme = {
  light: [
    "var(--contrib-0)",
    "var(--contrib-1)",
    "var(--contrib-2)",
    "var(--contrib-3)",
    "var(--contrib-4)",
  ],
  dark: [
    "var(--contrib-0)",
    "var(--contrib-1)",
    "var(--contrib-2)",
    "var(--contrib-3)",
    "var(--contrib-4)",
  ],
} as const;

const BLOCK_SIZE = 11;
const BLOCK_MARGIN = 3;
const FONT_SIZE = 11;
const HEATMAP_LEVELS = 5;

// Matches react-activity-calendar layout math for stable height.
const CALENDAR_MIN_HEIGHT =
  FONT_SIZE + 8 + (BLOCK_SIZE + BLOCK_MARGIN) * 7 - BLOCK_MARGIN;

type ContributionData = {
  contributions: ContributionActivity[];
  total: Record<string, number> & { lastYear: number };
};

type GitHubContributionCalendarProps = {
  year: ContributionYear;
  className?: string;
};

const GitHubContributionCalendar = ({
  year,
  className,
}: GitHubContributionCalendarProps) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  const colorScheme = getThemeType(theme);
  const locale = INTL_LOCALE[language] ?? "en";

  const [data, setData] = useState<ContributionData | null>(() =>
    peekGitHubContributions(USERNAME, year),
  );
  const [loading, setLoading] = useState(
    () => !peekGitHubContributions(USERNAME, year),
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cached = peekGitHubContributions(USERNAME, year);

    setError(false);
    if (cached) {
      setData(cached);
      setLoading(false);
    } else {
      setData(null);
      setLoading(true);
    }

    const load = async () => {
      const result = await fetchGitHubContributions(USERNAME, year);
      if (cancelled) return;

      if (!result) {
        if (!cached) {
          setError(true);
          setData(null);
        }
        setLoading(false);
        return;
      }

      setData(result);
      setError(false);
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [year]);

  const labels = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat(locale, { month: "short" }).format(
        new Date(2024, i, 1),
      ),
    );

    const weekdays = Array.from({ length: 7 }, (_, i) =>
      new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
        new Date(2024, 0, 7 + i),
      ),
    );

    return {
      months,
      weekdays,
      legend: {
        less: t.about.github.legendLess,
        more: t.about.github.legendMore,
      },
    };
  }, [locale, t]);

  const totalCountLabel = useMemo(() => {
    if (!data) return "";
    const count = getContributionTotal(data, year);
    const template =
      year === "last"
        ? t.about.github.totalCountLastYear
        : t.about.github.totalCount;
    return template
      .replace("{{count}}", String(count))
      .replace("{{year}}", String(year));
  }, [data, t, year]);

  const formatTooltip = useCallback(
    (date: string, count: number) =>
      t.about.github.dayTooltip
        .replace("{count}", String(count))
        .replace("{date}", date),
    [t.about.github.dayTooltip],
  );

  const renderBlock = useCallback(
    (block: ReactElement, activity: ContributionActivity) => (
      <g>
        {cloneElement(block, {
          style: {
            ...block.props.style,
            stroke: "none",
          },
        })}
        <title>{formatTooltip(activity.date, activity.count)}</title>
      </g>
    ),
    [formatTooltip],
  );

  const showCalendar = !error && (loading || data);
  const showError = error && !data;

  return (
    <div
      className={cn("contribution-calendar", className)}
      data-scheme={colorScheme}
    >
      <div
        className="contribution-calendar__body"
        style={{ minHeight: CALENDAR_MIN_HEIGHT }}
      >
        {showError ? (
          <div className="flex h-full min-h-[inherit] items-center justify-center rounded-lg border border-dashed border-foreground/12 bg-foreground/[0.02] px-4 py-8 text-center text-sm text-muted-foreground">
            {t.about.github.loadError}
          </div>
        ) : showCalendar ? (
          <ActivityCalendar
            data={data?.contributions ?? []}
            loading={loading}
            colorScheme={colorScheme}
            theme={heatmapTheme}
            labels={labels}
            weekStart={1}
            blockSize={BLOCK_SIZE}
            blockRadius={3}
            blockMargin={BLOCK_MARGIN}
            fontSize={FONT_SIZE}
            showWeekdayLabels={["mon", "wed", "fri"]}
            hideTotalCount
            hideColorLegend
            totalCount={data ? getContributionTotal(data, year) : 0}
            renderBlock={renderBlock}
          />
        ) : null}
      </div>

      <div className="contribution-calendar__meta">
        {loading || !data ? (
          <>
            <Skeleton className="h-3.5 w-44" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-8" />
              <div className="flex gap-[3px]">
                {Array.from({ length: HEATMAP_LEVELS }).map((_, level) => (
                  <Skeleton
                    key={level}
                    className="size-[11px] rounded-[3px]"
                  />
                ))}
              </div>
              <Skeleton className="h-3.5 w-8" />
            </div>
          </>
        ) : (
          <>
            <p className="contribution-calendar__count">{totalCountLabel}</p>
            <div
              className="contribution-calendar__legend"
              aria-label={`${t.about.github.legendLess} – ${t.about.github.legendMore}`}
            >
              <span>{t.about.github.legendLess}</span>
              <div className="contribution-calendar__legend-blocks">
                {Array.from({ length: HEATMAP_LEVELS }).map((_, level) => (
                  <span
                    key={level}
                    className="contribution-calendar__legend-block"
                    data-level={level}
                  />
                ))}
              </div>
              <span>{t.about.github.legendMore}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubContributionCalendar;
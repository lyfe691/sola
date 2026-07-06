/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The GitHub heatmap, themed through the site's tokens. Two departures from
 * the library's defaults: day squares carry the site's droplet tooltip (a
 * grouped provider, so sweeping across squares feels instant after the
 * first), and the block size is solved from the card's measured width so
 * the grid fills the card instead of stopping at its intrinsic ~740px.
 * The weekday-label gutter is text-measured by the library per locale, so
 * it's recovered from the rendered SVG rather than guessed.
 */

import {
  cloneElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityCalendar,
  type Activity,
  type BlockElement,
  type ThemeInput,
} from "react-activity-calendar";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { getThemeType } from "@/config/themes";
import {
  getContributionTotal,
  githubContributionsQuery,
  type ContributionYear,
} from "@/lib/github-contributions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const USERNAME = "lyfe691";

const INTL_LOCALE: Record<string, string> = {
  en: "en",
  de: "de",
  es: "es",
  ja: "ja",
  zh: "zh-CN",
};

const heatmapTheme: ThemeInput = {
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
};

// the grid never shrinks below GitHub's own 11px (narrow screens scroll,
// as before); wide cards grow blocks until they fill, capped where the
// squares start reading chunky
const BLOCK_SIZE_MIN = 11;
const BLOCK_SIZE_MAX = 16;
const BLOCK_MARGIN = 3;
const FONT_SIZE = 11;
const WEEK_START = 1; // Monday
const HEATMAP_LEVELS = 5;

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

  const {
    data,
    isPending: loading,
    isError: error,
  } = useQuery(githubContributionsQuery(USERNAME, year));

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

  // ——— fit the grid to the card ———

  // how many week columns the current data spans (the layout math's X axis)
  const weekCount = useMemo(() => {
    const days = data?.contributions;
    if (!days?.length) return 53;
    const lead = (new Date(days[0].date).getDay() - WEEK_START + 7) % 7;
    return Math.ceil((lead + days.length) / 7);
  }, [data]);

  const bodyRef = useRef<HTMLDivElement>(null);
  const [blockSize, setBlockSize] = useState(BLOCK_SIZE_MIN);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const fit = () => {
      const svg = body.querySelector(".react-activity-calendar__calendar");
      const svgWidth = Number(svg?.getAttribute("width"));
      if (!svgWidth) return;
      // grid width at the current block size is known, so the rendered SVG
      // gives away the label gutter exactly — no locale metric guessing
      const grid = weekCount * (blockSize + BLOCK_MARGIN) - BLOCK_MARGIN;
      const gutter = svgWidth - grid;
      const usable = body.clientWidth - gutter + BLOCK_MARGIN;
      const next = Math.min(
        BLOCK_SIZE_MAX,
        Math.max(
          BLOCK_SIZE_MIN,
          Math.floor(usable / weekCount) - BLOCK_MARGIN,
        ),
      );
      setBlockSize(next);
    };

    // run now (a block-size change re-renders and re-enters here, converging
    // in one step since the gutter is size-independent), then follow resizes
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(body);
    return () => observer.disconnect();
  }, [weekCount, blockSize, locale, data]);

  // matches react-activity-calendar's layout math for stable height
  const calendarMinHeight =
    FONT_SIZE + 8 + (blockSize + BLOCK_MARGIN) * 7 - BLOCK_MARGIN;

  // ——— droplet tooltips on the day squares ———

  const formatDay = useCallback(
    (activity: Activity) =>
      t.about.github.dayTooltip
        .replace("{count}", String(activity.count))
        .replace(
          "{date}",
          new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
            new Date(activity.date),
          ),
        ),
    [t.about.github.dayTooltip, locale],
  );

  const renderBlock = useCallback(
    (block: BlockElement, activity: Activity) => (
      <Tooltip>
        <TooltipTrigger
          render={cloneElement(block, {
            style: { ...block.props.style, stroke: "none" },
          })}
        />
        <TooltipContent side="top" sideOffset={8}>
          {formatDay(activity)}
        </TooltipContent>
      </Tooltip>
    ),
    [formatDay],
  );

  const showCalendar = !error && (loading || data);
  const showError = error && !data;

  return (
    <div
      className={cn("contribution-calendar", className)}
      data-scheme={colorScheme}
    >
      <div
        ref={bodyRef}
        className="contribution-calendar__body"
        style={{ minHeight: calendarMinHeight }}
      >
        {showError ? (
          <div className="flex h-full min-h-[inherit] items-center justify-center rounded-lg border border-dashed border-foreground/12 bg-foreground/[0.02] px-4 py-8 text-center text-sm text-muted-foreground">
            {t.about.github.loadError}
          </div>
        ) : showCalendar ? (
          // one grouped provider: the first square lingers 300ms, then
          // sweeping across neighbours re-anchors the droplet instantly
          <TooltipProvider delay={300}>
            <ActivityCalendar
              data={data?.contributions ?? []}
              loading={loading}
              colorScheme={colorScheme}
              theme={heatmapTheme}
              labels={labels}
              weekStart={WEEK_START}
              blockSize={blockSize}
              blockRadius={Math.round(blockSize / 4)}
              blockMargin={BLOCK_MARGIN}
              fontSize={FONT_SIZE}
              showWeekdayLabels={["mon", "wed", "fri"]}
              showTotalCount={false}
              showColorLegend={false}
              renderBlock={renderBlock}
            />
          </TooltipProvider>
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
                  <Skeleton key={level} className="size-[11px] rounded-[3px]" />
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

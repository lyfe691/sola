declare module "react-github-calendar" {
    export interface GitHubCalendarProps {
      username: string;
      /**
       * Theme for the calendar
       */
      colorScheme?: "light" | "dark" | "system";
      /**
       * Year to display, or 'last' for last 12 months
       */
      year?: number | "last";
      /**
       * Font size for the calendar
       */
      fontSize?: number;
      /**
       * Whether to show weekday labels
       */
      showWeekdayLabels?: boolean;
      /**
       * Whether to display total count
       */
      hideColorLegend?: boolean;
      /**
       * Whether to hide month labels
       */
      hideMonthLabels?: boolean;
      /**
       * Whether to hide total count
       */
      hideTotalCount?: boolean;
      /**
       * Block margin between blocks
       */
      blockMargin?: number;
      /**
       * Block radius
       */
      blockRadius?: number;
      /**
       * Block size
       */
      blockSize?: number;
      /**
       * Custom theme colors
       */
      theme?: {
        light: string[];
        dark: string[];
      };
      /**
       * Loading component
       */
      loading?: React.ComponentType;
      /**
       * Error component
       */
      errorMessage?: string;
      /**
       * Transform data function
       */
      transformData?: (data: any) => any;
      /**
       * Week start day (0 = Sunday, 1 = Monday)
       */
      weekStart?: 0 | 1;
    }
  
    /**
     * GitHub contribution calendar component
     */
    const GitHubCalendar: React.FC<GitHubCalendarProps>;
    export default GitHubCalendar;
  }
  
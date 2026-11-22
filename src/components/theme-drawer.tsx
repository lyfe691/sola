/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  useId,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import {
  CircleHalfIcon,
  CodeIcon,
  MoonIcon,
  SparkleIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { useTheme } from "./theme-provider";
import { BarDrawer } from "@/components/bar-drawer";
import { MenuHint } from "@/components/menu-hint";
import { useBackground } from "@/components/backgrounds/background-provider";
import { buildBackgroundOptions } from "@/components/backgrounds/registry";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { Switch } from "@/components/ui/switch";
import { THEMES, toTheme, type Theme, type ThemeIcon } from "@/config/themes";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";

const PALETTES = THEMES.filter((option) => option.isCustom);
const isPalette = (theme: string) =>
  PALETTES.some((palette) => palette.value === theme);

// the control's fourth segment: whichever custom theme was worn last
const CUSTOM = "custom";

// on a phone the system's scheme is not a laptop: it is half of each
const MODE_ICONS: Record<string, ThemeIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: CircleHalfIcon,
  [CUSTOM]: SparkleIcon,
};

/** A section's name over its options. */
function Section({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5 px-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {hint}
      </div>
      {children}
    </section>
  );
}

/**
 * Light, dark, the system's or a custom theme: one control of four, its
 * thumb gliding to the one in use. A segmented control always has one
 * segment on, so a custom theme has a segment of its own rather than leaving
 * the other three all off.
 */
function ModeControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslation();
  const segments = [
    ...THEMES.filter((option) => !option.isCustom),
    { value: CUSTOM, label: t.common.menu.custom },
  ];
  const index = segments.findIndex((segment) => segment.value === value);

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      aria-label={t.common.menu.themes}
      className="rounded-full bg-muted p-1"
    >
      {/* a container, so the glyphs step aside before a label would clip */}
      <div className="@container relative isolate grid grid-cols-4">
        <span
          aria-hidden="true"
          style={{ "--mode-x": `${index * 100}%` } as CSSProperties}
          className="absolute inset-y-0 left-0 -z-10 w-1/4 translate-x-(--mode-x) rounded-full bg-background shadow-sm ring-1 ring-foreground/5 motion-safe:transition-[translate] motion-safe:duration-220 motion-safe:ease-expo"
        />
        {segments.map(({ value, label }) => {
          const Icon = MODE_ICONS[value];
          return (
            <Radio.Root
              key={value}
              value={value}
              className="flex h-11 min-w-0 cursor-pointer items-center justify-center gap-1 rounded-full text-sm font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:text-foreground"
            >
              <Icon
                className="size-4 shrink-0 @max-[19rem]:hidden"
                aria-hidden="true"
              />
              <span className="truncate">{label}</span>
            </Radio.Root>
          );
        })}
      </div>
    </RadioGroup>
  );
}

/**
 * A custom theme as a disc of its two colours, the page's and the accent's,
 * meeting on the diagonal. The disc wears the theme's class, so each half
 * is that theme's own token.
 */
function PaletteDisc({ value, label }: (typeof THEMES)[number]) {
  return (
    <Radio.Root
      value={value}
      className="group/disc flex min-w-0 cursor-pointer flex-col items-center gap-2 rounded-2xl py-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <span
        aria-hidden="true"
        className="rounded-full ring-offset-2 ring-offset-popover transition-[box-shadow,scale] duration-200 group-active/disc:scale-95 group-data-checked/disc:ring-2 group-data-checked/disc:ring-primary"
      >
        <span
          className={cn(
            value,
            "block size-13 rounded-full bg-linear-135 from-background from-50% to-primary to-50% ring-1 ring-foreground/10 ring-inset",
          )}
        />
      </span>
      <span className="max-w-full truncate text-xs text-muted-foreground transition-colors group-data-checked/disc:text-foreground">
        {label}
      </span>
    </Radio.Root>
  );
}

/**
 * The theme menu on a phone, made for a thumb rather than taken from the
 * dropdown: the scheme as one control, the custom themes as discs of their
 * colours, the backgrounds as a row to swipe along. Every pick repaints the
 * site behind the open sheet, so the visitor can try one after another.
 */
export function ThemeDrawer({
  trigger,
  open,
  onOpenChange,
}: {
  trigger: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslation();
  const { theme, setTheme } = useTheme();
  const { active: background, setActive: setBackground } = useBackground();
  const { active: codeView, setActive: setCodeView } = useCodeView();
  const diffTitleId = useId();
  const diffHintId = useId();
  // the custom segment brings back the last custom theme worn, or the first
  const [lastPalette, setLastPalette] = useState<Theme>(() =>
    isPalette(theme) ? theme : (PALETTES[0].value as Theme),
  );
  if (isPalette(theme) && theme !== lastPalette) setLastPalette(theme);
  // the code view takes the whole bar away, this sheet with it: the switch
  // shuts the sheet first and the code view opens once it is down. Opened
  // again on its way down, the sheet forgets the flip
  const [toCodeView, setToCodeView] = useState(false);

  return (
    <BarDrawer
      trigger={trigger}
      title={t.common.menu.appearance}
      open={open && !codeView}
      onOpenChange={(next) => {
        if (next) setToCodeView(false);
        onOpenChange(next);
      }}
      onOpenChangeComplete={(isOpen) => {
        if (isOpen || !toCodeView) return;
        setToCodeView(false);
        setCodeView(true);
      }}
    >
      <div className="flex flex-col gap-6">
        <ModeControl
          value={isPalette(theme) ? CUSTOM : theme}
          onChange={(value) => {
            const next = value === CUSTOM ? lastPalette : toTheme(value);
            if (next) setTheme(next);
          }}
        />
        <Section label={t.common.menu.customThemes}>
          <RadioGroup
            // null, not undefined: still controlled, with no disc on
            value={isPalette(theme) ? theme : null}
            onValueChange={(value: Theme | null) => {
              if (value) setTheme(value);
            }}
            aria-label={t.common.menu.customThemes}
            className="grid grid-cols-4 gap-x-2 gap-y-3"
          >
            {PALETTES.map((option) => (
              <PaletteDisc key={option.value} {...option} />
            ))}
          </RadioGroup>
        </Section>

        <Section
          label={t.common.menu.background}
          hint={<MenuHint text={t.common.backgroundHints.section} />}
        >
          {/* edge to edge of the sheet, so a chip cut at the side says
              there is more */}
          <RadioGroup
            value={background}
            onValueChange={setBackground}
            aria-label={t.common.menu.background}
            className="no-scrollbar scroll-fade-x -mx-4 -my-1 flex scroll-px-10 gap-2 overflow-x-auto px-4 py-1"
          >
            {buildBackgroundOptions(t.common.none).map(({ id, label }) => (
              <Radio.Root
                key={id}
                value={id}
                // an outline, not a ring: a custom theme's ring is its
                // primary, the very fill of the chosen chip. The after box
                // makes the 36px chip a 44px target
                className="relative inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full bg-muted px-4 text-sm whitespace-nowrap text-foreground outline-offset-2 transition-colors not-data-checked:hover:bg-accent after:absolute after:inset-x-0 after:-inset-y-1 focus-visible:outline-2 focus-visible:outline-ring data-checked:bg-primary data-checked:text-primary-foreground"
              >
                {label}
              </Radio.Root>
            ))}
          </RadioGroup>
        </Section>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-muted px-3.5 py-3">
          <CodeIcon
            className="size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1">
            <span id={diffTitleId} className="block text-sm font-medium">
              {t.common.diff.showDiff}
            </span>
            <span
              id={diffHintId}
              className="block text-xs text-muted-foreground"
            >
              {t.common.diff.hint}
            </span>
          </span>
          {/* named by its title and described by the hint, not named by the
              whole label: the row still toggles it on a tap */}
          <Switch
            aria-labelledby={diffTitleId}
            aria-describedby={diffHintId}
            checked={codeView || toCodeView}
            onCheckedChange={(on) => {
              setToCodeView(on);
              if (on) onOpenChange(false);
            }}
          />
        </label>
      </div>
    </BarDrawer>
  );
}

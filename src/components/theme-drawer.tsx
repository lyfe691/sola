/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
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
  SunIcon,
} from "@phosphor-icons/react";
import { useTheme } from "./theme-provider";
import { BarDrawer } from "@/components/bar-drawer";
import { MenuHint } from "@/components/menu-hint";
import { useBackground } from "@/components/backgrounds/background-provider";
import { buildBackgroundOptions } from "@/components/backgrounds/registry";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { Switch } from "@/components/ui/switch";
import { THEMES, type ThemeIcon } from "@/config/themes";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";

// on a phone the system's scheme is not a laptop: it is half of each
const MODE_ICONS: Record<string, ThemeIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: CircleHalfIcon,
};
const MODES = THEMES.filter((option) => !option.isCustom);
const PALETTES = THEMES.filter((option) => option.isCustom);

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
 * Light, dark or the system's: one control of three, its thumb gliding to
 * the one in use. On a palette none of the three is, and the thumb steps
 * out where it last stood, so it comes back from there.
 */
function ModeControl({ theme }: { theme: string }) {
  const index = MODES.findIndex((mode) => mode.value === theme);
  const [lastIndex, setLastIndex] = useState(Math.max(index, 0));
  if (index >= 0 && index !== lastIndex) setLastIndex(index);

  return (
    <div className="rounded-full bg-muted p-1">
      <div className="relative isolate grid grid-cols-3">
        <span
          aria-hidden="true"
          style={{ "--mode-x": `${lastIndex * 100}%` } as CSSProperties}
          className={cn(
            "absolute inset-y-0 left-0 -z-10 w-1/3 translate-x-(--mode-x) rounded-full bg-background shadow-sm ring-1 ring-foreground/5 motion-safe:transition-[translate,opacity] motion-safe:duration-220 motion-safe:ease-expo",
            index < 0 && "opacity-0",
          )}
        />
        {MODES.map(({ value, label }) => {
          const Icon = MODE_ICONS[value];
          return (
            <Radio.Root
              key={value}
              value={value}
              className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full text-sm font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:text-foreground"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Radio.Root>
          );
        })}
      </div>
    </div>
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
      <span className="max-w-full truncate text-xs text-muted-foreground transition-colors group-data-checked/disc:font-medium group-data-checked/disc:text-foreground">
        {label}
      </span>
    </Radio.Root>
  );
}

/**
 * The theme menu on a phone, made for a thumb rather than taken from the
 * dropdown: the scheme as one control, the palettes as discs of their
 * colours, the backgrounds as a row to swipe along. Every pick repaints the
 * site behind the open sheet, so the visitor can try one after another.
 */
export function ThemeDrawer({ trigger }: { trigger: ReactElement }) {
  const t = useTranslation();
  const { theme, setTheme } = useTheme();
  const { active: background, setActive: setBackground } = useBackground();
  const { active: codeView, setActive: setCodeView } = useCodeView();
  const [open, setOpen] = useState(false);
  // the code view takes the whole bar away, this sheet with it: the switch
  // shuts the sheet first and the code view opens once it is down
  const [toCodeView, setToCodeView] = useState(false);

  return (
    <BarDrawer
      trigger={trigger}
      title={t.common.menu.appearance}
      open={open && !codeView}
      onOpenChange={setOpen}
      onOpenChangeComplete={(isOpen) => {
        if (isOpen || !toCodeView) return;
        setToCodeView(false);
        setCodeView(true);
      }}
    >
      <div className="flex flex-col gap-6">
        {/* one choice across the modes and the palettes */}
        <RadioGroup
          value={theme}
          onValueChange={setTheme}
          aria-label={t.common.menu.themes}
          className="flex flex-col gap-6"
        >
          <ModeControl theme={theme} />
          <Section label={t.common.menu.customThemes}>
            <div className="grid grid-cols-4 gap-x-2 gap-y-3">
              {PALETTES.map((option) => (
                <PaletteDisc key={option.value} {...option} />
              ))}
            </div>
          </Section>
        </RadioGroup>

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
            className="no-scrollbar scroll-fade-x -mx-4 flex gap-2 overflow-x-auto px-4"
          >
            {buildBackgroundOptions(t.common.none).map(({ id, label }) => (
              <Radio.Root
                key={id}
                value={id}
                className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full bg-muted px-4 text-sm whitespace-nowrap text-foreground outline-none transition-colors not-data-checked:hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset data-checked:bg-primary data-checked:text-primary-foreground"
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
            <span className="block text-sm font-medium">
              {t.common.diff.showDiff}
            </span>
            <span className="block text-xs text-muted-foreground">
              {t.common.diff.hint}
            </span>
          </span>
          <Switch
            checked={codeView || toCodeView}
            onCheckedChange={(on) => {
              setToCodeView(on);
              if (on) setOpen(false);
            }}
          />
        </label>
      </div>
    </BarDrawer>
  );
}

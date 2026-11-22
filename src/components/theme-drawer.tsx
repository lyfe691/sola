/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useId, useState, type ReactElement, type ReactNode } from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { CodeIcon } from "@phosphor-icons/react";
import { useTheme } from "./theme-provider";
import { BarDrawer } from "@/components/bar-drawer";
import { MenuHint } from "@/components/menu-hint";
import { useBackground } from "@/components/backgrounds/background-provider";
import { buildBackgroundOptions } from "@/components/backgrounds/registry";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { Switch } from "@/components/ui/switch";
import { THEMES } from "@/config/themes";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";

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
 * A theme's picture, each colour its own token: a custom theme is its page
 * and its accent meeting on the diagonal, light and dark are their page
 * alone, and the system's is the two of them side by side.
 */
function Swatch({ value, isCustom }: (typeof THEMES)[number]) {
  // the gradient spans the hairline too, or it repeats in a sliver under it
  const disc =
    "block size-13 rounded-full border border-foreground/15 bg-origin-border";

  if (value === "system") {
    return (
      <span className={cn(disc, "flex overflow-hidden")}>
        <span className="light flex-1 bg-background" />
        <span className="dark flex-1 bg-background" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        value,
        disc,
        isCustom
          ? "bg-linear-135 from-background from-50% to-primary to-50%"
          : "bg-background",
      )}
    />
  );
}

/** A theme to pick: its disc, its name beneath, a ring when it is worn. */
function ThemeDisc(theme: (typeof THEMES)[number]) {
  return (
    <Radio.Root
      value={theme.value}
      className="group/disc flex min-w-0 cursor-pointer flex-col items-center gap-2 rounded-2xl py-0.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <span
        aria-hidden="true"
        className="rounded-full ring-offset-2 ring-offset-popover transition-[box-shadow,scale] duration-200 group-active/disc:scale-95 group-data-checked/disc:ring-2 group-data-checked/disc:ring-primary"
      >
        <Swatch {...theme} />
      </span>
      <span className="max-w-full truncate text-xs text-muted-foreground transition-colors group-data-checked/disc:text-foreground">
        {theme.label}
      </span>
    </Radio.Root>
  );
}

/**
 * The theme menu on a phone, made for a thumb rather than taken from the
 * dropdown: every theme a disc of its colours in one gallery, one of them
 * ringed, and the backgrounds as a row to swipe along. Every pick repaints
 * the site behind the open sheet, so the visitor can try one after another.
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
      <div className="flex flex-col gap-5">
        <Section label={t.common.menu.themes}>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            aria-label={t.common.menu.themes}
            className="grid grid-cols-4 gap-x-2 gap-y-2"
          >
            {THEMES.map((option) => (
              <ThemeDisc key={option.value} {...option} />
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

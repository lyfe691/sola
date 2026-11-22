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
import { SystemSwatch, ThemeSwatch } from "./theme-swatch";
import { BarDrawer } from "@/components/bar-drawer";
import { MenuHint } from "@/components/menu-hint";
import { useBackground } from "@/components/backgrounds/background-provider";
import { buildBackgroundOptions } from "@/components/backgrounds/registry";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { Switch } from "@/components/ui/switch";
import { THEMES } from "@/config/themes";
import { useTranslation } from "@/lib/language-provider";

const STANDARD = THEMES.filter((option) => !option.isCustom);
const CUSTOM = THEMES.filter((option) => option.isCustom);

/** A section's name over its options; a group of them points at it by id. */
function Section({
  id,
  label,
  hint,
  children,
}: {
  id?: string;
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center gap-1.5 px-1">
        <p id={id} className="text-xs text-muted-foreground">
          {label}
        </p>
        {hint}
      </div>
      {children}
    </section>
  );
}

/**
 * A theme to pick: the page in its colours, its name beneath. Hover can't
 * preview a theme on touch, so the tile is the preview.
 */
function ThemeTile({ value, label }: (typeof THEMES)[number]) {
  return (
    <Radio.Root
      value={value}
      className="group/tile flex min-w-0 cursor-pointer flex-col items-center gap-2 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      {/* the picture is the preview; the name below names the radio */}
      <span
        aria-hidden="true"
        className="block w-full rounded-2xl ring-offset-2 ring-offset-popover transition-shadow duration-200 group-data-checked/tile:ring-2 group-data-checked/tile:ring-primary"
      >
        {value === "system" ? (
          <SystemSwatch />
        ) : (
          <ThemeSwatch themeClass={value} className="w-full" />
        )}
      </span>
      <span className="max-w-full truncate text-xs text-muted-foreground transition-colors group-data-checked/tile:font-medium group-data-checked/tile:text-foreground">
        {label}
      </span>
    </Radio.Root>
  );
}

/**
 * The theme menu on a phone. Every pick repaints the site behind the open
 * sheet, so the visitor can try one after another before closing it.
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
  const themesId = useId();
  const backgroundsId = useId();

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
        <RadioGroup
          value={theme}
          onValueChange={setTheme}
          aria-labelledby={themesId}
          className="flex flex-col gap-5"
        >
          <Section id={themesId} label={t.common.menu.themes}>
            <div className="grid grid-cols-3 gap-3">
              {STANDARD.map((option) => (
                <ThemeTile key={option.value} {...option} />
              ))}
            </div>
          </Section>
          <Section label={t.common.menu.customThemes}>
            <div className="grid grid-cols-3 gap-3">
              {CUSTOM.map((option) => (
                <ThemeTile key={option.value} {...option} />
              ))}
            </div>
          </Section>
        </RadioGroup>

        <Section
          id={backgroundsId}
          label={t.common.menu.background}
          hint={<MenuHint text={t.common.backgroundHints.section} />}
        >
          <RadioGroup
            value={background}
            onValueChange={setBackground}
            aria-labelledby={backgroundsId}
            className="flex flex-wrap gap-2"
          >
            {buildBackgroundOptions(t.common.none).map(({ id, label }) => (
              <Radio.Root
                key={id}
                value={id}
                className="inline-flex h-9 cursor-pointer items-center rounded-full bg-muted px-3.5 text-sm text-foreground outline-none transition-colors not-data-checked:hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-checked:text-primary-foreground"
              >
                {label}
              </Radio.Root>
            ))}
          </RadioGroup>
        </Section>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-muted p-3.5">
          <CodeIcon
            className="size-5 text-muted-foreground"
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

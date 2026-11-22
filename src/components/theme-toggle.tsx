/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  lazy,
  Suspense,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Collapsible } from "@base-ui/react/collapsible";
import {
  CaretRightIcon,
  CodeIcon,
  ImageIcon,
  PaletteIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, type MotionStyle } from "motion/react";
import { useTheme } from "./theme-provider";
import { THEMES, type ThemeIcon } from "@/config/themes";
import { useBackground } from "@/components/backgrounds/background-provider";
import { buildBackgroundOptions } from "@/components/backgrounds/registry";
import { MenuHint } from "@/components/menu-hint";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { DiffHintContent } from "@/components/deploy-diff/diff-hint";
import { useIsDarkScheme } from "@/components/deploy-diff/use-scheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { barButton } from "@/components/bar-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/utils/transitions";

// a phone's sheet is its own chunk: wider screens never load it
const ThemeDrawer = lazy(() =>
  import("./theme-drawer").then((module) => ({
    default: module.ThemeDrawer,
  })),
);

// a highlighted row inks everything in it: an icon keeps its own colour
const ICON = "text-muted-foreground! **:text-muted-foreground!";
const LABEL = "font-normal in-data-checked:text-muted-foreground!";

/**
 * A row that folds its rows away. A folded panel is unmounted, so the menu's
 * arrow keys never land on a row that is not showing.
 */
function Branch({
  icon: Icon,
  label,
  hint,
  defaultOpen,
  children,
}: {
  icon: ThemeIcon;
  label: string;
  hint?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <Collapsible.Root defaultOpen={defaultOpen}>
      <div className="flex items-center">
        <Collapsible.Trigger
          nativeButton={false}
          role="menuitem"
          render={
            <DropdownMenuItem closeOnClick={false} className="min-w-0 flex-1" />
          }
        >
          <CaretRightIcon
            className={cn(
              ICON,
              "size-3.5 transition-transform duration-200 ease-out group-data-panel-open/dropdown-menu-item:rotate-90",
            )}
          />
          <Icon className={ICON} aria-hidden="true" />
          <span className="truncate">{label}</span>
        </Collapsible.Trigger>
        {hint && <span className="flex px-2">{hint}</span>}
      </div>

      <Collapsible.Panel className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
        <div className="ml-4.5 flex flex-col gap-0.5 border-l border-border/60 pt-0.5 pb-1 pl-1.5">
          {children}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

/**
 * A miniature page wearing a theme's class, so every colour is that theme's
 * own token. The class is required even for light: the preview is portaled
 * under <html>, which carries the active theme.
 */
function ThemeSwatch({
  themeClass,
  className,
}: {
  themeClass: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        themeClass,
        "w-[136px] flex-none rounded-2xl border border-foreground/10 bg-background p-2.5 transition-colors",
        className,
      )}
    >
      <p className="font-heading text-sm font-semibold text-foreground transition-colors">
        Aa
      </p>
      <div className="mt-1.5 h-1 w-3/4 rounded-full bg-muted-foreground/40 transition-colors" />
      <div className="mt-1 h-1 w-1/2 rounded-full bg-muted-foreground/25 transition-colors" />
      <div className="mt-2.5 flex items-center gap-1">
        <span className="h-3.5 flex-1 rounded-md bg-primary transition-colors" />
        <span className="h-3.5 w-5 rounded-md border border-foreground/10 bg-accent transition-colors" />
        <span className="size-3.5 rounded-full border border-foreground/10 bg-secondary transition-colors" />
      </div>
    </div>
  );
}

type Preview = { value: string; top: number; right: number };

/**
 * One preview for the whole theme tree: it glides to the row it is about and
 * its swatch changes theme in place. System shows light and dark side by
 * side. It hangs outside the menu, which clips, so it is portaled.
 */
function ThemePreview({ preview }: { preview: Preview | null }) {
  const isSystem = preview?.value === "system";

  return createPortal(
    <AnimatePresence>
      {preview && (
        <motion.div
          initial={{ opacity: 0, x: 6, y: preview.top }}
          animate={{ opacity: 1, x: 0, y: preview.top }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          style={{ "--right": `${preview.right}px` } as MotionStyle}
          className="pointer-events-none fixed top-0 right-(--right) z-50"
        >
          <div className="flex w-max -translate-y-1/2 rounded-3xl bg-popover p-1 shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10">
            <ThemeSwatch themeClass={isSystem ? "light" : preview.value} />
            <div
              className={cn(
                "overflow-hidden transition-[width,opacity]",
                isSystem ? "w-[140px] opacity-100" : "w-0 opacity-0",
              )}
            >
              <ThemeSwatch themeClass="dark" className="ml-1" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const { active: background, setActive: setBackground } = useBackground();
  const { active: codeView, setActive: setCodeView } = useCodeView();
  const t = useTranslation();
  const [preview, setPreview] = useState<Preview | null>(null);

  const previewRowOf = (target: Element, tree: HTMLElement) => {
    const row = target.closest<HTMLElement>("[data-preview]");
    if (!row?.dataset.preview) return setPreview(null);
    const box = row.getBoundingClientRect();
    setPreview({
      value: row.dataset.preview,
      top: box.top + box.height / 2,
      right: window.innerWidth - tree.getBoundingClientRect().left + 12,
    });
  };

  const themeRow = ({ value, label, icon: Icon }: (typeof THEMES)[number]) => (
    <DropdownMenuRadioItem
      key={value}
      value={value}
      closeOnClick={false}
      data-preview={value}
    >
      <span
        className={cn(
          value === "system" ? "bg-muted" : [value, "bg-background"],
          "flex size-6 items-center justify-center rounded-lg ring-1 ring-foreground/10",
        )}
      >
        <Icon
          className="size-3.5 text-primary! **:text-primary!"
          aria-hidden="true"
        />
      </span>
      <span className={LABEL}>{label}</span>
    </DropdownMenuRadioItem>
  );

  return (
    <>
      {/* a tap fires an emulated hover and a focus, which flashed the preview
          on every pick: only a real mouse or keyboard focus opens it */}
      <div
        onPointerOver={(event) => {
          if (event.pointerType === "mouse")
            previewRowOf(event.target as Element, event.currentTarget);
        }}
        onPointerLeave={() => setPreview(null)}
        onFocus={(event) => {
          if (event.target.matches(":focus-visible"))
            previewRowOf(event.target, event.currentTarget);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setPreview(null);
        }}
      >
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <Branch icon={PaletteIcon} label={t.common.menu.themes} defaultOpen>
            {THEMES.filter((option) => !option.isCustom).map(themeRow)}
            <Branch icon={SparkleIcon} label={t.common.menu.customThemes}>
              {THEMES.filter((option) => option.isCustom).map(themeRow)}
            </Branch>
          </Branch>
        </DropdownMenuRadioGroup>
        <ThemePreview preview={preview} />
      </div>

      <DropdownMenuRadioGroup value={background} onValueChange={setBackground}>
        <Branch
          icon={ImageIcon}
          label={t.common.menu.background}
          hint={<MenuHint text={t.common.backgroundHints.section} />}
        >
          {buildBackgroundOptions(t.common.none).map(({ id, label }) => (
            <DropdownMenuRadioItem key={id} value={id} closeOnClick={false}>
              <span className={LABEL}>{label}</span>
            </DropdownMenuRadioItem>
          ))}
        </Branch>
      </DropdownMenuRadioGroup>

      <DropdownMenuSeparator />

      <HoverCard>
        <HoverCardTrigger
          delay={250}
          render={
            <DropdownMenuItem
              role="menuitemcheckbox"
              aria-checked={codeView}
              onClick={() => setCodeView(!codeView)}
            />
          }
        >
          <CodeIcon className={ICON} aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">
            {t.common.diff.showDiff}
          </span>
          {/* the row is the control: the switch only shows its state */}
          <span inert className="flex">
            <Switch size="sm" checked={codeView} />
          </span>
        </HoverCardTrigger>
        <DiffHintContent side="left" sideOffset={8} />
      </HoverCard>
    </>
  );
}

/** The sun or moon of the scheme in use, turning from one into the other. */
function ThemeTriggerIcon() {
  const { theme } = useTheme();
  const isDark = useIsDarkScheme();
  const shown = theme === "system" ? (isDark ? "dark" : "light") : theme;

  return THEMES.map(({ value, icon: Icon }) =>
    value === "system" ? null : (
      <Icon
        key={value}
        aria-hidden="true"
        className={cn(
          "absolute size-4 transition-[rotate,scale,opacity] duration-200",
          value === shown
            ? "scale-100 rotate-0 opacity-100"
            : "scale-90 rotate-90 opacity-0",
        )}
      />
    ),
  );
}

/** Wider screens: a dropdown under the bar, a preview beside each theme. */
function ThemeDropdown({ trigger }: { trigger: ReactElement }) {
  const t = useTranslation();
  const [open, setOpen] = useState(false);
  const { active: codeView } = useCodeView();

  // the bar leaves for the code view only after its own fade, so the menu
  // closes with the flip and not with the bar
  return (
    <DropdownMenu open={open && !codeView} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger render={<DropdownMenuTrigger render={trigger} />} />
        <TooltipContent side="bottom">
          {t.common.command.groups.theme}
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        align="end"
        glide
        className="min-w-56"
        // `d` is the code view's shortcut everywhere, and the diff row's card
        // says so: it must not become the menu's type-to-find for "Dark"
        onKeyDown={(event) => {
          if (event.key.toLowerCase() === "d") event.preventBaseUIHandler();
        }}
      >
        <ThemeMenu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeToggle({ floating }: { floating?: boolean }) {
  const t = useTranslation();
  const isMobile = useIsMobile();
  const trigger = (
    <Button
      {...barButton(floating)}
      aria-label={t.common.a11y.toggleTheme}
      data-callout="theme"
    >
      <ThemeTriggerIcon />
    </Button>
  );

  // until the sheet's chunk is in, the button stands without it
  return isMobile ? (
    <Suspense fallback={trigger}>
      <ThemeDrawer trigger={trigger} />
    </Suspense>
  ) : (
    <ThemeDropdown trigger={trigger} />
  );
}

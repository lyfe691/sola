/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { SearchRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { useTheme } from "./theme-provider";
import { useLanguage, useTranslation } from "@/lib/language-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBackground } from "@/components/backgrounds/background-provider";
import { MenuHint } from "@/components/menu-hint";
import { PROJECTS } from "@/config/projects";
import { EVERY_PROJECT, SKILL_GROUPS, projectsUsing } from "@/config/skills";
import type { SiteDoc } from "@/lib/search/sources";
import type { Translation } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { ResultRow } from "./command-palette/results";
import { ResultPreview } from "./command-palette/preview";
import {
  useSiteSearch,
  type GroupKind,
} from "./command-palette/use-site-search";

export function CommandMenu() {
  const t = useTranslation();
  const { isOpen, closeCommandMenu } = useCommandMenu();
  useWindowScrollLock(isOpen);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) closeCommandMenu();
        }}
        showSwipeHandle
      >
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>{t.common.command.placeholder}</DrawerTitle>
          </DrawerHeader>
          <Palette mobile />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={closeCommandMenu}
      // sr-only dialog name — the defaults in ui/command.tsx are English-only
      title={t.common.a11y.commandPalette}
      description={t.common.a11y.commandPaletteHint}
      className="sm:max-w-2xl lg:max-w-4xl"
    >
      <Palette mobile={false} />
    </CommandDialog>
  );
}

const groupLabels = (t: Translation): Record<GroupKind, string> => ({
  page: t.common.command.groups.navigation,
  project: t.nav.projects,
  section: t.common.command.groups.sections,
  skill: t.nav.skills,
  experience: t.nav.experience,
  certification: t.certifications.title,
  service: t.nav.services,
  theme: t.common.command.groups.theme,
  language: t.common.command.groups.language,
  background: t.common.command.groups.background,
});

/** a few things worth typing: two projects and the skill used most */
const suggestionsFor = (t: Translation): string[] => {
  const skills = SKILL_GROUPS.flatMap((group) => group.skills)
    .filter((skill) => !EVERY_PROJECT.has(skill.name))
    .sort(
      (a, b) => projectsUsing(b.name).length - projectsUsing(a.name).length,
    );
  return [
    ...PROJECTS.slice(0, 2).map(
      (project) => t.projects.list[project.i18nKey].title,
    ),
    ...skills.slice(0, 1).map((skill) => skill.name),
  ];
};

/**
 * The search and its results. It lives inside the dialog, so it unmounts
 * when the dialog closes and every open starts from an empty field.
 */
function Palette({ mobile }: { mobile: boolean }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const { closeCommandMenu } = useCommandMenu();
  const { active: codeView, setActive: setCodeView } = useCodeView();
  const { active: activeBackground, setActive: setBackground } =
    useBackground();

  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("");

  const diffLabel = codeView ? t.common.diff.exit : t.common.diff.showDiff;
  const actions = useMemo<SiteDoc[]>(
    () => [
      {
        kind: "action",
        action: "diff",
        id: "action:diff",
        title: diffLabel,
        keywords: ["diff", "git", "code"],
      },
    ],
    [diffLabel],
  );
  const { groups, searching } = useSiteSearch(query, actions);
  const labels = groupLabels(t);
  const headings: Record<GroupKind, ReactNode> = {
    ...labels,
    background: (
      <span className="inline-flex items-center gap-1.5">
        <span>{labels.background}</span>
        <MenuHint text={t.common.backgroundHints.section} />
      </span>
    ),
  };

  const isCurrent = (doc: SiteDoc) =>
    (doc.kind === "theme" && doc.value === theme) ||
    (doc.kind === "language" && doc.value === language) ||
    (doc.kind === "background" && doc.value === activeBackground);

  // settings apply in place so they can be tried one after another; only
  // what takes you somewhere closes the palette
  const run = (doc: SiteDoc) => {
    switch (doc.kind) {
      case "theme":
        setTheme(doc.value);
        return;
      case "language":
        setLanguage(doc.value);
        return;
      case "background":
        setBackground(doc.value);
        return;
      case "action":
        closeCommandMenu();
        setCodeView(!codeView);
        return;
      default:
        closeCommandMenu();
        navigate(doc.to);
    }
  };

  const active =
    groups
      .flatMap((group) => group.hits.map((hit) => ({ hit, kind: group.kind })))
      .find(({ hit }) => hit.doc.id === activeId) ??
    (groups[0] && { hit: groups[0].hits[0], kind: groups[0].kind });
  const empty = searching && groups.length === 0;
  // one height whatever the results; on a short window it gives way, so the
  // dialog (a third of the way down) still ends above the fold
  const height = mobile ? "h-[55dvh]" : "h-[min(26rem,calc(66dvh-8rem))]";

  const list = (
    <CommandList
      className={cn(
        "scroll-fade max-h-none",
        mobile ? height : "h-full",
        !mobile && "w-full lg:w-[22rem] lg:shrink-0",
      )}
    >
      {groups.map((group) => (
        <CommandGroup key={group.kind} heading={headings[group.kind]}>
          {group.hits.map((hit) => (
            <CommandItem
              key={hit.doc.id}
              value={hit.doc.id}
              data-checked={isCurrent(hit.doc) ? "true" : undefined}
              onSelect={() => run(hit.doc)}
            >
              <ResultRow hit={hit} quoteBesidePreview={!mobile} />
            </CommandItem>
          ))}
        </CommandGroup>
      ))}
    </CommandList>
  );

  const nothingFound = (
    <div className={cn("grid place-items-center px-6", height)}>
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-foreground/10">
          <HugeiconsIcon
            icon={SearchRemoveIcon}
            strokeWidth={1.8}
            className="size-5"
          />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">
            {t.common.command.noResultsFor.replace("{query}", query.trim())}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.common.command.noResultsHint}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {suggestionsFor(t).map((suggestion) => (
            <Button
              key={suggestion}
              variant="secondary"
              size="xs"
              onClick={() => setQuery(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Command
      shouldFilter={false}
      loop
      value={active?.hit.doc.id ?? ""}
      onValueChange={setActiveId}
      className={
        mobile
          ? // eslint-disable-next-line shadcn/no-restyle -- the drawer is the surface; the palette sits flush in it
            "h-auto min-h-0 rounded-none bg-transparent p-3 pb-4"
          : undefined
      }
    >
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder={t.common.command.placeholder}
        // eslint-disable-next-line shadcn/no-restyle -- 16px on phones, or iOS zooms into the field
        className={mobile ? "text-base" : undefined}
      />
      {empty ? (
        nothingFound
      ) : mobile ? (
        list
      ) : (
        <div className={cn("flex min-h-0", height)}>
          {list}
          <div className="hidden min-h-0 min-w-0 flex-1 overflow-hidden border-l border-border/50 lg:block">
            <ResultPreview
              hit={active?.hit}
              heading={active ? labels[active.kind] : ""}
            />
          </div>
        </div>
      )}
      {!mobile && (
        <div className="-mx-1 -mb-1 mt-1 flex items-center gap-4 border-t border-border/50 px-4 py-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <KbdGroup>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
            </KbdGroup>
            <span>{t.common.command.footer.navigate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            <span>{t.common.command.footer.select}</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Kbd>esc</Kbd>
            <span>{t.common.command.footer.close}</span>
          </div>
        </div>
      )}
    </Command>
  );
}

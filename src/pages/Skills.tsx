/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, type CSSProperties, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useTranslation } from "@/lib/language-provider";
import {
  EVERY_PROJECT,
  SKILL_GROUPS,
  projectsUsing,
  type Proficiency,
  type Skill,
  type SkillGroup,
} from "@/config/skills";
import { PROJECTS } from "@/config/projects";
import { Reveal } from "@/components/Reveal";
import {
  SkillCards,
  SkillCardTrigger,
  SkillDrawer,
  SkillTile,
} from "@/components/skills/SkillProjects";
import { useIsMobile } from "@/hooks/use-mobile";
import { countLabel } from "@/lib/plural";
import { cn } from "@/lib/utils";

// the level word steps down in tone with the level, but never below what
// small type needs to stay readable on the page
const LEVEL_TONE: Record<Proficiency, string> = {
  5: "text-foreground/90",
  4: "text-foreground/78",
  3: "text-foreground/66",
  2: "text-foreground/56",
  1: "text-foreground/50",
};

const ROW =
  "group flex w-full min-w-0 items-center gap-3 rounded-2xl px-2 py-2 text-left";
// desktop rows only show the hover card; phone rows are tapped for the drawer
const HOVERABLE =
  "transition-colors duration-200 ease-out can-hover:hover:bg-muted data-active:bg-muted";
const PRESSABLE =
  "cursor-pointer touch-manipulation select-none transition-[background-color,scale] duration-200 ease-out active:scale-[0.99] active:bg-muted";

function SkillRowBody({
  skill,
  usage,
  tappable,
}: {
  skill: Skill;
  usage: string | null;
  /** a phone row opens the drawer: it carries the chevron that says so. A
      desktop row only shows its card on hover, and a chevron on some rows
      and not others read as a ragged column of arrows going nowhere */
  tappable: boolean;
}) {
  const t = useTranslation().skills;

  return (
    <>
      <SkillTile skill={skill} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm-plus leading-5 font-medium text-foreground">
          {skill.name}
        </span>
        <span className="mt-0.5 block truncate text-xs leading-4 text-muted-foreground">
          <span className={LEVEL_TONE[skill.level]}>
            {t.levels[skill.level]}
          </span>
          {usage ? ` · ${usage}` : null}
        </span>
      </span>
      {tappable ? (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground/50"
        />
      ) : null}
    </>
  );
}

function SkillRow({
  skill,
  isMobile,
  onOpen,
}: {
  skill: Skill;
  isMobile: boolean;
  onOpen: (skill: Skill) => void;
}) {
  const t = useTranslation().skills;
  const everywhere = EVERY_PROJECT.has(skill.name);
  const count = everywhere ? 0 : projectsUsing(skill.name).length;
  const usage = everywhere
    ? t.everyProject
    : count > 0
      ? countLabel(count, t.projectCountOne, t.projectCount)
      : null;
  const body = (
    <SkillRowBody
      skill={skill}
      usage={usage}
      tappable={isMobile && count > 0}
    />
  );

  let row: ReactNode;
  if (!isMobile) {
    row = (
      <SkillCardTrigger
        skill={skill}
        openable={count > 0}
        className={cn(ROW, count > 0 && HOVERABLE)}
      >
        {body}
      </SkillCardTrigger>
    );
  } else if (count === 0) {
    row = <div className={ROW}>{body}</div>;
  } else {
    row = (
      <button
        type="button"
        onClick={() => onOpen(skill)}
        className={cn(ROW, PRESSABLE)}
      >
        {body}
      </button>
    );
  }

  return <li className="min-w-0">{row}</li>;
}

const MOST_USED_COUNT = 8;

// every skill some project uses, most used first. Skills in every project
// (git) are left out: a bar that is always full says nothing
const MOST_USED = SKILL_GROUPS.flatMap((group) => group.skills)
  .filter((skill) => !EVERY_PROJECT.has(skill.name))
  .map((skill) => ({ skill, count: projectsUsing(skill.name).length }))
  .filter(({ count }) => count > 0)
  .sort((a, b) => b.count - a.count)
  .slice(0, MOST_USED_COUNT);

/**
 * What the page opens on: the skills the projects on this site use most,
 * ranked. It is counted from the projects themselves, so it is the one part
 * of the page that is evidence rather than self-assessment, and it stays
 * true as projects are added. Bars are scaled to the longest.
 */
function MostUsed() {
  const t = useTranslation().skills;
  const longest = MOST_USED[0]?.count ?? 1;

  return (
    <Reveal
      as="section"
      className="mb-12 rounded-4xl bg-card p-6 shadow-md ring-1 ring-foreground/5 sm:p-8 dark:ring-foreground/10"
    >
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-lg font-semibold">{t.mostUsed}</h2>
        <p className="text-sm text-muted-foreground">
          {t.mostUsedNote.replace("{count}", String(PROJECTS.length))}
        </p>
      </div>
      <ol className="grid grid-flow-row grid-cols-1 gap-x-12 gap-y-4 md:grid-flow-col md:grid-cols-2 md:grid-rows-4">
        {MOST_USED.map(({ skill, count }) => (
          <li key={skill.name} className="flex min-w-0 items-center gap-3">
            <SkillTile skill={skill} className="size-9 rounded-lg" />
            <span className="w-28 shrink-0 truncate text-sm-plus font-medium sm:w-32">
              {skill.name}
            </span>
            <span
              aria-hidden="true"
              className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
            >
              <span
                className="block h-full w-(--share) rounded-full bg-primary"
                style={
                  {
                    "--share": `${Math.round((count / longest) * 100)}%`,
                  } as CSSProperties
                }
              />
            </span>
            <span className="w-6 shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground">
              <span className="sr-only">
                {countLabel(count, t.projectCountOne, t.projectCount)}
              </span>
              <span aria-hidden="true">{count}</span>
            </span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

function SkillSection({
  group,
  title,
  isMobile,
  onOpen,
}: {
  group: SkillGroup;
  title: string;
  isMobile: boolean;
  onOpen: (skill: Skill) => void;
}) {
  return (
    <Reveal as="section" className="mb-12 min-w-0 break-inside-avoid">
      <h2 className="mb-3 flex items-baseline gap-3 text-lg font-semibold">
        {title}
        <span className="font-mono text-xs font-normal tabular-nums text-muted-foreground">
          {String(group.skills.length).padStart(2, "0")}
        </span>
      </h2>
      <ul className="-mx-2 flex flex-col gap-0.5">
        {group.skills.map((skill) => (
          <SkillRow
            key={skill.name}
            skill={skill}
            isMobile={isMobile}
            onOpen={onOpen}
          />
        ))}
      </ul>
    </Reveal>
  );
}

const Skills = () => {
  const t = useTranslation();
  const groups = t.skills.groups as Record<string, string>;
  const isMobile = useIsMobile();
  // the drawer keeps the last skill while it slides shut, so it never empties
  const [picked, setPicked] = useState<Skill | null>(null);
  const [open, setOpen] = useState(false);

  const openSkill = (skill: Skill) => {
    setPicked(skill);
    setOpen(true);
  };

  return (
    <div className="flex w-full flex-col">
      <meta name="description" content={t.seo.skills.description} />

      <Reveal as="h1" className="mb-4 text-4xl font-bold">
        {t.skills.title}
      </Reveal>
      <Reveal as="p" className="mb-12 max-w-2xl text-foreground/60">
        {t.skills.subtitle}
      </Reveal>

      <MostUsed />

      <SkillCards enabled={!isMobile}>
        {/* columns, not a grid: the groups differ in length, and a grid
            row is as tall as its longest, which left holes under the short
            ones. Flowed down balanced columns they pack */}
        <div className="columns-1 gap-x-10 md:columns-2 xl:columns-3">
          {SKILL_GROUPS.map((group) => (
            <SkillSection
              key={group.id}
              group={group}
              title={groups[group.id] ?? group.id}
              isMobile={isMobile}
              onOpen={openSkill}
            />
          ))}
        </div>
      </SkillCards>

      <SkillDrawer
        skill={picked}
        open={open && isMobile}
        onOpenChange={setOpen}
      />
    </div>
  );
};

export default Skills;

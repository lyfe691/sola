/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, type ReactNode } from "react";
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

const LEVEL_TONE: Record<Proficiency, string> = {
  5: "text-foreground/80",
  4: "text-foreground/65",
  3: "text-foreground/50",
  2: "text-foreground/40",
  1: "text-foreground/35",
};

const ROW =
  "group flex w-full min-w-0 items-center gap-3 rounded-2xl px-2 py-2 text-left";
const PRESSABLE =
  "cursor-pointer touch-manipulation select-none transition-[background-color,scale] duration-200 ease-out can-hover:hover:bg-muted/50 data-popup-open:bg-muted/50 active:scale-[0.99]";

function SkillRowBody({
  skill,
  usage,
  openable,
}: {
  skill: Skill;
  usage: string | null;
  openable: boolean;
}) {
  const t = useTranslation().skills;

  return (
    <>
      <SkillTile skill={skill} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] leading-5 font-medium text-foreground">
          {skill.name}
        </span>
        <span className="mt-0.5 block truncate text-xs leading-4 text-muted-foreground">
          <span className={LEVEL_TONE[skill.level]}>
            {t.levels[skill.level]}
          </span>
          {usage ? ` · ${usage}` : null}
        </span>
      </span>
      {openable ? (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground/50 transition-[translate,color] duration-200 ease-out group-data-popup-open:text-foreground can-hover:group-hover:translate-x-0.5 can-hover:group-hover:text-foreground"
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
    <SkillRowBody skill={skill} usage={usage} openable={count > 0} />
  );

  let row: ReactNode;
  if (count === 0) {
    row = <div className={ROW}>{body}</div>;
  } else if (isMobile) {
    row = (
      <button
        type="button"
        onClick={() => onOpen(skill)}
        className={cn(ROW, PRESSABLE)}
      >
        {body}
      </button>
    );
  } else {
    row = (
      <SkillCardTrigger skill={skill} className={cn(ROW, PRESSABLE)}>
        {body}
      </SkillCardTrigger>
    );
  }

  return <li className="min-w-0">{row}</li>;
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
    <Reveal as="section" className="min-w-0">
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

      <SkillCards enabled={!isMobile}>
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
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

      {picked ? (
        <SkillDrawer
          skill={picked}
          open={open && isMobile}
          onOpenChange={setOpen}
        />
      ) : null}
    </div>
  );
};

export default Skills;

/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useLanguage, useTranslation } from "@/lib/language-provider";
import { CyclingText } from "@/components/ui/custom/cycling-text";
import { NameMorpher } from "@/components/ui/custom/name-morpher";
import { SpecularButton } from "@/components/ui/custom/specular-button";
import { ChevronToArrowIcon } from "@/components/ui/custom/chevron-to-arrow";
import {
  SOCIAL_BRAND_FILL,
  SOCIAL_LINKS,
  SOCIAL_ORDER_HERO,
  type SocialId,
} from "@/config/social";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/locale-router";
import { Reveal } from "@/components/Reveal";

function SocialLink({ id }: { id: SocialId }) {
  const social = SOCIAL_LINKS[id];
  const Icon = social.icon;

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      data-brand={id}
      className={cn(
        "group relative inline-flex items-center overflow-hidden rounded-xl bg-foreground/[0.07] text-foreground/60 ring-[1.5px] ring-foreground/8 ring-inset outline-none transition-[color,background-color,border-color,scale] duration-200 ease-out will-change-transform transform-gpu active:scale-97",
        "md:rounded-full md:border md:border-foreground/10 md:bg-foreground/5 md:shadow-xs md:ring-0 md:duration-400 md:ease-smooth",
        "focus-visible:border-transparent focus-visible:bg-(--brand-fill) focus-visible:text-(--brand-ink) focus-visible:ring-2 focus-visible:ring-ring/50",
        SOCIAL_BRAND_FILL,
      )}
    >
      {/* fixed icon zone — the icon is centered, never pixel-pinned */}
      <span className="flex size-10 shrink-0 items-center justify-center md:size-12">
        <Icon className="size-5 md:size-6" aria-hidden="true" />
      </span>
      {/* width-to-measure reveal: the grid track grows 0fr -> 1fr so the pill
          fits whatever the label renders at — no char-count width map. One
          in-out curve: a closing pill mirrors its opening neighbour */}
      <span className="hidden md:grid md:grid-cols-[0fr] md:transition-[grid-template-columns] md:duration-400 md:ease-smooth md:group-focus-visible:grid-cols-[1fr] md:can-hover:group-hover:grid-cols-[1fr]">
        <span className="overflow-hidden">
          <span className="block pr-5 text-sm font-medium whitespace-nowrap opacity-0 transition-opacity duration-400 ease-smooth group-focus-visible:opacity-100 can-hover:group-hover:opacity-100">
            {social.label}
          </span>
        </span>
      </span>
    </a>
  );
}

const Index = () => {
  const { language } = useLanguage();
  const t = useTranslation();

  const descriptions = [
    t.index.description1,
    t.index.description2,
    t.index.description3,
    t.index.description4,
  ];

  // the hero arrives the way every page does: each block is a reveal, and
  // the queue brings them in from the top
  return (
    <div className="relative z-20 flex min-h-[calc(100vh-14rem)] flex-1 flex-col items-start justify-center pt-12 sm:pt-16 lg:pt-20">
      <meta name="description" content={t.seo.home.description} />

      <div className="flex w-full max-w-3xl flex-col md:max-w-4xl lg:max-w-5xl">
        <Reveal className="relative z-30 mb-2 sm:mb-3">
          <a
            href="https://kinoa.to"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground/3 px-2.5 py-1 whitespace-nowrap ring-1 ring-foreground/4 transition-[background-color,box-shadow] duration-300 hover:bg-foreground/5 hover:ring-foreground/6 sm:px-3.5 sm:py-1.5 dark:bg-foreground/5 dark:ring-foreground/8 dark:hover:bg-foreground/8 dark:hover:ring-foreground/12"
          >
            <span className="text-2xs font-medium text-foreground/50 transition-colors duration-300 group-hover:text-foreground/60 sm:text-xs-plus">
              {t.index.currentlyWorkingOn}
            </span>
            <span className="bg-linear-to-r from-foreground/50 via-foreground to-foreground/50 bg-size-[200%_100%] bg-clip-text text-2xs font-semibold text-transparent [background-position:100%_0%] can-hover:group-hover:animate-shine sm:text-xs-plus">
              Kinoa
            </span>
            <ChevronToArrowIcon className="size-3 text-foreground/40 transition-colors duration-300 group-hover:text-foreground/60 sm:size-3.5" />
          </a>
        </Reveal>

        <Reveal
          as="h1"
          className="mb-3 text-4xl font-bold break-keep text-balance sm:mb-4 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
        >
          <NameMorpher
            greeting={t.index.greeting}
            switchLabel={t.index.nameSwitch}
          />
        </Reveal>

        <Reveal className="mb-4 max-w-2xl text-base leading-relaxed text-foreground/70 sm:mb-5 sm:text-lg md:mb-8 md:max-w-3xl md:text-xl lg:max-w-4xl">
          <CyclingText key={language} texts={descriptions} />
        </Reveal>

        <Reveal className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8 sm:gap-4">
          <Link to="/contact" className="max-sm:flex-auto">
            <SpecularButton size="md" autoAnimate className="max-sm:w-full">
              {t.index.contactMe}
            </SpecularButton>
          </Link>
          <Link to="/projects" className="max-sm:flex-auto">
            <SpecularButton
              variant="secondary"
              size="md"
              autoAnimate
              className="max-sm:w-full"
            >
              {t.index.viewProjects}
            </SpecularButton>
          </Link>
        </Reveal>

        <Reveal className="flex flex-wrap items-center gap-3 sm:gap-4">
          {SOCIAL_ORDER_HERO.map((id) => (
            <SocialLink key={id} id={id} />
          ))}
        </Reveal>
      </div>
    </div>
  );
};

export default Index;

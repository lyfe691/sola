/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Link } from "react-router-dom";
import { Contact, FolderGit2 } from "lucide-react";
import { motion, LayoutGroup } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { CyclingTextEffect } from "@/components/ui/custom/text-effect-wrapper";
import { Helmet } from "react-helmet-async";
import { NameMorpher } from "@/components/ui/custom/name-morpher";
import { IconButton } from "@/components/ui/custom/icon-button";
import { ChevronToArrowIcon } from "@/components/ui/custom/chevron-to-arrow";
import {
  SOCIAL_LINKS,
  SOCIAL_ORDER_HERO,
  SOCIAL_ICONS,
  SOCIAL_HOVER_ACCENTS,
  type SocialId,
} from "@/config/social";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const homeAnimations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.9, staggerChildren: 0.12, delayChildren: 0.1 },
    },
  },
  badge: {
    hidden: { opacity: 0, y: -6, scale: 0.99 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.9, ease: EASE },
    },
  },
  heading: {
    hidden: { opacity: 0, x: -14 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.1, ease: EASE },
    },
  },
  description: {
    hidden: { opacity: 0, x: 14 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, ease: EASE },
    },
  },
  buttons: {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: EASE },
    },
  },
  ctaLeft: {
    hidden: { opacity: 0, x: -12 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: EASE },
    },
  },
  ctaRight: {
    hidden: { opacity: 0, x: 12 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: EASE },
    },
  },
  socialsContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, when: "beforeChildren" as const },
    },
  },
  socialItem: {
    hidden: (i: number) => ({ opacity: 0, x: i % 2 === 0 ? -10 : 10 }),
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: EASE },
    },
  },
} as const;

function socialHoverWidth(label: string) {
  if (label === "LeetCode") return "md:hover:w-32 lg:hover:w-32";
  if (label.length <= 5) return "md:hover:w-[6.3rem] lg:hover:w-[6.3rem]";
  if (label.length <= 7) return "md:hover:w-[6.8rem] lg:hover:w-[6.8rem]";
  if (label.length <= 8) return "md:hover:w-30 lg:hover:w-30";
  if (label.length <= 10) return "md:hover:w-34 lg:hover:w-34";
  return "md:hover:w-38 lg:hover:w-38";
}

function SocialLink({ id, index }: { id: SocialId; index: number }) {
  const social = SOCIAL_LINKS[id];
  const Icon = SOCIAL_ICONS[id];
  const hoverClass = SOCIAL_HOVER_ACCENTS[id];

  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      custom={index}
      variants={homeAnimations.socialItem}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-foreground/[0.07] text-foreground/60 ring-[1.5px] ring-foreground/8 ring-inset transition-all duration-200 ease-out will-change-transform transform-gpu",
        "size-10 active:scale-95 active:bg-foreground/12",
        "md:size-12 md:rounded-full md:border md:border-foreground/10 md:bg-foreground/5 md:shadow-xs md:ring-0 md:duration-500 md:active:scale-100",
        "hover:text-foreground",
        hoverClass,
        socialHoverWidth(social.label),
      )}
    >
      <div className="size-5 md:hidden">
        <Icon className="size-full" />
      </div>
      <div className="absolute top-[0.7rem] left-[11.47px] z-10 hidden size-6 items-center justify-center md:flex">
        <Icon className="size-full" />
      </div>
      <div className="pointer-events-none absolute top-1/2 right-1 left-12 hidden -translate-y-1/2 items-center md:flex">
        <span className="translate-x-4 text-sm font-medium whitespace-nowrap opacity-0 blur-xs transition-all duration-500 ease-out delay-100 group-hover:translate-x-0 group-hover:opacity-100 group-hover:blur-none">
          {social.label}
        </span>
      </div>
    </motion.a>
  );
}

const Index = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  const descriptions = [
    t.index.description1,
    t.index.description2,
    t.index.description3,
    t.index.description4,
  ];

  return (
    <motion.div
      className="relative z-20 flex min-h-[calc(100vh-14rem)] flex-1 flex-col items-start justify-center pt-12 sm:pt-16 lg:pt-20"
      variants={homeAnimations.container}
      initial="hidden"
      animate="show"
    >
      <Helmet>
        <title>{t.seo.home.title}</title>
        <meta name="description" content={t.seo.home.description} />
      </Helmet>

      <LayoutGroup>
        <motion.div
          layout
          className="flex w-full max-w-3xl flex-col md:max-w-4xl lg:max-w-5xl"
        >
          <motion.a
            layout
            variants={homeAnimations.badge}
            href="https://kinoa.to"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Kinoa"
            className="group relative z-30 mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground/3 px-2.5 py-1 whitespace-nowrap ring-1 ring-foreground/4 backdrop-blur-xs transition-all duration-300 hover:bg-foreground/5 hover:ring-foreground/6 sm:mb-3 sm:px-3.5 sm:py-1.5 dark:bg-foreground/5 dark:ring-foreground/8 dark:hover:bg-foreground/8 dark:hover:ring-foreground/12"
          >
            <span className="text-[11px] font-medium text-foreground/50 transition-colors duration-300 group-hover:text-foreground/60 sm:text-[13px]">
              {t.index.currentlyWorkingOn}
            </span>
            <span className="animate-[shine_4s_ease-in-out_infinite] bg-linear-to-r from-foreground/50 via-foreground to-foreground/50 bg-size-[200%_100%] bg-clip-text text-[11px] font-semibold text-transparent sm:text-[13px]">
              Kinoa
            </span>
            <ChevronToArrowIcon className="size-3 text-foreground/40 transition-colors duration-300 group-hover:text-foreground/60 sm:size-3.5" />
          </motion.a>

          <motion.h1
            layout
            variants={homeAnimations.heading}
            className="mb-3 text-4xl font-bold sm:mb-4 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
          >
            <NameMorpher greeting={`${t.index.greeting}\u00A0`} />
          </motion.h1>

          <motion.div
            variants={homeAnimations.description}
            className="mb-4 max-w-2xl text-base leading-relaxed text-foreground/70 sm:mb-5 sm:text-lg md:mb-8 md:max-w-3xl md:text-xl lg:max-w-4xl"
          >
            <CyclingTextEffect
              key={language}
              texts={descriptions}
              per="char"
              preset="blur"
              delay={0.1}
              speedReveal={4}
              displayDuration={3000}
              useCurve
            />
          </motion.div>

          <motion.div
            layout
            variants={homeAnimations.buttons}
            className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8 sm:gap-4"
          >
            <motion.div layout variants={homeAnimations.ctaLeft}>
              <Link to="/contact">
                <IconButton
                  icon={<Contact className="size-4" />}
                  variant="default"
                  size="lg"
                  label={t.index.contactMe}
                />
              </Link>
            </motion.div>
            <motion.div layout variants={homeAnimations.ctaRight}>
              <Link to="/projects">
                <IconButton
                  icon={<FolderGit2 className="size-4" />}
                  variant="secondary"
                  size="lg"
                  label={t.index.viewProjects}
                />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            layout
            variants={homeAnimations.socialsContainer}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            {SOCIAL_ORDER_HERO.map((id, index) => (
              <SocialLink key={id} id={id} index={index} />
            ))}
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </motion.div>
  );
};

export default Index;

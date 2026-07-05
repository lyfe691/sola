/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Link } from "react-router";
import { Contact, FolderGit2 } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
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
import { REVEAL } from "@/utils/transitions";

const homeAnimations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.08, delayChildren: 0.06 },
    },
  },
  badge: {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.48, ease: REVEAL },
    },
  },
  heading: {
    hidden: { opacity: 0, y: 20, scale: 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: REVEAL },
    },
  },
  description: {
    hidden: { opacity: 0, y: 18, scale: 0.99 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: REVEAL },
    },
  },
  buttons: {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.48, ease: REVEAL },
    },
  },
  ctaLeft: {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.48, ease: REVEAL },
    },
  },
  ctaRight: {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.48, ease: REVEAL },
    },
  },
  socialsContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07, when: "beforeChildren" as const },
    },
  },
  socialItem: {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: REVEAL },
    },
  },
} as const;

function socialHoverWidth(label: string) {
  if (label === "LeetCode")
    return "md:can-hover:hover:w-32 lg:can-hover:hover:w-32";
  if (label.length <= 5)
    return "md:can-hover:hover:w-[6.3rem] lg:can-hover:hover:w-[6.3rem]";
  if (label.length <= 7)
    return "md:can-hover:hover:w-[6.8rem] lg:can-hover:hover:w-[6.8rem]";
  if (label.length <= 8)
    return "md:can-hover:hover:w-30 lg:can-hover:hover:w-30";
  if (label.length <= 10)
    return "md:can-hover:hover:w-34 lg:can-hover:hover:w-34";
  return "md:can-hover:hover:w-38 lg:can-hover:hover:w-38";
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
        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-foreground/[0.07] text-foreground/60 ring-[1.5px] ring-foreground/8 ring-inset transition-[width,color] duration-200 ease-out will-change-transform transform-gpu",
        "size-10 active:bg-foreground/12",
        "md:size-12 md:rounded-full md:border md:border-foreground/10 md:bg-foreground/5 md:shadow-xs md:ring-0 md:duration-300",
        "hover:text-foreground",
        hoverClass,
        socialHoverWidth(social.label),
      )}
    >
      <div className="size-5 md:hidden">
        <Icon className="size-full" aria-hidden="true" />
      </div>
      <div className="absolute top-[0.7rem] left-[11.47px] z-10 hidden size-6 items-center justify-center md:flex">
        <Icon className="size-full" aria-hidden="true" />
      </div>
      <div className="pointer-events-none absolute top-1/2 right-1 left-12 hidden -translate-y-1/2 items-center md:flex">
        <span className="translate-x-4 text-sm font-medium whitespace-nowrap opacity-0 blur-xs transition-[transform,translate,scale,rotate,opacity,filter] duration-200 ease-out delay-100 can-hover:group-hover:translate-x-0 can-hover:group-hover:opacity-100 can-hover:group-hover:blur-none">
          {social.label}
        </span>
      </div>
    </motion.a>
  );
}

const Index = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  return (
    <motion.div
      className="relative z-20 flex min-h-[calc(100vh-14rem)] flex-1 flex-col items-start justify-center pt-12 sm:pt-16 lg:pt-20"
      variants={homeAnimations.container}
      initial="hidden"
      animate="show"
    >
      <meta name="description" content={t.seo.home.description} />

      <motion.div className="flex w-full max-w-3xl flex-col md:max-w-4xl lg:max-w-5xl">
        <motion.a
          variants={homeAnimations.badge}
          href="https://kinoa.to"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Kinoa"
          className="group relative z-30 mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground/3 px-2.5 py-1 whitespace-nowrap ring-1 ring-foreground/4 backdrop-blur-xs transition-[background-color,box-shadow] duration-300 hover:bg-foreground/5 hover:ring-foreground/6 sm:mb-3 sm:px-3.5 sm:py-1.5 dark:bg-foreground/5 dark:ring-foreground/8 dark:hover:bg-foreground/8 dark:hover:ring-foreground/12"
        >
          <span className="text-2xs font-medium text-foreground/50 transition-colors duration-300 group-hover:text-foreground/60 sm:text-[13px]">
            {t.index.currentlyWorkingOn}
          </span>
          <span className="bg-linear-to-r from-foreground/50 via-foreground to-foreground/50 bg-size-[200%_100%] bg-clip-text text-2xs font-semibold text-transparent [background-position:100%_0%] can-hover:group-hover:animate-shine sm:text-[13px]">
            Kinoa
          </span>
          <ChevronToArrowIcon className="size-3 text-foreground/40 transition-colors duration-300 group-hover:text-foreground/60 sm:size-3.5" />
        </motion.a>

        <motion.h1
          variants={homeAnimations.heading}
          className="mb-3 text-4xl font-bold sm:mb-4 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
        >
          <NameMorpher
            greeting={`${t.index.greeting}\u00A0`}
            switchLabel={t.index.nameSwitch}
          />
        </motion.h1>

        <motion.p
          variants={homeAnimations.description}
          className="mb-4 max-w-2xl text-base leading-relaxed text-foreground/70 sm:mb-5 sm:text-lg md:mb-8 md:max-w-3xl md:text-xl lg:max-w-4xl"
        >
          {t.index.description}
        </motion.p>

        <motion.div
          variants={homeAnimations.buttons}
          className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8 sm:gap-4"
        >
          <motion.div variants={homeAnimations.ctaLeft}>
            <Link to="/contact">
              <IconButton
                icon={<Contact className="size-4" />}
                variant="default"
                size="lg"
                label={t.index.contactMe}
              />
            </Link>
          </motion.div>
          <motion.div variants={homeAnimations.ctaRight}>
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
          variants={homeAnimations.socialsContainer}
          className="flex flex-wrap items-center gap-3 sm:gap-4"
        >
          {SOCIAL_ORDER_HERO.map((id, index) => (
            <SocialLink key={id} id={id} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Index;

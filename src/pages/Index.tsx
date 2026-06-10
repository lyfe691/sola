/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/* This is the main page, therefore called index */

import { Link } from "react-router-dom";
import { Mail, Linkedin, FolderGit2, Contact } from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import { motion, LayoutGroup } from "motion/react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { CyclingTextEffect } from "@/components/ui/custom/text-effect-wrapper";
import {
  SiChessdotcom,
  SiHackthebox,
  SiLeetcode,
  SiTiktok,
} from "react-icons/si";
import { Helmet } from "react-helmet-async";
import { NameMorpher } from "@/components/ui/custom/name-morpher";
import { IconButton } from "@/components/ui/custom/icon-button";
import { ChevronToArrowIcon } from "@/components/ui/custom/chevron-to-arrow";
import { SOCIAL_LINKS, SOCIAL_ORDER_HERO } from "@/config/social";

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
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  },
  heading: {
    hidden: { opacity: 0, x: -14 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
    },
  },
  description: {
    hidden: { opacity: 0, x: 14 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    },
  },
  buttons: {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  },
  ctaLeft: {
    hidden: { opacity: 0, x: -12 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  },
  ctaRight: {
    hidden: { opacity: 0, x: 12 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
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
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  },
} as const;

const Index = () => {
  const [, setKey] = useState(0);
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  const descriptions = [
    t.index.description1,
    t.index.description2,
    t.index.description3,
    t.index.description4,
  ];

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [language]);

  return (
    <motion.div
      className="relative z-20 flex flex-1 flex-col items-start justify-center pt-12 sm:pt-16 lg:pt-20"
      variants={homeAnimations.container}
      initial="hidden"
      animate="show"
    >
      <Helmet>
        <title>{t.seo.home.title}</title>
        <meta name="description" content={t.seo.home.description} />
      </Helmet>

      <LayoutGroup>
        <motion.div layout className="flex flex-col">
          <motion.div
            layout
            className="max-w-3xl md:max-w-4xl lg:max-w-5xl ml-0"
          >
            <motion.div
              layout
              variants={homeAnimations.badge}
              className="mb-2 sm:mb-3"
            >
              <a
                href="https://kinoa.to"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Kinoa"
                className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 relative z-30 whitespace-nowrap backdrop-blur-xs bg-foreground/3 dark:bg-foreground/5 ring-1 ring-foreground/4 dark:ring-foreground/8 transition-all duration-300 hover:bg-foreground/5 dark:hover:bg-foreground/8 hover:ring-foreground/6 dark:hover:ring-foreground/12"
              >
                <span className="text-[11px] sm:text-[13px] font-medium text-foreground/50 transition-colors duration-300 group-hover:text-foreground/60">
                  {t.index.currentlyWorkingOn}
                </span>
                <span className="text-[11px] sm:text-[13px] font-semibold text-transparent bg-clip-text bg-linear-to-r from-foreground/50 via-foreground to-foreground/50 bg-size-[200%_100%] animate-[shine_4s_ease-in-out_infinite]">
                  Kinoa
                </span>
                <ChevronToArrowIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-foreground/40 transition-colors duration-300 group-hover:text-foreground/60" />
              </a>
            </motion.div>
            <motion.h1
              layout
              variants={homeAnimations.heading}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6"
            >
              <NameMorpher greeting={`${t.index.greeting}\u00A0`} />
            </motion.h1>

            <motion.div
              variants={homeAnimations.description}
              className="text-foreground/70 leading-relaxed mb-4 sm:mb-5 md:mb-8 text-base sm:text-lg md:text-xl max-w-2xl md:max-w-3xl lg:max-w-4xl"
            >
              <CyclingTextEffect
                texts={descriptions}
                per="char"
                preset="blur"
                delay={0.1}
                speedReveal={4}
                displayDuration={3000}
                useCurve={true}
              />
            </motion.div>
          </motion.div>

          <motion.div
            layout
            className="max-w-3xl md:max-w-4xl lg:max-w-5xl ml-0"
            transition={{
              layout: { type: "spring", stiffness: 300, damping: 30 },
            }}
          >
            <motion.div
              layout
              variants={homeAnimations.buttons}
              className="flex flex-wrap gap-3 mb-6 sm:mb-8"
            >
              <motion.div
                layout
                className="flex flex-wrap items-center gap-3 sm:gap-4"
              >
                <motion.div layout variants={homeAnimations.ctaLeft}>
                  <Link to="/contact">
                    <IconButton
                      icon={<Contact className="w-4 h-4" />}
                      variant="default"
                      size="lg"
                      label={t.index.contactMe}
                    />
                  </Link>
                </motion.div>

                <motion.div layout variants={homeAnimations.ctaRight}>
                  <Link to="/projects">
                    <IconButton
                      icon={<FolderGit2 className="w-4 h-4" />}
                      variant="secondary"
                      size="lg"
                      label={t.index.viewProjects}
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              layout
              variants={homeAnimations.socialsContainer}
              initial="hidden"
              animate="show"
              className="flex flex-wrap items-center gap-3 sm:gap-4 mb-0 will-change-transform"
            >
              {SOCIAL_ORDER_HERO.map((id, index) => {
                const s = SOCIAL_LINKS[id];
                const icon =
                  id === "github" ? (
                    <FaGithubAlt className="w-full h-full" />
                  ) : id === "email" ? (
                    <Mail className="w-full h-full" />
                  ) : id === "linkedin" ? (
                    <Linkedin className="w-full h-full" />
                  ) : id === "leetcode" ? (
                    <SiLeetcode className="w-full h-full" />
                  ) : id === "hackthebox" ? (
                    <SiHackthebox className="w-full h-full" />
                  ) : id === "tiktok" ? (
                    <SiTiktok className="w-full h-full" />
                  ) : (
                    <SiChessdotcom className="w-full h-full" />
                  );
                const hoverClass =
                  id === "github"
                    ? "hover:border-foreground/30"
                    : id === "email"
                      ? "hover:bg-red-400/20 hover:border-red-400/30"
                      : id === "linkedin"
                        ? "hover:bg-cyan-400/20 hover:border-cyan-400/30"
                        : id === "leetcode"
                          ? "hover:bg-orange-400/20 hover:border-orange-400/30"
                          : id === "hackthebox"
                            ? "hover:bg-emerald-300/20 hover:border-emerald-400/30"
                            : id === "tiktok"
                              ? "hover:bg-pink-400/20 hover:border-pink-400/30"
                              : "hover:bg-green-400/20 hover:border-green-400/30";
                const label = s.label;
                const href = s.href;
                return (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    custom={index}
                    variants={homeAnimations.socialItem}
                    className={`group relative inline-flex items-center justify-center text-foreground/60 hover:text-foreground transition-all duration-200 ease-out overflow-hidden transform-gpu will-change-transform
                                  w-10 h-10 rounded-xl bg-foreground/[0.07] ring-[1.5px] ring-foreground/8 ring-inset active:scale-95 active:bg-foreground/12
                                  md:w-12 md:h-12 md:rounded-full md:ring-0 md:border md:border-foreground/10 md:bg-foreground/5 md:shadow-xs md:duration-500 md:active:scale-100 ${hoverClass}
                                  ${
                                    label === "LeetCode"
                                      ? "md:hover:w-32 lg:hover:w-32"
                                      : label.length <= 5
                                        ? "md:hover:w-[6.3rem] lg:hover:w-[6.3rem] "
                                        : label.length <= 7
                                          ? "md:hover:w-[6.8rem] lg:hover:w-[6.8rem]"
                                          : label.length <= 8
                                            ? "md:hover:w-30 lg:hover:w-30"
                                            : label.length <= 10
                                              ? "md:hover:w-34 lg:hover:w-34"
                                              : "md:hover:w-38 lg:hover:w-38"
                                  }
                                `}
                  >
                    <div className="md:hidden w-5 h-5">{icon}</div>

                    <div className="hidden md:flex absolute left-[11.47px] top-[0.7rem] w-6 h-6 items-center justify-center z-10">
                      {icon}
                    </div>

                    <div className="hidden md:flex absolute left-12 right-1 top-1/2 -translate-y-1/2 items-center pointer-events-none">
                      <span className="text-sm font-medium whitespace-nowrap opacity-0 blur-xs transform translate-x-4 group-hover:opacity-100 group-hover:blur-none group-hover:translate-x-0 transition-all duration-500 ease-out delay-100">
                        {label}
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </motion.div>
  );
};

export default Index;

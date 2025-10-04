/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/* This is the main page, therefore called index */

import { Link } from "react-router-dom";
import { Mail, Linkedin, FolderGit2, Contact } from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
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
import Navigation from "@/components/Navigation";
import {
  containerVariants,
  itemVariants,
  titleVariants,
  usePageInit,
} from "@/lib/transitions";
import { Helmet } from "react-helmet-async";
import { NameMorpher } from "@/components/ui/custom/name-morpher";
import { IconButton } from "@/components/ui/custom/icon-button";
// defer heavy background imports until needed
// import Threads from "@/components/backgrounds/Threads";
// import Squares from "@/components/backgrounds/Squares";
// import Aurora from "@/components/backgrounds/Aurora";
import { SOCIAL_LINKS, SOCIAL_ORDER_HERO } from "@/config/social";

const Index = () => {
  const isLoaded = usePageInit(0);
  const [key, setKey] = useState(0);
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
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          className="flex flex-col h-screen relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Helmet>
            <title>{t.seo.home.title}</title>
            <meta name="description" content={t.seo.home.description} />
          </Helmet>

          {/* Squares background, remove for now 
          <div className="absolute inset-0 z-[1]">
            <Squares 
              speed={0.1} 
              squareSize={40}
              direction="diagonal"
            />
          </div>
          */}

          {/* Threads background, remove for now 
          <div className="absolute inset-0 z-[1] pointer-events-none">
            <div className="w-full h-full pointer-events-auto">
              <Threads
                amplitude={1.5}
                distance={0.1}
                enableMouseInteraction={true}
              />
            </div>
          </div>
          */}

          <div className="flex-1 p-5 sm:p-6 md:p-8 lg:p-12 pt-16 sm:pt-18 md:pt-20 flex flex-col relative z-20">
            <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
              <div className="mb-8 sm:mb-10 md:mb-14 lg:mb-16">
                <Navigation />
              </div>

              {/* Hero section | head */}
              <div className="flex-1 flex flex-col justify-center items-start">
                <div className="flex flex-col">
                  <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl ml-0">
                    <motion.h1
                      variants={titleVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6"
                    >
                      <NameMorpher greeting={`${t.index.greeting}\u00A0`} />
                    </motion.h1>

                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
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
                  </div>

                  <motion.div
                    className="max-w-3xl md:max-w-4xl lg:max-w-5xl ml-0"
                    layout
                    transition={{
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-wrap gap-3 mb-6 sm:mb-8"
                    >
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link to="/contact">
                          <IconButton
                            icon={<Contact className="w-4 h-4" />}
                            variant="default"
                            className="text-sm px-4 py-2 sm:text-base sm:px-6 sm:py-3 md:px-7 md:py-3.5 font-medium"
                            label={t.index.contactMe}
                          />
                        </Link>

                        <Link to="/projects">
                          <IconButton
                            icon={<FolderGit2 className="w-4 h-4" />}
                            variant="secondary"
                            className="text-sm px-4 py-2 sm:text-base sm:px-6 sm:py-3 md:px-7 md:py-3.5"
                            label={t.index.viewProjects}
                          />
                        </Link>
                      </div>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-wrap items-center gap-3 sm:gap-4 mb-0"
                    >
                      {SOCIAL_ORDER_HERO.map((id) => {
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
                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className={`group relative inline-block rounded-full border border-foreground/10 bg-foreground/5 shadow-sm text-foreground/60 hover:text-foreground transition-all duration-500 ease-out overflow-hidden ${hoverClass}
                            w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12
                            ${
                              label === "LeetCode"
                                ? "md:hover:[width:8rem] lg:hover:[width:8rem]"
                                : label.length <= 5
                                  ? "md:hover:[width:6.3rem] lg:hover:[width:6.3rem] "
                                  : label.length <= 7
                                    ? "md:hover:[width:6.8rem] lg:hover:[width:6.8rem]"
                                    : label.length <= 8
                                      ? "md:hover:[width:7.5rem] lg:hover:[width:7.5rem]"
                                      : label.length <= 10
                                        ? "md:hover:[width:8.5rem] lg:hover:[width:8.5rem]"
                                        : "md:hover:[width:9.5rem] lg:hover:[width:9.5rem]"
                            }
                          `}
                          >
                            {/* center icon container */}
                            <div className="absolute left-[9.47px] sm:left-[11.47px] top-[0.6rem] sm:top-[0.7rem] w-5 sm:w-6 h-5 sm:h-6 flex items-center justify-center z-10">
                              {icon}
                            </div>

                            {/* label reveal */}
                            <div className="hidden md:flex absolute left-12 right-1 top-1/2 -translate-y-1/2 items-center pointer-events-none">
                              <span className="text-sm font-medium whitespace-nowrap opacity-0 blur-sm transform translate-x-4 group-hover:opacity-100 group-hover:blur-none group-hover:translate-x-0 transition-all duration-500 ease-out delay-100">
                                {label}
                              </span>
                            </div>

                            {/* mobile tooltip */}
                            <span className="md:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-md bg-foreground/10 backdrop-blur-sm whitespace-nowrap pointer-events-none">
                              {label}
                            </span>
                          </a>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;

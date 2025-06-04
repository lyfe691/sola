/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

/* This is the main page, therefore called index */

import { Link } from "react-router-dom";
import { 
  Mail,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import { TypeAnimation } from 'react-type-animation';
import { useEffect, useState } from "react";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";
import { SiChessdotcom, SiHackthebox } from "react-icons/si";
import { Button } from "@/components/ui/button";
import Navigation from "../components/Navigation";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import ParticleBackground from "../components/ParticleBackground";
import { containerVariants, itemVariants, titleVariants, usePageInit } from "@/utils/transitions";  
import { Helmet } from "react-helmet-async";
import { NameMorpher } from "../components/NameMorpher";


const Index = () => {
  const isLoaded = usePageInit(50);
  const [typingComplete, setTypingComplete] = useState(false);
  const [key, setKey] = useState(0);
  const { language } = useLanguage();
  const t = translations[language];
  
  /* remove for now
  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };
  */

  useEffect(() => {
    setKey(prev => prev + 1);
    setTypingComplete(false);
  }, [language]);

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div 
          className="flex flex-col h-screen relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Helmet>
            <title>Yanis Sebastian Zürcher • Software Developer in Zürich</title>
          </Helmet>

          {/* Particle background, remove for now 
          <ParticleBackground particlesInit={particlesInit}/>
          */}
          
          <div className="flex-1 p-5 sm:p-6 md:p-8 lg:p-12 pt-16 sm:pt-18 md:pt-20 flex flex-col">
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
                      <Link to="/now" className="text-base ml-2 underline">
                        now
                      </Link>
                    </motion.h1>
                    
                    <motion.p 
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-foreground/70 leading-relaxed mb-4 sm:mb-5 md:mb-8 text-base sm:text-lg md:text-xl max-w-2xl md:max-w-3xl lg:max-w-4xl"
                    >
                      {t.index.description}
                    </motion.p>

                    <motion.div 
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-wrap gap-3 mb-6 sm:mb-8"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <Link to="/contact">
                          <Button 
                            variant="default"
                            size="default"
                            className="group border-foreground/20"
                          >
                            <span className="flex items-center">
                              {t.index.contactMe}
                              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 
                                                group-hover:translate-x-1" />
                            </span>
                          </Button>
                        </Link>
                        <Link to="/projects">
                          <Button 
                            variant="outline"
                            size="default"
                            className="group border-foreground/20"
                          >
                            <span className="flex items-center">
                              {t.index.viewProjects}
                              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 
                                                group-hover:translate-x-1" />
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible" 
                      className="flex flex-wrap items-center gap-3 sm:gap-4 mb-0"
                    >
                      {[
                        { 
                          href: "https://github.com/lyfe691", 
                          icon: <FaGithubAlt className="w-full h-full" />, 
                          label: "GitHub",
                          hoverClass: "hover:border-foreground/30"
                        },
                        { 
                          href: "mailto:yanis.sebastian.zuercher@gmail.com", 
                          icon: <Mail className="w-full h-full" />, 
                          label: "Email",
                          hoverClass: "hover:bg-red-400/20 hover:border-red-400/30"
                        },
                        { 
                          href: "https://www.linkedin.com/in/yanis-sebastian-zürcher/", 
                          icon: <Linkedin className="w-full h-full" />, 
                          label: "LinkedIn",
                          hoverClass: "hover:bg-cyan-400/20 hover:border-cyan-400/30"
                        },
                        {
                          icon: <SiHackthebox className="w-full h-full" />,
                          href: "https://app.hackthebox.com/profile/2350832",
                          label: "Hack The Box",
                          hoverClass: "hover:bg-emerald-300/20 hover:border-emerald-400/30"
                        },
                        { 
                          href: "https://chess.com/member/moment_o", 
                          icon: <SiChessdotcom className="w-full h-full" />, 
                          label: "Chess.com",
                          hoverClass: "hover:bg-green-400/20 hover:border-green-400/30"
                        }
                      ].map((social, index) => (
                        <a 
                          key={social.label}
                          href={social.href}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`group relative inline-block rounded-full border border-foreground/10 bg-foreground/5 shadow-sm text-foreground/60 hover:text-foreground transition-all duration-500 ease-out overflow-hidden ${social.hoverClass}
                            w-12 h-12 sm:w-12 sm:h-12 md:w-12 md:h-12
                            ${social.label.length <= 5 ? 'md:hover:[width:6.3rem] lg:hover:[width:6.3rem]' : 
                              social.label.length <= 7 ? 'md:hover:[width:6.8rem] lg:hover:[width:6.8rem]' : 
                              social.label.length <= 8 ? 'md:hover:[width:7.5rem] lg:hover:[width:7.5rem]' : 
                              social.label.length <= 10 ? 'md:hover:[width:8.5rem] lg:hover:[width:8.5rem]' : 
                              'md:hover:[width:9.5rem] lg:hover:[width:9.5rem]'}
                          `}
                        >
                          {/* fuckass css to center PIXEL PERFECT INSIDE A CONTAINER CAUSE IT WONT LET ME DO IT NORMALLY. */}
                          <div className="absolute left-[11.47px] top-[0.7rem] w-6 h-6 flex items-center justify-center z-10">
                            {social.icon}
                          </div>
                          
                          {/* fuckass glassmorphism effect */}
                          <div className="hidden md:block absolute left-12 right-1 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                            <span className="text-sm font-medium whitespace-nowrap opacity-0 blur-sm transform translate-x-4 group-hover:opacity-100 group-hover:blur-none group-hover:translate-x-0 transition-all duration-500 ease-out delay-100">
                              {social.label}
                            </span>
                          </div>
                          
                          {/*  */}
                          <span className="md:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-md bg-foreground/10 backdrop-blur-sm whitespace-nowrap pointer-events-none">
                            {social.label}
                          </span>
                        </a>
                      ))}
                    </motion.div>
                  </div>
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
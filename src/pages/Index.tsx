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
  Github,
  Mail,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';
import { useEffect, useState } from "react";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";
import { SiChessdotcom } from "react-icons/si";
import { Button } from "@/components/ui/button";
import Navigation from "../components/Navigation";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [key, setKey] = useState(0);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setKey(prev => prev + 1);
    setTypingComplete(false);
  }, [language]);

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div 
          className="flex flex-col h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-4 sm:p-5 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto w-full">
              {/* Navigation */}
              <Navigation />
            </div>
          </div>

          {/* Hero Section */}
          <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 pb-6 sm:pb-12 min-h-[70vh]"> 
            <div className="max-w-7xl mx-auto w-full">
              <div className="max-w-3xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8"
                >
                  <TypeAnimation
                    key={key}
                    sequence={[
                      t.index.greeting,
                      1000,
                      () => setTypingComplete(true)
                    ]}
                    speed={50}
                  />
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-foreground/70 leading-relaxed mb-5 sm:mb-8 text-base sm:text-lg"
                >
                  {t.index.description}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-3 mb-6 sm:mb-10"
                >
                  <Link to="/contact">
                    <Button 
                      variant="default"
                      className="group"
                      size="sm"
                    >
                      {t.index.contactMe}
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2 transition-transform duration-300 
                                          group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/projects">
                    <Button 
                      variant="outline"
                      className="group border-foreground/20"
                      size="sm"
                    >
                      {t.index.viewProjects}
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2 transition-transform duration-300 
                                          group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-2 mb-10 sm:mb-16"
                >
                  <a 
                    href="https://github.com/lyfe691" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
                  >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a 
                    href="mailto:yanis.sebastian.zuercher@gmail.com" 
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/yanis-sebastian-zürcher/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a 
                    href="https://chess.com/member/moment_o" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
                  >
                    <SiChessdotcom className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;


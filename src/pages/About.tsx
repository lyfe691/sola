/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, Code, Code2, Coffee, Laptop, Linkedin, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GithubIcon } from 'lucide-react';
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

type InterestCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
};

const InterestCard = ({ title, description, icon: Icon, image }: InterestCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="group rounded-xl border border-foreground/10 overflow-hidden relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="h-40 overflow-hidden relative">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-foreground/70 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

const About = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isLoaded, setIsLoaded] = useState(false);
  
  const interestImages = {
    nature: "/about/spring-japan.jpg",
    tech: "/about/16.jpg",
    learning: "/about/12.jpg",
    workspace: "/about/sesh.jpg"
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col w-full"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 sm:mb-12">
            <motion.h1 
              variants={titleVariants}
              className="text-4xl font-bold"
            >
              {t.about.title}
            </motion.h1>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-row items-center gap-4"
            >
              <Button variant="outline" size="sm" className="border-foreground/20" asChild>
                <a href="https://github.com/lyfe691" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4" />
                  GitHub
                </a>  
              </Button>
              <Button variant="outline" size="sm" className="border-foreground/20" asChild>
                <a href="https://linkedin.com/in/yanis-sebastian-zürcher/" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </Button>
            </motion.div>
          </div>

          {/* hero section | head */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 mb-16 sm:mb-20 lg:mb-28 w-full">
            <div className="space-y-6">
              <p className="text-lg text-foreground/80 leading-relaxed">
                {t.about.intro}
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                {t.about.hobbies}
              </p>
              
              {/* link to skills page */}
              <div className="pt-6">
                <Button variant="default" size="default" className="border-foreground/20 group">
                  <Link to="/skills" className="flex items-center gap-2">
                    {t.about.viewSkills}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative w-full max-w-sm mx-auto md:max-w-full">
              <div className="rounded-2xl overflow-hidden border border-foreground/10 shadow-xl">
                <div className="pb-[100%] relative">
                  <motion.img 
                    src="/about/01.jpg" 
                    alt="Professional developer portrait"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              {/* decorative elements */}
              <div className="absolute -z-10 -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-2xl" />
              <div className="absolute -z-10 -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full" />
            </div>
          </motion.div>

          {/* interests sectio */}
          <motion.div variants={itemVariants} className="mb-16 sm:mb-20 lg:mb-28">
            <h2 className="text-2xl font-bold mb-6 sm:mb-8 lg:mb-12 border-b pb-4">{t.about.interests.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <InterestCard
                title={t.about.interests.nature.title}
                description={t.about.interests.nature.description}
                icon={Mountain}
                image={interestImages.nature}
              />
              <InterestCard
                title={t.about.interests.tech.title}
                description={t.about.interests.tech.description}
                icon={Code2}
                image={interestImages.tech}
              />
              <InterestCard
                title={t.about.interests.learning.title}
                description={t.about.interests.learning.description}
                icon={Book}
                image={interestImages.learning}
              />
              <InterestCard
                title={t.about.interests.workspace.title}
                description={t.about.interests.workspace.description}
                icon={Laptop}
                image={interestImages.workspace}
              />
            </div>
          </motion.div>

          {/* philosophy */}
          <motion.div 
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl border border-foreground/10 
                     bg-gradient-to-br from-foreground/5 to-transparent backdrop-blur-sm p-6 sm:p-8 lg:p-10"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6 sm:mb-8 lg:mb-10">{t.about.philosophy.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 sm:mb-5">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Clean Code</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{t.about.philosophy.clean}</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 sm:mb-5">
                    <Coffee className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Simplicity</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{t.about.philosophy.simplicity}</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 sm:mb-5">
                    <Book className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Continuous Learning</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{t.about.philosophy.learning}</p>
                </div>
              </div>
            </div>
            
            {/* decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default About;

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Book, Code, Code2, Coffee, Laptop, Linkedin, Mountain, Download, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from "@/components/theme-provider";
import { containerVariants, itemVariants, titleVariants, usePageInit } from "@/utils/transitions";
import { Helmet } from "react-helmet-async";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

// --------------------------------- Helpers ---------------------------------

const downloadResume = () => {
  const link = document.createElement("a");
  link.href = "/sola.pdf";
  link.download = "Resume_Yanis-Sebastian-Zürcher.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const viewResume = () => {
  window.open("/sola.pdf", "_blank");
};

// -------------------------------- Components --------------------------------

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
      <div className="h-36 overflow-hidden relative">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-foreground/70 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

// -------------------------------- Page --------------------------------------

const About = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const isLoaded = usePageInit(100);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Check if the current theme is dark (including system preference)
  const isDarkTheme = () => {
    if (theme === 'dark' || theme === 'cyber' || theme === 'forest' || theme === 'amethyst' || theme === "sunset") return true;
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  const interestImages = {
    nature: '/about/spring-japan.jpg',
    tech: '/about/16.jpg',
    learning: '/about/12.jpg',
    workspace: '/about/sesh.jpg',
  } as const;

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col w-full"
        >
          <Helmet>
            <title>About • Yanis Sebastian Zürcher</title>
          </Helmet>

          {/* ------------------- Title ------------------- */}

          <motion.h1 variants={titleVariants} className="text-4xl font-bold mb-8 sm:mb-12">
            {t.about.title}
          </motion.h1>

          {/* ------------------- Hero ------------------- */}

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16 md:mb-24">
            <div className="md:col-span-3 space-y-5">
              <p className="text-lg text-foreground/80 leading-relaxed">{t.about.intro}</p>
              <p className="text-lg text-foreground/80 leading-relaxed">{t.about.hobbies}</p>

              {/* ----------- Social / Resume Buttons ---------- */}

              <div className="flex flex-row items-center gap-3 pt-5">
                <Button effect="shineHover" variant="outline" size="sm" className="border-foreground/20" asChild>
                  <a href="https://github.com/lyfe691" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </Button>
                <Button effect="shineHover" variant="outline" size="sm" className="border-foreground/20" asChild>
                  <a href="https://linkedin.com/in/yanis-sebastian-zürcher/" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>

                {/* ---------------- Resume Modal ---------------- */}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button effect="ringHover" variant="outline" size="sm" className="border-foreground/20">
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Resume
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader className="pb-2">
                      <DialogTitle>Request Full Resume</DialogTitle>
                      <DialogDescription>
                        The public version of my resume has some sensitive information censored. If you need the full version, please{' '}
                        <Link to="/contact" className="underline text-foreground">contact me</Link> or send an email to{' '}
                        <a href="mailto:yanis.sebastian.zuercher@gmail.com" className="underline text-foreground">yanis.sebastian.zuercher@gmail.com</a>.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 pt-4">
                      <Button variant="outline" size="sm" onClick={viewResume}>
                        View Censored Version
                      </Button>
                      <Button variant="secondary" size="sm" onClick={downloadResume}>
                        Download Censored Version
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* ------------------ Portrait ------------------ */}

            <div className="md:col-span-2 relative">
              <div className="aspect-square overflow-hidden rounded-xl border border-foreground/10 shadow-sm">
                <motion.img
                  src={isDarkTheme() ? '/ysz-d.png' : '/ysz-l.png'}
                  alt="Yanis Sebastian Zürcher"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full bg-primary/5 rounded-xl -rotate-2" />
            </div>
          </motion.div>

          {/* ------------------- Interests ------------------ */}

          <motion.div variants={itemVariants} className="mb-16 md:mb-20">
            <h2 className="text-2xl font-bold mb-6 md:mb-8 pb-2 border-b border-foreground/10">
              {t.about.interests.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* ------------------- Philosophy ----------------- */}

          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-xl border border-foreground/10 bg-gradient-to-br from-foreground/5 to-transparent p-6 md:p-8 mb-10"
          >
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-6 md:mb-8">{t.about.philosophy.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Code2 className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Clean Code</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{t.about.philosophy.clean}</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Coffee className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Simplicity</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{t.about.philosophy.simplicity}</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Book className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Continuous Learning</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{t.about.philosophy.learning}</p>
                </div>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default About;

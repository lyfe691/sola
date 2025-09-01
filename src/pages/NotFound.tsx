/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";

const NotFound = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <Helmet>
        <title>{t.seo.notFound.title}</title>
        <meta name="description" content={t.seo.notFound.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-primary via-destructive to-primary opacity-10 blur-3xl animate-[spin_20s_linear_infinite]" />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-7xl sm:text-9xl font-extrabold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent"
      >
        {t.notFound.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-4 text-center text-muted-foreground"
      >
        {t.notFound.subtitle}
        <br />
        <span className="font-mono text-xs sm:text-sm text-border">{location.pathname}</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8"
      >
        <Button
          asChild
          variant="outline"
          className="border-border hover:bg-muted/70 transition-colors"
        >
          <a href="/">{t.notFound.backHome}</a>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;

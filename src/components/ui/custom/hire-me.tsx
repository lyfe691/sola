/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { translations } from "@/lib/translations";
import { useLanguage } from "@/lib/language-provider";

const HireMe = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const prefilledSubject = "Job Opportunity at []";
  const prefilledMessage = `Hi Yanis,\n\nI'm reaching out regarding a potential job opportunity. I've reviewed your portfolio and I'm impressed with your work.\n\nI'd like to discuss a potential collaboration with our team.\n\nLooking forward to your response.`;

  const contactUrl = `/contact?subject=${encodeURIComponent(prefilledSubject)}&message=${encodeURIComponent(prefilledMessage)}`;

  return (
    <div className="pointer-events-none fixed hidden lg:flex bottom-8 left-8 z-50">
      <motion.div
        style={{ pointerEvents: "auto" }}
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.4 }}
        whileHover={{
          scale: 1.03,
          transition: { type: "spring", stiffness: 400, damping: 19 },
        }}
        className="relative isolate"
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div
            className="absolute inset-[-120%] rounded-[50%] blur-2xl opacity-70"
            style={{
              transformOrigin: "center",
              background: `radial-gradient(circle,
                color-mix(in oklab, var(--primary) 40%, transparent) 0%,
                color-mix(in oklab, var(--secondary) 30%, transparent) 60%,
                transparent 80%)`,
            }}
          />
        </div>

        <Link
          to={contactUrl}
          aria-label="Hire Yanis Sebastian Zürcher"
          className="relative inline-flex items-center gap-3 rounded-xl 
                     bg-background/30 backdrop-blur-md px-6 py-3
                     font-medium text-foreground shadow-md
                     ring-1 ring-foreground/5 
                     hover:ring-primary/20 hover:text-primary
                     active:scale-98 transition-[transform,translate,scale,rotate,color,box-shadow] duration-200"
        >
          <Briefcase className="h-4 w-4 shrink-0 text-primary/80" />
          <span className="tracking-wide text-sm">{t.hire.hirebtn}</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default HireMe;

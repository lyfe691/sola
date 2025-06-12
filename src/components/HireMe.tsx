/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { motion } from "motion/react"
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import { translations } from "@/lib/translations";
import { useLanguage } from "@/lib/language-provider";
import { useNavigate } from "react-router-dom";



const HireMe = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const isHired = true;
  const navigate = useNavigate();

  const prefilledSubject = "Job Opportunity at []";
  const prefilledMessage = `Hi Yanis,\n\nI'm reaching out regarding a potential job opportunity. I've reviewed your portfolio and I'm impressed with your work.\n\nI'd like to discuss a potential collaboration with our team.\n\nLooking forward to your response.`;

  const contactUrl = `/contact?subject=${encodeURIComponent(prefilledSubject)}&message=${encodeURIComponent(prefilledMessage)}`;



    const handleHireClick = (e: React.MouseEvent) => {
  //  e.preventDefault();
  //   if (isHired === true) {
  //     toast.error(t.hire.hiretitle, {
  //       duration: 7000,
  //       description: t.hire.hiretxt,
  //       action: {
  //         label: t.hire.hirelbl,
  //         onClick: () => {
  //           navigate(contactUrl);
  //           toast.dismiss();
  //         },
  //       },
  //     });
  //   }
   };
  


  return (
    <div className="pointer-events-none fixed hidden lg:flex bottom-8 left-8 z-50">
      <motion.div
        style={{ pointerEvents: "auto" }}
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.4 }}
        whileHover={{ 
          scale: 1.03,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        className="relative isolate"
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <motion.div
            className="absolute inset-[-120%] rounded-[50%] blur-2xl opacity-70"
            style={{
              transformOrigin: "center",
              background: `radial-gradient(circle, 
                hsl(var(--primary)/40%) 0%, 
                hsl(var(--secondary)/30%) 60%, 
                transparent 80%)`
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          />
        </div>

        <Link
          to={contactUrl}
          onClick={handleHireClick}
          aria-label="Hire Yanis Sebastian Zürcher"
          className="relative inline-flex items-center gap-3 rounded-xl 
                     bg-background/30 backdrop-blur-md px-6 py-3
                     font-medium text-foreground shadow-md
                     ring-1 ring-foreground/5 
                     hover:ring-primary/20 hover:text-primary
                     active:scale-98 transition-all duration-300"
        >
          <Briefcase className="h-4 w-4 shrink-0 text-primary/80" />
          <span className="tracking-wide text-sm">{t.hire.hirebtn}</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default HireMe;
/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 *
 * All rights reserved.
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

/**
 * A dramatically upgraded "Hire Me" call‑to‑action.
 *
 * • Glass‑morphism card with animated rainbow‑glow backdrop.
 * • Subtle entrance, hover parallax & continual slow rotation on the glow.
 * • Hidden on mobile, appears at the lower-left on larger screens (≥ lg).
 * • Message subject + body **unchanged** so existing routing keeps working.
 */
const HireMe = () => {
  /* --------------------------------------------------------------- */
  /* ✉️  pre‑filled email                                              */
  /* --------------------------------------------------------------- */
  const prefilledSubject = "Job Opportunity at []";
  const prefilledMessage = `Hi Yanis,\n\nI'm reaching out regarding a potential job opportunity. I've reviewed your portfolio and I'm impressed with your work.\n\nI'd like to discuss a potential collaboration with our team.\n\nLooking forward to your response.`;

  const contactUrl = `/contact?subject=${encodeURIComponent(prefilledSubject)}&message=${encodeURIComponent(prefilledMessage)}`;

  /* --------------------------------------------------------------- */
  /* 🖇️  component                                                     */
  /* --------------------------------------------------------------- */
  return (
    /* container: hidden on mobile, visible on lg screens */
    <div className="pointer-events-none fixed hidden lg:flex bottom-8 left-8 z-50">
      <motion.div
        /* re‑enable pointer events for the CTA itself */
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
        {/* Simplified glow effect */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          {/* Primary glow layer */}
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

        {/* Button with refined glass effect */}
        <Link
          to={contactUrl}
          aria-label="Hire Yanis Sebastian Zürcher"
          className="relative inline-flex items-center gap-3 rounded-xl 
                     bg-background/30 backdrop-blur-md px-6 py-3
                     font-medium text-foreground shadow-md
                     ring-1 ring-foreground/5 
                     hover:ring-primary/20 hover:text-primary
                     active:scale-98 transition-all duration-300"
        >
          <Briefcase className="h-4 w-4 shrink-0 text-primary/80" />
          <span className="tracking-wide text-sm">Hire Me</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default HireMe;
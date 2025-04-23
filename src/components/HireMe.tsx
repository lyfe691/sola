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

const HireMe = () => {
  // prefilled message for potential employers
  const prefilledSubject = "Job Opportunity at []";
  const prefilledMessage = `Hi Yanis,\n\nI'm reaching out regarding a potential job opportunity. I've reviewed your portfolio and I'm impressed with your work.\n\nI'd like to discuss a potential collaboration with our team.\n\nLooking forward to your response.`;

  const contactUrl = `/contact?subject=${encodeURIComponent(prefilledSubject)}&message=${encodeURIComponent(prefilledMessage)}`;

  return (
    <motion.div
      className="fixed top-6 left-4 z-50"
      initial={{ opacity: 0, x: -48 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 190, damping: 22, delay: 0.5 }}
    >
      {/* gentle bobbing animation */}
      <motion.div
        animate={{ y: [0, -6, 0], x: [0, 6, 0]}}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <Link
          to={contactUrl}
          aria-label="Hire Yanis Sebastian Zürcher"
          className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-5 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-primary/30 backdrop-blur md:hover:scale-105 md:hover:shadow-xl md:active:scale-95 transition-transform duration-300"
        >
          <Briefcase className="h-5 w-5 group-hover:animate-pulse" />
          <span className="whitespace-nowrap">Hire&nbsp;Me</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default HireMe;

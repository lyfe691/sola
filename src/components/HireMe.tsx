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
  const prefilledMessage = "Hi Yanis,\n\nI'm reaching out regarding a potential job opportunity. I've reviewed your portfolio and I'm impressed with your work.\n\nI'd like to discuss a potential collaboration with our team.\n\nLooking forward to your response.";
  
  // create url with subject and message as params
  const contactUrl = `/contact?subject=${encodeURIComponent(prefilledSubject)}&message=${encodeURIComponent(prefilledMessage)}`;

  return (
    <div className="fixed top-6 left-0 z-30 hidden lg:block">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 24 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          delay: 0.7 
        }}
      >
        <Link
          to={contactUrl}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 border border-primary/20 group"
        >
          <Briefcase className="w-4 h-4 group-hover:animate-pulse" />
          <span>Hire Me</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default HireMe; 
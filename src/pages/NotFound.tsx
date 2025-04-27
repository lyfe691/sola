/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { containerVariants, itemVariants, titleVariants, usePageInit } from "@/utils/transitions";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const isLoaded = usePageInit(100);

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6"
        >

          <Helmet>
            <title>where are you? 404</title>
          </Helmet>

          <motion.h1 
            variants={titleVariants}
            className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6"
          >
            404
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 text-center max-w-md"
          >
            Oops! The page you're looking for can't be found.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button asChild variant="outline" effect="shineHover" className="group border-foreground/20 mt-6 sm:mt-8">
              <a href="/">Go back home</a>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotFound;


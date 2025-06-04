/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 *
 * All rights reserved.
 */

import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { containerVariants, itemVariants, titleVariants, usePageInit } from "@/utils/transitions";

export default function Now() {
  const isLoaded = usePageInit(50);
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="min-h-screen flex items-center justify-center px-6 py-12"
        >
          <Helmet>
            <title>Now</title>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>

          <motion.div
            variants={itemVariants}
            className="max-w-2xl w-full text-sm leading-relaxed space-y-6 p-6 sm:p-8 rounded-xl border border-foreground/10 bg-foreground/5 backdrop-blur-md shadow-lg"
          >
            <motion.h1 variants={titleVariants} className="text-2xl font-bold mb-6 text-center">
              Now
            </motion.h1>

            <motion.p variants={itemVariants}>
              Here's what I'm focused on at the moment. This page is inspired by the{' '}
              <a href="https://nownownow.com/about" className="underline" target="_blank" rel="noopener noreferrer">
                nownownow
              </a>{' '}
              movement.
            </motion.p>
            <motion.p variants={itemVariants}>
              I'm continuing my studies in computer science while building side projects and sharpening my skills.
            </motion.p>
            <motion.p variants={itemVariants}>Check back occasionally to see what I'm up to!</motion.p>

            <motion.div variants={itemVariants} className="text-center">
              <Button variant="link" effect="underline" onClick={goBack}>
                go back?
              </Button>
            </motion.div>

            <motion.p variants={itemVariants} className="text-xs text-center text-foreground/50 pt-8">
              © {new Date().getFullYear()} Yanis Sebastian Zürcher
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

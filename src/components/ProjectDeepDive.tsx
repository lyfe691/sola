/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

// merged React imports into a single declaration below
import { motion, AnimatePresence } from 'motion/react';
import { usePageInit, containerVariants } from "@/utils/transitions";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { lazy } from 'react';
const Silk = lazy(() => import("@/components/backgrounds/Silk"));
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet-async';
import { IconButton } from './ui/custom/icon-button';

interface ProjectPageProps {
  title: string;
  description?: string;
  silkColor?: string;
  silkSpeed?: number;
  silkScale?: number;
  silkNoiseIntensity?: number;
  silkRotation?: number;
  children?: React.ReactNode;
}

const ProjectPage: React.FC<ProjectPageProps> = ({
  title,
  description,
  silkColor = "#7B7481",
  silkSpeed = 5,
  silkScale = 1,
  silkNoiseIntensity = 1.5,
  silkRotation = 0,
  children
}) => {
  const isLoaded = usePageInit(100);
  const navigate = useNavigate();

  // Always show motion effects regardless of user reduced-motion preference

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="min-h-screen bg-background p-4 sm:p-6 lg:p-8"
        >
          <Helmet>
            <title>{title} • Yanis Sebastian Zürcher</title>
            {description && <meta name="description" content={description} />}
          </Helmet>

          {/* hero section */}
          <div className="h-[60vh] min-h-[400px] relative overflow-hidden rounded-3xl mb-6 border-4 border-border/50 shadow-lg shadow-black/5">
            {/* silk background */}
            <div className="absolute inset-0">
              <React.Suspense fallback={<div className="w-full h-full bg-foreground/5" /> }>
                <Silk
                  color={silkColor}
                  speed={silkSpeed}
                  scale={silkScale}
                  noiseIntensity={silkNoiseIntensity}
                  rotation={silkRotation}
                />
              </React.Suspense>
            </div>
            
            {/* overlay */}
            <div className="absolute inset-0 bg-black/20" />
            
            {/* content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6 max-w-4xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 25, skewY: 3 }}
                  animate={{ opacity: 1, y: 0, skewY: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut", delay: 0.2 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
                >
                  {title}
                </motion.h1>
                {description && (
                  <motion.p 
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut", delay: 0.3 }}
                    className="text-base sm:text-lg md:text-xl text-white/90 font-light"
                  >
                    {description}
                  </motion.p>
                )}
              </div>
            </div>
          </div>

          {/* navigation */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto py-4">
              <div className="flex items-center justify-between">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="text-xs">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/projects" className="text-xs">Projects</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-xs font-medium">{title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <IconButton
                  variant="ghost"
                  icon={<ArrowLeft/>}
                  iconPosition='left'
                  size="sm"
                  onClick={() => navigate('/projects')}
                  className="text-xs h-8 px-3 gap-2"
                >
                  Back
                </IconButton>
              </div>
            </div>
          </div>

          {/* content */}
          {children && (
            <div className="max-w-4xl mx-auto py-12">
              {children}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectPage; 
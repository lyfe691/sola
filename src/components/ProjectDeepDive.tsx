/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React, { lazy, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IconButton } from "./ui/custom/icon-button";

const Silk = lazy(() => import("@/components/backgrounds/Silk"));

// wrapper to notify when Silk has mounted
const SilkLoader: React.FC<{
  color: string;
  speed: number;
  scale: number;
  noiseIntensity: number;
  rotation: number;
  onReady: () => void;
}> = ({ onReady, ...props }) => {
  React.useEffect(() => {
    // Small delay to ensure WebGL context is initialized
    const timer = setTimeout(onReady, 50);
    return () => clearTimeout(timer);
  }, [onReady]);

  return <Silk {...props} />;
};

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
  children,
}) => {
  const navigate = useNavigate();
  const [silkReady, setSilkReady] = useState(false);

  // instant scroll to top on mount to prevent white flash during smooth scroll
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen bg-background p-4 sm:p-6 lg:p-8"
    >
      <Helmet>
        <title>{title} • Yanis Sebastian Zürcher</title>
        {description && <meta name="description" content={description} />}
      </Helmet>

      {/* hero section */}
      <div className="h-[60vh] min-h-[400px] relative overflow-hidden rounded-3xl mb-6 border-4 border-border/50 shadow-lg shadow-black/5">
        {/* silk background - fades in when ready */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: silkReady ? 1 : 0 }}
        >
          <React.Suspense fallback={null}>
            <SilkLoader
              color={silkColor}
              speed={silkSpeed}
              scale={silkScale}
              noiseIntensity={silkNoiseIntensity}
              rotation={silkRotation}
              onReady={() => setSilkReady(true)}
            />
          </React.Suspense>
        </div>
        {/* placeholder while silk loads - uses silkColor for seamless transition */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ backgroundColor: silkColor, opacity: silkReady ? 0 : 1 }}
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* hero content */}
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
                  <BreadcrumbLink href="/" className="text-xs">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projects" className="text-xs">
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-medium">
                    {title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <IconButton
              variant="ghost"
              icon={<ArrowLeft />}
              iconPosition="left"
              size="sm"
              onClick={() => navigate("/projects")}
              className="text-xs h-8 px-3 gap-2"
            >
              Back
            </IconButton>
          </div>
        </div>
      </div>

      {/* content */}
      {children && <div className="max-w-4xl mx-auto py-12">{children}</div>}
    </motion.div>
  );
};

export default ProjectPage;

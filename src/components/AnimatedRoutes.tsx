/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { AnimatePresence, motion } from "motion/react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode, lazy, Suspense } from "react";
import Index from "@/pages/Index";
import SimpleLayout from "@/layouts/SimpleLayout";
import MainLayout from "@/layouts/MainLayout";
import BlankLayout from "@/layouts/BlankLayout";
import ProjectLayout from "@/layouts/ProjectLayout";
import { pageTransitionVariants, pageTransition } from "@/utils/transitions";

// lazy route chunks to cut initial JS
const NotFound = lazy(() => import("@/pages/NotFound"));
const About = lazy(() => import("@/pages/About"));
const Projects = lazy(() => import("@/pages/Projects"));
const Skills = lazy(() => import("@/pages/Skills"));
const Experience = lazy(() => import("@/pages/Experience"));
const Contact = lazy(() => import("@/pages/Contact"));
const Services = lazy(() => import("@/pages/Services"));
const AboutThisWebsite = lazy(() => import("@/pages/AboutThisWebsite"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const ProjectPageRenderer = lazy(() => import("@/pages/projects/ProjectPageRenderer"));


// define types for pagetransition
interface PageTransitionProps {
    children: ReactNode;
  }
  
  // pt wrapper for route animations
  const PageTransition = ({ children }: PageTransitionProps) => {
    return (  
      <motion.div
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    );
  };

export const AnimatedRoutes = () => {
    const location = useLocation();
    
    // helper to wrap a component with page transition
    const withTransition = (Component: React.ComponentType) => (
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Component />
        </PageTransition>
      </AnimatePresence>
    );
  
    return (
      <Suspense fallback={null}>
      <Routes location={location}>
        {/* home */}
        <Route 
          path="/" 
          element={
            <SimpleLayout>
              <Index />
            </SimpleLayout>
          } 
        />
        
        {/* 404 Route */}
        <Route 
          path="/404" 
          element={
            <BlankLayout>
              <NotFound/>
            </BlankLayout>
          }
        />
        
        {/* redirect to /404 if page doesnt exist, this also fixes the layout issue */}
        <Route 
          path="*" 
          element={
            <Navigate to = "/404" />
          } 
        />
  
        {/* standard layout for content pages */}
        <Route 
          path="/about" 
          element={
            <MainLayout>
              {withTransition(About)}
            </MainLayout>
          } 
        />
        
        <Route 
          path="/projects" 
          element={
            <MainLayout>
              {withTransition(Projects)}
            </MainLayout>
          } 
        />
        
        {/* Individual project pages */}
        <Route 
          path="/projects/:slug" 
          element={
            <ProjectLayout>
              {withTransition(ProjectPageRenderer)}
            </ProjectLayout>
          } 
        />
        
        <Route 
          path="/skills" 
          element={
            <MainLayout>
              {withTransition(Skills)}
            </MainLayout>
          } 
        />
        
        <Route 
          path="/experience" 
          element={
            <MainLayout>
              {withTransition(Experience)}
            </MainLayout>
          } 
        />
        
        <Route 
          path="/contact" 
          element={
            <MainLayout>
              {withTransition(Contact)}
            </MainLayout>
          } 
        />
        
        <Route 
          path="/services" 
          element={
            <MainLayout>
              {withTransition(Services)}
            </MainLayout>
          } 
        />
  
        {/* 這個網站是怎麼造出來的 */}
        <Route 
          path="/a" 
          element={
            <BlankLayout>
              <AboutThisWebsite />
            </BlankLayout>
          } 
        />
        
        {/* Privacy Policy */}
        <Route 
          path="/privacy" 
          element={
            <SimpleLayout>
              {withTransition(Privacy)}
            </SimpleLayout>
          } 
        />
      </Routes>
      </Suspense>
    );
  };
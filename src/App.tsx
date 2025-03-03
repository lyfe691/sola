/**
 * Copyright (c) 2025 Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import NotFound from "./pages/NotFound";
import Experience from "./pages/Experience";
import About from "./pages/About";
import { LanguageProvider } from "./lib/language-provider";
import { LanguageToggle } from "./components/language-toggle";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import MainLayout from "./layouts/MainLayout";
import SimpleLayout from "./layouts/SimpleLayout";
import { pageTransitionVariants, pageTransition } from "./utils/transitions";


// create new query client instance
const queryClient = new QueryClient();

// define types for pagetransition
interface PageTransitionProps {
  children: ReactNode;
}

// PageTransition wrapper for route animations
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

// renders the footer conditionally
const ConditionalFooter = () => {
  const location = useLocation();
  
  // hide footer on these paths and render on all others
  const hideFooterOn = ['/','*', "/404"];
  const shouldRender = !hideFooterOn.includes(location.pathname);
  
  if (!shouldRender) return null;
  
  return <Footer />;
};

// routes with animations
const AnimatedRoutes = () => {
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
    <Routes location={location}>
      {/* home */}
      <Route 
        path="/" 
        element={
          <SimpleLayout>
            {withTransition(Index)}
          </SimpleLayout>
        } 
      />
      
      {/* 404 Route */}
      <Route 
        path="/404" 
        element={
          <SimpleLayout>
            {withTransition(NotFound)}
          </SimpleLayout>
        }
        />
        {/* redirect to /404 if page doesnt exist, this also fixes the layout issue  */}
      <Route 
        path="*" 
        element={
          <Navigate to = "/404" />
        } 
      />

      {/* standard layout for content pages*/}
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
    </Routes>
  );
};

// app component
const App = () => (
  <ThemeProvider defaultTheme="system">
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Toaster />
            <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <BrowserRouter>
              <AnimatedRoutes />
              <ConditionalFooter />
              <ScrollToTop />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;


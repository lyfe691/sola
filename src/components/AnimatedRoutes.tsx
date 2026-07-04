/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Routes, Route, Navigate } from "react-router";
import { lazy } from "react";
import AppLayout from "@/layouts/AppLayout";
import SimpleLayout from "@/layouts/SimpleLayout";
import BlankLayout from "@/layouts/BlankLayout";

const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const About = lazy(() => import("@/pages/About"));
const Projects = lazy(() => import("@/pages/Projects"));
const Skills = lazy(() => import("@/pages/Skills"));
const Experience = lazy(() => import("@/pages/Experience"));
const Contact = lazy(() => import("@/pages/Contact"));
const Services = lazy(() => import("@/pages/Services"));
const AboutThisWebsite = lazy(() => import("@/pages/AboutThisWebsite"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const ProjectDeepDiveRenderer = lazy(
  () => import("@/pages/projects/ProjectDeepDiveRenderer"),
);
const Certifications = lazy(() => import("@/pages/Certifications"));

export const AnimatedRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>

      <Route element={<SimpleLayout />}>
        <Route path="/certifications" element={<Certifications />} />
      </Route>

      <Route element={<BlankLayout />}>
        <Route path="/404" element={<NotFound />} />
        <Route path="/a" element={<AboutThisWebsite />} />
        <Route path="/projects/:slug" element={<ProjectDeepDiveRenderer />} />
      </Route>

      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};

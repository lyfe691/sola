/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import React, { Suspense, lazy } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MDXProvider } from '@mdx-js/react';
import ProjectPage from '@/components/ProjectPage';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, ArrowRight } from 'lucide-react';
import { FaGithubAlt } from 'react-icons/fa';
import { getProjectConfig, getAllProjectSlugs, projectPagesConfig } from '@/config/projects';
import { MDXComponents } from '@/components/MDXComponents';

// dynamic mdx component
const getMDXComponent = (mdxPath: string) => {
  return lazy(() => import(`@/content/projects/${mdxPath}.mdx`));
};

const ProjectPageRenderer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/projects" replace />;
  }

  const config = getProjectConfig(slug);
  
  if (!config) {
    return <Navigate to="/404" replace />;
  }

  const MDXComponent = getMDXComponent(config.mdxPath);

  return (
    <ProjectPage
      title={config.title}
      description={config.description}
      silkColor={config.silkColor}
      silkSpeed={config.silkSpeed}
      silkScale={config.silkScale}
      silkNoiseIntensity={config.silkNoiseIntensity}
      silkRotation={config.silkRotation}
    >
      <div className="space-y-16">
        {/* date - article-like header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-center -mb-8"
        >
          <time className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            {config.date}
          </time>
        </motion.div>

        {/* overview */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-foreground">Overview</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {config.overview}
          </p>
        </motion.section>

        {/* tech stack */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-foreground">Tech Stack</h2>
          <div className="flex flex-wrap gap-2.5">
            {config.techStack.map((tech) => (
              <span 
                key={tech}
                className="px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 
                         text-xs rounded-lg font-medium transition-all duration-200
                         hover:bg-primary/10 hover:border-primary/30"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* links - moved to top for better UX */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-foreground">Links</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {config.links.live && (
              <Button
                asChild
                size="sm"
                className="text-xs h-9"
              >
                <a 
                  href={config.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {config.links.live.includes('chromewebstore') ? (
                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {config.links.live.includes('chromewebstore') ? 'Chrome Store' : 'Visit Site'}
                </a>
              </Button>
            )}
            {config.links.github && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs h-9"
              >
                <a 
                  href={config.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithubAlt className="w-3.5 h-3.5 mr-1.5" />
                  Source Code
                </a>
              </Button>
            )}
            {config.links.demo && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs h-9"
              >
                <a 
                  href={config.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Demo
                </a>
              </Button>
            )}
          </div>
        </motion.section>

        {/* mdx content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-sm max-w-none"
        >
          <MDXProvider components={MDXComponents}>
            <Suspense fallback={
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            }>
              <MDXComponent />
            </Suspense>
          </MDXProvider>
        </motion.div>

        {/* related projects */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-border/30 pt-12"
        >
          <h2 className="text-lg font-semibold mb-6 text-foreground">More Projects</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {getAllProjectSlugs()
              .filter(projectSlug => projectSlug !== slug)
              .slice(0, 2)
              .map((projectSlug) => {
                const project = projectPagesConfig[projectSlug];
                return (
                  <Link
                    key={projectSlug}
                    to={`/projects/${projectSlug}`}
                    className="group block p-4 rounded-lg border border-border/50 hover:border-border 
                             transition-all duration-200 hover:bg-muted/20"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary 
                                           group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span 
                          key={tech}
                          className="px-2 py-1 bg-primary/5 text-primary border border-primary/20 
                                   text-xs rounded font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-2 py-1 text-xs text-muted-foreground">
                          +{project.techStack.length - 3} more
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
          </div>
        </motion.section>
      </div>
    </ProjectPage>
  );
};

export default ProjectPageRenderer; 
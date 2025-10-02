/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React, { Suspense, lazy } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { MDXProvider } from "@mdx-js/react";
import ProjectPage from "@/components/ProjectDeepDive";
import { ExternalLink, Globe } from "lucide-react";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import { FaGithubAlt } from "react-icons/fa";
import {
  getProjectConfig,
  getAllProjectSlugs,
  projectPagesConfig,
} from "@/config/project-deep-dive";
import { MDXComponents } from "@/components/MDXComponents";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { Separator } from "@/components/ui/separator";

// dynamic mdx component
const getMDXComponent = (mdxPath: string) => {
  return lazy(() => import(`@/content/projects/${mdxPath}.mdx`));
};

const ProjectDeepDiveRenderer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = translations[language];

  if (!slug) {
    return <Navigate to="/projects" replace />;
  }

  const config = getProjectConfig(slug);

  if (!config) {
    return <Navigate to="/404" replace />;
  }

  const MDXComponent = getMDXComponent(config.mdxPath);

  const getHostname = (href: string) => {
    try {
      return new URL(href).hostname.replace(/^www\./, "");
    } catch {
      return href;
    }
  };

  const LinkTile: React.FC<{
    href: string;
    label: string;
    icon: React.ReactNode;
    variant?: "primary" | "outline";
  }> = ({ href, label, icon, variant = "primary" }) => (
    <LinkPreview
      href={href}
      previewType="auto"
      compact={true}
      className="block"
    >
      <div
        className={[
          "group relative w-full h-full rounded-xl px-4 py-3",
          "border transition-colors duration-150 ease-out",
          variant === "primary"
            ? "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/40"
            : "border-foreground/20 bg-foreground/5 hover:bg-foreground/10",
          "shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "inline-flex items-center gap-3 text-foreground",
        ].join(" ")}
      >
        {/* decorative shine */}
        <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

        {/* icon pill */}
        <span className="shrink-0 grid place-items-center w-8 h-8 rounded-lg bg-foreground/10 text-foreground/70 group-hover:bg-primary/15 group-hover:text-primary transition-colors">
          {icon}
        </span>

        {/* label */}
        <span className="flex flex-col text-left leading-tight">
          <span className="text-sm font-medium tracking-tight">{label}</span>
          <span className="text-[11px] text-foreground/60">
            {getHostname(href)}
          </span>
        </span>

        {/* arrow cue */}
        <ExternalLink className="ml-auto w-4 h-4 text-foreground/40 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-colors duration-150 ease-out" />
      </div>
    </LinkPreview>
  );

  // algorithmically recommend projects with overlapping tech stacks
  const getRecommendedProjectSlugs = (
    currentSlug: string,
    count: number,
  ): string[] => {
    const allSlugs = getAllProjectSlugs();
    const current = projectPagesConfig[currentSlug!];
    if (!current)
      return allSlugs.filter((s) => s !== currentSlug).slice(0, count);
    const normalize = (s: string) => s.toLowerCase();
    const currentTech = new Set((current.techStack || []).map(normalize));
    const docFreq: Record<string, number> = {};
    for (const sl of allSlugs) {
      const seen = new Set<string>();
      for (const t of (projectPagesConfig[sl].techStack || []).map(normalize)) {
        if (!seen.has(t)) {
          docFreq[t] = (docFreq[t] || 0) + 1;
          seen.add(t);
        }
      }
    }
    const N = allSlugs.length;
    const idf = (t: string) => {
      const df = docFreq[t] || 0;
      return Math.log((N + 1) / (df + 1));
    };

    const scored = allSlugs
      .filter((s) => s !== currentSlug)
      .map((sl) => {
        const tech = new Set(
          (projectPagesConfig[sl].techStack || []).map(normalize),
        );
        let score = 0;
        for (const t of currentTech) {
          if (tech.has(t)) score += idf(t);
        }
        return { slug: sl, score };
      })
      .sort((a, b) => b.score - a.score);
    const pool = (
      scored.some((s) => s.score > 0)
        ? scored.filter((s) => s.score > 0)
        : scored
    ).slice(0, 4);
    const dayKey = new Date().toISOString().slice(0, 10); // YYYY‑MM‑DD
    const hash = (str: string) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
      return Math.abs(h);
    };
    const rotation = pool.length ? hash(dayKey + currentSlug) % pool.length : 0;
    const picks: string[] = [];
    for (let i = 0; i < pool.length && picks.length < count; i++) {
      const idx = (i + rotation) % pool.length;
      const candidate = pool[idx].slug;
      if (!picks.includes(candidate)) picks.push(candidate);
    }
    if (picks.length < count) {
      for (const s of scored) {
        if (picks.length >= count) break;
        if (!picks.includes(s.slug)) picks.push(s.slug);
      }
    }
    return picks.slice(0, count);
  };

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
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            {t.common.overview}
          </h2>
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
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            {t.common.techStack}
          </h2>
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

        {/* links - hero call-to-action tiles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            {t.common.links}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {config.links.live && (
              <LinkTile
                href={config.links.live}
                label={
                  config.links.live.includes("chromewebstore")
                    ? t.common.chromeStore
                    : t.common.visitSite
                }
                icon={
                  config.links.live.includes("chromewebstore") ? (
                    <Globe className="w-4 h-4" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )
                }
                variant="primary"
              />
            )}
            {config.links.github && (
              <LinkTile
                href={config.links.github}
                label={t.common.sourceCode}
                icon={<FaGithubAlt className="w-4 h-4" />}
                variant="outline"
              />
            )}
            {config.links.demo && (
              <LinkTile
                href={config.links.demo}
                label={t.common.demo}
                icon={<ExternalLink className="w-4 h-4" />}
                variant="outline"
              />
            )}
          </div>
        </motion.section>

        <Separator />

        {/* mdx content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-sm max-w-none"
        >
          <MDXProvider components={MDXComponents}>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              }
            >
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
          <h2 className="text-lg font-semibold mb-6 text-foreground">
            {t.common.moreProjects}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {getRecommendedProjectSlugs(slug, 2).map((projectSlug) => {
              const project = projectPagesConfig[projectSlug];
              return (
                <Link
                  key={projectSlug}
                  to={`/projects/${projectSlug}`}
                  className="group block p-4 rounded-lg border border-border/40 bg-foreground/5 
                             transition-all duration-700 ease-out hover:bg-foreground/10 hover:border-border 
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
                >
                  <div className="mb-3">
                    <h3 className="font-medium text-foreground group-hover:underline underline-offset-4 decoration-foreground/20 transition-colors duration-300 ease-out">
                      {project.title}
                    </h3>
                  </div>
                  <time className="block text-[11px] text-muted-foreground mb-2">
                    {project.date}
                  </time>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-foreground/5 text-foreground/60 border border-foreground/10 
                                   text-xs rounded"
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

export default ProjectDeepDiveRenderer;

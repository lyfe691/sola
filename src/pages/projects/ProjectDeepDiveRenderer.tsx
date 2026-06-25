/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
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
import { ExternalLink, Globe, ArrowUpRight } from "lucide-react";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import { FaGithubAlt } from "react-icons/fa";
import {
  getProjectConfig,
  getAllProjectSlugs,
  projectPagesConfig,
} from "@/config/project-deep-dive";
import { MDXComponents, TechStack } from "@/components/mdx";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { EASE_OUT } from "@/utils/transitions";

// dynamic mdx components, cached so each path keeps a stable lazy identity
const mdxComponents = new Map<
  string,
  React.LazyExoticComponent<React.ComponentType>
>();
const getMDXComponent = (mdxPath: string) => {
  let component = mdxComponents.get(mdxPath);
  if (!component) {
    component = lazy(() => import(`@/content/projects/${mdxPath}.mdx`));
    mdxComponents.set(mdxPath, component);
  }
  return component;
};

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
  <LinkPreview href={href} previewType="auto" compact={true} className="block">
    <div
      className={[
        "group relative flex h-full items-center gap-3 rounded-xl border px-4 py-3.5",
        "transition-[background-color,border-color] duration-200 ease-out",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
        variant === "primary"
          ? "border-primary/25 bg-primary/[0.06] hover:border-primary/40 hover:bg-primary/10"
          : "border-border bg-foreground/[0.02] hover:border-foreground/25 hover:bg-foreground/[0.05]",
      ].join(" ")}
    >
      <span
        className={[
          "shrink-0 transition-colors duration-200",
          variant === "primary"
            ? "text-primary"
            : "text-foreground/55 group-hover:text-foreground",
        ].join(" ")}
      >
        {icon}
      </span>

      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm font-medium text-foreground">
          {label}
        </span>
        <span className="truncate text-xs text-foreground/45">
          {getHostname(href)}
        </span>
      </span>

      <ArrowUpRight className="ml-auto size-4 shrink-0 text-foreground/30 transition-[color,transform] duration-200 ease-out group-hover:text-primary can-hover:group-hover:-translate-y-0.5 can-hover:group-hover:translate-x-0.5" />
    </div>
  </LinkPreview>
);

// algorithmically recommend projects with overlapping tech stacks
const getRecommendedProjectSlugs = (
  currentSlug: string,
  count: number,
): string[] => {
  const allSlugs = getAllProjectSlugs();
  const current = projectPagesConfig[currentSlug];
  if (!current)
    return allSlugs.filter((s) => s !== currentSlug).slice(0, count);
  const normalize = (s: string) => s.toLowerCase();
  const currentTech = new Set((current.technologies || []).map(normalize));
  const docFreq: Record<string, number> = {};
  for (const sl of allSlugs) {
    const seen = new Set<string>();
    for (const t of (projectPagesConfig[sl].technologies || []).map(normalize)) {
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
        (projectPagesConfig[sl].technologies || []).map(normalize),
      );
      let score = 0;
      for (const t of currentTech) {
        if (tech.has(t)) score += idf(t);
      }
      return { slug: sl, score };
    })
    .sort((a, b) => b.score - a.score);
  const pool = (
    scored.some((s) => s.score > 0) ? scored.filter((s) => s.score > 0) : scored
  ).slice(0, 4);
  const dayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
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
  const projectCopy = t.projects.list[config.i18nKey];
  const title = projectCopy.title;
  const description = config.tagline ?? projectCopy.description;

  return (
    <ProjectPage
      title={title}
      description={description}
      silkColor={config.silk.color}
      silkSpeed={config.silk.speed}
      silkScale={config.silk.scale}
      silkNoiseIntensity={config.silk.noiseIntensity}
      silkRotation={config.silk.rotation}
    >
      <motion.div
        className="space-y-16"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
        }}
      >
        {/* date - article-like header */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: EASE_OUT },
            },
          }}
          className="text-center -mb-8"
        >
          <time className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            {config.date}
          </time>
        </motion.div>

        {/* overview */}
        <motion.section
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: EASE_OUT },
            },
          }}
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
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: EASE_OUT },
            },
          }}
        >
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            {t.common.techStack}
          </h2>
          <TechStack technologies={config.technologies} />
        </motion.section>

        {/* links - hero call-to-action tiles */}
        <motion.section
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: EASE_OUT },
            },
          }}
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
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="prose prose-sm max-w-none"
        >
          <MDXProvider components={MDXComponents}>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-8">
                  <Spinner className="size-6 text-muted-foreground" />
                </div>
              }
            >
              <MDXComponent />
            </Suspense>
          </MDXProvider>
        </motion.div>

        {/* related projects */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="border-t border-border pt-12"
        >
          <h2 className="text-lg font-semibold mb-6 text-foreground">
            {t.common.moreProjects}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {getRecommendedProjectSlugs(slug, 2).map((projectSlug) => {
              const project = projectPagesConfig[projectSlug];
              const relatedCopy = t.projects.list[project.i18nKey];
              return (
                <Link
                  key={projectSlug}
                  to={`/projects/${projectSlug}`}
                  className="group block rounded-4xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <Card className="h-full gap-2 bg-card/40 p-4 backdrop-blur-md transition-shadow duration-300 group-hover:shadow-lg">
                    <h3 className="font-medium text-foreground underline-offset-4 decoration-foreground/20 transition-colors duration-300 group-hover:underline">
                      {relatedCopy.title}
                    </h3>
                    <time className="block text-[11px] text-muted-foreground">
                      {project.date}
                    </time>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {project.tagline ?? relatedCopy.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="font-normal"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </motion.section>
      </motion.div>
    </ProjectPage>
  );
};

export default ProjectDeepDiveRenderer;

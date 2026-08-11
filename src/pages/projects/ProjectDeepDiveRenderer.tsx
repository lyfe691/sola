/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Resolves /projects/:slug into the deep-dive shell: config-driven sections
 * (date, overview, tech stack, links), the project's MDX article, and the
 * related-projects footer.
 */

import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Link, Navigate, useParams } from "react-router";
import { motion } from "motion/react";
import { MDXProvider } from "@mdx-js/react";
import { ExternalLink, Globe } from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import {
  DeepDiveSectionMenu,
  DeepDiveSectionRail,
  useActiveSection,
  useDeepDiveSections,
} from "@/components/deep-dive-nav";
import { ProjectDeepDive } from "@/components/ProjectDeepDive";
import { MDXComponents, SectionHeading, TechStack } from "@/components/mdx";
import { blockReveal } from "@/components/mdx/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  getProjectConfig,
  projectPagesConfig,
  type ProjectPageConfig,
} from "@/config/project-deep-dive";
import { useLanguage } from "@/lib/language-provider";
import { getRelatedProjectSlugs } from "@/lib/related-projects";
import { translations, type Translation } from "@/lib/translations";
import { scrollSubtleVariants } from "@/utils/transitions";

// every lazy MDX component is created once at module load (nothing fetches
// until first render), so render only ever looks identities up — never
// creates them
const mdxComponents: Record<string, LazyExoticComponent<ComponentType>> =
  Object.fromEntries(
    Object.values(projectPagesConfig).map((config) => [
      config.mdxPath,
      lazy(() => import(`@/content/projects/${config.mdxPath}.mdx`)),
    ]),
  );

// stagger root for the config-driven sections; each child rides
// scrollSubtleVariants
const cascade = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// mounts once the sibling lazy MDX component resolves — the signal that the
// article's headings exist for section discovery
function MountSignal({ onMount }: { onMount: () => void }) {
  useEffect(() => {
    onMount();
  }, [onMount]);
  return null;
}

interface LinkAction {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  variant: "default" | "outline";
}

function getLinkActions(
  links: ProjectPageConfig["links"],
  t: Translation,
): LinkAction[] {
  const actions: LinkAction[] = [];
  if (links.live) {
    const isChromeStore = links.live.includes("chromewebstore");
    actions.push({
      href: links.live,
      label: isChromeStore ? t.common.chromeStore : t.common.visitSite,
      Icon: isChromeStore ? Globe : ExternalLink,
      variant: "default",
    });
  }
  if (links.github) {
    actions.push({
      href: links.github,
      label: t.common.sourceCode,
      Icon: FaGithubAlt,
      variant: "outline",
    });
  }
  if (links.demo) {
    actions.push({
      href: links.demo,
      label: t.common.demo,
      Icon: ExternalLink,
      variant: "outline",
    });
  }
  return actions;
}

const ProjectDeepDiveRenderer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = translations[language];

  const contentRef = useRef<HTMLDivElement>(null);
  // which slug's article has mounted — comparing against the current slug
  // makes readiness reset itself on navigation, no effect needed
  const [readySlug, setReadySlug] = useState<string | null>(null);
  const mdxReady = readySlug === slug;

  const sections = useDeepDiveSections(
    contentRef,
    `${slug}:${language}:${mdxReady}`,
  );
  const activeId = useActiveSection(sections);

  const config = slug ? getProjectConfig(slug) : undefined;
  const MDXComponent = config ? (mdxComponents[config.mdxPath] ?? null) : null;

  if (!slug) {
    return <Navigate to="/projects" replace />;
  }
  if (!config || !MDXComponent) {
    return <Navigate to="/404" replace />;
  }

  const projectCopy = t.projects.list[config.i18nKey];
  const title = projectCopy.title;
  const description = config.tagline ?? projectCopy.description;

  return (
    <ProjectDeepDive
      title={title}
      description={description}
      silk={config.silk}
      sectionNav={
        <DeepDiveSectionMenu sections={sections} activeId={activeId} />
      }
    >
      <DeepDiveSectionRail sections={sections} activeId={activeId} />
      <motion.div
        ref={contentRef}
        className="space-y-16"
        initial="hidden"
        animate="visible"
        variants={cascade}
      >
        {/* date */}
        <motion.div variants={scrollSubtleVariants} className="text-center">
          <time className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {config.date}
          </time>
        </motion.div>

        {/* overview */}
        <motion.section
          id="overview"
          data-toc=""
          data-toc-label={t.common.overview}
          className="scroll-mt-24"
          variants={scrollSubtleVariants}
        >
          <SectionHeading sectionId="overview">
            {t.common.overview}
          </SectionHeading>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {config.overview}
          </p>
        </motion.section>

        {/* tech stack */}
        <motion.section
          id="tech-stack"
          data-toc=""
          data-toc-label={t.common.techStack}
          className="scroll-mt-24"
          variants={scrollSubtleVariants}
        >
          <SectionHeading sectionId="tech-stack">
            {t.common.techStack}
          </SectionHeading>
          <TechStack technologies={config.technologies} />
        </motion.section>

        {/* links */}
        <motion.section
          id="links"
          data-toc=""
          data-toc-label={t.common.links}
          className="scroll-mt-24"
          variants={scrollSubtleVariants}
        >
          <SectionHeading sectionId="links">{t.common.links}</SectionHeading>
          <div className="flex flex-wrap gap-3">
            {getLinkActions(config.links, t).map(
              ({ href, label, Icon, variant }) => (
                <Button
                  key={href}
                  nativeButton={false}
                  size="lg"
                  variant={variant}
                  className="gap-2"
                  render={
                    <a href={href} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </Button>
              ),
            )}
          </div>
        </motion.section>

        <Separator />

        {/* mdx content — the article is tall, so a low viewport amount lets
            the reveal fire as soon as it enters. Custom MDX components own
            all styling (no prose plugin). */}
        <motion.div
          variants={scrollSubtleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="max-w-none"
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
              <MountSignal key={slug} onMount={() => setReadySlug(slug)} />
            </Suspense>
          </MDXProvider>
        </motion.div>

        {/* related projects */}
        <motion.section
          {...blockReveal}
          id="more-projects"
          data-toc=""
          data-toc-label={t.common.moreProjects}
          className="border-t border-border pt-12 scroll-mt-24"
        >
          <SectionHeading sectionId="more-projects" className="mb-6">
            {t.common.moreProjects}
          </SectionHeading>
          <div className="grid sm:grid-cols-2 gap-6">
            {getRelatedProjectSlugs(slug, 2).map((relatedSlug) => {
              const related = projectPagesConfig[relatedSlug];
              const relatedCopy = t.projects.list[related.i18nKey];
              return (
                <Link
                  key={relatedSlug}
                  to={`/projects/${relatedSlug}`}
                  className="group block rounded-4xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <Card className="h-full gap-2 bg-card/40 p-4 backdrop-blur-md transition-shadow duration-300 group-hover:shadow-lg">
                    <h3 className="font-medium text-foreground underline-offset-4 decoration-foreground/20 transition-colors duration-300 group-hover:underline">
                      {relatedCopy.title}
                    </h3>
                    <time className="block text-2xs text-muted-foreground">
                      {related.date}
                    </time>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {related.tagline ?? relatedCopy.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {related.technologies.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="font-normal"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {related.technologies.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{related.technologies.length - 3}
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
    </ProjectDeepDive>
  );
};

export default ProjectDeepDiveRenderer;

/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Resolves /projects/:slug into the deep-dive shell: config sections (date,
 * overview, tech, links), the project's MDX article, and related projects.
 * Hero motion lives in ProjectDeepDive; this file is static markup only.
 */

import {
  lazy,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Link, Navigate, useLocation, useParams } from "react-router";
import { useReducedMotion } from "motion/react";
import {
  Github01Icon,
  Globe02Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { hugeIcon } from "@/lib/huge-icon";
import {
  DeepDiveSectionMenu,
  DeepDiveSectionRail,
  useActiveSection,
  useDeepDiveSections,
} from "@/components/deep-dive-nav";
import { ProjectDeepDive } from "@/components/ProjectDeepDive";
import { PrivateLinkButton } from "@/components/private-link-button";
import { Mdx, SectionHeading, TechStack } from "@/components/mdx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getProjectConfig,
  projectPagesConfig,
  type ProjectPageConfig,
} from "@/config/project-deep-dive";
import { formatProjectDate, INTL_LOCALE } from "@/lib/dates";
import { useLanguage, useTranslation } from "@/lib/language-provider";
import { plainText } from "@/lib/plain-text";
import { getRelatedProjectSlugs } from "@/lib/related-projects";
import { scrollToTarget } from "@/utils/scroll";
import type { Translation } from "@/lib/translations";

// lazy modules created once at load; first render only looks them up
const mdxByPath: Record<
  string,
  LazyExoticComponent<ComponentType>
> = Object.fromEntries(
  Object.values(projectPagesConfig).map((config) => [
    config.mdxPath,
    lazy(() => import(`@/content/projects/${config.mdxPath}.mdx`)),
  ]),
);

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
  /** Set when there is nothing to link to: the button renders disabled
   *  and this is its tooltip. */
  disabledReason?: string;
}

function getLinkActions(
  { links, sourcePrivate, linkPrivate, kind }: ProjectPageConfig,
  t: Translation,
): LinkAction[] {
  const actions: LinkAction[] = [];
  if (links.live) {
    const isChromeStore = links.live.includes("chromewebstore");
    actions.push({
      href: links.live,
      label: isChromeStore ? t.common.chromeStore : t.common.visitSite,
      Icon: isChromeStore ? hugeIcon(Globe02Icon) : hugeIcon(LinkSquare02Icon),
      variant: "default",
    });
  } else if (linkPrivate) {
    actions.push({
      href: "#link-private",
      label: t.common.visitSite,
      Icon: hugeIcon(LinkSquare02Icon),
      variant: "default",
      disabledReason:
        kind === "commercial"
          ? t.common.linkPrivateClient
          : t.common.linkPrivate,
    });
  }
  if (links.github) {
    actions.push({
      href: links.github,
      label: t.common.sourceCode,
      Icon: hugeIcon(Github01Icon),
      variant: "outline",
    });
  } else if (sourcePrivate) {
    actions.push({
      href: "#source-private",
      label: t.common.sourceCode,
      Icon: hugeIcon(Github01Icon),
      variant: "outline",
      disabledReason:
        kind === "commercial"
          ? t.common.sourcePrivateClient
          : t.common.sourcePrivate,
    });
  }
  if (links.demo) {
    actions.push({
      href: links.demo,
      label: t.common.demo,
      Icon: hugeIcon(LinkSquare02Icon),
      variant: "outline",
    });
  }
  return actions;
}

function RelatedProjectCard({
  slug,
  title,
  date,
  blurb,
  technologies,
}: {
  slug: string;
  title: string;
  date: string;
  blurb: string;
  technologies: string[];
}) {
  return (
    <Link
      to={`/projects/${slug}`}
      className="group block rounded-4xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <Card variant="translucent" lift className="h-full gap-2 p-4">
        <h3 className="font-medium text-foreground underline-offset-4 decoration-foreground/20 transition-colors duration-300 group-hover:underline">
          {title}
        </h3>
        <time className="block text-2xs text-muted-foreground">{date}</time>
        <p className="text-xs leading-relaxed text-muted-foreground">{blurb}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="chip">
              {tech}
            </Badge>
          ))}
          {technologies.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{technologies.length - 3}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

const ProjectDeepDiveRenderer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = useTranslation();

  const contentRef = useRef<HTMLDivElement>(null);
  // track which slug's MDX has mounted so TOC rediscovers after navigation
  const [readySlug, setReadySlug] = useState<string | null>(null);
  const mdxReady = readySlug === slug;

  const sections = useDeepDiveSections(
    contentRef,
    `${slug}:${language}:${mdxReady}`,
  );
  const activeId = useActiveSection(sections);

  // a link to a section (a search result, a shared permalink) lands on it
  // once the article is there: at once when the page has just opened,
  // gliding when the reader is already on it
  const { hash } = useLocation();
  const reducedMotion = useReducedMotion();
  const landedOn = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!mdxReady || !hash) return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    const opening = landedOn.current !== slug;
    landedOn.current = slug;
    scrollToTarget(target, { immediate: opening || !!reducedMotion });
  }, [mdxReady, hash, slug, reducedMotion]);

  const config = slug ? getProjectConfig(slug) : undefined;
  const MDXComponent = config ? (mdxByPath[config.mdxPath] ?? null) : null;

  if (!slug) {
    return <Navigate to="/projects" replace />;
  }
  if (!config || !MDXComponent) {
    return <Navigate to="/404" replace />;
  }

  const projectCopy = t.projects.list[config.i18nKey];
  const title = projectCopy.title;
  const dateLabel = formatProjectDate(
    INTL_LOCALE[language],
    config.date,
    t.common.present,
  );

  return (
    <ProjectDeepDive
      title={title}
      subtitle={projectCopy.tagline}
      description={plainText(projectCopy.description)}
      art={config.art}
      source={`${config.mdxPath}.mdx`}
      sectionNav={
        <DeepDiveSectionMenu sections={sections} activeId={activeId} />
      }
    >
      <DeepDiveSectionRail sections={sections} activeId={activeId} />

      <div ref={contentRef} className="space-y-16">
        <div className="text-center">
          <time
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            dateTime={config.date.start}
          >
            {dateLabel}
          </time>
        </div>

        <section
          id="overview"
          data-toc=""
          data-toc-label={t.common.overview}
          className="scroll-mt-24"
        >
          <SectionHeading sectionId="overview">
            {t.common.overview}
          </SectionHeading>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {config.overview}
          </p>
        </section>

        <section
          id="tech-stack"
          data-toc=""
          data-toc-label={t.common.techStack}
          className="scroll-mt-24"
        >
          <SectionHeading sectionId="tech-stack">
            {t.common.techStack}
          </SectionHeading>
          <TechStack technologies={config.technologies} />
        </section>

        <section
          id="links"
          data-toc=""
          data-toc-label={t.common.links}
          className="scroll-mt-24"
        >
          <SectionHeading sectionId="links">{t.common.links}</SectionHeading>
          <div className="flex flex-wrap gap-3">
            {getLinkActions(config, t).map(
              ({ href, label, Icon, variant, disabledReason }) =>
                disabledReason ? (
                  <PrivateLinkButton
                    key={href}
                    label={label}
                    reason={disabledReason}
                    icon={<Icon className="h-4 w-4" aria-hidden />}
                    variant={variant}
                  />
                ) : (
                  <Button
                    key={href}
                    nativeButton={false}
                    size="lg"
                    variant={variant}
                    className="gap-2"
                    render={
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </Button>
                ),
            )}
          </div>
        </section>

        <Mdx>
          <MDXComponent />
          <MountSignal key={slug} onMount={() => setReadySlug(slug)} />
        </Mdx>

        <section
          id="more-projects"
          data-toc=""
          data-toc-label={t.common.moreProjects}
          className="scroll-mt-24"
        >
          <SectionHeading sectionId="more-projects" className="mb-6">
            {t.common.moreProjects}
          </SectionHeading>
          <div className="grid gap-6 sm:grid-cols-2">
            {getRelatedProjectSlugs(slug, 2).map((relatedSlug) => {
              const related = projectPagesConfig[relatedSlug];
              const relatedCopy = t.projects.list[related.i18nKey];
              return (
                <RelatedProjectCard
                  key={relatedSlug}
                  slug={relatedSlug}
                  title={relatedCopy.title}
                  date={formatProjectDate(
                    INTL_LOCALE[language],
                    related.date,
                    t.common.present,
                  )}
                  blurb={relatedCopy.tagline}
                  technologies={related.technologies}
                />
              );
            })}
          </div>
        </section>
      </div>
    </ProjectDeepDive>
  );
};

export default ProjectDeepDiveRenderer;

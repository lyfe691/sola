/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The deep-dive page shell: the painted hero in the project's own palette,
 * the sticky breadcrumb bar with the code-view toggle, and the content
 * column. The renderer supplies everything project-specific through props.
 *
 * Hero sequence: painted art settles → title FoldText → subtitle FoldText.
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { ArrowLeft02Icon, CodeXmlIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { IconButton } from "./ui/custom/icon-button";
import FoldText from "./ui/custom/FoldText";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { DiffHintContent } from "@/components/deploy-diff/diff-hint";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { snapScrollTo } from "@/utils/scroll";
import type { ProjectArt } from "@/config/projects";
import { PaintedCover } from "@/components/painted-cover/PaintedCover";

/** Beat after the art is visible, before title unfolds (ms). */
const BG_TO_TITLE_MS = 400;

/**
 * Hero sequence (one GPU job at a time):
 *   1. base gradient → painted art fades in (WebGL free to run)
 *   2. freeze the art, then FoldText title (word panels)
 *   3. FoldText subtitle after title completes
 *   4. unfreeze the art
 *
 * Char-split + mix-blend creases + live WebGL was the stutter.
 */
function DeepDiveHero({
  title,
  subtitle,
  art,
}: {
  title: string;
  subtitle: string;
  art: ProjectArt;
}) {
  const [artReady, setArtReady] = useState(false);
  // freeze WebGL while text folds so they never share a frame budget
  const [folding, setFolding] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const onArtReady = useCallback(() => setArtReady(true), []);

  useEffect(() => {
    if (!artReady) return;
    const t = window.setTimeout(() => {
      setFolding(true);
      setShowTitle(true);
    }, BG_TO_TITLE_MS);
    return () => window.clearTimeout(t);
  }, [artReady]);

  const finishText = useCallback(() => {
    setFolding(false);
  }, []);

  return (
    <div className="relative mb-6 h-[60vh] min-h-[400px] overflow-hidden rounded-3xl border-4 border-border shadow-lg shadow-black/5">
      <PaintedCover
        art={art}
        size="hero"
        scrim="dim"
        paused={folding}
        onReady={onArtReady}
        className="absolute inset-0"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-4xl px-6 text-center">
          {/* match FoldText metrics so mount doesn't reflow/stutter */}
          <h1
            className="mb-6 min-h-[1.1em] text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ lineHeight: 0.95 }}
          >
            {showTitle ? (
              <FoldText
                text={title}
                splitBy="char"
                hinge="top"
                trigger="mount"
                duration={0.65}
                stagger={0.045}
                ease="power3.out"
                perspective={700}
                creaseShading={0.55}
                fontSize="clamp(2.75rem, 9vw, 6rem)"
                fontWeight={800}
                color="#ffffff"
                onComplete={() => setShowSubtitle(true)}
              />
            ) : (
              <span className="invisible select-none" aria-hidden="true">
                {title}
              </span>
            )}
          </h1>

          <p
            className="mx-auto min-h-[1.5em] max-w-2xl text-base font-light tracking-[-0.04em] sm:text-lg md:text-xl"
            style={{ lineHeight: 0.95 }}
          >
            {showSubtitle ? (
              <FoldText
                text={subtitle}
                splitBy="word"
                hinge="top"
                trigger="mount"
                duration={0.55}
                stagger={0.04}
                ease="power3.out"
                perspective={700}
                creaseShading={0.4}
                fontSize="clamp(1rem, 2.2vw, 1.25rem)"
                fontWeight={300}
                color="rgba(255,255,255,0.9)"
                onComplete={finishText}
              />
            ) : (
              <span className="invisible select-none" aria-hidden="true">
                {subtitle}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ProjectDeepDiveProps {
  title: string;
  /** The localized tagline: the hero's second line. */
  subtitle: string;
  /** The localized description: the page's meta description only. */
  description: string;
  art: ProjectArt;
  /** expanding section menu rendered under the sticky bar's breadcrumb row
      (the <2xl register) */
  sectionNav?: ReactNode;
  children?: ReactNode;
}

export function ProjectDeepDive({
  title,
  subtitle,
  description,
  art,
  sectionNav,
  children,
}: ProjectDeepDiveProps) {
  const navigate = useNavigate();
  const { setActive: setCodeView } = useCodeView();
  const { language } = useLanguage();
  const t = translations[language];

  useLayoutEffect(() => {
    snapScrollTo(0);
  }, []);

  // no page-shell opacity fade — it fought the painted art + FoldText GPU
  // work and read as a mid-sequence hitch
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <meta name="description" content={description} />

      <DeepDiveHero
        key={`${title}-${art.preset}-${art.seed ?? 0}`}
        title={title}
        subtitle={subtitle}
        art={art}
      />

      <div className="sticky top-0 z-30 -mx-4 bg-background/95 backdrop-blur-xs sm:-mx-6 lg:-mx-8">
        <div className="border-b border-border px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl py-4">
            <div className="flex items-center justify-between gap-3">
              <Breadcrumb className="min-w-0">
                <BreadcrumbList className="flex-nowrap">
                  <BreadcrumbItem className="shrink-0">
                    <BreadcrumbLink href="/" className="text-xs">
                      {t.common.home}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="shrink-0">
                    <BreadcrumbLink href="/projects" className="text-xs">
                      {t.nav.projects}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="min-w-0">
                    <BreadcrumbPage className="block truncate text-xs font-medium">
                      {title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex shrink-0 items-center gap-1.5">
                <HoverCard>
                  <HoverCardTrigger
                    delay={250}
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setCodeView(true)}
                        aria-label={t.common.diff.showDiff}
                        className="text-muted-foreground hover:text-foreground"
                      />
                    }
                  >
                    <HugeiconsIcon
                      icon={CodeXmlIcon}
                      strokeWidth={2}
                      className="size-4"
                      aria-hidden="true"
                    />
                  </HoverCardTrigger>
                  <DiffHintContent side="bottom" />
                </HoverCard>

                <IconButton
                  variant="ghost"
                  icon={
                    <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} />
                  }
                  iconPosition="left"
                  size="sm"
                  onClick={() => navigate("/projects")}
                  className="h-8 gap-2 px-3 text-xs"
                >
                  {t.common.back}
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        {sectionNav}
      </div>

      {children && (
        <div className="relative mx-auto max-w-4xl py-12">{children}</div>
      )}
    </div>
  );
}

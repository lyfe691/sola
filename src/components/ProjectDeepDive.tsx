/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The deep-dive page shell: the painted hero in the project's own palette
 * and the content column. The renderer supplies everything project-specific
 * through props.
 *
 * The page's navigation (back to the projects, where you are, the code-view
 * toggle) is one row in two places. At the top it sits inside the hero, over
 * the artwork, so nothing stands between the hero and the article. Once the
 * hero has scrolled away the same row docks as the full-width bar, which
 * takes no room in the page: it is a zero-height sticky line the bar hangs
 * from.
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
import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import FoldText from "./ui/custom/FoldText";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { DiffHintContent } from "@/components/deploy-diff/diff-hint";
import { useDeepDiveBarPinned } from "@/hooks/use-deep-dive-bar-pinned";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";
import { snapScrollTo } from "@/utils/scroll";
import type { ProjectArt } from "@/config/projects";
import { PaintedCover } from "@/components/painted-cover/PaintedCover";

/**
 * Where you came from and where you are. `hero` is the row over the artwork,
 * white on paint the cover already dims — nothing soft, no shadow behind the
 * type, no layer across the art; `bar` is the docked one, in the page's own
 * tokens.
 */
function DeepDiveTrail({
  title,
  tone,
}: {
  title: string;
  tone: "hero" | "bar";
}) {
  const t = useTranslation();
  const hero = tone === "hero";

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className={cn("flex-nowrap", hero && "text-white/75")}>
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink
            render={<Link to="/projects" />}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs",
              hero && "hover:text-white",
            )}
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              strokeWidth={2}
              className="size-3.5"
              aria-hidden="true"
            />
            {t.nav.projects}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className={hero ? "text-white/40" : undefined} />
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage
            className={cn(
              "block truncate text-xs font-medium",
              hero && "text-white",
            )}
          >
            {title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/**
 * The way into the code view, which on a deep dive shows the diff of the one
 * file that is genuinely this page. So the trigger says so: it wears the file
 * name rather than a bare glyph, and in the hero it sits in the far corner
 * from the trail, the way a caption sits on a plate.
 */
function CodeViewChip({
  source,
  tone,
}: {
  source: string;
  tone: "hero" | "bar";
}) {
  const { setActive: setCodeView } = useCodeView();
  const t = useTranslation();
  const hero = tone === "hero";

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={250}
        render={
          <button
            type="button"
            onClick={() => setCodeView(true)}
            aria-label={t.common.diff.showDiff}
            className={cn(
              "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full text-xs",
              "outline-none transition-[background-color,color,scale] duration-150 ease-out",
              "active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring/40",
              hero
                ? "bg-black/25 py-1.5 pr-3.5 pl-3 text-white/80 hover:bg-black/40 hover:text-white"
                : "px-2 py-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )}
          />
        }
      >
        <HugeiconsIcon
          icon={CodeXmlIcon}
          strokeWidth={2}
          className="size-3.5"
          aria-hidden="true"
        />
        <span className="font-mono">{source}</span>
      </HoverCardTrigger>
      <DiffHintContent side={hero ? "top" : "bottom"} />
    </HoverCard>
  );
}

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
  source,
}: {
  title: string;
  subtitle: string;
  art: ProjectArt;
  source: string;
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

      <div className="absolute inset-x-0 top-0 z-10 px-5 pt-4 sm:px-7 sm:pt-5">
        <DeepDiveTrail title={title} tone="hero" />
      </div>

      <div className="absolute right-5 bottom-4 z-10 sm:right-7 sm:bottom-5">
        <CodeViewChip source={source} tone="hero" />
      </div>

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
  /** The file this page is, which the code view diffs (e.g. `ura.mdx`). */
  source: string;
  /** expanding section menu rendered under the docked bar's row (the
      register without a pointer or a desktop-sized screen) */
  sectionNav?: ReactNode;
  children?: ReactNode;
}

export function ProjectDeepDive({
  title,
  subtitle,
  description,
  art,
  source,
  sectionNav,
  children,
}: ProjectDeepDiveProps) {
  const docked = useDeepDiveBarPinned();

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
        source={source}
      />

      {/* a zero-height sticky line: it reaches the top as the hero leaves,
          and the bar hangs from it, so the bar costs the page no room and
          only exists once there is no hero to hold the row */}
      <div
        data-deep-dive-bar=""
        className="sticky top-0 z-30 -mx-4 h-0 sm:-mx-6 lg:-mx-8"
      >
        <div
          inert={!docked}
          className={cn(
            // opaque, not glass: the article scrolls under it, and at any
            // translucency its text ghosts through the row
            "absolute inset-x-0 top-0 bg-background",
            "transition-[opacity,translate] duration-300 ease-out",
            docked
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0",
          )}
        >
          <div className="border-b border-border px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 py-4">
              <DeepDiveTrail title={title} tone="bar" />
              <CodeViewChip source={source} tone="bar" />
            </div>
          </div>
          {sectionNav}
        </div>
      </div>

      {children && (
        <div className="relative mx-auto max-w-4xl py-12">{children}</div>
      )}
    </div>
  );
}

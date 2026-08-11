/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The deep-dive page shell: the silk hero in the project's own color, the
 * sticky breadcrumb bar with the code-view toggle, and the content column.
 * The renderer supplies everything project-specific through props.
 *
 * Hero sequence: silk background settles → title FoldText → subtitle FoldText.
 */

import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { ArrowLeft, CodeXml } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { IconButton } from "./ui/custom/icon-button";
import FoldText from "./ui/custom/FoldText";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { DiffHintContent } from "@/components/deploy-diff/diff-hint";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import type { ProjectSilk } from "@/config/projects";
import { EASE_OUT } from "@/utils/transitions";

const Silk = lazy(() => import("@/components/backgrounds/Silk"));

// silk color is on screen from the first paint; this delay only covers WebGL
// startup so the GPU layer can crossfade over the solid fill
function SilkLoader({
  onReady,
  ...props
}: ComponentProps<typeof Silk> & { onReady: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onReady, 80);
    return () => clearTimeout(timer);
  }, [onReady]);

  return <Silk {...props} />;
}

/** Beat after silk starts fading in, before title unfolds (ms). */
const BG_TO_TITLE_MS = 320;
/** Beat after title mounts, before subtitle unfolds (ms). */
const TITLE_TO_SUBTITLE_MS = 420;

interface ProjectDeepDiveProps {
  title: string;
  description?: string;
  silk: ProjectSilk;
  /** expanding section menu rendered under the sticky bar's breadcrumb row
      (the <2xl register) */
  sectionNav?: ReactNode;
  children?: ReactNode;
}

export function ProjectDeepDive({
  title,
  description,
  silk,
  sectionNav,
  children,
}: ProjectDeepDiveProps) {
  const navigate = useNavigate();
  const [silkReady, setSilkReady] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const { setActive: setCodeView } = useCodeView();
  const { language } = useLanguage();
  const t = translations[language];

  const onSilkReady = useCallback(() => setSilkReady(true), []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // new project → restart the hero sequence
  useEffect(() => {
    setSilkReady(false);
    setShowTitle(false);
    setShowSubtitle(false);
  }, [title, silk.color]);

  // background first → title → subtitle (FoldText mounts on each beat so its
  // mount trigger fires at the right moment — no instant race with silk)
  useEffect(() => {
    if (!silkReady) return;
    const titleTimer = window.setTimeout(
      () => setShowTitle(true),
      BG_TO_TITLE_MS,
    );
    return () => window.clearTimeout(titleTimer);
  }, [silkReady]);

  useEffect(() => {
    if (!showTitle || !description) return;
    const subTimer = window.setTimeout(
      () => setShowSubtitle(true),
      TITLE_TO_SUBTITLE_MS,
    );
    return () => window.clearTimeout(subTimer);
  }, [showTitle, description]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="min-h-screen bg-background p-4 sm:p-6 lg:p-8"
    >
      {description && <meta name="description" content={description} />}

      <div className="relative mb-6 h-[60vh] min-h-[400px] overflow-hidden rounded-3xl border-4 border-border shadow-lg shadow-black/5">
        {/* solid project color from first paint; silk crossfades on top */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: silk.color }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: silkReady ? 1 : 0 }}
        >
          <Suspense fallback={null}>
            {/* key remounts silk + restarts the bg→text sequence per project */}
            <SilkLoader
              key={silk.color + title}
              {...silk}
              onReady={onSilkReady}
            />
          </Suspense>
        </div>

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl px-6 text-center">
            {/* reserve title space so the layout doesn't jump when FoldText mounts */}
            <h1 className="mb-6 min-h-[1.1em] text-5xl font-extrabold sm:text-6xl md:text-7xl lg:text-8xl">
              {showTitle ? (
                <FoldText
                  key={`title-${title}`}
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
                />
              ) : (
                <span className="invisible select-none" aria-hidden="true">
                  {title}
                </span>
              )}
            </h1>

            {description ? (
              <p className="mx-auto min-h-[1.5em] max-w-2xl text-base font-light sm:text-lg md:text-xl">
                {showSubtitle ? (
                  <FoldText
                    key={`sub-${title}`}
                    text={description}
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
                  />
                ) : (
                  <span className="invisible select-none" aria-hidden="true">
                    {description}
                  </span>
                )}
              </p>
            ) : null}
          </div>
        </div>
      </div>

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
                <Tooltip>
                  <TooltipTrigger
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
                    <CodeXml className="size-4" aria-hidden="true" />
                  </TooltipTrigger>
                  <DiffHintContent side="bottom" />
                </Tooltip>

                <IconButton
                  variant="ghost"
                  icon={<ArrowLeft />}
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
    </motion.div>
  );
}

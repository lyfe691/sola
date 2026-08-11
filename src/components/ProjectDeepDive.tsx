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
 */

import {
  Suspense,
  lazy,
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
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { DiffHintContent } from "@/components/deploy-diff/diff-hint";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import type { ProjectSilk } from "@/config/projects";
import { EASE_EXPO, EASE_OUT, REVEAL } from "@/utils/transitions";

const Silk = lazy(() => import("@/components/backgrounds/Silk"));

// tells the shell when Silk is on screen so it can crossfade away from the
// flat color placeholder; the small delay covers WebGL context startup
function SilkLoader({
  onReady,
  ...props
}: ComponentProps<typeof Silk> & { onReady: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onReady, 50);
    return () => clearTimeout(timer);
  }, [onReady]);

  return <Silk {...props} />;
}

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
  const { setActive: setCodeView } = useCodeView();
  const { language } = useLanguage();
  const t = translations[language];

  // instant scroll to top on mount to prevent white flash during smooth scroll
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className="min-h-screen bg-background p-4 sm:p-6 lg:p-8"
    >
      {description && <meta name="description" content={description} />}

      {/* hero section */}
      <div className="relative mb-6 h-[60vh] min-h-[400px] overflow-hidden rounded-3xl border-4 border-border shadow-lg shadow-black/5">
        {/* silk background - fades in when ready */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: silkReady ? 1 : 0 }}
        >
          <Suspense fallback={null}>
            <SilkLoader {...silk} onReady={() => setSilkReady(true)} />
          </Suspense>
        </div>
        {/* placeholder while silk loads - uses the silk color for a seamless
            crossfade */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ backgroundColor: silk.color, opacity: silkReady ? 0 : 1 }}
        />

        <div className="absolute inset-0 bg-black/20" />

        {/* hero content — rare lush entrance (EASE_EXPO), then soft REVEAL body */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="max-w-4xl px-6 text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.08, delayChildren: 0.12 },
              },
            }}
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.55, ease: EASE_EXPO }}
              className="mb-6 text-5xl font-bold text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: REVEAL }}
                className="text-base font-light text-white/90 sm:text-lg md:text-xl"
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* navigation — the border lives on the breadcrumb row, not the bar:
          the section menu row hangs below the line with no edge of its own
          (its sheet covers that seam whenever it opens) */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xs -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="border-b border-border px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto py-4">
            <div className="flex items-center justify-between gap-3">
              {/* min-w-0 down the chain + nowrap list: the crumbs yield to
                  the button cluster and the title truncates instead of the
                  two overlapping on narrow screens */}
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
                  className="text-xs h-8 px-3 gap-2"
                >
                  {t.common.back}
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        {sectionNav}
      </div>

      {/* content — relative so the section nav can hang off the column and
          span its full height */}
      {children && (
        <div className="relative max-w-4xl mx-auto py-12">{children}</div>
      )}
    </motion.div>
  );
}

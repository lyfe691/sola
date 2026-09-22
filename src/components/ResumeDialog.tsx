/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The resume: on desktop a card that grows in place into a reader with
 * the PDF's pages inside; on a phone a sheet that opens onto the pages.
 */

import { useRef, useState, type Ref } from "react";
import { flushSync } from "react-dom";
import {
  ArrowLeft01Icon,
  Download01Icon,
  Download04Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useReducedMotion } from "motion/react";
import { RichText } from "@/components/i18n/RichText";
import { PdfPages } from "@/components/pdf-pages";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/custom/icon-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";
import { useLanguage, useTranslation } from "@/lib/language-provider";
import { loadPdf } from "@/lib/pdf";
import { cn } from "@/lib/utils";
import { cssSpring, MORPH } from "@/utils/transitions";

type ResumeLanguage = "en" | "de";
const RESUME_LANGUAGES: readonly ResumeLanguage[] = ["en", "de"];

const pdfFor = (language: ResumeLanguage) => `/sola_${language}.pdf`;

const downloadResume = (language: ResumeLanguage) => {
  const link = document.createElement("a");
  link.href = pdfFor(language);
  link.download =
    language === "de"
      ? "Lebenslauf_Yanis-Sebastian-Zürcher.pdf"
      : "Resume_Yanis-Sebastian-Zürcher.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const openResume = (language: ResumeLanguage) => {
  window.open(pdfFor(language), "_blank", "noopener");
};

type View = "card" | "reader";

// ---- The morph: the card growing into the reader, drawn by the browser ----
// The view changes in one commit, inside a view transition: the browser
// photographs the dialog before and after and animates between the two
// boxes itself, so no frame of the morph runs layout, React or JS on the
// page. The parts it moves (see "resume morph" in index.css):
//   - the box's surface, resized rather than scaled, so its corners, ring
//     and shadow are true at every size;
//   - the content, clipped to the box, its two pictures never stretched:
//     each keeps its own size, pinned to the corner it leads with, and they
//     crossfade while the box grows or shrinks around them;
//   - the title and the close button, the same in both views, which travel
//     between their two places without fading.
// All of it on MORPH, the same spring as ever, handed to CSS as linear().

const MORPH_TIMING = cssSpring(MORPH);

function LanguageTabs({
  value,
  onChange,
  label,
  compact = false,
}: {
  value: ResumeLanguage;
  onChange: (language: ResumeLanguage) => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onChange(next as ResumeLanguage)}
    >
      <TabsList aria-label={label}>
        {RESUME_LANGUAGES.map((language) => (
          <TabsTrigger
            key={language}
            value={language}
            className={compact ? "h-6 px-2.5 uppercase" : "uppercase"}
          >
            {language}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function IconAction({
  icon,
  label,
  onClick,
}: {
  icon: IconSvgElement;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={onClick}
          />
        }
      >
        <HugeiconsIcon icon={icon} strokeWidth={2} />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function Pages({
  language,
  hold = false,
  className,
}: {
  language: ResumeLanguage;
  hold?: boolean;
  className?: string;
}) {
  const copy = useTranslation().about.resume;
  return (
    <PdfPages
      url={pdfFor(language)}
      label={copy.title}
      paused={hold}
      className={className}
      fallback={
        <div className="flex flex-col items-center gap-3 p-6 text-center text-muted-foreground">
          <p>{copy.failed}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openResume(language)}
          >
            {copy.open}
          </Button>
        </div>
      }
    />
  );
}

function Sheet({
  current,
  onView,
  language,
  onLanguage,
  holdPages,
  ref,
}: {
  current: View;
  onView: (view: View) => void;
  language: ResumeLanguage;
  onLanguage: (language: ResumeLanguage) => void;
  holdPages: boolean;
  ref: Ref<HTMLDivElement>;
}) {
  const copy = useTranslation().about.resume;
  const readRef = useRef<HTMLButtonElement>(null);
  const reading = current === "reader";

  return (
    <DialogContent
      ref={ref}
      initialFocus={readRef}
      data-morph-part="surface"
      className={cn(
        // transition-none: the popup's duration-100 alone transitions every
        // property (transition-property starts as all), which would ease the
        // size swap under the morph instead of handing it the final box
        "gap-0 overflow-hidden p-0 transition-none",
        // each view sizes the box in CSS, and the morph only moves between
        // the two sizes, so nothing here measures or clamps. The card keeps
        // the popup's own clamps (28rem, 2rem short of the screen); the
        // reader is a desk 3rem short of it both ways.
        reading &&
          "h-[min(64rem,calc(100%-3rem))] w-[min(56rem,calc(100%-3rem))] max-w-none sm:max-w-none",
      )}
    >
      {reading ? (
        <div data-morph-part="content" className="flex min-h-0 flex-col">
          <div className="flex items-center gap-2 px-4 pt-4 pr-[3.375rem] pb-3">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={copy.back}
              autoFocus
              onClick={() => onView("card")}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            </Button>
            <DialogTitle>{copy.title}</DialogTitle>
            <div className="ml-auto flex items-center gap-1.5">
              <LanguageTabs
                value={language}
                onChange={onLanguage}
                label={copy.languageLabel}
                compact
              />
              <IconAction
                icon={Download04Icon}
                label={copy.download}
                onClick={() => downloadResume(language)}
              />
              <IconAction
                icon={LinkSquare02Icon}
                label={copy.open}
                onClick={() => openResume(language)}
              />
            </div>
          </div>
          <Pages
            language={language}
            hold={holdPages}
            className="min-h-0 flex-1 border-t border-foreground/10"
          />
        </div>
      ) : (
        <div data-morph-part="content" className="flex flex-col gap-6 p-6">
          <DialogHeader className="pr-8">
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>
              <RichText text={copy.description} />
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">{copy.languageLabel}</span>
            <LanguageTabs
              value={language}
              onChange={onLanguage}
              label={copy.languageLabel}
            />
          </div>
          <DialogFooter className="sm:flex-col">
            <Button ref={readRef} autoFocus onClick={() => onView("reader")}>
              {copy.read}
            </Button>
            <Button variant="outline" onClick={() => downloadResume(language)}>
              {copy.download}
            </Button>
          </DialogFooter>
        </div>
      )}
    </DialogContent>
  );
}

export default function ResumeDialog() {
  const isMobile = useIsMobile();
  const copy = useTranslation().about.resume;
  const { language: siteLanguage } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("card");
  // while the box visibly moves, the reader's pages are laid out but not
  // drawn (pdf.js would take its frames from the box), and a press on the
  // backdrop is ignored: shrinking, the box still covers ground the card no
  // longer does
  const [morphing, setMorphing] = useState(false);
  const running = useRef<ViewTransition | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<ResumeLanguage>(
    siteLanguage === "de" ? "de" : "en",
  );
  useWindowScrollLock(open);

  const openDialog = () => {
    setView("card");
    setOpen(true);
  };

  const showView = (next: View) => {
    // a second press while the box is already heading there changes nothing
    // (the old view stays live for a frame or two before the swap)
    const root = document.documentElement;
    if (running.current && root.dataset.resumeMorph === next) return;
    const sheet = sheetRef.current;
    if (!sheet || reducedMotion || !document.startViewTransition) {
      setView(next);
      return;
    }
    // Only the dialog takes part: the root steps out of the transition (so
    // the page stays live underneath and the theme wipe's root rules never
    // apply), and the dialog's parts are named only while the root carries
    // the attribute. Its value says which way the box is going.
    const surface = getComputedStyle(sheet);
    const vars = {
      "--morph-duration": MORPH_TIMING.duration,
      "--morph-easing": MORPH_TIMING.easing,
      // the group that draws the box wears the dialog's own surface
      "--morph-surface": surface.backgroundColor,
      "--morph-radius": surface.borderRadius,
      "--morph-shadow": surface.boxShadow,
    };
    for (const [name, value] of Object.entries(vars)) {
      root.style.setProperty(name, value);
    }
    root.dataset.resumeMorph = next;
    const transition = document.startViewTransition(() =>
      // one synchronous commit: the new view, and the focus it takes, are in
      // place before the browser photographs it
      flushSync(() => {
        setView(next);
        setMorphing(true);
      }),
    );
    running.current = transition;
    // a newer morph that cut this one short owns the stage now
    const current = () => running.current === transition;
    // MORPH's visual duration in, the box looks still: what is left is the
    // spring's last percent of settle, which pdf.js is welcome to share
    const still = () => {
      if (current()) setMorphing(false);
    };
    transition.ready.then(
      () => window.setTimeout(still, MORPH.visualDuration * 1000),
      still,
    );
    const landed = () => {
      if (!current()) return;
      running.current = null;
      delete root.dataset.resumeMorph;
      for (const name of Object.keys(vars)) root.style.removeProperty(name);
      setMorphing(false);
    };
    transition.finished.then(landed, landed);
  };

  const changeOpen = (next: boolean) => {
    // closed mid-morph: land it now, so the popup's own exit is what shows
    if (!next) running.current?.skipTransition();
    setOpen(next);
  };

  const switchLanguage = (next: ResumeLanguage) => {
    void loadPdf(pdfFor(next));
    setLanguage(next);
  };

  const trigger = (
    <IconButton
      variant="default"
      size="lg"
      className="w-full border-foreground/20 sm:w-auto"
      icon={
        <HugeiconsIcon
          icon={Download01Icon}
          strokeWidth={2}
          className="size-4"
        />
      }
      iconPosition="left"
      label={copy.buttonLabel}
      onClick={openDialog}
      onPointerEnter={() => void loadPdf(pdfFor(language))}
      onFocus={() => void loadPdf(pdfFor(language))}
    />
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
          <DrawerContent className="[--drawer-height:calc(100dvh-6rem)]">
            <DrawerHeader>
              <DrawerTitle>{copy.title}</DrawerTitle>
              <DrawerDescription>
                <RichText text={copy.description} />
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex items-center justify-between gap-4 p-4">
              <span className="text-sm font-medium">{copy.languageLabel}</span>
              <LanguageTabs
                value={language}
                onChange={switchLanguage}
                label={copy.languageLabel}
              />
            </div>
            <Pages
              language={language}
              className="min-h-0 flex-1 border-y border-foreground/10"
            />
            <DrawerFooter className="pt-4">
              <Button onClick={() => downloadResume(language)}>
                {copy.download}
              </Button>
              <Button variant="outline" onClick={() => openResume(language)}>
                {copy.open}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {trigger}
      <Dialog
        open={open}
        onOpenChange={changeOpen}
        disablePointerDismissal={morphing}
      >
        <Sheet
          ref={sheetRef}
          current={view}
          onView={showView}
          language={language}
          onLanguage={switchLanguage}
          holdPages={morphing}
        />
      </Dialog>
    </>
  );
}

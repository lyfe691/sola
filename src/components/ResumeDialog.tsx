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

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft01Icon,
  Download01Icon,
  Download04Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
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
import { EASE_OUT, MORPH } from "@/utils/transitions";

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

const CARD_WIDTH = 448;
const READER_WIDTH = 896;
const READER_HEIGHT = 1024;
const CARD_GUTTER = 32;
const READER_GUTTER = 48;

const LEAVE = { duration: 0.18, ease: EASE_OUT } as const;
const ARRIVE = { duration: 0.26, ease: EASE_OUT } as const;

const view = {
  initial: { opacity: 0, scale: 0.98, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: ARRIVE },
  exit: { opacity: 0, scale: 0.98, filter: "blur(4px)", transition: LEAVE },
} as const;

type View = "card" | "reader";

const subscribeViewport = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};

const useViewport = () => ({
  width: useSyncExternalStore(subscribeViewport, () => window.innerWidth),
  height: useSyncExternalStore(subscribeViewport, () => window.innerHeight),
});

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
  className,
}: {
  language: ResumeLanguage;
  className?: string;
}) {
  const copy = useTranslation().about.resume;
  return (
    <PdfPages
      url={pdfFor(language)}
      label={copy.title}
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
}: {
  current: View;
  onView: (view: View) => void;
  language: ResumeLanguage;
  onLanguage: (language: ResumeLanguage) => void;
}) {
  const copy = useTranslation().about.resume;
  const readRef = useRef<HTMLButtonElement>(null);
  // held as a node: the card mounts with the popup, after this component
  const [card, setCard] = useState<HTMLDivElement | null>(null);
  const [cardHeight, setCardHeight] = useState<number | null>(null);
  const viewport = useViewport();

  useLayoutEffect(() => {
    if (!card) return;
    const observer = new ResizeObserver(([entry]) =>
      setCardHeight(entry.borderBoxSize[0].blockSize),
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [card]);

  const cardWidth = Math.min(CARD_WIDTH, viewport.width - CARD_GUTTER);
  const readerWidth = Math.min(READER_WIDTH, viewport.width - READER_GUTTER);
  const readerHeight = Math.min(READER_HEIGHT, viewport.height - READER_GUTTER);
  const reading = current === "reader";

  return (
    <DialogContent
      initialFocus={readRef}
      render={
        <motion.div
          initial={false}
          animate={{
            width: reading ? readerWidth : cardWidth,
            height: reading ? readerHeight : (cardHeight ?? "auto"),
          }}
          transition={MORPH}
        />
      }
      // flex, not the popup's grid: a grid would stretch the content to the
      // box's current height and the box would never shrink back
      className="flex max-w-none items-center justify-center gap-0 overflow-hidden p-0 sm:max-w-none"
    >
      <AnimatePresence mode="wait" initial={false}>
        {reading ? (
          <motion.div
            key="reader"
            {...view}
            style={{ width: readerWidth, height: readerHeight }}
            className="flex shrink-0 flex-col"
          >
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
              className="min-h-0 flex-1 border-t border-foreground/10"
            />
          </motion.div>
        ) : (
          <motion.div
            key="card"
            ref={setCard}
            {...view}
            style={{ width: cardWidth }}
            className="flex shrink-0 flex-col gap-6 p-6"
          >
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
              <Button
                variant="outline"
                onClick={() => downloadResume(language)}
              >
                {copy.download}
              </Button>
            </DialogFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContent>
  );
}

export default function ResumeDialog() {
  const isMobile = useIsMobile();
  const copy = useTranslation().about.resume;
  const { language: siteLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("card");
  const [language, setLanguage] = useState<ResumeLanguage>(
    siteLanguage === "de" ? "de" : "en",
  );
  useWindowScrollLock(open);

  const openDialog = () => {
    setView("card");
    setOpen(true);
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
      <Dialog open={open} onOpenChange={setOpen}>
        <Sheet
          current={view}
          onView={setView}
          language={language}
          onLanguage={switchLanguage}
        />
      </Dialog>
    </>
  );
}

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

import { useRef, useState } from "react";
import {
  ArrowLeft01Icon,
  Download01Icon,
  Download04Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { RichText } from "@/components/i18n/RichText";
import { Morph, MorphSlot } from "@/components/Morph";
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
            // eslint-disable-next-line shadcn/no-restyle -- the compact switcher is a size smaller than any Tabs size
            className={compact ? "h-6 px-2.5" : undefined}
          >
            <span className="uppercase">{language}</span>
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
      <TooltipContent side="bottom">{label}</TooltipContent>
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

// The card turns into the reader on a Morph: the box glides between the
// two sizes while the views crossfade inside it, the title travels from
// the card's header into the toolbar, and the close button (the popup's
// own) holds its corner. Each view sizes itself: the card is the popup's
// 28rem, 2rem short of the screen; the reader a desk 3rem short of it both
// ways.
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
  // pdf.js lays the pages out while the box moves but draws them once it
  // stands still: drawing would take its frames from the glide
  const [gliding, setGliding] = useState(false);

  return (
    <DialogContent
      initialFocus={readRef}
      className="w-auto max-w-none gap-0 overflow-hidden p-0 sm:max-w-none"
    >
      <Morph
        axis="both"
        face={current}
        onGlide={setGliding}
        parts={{ title: <DialogTitle>{copy.title}</DialogTitle> }}
      >
        {current === "reader" ? (
          <ReaderView
            language={language}
            onLanguage={onLanguage}
            holdPages={gliding}
            onBack={() => onView("card")}
          />
        ) : (
          <div className="flex w-md max-w-[calc(100vw-2rem)] flex-col gap-6 p-6">
            <DialogHeader className="pr-8">
              <MorphSlot name="title" />
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
          </div>
        )}
      </Morph>
    </DialogContent>
  );
}

function ReaderView({
  language,
  onLanguage,
  holdPages,
  onBack,
}: {
  language: ResumeLanguage;
  onLanguage: (language: ResumeLanguage) => void;
  holdPages: boolean;
  onBack: () => void;
}) {
  const copy = useTranslation().about.resume;
  return (
    <div className="flex h-[min(64rem,calc(100vh-3rem))] w-[min(56rem,calc(100vw-3rem))] flex-col">
      <div className="flex items-center gap-2 px-4 pt-4 pr-13.5 pb-3">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={copy.back}
          autoFocus
          onClick={onBack}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <MorphSlot name="title" />
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

  // back to the card as it opens, never as it closes
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
      rim
      className="w-full sm:w-auto"
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

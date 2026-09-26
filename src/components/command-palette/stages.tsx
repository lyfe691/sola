/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The picture at the top of the palette's preview: one fixed-size stage per
 * kind of result, drawn from the thing itself — a deep dive's hero, a theme
 * in its own colours, a background running live, a certificate's first
 * page — and framed the way the deep-dive hero is.
 */

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import snapshot from "virtual:changelog-snapshot";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Folder01Icon, SourceCodeIcon } from "@hugeicons/core-free-icons";
import {
  BACKGROUNDS,
  NONE_BACKGROUND,
} from "@/components/backgrounds/registry";
import { PROJECTS, type ProjectArt } from "@/config/projects";
import { PaintedCover } from "@/components/painted-cover/PaintedCover";
import { SKILL_GROUPS } from "@/config/skills";
import { getAllCertifications } from "@/config/certifications";
import { SOCIAL_LINKS, SOCIAL_ORDER_HERO } from "@/config/social";
import type { Language } from "@/config/languages";
import { TechMark } from "@/components/ui/custom/tech-mark";
import { EDUCATION, WORK } from "@/lib/experience";
import { loadPdf } from "@/lib/pdf";
import {
  loadedTranslation,
  loadTranslation,
  type Translation,
} from "@/lib/translations";
import { useTranslation } from "@/lib/language-provider";
import type { SiteDoc } from "@/lib/search/sources";
import { cn } from "@/lib/utils";
import { Edge, LogoTile } from "./results";
import { PAGE_ICONS, SERVICE_ICONS } from "./icons";

const PORTRAIT = "https://avatars.githubusercontent.com/u/162759797?v=4";

function Frame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-40 shrink-0 overflow-hidden rounded-3xl border-4 border-border bg-muted shadow-lg shadow-black/5",
        className,
      )}
    >
      {children}
    </div>
  );
}

const Centered = ({ children }: { children: ReactNode }) => (
  <div className="flex size-full flex-col items-center justify-center gap-3">
    {children}
  </div>
);

const BigIcon = ({ icon }: { icon: IconSvgElement }) => (
  <span className="grid size-14 place-items-center rounded-2xl bg-background text-foreground shadow-sm ring-1 ring-foreground/10">
    <HugeiconsIcon icon={icon} strokeWidth={1.6} className="size-6" />
  </span>
);

/** a deep dive's hero in small: its live painting, title and tagline */
function Hero({
  art,
  title,
  tagline,
}: {
  art: ProjectArt;
  title: string;
  tagline: string;
}) {
  return (
    <>
      <PaintedCover
        art={art}
        size="hero"
        scrim="dim"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center text-white">
        <span className="text-3xl leading-display font-extrabold tracking-display text-balance">
          {title}
        </span>
        <span className="text-sm leading-display font-light tracking-display text-white/90">
          {tagline}
        </span>
      </div>
    </>
  );
}

function PageStage({ to }: { to: string }) {
  const t = useTranslation();
  switch (to) {
    case "/projects":
      return (
        <div className="grid size-full grid-cols-3 gap-1 p-1">
          {PROJECTS.slice(0, 6).map((project) => {
            const copy = t.projects.list[project.i18nKey];
            return (
              <div
                key={project.id}
                className="relative overflow-hidden rounded-2xl"
              >
                <PaintedCover
                  art={project.art}
                  size="hero"
                  live={false}
                  scrim="caption"
                  className="absolute inset-0"
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col px-2.5 pb-2 text-white">
                  <span className="truncate text-xs font-semibold">
                    {copy.title}
                  </span>
                  <span className="truncate text-2xs text-white/75">
                    {copy.tagline}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    case "/skills": {
      // three staggered rows of the strongest skills, running out past both
      // edges of the stage and fading there
      const top = SKILL_GROUPS.flatMap((group) => group.skills)
        .sort((a, b) => b.level - a.level)
        .slice(0, 18);
      const rows = [top.slice(0, 6), top.slice(6, 12), top.slice(12, 18)];
      return (
        <div className="flex size-full flex-col items-center justify-center gap-2 mask-x-from-70%">
          {rows.map((row, i) => (
            <div
              key={i}
              className={cn(
                "flex shrink-0 gap-2",
                i === 1 ? "-translate-x-10" : "translate-x-4",
              )}
            >
              {row.map((skill) => (
                <span
                  key={skill.name}
                  className="flex h-8 shrink-0 items-center gap-2 rounded-full bg-background px-3 text-sm font-medium whitespace-nowrap text-foreground shadow-xs ring-1 ring-foreground/10"
                >
                  <TechMark name={skill.name} className="size-4" />
                  {skill.name}
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    }
    case "/experience":
    case "/certifications": {
      const logos =
        to === "/experience"
          ? [...WORK, ...EDUCATION].map((entry) => entry.logo)
          : [...new Set(getAllCertifications().map((cert) => cert.issuerLogo))];
      return (
        <Centered>
          <div className="flex items-center gap-2.5">
            {logos.slice(0, 5).map((logo, i) => (
              <LogoTile
                key={`${logo}-${i}`}
                src={logo}
                className="size-12 rounded-2xl shadow-sm"
                inset="p-2"
                fallback={null}
              />
            ))}
          </div>
        </Centered>
      );
    }
    case "/services":
      return (
        <Centered>
          <div className="flex items-center gap-2.5">
            {Object.values(SERVICE_ICONS).map((icon, i) => (
              <BigIcon key={i} icon={icon} />
            ))}
          </div>
        </Centered>
      );
    case "/about":
      return (
        <Centered>
          <img
            src={PORTRAIT}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-20 rounded-full object-cover shadow-md ring-1 ring-foreground/10"
          />
        </Centered>
      );
    case "/contact":
      return (
        <Centered>
          <div className="flex items-center gap-2">
            {SOCIAL_ORDER_HERO.map((id) => {
              const Icon = SOCIAL_LINKS[id].icon;
              return (
                <span
                  key={id}
                  className="grid size-11 place-items-center rounded-2xl bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                >
                  <Icon aria-hidden className="size-5" />
                </span>
              );
            })}
          </div>
        </Centered>
      );
    case "/changelog": {
      const commits = snapshot?.page.commits.slice(0, 4) ?? [];
      if (!commits.length) break;
      return (
        <ol className="flex size-full flex-col justify-center gap-2.5 px-5">
          {commits.map((commit) => (
            <li key={commit.sha} className="flex min-w-0 items-center gap-3">
              <span className="size-2 shrink-0 rounded-full bg-primary ring-4 ring-primary/15" />
              <span className="truncate text-xs text-foreground">
                {commit.subject}
              </span>
            </li>
          ))}
        </ol>
      );
    }
    case "/":
      return (
        <Centered>
          <span
            aria-hidden
            className="size-14 bg-foreground mask-[url(/apple-touch-icon.png)] mask-contain mask-center mask-no-repeat"
          />
          <span className="font-heading text-sm font-semibold text-foreground">
            Yanis Sebastian Zürcher
          </span>
        </Centered>
      );
  }
  return (
    <Centered>
      <BigIcon icon={PAGE_ICONS[to] ?? Folder01Icon} />
    </Centered>
  );
}

/** a small page in a theme's own tokens: nav, hero, buttons, a card */
function MiniSite({
  themeClass,
  greeting,
  compact = false,
}: {
  themeClass: string;
  greeting: string;
  compact?: boolean;
}) {
  const bar = "h-1.5 rounded-full";
  return (
    <div
      className={cn(
        themeClass,
        "flex size-full flex-col gap-4 bg-background p-4 text-foreground",
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-foreground" />
        <span className={cn(bar, "w-6 bg-muted-foreground/40")} />
        <span className={cn(bar, "w-5 bg-muted-foreground/25")} />
        <span className={cn(bar, "w-7 bg-muted-foreground/25")} />
        <span className="ml-auto size-2.5 rounded-full bg-muted" />
      </div>
      <div className="flex min-h-0 flex-1 items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="truncate font-heading text-base leading-tight font-semibold">
            {greeting}
          </span>
          <span className={cn(bar, "w-4/5 bg-muted-foreground/35")} />
          <span className={cn(bar, "w-3/5 bg-muted-foreground/20")} />
          <div className="mt-1 flex gap-1.5">
            <span className="h-4 w-14 rounded-full bg-primary" />
            <span className="h-4 w-12 rounded-full border border-foreground/15" />
          </div>
        </div>
        {!compact && (
          <div className="flex w-2/5 flex-col gap-2 self-stretch rounded-xl border border-foreground/10 bg-card p-2.5">
            <span className="min-h-0 flex-1 rounded-lg bg-accent" />
            <span className={cn(bar, "w-3/4 bg-muted-foreground/35")} />
            <span className={cn(bar, "w-1/2 bg-muted-foreground/20")} />
          </div>
        )}
      </div>
    </div>
  );
}

function useLocaleCopy(language: Language): Translation | undefined {
  const [loaded, setLoaded] = useState<{
    language: Language;
    t: Translation;
  }>();
  useEffect(() => {
    let live = true;
    void loadTranslation(language).then((t) => {
      if (live) setLoaded({ language, t });
    });
    return () => {
      live = false;
    };
  }, [language]);
  return loaded?.language === language ? loaded.t : loadedTranslation(language);
}

function LanguageStage({ language }: { language: Language }) {
  const copy = useLocaleCopy(language);
  return (
    <div className="flex size-full flex-col justify-center gap-2 px-7">
      {copy && (
        <>
          <span className="font-heading text-2xl font-semibold text-foreground">
            {copy.index.greeting}Yanis
          </span>
          <span className="line-clamp-2 text-sm text-muted-foreground">
            {copy.index.description2}
          </span>
        </>
      )}
    </div>
  );
}

/** the first page of a PDF, drawn to fit the stage's width */
function PdfPage({ url, fallback }: { url: string; fallback: ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"drawing" | "drawn" | "failed">("drawing");
  useEffect(() => {
    let cancelled = false;
    let cancel: (() => void) | undefined;
    loadPdf(url)
      .then((pdf) => pdf.getPage(1))
      .then((page) => {
        const node = canvas.current;
        if (cancelled || !node) return;
        const width = node.parentElement?.clientWidth ?? 480;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({
          scale: (width * dpr) / page.getViewport({ scale: 1 }).width,
        });
        node.width = Math.round(viewport.width);
        node.height = Math.round(viewport.height);
        const task = page.render({ canvas: node, viewport });
        cancel = () => task.cancel();
        return task.promise;
      })
      .then(
        () => !cancelled && setState("drawn"),
        () => !cancelled && setState("failed"),
      );
    return () => {
      cancelled = true;
      cancel?.();
    };
  }, [url]);

  if (state === "failed") return fallback;
  return (
    <div className="size-full bg-paper">
      <canvas
        ref={canvas}
        aria-hidden
        className={cn(
          "block w-full transition-opacity duration-300 ease-out",
          state === "drawn" ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

export function Stage({ doc }: { doc: SiteDoc }) {
  const t = useTranslation();
  const greeting = `${t.index.greeting}Yanis`;

  switch (doc.kind) {
    case "project":
      return (
        <Frame>
          <Hero art={doc.art} title={doc.title} tagline={doc.context ?? ""} />
        </Frame>
      );
    case "section":
      return (
        <Frame>
          <Hero art={doc.art} title={doc.project} tagline={doc.tagline} />
        </Frame>
      );
    case "page":
      return (
        <Frame>
          <PageStage to={doc.to} />
        </Frame>
      );
    case "skill":
      return (
        <Frame>
          <Centered>
            <span className="relative grid size-16 place-items-center rounded-2xl bg-background shadow-sm">
              <TechMark name={doc.name} className="size-8" />
              <Edge />
            </span>
            <span className="flex gap-1" aria-hidden>
              {[1, 2, 3, 4, 5].map((step) => (
                <span
                  key={step}
                  className={cn(
                    "h-1 w-6 rounded-full",
                    step <= doc.level ? "bg-primary" : "bg-foreground/15",
                  )}
                />
              ))}
            </span>
          </Centered>
        </Frame>
      );
    case "experience":
      return (
        <Frame>
          <Centered>
            <LogoTile
              src={doc.logo}
              className="size-16 rounded-2xl shadow-sm"
              inset="p-2.5"
              fallback={
                <span className="font-heading text-base font-semibold">
                  {doc.monogram}
                </span>
              }
            />
            <span className="text-sm font-medium text-foreground">
              {doc.company}
            </span>
          </Centered>
        </Frame>
      );
    case "certification": {
      const logo = (
        <Centered>
          <LogoTile
            src={doc.logo}
            className="size-16 rounded-2xl shadow-sm"
            inset="p-2.5"
            fallback={null}
          />
        </Centered>
      );
      return (
        <Frame>
          {doc.document?.toLowerCase().endsWith(".pdf") ? (
            <PdfPage url={doc.document} fallback={logo} />
          ) : doc.document ? (
            <img
              src={doc.document}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-top"
            />
          ) : (
            logo
          )}
        </Frame>
      );
    }
    case "service":
      return (
        <Frame>
          <Centered>
            <BigIcon icon={SERVICE_ICONS[doc.service] ?? Folder01Icon} />
            <span className="text-sm font-medium text-foreground">
              {doc.context}
            </span>
          </Centered>
        </Frame>
      );
    case "theme":
      return (
        <Frame>
          {doc.value === "system" ? (
            <div className="grid size-full grid-cols-2">
              <MiniSite themeClass="light" greeting={greeting} compact />
              <MiniSite themeClass="dark" greeting={greeting} compact />
            </div>
          ) : (
            <MiniSite themeClass={doc.value} greeting={greeting} />
          )}
        </Frame>
      );
    case "language":
      return (
        <Frame>
          <LanguageStage language={doc.value} />
        </Frame>
      );
    case "background": {
      const Background = BACKGROUNDS.find((b) => b.id === doc.value)?.component;
      return (
        <Frame className="bg-background">
          {doc.value !== NONE_BACKGROUND && Background && (
            <div className="absolute inset-0">
              <Suspense fallback={null}>
                <Background />
              </Suspense>
            </div>
          )}
        </Frame>
      );
    }
    case "action":
      return (
        <Frame>
          <Centered>
            <BigIcon icon={SourceCodeIcon} />
          </Centered>
        </Frame>
      );
  }
}

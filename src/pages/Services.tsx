/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "@/lib/language-provider";
import { Reveal } from "@/components/Reveal";
import { BlurHighlight } from "@/components/services/blur-highlight";
import { DepthTilt } from "@/components/services/depth-tilt";
import { SkewedCarousel } from "@/components/services/skewed-carousel";
import { ShotWindow } from "@/components/windows/shot-window";
import { PaintedCover } from "@/components/painted-cover/PaintedCover";
import { ArtField } from "@/components/stipple-gradient/ArtField";
import { PROJECTS } from "@/config/projects";
import { MorphArrow } from "@/components/ui/custom/morph-arrow";
import {
  CLOSING_PROJECT,
  OFFERINGS,
  SHOWREEL,
  coverImage,
  type Shot,
} from "@/config/services";
import { contactUrl } from "@/lib/contact-url";
import { Link } from "@/lib/locale-router";
import { cn } from "@/lib/utils";

/** This page sets its type light and large, in the text face: the weight
 *  and the wide heading face are the rest of the site's. */
const DISPLAY = "font-sans font-normal tracking-tight text-balance";

/** How wide a capture is drawn in each place, for `<img sizes>`: they follow
 *  the carousel's card width and the offerings' grid. */
const SIZES = {
  showreel: "(min-width: 600px) 440px, 74vw",
  proof: "(min-width: 1024px) 60vw, (min-width: 640px) 50vw, 100vw",
};
type Place = keyof typeof SIZES;

/**
 * A capture as an object on a stage: the project's own still cover behind,
 * the whole window in front, with the same margin on every side. The stage
 * takes its height from the window, so nothing is cropped and nothing floats
 * in spare room. Every stage on the page is this one.
 */
const Stage = ({
  shot,
  place,
  className,
}: {
  shot: Shot;
  place: Place;
  className?: string;
}) => {
  const project = PROJECTS.find(({ id }) => id === shot.project);
  if (!project) return null;
  return (
    <div
      className={cn(
        "@container relative isolate overflow-hidden rounded-3xl border-4 border-border bg-muted",
        className,
      )}
    >
      <PaintedCover
        art={project.art}
        size="hero"
        live={false}
        still={coverImage(shot.project)}
        scrim="none"
        className="absolute inset-0 -z-10"
      />
      <div
        className="translate-x-(--depth-x) translate-y-(--depth-y) p-(--stage-pad)"
        style={{ "--stage-pad": "7cqw" } as CSSProperties}
      >
        <ShotWindow
          shot={shot}
          sizes={SIZES[place]}
          eager={place === "showreel"}
        />
      </div>
    </div>
  );
};

const PILL = {
  primary:
    "h-12 gap-2 bg-primary pr-5 pl-6 text-lg text-primary-foreground hover:bg-primary/90",
  quiet:
    "h-10 gap-1.5 bg-muted pr-3.5 pl-4.5 text-sm text-foreground hover:bg-accent",
  // on the closing's artwork, which is the same in every theme
  art: "h-12 gap-2 bg-white pr-5 pl-6 text-lg text-black hover:bg-white/90",
};

/** The page's one button: a pill whose chevron becomes an arrow on hover. */
const Pill = ({
  to,
  look = "primary",
  children,
}: {
  to: string;
  look?: keyof typeof PILL;
  children: ReactNode;
}) => (
  <Link
    to={to}
    className={cn(
      "inline-flex items-center rounded-full outline-none transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring/50",
      PILL[look],
    )}
  >
    {children}
    <MorphArrow className={look === "quiet" ? "size-4" : "size-5"} />
  </Link>
);

const Services = () => {
  const t = useTranslation();
  const page = t.services.page;

  const closingArt = PROJECTS.find(({ id }) => id === CLOSING_PROJECT)?.art;
  const titles: Record<string, { title: string } | undefined> = t.projects.list;

  return (
    <div className="flex w-full flex-col">
      <meta name="description" content={t.seo.services.description} />

      <div className="flex flex-col items-center gap-8 pt-6 text-center sm:pt-12 lg:pt-20">
        {/* the page's title is read, not shown: the statement is the page,
            and every visible h1 on the site is set bold */}
        <h1 className="sr-only">{t.services.title}</h1>
        <BlurHighlight
          text={page.statement}
          phrases={OFFERINGS.map(({ key }) => page.offerings[key].name)}
          className={cn(
            DISPLAY,
            "max-w-5xl text-4xl leading-11 sm:text-6xl sm:leading-18 lg:text-7xl lg:leading-22",
          )}
        />
        <Reveal>
          <Pill to="/contact">{page.cta}</Pill>
        </Reveal>
      </div>

      <Reveal className="mt-20 sm:mt-28 lg:mt-32">
        <SkewedCarousel
          label={t.nav.projects}
          previousLabel={t.common.previousImage}
          nextLabel={t.common.nextImage}
          slides={SHOWREEL.map((shot) => ({
            id: shot.project,
            title: titles[shot.project]?.title ?? shot.project,
            to: `/projects/${shot.project}`,
            node: <Stage shot={shot} place="showreel" />,
          }))}
        />
      </Reveal>
      <h2 className="sr-only">{page.offeringsLabel}</h2>

      {OFFERINGS.map((entry) => {
        const { key, service, proof } = entry;
        const offering = page.offerings[key];
        return (
          <section
            key={key}
            className="mt-24 grid gap-x-12 gap-y-10 sm:mt-32 lg:mt-44 lg:grid-cols-12"
          >
            {/* beside its captures on a wide window, and it stays in view
                while they pass; above them on a narrow one */}
            <Reveal className="flex flex-col items-start lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
              <h3 className={cn(DISPLAY, "text-5xl sm:text-6xl")}>
                {offering.name}
              </h3>
              <p className="mt-6 max-w-sm text-xl leading-7 text-foreground/80">
                {offering.line}
              </p>
              <div className="mt-8 flex items-center gap-5">
                <Pill to={contactUrl(t, entry)} look="quiet">
                  {t.services.getStarted}
                </Pill>
                <p className="text-base text-foreground/55">
                  {t.services.services[service].price}
                </p>
              </div>
            </Reveal>

            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-1 lg:gap-y-12">
              {proof.map((shot) => {
                const copy = t.projects.list[shot.project];
                return (
                  <Reveal key={shot.project}>
                    <Link
                      to={`/projects/${shot.project}`}
                      className="group flex flex-col gap-4 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      <DepthTilt>
                        <Stage shot={shot} place="proof" />
                      </DepthTilt>
                      <div className="flex flex-col gap-1.5">
                        <h4 className="font-sans text-lg font-normal text-foreground">
                          {copy.title}
                        </h4>
                        <p className="text-sm text-foreground/60">
                          {copy.tagline}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* the page ends on a field in the site's own colours, not on more
          captures: the work has been shown by now */}
      <Reveal className="mt-32 mb-8 sm:mt-44 lg:mt-56">
        <section className="relative overflow-hidden rounded-3xl border-4 border-border">
          {closingArt && <ArtField art={closingArt} />}
          <div className="relative flex flex-col items-center gap-6 px-6 py-24 text-center text-white sm:py-32 lg:py-40">
            <h2
              className={cn(
                DISPLAY,
                "max-w-xl text-4xl leading-10 sm:text-6xl sm:leading-16",
              )}
            >
              {page.closing.title}
            </h2>
            <p className="max-w-md text-xl leading-7 text-white/80">
              {page.closing.line}
            </p>
            <div className="mt-2">
              <Pill to="/contact" look="art">
                {page.cta}
              </Pill>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
};

export default Services;

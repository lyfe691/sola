/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  useContext,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
} from "react";
import {
  ArrowExpandIcon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Reveal } from "@/components/Reveal";
import { FigureLightboxProvider } from "@/components/mdx/figure-lightbox";
import { FigureLightboxContext } from "@/components/mdx/figure-lightbox-context";
import {
  getAllCertifications,
  isExpired,
  type Certification,
} from "@/config/certifications";
import { INTL_LOCALE } from "@/lib/dates";
import { useLanguage, useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";

/** The shape of the cell each sheet lies in: `aspect-9/7` below. */
const DESK = 9 / 7;
const TILTS = ["-1deg", "0.7deg", "-0.4deg", "0.9deg", "-0.7deg", "0.5deg"];

function Certificate({ cert, tilt }: { cert: Certification; tilt: string }) {
  const { language } = useLanguage();
  const t = useTranslation();
  const lightbox = useContext(FigureLightboxContext);
  const id = useId();
  const imageRef = useRef<HTMLImageElement>(null);
  const { src, width, height } = cert.image;
  const alt = t.certifications.certificateAlt
    .replace("{title}", cert.title)
    .replace("{issuer}", cert.issuer);
  const away = lightbox?.awayId === id;
  const register = lightbox?.register;

  useEffect(
    () =>
      register?.({
        id,
        src,
        size: [width, height],
        alt,
        caption: cert.title,
        thumb: () => imageRef.current,
      }),
    [register, id, src, width, height, alt, cert.title],
  );

  const link = cert.url
    ? { href: cert.url, label: t.certifications.verify }
    : cert.pdf
      ? { href: cert.pdf, label: t.certifications.viewPdf }
      : null;
  const issued = new Date(cert.issueDate).toLocaleDateString(
    INTL_LOCALE[language],
    { month: "short", year: "numeric", timeZone: "UTC" },
  );
  const ratio = width / height;

  return (
    <article>
      <div className="grid aspect-9/7 place-items-center">
        <button
          type="button"
          onClick={() => lightbox?.open(id)}
          aria-label={t.common.expandImageNamed.replace("{alt}", alt)}
          style={
            {
              "--sheet-w": `${Math.min(1, ratio / DESK) * 100}%`,
              "--sheet-ratio": ratio,
              "--tilt": tilt,
            } as CSSProperties
          }
          className={cn(
            "group/sheet relative aspect-(--sheet-ratio) w-(--sheet-w) overflow-hidden rounded-[3px] bg-paper",
            "rotate-(--tilt) shadow-(--paper-lift)",
            "cursor-zoom-in outline-none select-none",
            "transition-[rotate,translate,scale,box-shadow] duration-500 ease-out",
            "can-hover:hover:-translate-y-1.5 can-hover:hover:rotate-0 can-hover:hover:shadow-(--paper-raised)",
            "active:scale-99",
            "focus-visible:rotate-0 focus-visible:ring-2 focus-visible:ring-ring/40",
          )}
        >
          <img
            ref={imageRef}
            src={src}
            alt=""
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className={cn("block size-full", away && "invisible")}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute right-3 bottom-3",
              "grid size-8 place-items-center rounded-full",
              "bg-background/80 text-foreground shadow-sm backdrop-blur-md",
              "scale-90 opacity-0 transition-[opacity,scale] duration-200 ease-out",
              "can-hover:group-hover/sheet:scale-100 can-hover:group-hover/sheet:opacity-100",
              "group-focus-visible/sheet:scale-100 group-focus-visible/sheet:opacity-100",
              away && "hidden",
            )}
          >
            <HugeiconsIcon
              icon={ArrowExpandIcon}
              strokeWidth={2}
              className="size-3.5"
            />
          </span>
        </button>
      </div>

      <div className="mt-6 flex items-start gap-3">
        {cert.issuerLogo ? (
          <img
            src={cert.issuerLogo}
            alt=""
            className="size-8 shrink-0 rounded-lg object-cover ring-1 ring-border"
            loading="lazy"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="text-sm leading-snug font-medium text-pretty text-foreground">
            {cert.title}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {cert.issuer} · <time dateTime={cert.issueDate}>{issued}</time>
            {isExpired(cert) ? <> · {t.certifications.expired}</> : null}
          </p>
        </div>
        {link ? (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1 pt-px text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function Certifications() {
  const t = useTranslation();
  const items = getAllCertifications();

  return (
    <div className="flex w-full flex-col">
      <meta name="description" content={t.seo.certifications.description} />

      <Reveal as="h1" className="mb-4 text-4xl font-bold">
        {t.certifications.title}
      </Reveal>
      <Reveal as="p" className="mb-12 max-w-2xl text-muted-foreground sm:mb-16">
        {t.certifications.subtitle}
      </Reveal>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t.certifications.empty}
        </p>
      ) : (
        <FigureLightboxProvider>
          <ul className="grid gap-x-10 gap-y-14 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-3">
            {items.map((cert, i) => (
              <Reveal as="li" key={cert.id}>
                <Certificate cert={cert} tilt={TILTS[i % TILTS.length]} />
              </Reveal>
            ))}
          </ul>
        </FigureLightboxProvider>
      )}
    </div>
  );
}

/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Anchored headings for deep-dive MDX and config sections. Hover (fine pointer)
 * underlines the title and shows a link icon that jumps to the section hash.
 * Coarse-pointer users navigate via the deep-dive TOC (rail / mobile menu).
 */

import {
  createElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Link } from "lucide-react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3";

/** Render-time slug — the MDX pipeline has no rehype-slug. */
export function slugifyHeading(children: ReactNode): string | undefined {
  const text = flattenText(children)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
  return text || undefined;
}

function flattenText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(flattenText).join(" ");
  }
  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return flattenText(props.children);
  }
  return "";
}

interface HeadingLinkProps {
  id: string;
  children: ReactNode;
}

/**
 * Title text + hash affordance. The group lives on the parent heading so the
 * whole line lights up; only the icon is a link so selection stays clean.
 *
 * Permalink is hover/focus only — coarse-pointer users rely on the deep-dive
 * section TOC (rail / mobile menu) for section navigation.
 */
export function HeadingLink({ id, children }: HeadingLinkProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const title = flattenText(children).replace(/\s+/g, " ").trim() || id;
  const label = t.common.linkToSection.replace("{title}", title);

  return (
    <>
      <span
        className={cn(
          "underline-offset-[0.2em] decoration-foreground/30",
          "transition-[text-decoration-color] duration-200 ease-out",
          "can-hover:group-hover/heading:underline",
          "group-focus-within/heading:underline",
        )}
      >
        {children}
      </span>
      <a
        href={`#${id}`}
        aria-label={label}
        className={cn(
          "ml-2 inline-flex size-[1em] shrink-0 translate-y-[0.05em] items-center justify-center",
          "rounded-sm text-muted-foreground no-underline",
          "opacity-0 transition-opacity duration-200 ease-out",
          "can-hover:group-hover/heading:opacity-70",
          "hover:text-foreground hover:!opacity-100",
          "focus-visible:opacity-100 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
        )}
      >
        <Link className="size-[0.75em]" aria-hidden="true" strokeWidth={2.25} />
      </a>
    </>
  );
}

type MotionHeadingProps = {
  /** visual scale (LEVEL_CLASS) — also the rendered tag unless `as` says otherwise */
  level: HeadingLevel;
  /** rendered element when the outline position differs from the visual scale */
  as?: HeadingLevel;
  /** When true, expose this heading to the deep-dive section nav. */
  toc?: boolean;
  children?: ReactNode;
  className?: string;
  id?: string;
};

const LEVEL_CLASS: Record<HeadingLevel, string> = {
  h1: "text-2xl font-bold text-foreground mb-6 mt-8 first:mt-0",
  h2: "text-lg font-semibold text-foreground mb-4 mt-8 first:mt-0",
  h3: "text-base font-medium text-foreground mb-3 mt-6",
};

/**
 * Static heading used by the MDX element map. Slugifies children when no id
 * is supplied; h2s (toc) are the article landmarks for the section rail.
 */
export function MDXHeading({
  level,
  as,
  toc = false,
  children,
  className,
  id: idProp,
}: MotionHeadingProps) {
  const id = idProp ?? slugifyHeading(children);

  return createElement(
    as ?? level,
    {
      id,
      "data-toc": toc && id ? "" : undefined,
      className: cn(
        LEVEL_CLASS[level],
        id && "group/heading scroll-mt-24",
        className,
      ),
    },
    id ? <HeadingLink id={id}>{children}</HeadingLink> : children,
  );
}

type StaticHeadingProps = Omit<ComponentPropsWithoutRef<"h2">, "id"> & {
  /**
   * Hash target for the permalink. Must match the wrapping section's DOM `id`
   * (this heading itself does not receive an id — the section owns the landmark).
   *
   * @example
   * <section id="overview" data-toc …>
   *   <SectionHeading sectionId="overview">Overview</SectionHeading>
   * </section>
   */
  sectionId: string;
  children: ReactNode;
};

/**
 * Heading for config-driven sections (overview, tech stack, …).
 */
export function SectionHeading({
  sectionId,
  className,
  children,
  ...props
}: StaticHeadingProps) {
  return (
    <h2
      className={cn(
        "group/heading mb-4 text-lg font-semibold text-foreground",
        className,
      )}
      {...props}
    >
      <HeadingLink id={sectionId}>{children}</HeadingLink>
    </h2>
  );
}

/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A block that fades and rises into place the first time it scrolls into
 * view. The only thing a page decides is WHAT reveals; when is the queue's
 * call (src/lib/reveal.ts), and how is one CSS rule (index.css, "scroll
 * reveals"), so no reveal takes a delay, a variant or a trigger option.
 * Wrap each block that should arrive on its own — never one reveal inside
 * another, which would rise twice. The reveal owns its element's
 * `transition`, so a block with transition utilities of its own (a card's
 * hover fade) goes inside the reveal rather than becoming it.
 */

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { watchReveal } from "@/lib/reveal";

type RevealTag = "div" | "section" | "article" | "li" | "h1" | "h2" | "p";

type RevealProps<T extends RevealTag> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Reveal<T extends RevealTag = "div">({
  as,
  ...props
}: RevealProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  // let in straight from the queue: the attribute flips the CSS state, the
  // delay rides on a custom property, and React never re-renders for it
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return watchReveal(node, (delay) => {
      node.style.setProperty("--reveal-delay", `${delay}ms`);
      node.dataset.revealed = "";
    });
  }, []);

  // typed as a div inside: the tag's own props are checked at the call
  // site (RevealProps), and a union of tags can't carry one ref type
  const Tag = (as ?? "div") as "div";
  return (
    <Tag
      {...(props as ComponentPropsWithoutRef<"div">)}
      ref={ref}
      data-reveal=""
    />
  );
}

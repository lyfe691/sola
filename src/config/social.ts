/**
 * centralized social links configuration
 * (c) 2025 Yanis Sebastian Zürcher
 */

import type { ComponentType } from "react";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import {
  ChessMark,
  GithubMark,
  HackTheBoxMark,
  LeetcodeMark,
  LinkedinMark,
  TiktokMark,
} from "@/components/icons/brand-marks";
import { hugeIcon } from "@/lib/huge-icon";

export type SocialId =
  | "github"
  | "email"
  | "linkedin"
  | "leetcode"
  | "hackthebox"
  | "chess"
  | "tiktok";

export type SocialLink = {
  id: SocialId;
  label: string;
  href: string;
  icon: ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
};

// each id also names its brand colour: [data-brand] in index.css
export const SOCIAL_LINKS: Record<SocialId, SocialLink> = {
  github: {
    id: "github",
    label: "GitHub",
    href: "https://github.com/lyfe691",
    icon: GithubMark,
  },
  email: {
    id: "email",
    label: "Email",
    href: "mailto:yanis.sebastian.zuercher@gmail.com",
    icon: hugeIcon(Mail01Icon),
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yanis-sebastian-zürcher/",
    icon: LinkedinMark,
  },
  leetcode: {
    id: "leetcode",
    label: "LeetCode",
    href: "https://leetcode.com/u/lyfe691/",
    icon: LeetcodeMark,
  },
  hackthebox: {
    id: "hackthebox",
    label: "Hack The Box",
    href: "https://profile.hackthebox.com/profile/019ebdeb-cfb3-708a-9d67-dde825d9bfb3",
    icon: HackTheBoxMark,
  },
  chess: {
    id: "chess",
    label: "Chess.com",
    href: "https://chess.com/member/moment_o",
    icon: ChessMark,
  },
  tiktok: {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@seeyuh.0",
    icon: TiktokMark,
  },
};

/** a chip fills with its brand on hover; the chip carries data-brand={id} */
export const SOCIAL_BRAND_FILL =
  "hover:border-transparent hover:bg-(--brand-fill) hover:text-(--brand-ink) hover:ring-transparent";

export const SOCIAL_ORDER_HERO: SocialId[] = [
  "github",
  "linkedin",
  "email",
  "leetcode",
  "chess",
  "tiktok",
];

export const SOCIAL_ORDER_FOOTER: SocialId[] = [
  ...SOCIAL_ORDER_HERO,
  "hackthebox",
];

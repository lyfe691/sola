/**
 * centralized social links configuration
 * (c) 2025 Yanis Sebastian Zürcher
 */

import type { ComponentType } from "react";
import { Mail, Linkedin } from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import {
  SiChessdotcom,
  SiHackthebox,
  SiLeetcode,
  SiTiktok,
} from "react-icons/si";

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
};

export const SOCIAL_LINKS: Record<SocialId, SocialLink> = {
  github: {
    id: "github",
    label: "GitHub",
    href: "https://github.com/lyfe691",
  },
  email: {
    id: "email",
    label: "Email",
    href: "mailto:yanis.sebastian.zuercher@gmail.com",
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yanis-sebastian-zürcher/",
  },
  leetcode: {
    id: "leetcode",
    label: "LeetCode",
    href: "https://leetcode.com/u/lyfe691/",
  },
  hackthebox: {
    id: "hackthebox",
    label: "Hack The Box",
    href: "https://profile.hackthebox.com/profile/019ebdeb-cfb3-708a-9d67-dde825d9bfb3",
  },
  chess: {
    id: "chess",
    label: "Chess.com",
    href: "https://chess.com/member/moment_o",
  },
  tiktok: {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@seeyuh.0",
  },
};

export const SOCIAL_ICONS: Record<
  SocialId,
  ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>
> = {
  github: FaGithubAlt,
  email: Mail,
  linkedin: Linkedin,
  leetcode: SiLeetcode,
  hackthebox: SiHackthebox,
  chess: SiChessdotcom,
  tiktok: SiTiktok,
};

export const SOCIAL_HOVER_ACCENTS: Record<SocialId, string> = {
  github: "hover:border-foreground/30",
  email: "hover:bg-red-400/20 hover:border-red-400/30",
  linkedin: "hover:bg-cyan-400/20 hover:border-cyan-400/30",
  leetcode: "hover:bg-orange-400/20 hover:border-orange-400/30",
  hackthebox: "hover:bg-emerald-300/20 hover:border-emerald-400/30",
  tiktok: "hover:bg-pink-400/20 hover:border-pink-400/30",
  chess: "hover:bg-green-400/20 hover:border-green-400/30",
};

export const SOCIAL_ORDER_HERO: SocialId[] = [
  "github",
  "email",
  "linkedin",
  "tiktok",
  "leetcode",
  "chess",
];

// estimated to add more to footer rather than hero.
export const SOCIAL_ORDER_FOOTER: SocialId[] = [
  "github",
  "email",
  "linkedin",
  "leetcode",
  "hackthebox",
  "chess",
  "tiktok",
];

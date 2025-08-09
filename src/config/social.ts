/**
 * centralized social links configuration 
 * (c) 2025 Yanis Sebastian Zürcher
 */

export type SocialId =
  | 'github'
  | 'email'
  | 'linkedin'
  | 'leetcode'
  | 'hackthebox'
  | 'chess';

export type SocialLink = {
  id: SocialId;
  label: string;
  href: string;
};

export const SOCIAL_LINKS: Record<SocialId, SocialLink> = {
  github: {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/lyfe691',
  },
  email: {
    id: 'email',
    label: 'Email',
    href: 'mailto:yanis.sebastian.zuercher@gmail.com',
  },
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yanis-sebastian-zürcher/',
  },
  leetcode: {
    id: 'leetcode',
    label: 'LeetCode',
    href: 'https://leetcode.com/u/lyfe691/',
  },
  hackthebox: {
    id: 'hackthebox',
    label: 'Hack The Box',
    href: 'https://app.hackthebox.com/profile/2350832',
  },
  chess: {
    id: 'chess',
    label: 'Chess.com',
    href: 'https://chess.com/member/moment_o',
  },
};

export const SOCIAL_ORDER_HERO: SocialId[] = [
  'github',
  'email',
  'linkedin',
  'leetcode',
  'hackthebox',
  'chess',
];

// estimated to add more to footer rather than hero.
export const SOCIAL_ORDER_FOOTER: SocialId[] = [
  'github',
  'email',
  'linkedin',
  'leetcode',
  'hackthebox',
  'chess',
];



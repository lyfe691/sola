/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { scrollSubtleVariants } from "@/utils/transitions";

// shared scroll-triggered reveal for mdx block elements; spread onto motion.*
export const blockReveal = {
  variants: scrollSubtleVariants,
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
} as const;

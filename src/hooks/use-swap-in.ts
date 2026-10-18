/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";

/**
 * Whether a placeholder has stood here since this component mounted: the
 * content that replaces one fades in (`animate-swap-in`), and content that
 * was there from the first frame (a cache hit) shows as it is.
 */
export const useSwapIn = (placeholder: boolean) => {
  const [shown, setShown] = useState(placeholder);
  if (placeholder && !shown) setShown(true);
  return shown;
};

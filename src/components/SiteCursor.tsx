/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import UserCursor from "@/components/ui/custom/user-cursor";

const readThemeColor = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();

/** Full-viewport cursor themed to the active palette. */
const SiteCursor = () => {
  const { theme } = useTheme();
  const [colors, setColors] = useState(readThemeColors);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setColors(readThemeColors());
    });
    return () => cancelAnimationFrame(frame);
  }, [theme]);

  return (
    <UserCursor
      fullScreen
      trigger="always"
      color={colors.color || "var(--primary)"}
      showLabel={false}
      hideNativeCursor
      followInstant
      directionAwareTilt
      size={22}
      tilt={-14}
      pressScale={0.85}
      offset={{ x: 2, y: 2 }}
    />
  );
};

export default SiteCursor;
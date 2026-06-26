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

const readThemeColors = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    color: style.getPropertyValue("--primary").trim(),
    textColor: style.getPropertyValue("--primary-foreground").trim(),
  };
};

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
      name="YSZ"
      color={colors.color || "var(--primary)"}
      textColor={colors.textColor || "var(--primary-foreground)"}
      size={22}
      tilt={-14}
      showLabel
      hideNativeCursor
      directionAwareTilt
      labelTiltStrength={8}
      pressScale={0.85}
      offset={{ x: 2, y: 2 }}
      classNames={{
        labelText: "font-heading tracking-wide",
      }}
    />
  );
};

export default SiteCursor;
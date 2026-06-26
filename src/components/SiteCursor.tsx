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
      size={24}
      tilt={-12}
      showLabel
      hideNativeCursor
      directionAwareTilt
      labelTiltStrength={6}
      pressScale={0.88}
      offset={{ x: 1, y: 1 }}
      labelOffset={{ x: 20, y: 10 }}
      spring={{ stiffness: 400, damping: 30, mass: 0.55 }}
      labelSpring={{ stiffness: 170, damping: 22, mass: 0.9 }}
      classNames={{
        labelText: "font-heading uppercase tracking-[0.14em]",
      }}
    />
  );
};

export default SiteCursor;
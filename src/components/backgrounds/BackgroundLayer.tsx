/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Suspense } from "react";
import { useBackground } from "./background-provider";
import { BACKGROUNDS } from "./registry";

export default function BackgroundLayer() {
  const { active } = useBackground();
  const def = BACKGROUNDS.find((b) => b.id === active);
  if (!def) return null;

  const Background = def.component;
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none select-none"
      aria-hidden
    >
      <Suspense fallback={null}>
        <Background />
      </Suspense>
    </div>
  );
}

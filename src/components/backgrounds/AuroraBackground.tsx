/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useAurora } from "@/lib/aurora-provider";
import Aurora from "./Aurora";

export default function AuroraBackground() {
  const { enabled } = useAurora();
  if (!enabled) return null;
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none" aria-hidden>
      <Aurora />
    </div>
  );
}



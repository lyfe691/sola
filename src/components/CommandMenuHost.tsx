/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { lazy, Suspense, useState } from "react";
import { loadCommandMenu, useCommandMenu } from "@/hooks/use-command-menu";

const CommandMenu = lazy(() =>
  loadCommandMenu().then((m) => ({ default: m.CommandMenu })),
);

/**
 * Mounts the palette on its first open, then keeps it mounted so later
 * opens and closes animate as before.
 */
export function CommandMenuHost() {
  const isOpen = useCommandMenu((state) => state.isOpen);
  const [mounted, setMounted] = useState(false);
  if (isOpen && !mounted) setMounted(true);

  return mounted ? (
    <Suspense fallback={null}>
      <CommandMenu />
    </Suspense>
  ) : null;
}

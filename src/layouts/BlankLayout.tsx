/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useOutlet } from "react-router";
import PageShell from "./PageShell";

/**
 * BlankLayout - standalone pages with no navigation and no footer.
 * Used for /404, /a, and project deep dives.
 */
const BlankLayout = () => {
  const outlet = useOutlet();

  return (
    <main className="flex min-h-screen flex-col">
      <PageShell>{outlet}</PageShell>
    </main>
  );
};

export default BlankLayout;

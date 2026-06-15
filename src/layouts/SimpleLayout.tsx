/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useOutlet } from "react-router-dom";
import Footer from "@/components/Footer";
import PageShell from "./PageShell";

/**
 * SimpleLayout - standalone content pages without navigation, with footer.
 * Used for /privacy and /certifications.
 */
const SimpleLayout = () => {
  const outlet = useOutlet();

  return (
    <div className="flex min-h-screen flex-col">
      <PageShell>
        <main id="main" className="flex min-h-screen flex-1 flex-col">
          {outlet}
        </main>
        <Footer />
      </PageShell>
    </div>
  );
};

export default SimpleLayout;

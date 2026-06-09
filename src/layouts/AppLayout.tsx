/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useLocation, useOutlet } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageShell from "./PageShell";

const AppLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const isHome = location.pathname === "/";

  return (
    <main className="flex flex-1 flex-col">
      <Navigation />
      <PageShell>
        <div className="flex min-h-screen flex-1 flex-col p-5 sm:p-6 md:p-8 lg:p-12 pt-24 sm:pt-28 lg:pt-36">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
            {outlet}
          </div>
        </div>
        {!isHome && <Footer />}
      </PageShell>
    </main>
  );
};

export default AppLayout;

/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useOutlet } from "react-router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageShell from "./PageShell";
import { ThemeCallout } from "@/components/theme-callout";

const AppLayout = () => {
  const outlet = useOutlet();

  return (
    <div className="flex flex-1 flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Skip to content
      </a>
      <Navigation />
      <ThemeCallout />
      <PageShell>
        {/* tabIndex lets the skip link and the code-view exit hand focus here */}
        <main
          id="main"
          tabIndex={-1}
          className="flex min-h-screen flex-1 flex-col px-5 pb-5 pt-24 outline-none sm:px-6 sm:pb-6 sm:pt-28 md:px-8 md:pb-8 lg:px-12 lg:pb-12 lg:pt-36"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
            {outlet}
          </div>
        </main>
        <Footer />
      </PageShell>
    </div>
  );
};

export default AppLayout;

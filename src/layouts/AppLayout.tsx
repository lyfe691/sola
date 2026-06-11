/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useOutlet } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageShell from "./PageShell";

const AppLayout = () => {
  const outlet = useOutlet();

  return (
    <main className="flex flex-1 flex-col">
      <Navigation />
      <PageShell>
        <div className="flex min-h-screen flex-1 flex-col px-5 pb-5 pt-24 sm:px-6 sm:pb-6 sm:pt-28 md:px-8 md:pb-8 lg:px-12 lg:pb-12 lg:pt-36">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
            {outlet}
          </div>
        </div>
        <Footer />
      </PageShell>
    </main>
  );
};

export default AppLayout;

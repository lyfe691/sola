/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import React from 'react';
import Navigation from '@/components/Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * mainlayout - layout for content pages with navigation
 * used for all content pages including about, projects, skills, etc.
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-[120vh] flex flex-col">
      <div className="flex-1 p-5 sm:p-6 md:p-8 lg:p-12 pt-20 sm:pt-24 md:pt-20 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">
          <Navigation />
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainLayout;


﻿/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import React from 'react';
import Navigation from '../components/Navigation';

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
      <div className="flex-1 p-5 sm:p-6 md:p-8 lg:p-12 pt-16 sm:pt-18 md:pt-20 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">
          <Navigation />
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainLayout;


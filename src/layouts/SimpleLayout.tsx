/**
 * Copyright (c) 2025 Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import React from 'react';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

/**
 * simpleLayout - minimal layout without navigation
 * used for pages like home and not found where navigation is not displayed
 */
const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </main>
  );
};

export default SimpleLayout;


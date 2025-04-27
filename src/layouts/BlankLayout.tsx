/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import React from 'react';

interface BlankLayoutProps {
  children: React.ReactNode;
}

/**
 * BlankLayout - minimal layout without any UI elements
 * used for standalone pages like AboutThisWebsite where no navigation, 
 * toggles, or other UI elements should be displayed
 */
const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  );
};

export default BlankLayout; 
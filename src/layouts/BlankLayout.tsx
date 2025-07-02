/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
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
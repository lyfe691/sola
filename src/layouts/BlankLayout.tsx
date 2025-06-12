/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
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
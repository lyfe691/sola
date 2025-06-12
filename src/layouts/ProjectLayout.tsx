/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import React from 'react';

interface ProjectLayoutProps {
  children: React.ReactNode;
}

/**
 * ProjectLayout - layout for individual project pages
 * used for individual project pages like /projects/sola
 * Has no navigation - just content with proper spacing
 */
const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </main>
  );
};

export default ProjectLayout; 
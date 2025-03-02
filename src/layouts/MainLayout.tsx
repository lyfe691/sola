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

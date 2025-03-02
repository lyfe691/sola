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

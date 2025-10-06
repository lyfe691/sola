/**
 * TempLayout - layout for temporary pages under /t
 * 
 * (c) 2025 Yanis Sebastian Zürcher
 */
import React from "react";

interface TempLayoutProps {
  children: React.ReactNode;
}

const TempLayout: React.FC<TempLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">{children}</div>
    </main>
  );
};

export default TempLayout;



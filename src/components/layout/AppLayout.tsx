import React, { useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Reset scroll position when route changes
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full relative z-0">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Topbar />
        
        <main 
          ref={mainRef}
          className="flex-1 w-full flex flex-col overflow-y-auto overflow-x-hidden relative scroll-smooth px-4 sm:px-6 lg:px-10 py-8 pb-24 md:pb-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

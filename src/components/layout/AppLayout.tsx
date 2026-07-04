import React, { useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    // Reset window scroll position when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-[100dvh] w-full relative z-0 overflow-x-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        
        <main 
          className="flex-1 w-full flex flex-col px-4 sm:px-6 lg:px-10 py-8 pb-24 md:pb-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full relative z-0">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth px-4 sm:px-6 lg:px-10 py-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

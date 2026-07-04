import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, DoorOpen, BarChart3, Settings, FileText, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/students', icon: Users, label: 'Directory' },
  { path: '/rooms', icon: DoorOpen, label: 'Spaces' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 active:scale-95 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed inset-y-0 left-0 md:sticky md:top-0 z-40 w-72 h-screen glass-panel !rounded-none !border-y-0 !border-l-0 flex flex-col pt-8 pb-6 px-4 shrink-0 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="px-4 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <DoorOpen size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-slate-900 tracking-tight leading-none">Hostel OS</h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 mt-1 block">Enterprise</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-2">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
                  isActive
                    ? 'text-brand-700 bg-brand-50/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={`transition-colors duration-200 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {label}
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active" 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-600 rounded-r-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Need Help removed */}
      </motion.aside>
    </>
  );
};

import React from 'react';
import { Bell, Activity } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const Topbar = () => {
  const { settings } = useStore();

  return (
    <header className="h-20 glass-panel !rounded-none !border-x-0 !border-t-0 px-6 lg:px-10 flex items-center justify-between z-10 shrink-0 sticky top-0">
      
      {/* Spacer to push items to the right */}
      <div className="flex-1 hidden sm:block"></div>
      <div className="flex items-center gap-4 ml-auto">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-danger-base border-2 border-slate-50"></span>
        </button>
        
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 transition-colors">
          <Activity size={20} />
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900 leading-tight">{settings.adminName}</span>
            <span className="text-[11px] text-slate-500 font-medium">Administrator</span>
          </div>
          <img 
            src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" 
            alt="Admin" 
            className="w-10 h-10 rounded-xl shadow-sm border-2 border-white"
          />
        </button>
      </div>
    </header>
  );
};

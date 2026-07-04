import React from 'react';
import { Activity, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';

export const Topbar = () => {
  const { settings, searchQuery, setSearchQuery } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value && location.pathname !== '/students') {
      navigate('/students');
    }
  };

  return (
    <header className="h-20 glass-panel !rounded-none !border-x-0 !border-t-0 px-6 lg:px-10 flex items-center justify-between z-30 shrink-0 sticky top-0">
      
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md hidden sm:block mr-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search residents..." 
          value={searchQuery}
          onChange={handleSearchChange}
          className="glass-input !pl-10 !py-2 w-full bg-slate-50/50" 
        />
      </div>
      
      <div className="flex-1 sm:hidden"></div>
      
      <div className="flex items-center gap-4 ml-auto relative">
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

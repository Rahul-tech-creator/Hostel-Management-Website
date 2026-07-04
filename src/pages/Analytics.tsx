import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Filter, Calendar, BarChart3, Users, Home, TrendingUp, AlertCircle, Bot } from 'lucide-react';
import { ExecutiveOverview } from '@/components/analytics/ExecutiveOverview';
import { RevenueAnalytics } from '@/components/analytics/RevenueAnalytics';
import { OccupancyAnalytics } from '@/components/analytics/OccupancyAnalytics';
import { StudentAnalytics } from '@/components/analytics/StudentAnalytics';
import { FloorRoomAnalytics } from '@/components/analytics/FloorRoomAnalytics';
import { useStore } from '@/store/useStore';

type Tab = 'overview' | 'occupancy' | 'revenue' | 'students' | 'floors';

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [dateFilter, setDateFilter] = useState('All Time');

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Analytics Workspace</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Enterprise insights and live metrics</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl pl-10 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200 shrink-0">
        <div className="flex space-x-1 p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'occupancy', label: 'Occupancy', icon: Home },
            { id: 'revenue', label: 'Revenue', icon: TrendingUp },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'floors', label: 'Floors & Rooms', icon: Filter },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <ExecutiveOverview dateFilter={dateFilter} />}
            {activeTab === 'occupancy' && <OccupancyAnalytics dateFilter={dateFilter} />}
            {activeTab === 'revenue' && <RevenueAnalytics dateFilter={dateFilter} />}
            {activeTab === 'students' && <StudentAnalytics dateFilter={dateFilter} />}
            {activeTab === 'floors' && <FloorRoomAnalytics dateFilter={dateFilter} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

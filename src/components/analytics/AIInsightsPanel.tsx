import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const AIInsightsPanel = () => {
  const { students, rooms, floors } = useStore();

  const insights = useMemo(() => {
    const list = [];
    
    // Fee Insights
    const pendingCount = students.filter(s => s.feeStatus === 'pending').length;
    const overdueCount = students.filter(s => s.feeStatus === 'overdue').length;
    
    if (overdueCount > 0) {
      list.push({
        id: 'overdue',
        type: 'warning',
        icon: AlertTriangle,
        text: `${overdueCount} residents have overdue payments. Consider sending automated reminders.`,
      });
    } else if (pendingCount > 0) {
      list.push({
        id: 'pending',
        type: 'info',
        icon: Bot,
        text: `${pendingCount} residents have pending fees this month.`,
      });
    }

    // Occupancy Insights
    const emptyRooms = rooms.filter(r => r.occupants.length === 0);
    if (emptyRooms.length > 0) {
      list.push({
        id: 'empty',
        type: 'suggestion',
        icon: Sparkles,
        text: `${emptyRooms.length} rooms are completely vacant. Update listings to increase occupancy.`,
      });
    }

    // Floor insights
    const floorOccupancy = floors.map(floor => {
      const floorRooms = rooms.filter(r => r.floor === floor);
      const cap = floorRooms.reduce((acc, r) => acc + r.capacity, 0);
      const occ = floorRooms.reduce((acc, r) => acc + r.occupants.length, 0);
      return { floor, rate: cap > 0 ? occ / cap : 0 };
    }).sort((a, b) => b.rate - a.rate);

    if (floorOccupancy.length > 0 && floorOccupancy[0].rate > 0) {
      list.push({
        id: 'floor',
        type: 'trend',
        icon: TrendingUp,
        text: `${floorOccupancy[0].floor} Floor has the highest occupancy rate (${Math.round(floorOccupancy[0].rate * 100)}%).`,
      });
    }

    return list;
  }, [students, rooms, floors]);

  if (insights.length === 0) return null;

  return (
    <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center gap-2 text-brand-600 shrink-0">
        <Bot size={20} className="animate-pulse" />
        <span className="font-semibold text-sm uppercase tracking-wider">AI Insights</span>
      </div>

      <div className="flex-1 w-full overflow-hidden">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 sm:pb-0">
          {insights.map((insight) => (
            <motion.div 
              key={insight.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm shrink-0"
            >
              <insight.icon 
                size={14} 
                className={
                  insight.type === 'warning' ? 'text-red-500' :
                  insight.type === 'suggestion' ? 'text-amber-500' :
                  'text-brand-500'
                } 
              />
              <span className="text-sm font-medium text-slate-700">{insight.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export const AIInsights = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-brand-400/50 via-purple-400/50 to-emerald-400/50"
    >
      {/* Animated gradient background behind the glass */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-purple-600/10 animate-pulse"></div>
      
      <div className="relative h-full glass-panel !rounded-[27px] !border-0 p-6 flex flex-col justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-brand-600 to-purple-600 text-white shadow-lg">
              <Sparkles size={16} />
            </div>
            <h3 className="font-bold text-slate-900">AI Insights</h3>
          </div>
          
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            Occupancy is projected to reach <span className="font-extrabold text-brand-700">98%</span> next month based on current admission trends. 
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/40 p-2 rounded-lg border border-white/50">
              <div className="w-1.5 h-1.5 rounded-full bg-success-base"></div>
              Ground floor has optimal utilization (100%).
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/40 p-2 rounded-lg border border-white/50">
              <div className="w-1.5 h-1.5 rounded-full bg-warning-base"></div>
              3 students have overdue fees.
            </div>
          </div>
        </div>

        <button className="mt-6 flex items-center justify-between w-full text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors group">
          View full predictive report
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

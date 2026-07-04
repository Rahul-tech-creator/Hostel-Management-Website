import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className="glass-panel p-6 flex flex-col relative overflow-hidden group"
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors duration-500"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/60 shadow-sm border border-white/80 flex items-center justify-center text-brand-600">
          <Icon size={24} className="stroke-[2]" />
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${trend.isPositive ? 'bg-success-bg text-success-base' : 'bg-danger-bg text-danger-base'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-slate-500 text-sm font-semibold mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
          <span className="text-sm font-medium text-slate-400">{subtitle}</span>
        </div>
      </div>
    </motion.div>
  );
};

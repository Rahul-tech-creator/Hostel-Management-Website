import React from 'react';
import { useStore } from '@/store/useStore';
import { timeAgo } from '@/utils/format';
import { Activity as ActivityIcon, UserPlus, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return <CheckCircle2 size={16} className="text-success-base" />;
    case 'warning': return <AlertCircle size={16} className="text-warning-base" />;
    case 'danger': return <AlertCircle size={16} className="text-danger-base" />;
    default: return <ActivityIcon size={16} className="text-brand-600" />;
  }
};

const getBg = (type: string) => {
  switch (type) {
    case 'success': return 'bg-success-bg border-success-base/20';
    case 'warning': return 'bg-warning-bg border-warning-base/20';
    case 'danger': return 'bg-danger-bg border-danger-base/20';
    default: return 'bg-brand-50 border-brand-200';
  }
};

export const ActivityFeed = () => {
  const { activities } = useStore();

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-900 tracking-tight">Recent Activity</h3>
        <button className="text-xs font-semibold text-brand-600 hover:text-brand-700">View All</button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-5">
        {activities.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm font-medium">No recent activities.</div>
        ) : (
          activities.slice(0, 10).map((activity, index) => (
            <div key={activity.id} className="relative flex gap-4">
              {index !== activities.length - 1 && (
                <div className="absolute left-4 top-8 bottom-[-20px] w-px bg-slate-200"></div>
              )}
              <div className={`relative z-10 w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${getBg(activity.type)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="pb-1">
                <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{activity.title}</p>
                <p className="text-xs text-slate-500 mb-1">{activity.desc}</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {timeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const StudentAnalytics = ({ dateFilter }: { dateFilter: string }) => {
  const { students } = useStore();

  const courseData = useMemo(() => {
    const counts = students.reduce((acc, s) => {
      acc[s.course] = (acc[s.course] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
          borderWidth: 0,
          hoverOffset: 4,
        }
      ]
    };
  }, [students]);

  const feeStatusData = useMemo(() => {
    const counts = students.reduce((acc, s) => {
      acc[s.feeStatus || 'paid'] = (acc[s.feeStatus || 'paid'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: ['Paid', 'Pending', 'Overdue'],
      datasets: [
        {
          data: [counts['paid'] || 0, counts['pending'] || 0, counts['overdue'] || 0],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 4,
        }
      ]
    };
  }, [students]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#64748b',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
          usePointStyle: true,
          padding: 20,
        }
      },
    },
    cutout: '70%',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Course Distribution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 flex flex-col"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Students per Course</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Distribution across academic programs</p>
        </div>
        <div className="flex-1 relative min-h-[300px]">
          <Doughnut data={courseData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Fee Status Distribution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 flex flex-col"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Fee Status Breakdown</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Payment status of active residents</p>
        </div>
        <div className="flex-1 relative min-h-[300px]">
          <Doughnut data={feeStatusData} options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-[120px]">
            <span className="text-3xl font-bold text-slate-900">{students.length}</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Residents</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

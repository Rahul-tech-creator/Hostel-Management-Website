import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Filler, Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend);

export const RevenueAnalytics = ({ dateFilter }: { dateFilter: string }) => {
  const { students, rooms, floors } = useStore();

  // Generate historical revenue data from actual student joinedAt dates
  const revenueHistoryData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Get last 6 months labels
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      labels.push(months[m]);
    }

    // Bucket feePaid by month joined
    const revenueByMonth = [0, 0, 0, 0, 0, 0];
    
    students.forEach(s => {
      if (!s.joinedAt) return;
      const joinedDate = new Date(s.joinedAt);
      const diffMonths = (new Date().getFullYear() - joinedDate.getFullYear()) * 12 + (new Date().getMonth() - joinedDate.getMonth());
      
      if (diffMonths >= 0 && diffMonths < 6) {
        // Add to the correct bucket (0 is 5 months ago, 5 is current month)
        revenueByMonth[5 - diffMonths] += s.feePaid;
      }
    });

    // Make it cumulative to show growth, or just monthly. The prompt asks for monthly revenue trend.
    // We'll show monthly collected revenue.

    return {
      labels,
      datasets: [
        {
          fill: true,
          label: 'Collected Revenue (₹)',
          data: revenueByMonth,
          borderColor: '#10b981',
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
            return gradient;
          },
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#10b981',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [students]);

  const floorRevenueData = useMemo(() => {
    const revenueByFloor = floors.map(floor => {
      const floorStudents = students.filter(s => s.floor === floor);
      return floorStudents.reduce((acc, s) => acc + s.feePaid, 0);
    });

    return {
      labels: floors,
      datasets: [
        {
          label: 'Revenue by Floor (₹)',
          data: revenueByFloor,
          backgroundColor: '#6366f1',
          borderRadius: 6,
        }
      ]
    };
  }, [students, floors]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => `₹${context.raw.toLocaleString()}`
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.4)', drawBorder: false },
        ticks: { color: '#94a3b8', callback: (value: any) => `₹${value / 1000}k` }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#94a3b8' }
      },
    },
    interaction: { intersect: false, mode: 'index' as const },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Revenue Trend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 flex flex-col"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Trend</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Monthly collection history</p>
        </div>
        <div className="flex-1 min-h-[300px]">
          <Line data={revenueHistoryData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Revenue by Floor */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 flex flex-col"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Revenue by Floor</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Total collections distributed across levels</p>
        </div>
        <div className="flex-1 min-h-[300px]">
          <Bar data={floorRevenueData} options={chartOptions} />
        </div>
      </motion.div>

    </div>
  );
};

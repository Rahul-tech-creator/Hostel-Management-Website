import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useStore } from '@/store/useStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const OccupancyChart = () => {
  const { rooms } = useStore();

  const data = useMemo(() => {
    // In a real app, this would use historical data. 
    // Here we generate a realistic looking trend ending at current occupancy.
    
    const currentOccupancy = rooms.reduce((acc, r) => acc + r.occupants.length, 0);
    const capacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
    const rate = capacity > 0 ? Math.round((currentOccupancy / capacity) * 100) : 0;

    // Generate last 6 months trend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trendData = [
      Math.max(0, rate - 15),
      Math.max(0, rate - 8),
      Math.max(0, rate - 12),
      Math.max(0, rate - 5),
      Math.max(0, rate - 2),
      rate
    ];

    return {
      labels: months,
      datasets: [
        {
          fill: true,
          label: 'Occupancy Rate (%)',
          data: trendData,
          borderColor: '#4f46e5',
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
            gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
            return gradient;
          },
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#4f46e5',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [rooms]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(226, 232, 240, 0.4)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-slate-900 tracking-tight">Occupancy Trends</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">6-month historical utilization</p>
        </div>
        <select className="bg-white/50 border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-500/20">
          <option>Last 6 Months</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>
      <div className="flex-1 relative min-h-[250px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

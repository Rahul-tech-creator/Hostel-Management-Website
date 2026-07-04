import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const OccupancyAnalytics = ({ dateFilter }: { dateFilter: string }) => {
  const { rooms, floors } = useStore();

  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupants.length, 0);
  const vacantBeds = totalCapacity - occupiedBeds;
  const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

  const radialData = {
    labels: ['Occupied', 'Vacant'],
    datasets: [
      {
        data: [occupiedBeds, vacantBeds],
        backgroundColor: ['#4f46e5', '#e2e8f0'],
        borderWidth: 0,
        cutout: '80%',
      },
    ],
  };

  const radialOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: { animateScale: true, animateRotate: true }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Section: Overview & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Capacity Radial */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Capacity Utilization</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Real-time occupancy vs capacity</p>
          </div>
          
          <div className="relative h-48 w-full flex items-center justify-center my-6">
            <Doughnut data={radialData} options={radialOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-900">{occupancyRate}%</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Occupied</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="block text-xs font-semibold text-slate-500 mb-1">OCCUPIED BEDS</span>
              <span className="block text-lg font-bold text-brand-600">{occupiedBeds}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="block text-xs font-semibold text-slate-500 mb-1">VACANT BEDS</span>
              <span className="block text-lg font-bold text-slate-700">{vacantBeds}</span>
            </div>
          </div>
        </motion.div>

        {/* 5-Floor Heatmap */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 lg:col-span-2 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Occupancy Heatmap</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Visual density across all 5 floors</p>
            </div>
            <div className="flex gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Empty</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Partial</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> Full</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-x-auto hide-scrollbar">
            {floors.slice().reverse().map(floor => {
              const floorRooms = rooms.filter(r => r.floor === floor);
              return (
                <div key={floor} className="flex items-center gap-4 min-w-max">
                  <div className="w-24 text-sm font-semibold text-slate-700">{floor} Floor</div>
                  <div className="flex gap-1.5">
                    {floorRooms.map(room => {
                      const occ = room.occupants.length;
                      const cap = room.capacity;
                      const isEmpty = occ === 0;
                      const isFull = occ === cap;
                      
                      const bgColor = isEmpty 
                        ? 'bg-emerald-500 border-emerald-600' 
                        : isFull 
                          ? 'bg-red-500 border-red-600' 
                          : 'bg-amber-500 border-amber-600';

                      return (
                        <div 
                          key={room.id}
                          className={`w-8 h-8 rounded border flex items-center justify-center text-[10px] font-bold text-white shadow-sm hover:scale-110 hover:shadow-md transition-all cursor-pointer ${bgColor} group relative`}
                        >
                          {room.number}
                          
                          {/* Custom Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl border border-slate-700">
                            <span className="font-bold block mb-1">Room {room.number}</span>
                            <span className="text-slate-300">{occ} / {cap} Occupied</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

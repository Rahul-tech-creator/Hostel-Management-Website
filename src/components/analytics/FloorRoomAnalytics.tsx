import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { ChevronDown, Trophy, AlertTriangle, IndianRupee } from 'lucide-react';

export const FloorRoomAnalytics = ({ dateFilter }: { dateFilter: string }) => {
  const { floors, rooms, students } = useStore();

  const floorStats = useMemo(() => {
    return floors.map(floor => {
      const floorRooms = rooms.filter(r => r.floor === floor);
      const floorStudents = students.filter(s => s.floor === floor);
      
      const totalRooms = floorRooms.length;
      const capacity = floorRooms.reduce((acc, r) => acc + r.capacity, 0);
      const occupiedBeds = floorRooms.reduce((acc, r) => acc + r.occupants.length, 0);
      const occupancyRate = capacity > 0 ? (occupiedBeds / capacity) * 100 : 0;
      
      const emptyRooms = floorRooms.filter(r => r.occupants.length === 0).length;
      const fullRooms = floorRooms.filter(r => r.occupants.length === r.capacity).length;
      
      const revenue = floorStudents.reduce((acc, s) => acc + s.feeTotal, 0);

      return {
        floor, totalRooms, capacity, occupiedBeds, occupancyRate, emptyRooms, fullRooms, revenue
      };
    });
  }, [floors, rooms, students]);

  const roomRankings = useMemo(() => {
    const roomStats = rooms.map(room => {
      const roomStudents = students.filter(s => s.roomId === room.id);
      const revenue = roomStudents.reduce((acc, s) => acc + s.feeTotal, 0);
      const occupancy = room.occupants.length;
      return { ...room, revenue, occupancy };
    });

    const mostProfitable = [...roomStats].sort((a, b) => b.revenue - a.revenue)[0];
    const highestOccupancy = [...roomStats].sort((a, b) => b.occupancy - a.occupancy)[0];
    const leastOccupied = [...roomStats].sort((a, b) => a.occupancy - b.occupancy)[0];

    return { mostProfitable, highestOccupancy, leastOccupied };
  }, [rooms, students]);

  return (
    <div className="space-y-6">
      
      {/* Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Most Profitable Room</p>
            <h4 className="text-lg font-bold text-slate-900">Room {roomRankings.mostProfitable?.number}</h4>
            <p className="text-sm text-brand-600 font-medium">₹{roomRankings.mostProfitable?.revenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Highest Occupancy</p>
            <h4 className="text-lg font-bold text-slate-900">Room {roomRankings.highestOccupancy?.number}</h4>
            <p className="text-sm text-emerald-600 font-medium">{roomRankings.highestOccupancy?.occupancy} Residents</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Least Occupied</p>
            <h4 className="text-lg font-bold text-slate-900">Room {roomRankings.leastOccupied?.number}</h4>
            <p className="text-sm text-red-600 font-medium">{roomRankings.leastOccupied?.occupancy} Residents</p>
          </div>
        </div>
      </div>

      {/* Floor Breakdown */}
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200/60 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Floor Comparison</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Detailed metrics breakdown by level</p>
        </div>
        
        <div className="divide-y divide-slate-100">
          {floorStats.map((stat, idx) => (
            <motion.div 
              key={stat.floor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 hover:bg-slate-50/50 transition-colors group cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-xl">
                    {stat.floor.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{stat.floor} Floor</h4>
                    <p className="text-sm font-medium text-slate-500">{stat.totalRooms} Total Rooms</p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Occupancy</p>
                    <div className="flex items-end gap-2">
                      <span className="text-lg font-bold text-slate-900">{stat.occupancyRate.toFixed(1)}%</span>
                      <span className="text-sm font-medium text-slate-500 mb-0.5">({stat.occupiedBeds}/{stat.capacity})</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Empty Rooms</p>
                    <span className="text-lg font-bold text-slate-900">{stat.emptyRooms}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Rooms</p>
                    <span className="text-lg font-bold text-slate-900">{stat.fullRooms}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
                    <span className="text-lg font-bold text-brand-600">₹{stat.revenue.toLocaleString()}</span>
                  </div>
                </div>

                <button className="hidden lg:flex p-2 text-slate-400 group-hover:text-brand-600 transition-colors bg-white rounded-lg shadow-sm border border-slate-200">
                  <ChevronDown size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

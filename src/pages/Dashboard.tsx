import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { OccupancyChart } from '@/components/dashboard/OccupancyChart';
import { Users, DoorOpen, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { students, rooms } = useStore();

  const totalCapacity = useMemo(() => rooms.reduce((acc, r) => acc + r.capacity, 0), [rooms]);
  const occupiedBeds = useMemo(() => rooms.reduce((acc, r) => acc + r.occupants.length, 0), [rooms]);
  const availableBeds = totalCapacity - occupiedBeds;
  const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-slate-900 tracking-tight"
        >
          Overview
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 font-medium mt-1"
        >
          Welcome back to Premium Hostel OS. Here's what's happening today.
        </motion.p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Residents" 
          value={students.length} 
          subtitle="Active" 
          icon={Users} 
          trend={{ value: 12, isPositive: true }} 
          delay={0.1} 
        />
        <StatCard 
          title="Occupancy Rate" 
          value={`${occupancyRate}%`} 
          subtitle="Capacity" 
          icon={Maximize} 
          trend={{ value: 2.4, isPositive: true }} 
          delay={0.2} 
        />
        <StatCard 
          title="Available Beds" 
          value={availableBeds} 
          subtitle={`of ${totalCapacity}`} 
          icon={DoorOpen} 
          delay={0.3} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <div className="lg:col-span-2">
          <OccupancyChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

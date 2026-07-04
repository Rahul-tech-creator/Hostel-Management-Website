import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { OccupancyChart } from '@/components/dashboard/OccupancyChart';
import { Users, DoorOpen, Maximize, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { StudentFormModal } from '@/components/students/StudentFormModal';
import { Student } from '@/types';

export const Dashboard = () => {
  const students = useStore(state => state.students);
  const rooms = useStore(state => state.rooms);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const handleAddNew = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  const totalCapacity = useMemo(() => rooms.reduce((acc, r) => acc + r.capacity, 0), [rooms]);
  const occupiedBeds = useMemo(() => rooms.reduce((acc, r) => acc + r.occupants.length, 0), [rooms]);
  const availableBeds = totalCapacity - occupiedBeds;
  const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
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
        <button 
          onClick={handleAddNew}
          className="glass-btn !px-4 !py-2.5 flex items-center gap-2 mt-2"
        >
          <Plus size={18} />
          <span className="hidden sm:inline font-semibold">Add Resident</span>
        </button>
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
      <div className="w-full lg:h-[400px]">
        <div className="w-full h-full min-h-[400px]">
          <OccupancyChart />
        </div>
      </div>

      <StudentFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentToEdit={studentToEdit}
      />
    </div>
  );
};

export default Dashboard;

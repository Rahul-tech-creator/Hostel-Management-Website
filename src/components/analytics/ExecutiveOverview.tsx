import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { 
  Users, UserCheck, BedDouble, Home, Percent, Building2, 
  Wallet, DollarSign, Clock, CheckCircle2, AlertCircle, 
  TrendingUp, BarChart, Activity, PieChart 
} from 'lucide-react';

export const ExecutiveOverview = ({ dateFilter }: { dateFilter: string }) => {
  const { students, rooms, floors } = useStore();

  const metrics = useMemo(() => {
    // Basic Counts
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    
    // Room Metrics
    const totalRooms = rooms.length;
    const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
    const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupants.length, 0);
    const vacantBeds = totalCapacity - occupiedBeds;
    const occupancyPercent = totalCapacity > 0 ? (occupiedBeds / totalCapacity) * 100 : 0;
    const averageOccupancy = floors.length > 0 ? occupancyPercent : 0; // Simplified average

    // Financial Metrics
    const totalRevenue = students.reduce((acc, s) => acc + s.feeTotal, 0);
    const collectedFees = students.reduce((acc, s) => acc + s.feePaid, 0);
    const pendingFees = students.filter(s => s.feeStatus === 'pending').reduce((acc, s) => acc + (s.feeTotal - s.feePaid), 0);
    const overdueFees = students.filter(s => s.feeStatus === 'overdue').reduce((acc, s) => acc + (s.feeTotal - s.feePaid), 0);
    
    const monthlyRevenue = collectedFees / 6; // Simplified estimate based on 6 month history mock
    const avgRevenuePerRoom = totalRooms > 0 ? totalRevenue / totalRooms : 0;
    const avgRevenuePerStudent = activeStudents > 0 ? totalRevenue / activeStudents : 0;

    return [
      { id: 1, label: 'Total Students', value: totalStudents, icon: Users, prefix: '', suffix: '', color: 'blue' },
      { id: 2, label: 'Active Students', value: activeStudents, icon: UserCheck, prefix: '', suffix: '', color: 'green' },
      { id: 3, label: 'Vacant Beds', value: vacantBeds, icon: BedDouble, prefix: '', suffix: '', color: 'amber' },
      { id: 4, label: 'Occupied Beds', value: occupiedBeds, icon: Activity, prefix: '', suffix: '', color: 'indigo' },
      { id: 5, label: 'Total Rooms', value: totalRooms, icon: Home, prefix: '', suffix: '', color: 'purple' },
      { id: 6, label: 'Total Capacity', value: totalCapacity, icon: Building2, prefix: '', suffix: '', color: 'slate' },
      { id: 7, label: 'Occupancy Rate', value: occupancyPercent.toFixed(1), icon: Percent, prefix: '', suffix: '%', color: 'brand' },
      { id: 8, label: 'Avg Occupancy', value: averageOccupancy.toFixed(1), icon: PieChart, prefix: '', suffix: '%', color: 'cyan' },
      
      { id: 9, label: 'Total Revenue', value: totalRevenue.toLocaleString(), icon: Wallet, prefix: '₹', suffix: '', color: 'emerald' },
      { id: 10, label: 'Monthly Revenue', value: monthlyRevenue.toLocaleString(undefined, {maximumFractionDigits:0}), icon: BarChart, prefix: '₹', suffix: '', color: 'teal' },
      { id: 11, label: 'Collected Fees', value: collectedFees.toLocaleString(), icon: CheckCircle2, prefix: '₹', suffix: '', color: 'green' },
      { id: 12, label: 'Pending Fees', value: pendingFees.toLocaleString(), icon: Clock, prefix: '₹', suffix: '', color: 'amber' },
      { id: 13, label: 'Overdue Fees', value: overdueFees.toLocaleString(), icon: AlertCircle, prefix: '₹', suffix: '', color: 'red' },
      { id: 14, label: 'Avg Rev / Room', value: avgRevenuePerRoom.toLocaleString(undefined, {maximumFractionDigits:0}), icon: DollarSign, prefix: '₹', suffix: '', color: 'indigo' },
      { id: 15, label: 'Avg Rev / Student', value: avgRevenuePerStudent.toLocaleString(undefined, {maximumFractionDigits:0}), icon: TrendingUp, prefix: '₹', suffix: '', color: 'blue' },
    ];
  }, [students, rooms, floors]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="glass-panel p-4 relative overflow-hidden group hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-xl bg-${m.color}-500/10 text-${m.color}-600 group-hover:scale-110 transition-transform duration-300`}>
              <m.icon size={20} />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
              <TrendingUp size={12} />
              <span>+2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{m.label}</p>
            <h4 className="text-2xl font-bold text-slate-900 tracking-tight">
              {m.prefix}{m.value}{m.suffix}
            </h4>
          </div>
          
          {/* Decorative Sparkline Mock */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}
    </div>
  );
};

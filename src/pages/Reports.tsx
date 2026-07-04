import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, AlertCircle, Users, CheckCircle2, TrendingUp } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Student, Room } from '@/types';
import toast from 'react-hot-toast';

type ReportType = 'defaulters' | 'occupancy' | 'revenue';

export const Reports = () => {
  const { students, rooms } = useStore();
  const [activeReport, setActiveReport] = useState<ReportType>('defaulters');

  // Defaulters Data
  const defaulters = students.filter(s => s.feeStatus === 'pending' || s.feeStatus === 'overdue');
  const totalDue = defaulters.reduce((sum, s) => sum + (s.feeTotal - s.feePaid), 0);

  // Occupancy Data
  const vacantRooms = rooms.filter(r => r.occupants.length === 0);
  const partiallyOccupied = rooms.filter(r => r.occupants.length > 0 && r.occupants.length < r.capacity);
  const fullyOccupied = rooms.filter(r => r.occupants.length === r.capacity);

  // Revenue Data (Simulated recent transactions based on joinedAt and fees)
  const paidStudents = students.filter(s => s.feeStatus === 'paid').sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeReport === 'defaulters') {
      csvContent += "Name,Course,Room ID,Amount Due,Status\\n";
      defaulters.forEach(s => {
        csvContent += `"${s.name}","${s.course}","${s.roomId}",${s.feeTotal - s.feePaid},${s.feeStatus}\\n`;
      });
    } else if (activeReport === 'occupancy') {
      csvContent += "Room Number,Floor,Capacity,Occupants,Status\\n";
      rooms.forEach(r => {
        const status = r.occupants.length === 0 ? 'Vacant' : r.occupants.length === r.capacity ? 'Full' : 'Partial';
        csvContent += `"${r.number}","${r.floor}",${r.capacity},${r.occupants.length},${status}\\n`;
      });
    } else if (activeReport === 'revenue') {
      csvContent += "Transaction Date,Student Name,Room ID,Amount Paid\\n";
      paidStudents.forEach(s => {
        csvContent += `"${new Date(s.joinedAt).toLocaleDateString()}","${s.name}","${s.roomId}",${s.feePaid}\\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hostel_${activeReport}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${activeReport.charAt(0).toUpperCase() + activeReport.slice(1)} Report Exported!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 shrink-0 gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-slate-900 tracking-tight"
          >
            Reports
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium mt-1"
          >
            Generate and export actionable operational reports
          </motion.p>
        </div>
        
        <button 
          onClick={handleExportCSV}
          className="glass-btn inline-flex items-center gap-2 text-brand-700 bg-brand-50 border-brand-200"
        >
          <Download size={18} />
          Export as CSV
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar shrink-0">
        <button
          onClick={() => setActiveReport('defaulters')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
            activeReport === 'defaulters' 
              ? 'bg-danger-500 text-white shadow-md shadow-danger-500/20 border-transparent' 
              : 'bg-white/60 text-slate-600 hover:bg-white/90 hover:text-slate-900 border border-white/50'
          }`}
        >
          <AlertCircle size={16} />
          Defaulters List
        </button>
        <button
          onClick={() => setActiveReport('occupancy')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
            activeReport === 'occupancy' 
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 border-transparent' 
              : 'bg-white/60 text-slate-600 hover:bg-white/90 hover:text-slate-900 border border-white/50'
          }`}
        >
          <Users size={16} />
          Occupancy Report
        </button>
        <button
          onClick={() => setActiveReport('revenue')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
            activeReport === 'revenue' 
              ? 'bg-success-600 text-white shadow-md shadow-success-500/20 border-transparent' 
              : 'bg-white/60 text-slate-600 hover:bg-white/90 hover:text-slate-900 border border-white/50'
          }`}
        >
          <TrendingUp size={16} />
          Revenue Ledger
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
        {activeReport === 'defaulters' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <div className="p-6 border-b border-white/50 bg-white/30 shrink-0 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Fee Defaulters</h2>
                <p className="text-sm text-slate-500">{defaulters.length} students have pending dues</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-500 uppercase">Total Outstanding</p>
                <p className="text-2xl font-black text-danger-600">₹{totalDue.toLocaleString()}</p>
              </div>
            </div>
            <div className="overflow-x-auto p-0">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Due</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50">
                  {defaulters.map((student) => (
                    <tr key={student.id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-lg shadow-sm" />
                          <div className="font-semibold text-slate-900">{student.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{student.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{student.roomId || 'Unallocated'}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">₹{(student.feeTotal - student.feePaid).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${student.feeStatus === 'overdue' ? 'bg-danger-bg text-danger-base' : 'bg-warning-bg text-warning-base'}`}>
                          {student.feeStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {defaulters.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No fee defaulters found. Great job!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeReport === 'occupancy' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <div className="p-6 border-b border-white/50 bg-white/30 shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-success-bg/50 p-4 rounded-xl border border-success-base/20">
                <p className="text-xs font-bold text-success-base uppercase mb-1">Completely Vacant</p>
                <p className="text-2xl font-black text-slate-900">{vacantRooms.length} <span className="text-sm font-medium text-slate-500">rooms</span></p>
              </div>
              <div className="bg-warning-bg/50 p-4 rounded-xl border border-warning-base/20">
                <p className="text-xs font-bold text-warning-base uppercase mb-1">Partially Occupied</p>
                <p className="text-2xl font-black text-slate-900">{partiallyOccupied.length} <span className="text-sm font-medium text-slate-500">rooms</span></p>
              </div>
              <div className="bg-brand-50 p-4 rounded-xl border border-brand-200">
                <p className="text-xs font-bold text-brand-600 uppercase mb-1">Fully Occupied</p>
                <p className="text-2xl font-black text-slate-900">{fullyOccupied.length} <span className="text-sm font-medium text-slate-500">rooms</span></p>
              </div>
            </div>
            <div className="overflow-x-auto p-0">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room Number</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Floor</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50">
                  {rooms.map((room) => {
                    const isVacant = room.occupants.length === 0;
                    const isFull = room.occupants.length === room.capacity;
                    return (
                      <tr key={room.id} className="hover:bg-white/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{room.number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{room.floor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {room.occupants.length} / {room.capacity} Beds
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            isVacant ? 'bg-success-bg text-success-base' : 
                            isFull ? 'bg-brand-100 text-brand-600' : 
                            'bg-warning-bg text-warning-base'
                          }`}>
                            {isVacant ? 'Vacant' : isFull ? 'Full' : 'Partial'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeReport === 'revenue' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <div className="p-6 border-b border-white/50 bg-white/30 shrink-0 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Revenue Ledger</h2>
                <p className="text-sm text-slate-500">Recent completed transactions</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-500 uppercase">Total Collected</p>
                <p className="text-2xl font-black text-success-600">₹{paidStudents.reduce((sum, s) => sum + s.feePaid, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="overflow-x-auto p-0">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50">
                  {paidStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(student.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-lg shadow-sm" />
                          <div className="font-semibold text-slate-900">{student.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{student.roomId || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-success-600">
                        +₹{student.feePaid.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {paidStudents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">No transactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reports;

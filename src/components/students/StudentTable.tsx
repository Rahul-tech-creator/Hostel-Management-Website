import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Phone, Building2, BookOpen } from 'lucide-react';
import { Student } from '@/types';
import { useStore } from '@/store/useStore';

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
}

export const StudentTable = ({ students, onEdit }: Props) => {
  const { rooms, deleteStudent, logActivity } = useStore();

  const getRoomNumber = (roomId: string) => {
    return rooms.find(r => r.id === roomId)?.number || 'N/A';
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the hostel?`)) {
      deleteStudent(id);
      logActivity({ type: 'danger', title: 'Resident Removed', desc: `${name} has been removed from the system.` });
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Resident</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Room & Floor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {students.map((student) => (
                <tr 
                  key={student.id}
                  className="hover:bg-white/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-xl shadow-sm" />
                      <div>
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-xs text-slate-500">{student.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700 font-medium">{student.phone}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[150px]">{student.course} • {student.college}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-100 text-brand-700 font-bold">
                      <DoorOpenIcon size={14} />
                      Room {getRoomNumber(student.roomId)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 pl-1">{student.floor} Floor</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-[140px]">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fee Progress</span>
                        <span className={`text-xs font-bold ${(student.feePaid || 0) >= (student.feeTotal || 0) ? 'text-success-base' : ((student.feePaid || 0) > 0 ? 'text-warning-base' : 'text-danger-base')}`}>
                          ₹{(student.feePaid || 0).toLocaleString('en-IN')} <span className="text-slate-400 font-medium">/ ₹{(student.feeTotal || 0).toLocaleString('en-IN')}</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(((student.feePaid || 0) / (student.feeTotal || 1)) * 100 || 0, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${(student.feePaid || 0) >= (student.feeTotal || 0) ? 'bg-success-base' : ((student.feePaid || 0) > 0 ? 'bg-warning-base' : 'bg-danger-base')}`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(student)} className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(student.id, student.name)} className="p-2 text-danger-base hover:bg-danger-bg rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No residents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards (Responsive representation of Table) */}
      <div className="md:hidden space-y-4">
        {students.map((student) => (
          <div 
            key={student.id}
            className="glass-panel p-5 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-xl shadow-sm" />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg leading-tight">{student.name}</h4>
                  <span className="text-xs text-slate-500">{student.id}</span>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${(student.feePaid || 0) >= (student.feeTotal || 0) ? 'bg-success-bg text-success-base' : ((student.feePaid || 0) > 0 ? 'bg-warning-bg text-warning-base' : 'bg-danger-bg text-danger-base')}`}>
                {(student.feePaid || 0) >= (student.feeTotal || 0) ? 'Paid' : ((student.feePaid || 0) > 0 ? 'Pending' : 'Overdue')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50/50 p-2.5 rounded-xl border border-white">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Room</div>
                <div className="font-semibold text-slate-800">{getRoomNumber(student.roomId)}</div>
              </div>
              <div className="bg-slate-50/50 p-2.5 rounded-xl border border-white">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Floor</div>
                <div className="font-semibold text-slate-800">{student.floor}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fee Progress</span>
                <span className={`text-xs font-bold ${(student.feePaid || 0) >= (student.feeTotal || 0) ? 'text-success-base' : ((student.feePaid || 0) > 0 ? 'text-warning-base' : 'text-danger-base')}`}>
                  ₹{(student.feePaid || 0).toLocaleString('en-IN')} <span className="text-slate-400 font-medium">/ ₹{(student.feeTotal || 0).toLocaleString('en-IN')}</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((student.feePaid || 0) / (student.feeTotal || 1)) * 100 || 0, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${(student.feePaid || 0) >= (student.feeTotal || 0) ? 'bg-success-base' : ((student.feePaid || 0) > 0 ? 'bg-warning-base' : 'bg-danger-base')}`}
                />
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400" />
                {student.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <BookOpen size={14} className="text-slate-400" />
                <span className="truncate">{student.course}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building2 size={14} className="text-slate-400" />
                <span className="truncate">{student.college}</span>
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-100/60 pt-4">
              <button onClick={() => onEdit(student)} className="flex-1 glass-btn-secondary !py-2 !min-h-0 text-brand-600">
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => handleDelete(student.id, student.name)} className="flex-1 glass-btn-secondary !py-2 !min-h-0 text-danger-base hover:!bg-danger-50">
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="glass-panel p-8 text-center text-slate-500 font-medium">
            No residents found.
          </div>
        )}
      </div>
    </div>
  );
};

// Helper icon component for inline usage
const DoorOpenIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><path d="M14 12v.01"/></svg>
);

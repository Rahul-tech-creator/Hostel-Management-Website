import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import { Room, Student } from '@/types';
import { useStore } from '@/store/useStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onAllocate?: () => void;
  onEdit?: (student: Student) => void;
}

export const RoomDetailsModal = ({ isOpen, onClose, room, onAllocate, onEdit }: Props) => {
  const { students, deleteStudent } = useStore();

  if (!room) return null;

  const roomStudents = students.filter(s => room.occupants.includes(s.id));
  const isFull = room.occupants.length >= room.capacity;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel w-full max-w-lg relative z-10 max-h-[90vh] flex flex-col"
          >
            <div className="px-6 py-4 border-b border-white/50 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">Room {room.number} Details</h2>
                <p className="text-xs font-semibold text-slate-500">{room.floor} Floor</p>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6 bg-slate-50/50 p-4 rounded-xl border border-white">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Capacity</p>
                  <p className="text-2xl font-black text-slate-900">{room.occupants.length} <span className="text-lg text-slate-400">/ {room.capacity}</span></p>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${isFull ? 'bg-danger-bg text-danger-base border border-danger-base/20' : 'bg-success-bg text-success-base border border-success-base/20'}`}>
                    {isFull ? <AlertCircle size={14} /> : <Users size={14} />}
                    {isFull ? 'Fully Occupied' : `${room.capacity - room.occupants.length} Beds Available`}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-3">Current Residents</h3>
                {roomStudents.length > 0 ? (
                  <div className="space-y-3">
                    {roomStudents.map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-slate-200/50 hover:bg-white/60 transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-lg shadow-sm" />
                          <div>
                            <p className="font-semibold text-slate-900 text-sm leading-tight">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.course}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${student.feeStatus === 'paid' ? 'bg-success-bg text-success-base' : 'bg-warning-bg text-warning-base'}`}>
                            {student.feeStatus}
                          </span>
                          <button
                            onClick={() => onEdit?.(student)}
                            className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to remove this student?')) {
                                deleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-danger-base hover:bg-danger-bg rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm font-medium text-slate-500 bg-slate-50/30 rounded-xl border border-dashed border-slate-300">
                    This room is currently empty.
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/50 bg-slate-50/50 rounded-b-[28px] shrink-0">
              <button 
                disabled={isFull} 
                onClick={onAllocate}
                className="glass-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Allocate Resident to this Room
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { studentSchema, StudentFormData } from '@/schemas/student';
import { useStore } from '@/store/useStore';
import { Student } from '@/types';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

export const StudentFormModal = ({ isOpen, onClose, studentToEdit }: Props) => {
  const { floors, rooms, addStudent, updateStudent, logActivity } = useStore();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      feeStatus: 'paid',
      status: 'active'
    }
  });

  const selectedFloor = watch('floor');
  const availableRooms = rooms.filter(
    r => r.floor === selectedFloor && (studentToEdit?.roomId === r.id || r.occupants.length < r.capacity)
  );

  useEffect(() => {
    if (isOpen) {
      if (studentToEdit) {
        // Populate existing values when editing (resolves the user's issue)
        reset({
          name: studentToEdit.name,
          phone: studentToEdit.phone,
          course: studentToEdit.course,
          college: studentToEdit.college,
          floor: studentToEdit.floor,
          roomId: studentToEdit.roomId,
          govtId: studentToEdit.govtId,
          guardianName: studentToEdit.guardianName || '',
          emergencyContact: studentToEdit.emergencyContact || '',
          feeTotal: studentToEdit.feeTotal || 0,
          feePaid: studentToEdit.feePaid || 0,
          feeStatus: studentToEdit.feeStatus || 'paid',
          status: studentToEdit.status || 'active',
        });
      } else {
        // Reset to empty for new student
        reset({
          name: '', phone: '', course: '', college: '', floor: floors[0], roomId: '', govtId: '', guardianName: '', emergencyContact: '', feeTotal: 0, feePaid: 0, feeStatus: 'paid', status: 'active'
        });
      }
    }
  }, [isOpen, studentToEdit, reset, floors]);

  const onSubmit = (data: StudentFormData) => {
    // Auto-calculate fee status based on input
    const derivedFeeStatus = data.feePaid >= data.feeTotal ? 'paid' : (data.feePaid > 0 ? 'pending' : 'overdue');
    
    if (studentToEdit) {
      updateStudent(studentToEdit.id, { 
        ...data, 
        feeStatus: derivedFeeStatus,
        joinedAt: studentToEdit.joinedAt || new Date().toISOString()
      });
      logActivity({ type: 'primary', title: 'Resident Updated', desc: `Updated details for ${data.name}` });
      toast.success('Resident updated successfully!');
    } else {
      const newStudent: Student = {
        ...data,
        feeStatus: derivedFeeStatus,
        joinedAt: new Date().toISOString(),
        id: 'STU-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        avatar: `https://ui-avatars.com/api/?name=${data.name.replace(' ', '+')}&background=F8F9FA&color=0F172A`,
      };
      addStudent(newStudent);
      logActivity({ type: 'success', title: 'New Resident Added', desc: `${data.name} was allocated to room ${rooms.find(r => r.id === data.roomId)?.number}` });
      toast.success('Resident added successfully!');
    }
    onClose();
  };

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
            className="glass-panel w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col"
          >
            <div className="px-6 py-4 border-b border-white/50 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-slate-900">
                {studentToEdit ? 'Edit Resident' : 'Add New Resident'}
              </h2>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="student-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Full Name</label>
                    <input {...register('name')} className="glass-input" placeholder="e.g. John Doe" />
                    {errors.name && <p className="text-[10px] text-danger-base">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                    <input {...register('phone')} className="glass-input" placeholder="+1 (555) 000-0000" />
                    {errors.phone && <p className="text-[10px] text-danger-base">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Course</label>
                    <input {...register('course')} className="glass-input" placeholder="e.g. B.Tech CS" />
                    {errors.course && <p className="text-[10px] text-danger-base">{errors.course.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">College / Institution</label>
                    <input {...register('college')} className="glass-input" placeholder="e.g. Tech Institute" />
                    {errors.college && <p className="text-[10px] text-danger-base">{errors.college.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Floor</label>
                    <select {...register('floor')} className="glass-input">
                      {floors.map(f => <option key={f} value={f}>{f} Floor</option>)}
                    </select>
                    {errors.floor && <p className="text-[10px] text-danger-base">{errors.floor.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Room Allocation</label>
                    <select {...register('roomId')} className="glass-input" disabled={!selectedFloor || availableRooms.length === 0}>
                      <option value="">Select a room...</option>
                      {availableRooms.map(r => (
                        <option key={r.id} value={r.id}>
                          Room {r.number} ({r.capacity - r.occupants.length + (studentToEdit?.roomId === r.id ? 1 : 0)} beds available)
                        </option>
                      ))}
                    </select>
                    {errors.roomId && <p className="text-[10px] text-danger-base">{errors.roomId.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Total Annual Fee (₹)</label>
                    <input {...register('feeTotal')} type="number" className="glass-input" />
                    {errors.feeTotal && <p className="text-[10px] text-danger-base">{errors.feeTotal.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Amount Paid (₹)</label>
                    <input {...register('feePaid')} type="number" className="glass-input" />
                    {errors.feePaid && <p className="text-[10px] text-danger-base">{errors.feePaid.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Government ID (Aadhaar / SSN)</label>
                  <input {...register('govtId')} className="glass-input" placeholder="Enter ID number (will be redacted)" />
                  {errors.govtId && <p className="text-[10px] text-danger-base">{errors.govtId.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-200/50">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Guardian Name (Optional)</label>
                    <input {...register('guardianName')} className="glass-input" placeholder="Parent / Guardian" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Emergency Contact (Optional)</label>
                    <input {...register('emergencyContact')} className="glass-input" placeholder="Phone number" />
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-white/50 flex justify-end gap-3 shrink-0 bg-slate-50/50 rounded-b-[28px]">
              <button type="button" onClick={onClose} className="glass-btn-secondary">
                Cancel
              </button>
              <button type="submit" form="student-form" className="glass-btn">
                <Check size={18} />
                {studentToEdit ? 'Save Changes' : 'Allocate Resident'}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

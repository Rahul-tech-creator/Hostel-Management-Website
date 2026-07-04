import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { StudentTable } from '@/components/students/StudentTable';
import { StudentFormModal } from '@/components/students/StudentFormModal';
import { Student } from '@/types';
import { motion } from 'framer-motion';
import { Search, Plus, Filter } from 'lucide-react';

export const Students = () => {
  const students = useStore(state => state.students);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  const filteredStudents = React.useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-slate-900 tracking-tight"
          >
            Directory
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium mt-1"
          >
            Manage {students.length} active residents
          </motion.p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search directory..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input !py-2.5 !pl-9"
            />
          </div>
          <button className="glass-btn-secondary !px-4 !py-2.5">
            <Filter size={18} className="text-slate-500" />
          </button>
          <button onClick={handleAddNew} className="glass-btn !px-5 !py-2.5">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Resident</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <StudentTable 
          students={filteredStudents} 
          onEdit={handleEdit} 
        />
      </div>

      {/* Reusable Form Modal */}
      <StudentFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentToEdit={studentToEdit}
      />
    </div>
  );
};

export default Students;

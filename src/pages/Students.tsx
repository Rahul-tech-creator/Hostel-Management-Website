import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { StudentTable } from '@/components/students/StudentTable';
import { StudentFormModal } from '@/components/students/StudentFormModal';
import { Student } from '@/types';
import { motion } from 'framer-motion';
import { Search, Plus, Filter } from 'lucide-react';

export const Students = () => {
  const students = useStore(state => state.students);
  const searchQuery = useStore(state => state.searchQuery);
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

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredStudents = React.useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div 
        className={`sticky top-24 z-20 glass-panel !rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0 shadow-md transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'
        }`}
      >
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
          <button className="glass-btn-secondary !px-4 !py-2.5">
            <Filter size={18} className="text-slate-500" />
          </button>
          <button onClick={handleAddNew} className="glass-btn !px-5 !py-2.5">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Resident</span>
          </button>
        </div>
      </div>

      <div>
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

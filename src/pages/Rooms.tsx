import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomDetailsModal } from '@/components/rooms/RoomDetailsModal';
import { Room, Student } from '@/types';
import { motion } from 'framer-motion';
import { StudentFormModal } from '@/components/students/StudentFormModal';

export const Rooms = () => {
  const { rooms, floors } = useStore();
  const [selectedFloor, setSelectedFloor] = useState<string>(floors[0]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const floorRooms = rooms.filter(r => r.floor === selectedFloor);
  
  const totalFloorCapacity = floorRooms.reduce((acc, r) => acc + r.capacity, 0);
  const floorOccupied = floorRooms.reduce((acc, r) => acc + r.occupants.length, 0);
  const floorAvailable = totalFloorCapacity - floorOccupied;

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6 shrink-0">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-slate-900 tracking-tight"
        >
          Spaces
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 font-medium mt-1"
        >
          Manage hostel rooms and floor capacity
        </motion.p>
      </div>

      {/* Floor Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar shrink-0">
        {floors.map(floor => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              selectedFloor === floor 
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' 
                : 'bg-white/60 text-slate-600 hover:bg-white/90 hover:text-slate-900 border border-white/50'
            }`}
          >
            {floor} Floor
          </button>
        ))}
      </div>

      {/* Floor Overview KPI */}
      <div className="grid grid-cols-3 gap-4 mb-8 shrink-0">
        <div className="glass-panel p-4 flex flex-col justify-center border-l-4 border-l-brand-500">
          <p className="text-[11px] uppercase font-bold text-slate-400 mb-1">Total Rooms</p>
          <p className="text-2xl font-black text-slate-900">{floorRooms.length}</p>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-center border-l-4 border-l-success-base">
          <p className="text-[11px] uppercase font-bold text-slate-400 mb-1">Available Beds</p>
          <p className="text-2xl font-black text-slate-900">{floorAvailable}</p>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-center border-l-4 border-l-danger-base">
          <p className="text-[11px] uppercase font-bold text-slate-400 mb-1">Occupied Beds</p>
          <p className="text-2xl font-black text-slate-900">{floorOccupied}</p>
        </div>
      </div>

      {/* Room Grid */}
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {floorRooms.map(room => (
            <RoomCard key={room.id} room={room} onClick={setSelectedRoom} />
          ))}
        </div>
      </div>

      <RoomDetailsModal 
        isOpen={!!selectedRoom} 
        onClose={() => setSelectedRoom(null)} 
        room={selectedRoom} 
        onAllocate={() => {
          setStudentToEdit(null);
          setIsModalOpen(true);
        }}
        onEdit={(student) => {
          setStudentToEdit(student);
          setIsModalOpen(true);
        }}
      />
      
      <StudentFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        studentToEdit={studentToEdit} 
      />
    </div>
  );
};

export default Rooms;

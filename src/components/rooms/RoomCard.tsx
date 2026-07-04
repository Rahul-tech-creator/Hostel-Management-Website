import React from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, Users } from 'lucide-react';
import { Room } from '@/types';

interface Props {
  room: Room;
  onClick: (room: Room) => void;
}

export const RoomCard = ({ room, onClick }: Props) => {
  const isFull = room.occupants.length >= room.capacity;
  const occupancyPercentage = (room.occupants.length / room.capacity) * 100;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => onClick(room)}
      className="glass-panel p-5 cursor-pointer relative overflow-hidden group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${isFull ? 'bg-danger-bg text-danger-base' : 'bg-brand-50 text-brand-600'}`}>
            <DoorOpen size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg leading-tight">Room {room.number}</h4>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{room.floor} Floor</span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${isFull ? 'bg-danger-bg text-danger-base' : 'bg-success-bg text-success-base'}`}>
          {isFull ? 'Full' : 'Available'}
        </div>
      </div>

      <div className="space-y-1.5 mb-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600 flex items-center gap-1.5"><Users size={12}/> Occupancy</span>
          <span className="text-slate-900">{room.occupants.length} / {room.capacity}</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${occupancyPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${isFull ? 'bg-danger-base' : 'bg-brand-500'}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

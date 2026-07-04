import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, Room, Activity, Settings } from '@/types';

interface AppState {
  floors: string[];
  rooms: Room[];
  students: Student[];
  activities: Activity[];
  settings: Settings;
  
  // Actions
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  logActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  bootstrapData: () => void;
  clearAllData: () => void;
}

const INITIAL_FLOORS = ['Ground', 'First', 'Second', 'Third', 'Fourth'];
const REDACTED_ID_STRING = "[Aadhaar Redacted]";

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      floors: INITIAL_FLOORS,
      rooms: [],
      students: [],
      activities: [],
      settings: {
        hostelName: 'Premium Hub',
        adminName: 'Admin User',
        supportEmail: 'support@hostel.os',
      },

      addStudent: (student) => set((state) => {
        // Find room and add occupant
        const updatedRooms = state.rooms.map(room => 
          room.id === student.roomId 
            ? { ...room, occupants: [...room.occupants, student.id] }
            : room
        );
        return {
          students: [student, ...state.students],
          rooms: updatedRooms,
        };
      }),

      updateStudent: (id, updates) => set((state) => {
        const student = state.students.find(s => s.id === id);
        if (!student) return state;

        let updatedRooms = state.rooms;
        
        // Handle room change
        if (updates.roomId && updates.roomId !== student.roomId) {
          updatedRooms = state.rooms.map(room => {
            if (room.id === student.roomId) {
              return { ...room, occupants: room.occupants.filter(o => o !== id) };
            }
            if (room.id === updates.roomId) {
              return { ...room, occupants: [...room.occupants, id] };
            }
            return room;
          });
        }

        const updatedStudents = state.students.map(s => 
          s.id === id ? { ...s, ...updates } : s
        );

        return {
          students: updatedStudents,
          rooms: updatedRooms,
        };
      }),

      deleteStudent: (id) => set((state) => {
        const student = state.students.find(s => s.id === id);
        if (!student) return state;

        const updatedRooms = state.rooms.map(room => 
          room.id === student.roomId 
            ? { ...room, occupants: room.occupants.filter(o => o !== id) }
            : room
        );

        return {
          students: state.students.filter(s => s.id !== id),
          rooms: updatedRooms,
        };
      }),

      logActivity: (activity) => set((state) => {
        const newActivity: Activity = {
          ...activity,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        return {
          activities: [newActivity, ...state.activities].slice(0, 20), // Keep last 20
        };
      }),

      bootstrapData: () => set((state) => {
        if (state.rooms.length > 0) return state; // Already bootstrapped

        const rooms: Room[] = [];
        const prefixes: Record<string, string> = { 'Ground': '0', 'First': '1', 'Second': '2', 'Third': '3', 'Fourth': '4' };
        
        INITIAL_FLOORS.forEach(floor => {
          for (let i = 1; i <= 20; i++) {
            const numStr = i < 10 ? `0${i}` : `${i}`;
            rooms.push({
              id: `${prefixes[floor]}${numStr}`,
              number: `${prefixes[floor]}${numStr}`,
              floor: floor,
              capacity: 4,
              occupants: []
            });
          }
        });

        const names = ["Aiden Chen", "Marcus Thorne", "Elias Vance", "Julian Rhys", "Caleb Sterling", "Rowan Hayes"];
        const courses = ["B.Tech CS", "MBA", "B.Arch", "BBA"];
        const students: Student[] = [];

        for (let i = 0; i < 60; i++) {
          const availableRooms = rooms.filter(r => r.occupants.length < r.capacity);
          if (availableRooms.length === 0) break;
          const room = availableRooms[Math.floor(Math.random() * availableRooms.length)];
          
          const studentName = names[i % names.length] + " " + Math.random().toString(36).substring(2, 6).toUpperCase();
          const feeTotal = 120000;
          const feePaid = Math.random() > 0.4 ? 120000 : Math.floor(Math.random() * 100000);
          
          // Generate a random joinedAt date within the last 6 months
          const now = new Date();
          const past = new Date();
          past.setMonth(now.getMonth() - 6);
          const joinedAt = new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime())).toISOString();
          
          const student: Student = {
            id: 'STU-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            name: studentName,
            phone: "+1 (555) 019-" + Math.floor(1000 + Math.random() * 9000),
            course: courses[Math.floor(Math.random() * courses.length)],
            college: "Tech Institute",
            roomId: room.id,
            floor: room.floor,
            govtId: REDACTED_ID_STRING,
            avatar: `https://ui-avatars.com/api/?name=${studentName.replace(' ', '+')}&background=F8F9FA&color=0F172A`,
            feeTotal,
            feePaid,
            joinedAt,
            feeStatus: feePaid >= feeTotal ? 'paid' : (feePaid > 0 ? 'pending' : 'overdue'),
            status: 'active'
          };

          students.push(student);
          room.occupants.push(student.id);
        }

        return {
          floors: INITIAL_FLOORS,
          rooms,
          students,
          activities: [
            { id: '1', type: 'primary', title: 'System initialized', desc: 'OS booted and populated with demo data', timestamp: new Date().toISOString() }
          ]
        };
      }),

      clearAllData: () => set({
        students: [],
        rooms: [],
        activities: [],
      })
    }),
    {
      name: 'hostel-os-storage-v3',
    }
  )
);

export interface Student {
  id: string;
  name: string;
  phone: string;
  course: string;
  college: string;
  roomId: string;
  floor: string;
  govtId: string;
  avatar: string;
  guardianName?: string;
  emergencyContact?: string;
  feeTotal: number;
  feePaid: number;
  joinedAt: string;
  feeStatus?: 'paid' | 'pending' | 'overdue';
  status?: 'active' | 'inactive';
}

export interface Room {
  id: string;
  number: string;
  floor: string;
  capacity: number;
  occupants: string[]; // Array of student IDs
}

export interface Activity {
  id: string;
  type: 'primary' | 'success' | 'warning' | 'danger';
  title: string;
  desc: string;
  timestamp: string;
}

export interface Settings {
  hostelName: string;
  adminName: string;
  supportEmail: string;
}

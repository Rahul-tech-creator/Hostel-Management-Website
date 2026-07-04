import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  course: z.string().min(2, 'Course is required'),
  college: z.string().min(2, 'College is required'),
  floor: z.string().min(1, 'Floor is required'),
  roomId: z.string().min(1, 'Room is required'),
  govtId: z.string().min(4, 'Government ID is required'),
  guardianName: z.string().optional(),
  emergencyContact: z.string().optional(),
  feeTotal: z.coerce.number().min(0, 'Must be a positive number'),
  feePaid: z.coerce.number().min(0, 'Must be a positive number'),
  feeStatus: z.enum(['paid', 'pending', 'overdue']).default('paid'),
  status: z.enum(['active', 'inactive']).default('active'),
  joinedAt: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

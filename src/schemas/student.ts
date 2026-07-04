import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  course: z.string().min(2, 'Course is required').max(50, 'Course name is too long'),
  college: z.string().min(2, 'College is required').max(100, 'College name is too long'),
  floor: z.string().min(1, 'Floor is required'),
  roomId: z.string().min(1, 'Room is required'),
  govtId: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
  guardianName: z.string().optional().refine(val => !val || val.length >= 2, 'Guardian name must be at least 2 characters'),
  emergencyContact: z.string().optional().refine(val => !val || /^\d{10}$/.test(val), 'Emergency contact must be exactly 10 digits if provided'),
  feeTotal: z.coerce.number().min(1, 'Total fee must be greater than 0'),
  feePaid: z.coerce.number().min(0, 'Must be a positive number'),
  feeStatus: z.enum(['paid', 'pending', 'overdue']).default('paid'),
  status: z.enum(['active', 'inactive']).default('active'),
  joinedAt: z.string().optional(),
}).refine(data => data.feePaid <= data.feeTotal, {
  message: "Amount paid cannot exceed total fee",
  path: ["feePaid"]
});

export type StudentFormData = z.infer<typeof studentSchema>;

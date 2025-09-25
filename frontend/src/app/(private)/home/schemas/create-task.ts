import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  priority:  z.string().min(1, 'Priority is required'),
  dueDate: z.string()
  .min(1, 'Due date is required')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  assigneeId: z.number().optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
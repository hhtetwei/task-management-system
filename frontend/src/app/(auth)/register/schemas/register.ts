import { z } from 'zod';

export const registerSchema = z.object({
name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
email: z.string({ required_error: 'Email is required' }).email('Invalid email'),
phoneNumber: z.string().optional(),
password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export type RegisterDto = z.infer<typeof registerSchema>;

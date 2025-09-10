import { z } from 'zod';

// Zod validation schema for login form
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(100, 'Email must be less than 100 characters'),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

// Type inference from schema
export type LoginFormData = z.infer<typeof loginSchema>;

// Form errors interface
export interface LoginFormErrors {
  email?: string;
  password?: string;
}
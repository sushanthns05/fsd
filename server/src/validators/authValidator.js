import { z } from 'zod';

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters').max(80),
      email: z.string().email('Please provide a valid email'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
      role: z.enum(['student', 'instructor']).optional().default('student'),
      headline: z.string().max(120).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().min(1, 'Reset token is required'),
      email: z.string().email('Please provide a valid email'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

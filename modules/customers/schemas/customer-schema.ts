import { z } from 'zod';

export const customerSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Customer code is required.')
    .max(20, 'Customer code cannot exceed 20 characters.')
    .regex(
      /^[A-Za-z0-9-]+$/,
      'Customer code can only contain letters, numbers, and hyphens.',
    ),

  name: z
    .string()
    .trim()
    .min(2, 'Customer name is required.')
    .max(120, 'Customer name cannot exceed 120 characters.'),

  contactName: z
    .string()
    .trim()
    .min(2, 'Contact name is required.')
    .max(100, 'Contact name cannot exceed 100 characters.'),

  email: z
    .string()
    .trim()
    .email('Enter a valid email address.')
    .max(160, 'Email cannot exceed 160 characters.'),

  phone: z
    .string()
    .trim()
    .min(7, 'Phone number is required.')
    .max(30, 'Phone number cannot exceed 30 characters.'),

  address: z
    .string()
    .trim()
    .min(2, 'Customer address is required.')
    .max(200, 'Customer address cannot exceed 200 characters.'),

  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type CustomerSchemaValues = z.infer<typeof customerSchema>;

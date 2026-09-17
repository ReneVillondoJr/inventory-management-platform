import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Enter your email address.')
    .email('Enter a valid email address.'),

  password: z
    .string()
    .min(1, 'Enter your password.')
    .min(8, 'Password must be at least 8 characters.'),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;

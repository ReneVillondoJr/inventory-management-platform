import { z } from 'zod';

export const warehouseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Warehouse code is required.')
    .max(20, 'Warehouse code cannot exceed 20 characters.')
    .regex(
      /^[A-Za-z0-9-]+$/,
      'Warehouse code can only contain letters, numbers, and hyphens.',
    ),

  name: z
    .string()
    .trim()
    .min(2, 'Warehouse name is required.')
    .max(100, 'Warehouse name cannot exceed 100 characters.'),

  address: z
    .string()
    .trim()
    .min(2, 'Warehouse address is required.')
    .max(200, 'Warehouse address cannot exceed 200 characters.'),

  managerId: z.string().min(1, 'Select a warehouse manager.'),

  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type WarehouseSchemaValues = z.infer<typeof warehouseSchema>;

import { z } from 'zod';

export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Select a product.'),
  warehouseId: z.string().min(1, 'Select a warehouse.'),
  type: z.enum(['INCREASE', 'DECREASE']),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number.')
    .positive('Quantity must be greater than zero.'),
  reason: z.enum(['CYCLE_COUNT_VARIANCE', 'DAMAGED', 'LOST', 'FOUND', 'OTHER']),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters.').optional(),
});

export type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentSchema>;

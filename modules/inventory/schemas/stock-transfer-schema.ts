import { z } from 'zod';

export const stockTransferSchema = z
  .object({
    productId: z.string().min(1, 'Select a product.'),
    sourceWarehouseId: z.string().min(1, 'Select a source warehouse.'),
    destinationWarehouseId: z
      .string()
      .min(1, 'Select a destination warehouse.'),
    quantity: z.coerce
      .number()
      .int('Quantity must be a whole number.')
      .positive('Quantity must be greater than zero.'),
    notes: z
      .string()
      .max(500, 'Notes cannot exceed 500 characters.')
      .optional(),
  })
  .refine(
    (values) => values.sourceWarehouseId !== values.destinationWarehouseId,
    {
      message: 'Source and destination warehouses must be different.',
      path: ['destinationWarehouseId'],
    },
  );

export type StockTransferFormValues = z.infer<typeof stockTransferSchema>;

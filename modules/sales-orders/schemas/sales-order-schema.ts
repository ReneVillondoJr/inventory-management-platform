import { z } from 'zod';

const salesOrderItemSchema = z.object({
  productId: z.string().min(1, 'Select a product.'),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number.')
    .positive('Quantity must be greater than zero.'),
  unitPrice: z.coerce
    .number()
    .finite()
    .nonnegative('Unit price cannot be negative.'),
});

export const salesOrderSchema = z
  .object({
    customerId: z.string().min(1, 'Select a customer.'),
    warehouseId: z.string().min(1, 'Select a warehouse.'),
    orderDate: z.string().min(1, 'Order date is required.'),
    status: z.enum([
      'DRAFT',
      'CONFIRMED',
      'PROCESSING',
      'COMPLETED',
      'CANCELLED',
    ]),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters.'),
    items: z
      .array(salesOrderItemSchema)
      .min(1, 'Add at least one product to the order.'),
  })
  .refine(
    (values) => {
      const productIds = values.items.map((item) => item.productId);

      return new Set(productIds).size === productIds.length;
    },
    {
      path: ['items'],
      message: 'Each product can only appear once in an order.',
    },
  );

export type SalesOrderSchemaValues = z.infer<typeof salesOrderSchema>;

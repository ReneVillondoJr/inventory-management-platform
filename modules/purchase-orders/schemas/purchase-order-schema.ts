import { z } from 'zod';

const purchaseOrderItemSchema = z.object({
  productId: z.string().min(1, 'Select a product.'),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number.')
    .positive('Quantity must be greater than zero.'),
  unitCost: z.coerce
    .number()
    .finite()
    .nonnegative('Unit cost cannot be negative.'),
});

export const purchaseOrderSchema = z
  .object({
    supplierId: z.string().min(1, 'Select a supplier.'),

    warehouseId: z.string().min(1, 'Select a warehouse.'),

    orderDate: z.string().min(1, 'Order date is required.'),

    expectedDate: z.string().min(1, 'Expected date is required.'),

    status: z.enum([
      'DRAFT',
      'APPROVED',
      'PARTIALLY_RECEIVED',
      'RECEIVED',
      'CANCELLED',
    ]),

    notes: z.string().max(500, 'Notes must be 500 characters or fewer.'),

    items: z.array(purchaseOrderItemSchema).min(1, 'Add at least one product.'),
  })
  .refine(
    (value) => {
      const productIds = value.items.map((item) => item.productId);

      return new Set(productIds).size === productIds.length;
    },
    {
      message: 'A product cannot appear more than once in the order.',
      path: ['items'],
    },
  )
  .refine(
    (value) =>
      new Date(value.expectedDate).getTime() >=
      new Date(value.orderDate).getTime(),
    {
      message: 'Expected date cannot be earlier than the order date.',
      path: ['expectedDate'],
    },
  );

export const receivePurchaseOrderSchema = z.object({
  items: z
    .array(
      z.object({
        purchaseOrderItemId: z.string().min(1),
        quantity: z.coerce
          .number()
          .int('Quantity must be a whole number.')
          .nonnegative('Quantity cannot be negative.'),
      }),
    )
    .min(1),

  receivedDate: z.string().min(1, 'Received date is required.'),

  notes: z.string().max(500, 'Notes must be 500 characters or fewer.'),
});

export type PurchaseOrderSchemaValues = z.infer<typeof purchaseOrderSchema>;

export type ReceivePurchaseOrderSchemaValues = z.infer<
  typeof receivePurchaseOrderSchema
>;

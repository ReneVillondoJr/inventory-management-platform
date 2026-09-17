import { z } from 'zod';

export const productSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(2, 'SKU is required.')
    .max(50, 'SKU must be 50 characters or fewer.'),

  name: z
    .string()
    .trim()
    .min(2, 'Product name is required.')
    .max(120, 'Product name must be 120 characters or fewer.'),

  categoryId: z.string().min(1, 'Select a category.'),

  brandId: z.string().min(1, 'Select a brand.'),

  unit: z
    .string()
    .trim()
    .min(1, 'Unit is required.')
    .max(30, 'Unit must be 30 characters or fewer.'),

  costPrice: z.coerce
    .number()
    .finite()
    .nonnegative('Cost price cannot be negative.'),

  sellingPrice: z.coerce
    .number()
    .finite()
    .nonnegative('Selling price cannot be negative.'),

  reorderLevel: z.coerce
    .number()
    .int('Reorder level must be a whole number.')
    .nonnegative('Reorder level cannot be negative.'),

  status: z.enum(['ACTIVE', 'INACTIVE']),

  image: z.string().optional(),
});

export type ProductSchemaValues = z.infer<typeof productSchema>;

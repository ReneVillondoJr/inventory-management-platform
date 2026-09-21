import { z } from 'zod';

export const notificationTypeSchema = z.enum([
  'LOW_STOCK',
  'TRANSFER_COMPLETED',
  'RETURN_COMPLETED',
]);

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  read: z.boolean(),
});

export type NotificationSchema = z.infer<typeof notificationSchema>;

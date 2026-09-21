import type { NotificationSchema } from '@/modules/notifications/schemas/notification-schema';

export type NotificationType = NotificationSchema['type'];

export type Notification = NotificationSchema & {
  href: string;
};

export type NotificationFilter = 'ALL' | 'UNREAD';

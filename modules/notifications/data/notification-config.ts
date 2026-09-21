import {
  AlertTriangle,
  ArrowLeftRight,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';

import type { NotificationType } from '../types/notification';

export type NotificationConfig = {
  icon: LucideIcon;
  href: string;
};

export const notificationConfig: Record<NotificationType, NotificationConfig> =
  {
    LOW_STOCK: {
      icon: AlertTriangle,
      href: '/admin/inventory/stock-levels',
    },

    TRANSFER_COMPLETED: {
      icon: ArrowLeftRight,
      href: '/admin/operations/stock-transfers',
    },

    RETURN_COMPLETED: {
      icon: RotateCcw,
      href: '/admin/operations/returns',
    },
  };

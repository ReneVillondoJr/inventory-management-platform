import { Badge } from '@/components/ui/badge';

import type { SalesOrderStatus } from '../types/sales-order';

const statusConfig: Record<
  SalesOrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: 'Draft',
    className: 'border-border bg-muted text-muted-foreground',
  },

  CONFIRMED: {
    label: 'Confirmed',
    className:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
  },

  PROCESSING: {
    label: 'Processing',
    className:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  },

  COMPLETED: {
    label: 'Completed',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  },

  CANCELLED: {
    label: 'Cancelled',
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
  },
};

type SalesOrderStatusBadgeProps = {
  status: SalesOrderStatus;
};

export function SalesOrderStatusBadge({ status }: SalesOrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant='outline' className={config.className}>
      {config.label}
    </Badge>
  );
}

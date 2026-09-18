import { Badge } from '@/components/ui/badge';

import type { PurchaseOrderStatus } from '../types/purchase-order';

type PurchaseOrderStatusBadgeProps = {
  status: PurchaseOrderStatus;
};

const statusConfig: Record<
  PurchaseOrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: 'Draft',
    className: 'border-border bg-muted/50 text-muted-foreground',
  },

  APPROVED: {
    label: 'Approved',
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  },

  PARTIALLY_RECEIVED: {
    label: 'Partially received',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },

  RECEIVED: {
    label: 'Received',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },

  CANCELLED: {
    label: 'Cancelled',
    className: 'border-red-200 bg-red-50 text-red-700',
  },
};

export function PurchaseOrderStatusBadge({
  status,
}: PurchaseOrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant='outline'
      className={`rounded-full px-2.5 text-[11px] font-medium ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}

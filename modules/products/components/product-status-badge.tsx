import { Badge } from '@/components/ui/badge';

import type { ProductStatus } from '../types/product';

type ProductStatusBadgeProps = {
  status: ProductStatus;
};

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  if (status === 'ACTIVE') {
    return (
      <Badge
        variant='outline'
        className='rounded-full border-emerald-200 bg-emerald-50 px-2.5 text-[11px] text-emerald-700'
      >
        Active
      </Badge>
    );
  }

  return (
    <Badge
      variant='outline'
      className='rounded-full border-muted bg-muted/50 px-2.5 text-[11px] text-muted-foreground'
    >
      Inactive
    </Badge>
  );
}

import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  PackageCheck,
} from 'lucide-react';

import { CurrencyDisplay } from '@/components/shared/currency-display';

import { PurchaseOrderStatusBadge } from './purchase-order-status-badge';

type PurchaseOrderSummaryProps = {
  totalOrders: number;
  draftOrders: number;
  openOrders: number;
  receivedOrders: number;
  totalValue: number;
};

export function PurchaseOrderSummary({
  totalOrders,
  draftOrders,
  openOrders,
  receivedOrders,
  totalValue,
}: PurchaseOrderSummaryProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
      <div className='rounded-2xl border border-border/60 bg-background p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-xs font-medium text-muted-foreground'>
              Total orders
            </p>

            <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
              {totalOrders}
            </p>
          </div>

          <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
            <ClipboardList className='size-4 text-muted-foreground' />
          </div>
        </div>
      </div>

      <div className='rounded-2xl border border-border/60 bg-background p-5'>
        <p className='text-xs font-medium text-muted-foreground'>Draft</p>

        <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
          {draftOrders}
        </p>

        <div className='mt-2'>
          <PurchaseOrderStatusBadge status='DRAFT' />
        </div>
      </div>

      <div className='rounded-2xl border border-border/60 bg-background p-5'>
        <p className='text-xs font-medium text-muted-foreground'>Open</p>

        <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
          {openOrders}
        </p>

        <div className='mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground'>
          <Clock3 className='size-3.5' />
          Awaiting completion
        </div>
      </div>

      <div className='rounded-2xl border border-border/60 bg-background p-5'>
        <p className='text-xs font-medium text-muted-foreground'>Received</p>

        <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
          {receivedOrders}
        </p>

        <div className='mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400'>
          <CheckCircle2 className='size-3.5' />
          Completed
        </div>
      </div>

      <div className='rounded-2xl border border-border/60 bg-background p-5'>
        <p className='text-xs font-medium text-muted-foreground'>
          Purchase value
        </p>

        <p className='mt-2 truncate text-xl font-semibold tracking-tight'>
          <CurrencyDisplay value={totalValue} maximumFractionDigits={0} />
        </p>

        <div className='mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground'>
          <PackageCheck className='size-3.5' />
          Total order value
        </div>
      </div>
    </div>
  );
}

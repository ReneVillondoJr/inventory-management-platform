import { CheckCircle2, Package, ShoppingCart, WalletCards } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/shared/currency-display';

type SalesOrderSummaryProps = {
  totalOrders: number;
  openOrders: number;
  completedOrders: number;
  totalValue: number;
};

export function SalesOrderSummary({
  totalOrders,
  openOrders,
  completedOrders,
  totalValue,
}: SalesOrderSummaryProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <Card className='border-border/60 shadow-none'>
        <CardContent className='p-5'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-xs font-medium text-muted-foreground'>
                Total orders
              </p>

              <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                {totalOrders}
              </p>
            </div>

            <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted'>
              <ShoppingCart className='size-4 text-muted-foreground' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='border-border/60 shadow-none'>
        <CardContent className='p-5'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-xs font-medium text-muted-foreground'>
                Open orders
              </p>

              <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                {openOrders}
              </p>

              <p className='mt-1 text-[11px] text-muted-foreground'>
                Awaiting completion
              </p>
            </div>

            <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950'>
              <Package className='size-4 text-amber-600 dark:text-amber-300' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='border-border/60 shadow-none'>
        <CardContent className='p-5'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-xs font-medium text-muted-foreground'>
                Completed
              </p>

              <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                {completedOrders}
              </p>

              <div className='mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400'>
                <CheckCircle2 className='size-3.5' />
                Completed orders
              </div>
            </div>

            <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950'>
              <CheckCircle2 className='size-4 text-emerald-600 dark:text-emerald-300' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='border-border/60 shadow-none'>
        <CardContent className='p-5'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-xs font-medium text-muted-foreground'>
                Order value
              </p>

              <p className='mt-2 truncate text-xl font-semibold tracking-tight'>
                <CurrencyDisplay value={totalValue} maximumFractionDigits={0} />
              </p>

              <p className='mt-1 text-[11px] text-muted-foreground'>
                Total sales value
              </p>
            </div>

            <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950'>
              <WalletCards className='size-4 text-blue-600 dark:text-blue-300' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

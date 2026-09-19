'use client';

import { AlertTriangle, Package } from 'lucide-react';

import { CurrencyDisplay } from '@/components/shared/currency-display';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';

import { Card, CardContent } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useMemo } from 'react';

import { warehouseService } from '../services/warehouse-service';

type WarehouseStockProps = {
  warehouseId: string;
};

export function WarehouseStock({ warehouseId }: WarehouseStockProps) {
  const stock = useMemo(
    () => warehouseService.getStock(warehouseId),
    [warehouseId],
  );

  const { items, summary } = stock;

  return (
    <div className='space-y-4'>
      {/* Summary */}
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-4'>
            <p className='text-xs font-medium text-muted-foreground'>
              Products
            </p>

            <p className='mt-1 text-xl font-semibold tracking-tight tabular-nums'>
              {summary.totalProducts}
            </p>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-4'>
            <p className='text-xs font-medium text-muted-foreground'>
              Total units
            </p>

            <p className='mt-1 text-xl font-semibold tracking-tight tabular-nums'>
              {summary.totalUnits.toLocaleString('en-PH')}
            </p>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-4'>
            <p className='text-xs font-medium text-muted-foreground'>
              Low stock
            </p>

            <div className='mt-1 flex items-center gap-2'>
              <p className='text-xl font-semibold tracking-tight tabular-nums'>
                {summary.lowStockItems}
              </p>

              {summary.lowStockItems > 0 && (
                <AlertTriangle className='size-4 text-amber-600' />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-4'>
            <p className='text-xs font-medium text-muted-foreground'>
              Inventory value
            </p>

            <p className='mt-1 truncate text-lg font-semibold tracking-tight'>
              <CurrencyDisplay
                value={summary.inventoryValue}
                maximumFractionDigits={0}
              />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock table */}
      {items.length === 0 ?
        <div className='rounded-xl border border-border/70 bg-card'>
          <EmptyState
            icon={<Package className='size-5' />}
            title='No stock records'
            description='This warehouse does not have any inventory records yet.'
          />
        </div>
      : <div className='overflow-hidden rounded-xl border border-border/70 bg-card'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/30 hover:bg-muted/30'>
                  <TableHead className='min-w-64'>Product</TableHead>

                  <TableHead>Category</TableHead>

                  <TableHead className='text-right'>On hand</TableHead>

                  <TableHead className='text-right'>Reorder</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead className='text-right'>Value</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <div className='min-w-0'>
                        <p className='truncate font-medium'>
                          {item.productName}
                        </p>

                        <p className='mt-0.5 font-mono text-[11px] text-muted-foreground'>
                          {item.sku}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className='text-sm'>{item.categoryName}</p>

                        <p className='text-xs text-muted-foreground'>
                          {item.brandName}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className='text-right font-medium tabular-nums'>
                      {item.quantity.toLocaleString('en-PH')}{' '}
                      <span className='text-xs font-normal text-muted-foreground'>
                        {item.unit}
                      </span>
                    </TableCell>

                    <TableCell className='text-right tabular-nums text-muted-foreground'>
                      {item.reorderLevel.toLocaleString('en-PH')}
                    </TableCell>

                    <TableCell>
                      {item.outOfStock ?
                        <StatusBadge status='CANCELLED' label='Out of stock' />
                      : item.lowStock ?
                        <StatusBadge status='PENDING' label='Low stock' />
                      : <StatusBadge status='ACTIVE' label='In stock' />}
                    </TableCell>

                    <TableCell className='text-right font-medium'>
                      <CurrencyDisplay
                        value={item.inventoryValue}
                        maximumFractionDigits={0}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      }
    </div>
  );
}

'use client';

import Link from 'next/link';

import { ArrowUpRight, ClipboardList } from 'lucide-react';

import { useMemo } from 'react';

import { supplierService } from '../services/supplier-service';

import type { SupplierOrder } from '../types/supplier';

import { CurrencyDisplay } from '@/components/shared/currency-display';
import { DateDisplay } from '@/components/shared/date-display';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type SupplierOrdersProps = {
  supplierId: string;
};

export function SupplierOrders({ supplierId }: SupplierOrdersProps) {
  const orders = useMemo(
    () => supplierService.getOrders(supplierId),
    [supplierId],
  );

  const summary = useMemo(
    () => supplierService.getOrderSummary(supplierId),
    [supplierId],
  );

  return (
    <div className='space-y-4'>
      {/* Summary */}
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <div className='rounded-xl border border-border/60 bg-background p-4'>
          <p className='text-xs text-muted-foreground'>Total orders</p>

          <p className='mt-1 text-xl font-semibold tabular-nums'>
            {summary.totalOrders}
          </p>
        </div>

        <div className='rounded-xl border border-border/60 bg-background p-4'>
          <p className='text-xs text-muted-foreground'>Open orders</p>

          <p className='mt-1 text-xl font-semibold tabular-nums'>
            {summary.openOrders}
          </p>
        </div>

        <div className='rounded-xl border border-border/60 bg-background p-4'>
          <p className='text-xs text-muted-foreground'>Received</p>

          <p className='mt-1 text-xl font-semibold tabular-nums'>
            {summary.receivedOrders}
          </p>
        </div>

        <div className='rounded-xl border border-border/60 bg-background p-4'>
          <p className='text-xs text-muted-foreground'>Purchase value</p>

          <p className='mt-1 truncate text-lg font-semibold'>
            <CurrencyDisplay
              value={summary.totalValue}
              maximumFractionDigits={0}
            />
          </p>
        </div>
      </div>

      {/* Orders */}
      {orders.length === 0 ?
        <div className='rounded-xl border border-border/70 bg-card'>
          <EmptyState
            icon={<ClipboardList className='size-5' />}
            title='No purchase orders'
            description='This supplier does not have any purchase orders yet.'
          />
        </div>
      : <div className='overflow-hidden rounded-xl border border-border/70 bg-card'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/30 hover:bg-muted/30'>
                  <TableHead>Order</TableHead>

                  <TableHead>Warehouse</TableHead>

                  <TableHead>Order date</TableHead>

                  <TableHead>Expected</TableHead>

                  <TableHead className='text-right'>Total</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead className='w-12' />
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order: SupplierOrder) => (
                  <TableRow key={order.id} className='group'>
                    <TableCell>
                      <Link
                        href={`/admin/operations/purchase-orders/${order.id}`}
                        className='font-medium transition-colors hover:text-primary'
                      >
                        {order.number}
                      </Link>

                      <p className='mt-0.5 text-xs text-muted-foreground'>
                        {order.itemCount}{' '}
                        {order.itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className='text-sm'>{order.warehouseName}</p>

                      <p className='font-mono text-[11px] text-muted-foreground'>
                        {order.warehouseCode}
                      </p>
                    </TableCell>

                    <TableCell className='whitespace-nowrap text-sm'>
                      <DateDisplay value={order.orderDate} />
                    </TableCell>

                    <TableCell className='whitespace-nowrap text-sm text-muted-foreground'>
                      <DateDisplay value={order.expectedDate} />
                    </TableCell>

                    <TableCell className='text-right font-medium'>
                      <CurrencyDisplay value={order.total} />
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/admin/operations/purchase-orders/${order.id}`}
                        className='flex size-8 items-center justify-center rounded-md text-muted-foreground opacity-100 transition-colors hover:bg-muted hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100'
                      >
                        <ArrowUpRight className='size-4' />

                        <span className='sr-only'>View purchase order</span>
                      </Link>
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

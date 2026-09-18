'use client';

import Link from 'next/link';

import { ArrowUpRight, ClipboardList } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { PurchaseOrder } from '../types/purchase-order';

import { PurchaseOrderStatusBadge } from './purchase-order-status-badge';

type PurchaseOrderTableProps = {
  orders: PurchaseOrder[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

export function PurchaseOrderTable({ orders }: PurchaseOrderTableProps) {
  if (!orders.length) {
    return (
      <div className='flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border/60'>
        <div className='text-center'>
          <div className='mx-auto flex size-10 items-center justify-center rounded-xl bg-muted'>
            <ClipboardList className='size-4 text-muted-foreground' />
          </div>

          <p className='mt-3 text-sm font-medium'>No purchase orders found</p>

          <p className='mt-1 text-xs text-muted-foreground'>
            Try changing your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto rounded-2xl border border-border/60 bg-background'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/30 hover:bg-muted/30'>
            <TableHead className='px-4'>Order</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Order date</TableHead>
            <TableHead>Expected</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className='group'>
              <TableCell className='px-4'>
                <Link
                  href={`/admin/operations/purchase-orders/${order.id}`}
                  className='font-mono text-sm font-medium transition-colors hover:text-primary'
                >
                  {order.number}
                </Link>

                <p className='mt-0.5 text-xs text-muted-foreground'>
                  {order.items.length}{' '}
                  {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </TableCell>

              <TableCell>
                <span className='text-sm font-medium'>
                  {order.supplierName}
                </span>
              </TableCell>

              <TableCell>
                <div>
                  <p className='text-sm'>{order.warehouseName}</p>

                  <p className='text-xs text-muted-foreground'>
                    {order.warehouseCode}
                  </p>
                </div>
              </TableCell>

              <TableCell className='text-sm'>
                {formatDate(order.orderDate)}
              </TableCell>

              <TableCell className='text-sm'>
                {formatDate(order.expectedDate)}
              </TableCell>

              <TableCell className='font-medium'>
                {formatCurrency(order.total)}
              </TableCell>

              <TableCell>
                <PurchaseOrderStatusBadge status={order.status} />
              </TableCell>

              <TableCell>
                <Link
                  href={`/admin/operations/purchase-orders/${order.id}`}
                  aria-label={`View ${order.number}`}
                  className='flex size-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100'
                >
                  <ArrowUpRight className='size-4' />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

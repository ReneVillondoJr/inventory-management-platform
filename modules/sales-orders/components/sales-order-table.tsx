'use client';

import Link from 'next/link';

import { MoreHorizontal, Pencil, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { SalesOrderStatusBadge } from './sales-order-status-badge';

import type { SalesOrder } from '../types/sales-order';

type SalesOrderTableProps = {
  orders: SalesOrder[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(value: number) {
  return `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
  })}`;
}

export function SalesOrderTable({ orders }: SalesOrderTableProps) {
  return (
    <div className='overflow-hidden rounded-xl border border-border/70 bg-card'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/30'>
              <TableHead className='min-w-36'>Order</TableHead>
              <TableHead className='min-w-48'>Customer</TableHead>
              <TableHead className='min-w-44'>Warehouse</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-12' />
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className='group'>
                <TableCell>
                  <Link
                    href={`/admin/operations/sales-orders/${order.id}`}
                    className='font-medium transition-colors hover:text-primary'
                  >
                    {order.number}
                  </Link>
                </TableCell>

                <TableCell>
                  <div className='min-w-0'>
                    <p className='truncate font-medium'>{order.customerName}</p>
                    <p className='text-xs text-muted-foreground'>
                      {order.items.length}{' '}
                      {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className='min-w-0'>
                    <p className='truncate'>{order.warehouseName}</p>
                    <p className='text-xs text-muted-foreground'>
                      {order.warehouseCode}
                    </p>
                  </div>
                </TableCell>

                <TableCell className='whitespace-nowrap text-muted-foreground'>
                  {formatDate(order.orderDate)}
                </TableCell>

                <TableCell className='text-right font-medium'>
                  {formatCurrency(order.total)}
                </TableCell>

                <TableCell>
                  <SalesOrderStatusBadge status={order.status} />
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='size-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
                        />
                      }
                    >
                      <MoreHorizontal className='size-4' />
                      <span className='sr-only'>Open actions</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align='end' className='w-40'>
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/admin/operations/sales-orders/${order.id}`}
                          >
                            <ShoppingCart className='mr-2 size-4' />
                            View order
                          </Link>
                        }
                      />

                      {order.status !== 'COMPLETED' &&
                        order.status !== 'CANCELLED' && (
                          <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              render={
                                <Link
                                  href={`/admin/operations/sales-orders/${order.id}/edit`}
                                >
                                  <Pencil className='mr-2 size-4' />
                                  Edit order
                                </Link>
                              }
                            />
                          </>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className='h-32 text-center'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <ShoppingCart className='size-5 text-muted-foreground/50' />

                    <div>
                      <p className='font-medium'>No sales orders found</p>

                      <p className='text-sm text-muted-foreground'>
                        Try adjusting your filters or create a new order.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

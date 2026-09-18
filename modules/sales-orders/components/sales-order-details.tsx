'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  Pencil,
  UserRound,
} from 'lucide-react';

import { Button } from '@/components/shared/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

import { seedData } from '@/data/seed/inventory-seed';

import { salesOrderService } from '../services/sales-order-service';
import type { SalesOrderStatus } from '../types/sales-order';

import { SalesOrderItems } from './sales-order-items';
import { SalesOrderStatusBadge } from './sales-order-status-badge';

type SalesOrderDetailsProps = {
  id: string;
};

const STATUS_OPTIONS: {
  value: SalesOrderStatus;
  label: string;
}[] = [
  {
    value: 'DRAFT',
    label: 'Draft',
  },
  {
    value: 'CONFIRMED',
    label: 'Confirmed',
  },
  {
    value: 'PROCESSING',
    label: 'Processing',
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(value: number) {
  return `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
  })}`;
}

export function SalesOrderDetails({ id }: SalesOrderDetailsProps) {
  const [order, setOrder] = useState(() => salesOrderService.getById(id));

  const [error, setError] = useState('');

  if (!order) {
    return (
      <div className='flex min-h-64 items-center justify-center rounded-xl border border-dashed'>
        <div className='text-center'>
          <p className='font-medium'>Sales order not found</p>

          <p className='mt-1 text-sm text-muted-foreground'>
            The sales order may have been removed or does not exist.
          </p>

          <Button
            className='mt-4'
            nativeButton={false}
            render={
              <Link href='/admin/operations/sales-orders'>
                Back to sales orders
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const products = seedData.products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    sellingPrice: product.sellingPrice,
  }));

  const canEdit = order.status !== 'COMPLETED' && order.status !== 'CANCELLED';

  const handleStatusChange = async (value: string | null) => {
    if (!value) {
      return;
    }

    setError('');

    try {
      const updated = salesOrderService.updateStatus(
        order.id,
        value as SalesOrderStatus,
      );

      setOrder(updated);
    } catch (statusError) {
      setError(
        statusError instanceof Error ?
          statusError.message
        : 'Unable to update status.',
      );
    }
  };

  const handleCancel = () => {
    setError('');

    try {
      const updated = salesOrderService.cancel(order.id);

      setOrder(updated);
    } catch (cancelError) {
      setError(
        cancelError instanceof Error ?
          cancelError.message
        : 'Unable to cancel order.',
      );
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div className='flex items-start gap-3'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            nativeButton={false}
            render={<Link href='/admin/operations/sales-orders' />}
          >
            <ArrowLeft className='size-4' />
            <span className='sr-only'>Back to sales orders</span>
          </Button>

          <div>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>
                {order.number}
              </h1>

              <SalesOrderStatusBadge status={order.status} />
            </div>

            <p className='mt-1 text-sm text-muted-foreground'>
              Created by {order.createdByName} on {formatDate(order.orderDate)}
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2 lg:justify-end'>
          {canEdit && (
            <Button
              variant='outline'
              nativeButton={false}
              render={
                <Link href={`/admin/operations/sales-orders/${order.id}/edit`}>
                  <Pencil className='mr-2 size-4' />
                  Edit
                </Link>
              }
            />
          )}

          {canEdit && (
            <Select value={order.status} onValueChange={handleStatusChange}>
              <SelectTrigger className='w-36'>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {canEdit && (
            <Button
              type='button'
              variant='outline'
              className='text-destructive hover:text-destructive'
              onClick={handleCancel}
            >
              Cancel order
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className='rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive'>
          {error}
        </div>
      )}

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <Card>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-lg bg-muted'>
                <UserRound className='size-5 text-muted-foreground' />
              </div>

              <div className='min-w-0'>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>
                  Customer
                </p>

                <p className='mt-1 truncate font-medium'>
                  {order.customerName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-lg bg-muted'>
                <MapPin className='size-5 text-muted-foreground' />
              </div>

              <div className='min-w-0'>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>
                  Warehouse
                </p>

                <p className='mt-1 truncate font-medium'>
                  {order.warehouseName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-lg bg-muted'>
                <CalendarDays className='size-5 text-muted-foreground' />
              </div>

              <div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>
                  Order date
                </p>

                <p className='mt-1 font-medium'>
                  {formatDate(order.orderDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-lg bg-muted'>
                <Package className='size-5 text-muted-foreground' />
              </div>

              <div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>
                  Items
                </p>

                <p className='mt-1 font-medium'>
                  {order.items.length}{' '}
                  {order.items.length === 1 ? 'product' : 'products'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <div className='space-y-6'>
          <div>
            <div className='mb-3'>
              <h2 className='text-base font-semibold'>Order items</h2>

              <p className='text-sm text-muted-foreground'>
                Products included in this sales order.
              </p>
            </div>

            <SalesOrderItems items={order.items} products={products} readOnly />
          </div>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Notes</CardTitle>
              </CardHeader>

              <CardContent>
                <p className='whitespace-pre-wrap text-sm leading-6 text-muted-foreground'>
                  {order.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className='h-fit'>
          <CardHeader>
            <CardTitle className='text-base'>Order summary</CardTitle>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Products</span>

              <span className='font-medium'>{order.items.length}</span>
            </div>

            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Total quantity</span>

              <span className='font-medium'>
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <div className='border-t pt-4'>
              <div className='flex items-end justify-between gap-4'>
                <span className='text-sm text-muted-foreground'>Total</span>

                <span className='text-xl font-semibold tracking-tight'>
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

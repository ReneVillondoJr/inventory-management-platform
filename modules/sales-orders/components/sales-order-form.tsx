'use client';

import { useMemo, useState, type FormEvent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, Save } from 'lucide-react';

import { seedData } from '@/data/seed/inventory-seed';

import { Button } from '@/components/shared/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';
import { Textarea } from '@/components/ui/textarea';

import { useSalesOrderForm } from '../hooks/use-sales-order-form';
import { salesOrderSchema } from '../schemas/sales-order-schema';
import type { SalesOrder, SalesOrderStatus } from '../types/sales-order';

import { SalesOrderItems } from './sales-order-items';

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

type SalesOrderFormProps = {
  salesOrder?: SalesOrder;
};

export function SalesOrderForm({ salesOrder }: SalesOrderFormProps) {
  const router = useRouter();

  const { values, isSaving, update, save } = useSalesOrderForm({
    salesOrder,
    onSuccess: (order) => {
      router.push(`/admin/operations/sales-orders/${order.id}`);
    },
  });

  const [error, setError] = useState('');

  const customers = useMemo(() => seedData.customers, []);

  const warehouses = useMemo(() => seedData.warehouses, []);

  const products = useMemo(
    () =>
      seedData.products
        .filter((product) => product.status === 'ACTIVE')
        .map((product) => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          sellingPrice: product.sellingPrice,
        })),
    [],
  );

  const totalQuantity = values.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const orderTotal = values.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    const result = salesOrderSchema.safeParse(values);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Please review the form.');

      return;
    }

    try {
      await save();
    } catch (saveError) {
      setError(
        saveError instanceof Error ?
          saveError.message
        : 'Unable to save sales order.',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex min-w-0 items-center gap-3'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-9 shrink-0'
            nativeButton={false}
            render={<Link href='/admin/operations/sales-orders' />}
          >
            <ArrowLeft className='size-4' />

            <span className='sr-only'>Back to sales orders</span>
          </Button>

          <div className='min-w-0'>
            <p className='text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground'>
              {salesOrder ? 'Update order' : 'Create order'}
            </p>

            <h1 className='truncate text-2xl font-semibold tracking-tight sm:text-3xl'>
              {salesOrder ? salesOrder.number : 'New Sales Order'}
            </h1>
          </div>
        </div>

        <Button type='submit' className='shrink-0' disabled={isSaving}>
          <Save className='mr-2 size-4' />

          {isSaving ?
            'Saving...'
          : salesOrder ?
            'Save changes'
          : 'Create sales order'}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className='rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive'>
          {error}
        </div>
      )}

      {/* Main content */}
      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]'>
        <div className='min-w-0 space-y-6'>
          {/* Order details */}
          <Card>
            <CardHeader className='border-b bg-muted/15 px-4 py-3 sm:px-5'>
              <div>
                <CardTitle className='text-sm font-semibold'>
                  Order details
                </CardTitle>

                <p className='mt-0.5 text-xs text-muted-foreground'>
                  Select the customer, warehouse, date, and current order
                  status.
                </p>
              </div>
            </CardHeader>

            <CardContent className='p-4 sm:p-5'>
              <div className='grid gap-4 lg:grid-cols-[minmax(240px,1.45fr)_minmax(180px,1fr)_170px_170px]'>
                {/* Customer */}
                <div className='min-w-0 space-y-2'>
                  <Label htmlFor='customer'>Customer</Label>

                  <Select
                    value={values.customerId}
                    onValueChange={(value) => update('customerId', value ?? '')}
                  >
                    <SelectTrigger id='customer' className='h-9 w-full'>
                      <SelectValue placeholder='Select customer' />
                    </SelectTrigger>

                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Warehouse */}
                <div className='min-w-0 space-y-2'>
                  <Label htmlFor='warehouse'>Warehouse</Label>

                  <Select
                    value={values.warehouseId}
                    onValueChange={(value) =>
                      update('warehouseId', value ?? '')
                    }
                  >
                    <SelectTrigger id='warehouse' className='h-9 w-full'>
                      <SelectValue placeholder='Select warehouse' />
                    </SelectTrigger>

                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Order date */}
                <div className='min-w-0 space-y-2'>
                  <Label htmlFor='orderDate'>Order date</Label>

                  <Input
                    id='orderDate'
                    type='date'
                    value={values.orderDate}
                    onChange={(event) =>
                      update('orderDate', event.target.value)
                    }
                    className='h-9 w-full'
                  />
                </div>

                {/* Status */}
                <div className='min-w-0 space-y-2'>
                  <Label htmlFor='status'>Status</Label>

                  <Select
                    value={values.status}
                    onValueChange={(value) =>
                      update('status', (value ?? 'DRAFT') as SalesOrderStatus)
                    }
                  >
                    <SelectTrigger id='status' className='h-9 w-full'>
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
                </div>

                {/* Notes */}
                <div className='space-y-2 lg:col-span-4'>
                  <Label htmlFor='notes'>Notes</Label>

                  <Textarea
                    id='notes'
                    value={values.notes}
                    onChange={(event) => update('notes', event.target.value)}
                    placeholder='Add order notes or fulfillment instructions...'
                    className='min-h-20 resize-none'
                  />

                  <p className='text-xs text-muted-foreground'>
                    Optional internal notes for fulfillment and sales staff.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order items */}
          <div className='space-y-3'>
            <div>
              <h2 className='text-base font-semibold'>Order items</h2>

              <p className='text-sm text-muted-foreground'>
                Add the products, quantities, and selling prices for this order.
              </p>
            </div>

            <SalesOrderItems
              items={values.items}
              products={products}
              onChange={(items) => update('items', items)}
            />
          </div>
        </div>

        {/* Summary */}
        <Card className='h-fit xl:sticky xl:top-6'>
          <CardHeader className='border-b bg-muted/15 px-4 py-3 sm:px-5'>
            <div>
              <CardTitle className='text-sm font-semibold'>
                Order summary
              </CardTitle>

              <p className='mt-0.5 text-xs text-muted-foreground'>
                Review the current order before saving.
              </p>
            </div>
          </CardHeader>

          <CardContent className='space-y-4 p-4 sm:p-5'>
            <div className='flex items-center justify-between gap-4 text-sm'>
              <span className='text-muted-foreground'>Products</span>

              <span className='font-medium tabular-nums'>
                {values.items.length}
              </span>
            </div>

            <div className='flex items-center justify-between gap-4 text-sm'>
              <span className='text-muted-foreground'>Total quantity</span>

              <span className='font-medium tabular-nums'>{totalQuantity}</span>
            </div>

            <div className='flex items-center justify-between gap-4 text-sm'>
              <span className='text-muted-foreground'>Status</span>

              <span className='font-medium'>
                {STATUS_OPTIONS.find((status) => status.value === values.status)
                  ?.label ?? 'Draft'}
              </span>
            </div>

            <div className='border-t pt-4'>
              <div className='flex items-end justify-between gap-4'>
                <span className='text-sm text-muted-foreground'>
                  Order total
                </span>

                <span className='text-xl font-semibold tracking-tight tabular-nums'>
                  ₱
                  {orderTotal.toLocaleString('en-PH', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <p className='pt-1 text-xs leading-5 text-muted-foreground'>
              Prices are based on the selling price configured for each product
              and can be adjusted per order.
            </p>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

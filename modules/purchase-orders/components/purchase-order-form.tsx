'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CheckCircle2 } from 'lucide-react';

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

import { purchaseOrderSchema } from '../schemas/purchase-order-schema';

import { usePurchaseOrderForm } from '../hooks/use-purchase-order-form';

import type {
  PurchaseOrder,
  PurchaseOrderFormValues,
  PurchaseOrderLineItem,
  PurchaseOrderStatus,
} from '../types/purchase-order';

import { PurchaseOrderItems } from './purchase-order-items';

type PurchaseOrderFormProps = {
  purchaseOrder?: PurchaseOrder | null;
};

export function PurchaseOrderForm({ purchaseOrder }: PurchaseOrderFormProps) {
  const router = useRouter();

  const suppliers = seedData.suppliers;
  const warehouses = seedData.warehouses;
  const products = seedData.products;

  const DEFAULT_ORDER_DATE = new Date().toISOString().slice(0, 10);

  const DEFAULT_EXPECTED_DATE = new Date(
    new Date(DEFAULT_ORDER_DATE).getTime() + 7 * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .slice(0, 10);

  const [values, setValues] = useState<PurchaseOrderFormValues>({
    supplierId: purchaseOrder?.supplierId ?? suppliers[0]?.id ?? '',
    warehouseId: purchaseOrder?.warehouseId ?? warehouses[0]?.id ?? '',
    orderDate: purchaseOrder?.orderDate ?? DEFAULT_ORDER_DATE,
    expectedDate: purchaseOrder?.expectedDate ?? DEFAULT_EXPECTED_DATE,
    status: purchaseOrder?.status ?? 'DRAFT',
    notes: purchaseOrder?.notes ?? '',
    items: purchaseOrder?.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitCost: item.unitCost,
    })) ?? [
      {
        productId: products[0]?.id ?? '',
        quantity: 1,
        unitCost: products[0]?.costPrice ?? 0,
      },
    ],
  });

  const { error, success, isSubmitting, save } = usePurchaseOrderForm({
    purchaseOrder,

    onSuccess: (savedOrder) => {
      window.setTimeout(() => {
        router.push(`/admin/operations/purchase-orders/${savedOrder.id}`);

        router.refresh();
      }, 400);
    },
  });

  const update = <K extends keyof PurchaseOrderFormValues>(
    field: K,
    value: PurchaseOrderFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleItemsChange = (items: PurchaseOrderLineItem[]) => {
    update(
      'items',
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
      })),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = purchaseOrderSchema.safeParse(values);

    if (!parsed.success) {
      window.alert(parsed.error.issues[0]?.message ?? 'Please check the form.');

      return;
    }

    await save(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='text-base'>Order information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <div>
              <Label
                htmlFor='purchase-supplier'
                className='text-xs font-medium'
              >
                Supplier
              </Label>

              <Select
                value={values.supplierId}
                onValueChange={(value) => {
                  if (value !== null) update('supplierId', value);
                }}
              >
                <SelectTrigger
                  id='purchase-supplier'
                  className='mt-1.5 h-10 w-full'
                >
                  <SelectValue placeholder='Select supplier' />
                </SelectTrigger>

                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor='purchase-warehouse'
                className='text-xs font-medium'
              >
                Warehouse
              </Label>

              <Select
                value={values.warehouseId}
                onValueChange={(value) => {
                  if (value !== null) update('warehouseId', value);
                }}
              >
                <SelectTrigger
                  id='purchase-warehouse'
                  className='mt-1.5 h-10 w-full'
                >
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

            <div>
              <Label
                htmlFor='purchase-order-date'
                className='text-xs font-medium'
              >
                Order date
              </Label>

              <Input
                id='purchase-order-date'
                type='date'
                value={values.orderDate}
                onChange={(event) => update('orderDate', event.target.value)}
                className='mt-1.5'
              />
            </div>

            <div>
              <Label
                htmlFor='purchase-expected-date'
                className='text-xs font-medium'
              >
                Expected date
              </Label>

              <Input
                id='purchase-expected-date'
                type='date'
                value={values.expectedDate}
                onChange={(event) => update('expectedDate', event.target.value)}
                className='mt-1.5'
              />
            </div>
          </div>

          <div className='mt-5 grid gap-5 md:grid-cols-2'>
            <div>
              <Label htmlFor='purchase-status' className='text-xs font-medium'>
                Status
              </Label>

              <Select
                value={values.status}
                onValueChange={(value) => {
                  if (value !== null) {
                    update('status', value as PurchaseOrderStatus);
                  }
                }}
                disabled={
                  purchaseOrder?.status === 'RECEIVED' ||
                  purchaseOrder?.status === 'CANCELLED'
                }
              >
                <SelectTrigger
                  id='purchase-status'
                  className='mt-1.5 h-10 w-full'
                >
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value='DRAFT'>Draft</SelectItem>
                  <SelectItem value='APPROVED'>Approved</SelectItem>
                  <SelectItem value='PARTIALLY_RECEIVED'>
                    Partially received
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='purchase-notes' className='text-xs font-medium'>
                Notes
              </Label>

              <Input
                id='purchase-notes'
                value={values.notes}
                onChange={(event) => update('notes', event.target.value)}
                placeholder='Optional order notes'
                className='mt-1.5'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='border-border/60 shadow-none'>
        <CardContent className='p-5'>
          <PurchaseOrderItems
            items={values.items}
            products={products}
            onChange={handleItemsChange}
          />
        </CardContent>
      </Card>

      {error && (
        <p
          role='alert'
          className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role='status'
          className='flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700'
        >
          <CheckCircle2 className='size-4' />
          {success}
        </p>
      )}

      <div className='flex justify-end gap-2 border-t border-border/60 pt-5'>
        <Button type='button' variant='outline' onClick={() => router.back()}>
          Cancel
        </Button>

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ?
            'Saving...'
          : purchaseOrder ?
            'Save changes'
          : 'Create purchase order'}
        </Button>
      </div>
    </form>
  );
}

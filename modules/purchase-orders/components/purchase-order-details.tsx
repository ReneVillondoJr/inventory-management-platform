'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, Edit, PackageCheck, XCircle } from 'lucide-react';

import { Button } from '@/components/shared/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { purchaseOrderService } from '../services/purchase-order-service';

import type { PurchaseOrderLineItem } from '../types/purchase-order';

import { PurchaseOrderItems } from './purchase-order-items';
import { PurchaseOrderStatusBadge } from './purchase-order-status-badge';
import { ReceivePurchaseOrder } from './receive-purchase-order';

type PurchaseOrderDetailsProps = {
  id: string;
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

export function PurchaseOrderDetails({ id }: PurchaseOrderDetailsProps) {
  const router = useRouter();

  const order = purchaseOrderService.getById(id);

  if (!order) {
    return (
      <div className='space-y-5'>
        <Button variant='ghost' onClick={() => router.back()}>
          <ArrowLeft className='size-4' />
          Back
        </Button>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='flex min-h-56 items-center justify-center'>
            <div className='text-center'>
              <p className='text-sm font-medium'>Purchase order not found</p>

              <p className='mt-1 text-xs text-muted-foreground'>
                The requested order could not be found.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const receipts = purchaseOrderService.getReceipts(id);

  const hasOutstandingItems = order.items.some(
    (item) => item.outstandingQuantity > 0,
  );

  const totalReceived = order.items.reduce(
    (total, item) => total + item.receivedQuantity,
    0,
  );

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex min-w-0 items-start gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.back()}
            aria-label='Back'
          >
            <ArrowLeft className='size-4' />
          </Button>

          <div className='min-w-0'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
              Purchase Order
            </p>

            <div className='mt-1 flex flex-wrap items-center gap-2'>
              <h1 className='font-mono text-2xl font-semibold tracking-tight sm:text-3xl'>
                {order.number}
              </h1>

              <PurchaseOrderStatusBadge status={order.status} />
            </div>

            <p className='mt-1 text-sm text-muted-foreground'>
              {order.supplierName} · {order.warehouseName}
            </p>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          {hasOutstandingItems && order.status !== 'CANCELLED' && (
            <Button variant='outline' render={<Link href='#receive' />}>
              <PackageCheck className='size-4' />
              Receive stock
            </Button>
          )}

          {order.status !== 'RECEIVED' && order.status !== 'CANCELLED' && (
            <Button
              render={
                <Link
                  href={`/admin/operations/purchase-orders/${order.id}/edit`}
                />
              }
            >
              <Edit className='size-4' />
              Edit order
            </Button>
          )}
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <p className='text-xs text-muted-foreground'>Order total</p>

            <p className='mt-2 text-xl font-semibold'>
              {formatCurrency(order.total)}
            </p>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <p className='text-xs text-muted-foreground'>Items</p>

            <p className='mt-2 text-xl font-semibold'>{order.items.length}</p>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <p className='text-xs text-muted-foreground'>Units received</p>

            <p className='mt-2 text-xl font-semibold'>
              {totalReceived.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <p className='text-xs text-muted-foreground'>Expected</p>

            <p className='mt-2 text-xl font-semibold'>
              {formatDate(order.expectedDate)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <Card className='border-border/60 shadow-none'>
          <CardHeader>
            <CardTitle className='text-base'>Order items</CardTitle>

            <p className='text-xs text-muted-foreground'>
              Products and receiving progress.
            </p>
          </CardHeader>

          <CardContent>
            <PurchaseOrderItems
              items={order.items as PurchaseOrderLineItem[]}
              products={order.items.map((item) => ({
                id: item.productId,
                name: item.productName,
                sku: item.sku,
                costPrice: item.unitCost,
              }))}
              readOnly
            />
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <Card className='border-border/60 shadow-none'>
            <CardHeader>
              <CardTitle className='text-base'>Order information</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div>
                <p className='text-xs text-muted-foreground'>Supplier</p>

                <p className='mt-1 text-sm font-medium'>{order.supplierName}</p>
              </div>

              <div>
                <p className='text-xs text-muted-foreground'>Warehouse</p>

                <p className='mt-1 text-sm font-medium'>
                  {order.warehouseName}
                </p>

                <p className='text-xs text-muted-foreground'>
                  {order.warehouseCode}
                </p>
              </div>

              <div>
                <p className='text-xs text-muted-foreground'>Order date</p>

                <p className='mt-1 text-sm font-medium'>
                  {formatDate(order.orderDate)}
                </p>
              </div>

              <div>
                <p className='text-xs text-muted-foreground'>Created by</p>

                <p className='mt-1 text-sm font-medium'>
                  {order.createdByName}
                </p>
              </div>

              {order.notes && (
                <div>
                  <p className='text-xs text-muted-foreground'>Notes</p>

                  <p className='mt-1 text-sm leading-6'>{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {order.status !== 'RECEIVED' && order.status !== 'CANCELLED' && (
            <Card className='border-red-200/70 shadow-none'>
              <CardHeader>
                <CardTitle className='text-base'>Order controls</CardTitle>
              </CardHeader>

              <CardContent>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={() => {
                    const confirmed = window.confirm(`Cancel ${order.number}?`);

                    if (!confirmed) {
                      return;
                    }

                    try {
                      purchaseOrderService.cancel(order.id);

                      router.refresh();
                    } catch (error) {
                      window.alert(
                        error instanceof Error ?
                          error.message
                        : 'Unable to cancel order.',
                      );
                    }
                  }}
                >
                  <XCircle className='size-4' />
                  Cancel order
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {receipts.length > 0 && (
        <Card className='border-border/60 shadow-none'>
          <CardHeader>
            <CardTitle className='text-base'>Goods receipts</CardTitle>

            <p className='text-xs text-muted-foreground'>
              Recorded receipts against this purchase order.
            </p>
          </CardHeader>

          <CardContent>
            <div className='divide-y divide-border/60'>
              {receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className='flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between'
                >
                  <div>
                    <p className='font-mono text-sm font-semibold'>
                      {receipt.number}
                    </p>

                    <p className='mt-1 text-xs text-muted-foreground'>
                      Received {formatDate(receipt.receivedDate)} by{' '}
                      {receipt.receivedByName}
                    </p>
                  </div>

                  <div className='text-left sm:text-right'>
                    <p className='text-sm font-medium'>
                      {receipt.items.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      )}{' '}
                      units
                    </p>

                    <p className='text-xs text-muted-foreground'>Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {hasOutstandingItems && order.status !== 'CANCELLED' && (
        <div id='receive'>
          <ReceivePurchaseOrder
            purchaseOrder={order}
            onSuccess={() => {
              router.refresh();
            }}
          />
        </div>
      )}
    </div>
  );
}

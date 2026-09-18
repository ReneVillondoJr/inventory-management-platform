'use client';

import { useMemo, useState } from 'react';

import { CheckCircle2, PackageCheck } from 'lucide-react';

import { Button } from '@/components/shared/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { receivePurchaseOrderSchema } from '../schemas/purchase-order-schema';

import { purchaseOrderService } from '../services/purchase-order-service';

import type { PurchaseOrder } from '../types/purchase-order';

type ReceivePurchaseOrderProps = {
  purchaseOrder: PurchaseOrder;
  onSuccess?: () => void;
};

export function ReceivePurchaseOrder({
  purchaseOrder,
  onSuccess,
}: ReceivePurchaseOrderProps) {
  const outstandingItems = purchaseOrder.items.filter(
    (item) => item.outstandingQuantity > 0,
  );

  const initialQuantities = useMemo(
    () =>
      Object.fromEntries(
        outstandingItems.map((item) => [
          item.id,
          String(item.outstandingQuantity),
        ]),
      ),
    [purchaseOrder.id],
  );

  const [quantities, setQuantities] =
    useState<Record<string, string>>(initialQuantities);

  const [receivedDate, setReceivedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    const parsed = receivePurchaseOrderSchema.safeParse({
      items: outstandingItems.map((item) => ({
        purchaseOrderItemId: item.id,
        quantity: Number(quantities[item.id] ?? 0),
      })),
      receivedDate,
      notes,
    });

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? 'Please check the receiving form.',
      );
      return;
    }

    const hasQuantity = parsed.data.items.some((item) => item.quantity > 0);

    if (!hasQuantity) {
      setError('Enter a quantity for at least one item.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = purchaseOrderService.receive({
        purchaseOrderId: purchaseOrder.id,
        items: parsed.data.items,
        receivedById: 'user_daniel',
        receivedDate: parsed.data.receivedDate,
        notes: parsed.data.notes,
      });

      setSuccess(
        `Goods receipt ${result.receipt.number} completed successfully.`,
      );

      onSuccess?.();
    } catch (error) {
      setError(
        error instanceof Error ?
          error.message
        : 'Unable to receive purchase order.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!outstandingItems.length) {
    return (
      <Card className='border-border/60 shadow-none'>
        <CardContent className='flex items-center gap-3 p-5'>
          <div className='flex size-9 items-center justify-center rounded-xl bg-emerald-50'>
            <CheckCircle2 className='size-4 text-emerald-600' />
          </div>

          <div>
            <p className='text-sm font-medium'>Purchase order fully received</p>

            <p className='mt-0.5 text-xs text-muted-foreground'>
              All ordered quantities have been received.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='border-border/60 shadow-none'>
      <CardHeader>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <CardTitle className='text-base'>Receive purchase order</CardTitle>

            <p className='mt-1 text-xs text-muted-foreground'>
              Record the quantities physically received into{' '}
              {purchaseOrder.warehouseName}.
            </p>
          </div>

          <PackageCheck className='size-5 text-muted-foreground' />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-3'>
            {outstandingItems.map((item) => (
              <div
                key={item.id}
                className='grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-[minmax(0,1fr)_140px]'
              >
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>
                    {item.productName}
                  </p>

                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    {item.sku}
                  </p>

                  <p className='mt-2 text-xs text-muted-foreground'>
                    Outstanding:{' '}
                    <span className='font-medium text-foreground'>
                      {item.outstandingQuantity.toLocaleString()}
                    </span>
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor={`receive-${item.id}`}
                    className='text-xs font-medium'
                  >
                    Receive quantity
                  </Label>

                  <Input
                    id={`receive-${item.id}`}
                    type='number'
                    min='0'
                    max={item.outstandingQuantity}
                    step='1'
                    value={quantities[item.id] ?? '0'}
                    onChange={(event) =>
                      setQuantities((current) => ({
                        ...current,
                        [item.id]: event.target.value,
                      }))
                    }
                    className='mt-1.5'
                  />
                </div>
              </div>
            ))}
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <Label htmlFor='received-date' className='text-xs font-medium'>
                Received date
              </Label>

              <Input
                id='received-date'
                type='date'
                value={receivedDate}
                onChange={(event) => setReceivedDate(event.target.value)}
                className='mt-1.5'
              />
            </div>

            <div>
              <Label htmlFor='receipt-notes' className='text-xs font-medium'>
                Notes
              </Label>

              <Input
                id='receipt-notes'
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder='Optional receiving notes'
                className='mt-1.5'
              />
            </div>
          </div>

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

          <div className='flex justify-end'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Receiving stock...' : 'Complete receipt'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

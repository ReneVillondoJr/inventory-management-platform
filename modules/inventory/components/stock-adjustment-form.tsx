'use client';

import { useState } from 'react';

import { CheckCircle2, Minus, Plus } from 'lucide-react';

import { Button } from '@/components/shared/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

import { inventoryService } from '../services/inventory-service';
import { useStockAdjustment } from '../hooks/use-stock-adjustment';
import { stockAdjustmentSchema } from '../schemas/stock-adjustment-schema';

type StockAdjustmentFormProps = {
  onSuccess?: () => void;
};

export function StockAdjustmentForm({ onSuccess }: StockAdjustmentFormProps) {
  const { error, success, isSubmitting, submitAdjustment } =
    useStockAdjustment();

  const inventory = inventoryService.getInventoryRecords();

  const products = Array.from(
    new Map(
      inventory.map((item) => [
        item.productId,
        {
          id: item.productId,
          name: item.productName,
          sku: item.sku,
        },
      ]),
    ).values(),
  );

  const warehouses = Array.from(
    new Map(
      inventory.map((item) => [
        item.warehouseId,
        {
          id: item.warehouseId,
          name: item.warehouseName,
        },
      ]),
    ).values(),
  );

  const [productId, setProductId] = useState(products[0]?.id ?? '');

  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id ?? '');

  const [type, setType] = useState<'INCREASE' | 'DECREASE'>('INCREASE');

  const [quantity, setQuantity] = useState('1');

  const [reason, setReason] = useState<
    'CYCLE_COUNT_VARIANCE' | 'DAMAGED' | 'LOST' | 'FOUND' | 'OTHER'
  >('CYCLE_COUNT_VARIANCE');

  const [notes, setNotes] = useState('');

  const selectedInventory = inventory.find(
    (item) => item.productId === productId && item.warehouseId === warehouseId,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = stockAdjustmentSchema.safeParse({
      productId,
      warehouseId,
      type,
      quantity: Number(quantity),
      reason,
      notes,
    });

    if (!parsed.success) {
      return;
    }

    const result = await submitAdjustment({
      ...parsed.data,
      performedById: 'user_maria',
    });

    if (result) {
      onSuccess?.();
    }
  };

  return (
    <Card className='border-border/60 shadow-none'>
      <CardHeader>
        <CardTitle className='text-base'>Stock adjustment</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <Label
                htmlFor='adjustment-product'
                className='text-xs font-medium'
              >
                Product
              </Label>

              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger
                  id='adjustment-product'
                  className='mt-1.5 h-10 w-full'
                >
                  <SelectValue placeholder='Select product' />
                </SelectTrigger>

                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} — {product.sku}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor='adjustment-warehouse'
                className='text-xs font-medium'
              >
                Warehouse
              </Label>

              <Select value={warehouseId} onValueChange={setWarehouseId}>
                <SelectTrigger
                  id='adjustment-warehouse'
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
          </div>

          {selectedInventory && (
            <div className='rounded-xl border border-border/60 bg-muted/30 p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-muted-foreground'>
                  Current stock
                </span>

                <span className='text-sm font-semibold'>
                  {selectedInventory.quantity.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <span className='text-xs font-medium'>Adjustment</span>

              <div className='mt-1.5 grid grid-cols-2 gap-2'>
                <button
                  type='button'
                  onClick={() => setType('INCREASE')}
                  className={`flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors ${
                    type === 'INCREASE' ?
                      'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-border hover:bg-muted'
                  }`}
                >
                  <Plus className='size-4' />
                  Increase
                </button>

                <button
                  type='button'
                  onClick={() => setType('DECREASE')}
                  className={`flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors ${
                    type === 'DECREASE' ?
                      'border-red-300 bg-red-50 text-red-700'
                    : 'border-border hover:bg-muted'
                  }`}
                >
                  <Minus className='size-4' />
                  Decrease
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor='adjustment-quantity'
                className='text-xs font-medium'
              >
                Quantity
              </label>

              <input
                id='adjustment-quantity'
                type='number'
                min='1'
                step='1'
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className='mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm'
              />
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <Label
                htmlFor='adjustment-reason'
                className='text-xs font-medium'
              >
                Reason
              </Label>

              <Select
                value={reason}
                onValueChange={(value) => setReason(value as typeof reason)}
              >
                <SelectTrigger
                  id='adjustment-reason'
                  className='mt-1.5 h-10 w-full'
                >
                  <SelectValue placeholder='Select reason' />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value='CYCLE_COUNT_VARIANCE'>
                    Cycle count variance
                  </SelectItem>
                  <SelectItem value='DAMAGED'>Damaged</SelectItem>
                  <SelectItem value='LOST'>Lost</SelectItem>
                  <SelectItem value='FOUND'>Found</SelectItem>
                  <SelectItem value='OTHER'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor='adjustment-notes' className='text-xs font-medium'>
                Notes
              </label>

              <input
                id='adjustment-notes'
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder='Optional notes'
                className='mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm'
              />
            </div>
          </div>

          {error && (
            <p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>
              {error}
            </p>
          )}

          {success && (
            <p className='flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700'>
              <CheckCircle2 className='size-4' />
              {success}
            </p>
          )}

          <Button
            type='submit'
            disabled={isSubmitting || !productId || !warehouseId}
          >
            {isSubmitting ? 'Updating stock...' : 'Apply adjustment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

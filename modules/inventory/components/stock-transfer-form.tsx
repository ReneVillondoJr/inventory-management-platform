'use client';

import { useMemo, useState } from 'react';

import { ArrowRight, CheckCircle2 } from 'lucide-react';

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

import { stockTransferSchema } from '../schemas/stock-transfer-schema';
import { inventoryService } from '../services/inventory-service';
import { useStockTransfer } from '../hooks/use-stock-transfer';

type StockTransferFormProps = {
  onSuccess?: () => void;
};

export function StockTransferForm({ onSuccess }: StockTransferFormProps) {
  const { error, success, isSubmitting, submitTransfer } = useStockTransfer();

  const inventory = inventoryService.getInventoryRecords();

  const products = useMemo(
    () =>
      Array.from(
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
      ),
    [inventory],
  );

  const warehouses = useMemo(
    () =>
      Array.from(
        new Map(
          inventory.map((item) => [
            item.warehouseId,
            {
              id: item.warehouseId,
              name: item.warehouseName,
            },
          ]),
        ).values(),
      ),
    [inventory],
  );

  const [productId, setProductId] = useState(products[0]?.id ?? '');

  const [sourceWarehouseId, setSourceWarehouseId] = useState(
    warehouses[0]?.id ?? '',
  );

  const [destinationWarehouseId, setDestinationWarehouseId] = useState(
    warehouses[1]?.id ?? '',
  );

  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');

  const sourceStock = inventory.find(
    (item) =>
      item.productId === productId && item.warehouseId === sourceWarehouseId,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = stockTransferSchema.safeParse({
      productId,
      sourceWarehouseId,
      destinationWarehouseId,
      quantity: Number(quantity),
      notes,
    });

    if (!parsed.success) {
      return;
    }

    const result = await submitTransfer({
      ...parsed.data,
      performedById: 'user_maria',
    });

    if (result) {
      onSuccess?.();
    }
  };

  function setFromWarehouse(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Card className='border-border/60 shadow-none'>
      <CardHeader>
        <CardTitle className='text-base'>Transfer stock</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <Label htmlFor='transfer-product' className='text-xs font-medium'>
              Product
            </Label>

            <Select
              value={productId}
              onValueChange={(value) => setProductId(value ?? '')}
            >
              <SelectTrigger
                id='transfer-product'
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

          <div className='grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]'>
            <div>
              <Label htmlFor='source-warehouse' className='text-xs font-medium'>
                From
              </Label>

              <Select
                value={sourceWarehouseId}
                onValueChange={(value) => setSourceWarehouseId(value ?? '')}
              >
                <SelectTrigger
                  id='source-warehouse'
                  className='mt-1.5 h-10 w-full'
                >
                  <SelectValue placeholder='Select source warehouse' />
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

            <ArrowRight className='hidden size-4 text-muted-foreground md:block' />

            <div>
              <Label
                htmlFor='destination-warehouse'
                className='text-xs font-medium'
              >
                To
              </Label>

              <Select
                value={destinationWarehouseId}
                onValueChange={(value) =>
                  setDestinationWarehouseId(value ?? '')
                }
              >
                <SelectTrigger
                  id='destination-warehouse'
                  className='mt-1.5 h-10 w-full'
                >
                  <SelectValue placeholder='Select destination warehouse' />
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

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label
                htmlFor='transfer-quantity'
                className='text-xs font-medium'
              >
                Quantity
              </label>

              <input
                id='transfer-quantity'
                type='number'
                min='1'
                step='1'
                max={sourceStock?.availableQuantity ?? undefined}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className='mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm'
              />
            </div>

            <div>
              <label htmlFor='transfer-notes' className='text-xs font-medium'>
                Notes
              </label>

              <input
                id='transfer-notes'
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder='Optional notes'
                className='mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm'
              />
            </div>
          </div>

          {sourceStock && (
            <div className='rounded-xl border border-border/60 bg-muted/30 p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-muted-foreground'>
                  Available at source
                </span>

                <span className='font-semibold'>
                  {sourceStock.availableQuantity.toLocaleString()}
                </span>
              </div>
            </div>
          )}

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
            disabled={
              isSubmitting ||
              !productId ||
              !sourceWarehouseId ||
              !destinationWarehouseId
            }
          >
            {isSubmitting ? 'Transferring stock...' : 'Complete transfer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

'use client';

import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/shared/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

import type { PurchaseOrderLineItem } from '../types/purchase-order';

type ProductOption = {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
};

type PurchaseOrderItemsProps = {
  items: PurchaseOrderLineItem[];
  products: readonly ProductOption[];
  readOnly?: boolean;
  onChange?: (items: PurchaseOrderLineItem[]) => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function PurchaseOrderItems({
  items,
  products,
  readOnly = false,
  onChange,
}: PurchaseOrderItemsProps) {
  const updateItem = (
    index: number,
    values: Partial<PurchaseOrderLineItem>,
  ) => {
    if (readOnly || !onChange) {
      return;
    }

    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ?
          {
            ...item,
            ...values,
          }
        : item,
      ),
    );
  };

  const addItem = () => {
    if (readOnly || !onChange) {
      return;
    }

    const availableProduct = products.find(
      (product) => !items.some((item) => item.productId === product.id),
    );

    if (!availableProduct) {
      return;
    }

    onChange([
      ...items,
      {
        productId: availableProduct.id,
        quantity: 1,
        unitCost: availableProduct.costPrice,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (readOnly || !onChange) {
      return;
    }

    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const subtotal = items.reduce(
    (total, item) => total + item.quantity * item.unitCost,
    0,
  );

  return (
    <div className='space-y-4'>
      {!readOnly && (
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-sm font-semibold'>Order items</h3>

            <p className='mt-0.5 text-xs text-muted-foreground'>
              Add the products and quantities to purchase.
            </p>
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addItem}
            disabled={items.length >= products.length}
          >
            <Plus className='size-4' />
            Add item
          </Button>
        </div>
      )}

      <div className='overflow-hidden rounded-xl border border-border/60'>
        <div className='hidden grid-cols-[minmax(0,1fr)_120px_140px_130px_40px] gap-3 border-b border-border/60 bg-muted/30 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground md:grid'>
          <span>Product</span>
          <span>Quantity</span>
          <span>Unit cost</span>
          <span>Total</span>
          <span />
        </div>

        <div className='divide-y divide-border/60'>
          {items.map((item, index) => {
            const product = products.find(
              (value) => value.id === item.productId,
            );

            const total = item.quantity * item.unitCost;

            return (
              <div
                key={item.id ?? `${item.productId}-${index}`}
                className='grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1fr)_120px_140px_130px_40px] md:items-center'
              >
                <div className='min-w-0'>
                  {readOnly ?
                    <>
                      <p className='truncate text-sm font-medium'>
                        {item.productName ?? product?.name ?? 'Unknown product'}
                      </p>

                      <p className='mt-0.5 text-xs text-muted-foreground'>
                        {item.sku ?? product?.sku ?? 'N/A'}
                      </p>
                    </>
                  : <Select
                      value={item.productId}
                      onValueChange={(value) => {
                        if (value === null) return;

                        const selected = products.find(
                          (product) => product.id === value,
                        );

                        updateItem(index, {
                          productId: value,
                          unitCost: selected?.costPrice ?? item.unitCost,
                        });
                      }}
                    >
                      <SelectTrigger className='h-10 w-full'>
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
                  }
                </div>

                <div>
                  {!readOnly && (
                    <Label
                      htmlFor={`purchase-item-${index}-quantity`}
                      className='mb-1 block text-[10px] font-medium text-muted-foreground md:hidden'
                    >
                      Quantity
                    </Label>
                  )}

                  {readOnly ?
                    <p className='text-sm'>{item.quantity.toLocaleString()}</p>
                  : <Input
                      id={`purchase-item-${index}-quantity`}
                      type='number'
                      min='1'
                      step='1'
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(index, {
                          quantity: Number(event.target.value) || 0,
                        })
                      }
                      className='h-10 w-full'
                    />
                  }
                </div>

                <div>
                  {!readOnly && (
                    <Label
                      htmlFor={`purchase-item-${index}-unit-cost`}
                      className='mb-1 block text-[10px] font-medium text-muted-foreground md:hidden'
                    >
                      Unit cost
                    </Label>
                  )}

                  {readOnly ?
                    <p className='text-sm'>{formatCurrency(item.unitCost)}</p>
                  : <Input
                      id={`purchase-item-${index}-unit-cost`}
                      type='number'
                      min='0'
                      step='0.01'
                      value={item.unitCost}
                      onChange={(event) =>
                        updateItem(index, {
                          unitCost: Number(event.target.value) || 0,
                        })
                      }
                      className='h-10 w-full'
                    />
                  }
                </div>

                <div>
                  {!readOnly && (
                    <Label className='mb-1 block text-[10px] font-medium text-muted-foreground md:hidden'>
                      Total
                    </Label>
                  )}

                  <p className='text-sm font-semibold'>
                    {formatCurrency(total)}
                  </p>

                  {readOnly && typeof item.receivedQuantity === 'number' && (
                    <p className='mt-0.5 text-xs text-muted-foreground'>
                      {item.receivedQuantity.toLocaleString()} received
                    </p>
                  )}
                </div>

                <div className='flex justify-end'>
                  {!readOnly && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon-sm'
                      aria-label='Remove item'
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className='size-4 text-muted-foreground' />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className='flex items-center justify-end border-t border-border/60 bg-muted/20 px-4 py-4'>
          <div className='flex items-center gap-8'>
            <span className='text-xs text-muted-foreground'>Subtotal</span>

            <span className='text-base font-semibold'>
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>
      </div>

      {!items.length && (
        <div className='rounded-xl border border-dashed border-border/60 p-8 text-center'>
          <p className='text-sm font-medium'>No items added</p>

          {!readOnly && (
            <p className='mt-1 text-xs text-muted-foreground'>
              Add a product to create this purchase order.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/shared/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type {
  NormalizedLineItem,
  ProductOption,
  SalesOrderItem,
  SalesOrderLineItem,
} from '@/modules/sales-orders/types/sales-order';

type SalesOrderItemsProps = {
  items: SalesOrderLineItem[] | SalesOrderItem[];
  products: ProductOption[];
  readOnly?: boolean;
  onChange?: (items: SalesOrderLineItem[]) => void;
};

const numberInputClasses =
  'h-9 text-right tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

function formatCurrency(value: number) {
  return `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
  })}`;
}

function normalizeItems(
  items: SalesOrderLineItem[] | SalesOrderItem[],
): NormalizedLineItem[] {
  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.total ?? item.quantity * item.unitPrice,
  }));
}

export function SalesOrderItems({
  items,
  products,
  readOnly = false,
  onChange,
}: SalesOrderItemsProps) {
  const lineItems = normalizeItems(items);

  const updateItem = (index: number, changes: Partial<NormalizedLineItem>) => {
    onChange?.(
      lineItems.map((item, itemIndex) =>
        itemIndex === index ?
          {
            ...item,
            ...changes,
          }
        : item,
      ),
    );
  };

  const addItem = () => {
    const firstProduct = products[0];

    if (!firstProduct) {
      return;
    }

    onChange?.([
      ...lineItems,
      {
        productId: firstProduct.id,
        productName: firstProduct.name,
        sku: firstProduct.sku,
        quantity: 1,
        unitPrice: firstProduct.sellingPrice,
        total: firstProduct.sellingPrice,
      },
    ]);
  };

  const removeItem = (index: number) => {
    onChange?.(lineItems.filter((_, itemIndex) => itemIndex !== index));
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  if (readOnly) {
    return (
      <Card className='overflow-hidden'>
        <CardHeader className='border-b bg-muted/20 px-4 py-3 sm:px-5'>
          <div className='flex items-center justify-between gap-4'>
            <CardTitle className='text-sm font-semibold'>Products</CardTitle>

            <span className='text-xs text-muted-foreground'>
              {lineItems.length} {lineItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/20 hover:bg-muted/20'>
                  <TableHead className='min-w-64'>Product</TableHead>

                  <TableHead className='w-28 text-right'>Qty</TableHead>

                  <TableHead className='w-36 text-right'>Unit price</TableHead>

                  <TableHead className='w-40 text-right'>Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {lineItems.map((item, index) => {
                  const product = products.find(
                    (candidate) => candidate.id === item.productId,
                  );

                  const productName =
                    item.productName ?? product?.name ?? 'Unknown Product';

                  const sku = item.sku ?? product?.sku ?? '—';

                  const itemTotal = item.quantity * item.unitPrice;

                  return (
                    <TableRow key={item.id ?? `${item.productId}-${index}`}>
                      <TableCell>
                        <div className='min-w-0 max-w-[280px]'>
                          <p className='truncate font-medium'>{productName}</p>

                          <p className='mt-0.5 text-xs text-muted-foreground'>
                            {sku}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className='text-right tabular-nums'>
                        {item.quantity}
                      </TableCell>

                      <TableCell className='text-right tabular-nums'>
                        {formatCurrency(item.unitPrice)}
                      </TableCell>

                      <TableCell className='text-right font-medium tabular-nums'>
                        {formatCurrency(itemTotal)}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {lineItems.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='h-24 text-center text-sm text-muted-foreground'
                    >
                      No products in this order.
                    </TableCell>
                  </TableRow>
                )}

                <TableRow className='border-t bg-muted/10 hover:bg-muted/10'>
                  <TableCell
                    colSpan={3}
                    className='text-right text-sm font-medium'
                  >
                    Subtotal
                  </TableCell>

                  <TableCell className='text-right text-base font-semibold tabular-nums'>
                    {formatCurrency(subtotal)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='border-b bg-muted/20 px-4 py-3 sm:px-5'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <CardTitle className='text-sm font-semibold'>Order items</CardTitle>

            <p className='mt-0.5 text-xs text-muted-foreground'>
              Add products, quantities, and selling prices.
            </p>
          </div>

          <span className='text-xs text-muted-foreground'>
            {lineItems.length} {lineItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/20 hover:bg-muted/20'>
                <TableHead className='min-w-64'>Product</TableHead>

                <TableHead className='w-24 text-right'>Quantity</TableHead>

                <TableHead className='w-36 text-right'>Unit price</TableHead>

                <TableHead className='w-36 text-right'>Total</TableHead>

                <TableHead className='w-12' />
              </TableRow>
            </TableHeader>

            <TableBody>
              {lineItems.map((item, index) => {
                const selectedProduct = products.find(
                  (product) => product.id === item.productId,
                );

                const itemTotal = item.quantity * item.unitPrice;

                return (
                  <TableRow key={item.id ?? `${item.productId}-${index}`}>
                    <TableCell className='align-top py-3'>
                      <Select
                        value={item.productId}
                        onValueChange={(value) => {
                          if (!value) {
                            return;
                          }

                          const product = products.find(
                            (candidate) => candidate.id === value,
                          );

                          updateItem(index, {
                            productId: value,
                            unitPrice: product?.sellingPrice ?? item.unitPrice,
                            productName: product?.name,
                            sku: product?.sku,
                          });
                        }}
                      >
                        <SelectTrigger className='h-9 w-full'>
                          <SelectValue placeholder='Select product' />
                        </SelectTrigger>

                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedProduct && (
                        <p className='mt-1.5 text-[11px] text-muted-foreground'>
                          {selectedProduct.sku}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className='align-top py-3'>
                      <Input
                        type='number'
                        min={1}
                        inputMode='numeric'
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(index, {
                            quantity: Number(event.target.value) || 0,
                          })
                        }
                        className={numberInputClasses}
                      />
                    </TableCell>

                    <TableCell className='align-top py-3'>
                      <Input
                        type='number'
                        min={0}
                        step='0.01'
                        inputMode='decimal'
                        value={item.unitPrice}
                        onChange={(event) =>
                          updateItem(index, {
                            unitPrice: Number(event.target.value) || 0,
                          })
                        }
                        className={numberInputClasses}
                      />
                    </TableCell>

                    <TableCell className='align-top py-3'>
                      <div className='flex h-9 items-center justify-end font-medium tabular-nums'>
                        {formatCurrency(itemTotal)}
                      </div>
                    </TableCell>

                    <TableCell className='align-top py-3'>
                      <div className='flex h-9 items-center justify-end'>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                          onClick={() => removeItem(index)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className='size-4' />

                          <span className='sr-only'>Remove product</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {lineItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    <div className='flex flex-col items-center justify-center gap-1'>
                      <p className='text-sm font-medium'>No products added</p>

                      <p className='text-xs text-muted-foreground'>
                        Add a product to start building this order.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex flex-col gap-3 border-t bg-muted/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addItem}
            disabled={products.length === 0}
          >
            <Plus className='mr-2 size-4' />
            Add product
          </Button>

          <div className='flex items-center justify-between gap-6 sm:justify-end'>
            <span className='text-sm text-muted-foreground'>Subtotal</span>

            <span className='text-lg font-semibold tracking-tight tabular-nums'>
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

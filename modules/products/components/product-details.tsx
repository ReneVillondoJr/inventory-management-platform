'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, ArrowUpRight, Edit, Package } from 'lucide-react';

import { Button } from '@/components/buttons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { inventoryService } from '@/modules/inventory/services/inventory-service';

import { productService } from '../services/product-service';

import { ProductStatusBadge } from './product-status-badge';

type ProductDetailsProps = {
  id: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductDetails({ id }: ProductDetailsProps) {
  const router = useRouter();

  const product = productService.getById(id);

  if (!product) {
    return (
      <div className='space-y-4'>
        <Button variant='ghost' onClick={() => router.back()}>
          <ArrowLeft className='size-4' />
          Back
        </Button>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='flex min-h-56 items-center justify-center'>
            <div className='text-center'>
              <p className='text-sm font-medium'>Product not found</p>

              <p className='mt-1 text-xs text-muted-foreground'>
                The requested product does not exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const inventory = inventoryService
    .getInventoryRecords()
    .filter((item) => item.productId === product.id);

  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);

  const availableUnits = inventory.reduce(
    (sum, item) => sum + item.availableQuantity,
    0,
  );

  const inventoryValue = inventory.reduce(
    (sum, item) => sum + item.inventoryValue,
    0,
  );

  const margin = product.sellingPrice - product.costPrice;

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex min-w-0 items-start gap-4'>
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
              Product
            </p>

            <div className='mt-1 flex flex-wrap items-center gap-2'>
              <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>
                {product.name}
              </h1>

              <ProductStatusBadge status={product.status} />
            </div>

            <p className='mt-1 text-sm text-muted-foreground'>
              {product.sku} · {product.brandName}
            </p>
          </div>
        </div>

        <Button
          nativeButton={false}
          render={
            <Link href={`/admin/inventory/products/${product.id}/edit`} />
          }
        >
          <Edit className='size-4' />
          Edit
        </Button>
      </div>

      <div className='grid gap-6 xl:grid-cols-[280px_1fr]'>
        <Card className='overflow-hidden border-border/60 shadow-none'>
          <div className='relative aspect-square bg-muted/20'>
            {product.image ?
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                className='object-cover'
                sizes='(max-width: 1280px) 100vw, 280px'
              />
            : <div className='flex h-full items-center justify-center'>
                <Package className='size-12 text-muted-foreground/50' />
              </div>
            }
          </div>

          <CardContent className='p-5'>
            <div className='space-y-3'>
              <div>
                <p className='text-xs text-muted-foreground'>Category</p>
                <p className='mt-0.5 text-sm font-medium'>
                  {product.categoryName}
                </p>
              </div>

              <div>
                <p className='text-xs text-muted-foreground'>Brand</p>
                <p className='mt-0.5 text-sm font-medium'>
                  {product.brandName}
                </p>
              </div>

              <div>
                <p className='text-xs text-muted-foreground'>Unit</p>
                <p className='mt-0.5 text-sm font-medium'>{product.unit}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            <Card className='border-border/60 shadow-none'>
              <CardContent className='p-5'>
                <p className='text-xs text-muted-foreground'>Cost price</p>
                <p className='mt-2 text-xl font-semibold'>
                  {formatCurrency(product.costPrice)}
                </p>
              </CardContent>
            </Card>

            <Card className='border-border/60 shadow-none'>
              <CardContent className='p-5'>
                <p className='text-xs text-muted-foreground'>Selling price</p>
                <p className='mt-2 text-xl font-semibold'>
                  {formatCurrency(product.sellingPrice)}
                </p>
              </CardContent>
            </Card>

            <Card className='border-border/60 shadow-none'>
              <CardContent className='p-5'>
                <p className='text-xs text-muted-foreground'>Unit margin</p>
                <p className='mt-2 text-xl font-semibold'>
                  {formatCurrency(margin)}
                </p>
              </CardContent>
            </Card>

            <Card className='border-border/60 shadow-none'>
              <CardContent className='p-5'>
                <p className='text-xs text-muted-foreground'>Reorder level</p>
                <p className='mt-2 text-xl font-semibold'>
                  {product.reorderLevel}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className='border-border/60 shadow-none'>
            <CardHeader>
              <CardTitle className='text-base'>Inventory summary</CardTitle>
            </CardHeader>

            <CardContent>
              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='rounded-xl border border-border/60 bg-muted/20 p-4'>
                  <p className='text-xs text-muted-foreground'>Total units</p>

                  <p className='mt-2 text-2xl font-semibold'>
                    {totalUnits.toLocaleString()}
                  </p>
                </div>

                <div className='rounded-xl border border-border/60 bg-muted/20 p-4'>
                  <p className='text-xs text-muted-foreground'>
                    Available units
                  </p>

                  <p className='mt-2 text-2xl font-semibold'>
                    {availableUnits.toLocaleString()}
                  </p>
                </div>

                <div className='rounded-xl border border-border/60 bg-muted/20 p-4'>
                  <p className='text-xs text-muted-foreground'>
                    Inventory value
                  </p>

                  <p className='mt-2 text-2xl font-semibold'>
                    {formatCurrency(inventoryValue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-border/60 shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle className='text-base'>Warehouse stock</CardTitle>

                <p className='mt-1 text-xs text-muted-foreground'>
                  Current stock across locations
                </p>
              </div>

              <Badge variant='outline' className='rounded-full'>
                {inventory.length} locations
              </Badge>
            </CardHeader>

            <CardContent>
              {!inventory.length ?
                <div className='rounded-xl border border-dashed border-border/60 p-6 text-center'>
                  <p className='text-sm font-medium'>No inventory records</p>
                </div>
              : <div className='divide-y divide-border/60'>
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center justify-between gap-4 py-4'
                    >
                      <div>
                        <p className='text-sm font-medium'>
                          {item.warehouseName}
                        </p>

                        <p className='mt-0.5 text-xs text-muted-foreground'>
                          {item.warehouseCode}
                        </p>
                      </div>

                      <div className='text-right'>
                        <p className='text-sm font-semibold'>
                          {item.quantity.toLocaleString()} units
                        </p>

                        <p className='mt-0.5 text-xs text-muted-foreground'>
                          {item.availableQuantity.toLocaleString()} available
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </CardContent>
          </Card>

          <div className='flex flex-wrap gap-2'>
            <Button
              variant='outline'
              render={
                <Link
                  href={`/admin/inventory/stock-levels?product=${product.id}`}
                />
              }
            >
              View stock levels
              <ArrowUpRight className='size-4' />
            </Button>

            <Button
              variant='outline'
              render={
                <Link
                  href={`/admin/inventory/stock-movements?product=${product.id}`}
                />
              }
            >
              View stock movements
              <ArrowUpRight className='size-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

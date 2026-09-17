'use client';

import Link from 'next/link';

import { PackagePlus, Boxes, CircleCheck, CircleX } from 'lucide-react';

import { Button } from '@/components/buttons';

import { useProducts } from '../hooks/use-products';

import { ProductFilters } from './product-filters';
import { ProductTable } from './product-table';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductList() {
  const {
    filteredProducts,
    filters,
    summary,
    categories,
    brands,
    updateFilters,
    resetFilters,
    refresh,
  } = useProducts();

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
            Inventory
          </p>

          <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
            Products
          </h1>

          <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
            Manage your product catalog, pricing, categories, brands, and
            inventory settings.
          </p>
        </div>

        <Button
          nativeButton={false}
          render={<Link href='/admin/inventory/products/new' />}
        >
          <PackagePlus className='size-4' />
          Add product
        </Button>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <div className='rounded-2xl border border-border/60 bg-background p-5'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>
                Total products
              </p>

              <p className='mt-2 text-2xl font-semibold tracking-tight'>
                {summary.total}
              </p>

              <p className='mt-1 text-[11px] text-muted-foreground'>
                Product catalog
              </p>
            </div>

            <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
              <Boxes className='size-4 text-muted-foreground' />
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-border/60 bg-background p-5'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>
                Active
              </p>

              <p className='mt-2 text-2xl font-semibold tracking-tight'>
                {summary.active}
              </p>

              <p className='mt-1 text-[11px] text-muted-foreground'>
                Available for operations
              </p>
            </div>

            <div className='flex size-9 items-center justify-center rounded-xl bg-emerald-50'>
              <CircleCheck className='size-4 text-emerald-600' />
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-border/60 bg-background p-5'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>
                Inactive
              </p>

              <p className='mt-2 text-2xl font-semibold tracking-tight'>
                {summary.inactive}
              </p>

              <p className='mt-1 text-[11px] text-muted-foreground'>
                Not available for new orders
              </p>
            </div>

            <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
              <CircleX className='size-4 text-muted-foreground' />
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-border/60 bg-background p-5'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>
                Avg. margin
              </p>

              <p className='mt-2 text-2xl font-semibold tracking-tight'>
                {formatCurrency(summary.averageMargin)}
              </p>

              <p className='mt-1 text-[11px] text-muted-foreground'>
                Average price spread
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProductFilters
        filters={filters}
        categories={categories}
        brands={brands}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      <div className='flex items-center justify-between gap-4'>
        <div>
          <h2 className='text-sm font-semibold'>Product catalog</h2>

          <p className='mt-0.5 text-xs text-muted-foreground'>
            {filteredProducts.length} products shown
          </p>
        </div>
      </div>

      <ProductTable products={filteredProducts} onChange={refresh} />
    </div>
  );
}

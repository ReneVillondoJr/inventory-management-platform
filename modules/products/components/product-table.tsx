'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpRight, Package } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Product } from '../types/product';

import { ProductActions } from './product-actions';
import { ProductStatusBadge } from './product-status-badge';

type ProductTableProps = {
  products: Product[];
  onChange?: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductTable({ products, onChange }: ProductTableProps) {
  if (!products.length) {
    return (
      <div className='flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border/60'>
        <div className='text-center'>
          <div className='mx-auto flex size-10 items-center justify-center rounded-xl bg-muted'>
            <Package className='size-4 text-muted-foreground' />
          </div>

          <p className='mt-3 text-sm font-medium'>No products found</p>

          <p className='mt-1 text-xs text-muted-foreground'>
            Try adjusting your filters or search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-border/60 bg-background'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/30 hover:bg-muted/30'>
            <TableHead className='px-4'>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Pricing</TableHead>
            <TableHead>Reorder</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-20' />
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className='group'>
              <TableCell className='px-4'>
                <div className='flex items-center gap-3'>
                  <div className='relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted'>
                    {product.image ?
                      <Image
                        src={product.image}
                        alt=''
                        fill
                        unoptimized
                        className='object-cover'
                        sizes='36px'
                      />
                    : <Package className='size-4 text-muted-foreground' />}
                  </div>

                  <div className='min-w-0'>
                    <Link
                      href={`/admin/inventory/products/${product.id}`}
                      className='truncate font-medium transition-colors hover:text-primary'
                    >
                      {product.name}
                    </Link>

                    <p className='mt-0.5 text-xs text-muted-foreground'>
                      {product.sku}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <span className='text-sm'>{product.categoryName}</span>
              </TableCell>

              <TableCell>
                <span className='text-sm'>{product.brandName}</span>
              </TableCell>

              <TableCell>
                <div>
                  <p className='font-medium'>
                    {formatCurrency(product.sellingPrice)}
                  </p>

                  <p className='text-xs text-muted-foreground'>
                    Cost {formatCurrency(product.costPrice)}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <span className='text-sm'>{product.reorderLevel}</span>
              </TableCell>

              <TableCell>
                <ProductStatusBadge status={product.status} />
              </TableCell>

              <TableCell>
                <div className='flex items-center justify-end gap-1'>
                  <Link
                    href={`/admin/inventory/products/${product.id}`}
                    aria-label={`View ${product.name}`}
                    className='flex size-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100'
                  >
                    <ArrowUpRight className='size-4' />
                  </Link>

                  <ProductActions product={product} onChange={onChange} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

'use client';

import { MoreHorizontal, Power, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { productService } from '../services/product-service';

import type { Product } from '../types/product';

type ProductActionsProps = {
  product: Product;
  onChange?: () => void;
};

export function ProductActions({ product, onChange }: ProductActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleStatus = () => {
    productService.updateStatus(
      product.id,
      product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
    );

    onChange?.();
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      productService.delete(product.id);
      onChange?.();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label={`Actions for ${product.name}`}
          >
            <MoreHorizontal className='size-4' />
          </Button>
        }
      />

      <DropdownMenuContent align='end' className='w-44'>
        <DropdownMenuItem
          render={
            <Link href={`/admin/inventory/products/${product.id}`}>
              View product
            </Link>
          }
        />

        <DropdownMenuItem
          render={
            <Link href={`/admin/inventory/products/${product.id}/edit`}>
              Edit product
            </Link>
          }
        />

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleToggleStatus}>
          <Power className='size-4' />
          {product.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        </DropdownMenuItem>

        <DropdownMenuItem
          variant='destructive'
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <Trash2 className='size-4' />
          Delete product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

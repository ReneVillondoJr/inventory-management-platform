'use client';

import { MoreHorizontal, Power, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { AlertDialog } from '@/components/shared/alert-dialog';
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
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isActive = product.status === 'ACTIVE';

  const handleToggleStatus = async () => {
    setIsTogglingStatus(true);

    try {
      await productService.updateStatus(
        product.id,
        isActive ? 'INACTIVE' : 'ACTIVE',
      );
      onChange?.();
    } catch (error) {
      console.error('Failed to update product status', error);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await productService.delete(product.id);
      onChange?.();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete product', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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

          <DropdownMenuItem
            disabled={isTogglingStatus}
            onClick={handleToggleStatus}
          >
            <Power className='size-4' />
            {isActive ? 'Deactivate' : 'Activate'}
          </DropdownMenuItem>

          <DropdownMenuItem
            variant='destructive'
            disabled={isDeleting}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className='size-4' />
            Delete product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='Delete this product?'
        description={`This will permanently remove "${product.name}" and its associated records. This action cannot be undone.`}
        confirmText='Delete product'
        cancelText='Cancel'
        onConfirm={handleDelete}
        loading={isDeleting}
        destructive
      />
    </>
  );
}

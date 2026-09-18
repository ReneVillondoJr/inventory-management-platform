'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/shared/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';
import { seedData } from '@/data/seed/inventory-seed';

import { productSchema } from '../schemas/product-schema';

import { useProductForm } from '../hooks/use-product-form';

import type { Product, ProductFormValues } from '../types/product';

import { ProductImageUpload } from './product-image-upload';

type ProductFormProps = {
  product?: Product | null;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();

  const categories = seedData.categories;

  const brands = seedData.brands;

  const [values, setValues] = useState<ProductFormValues>({
    sku: product?.sku ?? '',
    name: product?.name ?? '',
    categoryId: product?.categoryId ?? categories[0]?.id ?? '',
    brandId: product?.brandId ?? brands[0]?.id ?? '',
    unit: product?.unit ?? 'piece',
    costPrice: product?.costPrice ?? 0,
    sellingPrice: product?.sellingPrice ?? 0,
    reorderLevel: product?.reorderLevel ?? 0,
    status: product?.status ?? 'ACTIVE',
    image: product?.image ?? '',
  });

  const { error, success, isSubmitting, save } = useProductForm({
    product,
    onSuccess: (savedProduct) => {
      window.setTimeout(() => {
        router.push(`/admin/inventory/products/${savedProduct.id}`);
        router.refresh();
      }, 500);
    },
  });

  const update = <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = productSchema.safeParse(values);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ?? 'Please check the form.';

      window.alert(firstError);
      return;
    }

    await save(parsed.data as ProductFormValues);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='grid gap-6 xl:grid-cols-[1fr_320px]'
    >
      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='text-base'>
            {product ? 'Product information' : 'Create product'}
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='grid gap-5 sm:grid-cols-2'>
            <div>
              <label htmlFor='product-name' className='text-xs font-medium'>
                Product name
              </label>

              <Input
                id='product-name'
                value={values.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder='Executive Work Desk'
                className='mt-1.5'
              />
            </div>

            <div>
              <label htmlFor='product-sku' className='text-xs font-medium'>
                SKU
              </label>

              <Input
                id='product-sku'
                value={values.sku}
                onChange={(event) => update('sku', event.target.value)}
                placeholder='NS-DESK-001'
                className='mt-1.5'
              />
            </div>
          </div>

          <div className='grid gap-5 sm:grid-cols-2'>
            <div>
              <Label htmlFor='product-category' className='text-xs font-medium'>
                Category
              </Label>

              <Select
                value={values.categoryId}
                onValueChange={(value) => {
                  if (value !== null) {
                    update('categoryId', value);
                  }
                }}
              >
                <SelectTrigger
                  id='product-category'
                  className='mt-1.5 h-10 w-full'
                >
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category: { id: string; name: string }) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='product-brand' className='text-xs font-medium'>
                Brand
              </Label>

              <Select
                value={values.brandId}
                onValueChange={(value) => {
                  if (value !== null) {
                    update('brandId', value);
                  }
                }}
              >
                <SelectTrigger
                  id='product-brand'
                  className='mt-1.5 h-10 w-full'
                >
                  <SelectValue placeholder='Select brand' />
                </SelectTrigger>

                <SelectContent>
                  {brands.map((brand: { id: string; name: string }) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid gap-5 sm:grid-cols-3'>
            <div>
              <label htmlFor='product-unit' className='text-xs font-medium'>
                Unit
              </label>

              <Input
                id='product-unit'
                value={values.unit}
                onChange={(event) => update('unit', event.target.value)}
                placeholder='piece'
                className='mt-1.5'
              />
            </div>

            <div>
              <label htmlFor='product-cost' className='text-xs font-medium'>
                Cost price
              </label>

              <Input
                id='product-cost'
                type='number'
                min='0'
                step='0.01'
                value={values.costPrice}
                onChange={(event) =>
                  update('costPrice', Number(event.target.value))
                }
                className='mt-1.5'
              />
            </div>

            <div>
              <label htmlFor='product-selling' className='text-xs font-medium'>
                Selling price
              </label>

              <Input
                id='product-selling'
                type='number'
                min='0'
                step='0.01'
                value={values.sellingPrice}
                onChange={(event) =>
                  update('sellingPrice', Number(event.target.value))
                }
                className='mt-1.5'
              />
            </div>
          </div>

          <div className='grid gap-5 sm:grid-cols-2'>
            <div>
              <label htmlFor='product-reorder' className='text-xs font-medium'>
                Reorder level
              </label>

              <Input
                id='product-reorder'
                type='number'
                min='0'
                step='1'
                value={values.reorderLevel}
                onChange={(event) =>
                  update('reorderLevel', Number(event.target.value))
                }
                className='mt-1.5'
              />
            </div>

            <div>
              <Label htmlFor='product-status' className='text-xs font-medium'>
                Status
              </Label>

              <Select
                value={values.status}
                onValueChange={(value) =>
                  update('status', value as Product['status'])
                }
              >
                <SelectTrigger
                  id='product-status'
                  className='mt-1.5 h-10 w-full'
                >
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value='ACTIVE'>Active</SelectItem>
                  <SelectItem value='INACTIVE'>Inactive</SelectItem>
                </SelectContent>
              </Select>
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

          <div className='flex justify-end gap-2 border-t border-border/60 pt-5'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ?
                'Saving...'
              : product ?
                'Save changes'
              : 'Create product'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='text-base'>Product image</CardTitle>
        </CardHeader>

        <CardContent>
          <ProductImageUpload
            value={values.image}
            onChange={(value) => update('image', value)}
          />
        </CardContent>
      </Card>
    </form>
  );
}

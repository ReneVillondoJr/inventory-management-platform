'use client';

import { Search } from 'lucide-react';

import { FilterBar } from '@/components/shared/filter-bar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

import type { ProductFilters as ProductFiltersType } from '../types/product';

type ProductFiltersProps = {
  filters: ProductFiltersType;
  categories: readonly {
    id: string;
    name: string;
  }[];
  brands: readonly {
    id: string;
    name: string;
  }[];
  onChange: (values: Partial<ProductFiltersType>) => void;
  onReset: () => void;
};

export function ProductFilters({
  filters,
  categories,
  brands,
  onChange,
  onReset,
}: ProductFiltersProps) {
  const hasFilters =
    filters.search !== '' ||
    filters.categoryId !== 'ALL' ||
    filters.brandId !== 'ALL' ||
    filters.status !== 'ALL';

  return (
    <FilterBar hasFilters={hasFilters} onReset={onReset}>
      {/* Search */}
      <div className='relative'>
        <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

        <Input
          value={filters.search}
          onChange={(event) =>
            onChange({
              search: event.target.value,
            })
          }
          placeholder='Search name, SKU, brand...'
          className='h-9 border-border/60 pl-9 shadow-none'
        />
      </div>

      {/* Category */}
      <Select
        value={filters.categoryId}
        onValueChange={(value) => {
          if (value !== null) {
            onChange({
              categoryId: value,
            });
          }
        }}
      >
        <SelectTrigger className='h-9 w-full'>
          <SelectValue placeholder='All categories' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='ALL'>All categories</SelectItem>

          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Brand */}
      <Select
        value={filters.brandId}
        onValueChange={(value) => {
          if (value !== null) {
            onChange({
              brandId: value,
            });
          }
        }}
      >
        <SelectTrigger className='h-9 w-full'>
          <SelectValue placeholder='All brands' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='ALL'>All brands</SelectItem>

          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={filters.status}
        onValueChange={(value) => {
          if (value !== null) {
            onChange({
              status: value as ProductFiltersType['status'],
            });
          }
        }}
      >
        <SelectTrigger className='h-9 w-full'>
          <SelectValue placeholder='All status' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='ALL'>All status</SelectItem>

          <SelectItem value='ACTIVE'>Active</SelectItem>

          <SelectItem value='INACTIVE'>Inactive</SelectItem>
        </SelectContent>
      </Select>
    </FilterBar>
  );
}

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

import type { InventoryFilters } from '../types/inventory';

type InventoryFiltersProps = {
  filters: InventoryFilters;
  warehouses: readonly {
    id: string;
    name: string;
  }[];
  categories: readonly {
    id: string;
    name: string;
  }[];
  updateFilters: (values: Partial<InventoryFilters>) => void;
  resetFilters: () => void;
};

export function InventoryFilters({
  filters,
  warehouses,
  categories,
  updateFilters,
  resetFilters,
}: InventoryFiltersProps) {
  const hasFilters =
    filters.search !== '' ||
    filters.warehouseId !== 'ALL' ||
    filters.categoryId !== 'ALL';

  return (
    <FilterBar
      hasFilters={hasFilters}
      onReset={resetFilters}
      gridClassName='lg:grid-cols-[1fr_220px_180px_auto]'
    >
      {/* Search */}
      <div className='relative'>
        <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

        <Input
          value={filters.search}
          onChange={(event) =>
            updateFilters({
              search: event.target.value,
            })
          }
          placeholder='Search product, SKU, brand, warehouse...'
          className='h-9 border-border/60 pl-9 shadow-none'
        />
      </div>

      {/* Warehouse */}
      <Select
        value={filters.warehouseId}
        onValueChange={(value) => {
          if (value !== null) {
            updateFilters({
              warehouseId: value,
            });
          }
        }}
      >
        <SelectTrigger className='h-9 w-full'>
          <SelectValue placeholder='All warehouses' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='ALL'>All warehouses</SelectItem>

          {warehouses.map((warehouse) => (
            <SelectItem key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category */}
      <Select
        value={filters.categoryId}
        onValueChange={(value) => {
          if (value !== null) {
            updateFilters({
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
    </FilterBar>
  );
}

'use client';

import { Search } from 'lucide-react';

import { FilterBar } from '@/components/shared/filter-bar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';
import { Input } from '@/components/ui/input';

import type {
  PurchaseOrderFilters as PurchaseOrderFilterValues,
  PurchaseOrderStatus,
} from '../types/purchase-order';

type Supplier = {
  readonly id: string;
  readonly name: string;
};

type Warehouse = {
  readonly id: string;
  readonly name: string;
};

type PurchaseOrderFiltersProps = {
  filters: PurchaseOrderFilterValues;
  suppliers: readonly Supplier[];
  warehouses: readonly Warehouse[];
  updateFilters: (values: Partial<PurchaseOrderFilterValues>) => void;
  resetFilters: () => void;
};

const STATUS_OPTIONS: readonly {
  value: PurchaseOrderStatus;
  label: string;
}[] = [
  {
    value: 'DRAFT',
    label: 'Draft',
  },
  {
    value: 'APPROVED',
    label: 'Approved',
  },
  {
    value: 'PARTIALLY_RECEIVED',
    label: 'Partially received',
  },
  {
    value: 'RECEIVED',
    label: 'Received',
  },
  {
    value: 'CANCELLED',
    label: 'Cancelled',
  },
];

export function PurchaseOrderFilters({
  filters,
  suppliers,
  warehouses,
  updateFilters,
  resetFilters,
}: PurchaseOrderFiltersProps) {
  const hasFilters =
    filters.search !== '' ||
    filters.supplierId !== 'ALL' ||
    filters.warehouseId !== 'ALL' ||
    filters.status !== 'ALL';

  return (
    <FilterBar hasFilters={hasFilters} onReset={resetFilters}>
      <div className='relative'>
        <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

        <Input
          value={filters.search}
          onChange={(event) =>
            updateFilters({
              search: event.target.value,
            })
          }
          placeholder='Search order, supplier, warehouse...'
          className='h-9 border-border/60 pl-9 shadow-none'
        />
      </div>

      <Select
        value={filters.supplierId}
        onValueChange={(value) => {
          if (value !== null) {
            updateFilters({
              supplierId: value,
            });
          }
        }}
      >
        <SelectTrigger className='h-9 w-full'>
          <SelectValue placeholder='All suppliers' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='ALL'>All suppliers</SelectItem>

          {suppliers.map((supplier) => (
            <SelectItem key={supplier.id} value={supplier.id}>
              {supplier.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

      <Select
        value={filters.status}
        onValueChange={(value) => {
          if (value !== null) {
            updateFilters({
              status: value as PurchaseOrderStatus,
            });
          }
        }}
      >
        <SelectTrigger className='h-9 w-full'>
          <SelectValue placeholder='All statuses' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='ALL'>All statuses</SelectItem>

          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  );
}

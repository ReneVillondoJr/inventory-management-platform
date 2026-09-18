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

import type {
  SalesOrderFilters as SalesOrderFilterValues,
  SalesOrderStatus,
} from '../types/sales-order';

type Customer = {
  readonly id: string;
  readonly name: string;
};

type Warehouse = {
  readonly id: string;
  readonly name: string;
};

type SalesOrderFiltersProps = {
  filters: SalesOrderFilterValues;
  customers: readonly Customer[];
  warehouses: readonly Warehouse[];
  statuses: readonly {
    value: SalesOrderStatus;
    label: string;
  }[];
  updateFilters: (values: Partial<SalesOrderFilterValues>) => void;
  resetFilters: () => void;
};

export function SalesOrderFilters({
  filters,
  customers,
  warehouses,
  statuses,
  updateFilters,
  resetFilters,
}: SalesOrderFiltersProps) {
  const hasFilters =
    filters.search !== '' ||
    filters.customerId !== 'ALL' ||
    filters.warehouseId !== 'ALL' ||
    filters.status !== 'ALL';

  return (
    <FilterBar hasFilters={hasFilters} onReset={resetFilters}>
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
          placeholder='Search order, customer...'
          className='h-9 border-border/60 pl-9 shadow-none'
        />
      </div>

      {/* Customer */}
      <Select
        value={filters.customerId}
        onValueChange={(value) => {
          if (value !== null) {
            updateFilters({
              customerId: value,
            });
          }
        }}
      >
        <SelectTrigger className='h-9 w-full'>
          <SelectValue placeholder='All customers' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='ALL'>All customers</SelectItem>

          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

      {/* Status */}
      <Select
        value={filters.status}
        onValueChange={(value) => {
          if (value !== null) {
            updateFilters({
              status: value as SalesOrderFilterValues['status'],
            });
          }
        }}
      >
        <SelectTrigger className='h-9 w-full'>
          <SelectValue placeholder='All statuses' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='ALL'>All statuses</SelectItem>

          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  );
}

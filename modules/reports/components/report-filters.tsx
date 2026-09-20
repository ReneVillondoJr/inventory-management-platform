'use client';

import type { ChangeEvent } from 'react';

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
  ReportDateRange,
  ReportFilters as ReportFiltersType,
  ReportWarehouseOption,
} from '../types/report';

type ReportFiltersProps = {
  filters: ReportFiltersType;
  warehouses: readonly ReportWarehouseOption[];
  onChange: (patch: Partial<ReportFiltersType>) => void;
  onReset: () => void;
};

const DATE_RANGE_LABELS: Record<ReportDateRange, string> = {
  ALL: 'All time',
  '7D': 'Last 7 days',
  '30D': 'Last 30 days',
  '90D': 'Last 90 days',
  CUSTOM: 'Custom range',
};

export function ReportFilters({
  filters,
  warehouses,
  onChange,
  onReset,
}: ReportFiltersProps) {
  const handleDateFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      dateRange: 'CUSTOM',
      dateFrom: event.target.value,
    });
  };

  const handleDateToChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      dateRange: 'CUSTOM',
      dateTo: event.target.value,
    });
  };

  const showCustomDates = filters.dateRange === 'CUSTOM';

  const hasFilters =
    Boolean(filters.search.trim()) ||
    filters.warehouseId !== 'ALL' ||
    filters.dateRange !== 'ALL';

  return (
    <FilterBar
      hasFilters={hasFilters}
      onReset={onReset}
      gridClassName={
        showCustomDates ?
          'lg:grid-cols-[minmax(0,1fr)_160px_160px_145px_145px_auto]'
        : 'lg:grid-cols-[minmax(0,1fr)_160px_160px_auto]'
      }
    >
      <div className='relative min-w-0'>
        <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

        <Input
          value={filters.search}
          onChange={(event) =>
            onChange({
              search: event.target.value,
            })
          }
          placeholder='Search reports...'
          className='h-9 w-full pl-9'
        />
      </div>

      <div className='w-full'>
        <Select
          value={filters.warehouseId}
          onValueChange={(value) =>
            onChange({
              warehouseId: value ?? 'ALL',
            })
          }
        >
          <SelectTrigger className='h-9 w-full'>
            <SelectValue placeholder='Warehouse' />
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
      </div>

      <div className='w-full'>
        <Select
          value={filters.dateRange}
          onValueChange={(value) =>
            onChange({
              dateRange: (value as ReportDateRange) ?? 'ALL',
            })
          }
        >
          <SelectTrigger className='h-9 w-full'>
            <SelectValue placeholder='Date range' />
          </SelectTrigger>

          <SelectContent>
            {Object.entries(DATE_RANGE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showCustomDates ?
        <>
          <Input
            type='date'
            value={filters.dateFrom}
            onChange={handleDateFromChange}
            className='h-9 w-full'
          />

          <Input
            type='date'
            value={filters.dateTo}
            onChange={handleDateToChange}
            className='h-9 w-full'
          />
        </>
      : null}
    </FilterBar>
  );
}

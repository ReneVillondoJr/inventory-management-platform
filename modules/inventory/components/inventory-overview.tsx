'use client';

import { AlertTriangle, Boxes, PackageCheck, Warehouse } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useInventory } from '../hooks/use-inventory';

import { StockLevelTable } from './stock-level-table';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function InventoryOverview() {
  const {
    filteredInventory,
    summary,
    filters,
    updateFilters,
    resetFilters,
    warehouses,
    categories,
  } = useInventory();

  const cards = [
    {
      label: 'Total products',
      value: summary.totalProducts,
      description: 'Unique products',
      icon: PackageCheck,
    },
    {
      label: 'Total units',
      value: summary.totalUnits,
      description: `${summary.totalAvailableUnits} available`,
      icon: Boxes,
    },
    {
      label: 'Inventory value',
      value: formatCurrency(summary.totalInventoryValue),
      description: 'At cost value',
      icon: Boxes,
    },
    {
      label: 'Low stock',
      value: summary.lowStockItems,
      description: `${summary.outOfStockItems} out of stock`,
      icon: AlertTriangle,
    },
    {
      label: 'Warehouses',
      value: summary.warehouseCount,
      description: 'Active locations',
      icon: Warehouse,
    },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Inventory
        </p>

        <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
          Stock Overview
        </h1>

        <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
          Monitor stock levels, warehouse availability, inventory value, and
          replenishment requirements.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        {cards.map(({ label, value, description, icon: Icon }) => (
          <Card key={label} className='border-border/60 shadow-none'>
            <CardContent className='p-5'>
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='text-xs font-medium text-muted-foreground'>
                    {label}
                  </p>

                  <p className='mt-2 truncate text-2xl font-semibold tracking-tight'>
                    {value}
                  </p>

                  <p className='mt-1 text-[11px] text-muted-foreground'>
                    {description}
                  </p>
                </div>

                <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted'>
                  <Icon className='size-4 text-muted-foreground' />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='rounded-2xl border border-border/60 bg-background p-4'>
        <div className='grid gap-3 lg:grid-cols-[1fr_220px_180px_auto]'>
          <input
            value={filters.search}
            onChange={(event) =>
              updateFilters({
                search: event.target.value,
              })
            }
            placeholder='Search product, SKU, brand, warehouse...'
            className='h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20'
          />

          <Select
            value={filters.warehouseId}
            onValueChange={(value) => updateFilters({ warehouseId: value })}
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
            value={filters.categoryId}
            onValueChange={(value) => updateFilters({ categoryId: value })}
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

          <button
            type='button'
            onClick={resetFilters}
            className='h-9 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted'
          >
            Reset
          </button>
        </div>
      </div>

      <div className='flex items-end justify-between gap-4'>
        <div>
          <h2 className='text-sm font-semibold'>Current stock</h2>

          <p className='mt-0.5 text-xs text-muted-foreground'>
            {filteredInventory.length} inventory records
          </p>
        </div>
      </div>

      <StockLevelTable inventory={filteredInventory} />
    </div>
  );
}

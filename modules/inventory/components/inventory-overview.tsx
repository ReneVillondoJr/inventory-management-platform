'use client';

import { useInventory } from '../hooks/use-inventory';

import { InventoryFilters } from './inventory-filters';
import { InventorySummary } from './inventory-summary';
import { StockLevelTable } from './stock-level-table';

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

  return (
    <div className='space-y-6'>
      {/* Header */}
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

      {/* Summary */}
      <InventorySummary summary={summary} />

      {/* Filters */}
      <InventoryFilters
        filters={filters}
        warehouses={warehouses}
        categories={categories}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
      />

      {/* Stock */}
      <div>
        <h2 className='text-sm font-semibold'>Current stock</h2>

        <p className='mt-0.5 text-xs text-muted-foreground'>
          {filteredInventory.length} inventory records
        </p>
      </div>

      <StockLevelTable inventory={filteredInventory} />
    </div>
  );
}

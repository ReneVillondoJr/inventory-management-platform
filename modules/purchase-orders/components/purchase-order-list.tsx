'use client';

import Link from 'next/link';

import { Plus } from 'lucide-react';

import { Button } from '@/components/shared/button';

import { usePurchaseOrders } from '../hooks/use-purchase-orders';

import { PurchaseOrderFilters } from './purchase-order-filters';
import { PurchaseOrderSummary } from './purchase-order-summary';
import { PurchaseOrderTable } from './purchase-order-table';

export function PurchaseOrderList() {
  const {
    filteredOrders,
    summary,
    filters,
    suppliers,
    warehouses,
    updateFilters,
    resetFilters,
  } = usePurchaseOrders();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
            Operations
          </p>

          <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
            Purchase Orders
          </h1>

          <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
            Manage supplier orders, expected deliveries, receiving, and
            inventory replenishment.
          </p>
        </div>

        <Button
          nativeButton={false}
          className='shrink-0'
          render={
            <Link href='/admin/operations/purchase-orders/new'>
              <Plus className='size-4' />
              New purchase order
            </Link>
          }
        />
      </div>

      {/* Summary */}
      <PurchaseOrderSummary
        totalOrders={summary.totalOrders}
        draftOrders={summary.draftOrders}
        openOrders={summary.openOrders}
        receivedOrders={summary.receivedOrders}
        totalValue={summary.totalValue}
      />

      {/* Filters */}
      <PurchaseOrderFilters
        filters={filters}
        suppliers={suppliers}
        warehouses={warehouses}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
      />

      {/* Register */}
      <div>
        <h2 className='text-sm font-semibold'>Purchase order register</h2>

        <p className='mt-0.5 text-xs text-muted-foreground'>
          {filteredOrders.length} orders shown
        </p>
      </div>

      <PurchaseOrderTable orders={filteredOrders} />
    </div>
  );
}

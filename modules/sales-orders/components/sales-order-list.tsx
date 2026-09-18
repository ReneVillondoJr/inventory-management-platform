'use client';

import Link from 'next/link';

import { FilePlus2 } from 'lucide-react';

import { Button } from '@/components/shared/button';

import { useSalesOrders } from '../hooks/use-sales-orders';

import { SalesOrderFilters } from './sales-order-filters';
import { SalesOrderSummary } from './sales-order-summary';
import { SalesOrderTable } from './sales-order-table';

export function SalesOrderList() {
  const {
    orders,
    summary,
    filters,
    customers,
    warehouses,
    statuses,
    updateFilters,
  } = useSalesOrders();

  const resetFilters = () => {
    updateFilters({
      search: '',
      customerId: 'ALL',
      warehouseId: 'ALL',
      status: 'ALL',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
            Operations
          </p>

          <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
            Sales Orders
          </h1>

          <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
            Manage customer orders, fulfillment status, and sales activity
            across your warehouses.
          </p>
        </div>

        <Button
          nativeButton={false}
          className='shrink-0'
          render={
            <Link href='/admin/operations/sales-orders/new'>
              <FilePlus2 className='size-4' />
              New sales order
            </Link>
          }
        />
      </div>

      {/* Summary */}
      <SalesOrderSummary
        totalOrders={summary.totalOrders}
        openOrders={summary.openOrders}
        completedOrders={summary.completedOrders}
        totalValue={summary.totalValue}
      />

      {/* Filters */}
      <SalesOrderFilters
        filters={filters}
        customers={customers}
        warehouses={warehouses}
        statuses={statuses}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
      />

      {/* Register */}
      <div>
        <h2 className='text-sm font-semibold'>Sales order register</h2>

        <p className='mt-0.5 text-xs text-muted-foreground'>
          {orders.length} orders shown
        </p>
      </div>

      <SalesOrderTable orders={orders} />
    </div>
  );
}

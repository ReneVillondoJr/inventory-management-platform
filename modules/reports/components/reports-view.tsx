'use client';

import {
  BarChart3,
  Boxes,
  ClipboardList,
  RefreshCw,
  ShoppingCart,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  InventoryReport,
  PurchasingReport,
  ReportFilters,
  ReportSummary,
  SalesReport,
  StockMovementReport,
} from '@/modules/reports';

import { useReports } from '../hooks/use-reports';
import type { ReportType } from '../types/report';

const REPORT_TABS: {
  value: ReportType;
  label: string;
  icon: typeof BarChart3;
}[] = [
  {
    value: 'inventory',
    label: 'Inventory',
    icon: Boxes,
  },
  {
    value: 'purchasing',
    label: 'Purchasing',
    icon: ClipboardList,
  },
  {
    value: 'sales',
    label: 'Sales',
    icon: ShoppingCart,
  },
  {
    value: 'stock-movement',
    label: 'Stock Movements',
    icon: BarChart3,
  },
];

export function ReportsView() {
  const {
    filters,
    warehouses,
    reportData,
    updateFilters,
    setReportType,
    resetFilters,
    refresh,
  } = useReports();

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <p className='text-sm font-medium text-muted-foreground'>Reporting</p>

          <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
            Reports & Analytics
          </h1>

          <p className='mt-2 max-w-2xl text-sm text-muted-foreground'>
            Review inventory, purchasing, sales, and stock movement performance
            from one operational workspace.
          </p>
        </div>

        <Button type='button' variant='outline' size='sm' onClick={refresh}>
          <RefreshCw className='size-4' />
          Refresh
        </Button>
      </div>

      <div className='flex flex-wrap gap-2'>
        {REPORT_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = filters.reportType === tab.value;

          return (
            <Button
              key={tab.value}
              type='button'
              size='sm'
              variant={active ? 'default' : 'outline'}
              onClick={() => setReportType(tab.value)}
              className='gap-2'
            >
              <Icon className='size-4' />
              {tab.label}
            </Button>
          );
        })}
      </div>

      <ReportFilters
        filters={filters}
        warehouses={warehouses}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      <ReportSummary items={reportData.summary} />

      {filters.reportType === 'inventory' ?
        <InventoryReport report={reportData.inventory} />
      : null}

      {filters.reportType === 'purchasing' ?
        <PurchasingReport report={reportData.purchasing} />
      : null}

      {filters.reportType === 'sales' ?
        <SalesReport report={reportData.sales} />
      : null}

      {filters.reportType === 'stock-movement' ?
        <StockMovementReport report={reportData.stockMovements} />
      : null}
    </div>
  );
}

'use client';

import Link from 'next/link';

import {
  CheckCircle2,
  MapPin,
  Plus,
  Warehouse as WarehouseIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/shared/button';
import { FilterBar } from '@/components/shared/filter-bar';
import { SearchInput } from '@/components/shared/search-input';
import { StatusBadge } from '@/components/shared/status-badge';

import { Card, CardContent } from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

import { useRouter } from 'next/navigation';

import { warehouseService } from '../services/warehouse-service';
import type { Warehouse, WarehouseStatus } from '../types/warehouse';

import { WarehouseTable } from './warehouse-table';

export function WarehouseList() {
  const router = useRouter();

  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState('');

  const [status, setStatus] = useState<'ALL' | WarehouseStatus>('ALL');

  const warehouses = useMemo(() => {
    const all = warehouseService.getAll();

    const normalizedSearch = search.trim().toLowerCase();

    return all.filter((warehouse) => {
      const matchesSearch =
        normalizedSearch === '' ||
        warehouse.code.toLowerCase().includes(normalizedSearch) ||
        warehouse.name.toLowerCase().includes(normalizedSearch) ||
        warehouse.address.toLowerCase().includes(normalizedSearch) ||
        warehouse.managerName.toLowerCase().includes(normalizedSearch);

      const matchesStatus = status === 'ALL' || warehouse.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status, refreshKey]);

  const allWarehouses = useMemo(() => warehouseService.getAll(), [refreshKey]);

  const summary = {
    totalWarehouses: allWarehouses.length,

    activeWarehouses: allWarehouses.filter(
      (warehouse) => warehouse.status === 'ACTIVE',
    ).length,

    inactiveWarehouses: allWarehouses.filter(
      (warehouse) => warehouse.status === 'INACTIVE',
    ).length,
  };

  const hasFilters = search !== '' || status !== 'ALL';

  const resetFilters = () => {
    setSearch('');
    setStatus('ALL');
  };

  const refresh = () => {
    setRefreshKey((value) => value + 1);
  };

  const handleStatusChange = (value: string | null) => {
    if (value !== null) {
      setStatus(value as 'ALL' | WarehouseStatus);
    }
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
            Warehouses
          </h1>

          <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
            Manage warehouse locations, assigned managers, status, and stock
            visibility.
          </p>
        </div>

        <Button
          nativeButton={false}
          className='shrink-0'
          render={
            <Link href='/admin/warehouses/new'>
              <Plus className='size-4' />
              New warehouse
            </Link>
          }
        />
      </div>

      {/* Summary */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-xs font-medium text-muted-foreground'>
                  Total warehouses
                </p>

                <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                  {summary.totalWarehouses}
                </p>
              </div>

              <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
                <WarehouseIcon className='size-4 text-muted-foreground' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-xs font-medium text-muted-foreground'>
                  Active locations
                </p>

                <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                  {summary.activeWarehouses}
                </p>

                <div className='mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400'>
                  <CheckCircle2 className='size-3.5' />
                  Operational
                </div>
              </div>

              <div className='flex size-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950'>
                <CheckCircle2 className='size-4 text-emerald-600 dark:text-emerald-300' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-xs font-medium text-muted-foreground'>
                  Inactive locations
                </p>

                <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                  {summary.inactiveWarehouses}
                </p>

                <p className='mt-1 text-[11px] text-muted-foreground'>
                  Currently unavailable
                </p>
              </div>

              <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
                <MapPin className='size-4 text-muted-foreground' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar
        hasFilters={hasFilters}
        onReset={resetFilters}
        gridClassName='md:grid-cols-[1fr_180px_auto]'
      >
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch('')}
          placeholder='Search code, name, address, manager...'
        />

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className='h-9 w-full'>
            <SelectValue placeholder='All statuses' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='ALL'>All statuses</SelectItem>

            <SelectItem value='ACTIVE'>Active</SelectItem>

            <SelectItem value='INACTIVE'>Inactive</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      {/* Register */}

      <h2 className='text-sm font-semibold'>Warehouse register</h2>

      <p className='mt-0.5 text-xs text-muted-foreground'>
        {warehouses.length}{' '}
        {warehouses.length === 1 ? 'warehouse' : 'warehouses'} shown
      </p>

      <WarehouseTable
        warehouses={warehouses}
        onRefresh={() => {
          refresh();
          router.refresh();
        }}
      />
    </div>
  );
}

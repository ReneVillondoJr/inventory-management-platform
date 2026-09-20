'use client';

import Link from 'next/link';

import { CheckCircle2, Plus, Truck } from 'lucide-react';

import { useMemo, useState } from 'react';

import { supplierService } from '../services/supplier-service';
import type { SupplierStatus } from '../types/supplier';

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

import { SupplierTable } from './supplier-table';

export function SupplierList() {
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState('');

  const [status, setStatus] = useState<'ALL' | SupplierStatus>('ALL');

  const allSuppliers = useMemo(() => supplierService.getAll(), [refreshKey]);

  const suppliers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allSuppliers.filter((supplier) => {
      const matchesSearch =
        normalizedSearch === '' ||
        supplier.code.toLowerCase().includes(normalizedSearch) ||
        supplier.name.toLowerCase().includes(normalizedSearch) ||
        supplier.contactName.toLowerCase().includes(normalizedSearch) ||
        supplier.email.toLowerCase().includes(normalizedSearch) ||
        supplier.phone.toLowerCase().includes(normalizedSearch);

      const matchesStatus = status === 'ALL' || supplier.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [allSuppliers, search, status]);

  const summary = {
    totalSuppliers: allSuppliers.length,

    activeSuppliers: allSuppliers.filter(
      (supplier) => supplier.status === 'ACTIVE',
    ).length,

    inactiveSuppliers: allSuppliers.filter(
      (supplier) => supplier.status === 'INACTIVE',
    ).length,
  };

  const hasFilters = search !== '' || status !== 'ALL';

  const resetFilters = () => {
    setSearch('');
    setStatus('ALL');
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
            Suppliers
          </h1>

          <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
            Manage supplier records, contacts, purchasing relationships, and
            order history.
          </p>
        </div>

        <Button
          nativeButton={false}
          className='shrink-0'
          render={
            <Link href='/admin/suppliers/new'>
              <Plus className='size-4' />
              New supplier
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
                  Total suppliers
                </p>

                <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                  {summary.totalSuppliers}
                </p>
              </div>

              <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
                <Truck className='size-4 text-muted-foreground' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-xs font-medium text-muted-foreground'>
                  Active suppliers
                </p>

                <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                  {summary.activeSuppliers}
                </p>

                <div className='mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400'>
                  <CheckCircle2 className='size-3.5' />
                  Available for purchasing
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
                  Inactive suppliers
                </p>

                <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                  {summary.inactiveSuppliers}
                </p>

                <p className='mt-1 text-[11px] text-muted-foreground'>
                  Currently unavailable
                </p>
              </div>

              <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
                <Truck className='size-4 text-muted-foreground' />
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
          placeholder='Search code, supplier, contact...'
        />

        <Select
          value={status}
          onValueChange={(value) => {
            if (value !== null) {
              setStatus(value as 'ALL' | SupplierStatus);
            }
          }}
        >
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

      <h2 className='text-sm font-semibold'>Supplier register</h2>

      <p className='mt-0.5 text-xs text-muted-foreground'>
        {suppliers.length} {suppliers.length === 1 ? 'supplier' : 'suppliers'}{' '}
        shown
      </p>

      <SupplierTable
        suppliers={suppliers}
        onRefresh={() => setRefreshKey((value) => value + 1)}
      />
    </div>
  );
}

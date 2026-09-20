'use client';

import Link from 'next/link';

import { CheckCircle2, Plus, UserRound } from 'lucide-react';

import { useMemo, useState } from 'react';

import { customerService } from '../services/customer-service';

import type { CustomerStatus } from '../types/customer';

import { Button } from '@/components/shared/button';
import { FilterBar } from '@/components/shared/filter-bar';
import { SearchInput } from '@/components/shared/search-input';

import { Card, CardContent } from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

import { CustomerTable } from './customer-table';

export function CustomerList() {
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState('');

  const [status, setStatus] = useState<'ALL' | CustomerStatus>('ALL');

  const allCustomers = useMemo(() => customerService.getAll(), [refreshKey]);

  const customers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allCustomers.filter((customer) => {
      const matchesSearch =
        normalizedSearch === '' ||
        customer.code.toLowerCase().includes(normalizedSearch) ||
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.contactName.toLowerCase().includes(normalizedSearch) ||
        customer.email.toLowerCase().includes(normalizedSearch) ||
        customer.phone.toLowerCase().includes(normalizedSearch);

      const matchesStatus = status === 'ALL' || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [allCustomers, search, status]);

  const totalCustomers = allCustomers.length;

  const activeCustomers = allCustomers.filter(
    (customer) => customer.status === 'ACTIVE',
  ).length;

  const inactiveCustomers = allCustomers.filter(
    (customer) => customer.status === 'INACTIVE',
  ).length;

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
            Customers
          </h1>

          <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
            Manage customer records, contacts, order activity, and sales
            relationships.
          </p>
        </div>

        <Button
          nativeButton={false}
          className='shrink-0'
          render={
            <Link href='/admin/customers/new'>
              <Plus className='size-4' />
              New customer
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
                  Total customers
                </p>

                <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                  {totalCustomers}
                </p>
              </div>

              <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
                <UserRound className='size-4 text-muted-foreground' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-xs font-medium text-muted-foreground'>
                  Active customers
                </p>

                <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                  {activeCustomers}
                </p>

                <div className='mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400'>
                  <CheckCircle2 className='size-3.5' />
                  Available for sales
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
                  Inactive customers
                </p>

                <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>
                  {inactiveCustomers}
                </p>

                <p className='mt-1 text-[11px] text-muted-foreground'>
                  Currently unavailable
                </p>
              </div>

              <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
                <UserRound className='size-4 text-muted-foreground' />
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
          placeholder='Search code, customer, contact...'
        />

        <Select
          value={status}
          onValueChange={(value) => {
            if (value !== null) {
              setStatus(value as 'ALL' | CustomerStatus);
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
      <div>
        <h2 className='text-sm font-semibold'>Customer register</h2>

        <p className='mt-0.5 text-xs text-muted-foreground'>
          {customers.length} {customers.length === 1 ? 'customer' : 'customers'}
          shown
        </p>
      </div>

      <CustomerTable
        customers={customers}
        onRefresh={() => setRefreshKey((value) => value + 1)}
      />
    </div>
  );
}

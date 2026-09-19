'use client';

import Link from 'next/link';

import {
  ArrowLeft,
  Edit3,
  MapPin,
  UserRound,
  Warehouse as WarehouseIcon,
} from 'lucide-react';

import { useMemo, useState } from 'react';

import { warehouseService } from '../services/warehouse-service';

import { Button } from '@/components/shared/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { DateDisplay } from '@/components/shared/date-display';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

import { WarehouseStock } from './warehouse-stock';

type WarehouseDetailsProps = {
  id: string;
};

export function WarehouseDetails({ id }: WarehouseDetailsProps) {
  const [warehouse, setWarehouse] = useState(() =>
    warehouseService.getById(id),
  );

  if (!warehouse) {
    return (
      <div className='flex min-h-64 items-center justify-center rounded-xl border border-dashed'>
        <div className='text-center'>
          <WarehouseIcon className='mx-auto size-6 text-muted-foreground/50' />

          <p className='mt-3 font-medium'>Warehouse not found</p>

          <p className='mt-1 text-sm text-muted-foreground'>
            The warehouse may have been removed or does not exist.
          </p>

          <Button
            className='mt-4'
            nativeButton={false}
            render={<Link href='/admin/warehouses'>Back to warehouses</Link>}
          />
        </div>
      </div>
    );
  }

  const handleStatusChange = (value: string | null) => {
    if (!value) {
      return;
    }

    const updated = warehouseService.updateStatus(
      warehouse.id,
      value as 'ACTIVE' | 'INACTIVE',
    );

    setWarehouse(updated);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div className='flex min-w-0 items-start gap-3'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-9 shrink-0'
            nativeButton={false}
            render={<Link href='/admin/warehouses' />}
          >
            <ArrowLeft className='size-4' />

            <span className='sr-only'>Back to warehouses</span>
          </Button>

          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='truncate text-2xl font-semibold tracking-tight sm:text-3xl'>
                {warehouse.name}
              </h1>

              <StatusBadge status={warehouse.status} />
            </div>

            <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground'>
              <span className='font-mono text-xs'>{warehouse.code}</span>

              <span className='text-border'>/</span>

              <span>{warehouse.managerName}</span>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Select value={warehouse.status} onValueChange={handleStatusChange}>
            <SelectTrigger className='h-9 w-32'>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value='ACTIVE'>Active</SelectItem>

              <SelectItem value='INACTIVE'>Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant='outline'
            nativeButton={false}
            render={
              <Link href={`/admin/warehouses/${warehouse.id}/edit`}>
                <Edit3 className='mr-2 size-4' />
                Edit
              </Link>
            }
          />
        </div>
      </div>

      {/* Overview */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3'>
              <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
                <MapPin className='size-4 text-muted-foreground' />
              </div>

              <div className='min-w-0'>
                <p className='text-xs text-muted-foreground'>Location</p>

                <p className='mt-1 truncate text-sm font-medium'>
                  {warehouse.address}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3'>
              <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
                <UserRound className='size-4 text-muted-foreground' />
              </div>

              <div>
                <p className='text-xs text-muted-foreground'>
                  Warehouse manager
                </p>

                <p className='mt-1 text-sm font-medium'>
                  {warehouse.managerName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3'>
              <div className='flex size-9 items-center justify-center rounded-xl bg-muted'>
                <WarehouseIcon className='size-4 text-muted-foreground' />
              </div>

              <div>
                <p className='text-xs text-muted-foreground'>Status</p>

                <div className='mt-1'>
                  <StatusBadge status={warehouse.status} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse information */}
      <Card>
        <CardHeader className='border-b bg-muted/15 px-4 py-3 sm:px-5'>
          <CardTitle className='text-sm font-semibold'>
            Warehouse information
          </CardTitle>
        </CardHeader>

        <CardContent className='grid gap-5 p-4 sm:grid-cols-2 sm:p-5'>
          <div>
            <p className='text-xs text-muted-foreground'>Warehouse code</p>

            <p className='mt-1 font-mono text-sm font-medium'>
              {warehouse.code}
            </p>
          </div>

          <div>
            <p className='text-xs text-muted-foreground'>Manager</p>

            <p className='mt-1 text-sm font-medium'>{warehouse.managerName}</p>
          </div>

          <div className='sm:col-span-2'>
            <p className='text-xs text-muted-foreground'>Address</p>

            <p className='mt-1 text-sm font-medium'>{warehouse.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stock */}
      <div>
        <div className='mb-3'>
          <h2 className='text-sm font-semibold'>Warehouse stock</h2>

          <p className='mt-0.5 text-xs text-muted-foreground'>
            Current inventory held at this location.
          </p>
        </div>

        <WarehouseStock warehouseId={warehouse.id} />
      </div>
    </div>
  );
}

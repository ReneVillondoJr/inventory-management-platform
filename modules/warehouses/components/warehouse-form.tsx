'use client';

import { useMemo, useState, type FormEvent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, Save } from 'lucide-react';

import { seedData } from '@/data/seed/inventory-seed';

import { Button } from '@/components/shared/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

import { Textarea } from '@/components/ui/textarea';

import { useWarehouseForm } from '../hooks/use-warehouse-form';
import { warehouseSchema } from '../schemas/warehouse-schema';
import type { Warehouse, WarehouseStatus } from '../types/warehouse';

type WarehouseFormProps = {
  warehouse?: Warehouse;
};

const STATUS_OPTIONS: {
  value: WarehouseStatus;
  label: string;
}[] = [
  {
    value: 'ACTIVE',
    label: 'Active',
  },
  {
    value: 'INACTIVE',
    label: 'Inactive',
  },
];

export function WarehouseForm({ warehouse }: WarehouseFormProps) {
  const router = useRouter();

  const [error, setError] = useState('');

  const managers = useMemo(
    () =>
      seedData.users.filter((user) =>
        [
          'SUPER_ADMIN',
          'ADMIN',
          'INVENTORY_MANAGER',
          'WAREHOUSE_STAFF',
        ].includes(user.roleId),
      ),
    [],
  );

  const { values, isSaving, update, save } = useWarehouseForm({
    warehouse,
    onSuccess: (savedWarehouse) => {
      router.push(`/admin/warehouses/${savedWarehouse.id}`);
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    const result = warehouseSchema.safeParse(values);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Please review the form.');

      return;
    }

    try {
      await save();
    } catch (saveError) {
      setError(
        saveError instanceof Error ?
          saveError.message
        : 'Unable to save warehouse.',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex min-w-0 items-center gap-3'>
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
            <p className='text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground'>
              {warehouse ? 'Update warehouse' : 'Create warehouse'}
            </p>

            <h1 className='truncate text-2xl font-semibold tracking-tight sm:text-3xl'>
              {warehouse ? warehouse.name : 'New Warehouse'}
            </h1>
          </div>
        </div>

        <Button type='submit' className='shrink-0' disabled={isSaving}>
          <Save className='mr-2 size-4' />

          {isSaving ?
            'Saving...'
          : warehouse ?
            'Save changes'
          : 'Create warehouse'}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className='rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive'>
          {error}
        </div>
      )}

      {/* Form */}
      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]'>
        <Card>
          <CardHeader className='border-b bg-muted/15 px-4 py-3 sm:px-5'>
            <CardTitle className='text-sm font-semibold'>
              Warehouse details
            </CardTitle>
          </CardHeader>

          <CardContent className='p-4 sm:p-5'>
            <div className='grid gap-5 lg:grid-cols-[160px_minmax(0,1fr)]'>
              {/* Code */}
              <div className='space-y-2'>
                <Label htmlFor='code'>Code</Label>

                <Input
                  id='code'
                  value={values.code}
                  onChange={(event) =>
                    update('code', event.target.value.toUpperCase())
                  }
                  placeholder='WH-003'
                  className='h-9 font-mono text-sm'
                  maxLength={20}
                />

                <p className='text-xs text-muted-foreground'>
                  Unique warehouse identifier.
                </p>
              </div>

              {/* Name */}
              <div className='space-y-2'>
                <Label htmlFor='name'>Warehouse name</Label>

                <Input
                  id='name'
                  value={values.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder='North Distribution Center'
                  className='h-9'
                  maxLength={100}
                />
              </div>

              {/* Manager */}
              <div className='space-y-2'>
                <Label htmlFor='manager'>Manager</Label>

                <Select
                  value={values.managerId}
                  onValueChange={(value) => update('managerId', value ?? '')}
                >
                  <SelectTrigger id='manager' className='h-9 w-full'>
                    <SelectValue placeholder='Select manager' />
                  </SelectTrigger>

                  <SelectContent>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>

                <Select
                  value={values.status}
                  onValueChange={(value) =>
                    update('status', (value ?? 'ACTIVE') as WarehouseStatus)
                  }
                >
                  <SelectTrigger id='status' className='h-9 w-full'>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Address */}
              <div className='space-y-2 lg:col-span-2'>
                <Label htmlFor='address'>Address</Label>

                <Textarea
                  id='address'
                  value={values.address}
                  onChange={(event) => update('address', event.target.value)}
                  placeholder='Enter warehouse address...'
                  className='min-h-24 resize-none'
                  maxLength={200}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side summary */}
        <Card className='h-fit'>
          <CardHeader className='border-b bg-muted/15 px-4 py-3 sm:px-5'>
            <CardTitle className='text-sm font-semibold'>
              Warehouse summary
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-4 p-4 sm:p-5'>
            <div className='flex items-center justify-between gap-4 text-sm'>
              <span className='text-muted-foreground'>Code</span>

              <span className='font-mono font-medium'>
                {values.code || '—'}
              </span>
            </div>

            <div className='flex items-center justify-between gap-4 text-sm'>
              <span className='text-muted-foreground'>Manager</span>

              <span className='max-w-44 truncate text-right font-medium'>
                {managers.find((manager) => manager.id === values.managerId)
                  ?.name ?? '—'}
              </span>
            </div>

            <div className='flex items-center justify-between gap-4 text-sm'>
              <span className='text-muted-foreground'>Status</span>

              <span className='font-medium'>
                {STATUS_OPTIONS.find((option) => option.value === values.status)
                  ?.label ?? 'Active'}
              </span>
            </div>

            <div className='border-t pt-4'>
              <p className='text-xs leading-5 text-muted-foreground'>
                Warehouse stock is linked to this location and can be reviewed
                from the warehouse details page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

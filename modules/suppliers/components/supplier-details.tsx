'use client';

import Link from 'next/link';

import {
  ArrowLeft,
  Building2,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Truck,
  UserRound,
} from 'lucide-react';

import { useState } from 'react';

import { supplierService } from '../services/supplier-service';

import { Button } from '@/components/shared/button';
import { StatusBadge } from '@/components/shared/status-badge';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

import { SupplierOrders } from './supplier-orders';

type SupplierDetailsProps = {
  id: string;
};

export function SupplierDetails({ id }: SupplierDetailsProps) {
  const [supplier, setSupplier] = useState(() => supplierService.getById(id));

  if (!supplier) {
    return (
      <div className='flex min-h-64 items-center justify-center rounded-xl border border-dashed'>
        <div className='text-center'>
          <Truck className='mx-auto size-6 text-muted-foreground/50' />

          <p className='mt-3 font-medium'>Supplier not found</p>

          <p className='mt-1 text-sm text-muted-foreground'>
            The supplier may have been removed or does not exist.
          </p>

          <Button
            className='mt-4'
            nativeButton={false}
            render={<Link href='/admin/suppliers'>Back to suppliers</Link>}
          />
        </div>
      </div>
    );
  }

  const handleStatusChange = (value: string | null) => {
    if (!value) {
      return;
    }

    const updated = supplierService.updateStatus(
      supplier.id,
      value as 'ACTIVE' | 'INACTIVE',
    );

    setSupplier(updated);
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
            render={<Link href='/admin/suppliers' />}
          >
            <ArrowLeft className='size-4' />

            <span className='sr-only'>Back to suppliers</span>
          </Button>

          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='truncate text-2xl font-semibold tracking-tight sm:text-3xl'>
                {supplier.name}
              </h1>

              <StatusBadge status={supplier.status} />
            </div>

            <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground'>
              <span className='font-mono text-xs'>{supplier.code}</span>

              <span className='text-border'>/</span>

              <span>{supplier.contactName}</span>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Select value={supplier.status} onValueChange={handleStatusChange}>
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
              <Link href={`/admin/suppliers/${supplier.id}/edit`}>
                <Edit3 className='mr-2 size-4' />
                Edit
              </Link>
            }
          />
        </div>
      </div>

      {/* Supplier overview */}
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-start gap-3'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted'>
                <UserRound className='size-4 text-muted-foreground' />
              </div>

              <div className='min-w-0'>
                <p className='text-xs text-muted-foreground'>Contact person</p>

                <p className='mt-1 truncate text-sm font-medium'>
                  {supplier.contactName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-start gap-3'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted'>
                <Mail className='size-4 text-muted-foreground' />
              </div>

              <div className='min-w-0'>
                <p className='text-xs text-muted-foreground'>Email</p>

                <p className='mt-1 truncate text-sm font-medium'>
                  {supplier.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-start gap-3'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted'>
                <Phone className='size-4 text-muted-foreground' />
              </div>

              <div className='min-w-0'>
                <p className='text-xs text-muted-foreground'>Phone</p>

                <p className='mt-1 truncate text-sm font-medium'>
                  {supplier.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-start gap-3'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted'>
                <Building2 className='size-4 text-muted-foreground' />
              </div>

              <div className='min-w-0'>
                <p className='text-xs text-muted-foreground'>Supplier code</p>

                <p className='mt-1 font-mono text-sm font-medium'>
                  {supplier.code}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact information */}
      <Card>
        <CardHeader className='border-b bg-muted/15 px-4 py-3 sm:px-5'>
          <CardTitle className='text-sm font-semibold'>
            Supplier information
          </CardTitle>
        </CardHeader>

        <CardContent className='grid gap-5 p-4 sm:grid-cols-2 sm:p-5'>
          <div>
            <p className='text-xs text-muted-foreground'>Supplier name</p>

            <p className='mt-1 text-sm font-medium'>{supplier.name}</p>
          </div>

          <div>
            <p className='text-xs text-muted-foreground'>Contact person</p>

            <p className='mt-1 text-sm font-medium'>{supplier.contactName}</p>
          </div>

          <div className='flex items-start gap-3'>
            <Mail className='mt-0.5 size-4 shrink-0 text-muted-foreground' />

            <div className='min-w-0'>
              <p className='text-xs text-muted-foreground'>Email</p>

              <p className='mt-1 truncate text-sm font-medium'>
                {supplier.email}
              </p>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <Phone className='mt-0.5 size-4 shrink-0 text-muted-foreground' />

            <div>
              <p className='text-xs text-muted-foreground'>Phone</p>

              <p className='mt-1 text-sm font-medium'>{supplier.phone}</p>
            </div>
          </div>

          <div className='flex items-start gap-3 sm:col-span-2'>
            <MapPin className='mt-0.5 size-4 shrink-0 text-muted-foreground' />

            <div>
              <p className='text-xs text-muted-foreground'>Address</p>

              <p className='mt-1 text-sm font-medium'>{supplier.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase orders */}
      <div>
        <div className='mb-3'>
          <h2 className='text-sm font-semibold'>Purchase orders</h2>

          <p className='mt-0.5 text-xs text-muted-foreground'>
            Orders placed with this supplier.
          </p>
        </div>

        <SupplierOrders supplierId={supplier.id} />
      </div>
    </div>
  );
}

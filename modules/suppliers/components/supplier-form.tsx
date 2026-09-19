'use client';

import { useState, type FormEvent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, Save } from 'lucide-react';

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

import { useSupplierForm } from '../hooks/use-supplier-form';
import { supplierSchema } from '../schemas/supplier-schema';
import type { Supplier, SupplierStatus } from '../types/supplier';

type SupplierFormProps = {
  supplier?: Supplier;
};

const STATUS_OPTIONS: {
  value: SupplierStatus;
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

export function SupplierForm({ supplier }: SupplierFormProps) {
  const router = useRouter();

  const [error, setError] = useState('');

  const { values, isSaving, update, save } = useSupplierForm({
    supplier,
    onSuccess: (savedSupplier) => {
      router.push(`/admin/suppliers/${savedSupplier.id}`);
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    const result = supplierSchema.safeParse(values);

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
        : 'Unable to save supplier.',
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
            render={<Link href='/admin/suppliers' />}
          >
            <ArrowLeft className='size-4' />

            <span className='sr-only'>Back to suppliers</span>
          </Button>

          <div className='min-w-0'>
            <p className='text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground'>
              {supplier ? 'Update supplier' : 'Create supplier'}
            </p>

            <h1 className='truncate text-2xl font-semibold tracking-tight sm:text-3xl'>
              {supplier ? supplier.name : 'New Supplier'}
            </h1>
          </div>
        </div>

        <Button type='submit' className='shrink-0' disabled={isSaving}>
          <Save className='mr-2 size-4' />

          {isSaving ?
            'Saving...'
          : supplier ?
            'Save changes'
          : 'Create supplier'}
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
              Supplier details
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
                  placeholder='SUP-003'
                  className='h-9 font-mono text-sm'
                  maxLength={20}
                />

                <p className='text-xs text-muted-foreground'>
                  Unique supplier identifier.
                </p>
              </div>

              {/* Supplier name */}
              <div className='space-y-2'>
                <Label htmlFor='name'>Supplier name</Label>

                <Input
                  id='name'
                  value={values.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder='Supplier company name'
                  className='h-9'
                  maxLength={120}
                />
              </div>

              {/* Contact */}
              <div className='space-y-2'>
                <Label htmlFor='contactName'>Contact person</Label>

                <Input
                  id='contactName'
                  value={values.contactName}
                  onChange={(event) =>
                    update('contactName', event.target.value)
                  }
                  placeholder='Robert Lim'
                  className='h-9'
                  maxLength={100}
                />
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>

                <Input
                  id='email'
                  type='email'
                  value={values.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder='sales@supplier.example'
                  className='h-9'
                  maxLength={160}
                />
              </div>

              {/* Phone */}
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone</Label>

                <Input
                  id='phone'
                  type='tel'
                  value={values.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  placeholder='+63 917 555 1101'
                  className='h-9'
                  maxLength={30}
                />
              </div>

              {/* Status */}
              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>

                <Select
                  value={values.status}
                  onValueChange={(value) =>
                    update('status', (value ?? 'ACTIVE') as SupplierStatus)
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
                  placeholder='Enter supplier address...'
                  className='min-h-24 resize-none'
                  maxLength={200}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className='h-fit'>
          <CardHeader className='border-b bg-muted/15 px-4 py-3 sm:px-5'>
            <CardTitle className='text-sm font-semibold'>
              Supplier summary
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
              <span className='text-muted-foreground'>Contact</span>

              <span className='max-w-44 truncate text-right font-medium'>
                {values.contactName || '—'}
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
                Supplier order history and purchasing activity are available
                from the supplier details page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

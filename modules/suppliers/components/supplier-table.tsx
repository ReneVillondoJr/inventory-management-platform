'use client';

import Link from 'next/link';

import { Eye, MoreHorizontal, Pencil, Truck } from 'lucide-react';

import { Button } from '@/components/shared/button';
import { StatusBadge } from '@/components/shared/status-badge';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Supplier } from '../types/supplier';

type SupplierTableProps = {
  suppliers: Supplier[];
  onRefresh?: () => void;
};

export function SupplierTable({ suppliers }: SupplierTableProps) {
  return (
    <div className='overflow-hidden rounded-xl border border-border/70 bg-card'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/30 hover:bg-muted/30'>
              <TableHead className='min-w-32'>Code</TableHead>

              <TableHead className='min-w-56'>Supplier</TableHead>

              <TableHead className='min-w-44'>Contact</TableHead>

              <TableHead className='min-w-48'>Contact details</TableHead>

              <TableHead className='min-w-52'>Address</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className='w-12' />
            </TableRow>
          </TableHeader>

          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} className='group'>
                <TableCell>
                  <span className='font-mono text-xs font-medium'>
                    {supplier.code}
                  </span>
                </TableCell>

                <TableCell>
                  <Link
                    href={`/admin/suppliers/${supplier.id}`}
                    className='flex min-w-0 items-center gap-3'
                  >
                    <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted'>
                      <Truck className='size-4 text-muted-foreground' />
                    </div>

                    <div className='min-w-0'>
                      <p className='truncate font-medium transition-colors hover:text-primary'>
                        {supplier.name}
                      </p>

                      <p className='truncate text-xs text-muted-foreground'>
                        {supplier.code}
                      </p>
                    </div>
                  </Link>
                </TableCell>

                <TableCell>
                  <p className='truncate text-sm font-medium'>
                    {supplier.contactName}
                  </p>
                </TableCell>

                <TableCell>
                  <div className='min-w-0'>
                    <p className='truncate text-sm'>{supplier.email}</p>

                    <p className='truncate text-xs text-muted-foreground'>
                      {supplier.phone}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <p className='max-w-xs truncate text-sm'>
                    {supplier.address}
                  </p>
                </TableCell>

                <TableCell>
                  <StatusBadge status={supplier.status} />
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='size-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
                        />
                      }
                    >
                      <MoreHorizontal className='size-4' />

                      <span className='sr-only'>Open supplier actions</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align='end' className='w-40'>
                      <DropdownMenuItem
                        render={
                          <Link href={`/admin/suppliers/${supplier.id}`}>
                            <Eye className='mr-2 size-4' />
                            View supplier
                          </Link>
                        }
                      />

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        render={
                          <Link href={`/admin/suppliers/${supplier.id}/edit`}>
                            <Pencil className='mr-2 size-4' />
                            Edit supplier
                          </Link>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {suppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className='h-32 text-center'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <Truck className='size-5 text-muted-foreground/50' />

                    <div>
                      <p className='font-medium'>No suppliers found</p>

                      <p className='text-sm text-muted-foreground'>
                        Try adjusting your filters or create a new supplier.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

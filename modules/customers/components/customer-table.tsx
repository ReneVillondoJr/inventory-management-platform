'use client';

import Link from 'next/link';

import { Eye, MoreHorizontal, Pencil, UserRound } from 'lucide-react';

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

import type { Customer } from '../types/customer';

type CustomerTableProps = {
  customers: Customer[];
  onRefresh?: () => void;
};

export function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <div className='overflow-hidden rounded-xl border border-border/70 bg-card'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/30 hover:bg-muted/30'>
              <TableHead className='min-w-32'>Code</TableHead>

              <TableHead className='min-w-56'>Customer</TableHead>

              <TableHead className='min-w-44'>Contact</TableHead>

              <TableHead className='min-w-48'>Contact details</TableHead>

              <TableHead className='min-w-52'>Address</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className='w-12' />
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className='group'>
                <TableCell>
                  <span className='font-mono text-xs font-medium'>
                    {customer.code}
                  </span>
                </TableCell>

                <TableCell>
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className='flex min-w-0 items-center gap-3'
                  >
                    <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted'>
                      <UserRound className='size-4 text-muted-foreground' />
                    </div>

                    <div className='min-w-0'>
                      <p className='truncate font-medium transition-colors hover:text-primary'>
                        {customer.name}
                      </p>

                      <p className='truncate text-xs text-muted-foreground'>
                        {customer.code}
                      </p>
                    </div>
                  </Link>
                </TableCell>

                <TableCell>
                  <p className='truncate text-sm font-medium'>
                    {customer.contactName}
                  </p>
                </TableCell>

                <TableCell>
                  <div className='min-w-0'>
                    <p className='truncate text-sm'>{customer.email}</p>

                    <p className='truncate text-xs text-muted-foreground'>
                      {customer.phone}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <p className='max-w-xs truncate text-sm'>
                    {customer.address}
                  </p>
                </TableCell>

                <TableCell>
                  <StatusBadge status={customer.status} />
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

                      <span className='sr-only'>Open customer actions</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align='end' className='w-40'>
                      <DropdownMenuItem
                        render={
                          <Link href={`/admin/customers/${customer.id}`}>
                            <Eye className='mr-2 size-4' />
                            View customer
                          </Link>
                        }
                      />

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        render={
                          <Link href={`/admin/customers/${customer.id}/edit`}>
                            <Pencil className='mr-2 size-4' />
                            Edit customer
                          </Link>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className='h-32 text-center'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <UserRound className='size-5 text-muted-foreground/50' />

                    <div>
                      <p className='font-medium'>No customers found</p>

                      <p className='text-sm text-muted-foreground'>
                        Try adjusting your filters or create a new customer.
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

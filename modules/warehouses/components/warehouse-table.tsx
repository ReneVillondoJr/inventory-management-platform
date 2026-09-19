'use client';

import Link from 'next/link';

import {
  Eye,
  MoreHorizontal,
  Pencil,
  Warehouse as WarehouseIcon,
} from 'lucide-react';

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

import type { Warehouse } from '../types/warehouse';

type WarehouseTableProps = {
  warehouses: Warehouse[];
  onRefresh?: () => void;
};

export function WarehouseTable({ warehouses }: WarehouseTableProps) {
  return (
    <div className='overflow-hidden rounded-xl border border-border/70 bg-card'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/30 hover:bg-muted/30'>
              <TableHead className='min-w-32'>Code</TableHead>

              <TableHead className='min-w-56'>Warehouse</TableHead>

              <TableHead className='min-w-52'>Address</TableHead>

              <TableHead className='min-w-40'>Manager</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className='w-12' />
            </TableRow>
          </TableHeader>

          <TableBody>
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse.id} className='group'>
                <TableCell>
                  <span className='font-mono text-xs font-medium'>
                    {warehouse.code}
                  </span>
                </TableCell>

                <TableCell>
                  <Link
                    href={`/admin/warehouses/${warehouse.id}`}
                    className='flex min-w-0 items-center gap-3'
                  >
                    <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted'>
                      <WarehouseIcon className='size-4 text-muted-foreground' />
                    </div>

                    <div className='min-w-0'>
                      <p className='truncate font-medium transition-colors hover:text-primary'>
                        {warehouse.name}
                      </p>

                      <p className='truncate text-xs text-muted-foreground'>
                        {warehouse.code}
                      </p>
                    </div>
                  </Link>
                </TableCell>

                <TableCell>
                  <p className='max-w-xs truncate text-sm'>
                    {warehouse.address}
                  </p>
                </TableCell>

                <TableCell>
                  <p className='truncate text-sm'>{warehouse.managerName}</p>
                </TableCell>

                <TableCell>
                  <StatusBadge status={warehouse.status} />
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

                      <span className='sr-only'>Open warehouse actions</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align='end' className='w-40'>
                      <DropdownMenuItem
                        render={
                          <Link href={`/admin/warehouses/${warehouse.id}`}>
                            <Eye className='mr-2 size-4' />
                            View warehouse
                          </Link>
                        }
                      />

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        render={
                          <Link href={`/admin/warehouses/${warehouse.id}/edit`}>
                            <Pencil className='mr-2 size-4' />
                            Edit warehouse
                          </Link>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {warehouses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='h-32 text-center'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <WarehouseIcon className='size-5 text-muted-foreground/50' />

                    <div>
                      <p className='font-medium'>No warehouses found</p>

                      <p className='text-sm text-muted-foreground'>
                        Try adjusting your filters or create a new warehouse.
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

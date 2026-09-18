import type { Key, ReactNode } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { EmptyState } from './empty-state';
import { LoadingState } from './loading-state';

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey?: (row: T, index: number) => Key;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  className?: string;
};

export function DataTable<T>({
  data,
  columns,
  rowKey = (_, index) => index,
  loading = false,
  emptyTitle = 'No results found',
  emptyDescription = 'There is nothing to display here yet.',
  emptyAction,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingState />;
  }

  if (data.length === 0) {
    return (
      <div className='rounded-xl border border-border/70 bg-card'>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border border-border/70 bg-card ${
        className ?? ''
      }`}
    >
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/30 hover:bg-muted/30'>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={column.headerClassName ?? column.className}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, index) => (
              <TableRow key={rowKey(row, index)} className='group'>
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.className}>
                    {column.cell ? column.cell(row, index) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationProps } from '@/types/pagination';
import { Button } from '@/components/shared/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      'ellipsis',
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ] as const;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;

  const end = Math.min(safePage * pageSize, total);

  const pageNumbers = getPageNumbers(safePage, totalPages);

  if (total === 0) {
    return null;
  }

  return (
    <div className='flex flex-col gap-3 border-t border-border/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
      <div className='text-xs text-muted-foreground'>
        Showing <span className='font-medium text-foreground'>{start}</span> to{' '}
        <span className='font-medium text-foreground'>{end}</span> of{' '}
        <span className='font-medium text-foreground'>{total}</span>
      </div>

      <div className='flex items-center justify-between gap-3 sm:justify-end'>
        {showPageSize && onPageSizeChange && (
          <div className='flex items-center gap-2'>
            <span className='hidden text-xs text-muted-foreground sm:inline'>
              Rows
            </span>

            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                if (value) {
                  onPageSizeChange(Number(value));
                  onPageChange(1);
                }
              }}
            >
              <SelectTrigger className='h-8 w-20'>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className='flex items-center gap-1'>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
          >
            <ChevronLeft className='size-4' />

            <span className='sr-only'>Previous page</span>
          </Button>

          {pageNumbers.map((pageNumber, index) => {
            if (pageNumber === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='flex size-8 items-center justify-center text-xs text-muted-foreground'
                >
                  …
                </span>
              );
            }

            return (
              <Button
                key={pageNumber}
                type='button'
                variant={pageNumber === safePage ? 'default' : 'outline'}
                size='icon'
                className='size-8 text-xs'
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
          >
            <ChevronRight className='size-4' />

            <span className='sr-only'>Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';

import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';

type FilterBarProps = {
  children: ReactNode;
  hasFilters?: boolean;
  onReset?: () => void;
  resetLabel?: string;
  gridClassName?: string;
  className?: string;
};

export function FilterBar({
  children,
  hasFilters = false,
  onReset,
  resetLabel = 'Reset',
  gridClassName = 'md:grid-cols-[1fr_200px_180px_150px_auto]',
  className,
}: FilterBarProps) {
  return (
    <Card className={className}>
      <CardContent className='p-4'>
        <div className={`grid items-center gap-3 ${gridClassName}`}>
          {children}

          {hasFilters && onReset ?
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={onReset}
              className='h-9 w-fit justify-self-start px-2.5'
            >
              <RotateCcw className='size-4' />
              {resetLabel}
            </Button>
          : null}
        </div>
      </CardContent>
    </Card>
  );
}

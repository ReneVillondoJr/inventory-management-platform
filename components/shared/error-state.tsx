'use client';

import { AlertCircle, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this information. Please try again.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <div className='flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center'>
      <div className='flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive'>
        <AlertCircle className='size-5' />
      </div>

      <h3 className='mt-4 text-sm font-semibold'>{title}</h3>

      <p className='mt-1 max-w-md text-sm leading-6 text-muted-foreground'>
        {description}
      </p>

      {onRetry && (
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='mt-4'
          onClick={onRetry}
        >
          <RefreshCcw className='mr-2 size-4' />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

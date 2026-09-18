import type { ReactNode } from 'react';

import { Inbox } from 'lucide-react';

import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title = 'No results found',
  description = 'There is nothing to display here yet.',
  icon,
  action,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className='flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center'>
      <div className='flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground'>
        {icon ?? <Inbox className='size-5' />}
      </div>

      <h3 className='mt-4 text-sm font-semibold'>{title}</h3>

      <p className='mt-1 max-w-md text-sm leading-6 text-muted-foreground'>
        {description}
      </p>

      {action && <div className='mt-4'>{action}</div>}

      {!action && actionLabel && onAction && (
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='mt-4'
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

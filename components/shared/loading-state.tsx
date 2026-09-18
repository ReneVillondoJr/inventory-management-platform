import { Loader2 } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

type LoadingStateProps = {
  label?: string;
  rows?: number;
  className?: string;
};

export function LoadingState({
  label = 'Loading...',
  rows = 3,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={`space-y-4 rounded-xl border border-border/70 bg-card p-5 ${
        className ?? ''
      }`}
    >
      <div className='flex items-center gap-3'>
        <Loader2 className='size-4 animate-spin text-muted-foreground' />

        <p className='text-sm text-muted-foreground'>{label}</p>
      </div>

      <div className='space-y-3'>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className='grid grid-cols-[1fr_120px] gap-4'>
            <Skeleton className='h-9 w-full' />
            <Skeleton className='h-9 w-full' />
          </div>
        ))}
      </div>
    </div>
  );
}

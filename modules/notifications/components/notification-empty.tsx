import { BellOff } from 'lucide-react';

export function NotificationEmpty() {
  return (
    <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 py-14 text-center'>
      <div className='flex size-10 items-center justify-center rounded-full bg-muted'>
        <BellOff className='size-5 text-muted-foreground' />
      </div>

      <p className='mt-4 text-sm font-medium text-foreground'>
        No notifications
      </p>

      <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
        You&apos;re all caught up. New inventory and operational alerts will
        appear here.
      </p>
    </div>
  );
}

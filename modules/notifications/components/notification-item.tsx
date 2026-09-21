'use client';

import { useRouter } from 'next/navigation';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { notificationConfig } from '../data/notification-config';
import type { Notification } from '../types/notification';

type NotificationItemProps = {
  notification: Notification;
  onRead: (notificationId: string) => void;
};

export function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const router = useRouter();

  const { icon: Icon } = notificationConfig[notification.type];

  const handleSelect = () => {
    if (!notification.read) {
      onRead(notification.id);
    }

    router.push(notification.href);
  };

  return (
    <DropdownMenuItem
      className='rounded-lg px-2.5 py-2.5 focus:bg-muted'
      onSelect={handleSelect}
    >
      <div className='flex w-full items-start gap-3'>
        <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted'>
          <Icon className='size-4 text-muted-foreground' />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-start gap-2'>
            <p
              className={[
                'min-w-0 flex-1 truncate text-sm',
                notification.read ?
                  'font-medium text-foreground'
                : 'font-semibold text-foreground',
              ].join(' ')}
            >
              {notification.title}
            </p>

            {!notification.read && (
              <span className='mt-1.5 size-1.5 shrink-0 rounded-full bg-primary' />
            )}
          </div>

          <p className='mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground'>
            {notification.message}
          </p>
        </div>
      </div>
    </DropdownMenuItem>
  );
}

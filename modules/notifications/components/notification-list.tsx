'use client';

import { useRouter } from 'next/navigation';

import { notificationConfig } from '../data/notification-config';
import type { Notification } from '../types/notification';

type NotificationListProps = {
  notifications: Notification[];
  onRead: (notificationId: string) => void;
};

export function NotificationList({
  notifications,
  onRead,
}: NotificationListProps) {
  const router = useRouter();

  return (
    <div className='divide-y divide-border/60 rounded-xl border border-border/60 bg-card'>
      {notifications.map((notification) => {
        const { icon: Icon } = notificationConfig[notification.type];

        const handleClick = () => {
          if (!notification.read) {
            onRead(notification.id);
          }

          router.push(notification.href);
        };

        return (
          <button
            key={notification.id}
            type='button'
            onClick={handleClick}
            className='flex w-full items-start gap-4 px-4 py-4 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/50'
          >
            <div className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted'>
              <Icon className='size-4 text-muted-foreground' />
            </div>

            <div className='min-w-0 flex-1'>
              <div className='flex items-start gap-3'>
                <p
                  className={[
                    'min-w-0 flex-1 text-sm',
                    notification.read ?
                      'font-medium text-foreground'
                    : 'font-semibold text-foreground',
                  ].join(' ')}
                >
                  {notification.title}
                </p>

                {!notification.read && (
                  <span className='mt-1.5 size-2 shrink-0 rounded-full bg-primary' />
                )}
              </div>

              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                {notification.message}
              </p>
            </div>

            <span className='shrink-0 pt-0.5 text-[11px] font-medium text-muted-foreground'>
              {notification.read ? 'Read' : 'New'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

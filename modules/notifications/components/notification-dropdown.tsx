'use client';

import { useRouter } from 'next/navigation';

import { CheckCheck, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { NotificationEmpty } from './notification-empty';
import { NotificationItem } from './notification-item';

import type { Notification } from '../types/notification';

type NotificationDropdownProps = {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
};

export function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  const router = useRouter();

  const latestNotifications = notifications.slice(0, 5);

  const handleViewAll = () => {
    router.push('/admin/notifications');
  };

  return (
    <div className='w-full'>
      <DropdownMenuGroup>
        <DropdownMenuLabel className='px-3 py-2.5'>
          <div className='flex items-center justify-between gap-3'>
            <div className='min-w-0'>
              <div className='flex items-center gap-1.5'>
                <p className='text-sm font-semibold text-foreground'>
                  Notifications
                </p>

                {unreadCount > 0 && (
                  <span
                    className='size-1.5 shrink-0 rounded-full bg-primary'
                    aria-hidden='true'
                  />
                )}
              </div>

              <p className='mt-0.5 text-[11px] text-muted-foreground'>
                {unreadCount > 0 ?
                  `${unreadCount} unread notification${
                    unreadCount === 1 ? '' : 's'
                  }`
                : 'You are all caught up'}
              </p>
            </div>

            {unreadCount > 0 && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={onMarkAllAsRead}
                className='h-7 shrink-0 px-2 text-[11px] text-muted-foreground hover:text-foreground'
              >
                <CheckCheck className='size-3.5' />
                Mark all read
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      {latestNotifications.length > 0 ?
        <div
          role='group'
          aria-label='Recent notifications'
          className='max-h-80 overflow-y-auto p-1'
        >
          {latestNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={onMarkAsRead}
            />
          ))}
        </div>
      : <div className='p-3'>
          <NotificationEmpty />
        </div>
      }

      <DropdownMenuSeparator />

      <DropdownMenuGroup className='bg-muted/30 p-1'>
        <DropdownMenuItem
          className='rounded-lg px-2.5 py-2 focus:bg-muted'
          onSelect={handleViewAll}
        >
          <ExternalLink className='size-4 text-muted-foreground' />
          <span>View all notifications</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </div>
  );
}

'use client';

import { Bell } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useNotifications } from '../hooks/use-notifications';

import { NotificationDropdown } from './notification-dropdown';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='Notifications'
        className='relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      >
        <Bell className='size-4' />

        {unreadCount > 0 && (
          <>
            <span className='absolute right-1 top-1 size-1.5 rounded-full bg-destructive' />

            {unreadCount > 1 && (
              <span className='absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold leading-4 text-destructive-foreground'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='w-96 overflow-hidden rounded-xl border-border/70 p-0 shadow-xl'
      >
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

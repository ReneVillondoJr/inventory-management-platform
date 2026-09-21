'use client';

import { Bell, CheckCheck, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { NotificationEmpty } from './notification-empty';
import { NotificationList } from './notification-list';

import { useNotifications } from '../hooks/use-notifications';

export function NotificationsPage() {
  const {
    filteredNotifications,
    unreadCount,
    filter,
    setFilter,
    isLoading,
    markAsRead,
    markAllAsRead,
    reset,
  } = useNotifications();

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
            Administration
          </p>

          <div className='mt-1 flex items-center gap-2.5'>
            <Bell className='size-5 text-muted-foreground' />

            <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>
              Notifications
            </h1>
          </div>

          <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
            Review inventory, transfer, return, and operational alerts.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {unreadCount > 0 && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={markAllAsRead}
            >
              <CheckCheck className='size-4' />
              Mark all read
            </Button>
          )}

          <Button type='button' variant='ghost' size='sm' onClick={reset}>
            <RotateCcw className='size-4' />
            Reset demo
          </Button>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Button
          type='button'
          variant={filter === 'ALL' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setFilter('ALL')}
        >
          All
        </Button>

        <Button
          type='button'
          variant={filter === 'UNREAD' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setFilter('UNREAD')}
        >
          Unread
          {unreadCount > 0 && (
            <span className='ml-1 rounded-full bg-background/20 px-1.5 text-[10px]'>
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {isLoading ?
        <div className='rounded-xl border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground'>
          Loading notifications...
        </div>
      : filteredNotifications.length > 0 ?
        <NotificationList
          notifications={filteredNotifications}
          onRead={markAsRead}
        />
      : <NotificationEmpty />}
    </div>
  );
}

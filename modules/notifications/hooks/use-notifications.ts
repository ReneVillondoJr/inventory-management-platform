'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

import {
  getNotificationsForCurrentUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  NOTIFICATION_CHANGE_EVENT,
  resetNotifications,
} from '../services/notification-service';

import type { Notification, NotificationFilter } from '../types/notification';

const EMPTY_NOTIFICATIONS: Notification[] = [];

let snapshotKey = '';
let snapshotValue: Notification[] = EMPTY_NOTIFICATIONS;

function getSnapshot(): Notification[] {
  if (typeof window === 'undefined') {
    return EMPTY_NOTIFICATIONS;
  }

  const notifications = getNotificationsForCurrentUser();
  const nextKey = JSON.stringify(notifications);

  if (nextKey !== snapshotKey) {
    snapshotKey = nextKey;
    snapshotValue = notifications;
  }

  return snapshotValue;
}

function getServerSnapshot(): Notification[] {
  return EMPTY_NOTIFICATIONS;
}

function subscribe(callback: () => void) {
  window.addEventListener(NOTIFICATION_CHANGE_EVENT, callback);
  window.addEventListener('inventory-role-change', callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(NOTIFICATION_CHANGE_EVENT, callback);
    window.removeEventListener('inventory-role-change', callback);
    window.removeEventListener('storage', callback);
  };
}

export function useNotifications() {
  const notifications = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const [filter, setFilter] = useState<NotificationFilter>('ALL');

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (filter === 'UNREAD') {
      return notifications.filter((notification) => !notification.read);
    }

    return notifications;
  }, [filter, notifications]);

  const markAsRead = useCallback((notificationId: string) => {
    markNotificationAsRead(notificationId);
  }, []);

  const markAllAsRead = useCallback(() => {
    markAllNotificationsAsRead();
  }, []);

  const reset = useCallback(() => {
    resetNotifications();
  }, []);

  return {
    notifications,
    filteredNotifications,
    unreadCount,
    filter,
    setFilter,
    isLoading: false,
    markAsRead,
    markAllAsRead,
    reset,
    refresh: () => {
      snapshotKey = '';
    },
  };
}

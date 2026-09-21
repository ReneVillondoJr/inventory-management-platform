import { seedData } from '@/data/seed/inventory-seed';
import { getStoredRole } from '@/lib/rbac';

import { notificationConfig } from '../data/notification-config';
import { notificationSchema } from '../schemas/notification-schema';
import type { Notification } from '../types/notification';

const STORAGE_PREFIX = 'inventory-notifications';

export const NOTIFICATION_CHANGE_EVENT = 'inventory-notifications-change';

type SeedNotification = (typeof seedData.notifications)[number];

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`;
}

function getReadState(userId: string): Record<string, boolean> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(getStorageKey(userId));

    if (!stored) {
      return {};
    }

    const parsed: unknown = JSON.parse(stored);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    const readState: Record<string, boolean> = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'boolean') {
        readState[key] = value;
      }
    }

    return readState;
  } catch {
    return {};
  }
}

function saveReadState(userId: string, readState: Record<string, boolean>) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      getStorageKey(userId),
      JSON.stringify(readState),
    );

    window.dispatchEvent(new CustomEvent(NOTIFICATION_CHANGE_EVENT));
  } catch {
    // Temporary demo storage only.
  }
}

function getCurrentUserId(): string {
  const role = getStoredRole();

  const roleRecord = seedData.roles.find(
    (candidate) => candidate.name === role,
  );

  if (!roleRecord) {
    return 'user_alex';
  }

  const user = seedData.users.find(
    (candidate) =>
      candidate.roleId === roleRecord.id && candidate.status === 'ACTIVE',
  );

  return user?.id ?? 'user_alex';
}

function getSeedNotifications(): SeedNotification[] {
  return [...seedData.notifications];
}

export function getCurrentNotificationUserId() {
  return getCurrentUserId();
}

export function getNotificationsForCurrentUser(): Notification[] {
  const role = getStoredRole();
  const currentUserId = getCurrentUserId();

  const notifications = getSeedNotifications();

  const visibleNotifications =
    role === 'SUPER_ADMIN' ? notifications : (
      notifications.filter(
        (notification) => notification.userId === currentUserId,
      )
    );

  const parsedNotifications = notificationSchema
    .array()
    .parse(visibleNotifications);

  const storageUserId = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : currentUserId;

  const readState = getReadState(storageUserId);

  return parsedNotifications.map((notification) => ({
    ...notification,
    read: readState[notification.id] ?? notification.read,
    href: notificationConfig[notification.type].href,
  }));
}

export function markNotificationAsRead(notificationId: string) {
  const role = getStoredRole();
  const currentUserId = getCurrentUserId();

  const storageUserId = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : currentUserId;

  const currentReadState = getReadState(storageUserId);

  saveReadState(storageUserId, {
    ...currentReadState,
    [notificationId]: true,
  });
}

export function markAllNotificationsAsRead() {
  const role = getStoredRole();
  const currentUserId = getCurrentUserId();

  const storageUserId = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : currentUserId;

  const notifications = getSeedNotifications();

  const visibleNotifications =
    role === 'SUPER_ADMIN' ? notifications : (
      notifications.filter(
        (notification) => notification.userId === currentUserId,
      )
    );

  const readState: Record<string, boolean> = {};

  for (const notification of visibleNotifications) {
    readState[notification.id] = true;
  }

  saveReadState(storageUserId, readState);
}

export function resetNotifications() {
  const role = getStoredRole();
  const currentUserId = getCurrentUserId();

  const storageUserId = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : currentUserId;

  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(getStorageKey(storageUserId));

    window.dispatchEvent(new CustomEvent(NOTIFICATION_CHANGE_EVENT));
  } catch {
    // Temporary demo storage only.
  }
}

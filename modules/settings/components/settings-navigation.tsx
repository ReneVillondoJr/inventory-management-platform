import type { LucideIcon } from 'lucide-react';
import { Bell, Lock, Settings2, User } from 'lucide-react';

export type SettingsNavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const settingsNavigation: SettingsNavigationItem[] = [
  {
    title: 'Profile',
    href: '/admin/settings/profile',
    icon: User,
  },
  {
    title: 'Notifications',
    href: '/admin/settings/notifications',
    icon: Bell,
  },
  {
    title: 'Security',
    href: '/admin/settings/security',
    icon: Lock,
  },
  {
    title: 'System',
    href: '/admin/settings/system',
    icon: Settings2,
  },
];

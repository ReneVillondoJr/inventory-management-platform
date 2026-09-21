import { BookOpen, CircleAlert, Info, LifeBuoy, Keyboard } from 'lucide-react';

import type { HelpNavigationItem } from '../types/help';

export const helpNavigation: HelpNavigationItem[] = [
  {
    title: 'Documentation',
    description: 'Learn how to use the inventory platform.',
    href: '/admin/help/documentation',
    icon: BookOpen,
  },
  {
    title: 'Keyboard shortcuts',
    description: 'View available keyboard commands.',
    href: '/admin/help/shortcuts',
    icon: Keyboard,
  },
  {
    title: 'Contact support',
    description: 'Get assistance with the system.',
    href: '/admin/help/support',
    icon: LifeBuoy,
  },
  {
    title: 'Report a problem',
    description: 'Report an issue or unexpected behavior.',
    href: '/admin/help/report',
    icon: CircleAlert,
  },
  {
    title: 'About the system',
    description: 'View system and application information.',
    href: '/admin/help/about',
    icon: Info,
  },
];

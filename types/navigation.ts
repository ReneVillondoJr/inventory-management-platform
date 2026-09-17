import type { LucideIcon } from 'lucide-react';

import type { ModuleKey } from '@/lib/auth/permissions';

export type NavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  moduleKey?: ModuleKey;
};

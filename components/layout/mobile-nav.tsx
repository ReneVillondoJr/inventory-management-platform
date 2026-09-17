'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import { adminNavigation } from '@/data/navigation/admin-navigation';
import { type RoleName } from '@/lib/auth/permissions';
import { canAccessModule, getStoredRole } from '@/lib/rbac';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<RoleName>('SUPER_ADMIN');

  useEffect(() => {
    const syncRole = () => setRole(getStoredRole());

    syncRole();
    window.addEventListener('inventory-role-change', syncRole);
    return () => window.removeEventListener('inventory-role-change', syncRole);
  }, []);

  const navigation = useMemo(
    () =>
      adminNavigation
        .filter(({ moduleKey }) => {
          if (!moduleKey) return true;
          return canAccessModule(role, moduleKey);
        })
        .slice(0, 4),
    [role],
  );

  return (
    <nav className='border-t border-border/60 bg-background/95 backdrop-blur md:hidden'>
      <ul className='grid grid-cols-4 gap-1 p-2'>
        {navigation.map(({ title, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-2',
                  'text-[10px] font-medium transition-colors',
                  isActive ?
                    'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                )}
              >
                <Icon className='size-4 shrink-0' />
                <span className='max-w-full truncate'>{title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

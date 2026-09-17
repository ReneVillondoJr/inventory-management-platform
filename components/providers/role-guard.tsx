'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  canAccessModule,
  DEFAULT_ROLE,
  getModuleForPathname,
  getStoredRole,
} from '@/lib/rbac';
import type { RoleName } from '@/lib/auth/permissions';

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<RoleName>(DEFAULT_ROLE);

  useEffect(() => {
    const syncRole = () => setRole(getStoredRole());

    syncRole();
    window.addEventListener('inventory-role-change', syncRole);
    window.addEventListener('storage', syncRole);

    return () => {
      window.removeEventListener('inventory-role-change', syncRole);
      window.removeEventListener('storage', syncRole);
    };
  }, []);

  useEffect(() => {
    if (!canAccessModule(role, getModuleForPathname(pathname))) {
      router.replace('/admin/dashboard');
    }
  }, [pathname, role, router]);

  return children;
}

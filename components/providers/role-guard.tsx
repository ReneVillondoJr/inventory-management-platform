'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  canAccessModule,
  DEFAULT_ROLE,
  getModuleForPathname,
  getStoredRole,
  hasTestSession,
} from '@/lib/rbac';
import type { RoleName } from '@/lib/auth/permissions';

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<RoleName>(DEFAULT_ROLE);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncRole = () => {
      setRole(getStoredRole());
      setIsAuthenticated(hasTestSession());
      setIsReady(true);
    };

    syncRole();
    window.addEventListener('inventory-role-change', syncRole);
    window.addEventListener('storage', syncRole);

    return () => {
      window.removeEventListener('inventory-role-change', syncRole);
      window.removeEventListener('storage', syncRole);
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!canAccessModule(role, getModuleForPathname(pathname))) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, isReady, pathname, role, router]);

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return children;
}

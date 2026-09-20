import {
  rolePermissions,
  type ModuleKey,
  type PermissionLevel,
  type RoleName,
} from '@/lib/auth/permissions';

export const DEFAULT_ROLE: RoleName = 'SUPER_ADMIN';
const TEST_SESSION_KEY = 'inventory-test-session';

export function getStoredRole(): RoleName {
  if (typeof window === 'undefined') {
    return DEFAULT_ROLE;
  }

  const stored = window.localStorage.getItem('inventory-role');

  if (stored && stored in rolePermissions) {
    return stored as RoleName;
  }

  return DEFAULT_ROLE;
}

export function setStoredRole(role: RoleName) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('inventory-role', role);
  window.dispatchEvent(new Event('inventory-role-change'));
}

export function hasTestSession() {
  return (
    typeof window !== 'undefined' &&
    window.localStorage.getItem(TEST_SESSION_KEY) === 'active'
  );
}

export function startTestSession(role: RoleName) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(TEST_SESSION_KEY, 'active');
  setStoredRole(role);
}

export function clearTestSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(TEST_SESSION_KEY);
  window.localStorage.removeItem('inventory-role');
  window.dispatchEvent(new Event('inventory-role-change'));
}

export function getModuleAccess(
  role: RoleName,
  moduleName: ModuleKey,
): PermissionLevel {
  return rolePermissions[role]?.[moduleName] ?? 'none';
}

export function canAccessModule(role: RoleName, moduleName: ModuleKey) {
  return getModuleAccess(role, moduleName) !== 'none';
}

export function canViewModule(role: RoleName, moduleName: ModuleKey) {
  const access = getModuleAccess(role, moduleName);
  return access === 'full' || access === 'view' || access === 'limited';
}

export function isReadOnlyModule(role: RoleName, moduleName: ModuleKey) {
  return getModuleAccess(role, moduleName) === 'view';
}

export function getModuleForPathname(pathname: string): ModuleKey {
  if (pathname.startsWith('/admin/activity-logs')) {
    return 'activityLogs';
  }
  if (pathname.startsWith('/admin/users')) {
    return 'users';
  }
  if (pathname.startsWith('/admin/permissions')) {
    return 'roles';
  }
  if (pathname.startsWith('/admin/operations/stock-transfers')) {
    return 'stockTransfers';
  }
  if (pathname.startsWith('/admin/operations/sales-orders')) {
    return 'salesOrders';
  }
  if (pathname.startsWith('/admin/operations/purchase-orders')) {
    return 'purchaseOrders';
  }
  if (pathname.startsWith('/admin/inventory/products')) {
    return 'products';
  }
  if (pathname.startsWith('/admin/inventory')) {
    return 'inventory';
  }
  if (pathname.startsWith('/admin/warehouses')) {
    return 'warehouses';
  }
  if (pathname.startsWith('/admin/suppliers')) {
    return 'suppliers';
  }
  if (pathname.startsWith('/admin/customers')) {
    return 'customers';
  }
  if (pathname.startsWith('/admin/reports')) {
    return 'reports';
  }
  if (pathname.startsWith('/admin/settings')) {
    return 'settings';
  }
  if (pathname.startsWith('/admin/roles')) {
    return 'roles';
  }

  return 'dashboard';
}

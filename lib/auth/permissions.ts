export type PermissionLevel = 'full' | 'limited' | 'view' | 'none';

export type ModuleKey =
  | 'dashboard'
  | 'inventory'
  | 'products'
  | 'purchaseOrders'
  | 'salesOrders'
  | 'warehouses'
  | 'suppliers'
  | 'customers'
  | 'reports'
  | 'settings'
  | 'roles'
  | 'activityLogs'
  | 'users'
  | 'stockTransfers';

export type RoleName =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_STAFF'
  | 'SALES_STAFF';

export const rolePermissions: Record<
  RoleName,
  Record<ModuleKey, PermissionLevel>
> = {
  SUPER_ADMIN: {
    dashboard: 'full',
    inventory: 'full',
    products: 'full',
    purchaseOrders: 'full',
    salesOrders: 'full',
    warehouses: 'full',
    suppliers: 'full',
    customers: 'full',
    reports: 'full',
    settings: 'full',
    roles: 'full',
    activityLogs: 'full',
    users: 'full',
    stockTransfers: 'full',
  },
  ADMIN: {
    dashboard: 'full',
    inventory: 'full',
    products: 'full',
    purchaseOrders: 'full',
    salesOrders: 'full',
    warehouses: 'full',
    suppliers: 'full',
    customers: 'full',
    reports: 'full',
    settings: 'view',
    roles: 'view',
    activityLogs: 'view',
    users: 'full',
    stockTransfers: 'full',
  },
  INVENTORY_MANAGER: {
    dashboard: 'full',
    inventory: 'full',
    products: 'full',
    purchaseOrders: 'full',
    salesOrders: 'view',
    warehouses: 'full',
    suppliers: 'view',
    customers: 'view',
    reports: 'full',
    settings: 'view',
    roles: 'none',
    activityLogs: 'view',
    users: 'none',
    stockTransfers: 'full',
  },
  WAREHOUSE_STAFF: {
    dashboard: 'limited',
    inventory: 'full',
    products: 'view',
    purchaseOrders: 'view',
    salesOrders: 'none',
    warehouses: 'full',
    suppliers: 'view',
    customers: 'none',
    reports: 'view',
    settings: 'none',
    roles: 'none',
    activityLogs: 'none',
    users: 'none',
    stockTransfers: 'full',
  },
  SALES_STAFF: {
    dashboard: 'limited',
    inventory: 'view',
    products: 'view',
    purchaseOrders: 'none',
    salesOrders: 'full',
    warehouses: 'view',
    suppliers: 'view',
    customers: 'full',
    reports: 'view',
    settings: 'none',
    roles: 'none',
    activityLogs: 'none',
    users: 'none',
    stockTransfers: 'none',
  },
};

export function canEditModule(role: RoleName, moduleName: ModuleKey) {
  const access = rolePermissions[role]?.[moduleName] ?? 'none';
  return access === 'full' || access === 'limited';
}

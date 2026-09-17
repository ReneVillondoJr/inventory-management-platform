import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
} from 'lucide-react';

import type { NavigationItem } from '@/types/navigation';

export const adminNavigation: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    moduleKey: 'dashboard',
  },
  {
    title: 'Inventory',
    href: '/admin/inventory',
    icon: Boxes,
    moduleKey: 'inventory',
  },
  {
    title: 'Products',
    href: '/admin/inventory/products',
    icon: Package,
    moduleKey: 'products',
  },
  {
    title: 'Purchase Orders',
    href: '/admin/operations/purchase-orders',
    icon: ClipboardList,
    moduleKey: 'purchaseOrders',
  },
  {
    title: 'Sales Orders',
    href: '/admin/operations/sales-orders',
    icon: ShoppingCart,
    moduleKey: 'salesOrders',
  },
  {
    title: 'Warehouses',
    href: '/admin/warehouses',
    icon: Warehouse,
    moduleKey: 'warehouses',
  },
  {
    title: 'Suppliers',
    href: '/admin/suppliers',
    icon: Truck,
    moduleKey: 'suppliers',
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
    moduleKey: 'customers',
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
    moduleKey: 'reports',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    moduleKey: 'settings',
  },
];

import type { LucideIcon } from 'lucide-react';
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

export type NavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavigation: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Inventory',
    href: '/admin/inventory',
    icon: Boxes,
  },
  {
    title: 'Products',
    href: '/admin/inventory/products',
    icon: Package,
  },
  {
    title: 'Purchase Orders',
    href: '/admin/operations/purchase-orders',
    icon: ClipboardList,
  },
  {
    title: 'Sales Orders',
    href: '/admin/operations/sales-orders',
    icon: ShoppingCart,
  },
  {
    title: 'Warehouses',
    href: '/admin/warehouses',
    icon: Warehouse,
  },
  {
    title: 'Suppliers',
    href: '/admin/suppliers',
    icon: Truck,
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

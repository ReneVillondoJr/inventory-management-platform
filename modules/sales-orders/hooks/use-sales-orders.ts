'use client';

import { useMemo, useState } from 'react';

import { seedData } from '@/data/seed/inventory-seed';

import { salesOrderService } from '../services/sales-order-service';
import type { SalesOrderFilters, SalesOrderStatus } from '../types/sales-order';

export function useSalesOrders() {
  const [refreshKey, setRefreshKey] = useState(0);

  const [filters, setFilters] = useState<SalesOrderFilters>({
    search: '',
    customerId: 'ALL',
    warehouseId: 'ALL',
    status: 'ALL',
  });

  const orders = useMemo(() => {
    const allOrders = salesOrderService.getAll();
    const search = filters.search.trim().toLowerCase();

    return allOrders.filter((order) => {
      const matchesSearch =
        !search ||
        order.number.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.warehouseName.toLowerCase().includes(search);

      const matchesCustomer =
        filters.customerId === 'ALL' || order.customerId === filters.customerId;

      const matchesWarehouse =
        filters.warehouseId === 'ALL' ||
        order.warehouseId === filters.warehouseId;

      const matchesStatus =
        filters.status === 'ALL' || order.status === filters.status;

      return (
        matchesSearch && matchesCustomer && matchesWarehouse && matchesStatus
      );
    });
  }, [filters, refreshKey]);

  const summary = useMemo(() => {
    const allOrders = salesOrderService.getAll();

    return {
      totalOrders: allOrders.length,

      draftOrders: allOrders.filter((order) => order.status === 'DRAFT').length,

      openOrders: allOrders.filter((order) =>
        ['CONFIRMED', 'PROCESSING'].includes(order.status),
      ).length,

      completedOrders: allOrders.filter((order) => order.status === 'COMPLETED')
        .length,

      totalValue: allOrders.reduce((sum, order) => sum + order.total, 0),
    };
  }, [refreshKey]);

  const customers = useMemo(() => seedData.customers, []);

  const warehouses = useMemo(() => seedData.warehouses, []);

  const statuses: {
    value: SalesOrderStatus;
    label: string;
  }[] = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const refresh = () => {
    setRefreshKey((value) => value + 1);
  };

  const updateFilters = (values: Partial<SalesOrderFilters>) => {
    setFilters((current) => ({
      ...current,
      ...values,
    }));
  };

  return {
    orders,
    summary,
    filters,
    customers,
    warehouses,
    statuses,
    updateFilters,
    refresh,
  };
}

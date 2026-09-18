'use client';

import { useCallback, useMemo, useState } from 'react';

import { seedData } from '@/data/seed/inventory-seed';

import { purchaseOrderService } from '../services/purchase-order-service';

import type { PurchaseOrderFilters } from '../types/purchase-order';

const initialFilters: PurchaseOrderFilters = {
  search: '',
  supplierId: 'ALL',
  warehouseId: 'ALL',
  status: 'ALL',
};

export function usePurchaseOrders() {
  const [filters, setFilters] = useState<PurchaseOrderFilters>(initialFilters);

  const [refreshKey, setRefreshKey] = useState(0);

  const orders = useMemo(() => purchaseOrderService.getAll(), [refreshKey]);

  const filteredOrders = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.number.toLowerCase().includes(search) ||
        order.supplierName.toLowerCase().includes(search) ||
        order.warehouseName.toLowerCase().includes(search);

      const matchesSupplier =
        filters.supplierId === 'ALL' || order.supplierId === filters.supplierId;

      const matchesWarehouse =
        filters.warehouseId === 'ALL' ||
        order.warehouseId === filters.warehouseId;

      const matchesStatus =
        filters.status === 'ALL' || order.status === filters.status;

      return (
        matchesSearch && matchesSupplier && matchesWarehouse && matchesStatus
      );
    });
  }, [filters, orders]);

  const summary = useMemo(() => {
    const totalOrders = orders.length;

    const draftOrders = orders.filter(
      (order) => order.status === 'DRAFT',
    ).length;

    const openOrders = orders.filter(
      (order) =>
        order.status === 'APPROVED' || order.status === 'PARTIALLY_RECEIVED',
    ).length;

    const receivedOrders = orders.filter(
      (order) => order.status === 'RECEIVED',
    ).length;

    const totalValue = orders.reduce((total, order) => total + order.total, 0);

    return {
      totalOrders,
      draftOrders,
      openOrders,
      receivedOrders,
      totalValue,
    };
  }, [orders]);

  const updateFilters = useCallback((values: Partial<PurchaseOrderFilters>) => {
    setFilters((current) => ({
      ...current,
      ...values,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    orders,
    filteredOrders,
    summary,
    filters,
    suppliers: seedData.suppliers,
    warehouses: seedData.warehouses,
    products: seedData.products,
    updateFilters,
    resetFilters,
    refresh,
  };
}

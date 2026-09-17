'use client';

import { useCallback, useMemo, useState } from 'react';

import { seedData } from '@/data/seed/inventory-seed';

import { inventoryService } from '../services/inventory-service';

import type {
  InventoryFilters,
  InventoryRecord,
  InventorySummary,
} from '../types/inventory';

const initialFilters: InventoryFilters = {
  search: '',
  warehouseId: 'ALL',
  categoryId: 'ALL',
  status: 'ALL',
};

export function useInventory() {
  const [filters, setFilters] = useState<InventoryFilters>(initialFilters);

  const [refreshKey, setRefreshKey] = useState(0);

  const inventory = useMemo<InventoryRecord[]>(
    () => inventoryService.getInventoryRecords(),
    [refreshKey],
  );

  const filteredInventory = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesSearch =
        !search ||
        item.productName.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search) ||
        item.categoryName.toLowerCase().includes(search) ||
        item.brandName.toLowerCase().includes(search) ||
        item.warehouseName.toLowerCase().includes(search);

      const matchesWarehouse =
        filters.warehouseId === 'ALL' ||
        item.warehouseId === filters.warehouseId;

      const matchesCategory =
        filters.categoryId === 'ALL' || item.categoryId === filters.categoryId;

      const matchesStatus =
        filters.status === 'ALL' || item.status === filters.status;

      return (
        matchesSearch && matchesWarehouse && matchesCategory && matchesStatus
      );
    });
  }, [filters, inventory]);

  const summary = useMemo<InventorySummary>(() => {
    const totalProducts = new Set(inventory.map((item) => item.productId)).size;

    const totalUnits = inventory.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const totalAvailableUnits = inventory.reduce(
      (total, item) => total + item.availableQuantity,
      0,
    );

    const totalInventoryValue = inventory.reduce(
      (total, item) => total + item.inventoryValue,
      0,
    );

    const lowStockItems = inventory.filter(
      (item) => item.status === 'LOW_STOCK',
    ).length;

    const outOfStockItems = inventory.filter(
      (item) => item.status === 'OUT_OF_STOCK',
    ).length;

    const warehouseCount = new Set(inventory.map((item) => item.warehouseId))
      .size;

    return {
      totalProducts,
      totalUnits,
      totalAvailableUnits,
      totalInventoryValue,
      lowStockItems,
      outOfStockItems,
      warehouseCount,
    };
  }, [inventory]);

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  const updateFilters = useCallback((values: Partial<InventoryFilters>) => {
    setFilters((current) => ({
      ...current,
      ...values,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    inventory,
    filteredInventory,
    summary,
    filters,
    updateFilters,
    resetFilters,
    refresh,
    products: seedData.products,
    warehouses: seedData.warehouses,
    categories: seedData.categories,
  };
}

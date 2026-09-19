'use client';

import { useState } from 'react';

import { seedData } from '@/data/seed/inventory-seed';

import { warehouseService } from '../services/warehouse-service';
import type { Warehouse, WarehouseFormValues } from '../types/warehouse';

const DEFAULT_MANAGER_ID =
  seedData.warehouses[0]?.managerId ?? seedData.users[0]?.id ?? '';

type UseWarehouseFormOptions = {
  warehouse?: Warehouse;
  onSuccess?: (warehouse: Warehouse) => void;
  onError?: (message: string) => void;
};

export function useWarehouseForm({
  warehouse,
  onSuccess,
  onError,
}: UseWarehouseFormOptions = {}) {
  const [values, setValues] = useState<WarehouseFormValues>({
    code: warehouse?.code ?? '',
    name: warehouse?.name ?? '',
    address: warehouse?.address ?? '',
    managerId: warehouse?.managerId ?? DEFAULT_MANAGER_ID,
    status: warehouse?.status ?? 'ACTIVE',
  });

  const [isSaving, setIsSaving] = useState(false);

  const update = <K extends keyof WarehouseFormValues>(
    field: K,
    value: WarehouseFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const save = async () => {
    setIsSaving(true);

    try {
      const savedWarehouse =
        warehouse ?
          warehouseService.update(warehouse.id, values)
        : warehouseService.create(values);

      onSuccess?.(savedWarehouse);

      return savedWarehouse;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save warehouse.';

      onError?.(message);

      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    values,
    setValues,
    isSaving,
    update,
    save,
  };
}

'use client';

import { useState } from 'react';

import { supplierService } from '../services/supplier-service';
import type { Supplier, SupplierFormValues } from '../types/supplier';

type UseSupplierFormOptions = {
  supplier?: Supplier;
  onSuccess?: (supplier: Supplier) => void;
  onError?: (message: string) => void;
};

export function useSupplierForm({
  supplier,
  onSuccess,
  onError,
}: UseSupplierFormOptions = {}) {
  const [values, setValues] = useState<SupplierFormValues>({
    code: supplier?.code ?? '',
    name: supplier?.name ?? '',
    contactName: supplier?.contactName ?? '',
    email: supplier?.email ?? '',
    phone: supplier?.phone ?? '',
    address: supplier?.address ?? '',
    status: supplier?.status ?? 'ACTIVE',
  });

  const [isSaving, setIsSaving] = useState(false);

  const update = <K extends keyof SupplierFormValues>(
    field: K,
    value: SupplierFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const save = async () => {
    setIsSaving(true);

    try {
      const savedSupplier =
        supplier ?
          supplierService.update(supplier.id, values)
        : supplierService.create(values);

      onSuccess?.(savedSupplier);

      return savedSupplier;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save supplier.';

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

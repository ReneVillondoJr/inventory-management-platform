'use client';

import { useState } from 'react';

import { salesOrderService } from '../services/sales-order-service';
import type { SalesOrder, SalesOrderFormValues } from '../types/sales-order';

const DEFAULT_ORDER_DATE = new Date().toISOString().slice(0, 10);

type UseSalesOrderFormOptions = {
  salesOrder?: SalesOrder;
  onSuccess?: (salesOrder: SalesOrder) => void;
  onError?: (message: string) => void;
};

export function useSalesOrderForm({
  salesOrder,
  onSuccess,
  onError,
}: UseSalesOrderFormOptions = {}) {
  const [values, setValues] = useState<SalesOrderFormValues>({
    customerId: salesOrder?.customerId ?? '',
    warehouseId: salesOrder?.warehouseId ?? '',
    orderDate: salesOrder?.orderDate ?? DEFAULT_ORDER_DATE,
    status: salesOrder?.status ?? 'DRAFT',
    notes: salesOrder?.notes ?? '',
    items:
      salesOrder?.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })) ?? [],
  });

  const [isSaving, setIsSaving] = useState(false);

  const update = <K extends keyof SalesOrderFormValues>(
    field: K,
    value: SalesOrderFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const save = async () => {
    setIsSaving(true);

    try {
      const savedOrder =
        salesOrder ?
          salesOrderService.update(salesOrder.id, values)
        : salesOrderService.create(values, 'user_julia');

      onSuccess?.(savedOrder);

      return savedOrder;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save sales order.';

      onError?.(message);

      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    values,
    isSaving,
    update,
    setValues,
    save,
  };
}

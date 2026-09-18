'use client';

import { useCallback, useState } from 'react';

import { purchaseOrderService } from '../services/purchase-order-service';

import type {
  PurchaseOrder,
  PurchaseOrderFormValues,
} from '../types/purchase-order';

type UsePurchaseOrderFormOptions = {
  purchaseOrder?: PurchaseOrder | null;
  onSuccess?: (purchaseOrder: PurchaseOrder) => void;
};

export function usePurchaseOrderForm({
  purchaseOrder,
  onSuccess,
}: UsePurchaseOrderFormOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const save = useCallback(
    async (values: PurchaseOrderFormValues) => {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      try {
        const result =
          purchaseOrder ?
            purchaseOrderService.update(purchaseOrder.id, values)
          : purchaseOrderService.create(values, 'user_maria');

        if (!result) {
          throw new Error('Unable to save purchase order.');
        }

        setSuccess(
          purchaseOrder ?
            'Purchase order updated successfully.'
          : 'Purchase order created successfully.',
        );

        onSuccess?.(result);

        return result;
      } catch (error) {
        const message =
          error instanceof Error ?
            error.message
          : 'Unable to save purchase order.';

        setError(message);

        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess, purchaseOrder],
  );

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  return {
    isSubmitting,
    error,
    success,
    save,
    clearMessages,
  };
}

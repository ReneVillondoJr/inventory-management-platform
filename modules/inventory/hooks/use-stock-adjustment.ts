'use client';

import { useState } from 'react';

import { inventoryService } from '../services/inventory-service';

import type { StockAdjustmentInput } from '../types/inventory';

export function useStockAdjustment() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitAdjustment = async (input: StockAdjustmentInput) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = inventoryService.adjustStock(input);

      setSuccess(
        `Stock updated successfully. New quantity: ${result.newQuantity}.`,
      );

      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to update stock.';

      setError(message);

      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
    isSubmitting,
    error,
    success,
    submitAdjustment,
    clearMessages,
  };
}

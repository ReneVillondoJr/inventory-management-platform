'use client';

import { useState } from 'react';

import { transferService } from '../services/transfer-service';

import type { StockTransferInput } from '../types/inventory';

export function useStockTransfer() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitTransfer = async (input: StockTransferInput) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = transferService.createTransfer(input);

      setSuccess(`Transfer ${result.transferId} completed successfully.`);

      return result;
    } catch (error) {
      const message =
        error instanceof Error ?
          error.message
        : 'Unable to complete stock transfer.';

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
    submitTransfer,
    clearMessages,
  };
}

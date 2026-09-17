'use client';

import { useCallback, useState } from 'react';

import { productService } from '../services/product-service';

import type { Product, ProductFormValues } from '../types/product';

type UseProductFormOptions = {
  product?: Product | null;
  onSuccess?: (product: Product) => void;
};

export function useProductForm({
  product,
  onSuccess,
}: UseProductFormOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const save = useCallback(
    async (values: ProductFormValues) => {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      try {
        const savedProduct =
          product ?
            productService.update(product.id, values)
          : productService.create(values);

        setSuccess(
          product ?
            'Product updated successfully.'
          : 'Product created successfully.',
        );

        onSuccess?.(savedProduct);

        return savedProduct;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to save product.';

        setError(message);

        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess, product],
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

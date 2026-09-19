'use client';

import { useState } from 'react';

import { customerService } from '../services/customer-service';

import type { Customer, CustomerFormValues } from '../types/customer';

type UseCustomerFormOptions = {
  customer?: Customer;
  onSuccess?: (customer: Customer) => void;
  onError?: (message: string) => void;
};

export function useCustomerForm({
  customer,
  onSuccess,
  onError,
}: UseCustomerFormOptions = {}) {
  const [values, setValues] = useState<CustomerFormValues>({
    code: customer?.code ?? '',
    name: customer?.name ?? '',
    contactName: customer?.contactName ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    address: customer?.address ?? '',
    status: customer?.status ?? 'ACTIVE',
  });

  const [isSaving, setIsSaving] = useState(false);

  const update = <K extends keyof CustomerFormValues>(
    field: K,
    value: CustomerFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const save = async () => {
    setIsSaving(true);

    try {
      const savedCustomer =
        customer ?
          customerService.update(customer.id, values)
        : customerService.create(values);

      onSuccess?.(savedCustomer);

      return savedCustomer;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save customer.';

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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { LoginFormValues } from '@/types/auth';

export function useLogin() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const login = async (values: LoginFormValues) => {
    setError('');
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      void values;
      router.push('/admin/dashboard');
    } catch {
      setError('Unable to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    login,
    clearError: () => setError(''),
  };
}

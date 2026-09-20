'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { authenticateTestUser } from '@/data/seed/test-auth';
import { startTestSession } from '@/lib/rbac';
import type { LoginFormValues } from '@/types/auth';

export function useLogin() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const login = async (values: LoginFormValues) => {
    setError('');
    setIsSubmitting(true);

    try {
      const user = authenticateTestUser(values.email, values.password);

      if (!user) {
        setError('Use an active seeded email and the temporary test password.');
        return;
      }

      startTestSession(user.role);
      router.replace('/admin/dashboard');
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

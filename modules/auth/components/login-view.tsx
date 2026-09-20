'use client';

import { useEffect, useState } from 'react';

import { LoginBrand } from './login-brand';
import { LoginForm } from './login-form';
import { LoginStatus } from './login-status';
import {
  TEMPORARY_TEST_EMAIL,
  TEMPORARY_TEST_PASSWORD,
} from '@/data/seed/test-auth';

export function LoginView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 60);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0f11] px-4 py-12'>
      <div className='login-grid pointer-events-none absolute inset-0' />

      <div className='pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#e2a23c]/[0.06] blur-3xl' />

      <section
        className={[
          'login-reveal relative w-full max-w-md overflow-hidden rounded-lg',
          'border border-[#262b2f] bg-[#15181b]',
          'shadow-[0_30px_80px_rgba(0,0,0,0.5)]',
          'transition-all duration-700',
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-2.5 opacity-0',
        ].join(' ')}
      >
        <div className='flex items-center gap-2 border-b border-[#262b2f] bg-[#1c2023] px-4 py-2.5'>
          <span className='size-2 rounded-full bg-[#e0645a]' />
          <span className='size-2 rounded-full bg-[#e2a23c]' />
          <span className='size-2 rounded-full bg-[#4c9a6a]' />

          <span className='font-mono-ui ml-2 text-[11px] text-[#868c91]'>
            auth.sys — secure login
          </span>
        </div>

        <div className='px-7 py-8 sm:px-9'>
          <LoginBrand />
          <LoginForm />

          <p className='font-mono-ui mt-4 rounded-md border border-[#262b2f] bg-[#101315] px-3 py-2 text-[10px] leading-5 text-[#a7abaf]'>
            Temporary test login: any active seeded user email with password
            <span className='ml-1 text-[#e2a23c]'>{TEMPORARY_TEST_EMAIL}</span>
            <span className='mx-1 text-[#5f666b]'>/</span>
            <span className='text-[#e2a23c]'>{TEMPORARY_TEST_PASSWORD}</span>
          </p>

          <p className='font-sans-ui mt-6 text-center text-[12px] text-[#868c91]'>
            Need access? Contact your system administrator.
          </p>
        </div>

        <LoginStatus />
      </section>
    </main>
  );
}

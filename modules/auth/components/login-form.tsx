'use client';

import { useState, type FormEvent } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { loginSchema } from '../schemas/login-schema';
import { useLogin } from '@/hooks/use-login';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { isSubmitting, error, login } = useLogin();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      setValidationError(
        result.error.issues[0]?.message ?? 'Please check your credentials.',
      );
      return;
    }

    setValidationError('');
    await login(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className='mt-7 space-y-4'>
      <div>
        <label
          htmlFor='email'
          className='font-mono-ui text-[11px] text-[#a7abaf]'
        >
          Email
        </label>

        <div className='relative mt-1.5'>
          <span className='font-mono-ui pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#e2a23c]'>
            &gt;
          </span>

          <input
            id='email'
            type='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder='admin@inventory.io'
            autoComplete='email'
            className='font-mono-ui w-full rounded-md border border-[#262b2f] bg-[#101315] py-2.5 pl-7 pr-3 text-[13px] text-[#eef0ee] outline-none transition-colors placeholder:text-[#565b5f] focus:border-[#e2a23c]'
          />
        </div>
      </div>

      <div>
        <label
          htmlFor='password'
          className='font-mono-ui text-[11px] text-[#a7abaf]'
        >
          Password
        </label>

        <div className='relative mt-1.5'>
          <span className='font-mono-ui pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#e2a23c]'>
            &gt;
          </span>

          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder='••••••••'
            autoComplete='current-password'
            className='font-mono-ui w-full rounded-md border border-[#262b2f] bg-[#101315] py-2.5 pl-7 pr-9 text-[13px] text-[#eef0ee] outline-none transition-colors placeholder:text-[#565b5f] focus:border-[#e2a23c]'
          />

          <button
            type='button'
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[#868c91] transition-colors hover:text-[#eef0ee]'
          >
            {showPassword ?
              <EyeOff className='size-4' />
            : <Eye className='size-4' />}
          </button>
        </div>
      </div>

      {(validationError || error) && (
        <p className='font-sans-ui text-[12px] text-[#e0645a]'>
          {validationError || error}
        </p>
      )}

      <button
        type='submit'
        disabled={isSubmitting}
        className='mt-2 flex h-11 w-full items-center justify-center rounded-md bg-[#e2a23c] font-mono-ui text-[13px] font-semibold text-[#15181b] transition-colors hover:bg-[#eeb457] disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isSubmitting ? 'Authenticating…' : 'Sign in'}
      </button>
    </form>
  );
}

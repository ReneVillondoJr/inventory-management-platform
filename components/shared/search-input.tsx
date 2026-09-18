'use client';

import type { InputHTMLAttributes } from 'react';

import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  onClear?: () => void;
};

export function SearchInput({
  value,
  onClear,
  onChange,
  placeholder = 'Search...',
  className,
  ...props
}: SearchInputProps) {
  const hasValue = typeof value === 'string' && value.length > 0;

  return (
    <div className='relative'>
      <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

      <Input
        {...props}
        type='search'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-9 w-full border-border/60 pl-9 shadow-none ${
          hasValue && onClear ? 'pr-9' : ''
        } ${className ?? ''}`}
      />

      {hasValue && onClear && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground hover:text-foreground'
          onClick={onClear}
        >
          <X className='size-3.5' />

          <span className='sr-only'>Clear search</span>
        </Button>
      )}
    </div>
  );
}

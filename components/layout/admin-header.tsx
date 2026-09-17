'use client';

import Link from 'next/link';
import { Bell, ChevronDown, CircleHelp, Search } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AdminHeader() {
  return (
    <header className='flex h-16 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur md:px-6'>
      <div className='flex min-w-0 items-center gap-4'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold tracking-tight text-foreground'>
            Inventory Operations
          </p>

          <p className='truncate text-[11px] text-muted-foreground'>
            Management workspace
          </p>
        </div>

        <div className='relative hidden flex-1 max-w-md md:block'>
          <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

          <Input
            placeholder='Search products, orders, customers...'
            className='h-9 border-border/60 bg-muted/40 pl-9 shadow-none focus-visible:ring-1'
          />
        </div>
      </div>

      {/* Right */}
      <div className='flex items-center gap-1'>
        <Button
          variant='ghost'
          size='icon-sm'
          aria-label='Search'
          className='text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden'
        >
          <Search className='size-4' />
        </Button>

        <Button
          variant='ghost'
          size='icon-sm'
          aria-label='Help and support'
          className='text-muted-foreground hover:bg-muted hover:text-foreground'
        >
          <CircleHelp className='size-4' />
        </Button>

        <Button
          variant='ghost'
          size='icon-sm'
          aria-label='Notifications'
          className='relative text-muted-foreground hover:bg-muted hover:text-foreground'
        >
          <Bell className='size-4' />

          <span className='absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive' />
        </Button>

        <div className='ml-1 h-6 w-px bg-border' />

        <Link
          href='/admin/settings/profile'
          className='flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted/70'
        >
          <Avatar className='size-8'>
            <AvatarFallback className='bg-primary text-[11px] font-semibold text-primary-foreground'>
              AD
            </AvatarFallback>
          </Avatar>

          <div className='hidden min-w-0 text-left sm:block'>
            <p className='truncate text-xs font-semibold text-foreground'>
              Admin
            </p>

            <p className='truncate text-[11px] text-muted-foreground'>
              Administrator
            </p>
          </div>

          <ChevronDown className='hidden size-3.5 text-muted-foreground sm:block' />
        </Link>
      </div>
    </header>
  );
}

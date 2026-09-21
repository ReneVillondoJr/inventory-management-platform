'use client';

import Link from 'next/link';
import { NotificationBell } from '@/modules/notifications/components/notification-bell';
import { useRouter } from 'next/navigation';

import {
  Bell,
  ChevronDown,
  CircleHelp,
  LogOut,
  Search,
  Settings2,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { clearTestSession } from '@/lib/rbac';
import { HelpMenu } from '@/modules/help';

export function AdminHeader() {
  const router = useRouter();

  const handleSignOut = () => {
    clearTestSession();
    router.replace('/login');
    router.refresh();
  };

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

        <div className='relative hidden max-w-md flex-1 md:block'>
          <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

          <Input
            placeholder='Search products, orders, customers...'
            className='h-9 border-border/60 bg-muted/40 pl-9 shadow-none focus-visible:ring-1'
          />
        </div>
      </div>

      <div className='flex items-center gap-1'>
        <Button
          variant='ghost'
          size='icon-sm'
          aria-label='Search'
          className='text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden'
        >
          <Search className='size-4' />
        </Button>

        <HelpMenu />

        <NotificationBell />

        <div className='ml-2 h-6 w-px bg-border' />

        <DropdownMenu>
          <DropdownMenuTrigger className='ml-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
            <Avatar className='size-8'>
              <AvatarFallback className='bg-primary text-[11px] font-semibold text-primary-foreground'>
                AD
              </AvatarFallback>
            </Avatar>

            <div className='hidden min-w-0 sm:block'>
              <p className='truncate text-xs font-semibold text-foreground'>
                Admin
              </p>

              <p className='truncate text-[11px] text-muted-foreground'>
                Administrator
              </p>
            </div>

            <ChevronDown className='hidden size-3.5 text-muted-foreground sm:block' />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align='end'
            sideOffset={10}
            className='w-64 rounded-xl border-border/70 bg-popover p-1.5 shadow-xl'
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className='px-2.5 py-2.5 font-normal'>
                <div className='flex items-center gap-3'>
                  <Avatar className='size-10 shrink-0'>
                    <AvatarFallback className='bg-primary text-xs font-semibold text-primary-foreground'>
                      AD
                    </AvatarFallback>
                  </Avatar>

                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-foreground'>
                      Admin
                    </p>

                    <p className='truncate text-xs text-muted-foreground'>
                      Administrator
                    </p>

                    <p className='mt-0.5 truncate text-[10px] text-muted-foreground/80'>
                      admin@example.com
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className='my-1.5' />

            <DropdownMenuGroup className='space-y-0.5'>
              <DropdownMenuItem className='rounded-lg px-2.5 py-2 focus:bg-muted'>
                <Link
                  href='/admin/settings/profile'
                  className='flex w-full items-center gap-2.5'
                >
                  <UserRound className='size-4 text-muted-foreground' />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className='rounded-lg px-2.5 py-2 focus:bg-muted'>
                <Link
                  href='/admin/settings/notifications'
                  className='flex w-full items-center gap-2.5'
                >
                  <Bell className='size-4 text-muted-foreground' />
                  <span>Notifications</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className='rounded-lg px-2.5 py-2 focus:bg-muted'>
                <Link
                  href='/admin/settings/security'
                  className='flex w-full items-center gap-2.5'
                >
                  <ShieldCheck className='size-4 text-muted-foreground' />
                  <span>Security</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className='rounded-lg px-2.5 py-2 focus:bg-muted'>
                <Link
                  href='/admin/settings/system'
                  className='flex w-full items-center gap-2.5'
                >
                  <Settings2 className='size-4 text-muted-foreground' />
                  <span>System</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className='my-1.5' />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className='rounded-lg px-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive'
                onClick={handleSignOut}
              >
                <LogOut className='size-4' />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

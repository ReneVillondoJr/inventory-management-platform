'use client';

import { useRouter } from 'next/navigation';

import { ChevronRight } from 'lucide-react';

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import type { HelpNavigationItem } from '../types/help';

type HelpDropdownProps = {
  navigation: HelpNavigationItem[];
};

export function HelpDropdown({ navigation }: HelpDropdownProps) {
  const router = useRouter();

  return (
    <div className='w-full'>
      <DropdownMenuGroup>
        <DropdownMenuLabel className='px-3 py-3 font-normal'>
          <div>
            <p className='text-sm font-semibold text-foreground'>
              Help & Support
            </p>

            <p className='mt-0.5 text-xs leading-5 text-muted-foreground'>
              Get help with Inventory Operations.
            </p>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup className='space-y-0.5 p-1'>
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.href}
              onSelect={() => router.push(item.href)}
              className='rounded-lg px-2.5 py-2.5 focus:bg-muted'
            >
              <div className='flex w-full items-center gap-3'>
                <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted'>
                  <Icon className='size-4 text-muted-foreground' />
                </div>

                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium text-foreground'>
                    {item.title}
                  </p>

                  <p className='mt-0.5 truncate text-[11px] text-muted-foreground'>
                    {item.description}
                  </p>
                </div>

                <ChevronRight className='size-4 shrink-0 text-muted-foreground' />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuGroup>
    </div>
  );
}

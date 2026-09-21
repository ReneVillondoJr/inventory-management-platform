'use client';

import { CircleHelp } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { helpNavigation } from '../data/help-navigation';

import { HelpDropdown } from './help-dropdown';

export function HelpMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='Help and support'
        className='flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      >
        <CircleHelp className='size-4' />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='w-80 overflow-hidden rounded-xl border-border/70 p-0 shadow-xl'
      >
        <HelpDropdown navigation={helpNavigation} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

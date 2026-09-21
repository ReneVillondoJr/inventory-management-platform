'use client';

import { useRouter } from 'next/navigation';

import {
  BookOpen,
  CircleAlert,
  Info,
  Keyboard,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { helpNavigation } from '../data/help-navigation';

const iconMap: Record<string, LucideIcon> = {
  '/admin/help/documentation': BookOpen,
  '/admin/help/shortcuts': Keyboard,
  '/admin/help/support': LifeBuoy,
  '/admin/help/report': CircleAlert,
  '/admin/help/about': Info,
};

export function HelpPage() {
  const router = useRouter();

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Administration
        </p>

        <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
          Help & Support
        </h1>

        <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
          Access documentation, support resources, shortcuts, and system
          information.
        </p>
      </div>

      <div className='grid gap-3 sm:grid-cols-2'>
        {helpNavigation.map((item) => {
          const Icon = iconMap[item.href] ?? Info;

          return (
            <button
              key={item.href}
              type='button'
              onClick={() => router.push(item.href)}
              className='group flex items-start gap-4 rounded-xl border border-border/60 bg-card p-4 text-left transition-colors hover:bg-muted/40'
            >
              <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted'>
                <Icon className='size-5 text-muted-foreground transition-colors group-hover:text-foreground' />
              </div>

              <div className='min-w-0'>
                <p className='text-sm font-semibold text-foreground'>
                  {item.title}
                </p>

                <p className='mt-1 text-sm leading-5 text-muted-foreground'>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

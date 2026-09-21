'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import type { SettingsNavigationItem } from '@/modules/settings/components/settings-navigation';

type SettingsLayoutProps = {
  navigation: SettingsNavigationItem[];
  children: ReactNode;
};

export function SettingsLayout({ navigation, children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className='grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]'>
      <aside className='h-fit'>
        <div className='mb-3'>
          <p className='text-sm font-semibold'>Settings</p>

          <p className='mt-1 text-xs text-muted-foreground'>
            Manage your workspace preferences.
          </p>
        </div>

        <nav aria-label='Settings navigation' className='space-y-1'>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                  active ?
                    'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                ].join(' ')}
              >
                <Icon className='size-4 shrink-0' />

                <span className='min-w-0'>
                  <span
                    className={[
                      'block text-sm font-medium',
                      active ? 'text-foreground' : '',
                    ].join(' ')}
                  >
                    {item.title}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className='min-w-0'>{children}</section>
    </div>
  );
}

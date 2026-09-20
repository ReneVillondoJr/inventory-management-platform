'use client';

import { Bell, Monitor, Settings2, Shield, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';

import { settingsSections, type SettingsSection } from '../types/settings';

const sectionIcons: Record<SettingsSection, typeof Settings2> = {
  general: Settings2,
  profile: UserRound,
  notifications: Bell,
  security: Shield,
  system: Monitor,
};

type SettingsLayoutProps = {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  children: React.ReactNode;
};

export function SettingsLayout({
  activeSection,
  onSectionChange,
  children,
}: SettingsLayoutProps) {
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
          {settingsSections.map((section) => {
            const Icon = sectionIcons[section.id];
            const active = activeSection === section.id;

            return (
              <button
                key={section.id}
                type='button'
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                  active ?
                    'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
              >
                <Icon className='size-4 shrink-0' />

                <span className='min-w-0'>
                  <span
                    className={cn(
                      'block text-sm font-medium',
                      active && 'text-foreground',
                    )}
                  >
                    {section.label}
                  </span>

                  <span className='mt-0.5 block truncate text-[11px] text-muted-foreground'>
                    {section.description}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className='min-w-0'>{children}</section>
    </div>
  );
}

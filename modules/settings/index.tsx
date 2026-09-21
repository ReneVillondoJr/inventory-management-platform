'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { canEditModule, type RoleName } from '@/lib/auth/permissions';
import { getStoredRole } from '@/lib/rbac';

import { SettingsLayout } from './components/settings-layout';
import { settingsNavigation } from './components/settings-navigation';
import { useSettings } from './hooks/use-settings';

type SettingsPageProps = {
  children: ReactNode;
};

export function SettingsPage({ children }: SettingsPageProps) {
  const [role, setRole] = useState<RoleName>('SUPER_ADMIN');

  const { isSaving, resetSettings } = useSettings();

  const canEditSettings = canEditModule(role, 'settings');

  useEffect(() => {
    const syncRole = () => {
      setRole(getStoredRole());
    };

    syncRole();

    window.addEventListener('inventory-role-change', syncRole);
    window.addEventListener('storage', syncRole);

    return () => {
      window.removeEventListener('inventory-role-change', syncRole);
      window.removeEventListener('storage', syncRole);
    };
  }, []);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
            Administration
          </p>

          <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
            Settings
          </h1>

          <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
            Manage your account, application preferences, notifications,
            security, and system behavior.
          </p>
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={resetSettings}
          disabled={isSaving || !canEditSettings}
          className='shrink-0'
        >
          <RotateCcw className='size-4' />
          Reset settings
        </Button>
      </div>

      <SettingsLayout navigation={settingsNavigation}>
        {!canEditSettings && (
          <p className='mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300'>
            Your role has view-only access to settings.
          </p>
        )}

        <fieldset disabled={!canEditSettings}>{children}</fieldset>
      </SettingsLayout>
    </div>
  );
}

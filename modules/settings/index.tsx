'use client';

import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { canEditModule, type RoleName } from '@/lib/auth/permissions';
import { getStoredRole } from '@/lib/rbac';

import { GeneralSettings } from './components/general-settings';
import { NotificationSettings } from './components/notification-settings';
import { ProfileSettings } from './components/profile-settings';
import { SecuritySettings } from './components/security-settings';
import { SettingsLayout } from './components/settings-layout';
import { SystemSettings } from './components/system-settings';
import { useSettings } from './hooks/use-settings';
import type { SettingsSection } from './types/settings';

export function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>('general');
  const [role, setRole] = useState<RoleName>('SUPER_ADMIN');

  const { settings, isSaving, saved, updateSection, resetSettings } =
    useSettings();
  const canEditSettings = canEditModule(role, 'settings');

  useEffect(() => {
    const syncRole = () => setRole(getStoredRole());

    syncRole();
    window.addEventListener('inventory-role-change', syncRole);
    window.addEventListener('storage', syncRole);

    return () => {
      window.removeEventListener('inventory-role-change', syncRole);
      window.removeEventListener('storage', syncRole);
    };
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <GeneralSettings
            settings={settings.general}
            onSave={(values) => updateSection('general', values)}
            isSaving={isSaving}
            saved={saved}
          />
        );

      case 'profile':
        return (
          <ProfileSettings
            settings={settings.profile}
            onSave={(values) => updateSection('profile', values)}
            isSaving={isSaving}
            saved={saved}
          />
        );

      case 'notifications':
        return (
          <NotificationSettings
            settings={settings.notifications}
            onSave={(values) => updateSection('notifications', values)}
            isSaving={isSaving}
            saved={saved}
          />
        );

      case 'security':
        return (
          <SecuritySettings
            settings={settings.security}
            onSave={(values) => updateSection('security', values)}
            isSaving={isSaving}
            saved={saved}
          />
        );

      case 'system':
        return (
          <SystemSettings
            settings={settings.system}
            onSave={(values) => updateSection('system', values)}
            isSaving={isSaving}
            saved={saved}
          />
        );

      default:
        return null;
    }
  };

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

      <SettingsLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        {!canEditSettings && (
          <p className='mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300'>
            Your role has view-only access to settings.
          </p>
        )}
        <fieldset disabled={!canEditSettings}>{renderSection()}</fieldset>
      </SettingsLayout>
    </div>
  );
}

'use client';

import { SystemSettings } from '@/modules/settings/components/system-settings';
import { SettingsPage } from '@/modules/settings';
import { useSettings } from '@/modules/settings/hooks/use-settings';

export default function SystemSettingsPage() {
  const { settings, isSaving, saved, updateSection } = useSettings();

  return (
    <SettingsPage>
      <SystemSettings
        settings={settings.system}
        onSave={(values) => updateSection('system', values)}
        isSaving={isSaving}
        saved={saved}
      />
    </SettingsPage>
  );
}
